/**
 * Error class for CSS compilation failures
 */
export class CSSCompilationError {
  readonly _tag = 'CSSCompilationError'
  constructor(readonly cause: unknown) {}
}
