import type { CaseDefinition } from '../schemas/case'
import { GAME_STATE_SCHEMA_VERSION } from '../schemas/gameState'
import {
  saveEnvelopeSchema,
  type SaveEnvelope,
  type VerdictAnswers,
} from '../schemas/save'

export type SaveValidationError = {
  path: string
  message: string
}

export type SaveValidationResult =
  | { success: true; data: SaveEnvelope }
  | { success: false; errors: SaveValidationError[] }

function issue(path: string, message: string): SaveValidationError {
  return { path, message }
}

/**
 * Structural Zod parse plus semantic validation against the active case.
 * Envelope and inner state must agree on caseId and schemaVersion; act and
 * all referenced entity IDs must resolve in the case definition.
 */
export function validateSaveAgainstCase(
  raw: unknown,
  caseDef: CaseDefinition,
): SaveValidationResult {
  const parsed = saveEnvelopeSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.issues.map((item) => ({
        path: item.path.length > 0 ? item.path.join('.') : '(root)',
        message: item.message,
      })),
    }
  }

  const envelope = parsed.data
  const errors: SaveValidationError[] = []

  if (envelope.schemaVersion !== GAME_STATE_SCHEMA_VERSION) {
    errors.push(
      issue(
        'schemaVersion',
        `Unsupported schema version ${envelope.schemaVersion}`,
      ),
    )
  }

  if (envelope.state.schemaVersion !== envelope.schemaVersion) {
    errors.push(
      issue(
        'state.schemaVersion',
        `State schemaVersion ${envelope.state.schemaVersion} does not match envelope schemaVersion ${envelope.schemaVersion}`,
      ),
    )
  }

  if (envelope.caseId !== caseDef.id) {
    errors.push(
      issue(
        'caseId',
        `Save caseId "${envelope.caseId}" does not match active case "${caseDef.id}"`,
      ),
    )
  }

  if (envelope.state.caseId !== envelope.caseId) {
    errors.push(
      issue(
        'state.caseId',
        `State caseId "${envelope.state.caseId}" does not match envelope caseId "${envelope.caseId}"`,
      ),
    )
  }

  const actNumbers = new Set(caseDef.acts.map((act) => act.number))
  if (!actNumbers.has(envelope.state.currentAct)) {
    errors.push(
      issue(
        'state.currentAct',
        `Saved act ${envelope.state.currentAct} does not exist in case "${caseDef.id}"`,
      ),
    )
  }

  const evidenceIds = new Set(caseDef.evidence.map((item) => item.id))
  const puzzleIds = new Set(caseDef.puzzles.map((item) => item.id))
  const dialogueIds = new Set(caseDef.dialogue.map((item) => item.id))
  const connectionIds = new Set(caseDef.connections.map((item) => item.id))
  const timelineIds = new Set(caseDef.timelineEventIds)

  pushUnknownIds(
    errors,
    'state.discoveredEvidence',
    envelope.state.discoveredEvidence,
    evidenceIds,
    'evidence',
  )
  pushUnknownIds(
    errors,
    'state.inspectedEvidence',
    envelope.state.inspectedEvidence,
    evidenceIds,
    'evidence',
  )
  pushUnknownIds(
    errors,
    'state.completedPuzzles',
    envelope.state.completedPuzzles,
    puzzleIds,
    'puzzle',
  )
  pushUnknownIds(
    errors,
    'state.unlockedDialogue',
    envelope.state.unlockedDialogue,
    dialogueIds,
    'dialogue',
  )
  pushUnknownIds(
    errors,
    'state.completedDialogue',
    envelope.state.completedDialogue,
    dialogueIds,
    'dialogue',
  )
  pushUnknownIds(
    errors,
    'state.evidenceConnections',
    envelope.state.evidenceConnections,
    connectionIds,
    'connection',
  )
  pushUnknownIds(
    errors,
    'state.timelineOrder',
    envelope.state.timelineOrder,
    timelineIds,
    'timeline event',
  )

  if (envelope.verdictAnswers) {
    validateVerdictAnswerKeys(
      errors,
      envelope.verdictAnswers,
      caseDef.scoring.verdictQuestions.map((question) => question.id),
    )
  }

  if (errors.length > 0) {
    return { success: false, errors }
  }

  return { success: true, data: envelope }
}

function pushUnknownIds(
  errors: SaveValidationError[],
  path: string,
  values: string[],
  catalog: Set<string>,
  label: string,
): void {
  for (const [index, id] of values.entries()) {
    if (!catalog.has(id)) {
      errors.push(
        issue(`${path}.${index}`, `Unknown ${label} id "${id}" in save`),
      )
    }
  }
}

function validateVerdictAnswerKeys(
  errors: SaveValidationError[],
  answers: VerdictAnswers,
  questionIds: string[],
): void {
  const allowed = new Set(questionIds)
  for (const questionId of Object.keys(answers)) {
    if (!allowed.has(questionId)) {
      errors.push(
        issue(
          `verdictAnswers.${questionId}`,
          `Unknown verdict question id "${questionId}" in save`,
        ),
      )
    }
  }
}
