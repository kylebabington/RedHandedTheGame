import { z } from 'zod'

/** Current save/game state schema version for The Evidence Room engine. */
export const GAME_STATE_SCHEMA_VERSION = 1

export const gameStateSchema = z.object({
  schemaVersion: z.literal(GAME_STATE_SCHEMA_VERSION),
  caseId: z.string().min(1),
  currentAct: z.number().int().positive(),
  discoveredEvidence: z.array(z.string().min(1)),
  inspectedEvidence: z.array(z.string().min(1)),
  completedPuzzles: z.array(z.string().min(1)),
  unlockedDialogue: z.array(z.string().min(1)),
  completedDialogue: z.array(z.string().min(1)),
  evidenceConnections: z.array(z.string().min(1)),
  timelineOrder: z.array(z.string().min(1)),
  verdictSubmitted: z.boolean(),
})

export type GameState = z.infer<typeof gameStateSchema>

export function createInitialState(caseId: string): GameState {
  return {
    schemaVersion: GAME_STATE_SCHEMA_VERSION,
    caseId,
    currentAct: 1,
    discoveredEvidence: [],
    inspectedEvidence: [],
    completedPuzzles: [],
    unlockedDialogue: [],
    completedDialogue: [],
    evidenceConnections: [],
    timelineOrder: [],
    verdictSubmitted: false,
  }
}
