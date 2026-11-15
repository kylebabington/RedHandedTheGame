import { z } from 'zod'
import { unlockConditionSchema } from './unlock'

export const puzzleTypeSchema = z.enum([
  'evidence-comparison',
  'timeline-ordering',
  'contradiction',
  'classification',
  'evidence-connection',
  'final-verdict',
])

export type PuzzleType = z.infer<typeof puzzleTypeSchema>

export const puzzleSolutionSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('exact'),
    value: z.string().min(1),
  }),
  z.object({
    kind: z.literal('order'),
    value: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    kind: z.literal('map'),
    value: z.record(z.string(), z.string().min(1)),
  }),
])

export type PuzzleSolution = z.infer<typeof puzzleSolutionSchema>

export const puzzleAnswerSchema = z.union([
  z.string().min(1),
  z.array(z.string().min(1)).min(1),
  z.record(z.string(), z.string().min(1)),
])

export type PuzzleAnswer = z.infer<typeof puzzleAnswerSchema>

export const puzzleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: puzzleTypeSchema,
  act: z.number().int().positive(),
  unlock: unlockConditionSchema,
  solution: puzzleSolutionSchema,
})

export type PuzzleDefinition = z.infer<typeof puzzleSchema>
