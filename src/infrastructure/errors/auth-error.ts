/**
 * Auth Error
 *
 * Tagged error for authentication failures.
 */
export class AuthError {
  readonly _tag = 'AuthError'
  constructor(readonly cause: unknown) {}
}
