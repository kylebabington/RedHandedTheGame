import { z } from 'zod'
import { unlockConditionSchema } from './unlock'

export const dialogueBeatSchema = z.object({
  speaker: z.enum(['investigator', 'character']),
  text: z.string().min(1),
})

export const dialogueSchema = z.object({
  id: z.string().min(1),
  characterId: z.string().min(1),
  title: z.string().min(1),
  unlock: unlockConditionSchema,
  /** Optional interview lines for content packages; progression uses completeDialogue. */
  beats: z.array(dialogueBeatSchema).default([]),
})

export type DialogueBeat = z.infer<typeof dialogueBeatSchema>
export type DialogueDefinition = z.infer<typeof dialogueSchema>
