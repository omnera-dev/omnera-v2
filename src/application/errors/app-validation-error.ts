/**
 * Error class for app validation failures
 */
export class AppValidationError {
  readonly _tag = 'AppValidationError'
  constructor(readonly cause: unknown) {}
}
