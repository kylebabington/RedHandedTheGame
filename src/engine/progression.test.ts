import { describe, expect, it } from 'vitest'
import { caseFix001 } from '@/content/cases/case-fix-001'
import { createGame } from './createGame'
import { EngineError } from './rules/errors'

function startAct1Ready() {
  const engine = createGame(caseFix001)
  engine.discoverEvidence('FX_E001')
  engine.discoverEvidence('FX_E002')
  return engine
}

describe('engine progression', () => {
  it('keeps the next act locked until the act completeWhen condition passes', () => {
    const engine = startAct1Ready()
    expect(engine.getState().currentAct).toBe(1)

    expect(() => engine.discoverEvidence('FX_E003')).toThrow(EngineError)
    expect(engine.getState().discoveredEvidence).not.toContain('FX_E003')
    expect(engine.getState().currentAct).toBe(1)

    engine.completePuzzle('P_GAP', 'log-altered')
    expect(engine.getState().currentAct).toBe(2)
    expect(engine.getState().unlockedDialogue).toContain('D_NIA')

    engine.discoverEvidence('FX_E003')
    expect(engine.getState().discoveredEvidence).toContain('FX_E003')
  })

  it('leaves state unchanged when a locked action is rejected', () => {
    const engine = createGame(caseFix001)
    const before = engine.getState()

    expect(() => engine.discoverEvidence('FX_E002')).toThrow(EngineError)
    expect(engine.getState()).toEqual(before)

    expect(() => engine.completePuzzle('P_GAP', 'log-altered')).toThrow(
      EngineError,
    )
    expect(engine.getState()).toEqual(before)
  })

  it('leaves state unchanged when a puzzle answer is incorrect', () => {
    const engine = startAct1Ready()
    const before = engine.getState()

    expect(() => engine.completePuzzle('P_GAP', 'wrong')).toThrow(EngineError)
    expect(engine.getState()).toEqual(before)
  })

  it('keeps currentAct on the final act when final completeWhen passes', () => {
    const engine = startAct1Ready()
    engine.completePuzzle('P_GAP', 'log-altered')
    engine.discoverEvidence('FX_E003')
    engine.discoverEvidence('FX_E004')
    engine.completeDialogue('D_NIA')
    engine.completePuzzle('P_CLASSIFY', {
      FX_E003: 'verified-evidence',
      FX_E004: 'witness-claim',
    })

    const { currentAct } = engine.getState()
    const finalAct = caseFix001.acts[caseFix001.acts.length - 1]
    expect(finalAct).toBeDefined()
    expect(currentAct).toBe(finalAct!.number)
    expect(caseFix001.acts.some((act) => act.number === currentAct)).toBe(true)
    expect(currentAct).toBeLessThanOrEqual(caseFix001.acts.length)
  })
})
