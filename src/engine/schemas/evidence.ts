import { z } from 'zod'
import { unlockConditionSchema } from './unlock'

export const evidenceTypeSchema = z.enum([
  'document',
  'photograph',
  'audio',
  'diagram',
  'record',
  'physical',
])

export type EvidenceType = z.infer<typeof evidenceTypeSchema>

export const evidenceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  type: evidenceTypeSchema,
  assetRef: z.string().min(1).optional(),
  relatedEvidenceIds: z.array(z.string().min(1)).default([]),
  unlock: unlockConditionSchema,
  accessibilityDescription: z.string().min(1),
})

export type EvidenceDefinition = z.infer<typeof evidenceSchema>
