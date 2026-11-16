import { describe, expect, it } from 'vitest'
import { createGame } from '@/engine/createGame'
import { createMemoryStorage } from '@/engine/persistence/storage'
import { EngineError } from '@/engine/rules/errors'
import { GAME_STATE_SCHEMA_VERSION } from '@/engine/schemas/gameState'
import {
  CANONICAL_RECONSTRUCTION_ORDER,
  case001,
} from './index'

const PERFECT_VERDICT = {
  VQ_WHAT: 'staged-exit',
  VQ_VOLUNTARY: 'voluntary',
  VQ_ASSISTED: 'daniel',
  VQ_MANIPULATED: 'broadcast-feed',
  VQ_WRONGDOING: 'research-theft',
  VQ_SUPPORTED: 'linked-distinct',
} as const

const IMPERFECT_VERDICT = {
  VQ_WHAT: 'abducted',
  VQ_VOLUNTARY: 'forced',
  VQ_ASSISTED: 'daniel',
  VQ_MANIPULATED: 'broadcast-feed',
  VQ_WRONGDOING: 'only-disappearance',
  VQ_SUPPORTED: 'linked-distinct',
} as const

function discoverInspect(
  engine: ReturnType<typeof createGame>,
  evidenceId: string,
) {
  engine.discoverEvidence(evidenceId)
  engine.inspectEvidence(evidenceId)
}

function playThroughReconstruction(engine: ReturnType<typeof createGame>) {
  expect(engine.getReveal()).toBeNull()
  expect(engine.isComplete()).toBe(false)

  // Act I
  discoverInspect(engine, 'E001')
  discoverInspect(engine, 'E002')
  discoverInspect(engine, 'E003')
  discoverInspect(engine, 'E004')
  discoverInspect(engine, 'E005')
  engine.addConnection('CX_AIR_NOTE')

  expect(() => engine.completeDialogue('D_DANIEL')).toThrow(EngineError)
  expect(() =>
    engine.submitVerdict({ ...PERFECT_VERDICT }),
  ).toThrow(EngineError)

  engine.completePuzzle('P_ELEVEN_SECONDS', 'recording-altered')
  expect(engine.getState().currentAct).toBe(2)
  expect(engine.getState().unlockedDialogue).toContain('D_DANIEL')

  // Act II
  discoverInspect(engine, 'E006')
  discoverInspect(engine, 'E007')
  discoverInspect(engine, 'E008')
  discoverInspect(engine, 'E009')
  discoverInspect(engine, 'E010')

  engine.completeDialogue('D_DANIEL')
  engine.completeDialogue('D_MARCUS')
  engine.completeDialogue('D_CLARA')

  engine.completePuzzle(
    'P_PRODUCER_TIMELINE',
    'daniel-location-contradiction',
  )
  engine.completePuzzle('P_SECURITY_GAP', 'missing-record-not-proof')
  engine.completePuzzle('P_FACT_OR_THEORY', {
    S_AIR_SILENCE: 'verified-evidence',
    S_DANIEL_GLASS: 'witness-claim',
    S_HATCH_EXIT: 'reasonable-inference',
    S_KIDNAPPED: 'unsupported-speculation',
  })

  expect(engine.getState().currentAct).toBe(3)
  expect(() =>
    engine.submitVerdict({ ...PERFECT_VERDICT }),
  ).toThrow(EngineError)
  expect(engine.getReveal()).toBeNull()

  // Act III
  discoverInspect(engine, 'E011')
  discoverInspect(engine, 'E012')
  discoverInspect(engine, 'E013')
  discoverInspect(engine, 'E014')
  engine.addConnection('CX_HATCH_CORRIDOR')
  engine.addConnection('CX_CLARA_TRANSFER')

  const playerOrder = [...CANONICAL_RECONSTRUCTION_ORDER]
  engine.completePuzzle('P_RECONSTRUCTION', playerOrder)
  engine.setTimelineOrder(playerOrder)

  expect(engine.getState().completedPuzzles).toContain('P_RECONSTRUCTION')
  expect(engine.getState().timelineOrder).toEqual(playerOrder)
  expect(engine.isComplete()).toBe(false)
  expect(engine.getReveal()).toBeNull()
}

