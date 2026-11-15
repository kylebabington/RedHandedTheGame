import { describe, expect, it } from 'vitest'
import { caseFix001 } from '@/content/cases/case-fix-001'
import { createGame } from '../createGame'
import { GAME_STATE_SCHEMA_VERSION } from '../schemas/gameState'
import { createMemoryStorage } from './storage'

function progressedEngine() {
  const engine = createGame(caseFix001)
  engine.discoverEvidence('FX_E001')
  engine.discoverEvidence('FX_E002')
  engine.completePuzzle('P_GAP', 'log-altered')
  return engine
}

describe('save/load validation', () => {
  it('restores discovered evidence and progression from a valid save', () => {
    const engine = progressedEngine()
    const saved = engine.serialize()

    const restored = createGame(caseFix001)
    const result = restored.loadSave(saved)

    expect(result.ok).toBe(true)
    expect(restored.getState().discoveredEvidence).toEqual([
      'FX_E001',
      'FX_E002',
    ])
    expect(restored.getState().completedPuzzles).toEqual(['P_GAP'])
    expect(restored.getState().currentAct).toBe(2)
  })

  it('rejects malformed saves and leaves active state unchanged', () => {
    const engine = progressedEngine()
    const before = engine.getState()

    const result = engine.loadSave({ not: 'a-save' })
    expect(result.ok).toBe(false)
    expect(engine.getState()).toEqual(before)
  })

  it('rejects saves for the wrong case and leaves active state unchanged', () => {
    const engine = progressedEngine()
    const before = engine.getState()
    const saved = engine.serialize()
    saved.caseId = 'CASE_OTHER'
    saved.state.caseId = 'CASE_OTHER'

    const result = engine.loadSave(saved)
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.some((error) => error.path === 'caseId')).toBe(true)
    expect(engine.getState()).toEqual(before)
  })

  it('rejects unsupported schema versions and leaves active state unchanged', () => {
    const engine = progressedEngine()
    const before = engine.getState()
    const saved = {
      ...engine.serialize(),
      schemaVersion: 999,
      state: {
        ...engine.getState(),
        schemaVersion: 999,
      },
    }

    const result = engine.loadSave(saved)
    expect(result.ok).toBe(false)
    expect(engine.getState()).toEqual(before)
  })

  it('rejects a structurally valid save with an invalid case reference', () => {
    const engine = progressedEngine()
    const before = engine.getState()
    const saved = engine.serialize()
    saved.state.discoveredEvidence = [...saved.state.discoveredEvidence, 'E999']

    const result = engine.loadSave(saved)
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(
      result.errors.some((error) =>
        error.message.includes('Unknown evidence id "E999"'),
      ),
    ).toBe(true)
    expect(engine.getState()).toEqual(before)
  })

  it('leaves active state and submitted verdict answers intact when a load is rejected', () => {
    const engine = progressedEngine()
    engine.discoverEvidence('FX_E003')
    engine.discoverEvidence('FX_E004')
    engine.setTimelineOrder(['T_SIGN_OUT', 'T_CAMERA', 'T_LOG_CLAIM'])
    engine.completeDialogue('D_NIA')
    engine.completePuzzle('P_CLASSIFY', {
      FX_E003: 'verified-evidence',
      FX_E004: 'witness-claim',
    })
    const verdict = {
      VQ_WHAT: 'signed-out-early',
      VQ_WHO: 'nia',
    }
    engine.submitVerdict(verdict)

    const beforeState = engine.getState()
    const beforeAnswers = engine.getVerdictAnswers()
    const beforeScore = engine.calculateScore()
    expect(beforeAnswers).toEqual(verdict)
    expect(beforeScore.total).toBe(100)

    const badSave = engine.serialize()
    badSave.state.discoveredEvidence = [
      ...badSave.state.discoveredEvidence,
      'E999',
    ]

    const result = engine.loadSave(badSave)
    expect(result.ok).toBe(false)
    expect(engine.getState()).toEqual(beforeState)
    expect(engine.getVerdictAnswers()).toEqual(beforeAnswers)
    expect(engine.calculateScore()).toEqual(beforeScore)
  })

  it('round-trips through a memory storage double without browser APIs', () => {
    const engine = progressedEngine()
    const storage = createMemoryStorage()
    engine.saveToStorage(storage, 'fix')

    const restored = createGame(caseFix001)
    const result = restored.loadFromStorage(storage, 'fix')
    expect(result.ok).toBe(true)
    expect(restored.getState().completedPuzzles).toEqual(['P_GAP'])
    expect(GAME_STATE_SCHEMA_VERSION).toBe(1)
  })
})
