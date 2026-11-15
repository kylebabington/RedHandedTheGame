import { z } from 'zod'
import { dialogueSchema } from './dialogue'
import { evidenceSchema } from './evidence'
import { puzzleSchema } from './puzzle'
import { unlockConditionSchema } from './unlock'

export const characterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
})

export const connectionSchema = z.object({
  id: z.string().min(1),
  evidenceIds: z.tuple([z.string().min(1), z.string().min(1)]),
  label: z.string().min(1),
})

export const actSchema = z.object({
  number: z.number().int().positive(),
  title: z.string().min(1),
  completeWhen: unlockConditionSchema,
})

export const verdictQuestionSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  correctAnswerId: z.string().min(1),
})

export const scoringConfigSchema = z.object({
  /** Evidence IDs counted toward the evidence-discovery category (20%). */
  scoredEvidenceIds: z.array(z.string().min(1)).min(1),
  /** Puzzle IDs counted toward contradiction identification (20%). */
  contradictionPuzzleIds: z.array(z.string().min(1)).min(1),
  /** Canonical timeline event order for timeline reconstruction (20%). */
  correctTimelineOrder: z.array(z.string().min(1)).min(1),
  /** Puzzle ID counted toward fact-vs-speculation (10%). */
  classificationPuzzleId: z.string().min(1),
  /** Verdict questions for final conclusions (30%). */
  verdictQuestions: z.array(verdictQuestionSchema).min(1),
})

