import { describe, expect, it } from 'vitest'
import { caseFix001 } from '@/content/cases/case-fix-001'
import { createGame } from './createGame'
import { createMemoryStorage } from './persistence/storage'
import { EngineError } from './rules/errors'

describe('M1 exit gate: fixture case progresses, persists, and scores deterministically', () => {
  it('starts the fixture case, discovers evidence, completes a puzzle, unlocks the next step, saves/reloads, and scores repeatably', () => {
    const engine = createGame(caseFix001)
    expect(engine.getState().caseId).toBe('CASE_FIX_001')
    expect(engine.getState().currentAct).toBe(1)

    // Next-step evidence stays locked until Act I puzzle completes.
    expect(() => engine.discoverEvidence('FX_E003')).toThrow(EngineError)

    engine.discoverEvidence('FX_E001')
    engine.inspectEvidence('FX_E001')
    engine.discoverEvidence('FX_E002')
    engine.addConnection('CX_LOG_PHOTO')
    engine.completePuzzle('P_GAP', 'log-altered')

    expect(engine.getState().completedPuzzles).toContain('P_GAP')
    expect(engine.getState().currentAct).toBe(2)
    expect(engine.getState().unlockedDialogue).toContain('D_NIA')

    // Unlocked next-step evidence after progression.
    engine.discoverEvidence('FX_E003')
    expect(engine.getState().discoveredEvidence).toContain('FX_E003')

    const storage = createMemoryStorage()
    engine.saveToStorage(storage, 'CASE_FIX_001')

    const restored = createGame(caseFix001)
    const load = restored.loadFromStorage(storage, 'CASE_FIX_001')
    expect(load.ok).toBe(true)
    expect(restored.getState().discoveredEvidence).toEqual(
      expect.arrayContaining(['FX_E001', 'FX_E002', 'FX_E003']),
    )
    expect(restored.getState().completedPuzzles).toEqual(['P_GAP'])
    expect(restored.getState().currentAct).toBe(2)
    expect(restored.getState().evidenceConnections).toEqual(['CX_LOG_PHOTO'])

    restored.discoverEvidence('FX_E004')
    restored.setTimelineOrder(['T_SIGN_OUT', 'T_CAMERA', 'T_LOG_CLAIM'])
    restored.completeDialogue('D_NIA')
    restored.completePuzzle('P_CLASSIFY', {
      FX_E003: 'verified-evidence',
      FX_E004: 'witness-claim',
    })
    restored.submitVerdict({
      VQ_WHAT: 'signed-out-early',
      VQ_WHO: 'nia',
    })

    const first = restored.calculateScore()
    const second = restored.calculateScore()
    expect(first.total).toBe(100)
    expect(second).toEqual(first)
    expect(first.rating).toBe('The Master Investigator')
  })
})
