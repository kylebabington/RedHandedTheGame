import type { GameState } from '../schemas/gameState'
import type { UnlockCondition } from '../schemas/unlock'

export function isUnlocked(
  condition: UnlockCondition,
  state: GameState,
): boolean {
  switch (condition.type) {
    case 'always':
      return true
    case 'evidenceAll':
      return condition.evidenceIds.every((id) =>
        state.discoveredEvidence.includes(id),
      )
    case 'evidenceAny':
      return condition.evidenceIds.some((id) =>
        state.discoveredEvidence.includes(id),
      )
    case 'puzzlesAll':
      return condition.puzzleIds.every((id) =>
        state.completedPuzzles.includes(id),
      )
    case 'dialogueCompleted':
      return condition.dialogueIds.every((id) =>
        state.completedDialogue.includes(id),
      )
    case 'actAtLeast':
      return state.currentAct >= condition.act
    case 'all':
      return condition.of.every((child) => isUnlocked(child, state))
    case 'any':
      return condition.of.some((child) => isUnlocked(child, state))
  }
}