export const caseDefinitionSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    difficulty: z.string().min(1),
    playtime: z.string().min(1),
    characters: z.array(characterSchema).min(1),
    acts: z.array(actSchema).min(1),
    evidence: z.array(evidenceSchema).min(1),
    puzzles: z.array(puzzleSchema).min(1),
    dialogue: z.array(dialogueSchema).min(1),
    connections: z.array(connectionSchema).default([]),
    timelineEventIds: z.array(z.string().min(1)).min(1),
    scoring: scoringConfigSchema,
  })
  .superRefine((caseDef, ctx) => {
    const evidenceIds = new Set(caseDef.evidence.map((item) => item.id))
    const puzzleIds = new Set(caseDef.puzzles.map((item) => item.id))
    const dialogueIds = new Set(caseDef.dialogue.map((item) => item.id))
    const characterIds = new Set(caseDef.characters.map((item) => item.id))
    const connectionIds = new Set(caseDef.connections.map((item) => item.id))
    const actNumbers = new Set(caseDef.acts.map((act) => act.number))
    const timelineIds = new Set(caseDef.timelineEventIds)

    assertUnique(
      ctx,
      caseDef.evidence.map((item) => item.id),
      'evidence',
    )
    assertUnique(
      ctx,
      caseDef.puzzles.map((item) => item.id),
      'puzzles',
    )
    assertUnique(
      ctx,
      caseDef.dialogue.map((item) => item.id),
      'dialogue',
    )
    assertUnique(
      ctx,
      caseDef.characters.map((item) => item.id),
      'characters',
    )
    assertUnique(
      ctx,
      caseDef.connections.map((item) => item.id),
      'connections',
    )
    assertUnique(
      ctx,
      caseDef.acts.map((act) => String(act.number)),
      'acts',
    )

    for (const [index, act] of caseDef.acts.entries()) {
      if (act.number !== index + 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['acts', index, 'number'],
          message: `Act numbers must be contiguous starting at 1; expected ${index + 1}, received ${act.number}`,
        })
      }
      collectUnlockRefs(act.completeWhen, (ref) => {
        validateUnlockRef(ctx, ref, {
          evidenceIds,
          puzzleIds,
          dialogueIds,
          actNumbers,
          path: ['acts', index, 'completeWhen'],
        })
      })
    }

    for (const [index, item] of caseDef.evidence.entries()) {
      for (const [relIndex, relatedId] of item.relatedEvidenceIds.entries()) {
        if (!evidenceIds.has(relatedId)) {
          ctx.addIssue({
            code: 'custom',
            path: ['evidence', index, 'relatedEvidenceIds', relIndex],
            message: `Unknown related evidence id "${relatedId}"`,
          })
        }
      }
      collectUnlockRefs(item.unlock, (ref) => {
        validateUnlockRef(ctx, ref, {
          evidenceIds,
          puzzleIds,
          dialogueIds,
          actNumbers,
          path: ['evidence', index, 'unlock'],
        })
      })
    }

    for (const [index, puzzle] of caseDef.puzzles.entries()) {
      if (!actNumbers.has(puzzle.act)) {
        ctx.addIssue({
          code: 'custom',
          path: ['puzzles', index, 'act'],
          message: `Puzzle references unknown act ${puzzle.act}`,
        })
      }
      collectUnlockRefs(puzzle.unlock, (ref) => {
        validateUnlockRef(ctx, ref, {
          evidenceIds,
          puzzleIds,
          dialogueIds,
          actNumbers,
          path: ['puzzles', index, 'unlock'],
        })
      })
    }

    for (const [index, dialogue] of caseDef.dialogue.entries()) {
      if (!characterIds.has(dialogue.characterId)) {
        ctx.addIssue({
          code: 'custom',
          path: ['dialogue', index, 'characterId'],
          message: `Unknown character id "${dialogue.characterId}"`,
        })
      }
      collectUnlockRefs(dialogue.unlock, (ref) => {
        validateUnlockRef(ctx, ref, {
          evidenceIds,
          puzzleIds,
          dialogueIds,
          actNumbers,
          path: ['dialogue', index, 'unlock'],
        })
      })
    }

    for (const [index, connection] of caseDef.connections.entries()) {
      for (const [pairIndex, evidenceId] of connection.evidenceIds.entries()) {
        if (!evidenceIds.has(evidenceId)) {
          ctx.addIssue({
            code: 'custom',
            path: ['connections', index, 'evidenceIds', pairIndex],
            message: `Unknown evidence id "${evidenceId}" in connection`,
          })
        }
      }
    }

    for (const [index, eventId] of caseDef.timelineEventIds.entries()) {
      // Timeline event IDs are free-form labels within the case package.
      if (!eventId.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['timelineEventIds', index],
          message: 'Timeline event id must be non-empty',
        })
      }
    }

    for (const [
      index,
      evidenceId,
    ] of caseDef.scoring.scoredEvidenceIds.entries()) {
      if (!evidenceIds.has(evidenceId)) {
        ctx.addIssue({
          code: 'custom',
          path: ['scoring', 'scoredEvidenceIds', index],
          message: `Unknown scored evidence id "${evidenceId}"`,
        })
      }
    }

    for (const [
      index,
      puzzleId,
    ] of caseDef.scoring.contradictionPuzzleIds.entries()) {
      if (!puzzleIds.has(puzzleId)) {
        ctx.addIssue({
          code: 'custom',
          path: ['scoring', 'contradictionPuzzleIds', index],
          message: `Unknown contradiction puzzle id "${puzzleId}"`,
        })
      }
    }

    if (!puzzleIds.has(caseDef.scoring.classificationPuzzleId)) {
      ctx.addIssue({
        code: 'custom',
        path: ['scoring', 'classificationPuzzleId'],
        message: `Unknown classification puzzle id "${caseDef.scoring.classificationPuzzleId}"`,
      })
    }

    for (const [
      index,
      eventId,
    ] of caseDef.scoring.correctTimelineOrder.entries()) {
      if (!timelineIds.has(eventId)) {
        ctx.addIssue({
          code: 'custom',
          path: ['scoring', 'correctTimelineOrder', index],
          message: `Unknown timeline event id "${eventId}"`,
        })
      }
    }

    void connectionIds
  })

