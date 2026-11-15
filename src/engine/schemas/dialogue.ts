import { z } from 'zod'
import { unlockConditionSchema } from './unlock'

export const dialogueSchema = z.object({
  id: z.string().min(1),
  characterId: z.string().min(1),
  title: z.string().min(1),
  unlock: unlockConditionSchema,
})

export type DialogueDefinition = z.infer<typeof dialogueSchema>
