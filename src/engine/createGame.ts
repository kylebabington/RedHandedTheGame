import {
  validateSaveAgainstCase,
  type SaveValidationError,
} from './persistence/validateSave'
import type { KeyValueStorage } from './persistence/storage'
import { EngineError } from './rules/errors'
import { isUnlocked } from './rules/unlocks'
import type { CaseDefinition, RevealStep } from './schemas/case'
import {
  createInitialState,
  type GameState,
} from './schemas/gameState'
import type { PuzzleAnswer } from './schemas/puzzle'
import type { SaveEnvelope, VerdictAnswers } from './schemas/save'
import { calculateScore, type ScoreResult } from './scoring/calculateScore'

export type LoadSaveResult =
  | { ok: true; state: GameState }
  | { ok: false; errors: SaveValidationError[]; state: GameState }

export type GameEngine = {
  getCase: () => CaseDefinition
  getState: () => GameState
  getVerdictAnswers: () => VerdictAnswers | undefined
  discoverEvidence: (evidenceId: string) => GameState
  inspectEvidence: (evidenceId: string) => GameState
  completePuzzle: (puzzleId: string, answer: PuzzleAnswer) => GameState
  completeDialogue: (dialogueId: string) => GameState
  addConnection: (connectionId: string) => GameState
  removeConnection: (connectionId: string) => GameState
  setTimelineOrder: (order: string[]) => GameState
  submitVerdict: (answers: VerdictAnswers) => GameState
  /** True when final-act requirements and an accepted verdict are both satisfied. */
  isComplete: () => boolean
  /** Reveal steps only after case completion; otherwise null. */
  getReveal: () => RevealStep[] | null
  calculateScore: (answers?: VerdictAnswers) => ScoreResult
  serialize: () => SaveEnvelope
  loadSave: (raw: unknown) => LoadSaveResult
  saveToStorage: (storage: KeyValueStorage, key: string) => void
  loadFromStorage: (storage: KeyValueStorage, key: string) => LoadSaveResult
}

function cloneState(state: GameState): GameState {
  return {
    schemaVersion: state.schemaVersion,
    caseId: state.caseId,
    currentAct: state.currentAct,
    discoveredEvidence: [...state.discoveredEvidence],
    inspectedEvidence: [...state.inspectedEvidence],
    completedPuzzles: [...state.completedPuzzles],
    unlockedDialogue: [...state.unlockedDialogue],
    completedDialogue: [...state.completedDialogue],
    evidenceConnections: [...state.evidenceConnections],
    timelineOrder: [...state.timelineOrder],
    verdictSubmitted: state.verdictSubmitted,
  }
}

function answersEqual(
  expected: string | string[] | Record<string, string>,
  actual: PuzzleAnswer,
): boolean {
  if (typeof expected === 'string') {
    return typeof actual === 'string' && actual === expected
  }
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual) || actual.length !== expected.length) {
      return false
    }
    return expected.every((value, index) => value === actual[index])
  }
  if (typeof actual !== 'object' || actual === null || Array.isArray(actual)) {
    return false
  }
  const expectedKeys = Object.keys(expected)
  const actualKeys = Object.keys(actual)
  if (expectedKeys.length !== actualKeys.length) {
    return false
  }
  return expectedKeys.every((key) => expected[key] === actual[key])
}

function uniquePush(list: string[], id: string): string[] {
  return list.includes(id) ? list : [...list, id]
}

/**
 * When the final act's completeWhen passes, currentAct remains on the final
 * act number (never advances past the last defined act).
 */
function advanceActsIfReady(
  caseDef: CaseDefinition,
  state: GameState,
): GameState {
  let next = state
  const maxAct = caseDef.acts.length

  while (next.currentAct <= maxAct) {
    const act = caseDef.acts.find((item) => item.number === next.currentAct)
    if (!act) {
      break
    }
    if (!isUnlocked(act.completeWhen, next)) {
      break
    }
    if (next.currentAct >= maxAct) {
      // Final act complete: remain on final act.
      break
    }
    next = { ...next, currentAct: next.currentAct + 1 }
  }

  return next
}

function refreshDialogueUnlocks(
  caseDef: CaseDefinition,
  state: GameState,
): GameState {
  let unlockedDialogue = [...state.unlockedDialogue]
  for (const dialogue of caseDef.dialogue) {
    if (
      !unlockedDialogue.includes(dialogue.id) &&
      isUnlocked(dialogue.unlock, state)
    ) {
      unlockedDialogue = uniquePush(unlockedDialogue, dialogue.id)
    }
  }
  return { ...state, unlockedDialogue }
}

function applyProgression(
  caseDef: CaseDefinition,
  state: GameState,
): GameState {
  let next = refreshDialogueUnlocks(caseDef, state)
  next = advanceActsIfReady(caseDef, next)
  // Re-check dialogue after act advance (actAtLeast unlocks).
  next = refreshDialogueUnlocks(caseDef, next)
  return next
}

