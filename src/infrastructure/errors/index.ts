/**
 * Infrastructure Error Classes Module
 *
 * Centralized error definitions for infrastructure layer failures.
 * All errors use tagged union pattern (_tag property) for type-safe error handling.
 *
 * @example
 * ```typescript
 * import { ServerCreationError } from '@/infrastructure/errors'
 *
 * throw new ServerCreationError(error)
 * ```
 */

export { AuthError } from './auth-error'
export { CSSCompilationError } from './css-compilation-error'
export { ServerCreationError } from './server-creation-error'
