export { createGame, type GameEngine, type LoadSaveResult } from './createGame'
export {
  createLocalStorageAdapter,
  createMemoryStorage,
  type KeyValueStorage,
} from './persistence/storage'
export {
  validateSaveAgainstCase,
  type SaveValidationError,
  type SaveValidationResult,
} from './persistence/validateSave'
export { EngineError, type EngineErrorCode } from './rules/errors'
export { isUnlocked } from './rules/unlocks'
export {
  calculateScore,
  type CategoryScore,
  type ScoreResult,
} from './scoring/calculateScore'
export {
  SCORE_WEIGHTS,
  ratingForScore,
  type InvestigatorRating,
} from './scoring/ratings'
export * from './schemas'