function isFinalActSatisfied(
  caseDef: CaseDefinition,
  state: GameState,
): boolean {
  const finalAct = caseDef.acts[caseDef.acts.length - 1]
  if (!finalAct) return false
  if (state.currentAct < finalAct.number) return false
  return isUnlocked(finalAct.completeWhen, state)
}

function isVerdictPrerequisiteMet(
  caseDef: CaseDefinition,
  state: GameState,
): boolean {
  if (!caseDef.verdictPrerequisite) return true
  return isUnlocked(caseDef.verdictPrerequisite, state)
}

function isCaseComplete(caseDef: CaseDefinition, state: GameState): boolean {
  return (
    state.verdictSubmitted &&
    isFinalActSatisfied(caseDef, state) &&
    isVerdictPrerequisiteMet(caseDef, state)
  )
}

export function createGame(caseDef: CaseDefinition): GameEngine {
  let state = applyProgression(caseDef, createInitialState(caseDef.id))
  let verdictAnswers: VerdictAnswers | undefined

  const commit = (next: GameState): GameState => {
    state = applyProgression(caseDef, next)
    return cloneState(state)
  }

  const requireEvidence = (evidenceId: string) => {
    const evidence = caseDef.evidence.find((item) => item.id === evidenceId)
    if (!evidence) {
      throw new EngineError(
        'NOT_FOUND',
        `Unknown evidence id "${evidenceId}"`,
        'evidenceId',
      )
    }
    return evidence
  }

  const engine: GameEngine = {
    getCase: () => caseDef,
    getState: () => cloneState(state),
    getVerdictAnswers: () =>
      verdictAnswers ? { ...verdictAnswers } : undefined,

    discoverEvidence(evidenceId) {
      const snapshot = cloneState(state)
      try {
        const evidence = requireEvidence(evidenceId)
        if (!isUnlocked(evidence.unlock, state)) {
          throw new EngineError(
            'LOCKED',
            `Evidence "${evidenceId}" is locked`,
            'evidence.unlock',
          )
        }
        if (state.discoveredEvidence.includes(evidenceId)) {
          return cloneState(state)
        }
        return commit({
          ...state,
          discoveredEvidence: uniquePush(state.discoveredEvidence, evidenceId),
        })
      } catch (error) {
        state = snapshot
        throw error
      }
    },

    inspectEvidence(evidenceId) {
      const snapshot = cloneState(state)
      try {
        requireEvidence(evidenceId)
        if (!state.discoveredEvidence.includes(evidenceId)) {
          throw new EngineError(
            'LOCKED',
            `Evidence "${evidenceId}" must be discovered before inspection`,
            'evidence.discovered',
          )
        }
        return commit({
          ...state,
          inspectedEvidence: uniquePush(state.inspectedEvidence, evidenceId),
        })
      } catch (error) {
        state = snapshot
        throw error
      }
    },

    completePuzzle(puzzleId, answer) {
      const snapshot = cloneState(state)
      const previousAnswers = verdictAnswers
      try {
        const puzzle = caseDef.puzzles.find((item) => item.id === puzzleId)
        if (!puzzle) {
          throw new EngineError(
            'NOT_FOUND',
            `Unknown puzzle id "${puzzleId}"`,
            'puzzleId',
          )
        }
        if (!isUnlocked(puzzle.unlock, state)) {
          throw new EngineError(
            'LOCKED',
            `Puzzle "${puzzleId}" is locked`,
            'puzzle.unlock',
          )
        }
        if (puzzle.act > state.currentAct) {
          throw new EngineError(
            'LOCKED',
            `Puzzle "${puzzleId}" belongs to act ${puzzle.act}; current act is ${state.currentAct}`,
            'puzzle.act',
          )
        }
        if (!answersEqual(puzzle.solution.value, answer)) {
          throw new EngineError(
            'INVALID_ANSWER',
            `Incorrect answer for puzzle "${puzzleId}"`,
            'puzzle.answer',
          )
        }
        if (state.completedPuzzles.includes(puzzleId)) {
          return cloneState(state)
        }
        return commit({
          ...state,
          completedPuzzles: uniquePush(state.completedPuzzles, puzzleId),
        })
      } catch (error) {
        state = snapshot
        verdictAnswers = previousAnswers
        throw error
      }
    },

    completeDialogue(dialogueId) {
      const snapshot = cloneState(state)
      try {
        const dialogue = caseDef.dialogue.find((item) => item.id === dialogueId)
        if (!dialogue) {
          throw new EngineError(
            'NOT_FOUND',
            `Unknown dialogue id "${dialogueId}"`,
            'dialogueId',
          )
        }
        if (
          !state.unlockedDialogue.includes(dialogueId) &&
          !isUnlocked(dialogue.unlock, state)
        ) {
          throw new EngineError(
            'LOCKED',
            `Dialogue "${dialogueId}" is locked`,
            'dialogue.unlock',
          )
        }
        return commit({
          ...state,
          unlockedDialogue: uniquePush(state.unlockedDialogue, dialogueId),
          completedDialogue: uniquePush(state.completedDialogue, dialogueId),
        })
      } catch (error) {
        state = snapshot
        throw error
      }
    },

    addConnection(connectionId) {
      const snapshot = cloneState(state)
      try {
        const connection = caseDef.connections.find(
          (item) => item.id === connectionId,
        )
        if (!connection) {
          throw new EngineError(
            'NOT_FOUND',
            `Unknown connection id "${connectionId}"`,
            'connectionId',
          )
        }
        const [left, right] = connection.evidenceIds
        if (
          !state.discoveredEvidence.includes(left) ||
          !state.discoveredEvidence.includes(right)
        ) {
          throw new EngineError(
            'LOCKED',
            `Both evidence items for connection "${connectionId}" must be discovered`,
            'connection.evidence',
          )
        }
        return commit({
          ...state,
          evidenceConnections: uniquePush(
            state.evidenceConnections,
            connectionId,
          ),
        })
      } catch (error) {
        state = snapshot
        throw error
      }
    },

    removeConnection(connectionId) {
      return commit({
        ...state,
        evidenceConnections: state.evidenceConnections.filter(
          (id) => id !== connectionId,
        ),
      })
    },

    setTimelineOrder(order) {
      const snapshot = cloneState(state)
      try {
        const timelineIds = new Set(caseDef.timelineEventIds)
        for (const [index, eventId] of order.entries()) {
          if (!timelineIds.has(eventId)) {
            throw new EngineError(
              'NOT_FOUND',
              `Unknown timeline event id "${eventId}"`,
              `timelineOrder.${index}`,
            )
          }
        }
        return commit({
          ...state,
          timelineOrder: [...order],
        })
      } catch (error) {
        state = snapshot
        throw error
      }
    },

    submitVerdict(answers) {
      const snapshot = cloneState(state)
      const previousAnswers = verdictAnswers
      try {
        if (!isVerdictPrerequisiteMet(caseDef, state)) {
          throw new EngineError(
            'LOCKED',
            'Verdict submission is locked until case prerequisites are met',
            'verdictPrerequisite',
          )
        }

        const questionIds = new Set(
          caseDef.scoring.verdictQuestions.map((question) => question.id),
        )
        for (const questionId of Object.keys(answers)) {
          if (!questionIds.has(questionId)) {
            throw new EngineError(
              'NOT_FOUND',
              `Unknown verdict question id "${questionId}"`,
              'verdictAnswers',
            )
          }
        }
        for (const question of caseDef.scoring.verdictQuestions) {
          if (!(question.id in answers)) {
            throw new EngineError(
              'INVALID_ANSWER',
              `Missing verdict answer for "${question.id}"`,
              'verdictAnswers',
            )
          }
          const answerId = answers[question.id]
          if (question.options) {
            const allowed = new Set(question.options.map((option) => option.id))
            if (!allowed.has(answerId)) {
              throw new EngineError(
                'INVALID_ANSWER',
                `Unknown option id "${answerId}" for verdict question "${question.id}"`,
                `verdictAnswers.${question.id}`,
              )
            }
          }
        }
        verdictAnswers = { ...answers }
        return commit({
          ...state,
          verdictSubmitted: true,
        })
      } catch (error) {
        state = snapshot
        verdictAnswers = previousAnswers
        throw error
      }
    },

    isComplete() {
      return isCaseComplete(caseDef, state)
    },

    getReveal() {
      if (!isCaseComplete(caseDef, state)) {
        return null
      }
      if (!caseDef.reveal) {
        return null
      }
      return caseDef.reveal.steps.map((step) => ({ ...step }))
    },

    calculateScore(answers) {
      const effective = answers ?? verdictAnswers
      return calculateScore(state, caseDef, effective)
    },

    serialize() {
      const envelope: SaveEnvelope = {
        schemaVersion: state.schemaVersion,
        caseId: state.caseId,
        state: cloneState(state),
      }
      if (verdictAnswers) {
        envelope.verdictAnswers = { ...verdictAnswers }
      }
      return envelope
    },

    loadSave(raw) {
      const before = cloneState(state)
      const beforeAnswers = verdictAnswers
        ? { ...verdictAnswers }
        : undefined
      const result = validateSaveAgainstCase(raw, caseDef)
      if (!result.success) {
        state = before
        verdictAnswers = beforeAnswers
        return { ok: false, errors: result.errors, state: cloneState(state) }
      }
      state = cloneState(result.data.state)
      verdictAnswers = result.data.verdictAnswers
        ? { ...result.data.verdictAnswers }
        : undefined
      return { ok: true, state: cloneState(state) }
    },

    saveToStorage(storage, key) {
      storage.setItem(key, JSON.stringify(engine.serialize()))
    },

    loadFromStorage(storage, key) {
      const raw = storage.getItem(key)
      if (raw === null) {
        return {
          ok: false,
          errors: [
            { path: key, message: `No save found for storage key "${key}"` },
          ],
          state: cloneState(state),
        }
      }
      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        return {
          ok: false,
          errors: [{ path: key, message: 'Save payload is not valid JSON' }],
          state: cloneState(state),
        }
      }
      return engine.loadSave(parsed)
    },
  }

  return engine
}
