import { describe, expect, it } from 'vitest'
import { caseFix001 } from '@/content/cases/case-fix-001'
import { createGame } from '../createGame'
import { calculateScore } from './calculateScore'
import { SCORE_WEIGHTS } from './ratings'

const CORRECT_VERDICT = {
  VQ_WHAT: 'signed-out-early',
  VQ_WHO: 'nia',
}

function fullyProgressedEngine() {
  const engine = createGame(caseFix001)
  engine.discoverEvidence('FX_E001')
  engine.discoverEvidence('FX_E002')
  engine.completePuzzle('P_GAP', 'log-altered')
  engine.discoverEvidence('FX_E003')
  engine.discoverEvidence('FX_E004')
  engine.addConnection('CX_LOG_PHOTO')
  engine.setTimelineOrder(['T_SIGN_OUT', 'T_CAMERA', 'T_LOG_CLAIM'])
  engine.completeDialogue('D_NIA')
  engine.completePuzzle('P_CLASSIFY', {
    FX_E003: 'verified-evidence',
    FX_E004: 'witness-claim',
  })
  engine.submitVerdict(CORRECT_VERDICT)
  return engine
}

describe('scoring foundation', () => {
  it('uses master-plan weights', () => {
    expect(SCORE_WEIGHTS).toEqual({
      evidenceDiscovery: 20,
      contradictionIdentification: 20,
      timelineReconstruction: 20,
      finalConclusions: 30,
      factVsSpeculation: 10,
    })
  })

  it('produces a known total and category contributions for fixture progress', () => {
    const engine = fullyProgressedEngine()
    const score = engine.calculateScore()

    expect(score.categories).toEqual([
      expect.objectContaining({
        key: 'evidenceDiscovery',
        weight: 20,
        ratio: 1,
        points: 20,
      }),
      expect.objectContaining({
        key: 'contradictionIdentification',
        weight: 20,
        ratio: 1,
        points: 20,
      }),
      expect.objectContaining({
        key: 'timelineReconstruction',
        weight: 20,
        ratio: 1,
        points: 20,
      }),
      expect.objectContaining({
        key: 'finalConclusions',
        weight: 30,
        ratio: 1,
        points: 30,
      }),
      expect.objectContaining({
        key: 'factVsSpeculation',
        weight: 10,
        ratio: 1,
        points: 10,
      }),
    ])
    expect(score.total).toBe(100)
    expect(score.rating).toBe('The Master Investigator')
    expect(score.missedEvidence).toEqual([])
  })

  it('returns identical full score results across repeated calls', () => {
    const engine = fullyProgressedEngine()
    const first = engine.calculateScore()
    const second = engine.calculateScore()
    const third = calculateScore(
      engine.getState(),
      caseFix001,
      CORRECT_VERDICT,
    )

    expect(second).toEqual(first)
    expect(third).toEqual(first)
  })

  it('scores a submitted verdict identically after save/reload via ADR-009 caller flow', () => {
    const engine = fullyProgressedEngine()
    const scoreBefore = engine.calculateScore()
    expect(scoreBefore.total).toBe(100)

    // Envelope carries optional verdictAnswers; GameState only has the flag.
    const saved = engine.serialize()
    expect(saved.state.verdictSubmitted).toBe(true)
    expect(saved.verdictAnswers).toEqual(CORRECT_VERDICT)

    const restored = createGame(caseFix001)
    const load = restored.loadSave(saved)
    expect(load.ok).toBe(true)
    expect(restored.getState().verdictSubmitted).toBe(true)
    expect(restored.getVerdictAnswers()).toEqual(CORRECT_VERDICT)

    // Prefer restored session answers (calculateScore uses them by default),
    // or pass getVerdictAnswers() explicitly — both match the pre-save score.
    const scoreFromSession = restored.calculateScore()
    const scoreExplicit = restored.calculateScore(restored.getVerdictAnswers())
    expect(scoreFromSession).toEqual(scoreBefore)
    expect(scoreExplicit).toEqual(scoreBefore)

    const withoutAnswers = calculateScore(restored.getState(), caseFix001)
    expect(
      withoutAnswers.categories.find((c) => c.key === 'finalConclusions')
        ?.points,
    ).toBe(0)
    expect(withoutAnswers.total).toBe(70)
  })
})
