import { Effect, Console } from 'effect'
import type { AppValidationError } from '@/application/use-cases/server/start-server'
import type { CSSCompilationError } from '@/infrastructure/css/compiler'
import type { ServerCreationError } from '@/infrastructure/server/server'

/**
 * Error types that can occur during server startup
 */
export type ServerStartupError = AppValidationError | ServerCreationError | CSSCompilationError

/**
 * Handles server startup errors and logs appropriate messages
 *
 * This utility provides comprehensive error handling for all error types
 * that can occur during server startup, including:
 * - App validation errors (invalid configuration)
 * - Server creation errors (port already in use, etc.)
 * - CSS compilation errors (Tailwind/PostCSS issues)
 *
 * @param error - Error that occurred during server startup
 * @returns Effect that logs error details and exits with code 1
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect'
 * import { start } from '@/index'
 * import { handleStartupError } from '@/utils/error-handling'
 *
 * const program = start(myApp).pipe(
 *   Effect.catchAll(handleStartupError)
 * )
 *
 * Effect.runPromise(program)
 * ```
 */
export const handleStartupError = (error: ServerStartupError): Effect.Effect<never> =>
  Effect.gen(function* () {
    yield* Console.error('Failed to start server:')

    // Handle specific error types
    if ('_tag' in error) {
      switch (error._tag) {
        case 'AppValidationError':
          yield* Console.error('Invalid app configuration:', error.cause)
          break
        case 'ServerCreationError':
          yield* Console.error('Server creation failed:', error.cause)
          break
        case 'CSSCompilationError':
          yield* Console.error('CSS compilation failed:', error.cause)
          break
        default:
          yield* Console.error('Unknown error:', error)
      }
    } else {
      yield* Console.error('Unknown error:', error)
    }

    // Exit process with error code
    // eslint-disable-next-line functional/no-expression-statements
    process.exit(1)
  })
