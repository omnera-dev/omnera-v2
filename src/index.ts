import {
  startServer,
  type StartOptions,
  type AppValidationError,
} from '@/application/use-cases/StartServer'
import type { CSSCompilationError } from '@/infrastructure/services/css-compiler'
import type { ServerInstance, ServerCreationError } from '@/infrastructure/services/server'
import type { Effect } from 'effect'

// Re-export StartOptions for convenience
export type { StartOptions }

/**
 * Starts an Omnera web server with the given application configuration
 *
 * This is the main entry point for Omnera applications. It:
 * 1. Validates the app configuration using Effect Schema
 * 2. Compiles Tailwind CSS dynamically using PostCSS
 * 3. Creates a Hono web server with React SSR
 * 4. Serves the homepage at "/" and compiled CSS at "/output.css"
 * 5. Returns a ServerInstance with server details and stop capability
 *
 * ## Architecture
 *
 * - **Effect-based**: All operations use Effect for type-safe error handling
 * - **React SSR**: Homepage rendered server-side with React 19 components
 * - **Dynamic CSS**: Tailwind CSS compiled on-the-fly (no build step)
 * - **Type-safe**: AppSchema validation ensures data integrity
 * - **Graceful shutdown**: stop Effect properly closes the server
 *
 * @param app - Application configuration (name and description)
 * @param options - Optional server configuration (port, hostname)
 * @returns Effect that yields ServerInstance or error
 *
 * @example
 * Basic usage:
 * ```typescript
 * import { Effect } from 'effect'
 * import { start } from '@/index'
 *
 * const myApp = {
 *   name: 'Todo App',
 *   description: 'A fullstack todo application with user authentication'
 * }
 *
 * const program = Effect.gen(function* () {
 *   const server = yield* start(myApp)
 *   console.log(`Server running at ${server.url}`)
 *
 *   // Stop server after 5 seconds
 *   yield* Effect.sleep('5 seconds')
 *   yield* server.stop
 * })
 *
 * Effect.runPromise(program)
 * ```
 *
 * @example
 * With custom port:
 * ```typescript
 * const server = yield* start(myApp, { port: 8080, hostname: '0.0.0.0' })
 * ```
 *
 * @example
 * With error handling:
 * ```typescript
 * const program = start(myApp).pipe(
 *   Effect.tap((server) => Console.log(`Server started at ${server.url}`)),
 *   Effect.catchAll((error) => Console.error('Failed to start server:', error))
 * )
 * ```
 */
export const startEffect = (
  app: unknown,
  options: StartOptions = {}
): Effect.Effect<ServerInstance, AppValidationError | ServerCreationError | CSSCompilationError> =>
  startServer(app, options)

/**
 * Re-export types for convenience
 */
export type { App, AppEncoded } from '@/domain/models/app'
export { AppSchema } from '@/domain/models/app'
export type { ServerInstance } from '@/infrastructure/services/server'
export type { CompiledCSS } from '@/infrastructure/services/css-compiler'

/**
 * Re-export utilities for server lifecycle and error handling
 */
export { withGracefulShutdown, logServerInfo } from '@/infrastructure/services/server-lifecycle'
export { handleStartupError, type ServerStartupError } from '@/application/services/error-handling'

/**
 * Re-export simple Promise-based API
 */
export { start, type SimpleServer } from '@/simple'