export type CaseDefinition = z.infer<typeof caseDefinitionSchema>
export type CharacterDefinition = z.infer<typeof characterSchema>
export type ConnectionDefinition = z.infer<typeof connectionSchema>
export type ActDefinition = z.infer<typeof actSchema>
export type ScoringConfig = z.infer<typeof scoringConfigSchema>
export type VerdictQuestion = z.infer<typeof verdictQuestionSchema>

type UnlockRef =
  | { kind: 'evidence'; id: string }
  | { kind: 'puzzle'; id: string }
  | { kind: 'dialogue'; id: string }
  | { kind: 'act'; act: number }

function assertUnique(
  ctx: z.RefinementCtx,
  ids: string[],
  field: string,
): void {
  const seen = new Set<string>()
  for (const [index, id] of ids.entries()) {
    if (seen.has(id)) {
      ctx.addIssue({
        code: 'custom',
        path: [field, index],
        message: `Duplicate ${field} id "${id}"`,
      })
    }
    seen.add(id)
  }
}

function collectUnlockRefs(
  condition: z.infer<typeof unlockConditionSchema>,
  visit: (ref: UnlockRef) => void,
): void {
  switch (condition.type) {
    case 'always':
      return
    case 'evidenceAll':
    case 'evidenceAny':
      for (const id of condition.evidenceIds) {
        visit({ kind: 'evidence', id })
      }
      return
    case 'puzzlesAll':
      for (const id of condition.puzzleIds) {
        visit({ kind: 'puzzle', id })
      }
      return
    case 'dialogueCompleted':
      for (const id of condition.dialogueIds) {
        visit({ kind: 'dialogue', id })
      }
      return
    case 'actAtLeast':
      visit({ kind: 'act', act: condition.act })
      return
    case 'all':
    case 'any':
      for (const child of condition.of) {
        collectUnlockRefs(child, visit)
      }
  }
}

function validateUnlockRef(
  ctx: z.RefinementCtx,
  ref: UnlockRef,
  catalogs: {
    evidenceIds: Set<string>
    puzzleIds: Set<string>
    dialogueIds: Set<string>
    actNumbers: Set<number>
    path: (string | number)[]
  },
): void {
  if (ref.kind === 'evidence' && !catalogs.evidenceIds.has(ref.id)) {
    ctx.addIssue({
      code: 'custom',
      path: catalogs.path,
      message: `Unlock references unknown evidence id "${ref.id}"`,
    })
  }
  if (ref.kind === 'puzzle' && !catalogs.puzzleIds.has(ref.id)) {
    ctx.addIssue({
      code: 'custom',
      path: catalogs.path,
      message: `Unlock references unknown puzzle id "${ref.id}"`,
    })
  }
  if (ref.kind === 'dialogue' && !catalogs.dialogueIds.has(ref.id)) {
    ctx.addIssue({
      code: 'custom',
      path: catalogs.path,
      message: `Unlock references unknown dialogue id "${ref.id}"`,
    })
  }
  if (ref.kind === 'act' && !catalogs.actNumbers.has(ref.act)) {
    ctx.addIssue({
      code: 'custom',
      path: catalogs.path,
      message: `Unlock references unknown act ${ref.act}`,
    })
  }
}

export type CaseValidationError = {
  path: string
  message: string
}

export type CaseValidationResult =
  | { success: true; data: CaseDefinition }
  | { success: false; errors: CaseValidationError[] }

export function validateCase(input: unknown): CaseValidationResult {
  const parsed = caseDefinitionSchema.safeParse(input)
  if (parsed.success) {
    return { success: true, data: parsed.data }
  }

  return {
    success: false,
    errors: parsed.error.issues.map((issue) => ({
      path: issue.path.length > 0 ? issue.path.join('.') : '(root)',
      message: issue.message,
    })),
  }
}

export function parseCase(input: unknown): CaseDefinition {
  const result = validateCase(input)
  if (!result.success) {
    const details = result.errors
      .map((error) => `${error.path}: ${error.message}`)
      .join('; ')
    throw new Error(`Invalid case definition: ${details}`)
  }
  return result.data
}
