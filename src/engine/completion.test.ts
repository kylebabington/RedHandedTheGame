import { describe, expect, it } from 'vitest'
import { caseFix001 } from '@/content/cases/case-fix-001'
import { createGame } from './createGame'
import { EngineError } from './rules/errors'
import { parseCase } from './schemas/case'
import { GAME_STATE_SCHEMA_VERSION } from './schemas/gameState'

function withVerdictGate() {
  return parseCase({
    ...caseFix001,
    verdictPrerequisite: { type: 'puzzlesAll', puzzleIds: ['P_CLASSIFY'] },
    reveal: {
      steps: [
        {
          id: 'R1',
          title: 'What happened',
          body: 'The key was signed out early and the log was altered.',
        },
      ],
    },
    scoring: {
      ...caseFix001.scoring,
      verdictQuestions: [
        {
          id: 'VQ_WHAT',
          prompt: 'What happened to the key?',
          correctAnswerId: 'signed-out-early',
          options: [
            { id: 'signed-out-early', label: 'Signed out early' },
            { id: 'stolen-later', label: 'Stolen after midnight' },
          ],
        },
        {
          id: 'VQ_WHO',
          prompt: 'Who altered the shift log?',
          correctAnswerId: 'nia',
          options: [
            { id: 'nia', label: 'Nia Holt' },
            { id: 'unknown', label: 'An unknown visitor' },
          ],
        },
      ],
    },
  })
}

function finishThroughClassify(engine: ReturnType<typeof createGame>) {
  engine.discoverEvidence('FX_E001')
  engine.discoverEvidence('FX_E002')
  engine.completePuzzle('P_GAP', 'log-altered')
  engine.discoverEvidence('FX_E003')
  engine.discoverEvidence('FX_E004')
  engine.setTimelineOrder(['T_SIGN_OUT', 'T_CAMERA', 'T_LOG_CLAIM'])
  engine.completeDialogue('D_NIA')
  engine.completePuzzle('P_CLASSIFY', {
    FX_E003: 'verified-evidence',
    FX_E004: 'witness-claim',
  })
}

describe('verdict prerequisite, options, reveal, and completion', () => {
  it('preserves open verdict submission when verdictPrerequisite is omitted', () => {
    const engine = createGame(caseFix001)
    engine.discoverEvidence('FX_E001')
    engine.discoverEvidence('FX_E002')
    engine.completePuzzle('P_GAP', 'log-altered')

    const state = engine.submitVerdict({
      VQ_WHAT: 'signed-out-early',
      VQ_WHO: 'nia',
    })
    expect(state.verdictSubmitted).toBe(true)
  })

  it('rejects early submitVerdict when verdictPrerequisite is unmet and preserves answers', () => {
    const caseDef = withVerdictGate()
    const engine = createGame(caseDef)
    engine.discoverEvidence('FX_E001')
    engine.discoverEvidence('FX_E002')
    engine.completePuzzle('P_GAP', 'log-altered')

    const before = engine.getState()
    expect(() =>
      engine.submitVerdict({
        VQ_WHAT: 'signed-out-early',
        VQ_WHO: 'nia',
      }),
    ).toThrow(EngineError)
    expect(engine.getState()).toEqual(before)
    expect(engine.getVerdictAnswers()).toBeUndefined()
    expect(engine.getReveal()).toBeNull()
    expect(engine.isComplete()).toBe(false)
  })

  it('rejects unknown option ids but accepts valid incorrect choices for scoring', () => {
    const caseDef = withVerdictGate()
    const engine = createGame(caseDef)
    finishThroughClassify(engine)

    const before = engine.getState()
    expect(() =>
      engine.submitVerdict({
        VQ_WHAT: 'not-an-option',
        VQ_WHO: 'nia',
      }),
    ).toThrow(EngineError)
    expect(engine.getState()).toEqual(before)
    expect(engine.getVerdictAnswers()).toBeUndefined()

    engine.submitVerdict({
      VQ_WHAT: 'stolen-later',
      VQ_WHO: 'unknown',
    })
    expect(engine.getState().verdictSubmitted).toBe(true)
    const score = engine.calculateScore()
    expect(score.total).toBeLessThan(100)
    expect(engine.isComplete()).toBe(true)
    expect(engine.getReveal()?.[0]?.id).toBe('R1')
  })

  it('keeps getReveal null until completion even if a loaded save sets verdictSubmitted early', () => {
    const caseDef = withVerdictGate()
    const engine = createGame(caseDef)
    engine.discoverEvidence('FX_E001')
    engine.discoverEvidence('FX_E002')
    engine.completePuzzle('P_GAP', 'log-altered')

    const premature = {
      schemaVersion: GAME_STATE_SCHEMA_VERSION,
      caseId: caseDef.id,
      state: {
        ...engine.getState(),
        verdictSubmitted: true,
      },
      verdictAnswers: {
        VQ_WHAT: 'signed-out-early',
        VQ_WHO: 'nia',
      },
    }

    const load = engine.loadSave(premature)
    expect(load.ok).toBe(true)
    expect(engine.getState().verdictSubmitted).toBe(true)
    expect(engine.isComplete()).toBe(false)
    expect(engine.getReveal()).toBeNull()
  })

  it('round-trips a completed save and keeps reveal available after reload', () => {
    const caseDef = withVerdictGate()
    const engine = createGame(caseDef)
    finishThroughClassify(engine)
    engine.submitVerdict({
      VQ_WHAT: 'signed-out-early',
      VQ_WHO: 'nia',
    })
    expect(engine.isComplete()).toBe(true)
    expect(engine.getReveal()?.length).toBe(1)

    const envelope = engine.serialize()
    const restored = createGame(caseDef)
    expect(restored.getReveal()).toBeNull()
    const load = restored.loadSave(envelope)
    expect(load.ok).toBe(true)
    expect(restored.isComplete()).toBe(true)
    expect(restored.getReveal()?.[0]?.id).toBe('R1')
    expect(restored.calculateScore().rating).toBe('The Master Investigator')
  })
})
