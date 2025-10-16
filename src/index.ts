import { Effect, Schema } from 'effect'
import { AppSchema } from '@/schema'
import { createServer, type ServerInstance, type ServerCreationError } from '@/services/server'
import type { App } from '@/schema'
import type { CSSCompilationError } from '@/services/css-compiler'

/**
 * Error class for app validation failures
 */
export class AppValidationError {
  readonly _tag = 'AppValidationError'
  constructor(readonly cause: unknown) {}
}

/**
 * Server configuration options
 */
export interface StartOptions {
  /**
   * Port number for the HTTP server
   * @default 3000
   */
  readonly port?: number

  /**
   * Hostname to bind the server to
   * @default "localhost"
   */
  readonly hostname?: string
}

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
  Effect.gen(function* () {
    // Validate app configuration using Effect Schema
    const validatedApp = yield* Effect.try({
      try: (): App => Schema.decodeUnknownSync(AppSchema)(app),
      catch: (error) => new AppValidationError(error),
    })

    // Create and start server
    const serverInstance = yield* createServer({
      app: validatedApp,
      port: options.port,
      hostname: options.hostname,
    })

    // Return server control interface
    return serverInstance
  })

/**
 * Re-export types for convenience
 */
export type { App, AppEncoded } from '@/schema'
export { AppSchema } from '@/schema'
export type { ServerInstance } from '@/services/server'
export type { CompiledCSS } from '@/services/css-compiler'

/**
 * Re-export utilities for server lifecycle and error handling
 */
export { withGracefulShutdown, logServerInfo } from '@/utils/server-lifecycle'
export { handleStartupError, type ServerStartupError } from '@/utils/error-handling'

/**
 * Re-export simple Promise-based API
 */
export { start, type SimpleServer } from '@/simple'
