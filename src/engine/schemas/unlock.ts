import { z } from 'zod'

export type UnlockCondition =
  | { type: 'always' }
  | { type: 'evidenceAll'; evidenceIds: string[] }
  | { type: 'evidenceAny'; evidenceIds: string[] }
  | { type: 'puzzlesAll'; puzzleIds: string[] }
  | { type: 'dialogueCompleted'; dialogueIds: string[] }
  | { type: 'actAtLeast'; act: number }
  | { type: 'all'; of: UnlockCondition[] }
  | { type: 'any'; of: UnlockCondition[] }

export const unlockConditionSchema: z.ZodType<UnlockCondition> = z.lazy(() =>
  z.discriminatedUnion('type', [
    z.object({ type: z.literal('always') }),
    z.object({
      type: z.literal('evidenceAll'),
      evidenceIds: z.array(z.string().min(1)).min(1),
    }),
    z.object({
      type: z.literal('evidenceAny'),
      evidenceIds: z.array(z.string().min(1)).min(1),
    }),
    z.object({
      type: z.literal('puzzlesAll'),
      puzzleIds: z.array(z.string().min(1)).min(1),
    }),
    z.object({
      type: z.literal('dialogueCompleted'),
      dialogueIds: z.array(z.string().min(1)).min(1),
    }),
    z.object({
      type: z.literal('actAtLeast'),
      act: z.number().int().positive(),
    }),
    z.object({
      type: z.literal('all'),
      of: z.array(unlockConditionSchema).min(1),
    }),
    z.object({
      type: z.literal('any'),
      of: z.array(unlockConditionSchema).min(1),
    }),
  ]),
)
