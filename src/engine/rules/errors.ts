export type EngineErrorCode =
  | 'LOCKED'
  | 'NOT_FOUND'
  | 'INVALID_ANSWER'
  | 'INVALID_STATE'
  | 'INVALID_SAVE'
  | 'ALREADY_DONE'

export class EngineError extends Error {
  readonly code: EngineErrorCode
  readonly details?: string

  constructor(code: EngineErrorCode, message: string, details?: string) {
    super(message)
    this.name = 'EngineError'
    this.code = code
    this.details = details
  }
}
