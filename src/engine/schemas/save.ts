import { z } from 'zod'
import { GAME_STATE_SCHEMA_VERSION, gameStateSchema } from './gameState'

/**
 * Verdict answers are intentionally outside the GameState contract
 * (which only persists `verdictSubmitted`). Callers supply them to
 * `calculateScore` / `submitVerdict`. The save envelope may optionally
 * carry them so a resumed session can score without re-asking.
 */
export const verdictAnswersSchema = z.record(z.string(), z.string().min(1))

export type VerdictAnswers = z.infer<typeof verdictAnswersSchema>

export const saveEnvelopeSchema = z.object({
  schemaVersion: z.literal(GAME_STATE_SCHEMA_VERSION),
  caseId: z.string().min(1),
  state: gameStateSchema,
  verdictAnswers: verdictAnswersSchema.optional(),
})

export type SaveEnvelope = z.infer<typeof saveEnvelopeSchema>
