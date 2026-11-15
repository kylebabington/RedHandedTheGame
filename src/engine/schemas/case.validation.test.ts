import { describe, expect, it } from 'vitest'
import { caseFix001 } from '@/content/cases/case-fix-001'
import { validateCase } from './case'

describe('case content validation', () => {
  it('accepts the fixture case', () => {
    const result = validateCase(caseFix001)
    expect(result.success).toBe(true)
  })

  it('rejects unknown unlock evidence references with a field path', () => {
    const result = validateCase({
      ...caseFix001,
      evidence: [
        {
          ...caseFix001.evidence[0],
          unlock: { type: 'evidenceAll', evidenceIds: ['MISSING_EVIDENCE'] },
        },
        ...caseFix001.evidence.slice(1),
      ],
    })

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.errors.some((error) => error.path.includes('evidence'))).toBe(
      true,
    )
    expect(
      result.errors.some((error) =>
        error.message.includes('MISSING_EVIDENCE'),
      ),
    ).toBe(true)
  })

  it('rejects duplicate evidence ids', () => {
    const first = caseFix001.evidence[0]
    const result = validateCase({
      ...caseFix001,
      evidence: [first, { ...first }],
    })

    expect(result.success).toBe(false)
    if (result.success) return
    expect(
      result.errors.some((error) => error.message.includes('Duplicate')),
    ).toBe(true)
  })

  it('rejects scoring references to unknown puzzles', () => {
    const result = validateCase({
      ...caseFix001,
      scoring: {
        ...caseFix001.scoring,
        classificationPuzzleId: 'P_DOES_NOT_EXIST',
      },
    })

    expect(result.success).toBe(false)
    if (result.success) return
    expect(
      result.errors.some(
        (error) => error.path === 'scoring.classificationPuzzleId',
      ),
    ).toBe(true)
  })
})
