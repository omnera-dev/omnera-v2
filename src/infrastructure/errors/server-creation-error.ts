/**
 * Error class for server creation failures
 */
export class ServerCreationError {
  readonly _tag = 'ServerCreationError'
  constructor(readonly cause: unknown) {}
}