describe('CASE_001 headless playthrough', () => {
  it('validates as a complete case package', () => {
    expect(case001.id).toBe('CASE_001')
    expect(case001.evidence).toHaveLength(14)
    expect(case001.puzzles).toHaveLength(5)
    expect(case001.characters).toHaveLength(4)
    expect(case001.acts).toHaveLength(3)
    expect(case001.dialogue.every((entry) => entry.beats.length > 0)).toBe(
      true,
    )
    expect(case001.reveal?.steps.length).toBeGreaterThan(0)
    expect(case001.verdictPrerequisite).toBeDefined()
  })

  it('holds early gates before Act I evidence and before reconstruction', () => {
    const engine = createGame(case001)
    expect(engine.getState().currentAct).toBe(1)
    expect(() => engine.discoverEvidence('E006')).toThrow(EngineError)
    expect(() => engine.discoverEvidence('E011')).toThrow(EngineError)
    expect(() => engine.completePuzzle('P_ELEVEN_SECONDS', 'recording-altered')).toThrow(
      EngineError,
    )
    expect(() => engine.completeDialogue('D_DANIEL')).toThrow(EngineError)
    expect(() => engine.submitVerdict({ ...PERFECT_VERDICT })).toThrow(
      EngineError,
    )
    expect(engine.getReveal()).toBeNull()
  })

  it('completes from a fresh game with a perfect verdict and unlocks reveal', () => {
    const engine = createGame(case001)
    playThroughReconstruction(engine)

    engine.submitVerdict({ ...PERFECT_VERDICT })
    expect(engine.isComplete()).toBe(true)
    const reveal = engine.getReveal()
    expect(reveal).not.toBeNull()
    expect(reveal?.map((step) => step.id)).toEqual([
      'R_STAGED',
      'R_DANIEL',
      'R_CLARA',
      'R_MARCUS',
      'R_DISTINCT',
    ])

    const score = engine.calculateScore()
    expect(score.total).toBe(100)
    expect(score.rating).toBe('The Master Investigator')
  })

  it('completes with a valid imperfect verdict and a lower score', () => {
    const engine = createGame(case001)
    playThroughReconstruction(engine)

    engine.submitVerdict({ ...IMPERFECT_VERDICT })
    expect(engine.isComplete()).toBe(true)
    expect(engine.getReveal()?.length).toBeGreaterThan(0)

    const score = engine.calculateScore()
    expect(score.total).toBeLessThan(100)
    expect(score.total).toBeGreaterThan(0)
    expect(score.rating).not.toBe('The Master Investigator')
  })

  it('rejects unknown verdict option ids without mutating state', () => {
    const engine = createGame(case001)
    playThroughReconstruction(engine)
    const before = engine.getState()

    expect(() =>
      engine.submitVerdict({
        ...PERFECT_VERDICT,
        VQ_WHAT: 'not-a-real-option',
      }),
    ).toThrow(EngineError)
    expect(engine.getState()).toEqual(before)
    expect(engine.getVerdictAnswers()).toBeUndefined()
    expect(engine.getReveal()).toBeNull()
  })

  it('round-trips a completed save and blocks reveal for a premature verdict flag', () => {
    const engine = createGame(case001)
    playThroughReconstruction(engine)
    engine.submitVerdict({ ...PERFECT_VERDICT })

    const storage = createMemoryStorage()
    engine.saveToStorage(storage, 'CASE_001')

    const restored = createGame(case001)
    expect(restored.getReveal()).toBeNull()
    const load = restored.loadFromStorage(storage, 'CASE_001')
    expect(load.ok).toBe(true)
    expect(restored.isComplete()).toBe(true)
    expect(restored.getReveal()?.[0]?.id).toBe('R_STAGED')
    expect(restored.calculateScore().total).toBe(100)

    const mid = createGame(case001)
    discoverInspect(mid, 'E001')
    discoverInspect(mid, 'E002')
    const premature = {
      schemaVersion: GAME_STATE_SCHEMA_VERSION,
      caseId: 'CASE_001',
      state: {
        ...mid.getState(),
        verdictSubmitted: true,
      },
      verdictAnswers: { ...PERFECT_VERDICT },
    }
    expect(mid.loadSave(premature).ok).toBe(true)
    expect(mid.getState().verdictSubmitted).toBe(true)
    expect(mid.isComplete()).toBe(false)
    expect(mid.getReveal()).toBeNull()
  })
})
