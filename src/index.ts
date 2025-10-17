/**
 * Omnera - A Bun web framework with React SSR and Tailwind CSS
 *
 * This is the main entry point for Omnera applications. It provides a simple
 * Promise-based API for starting a web server with automatic:
 * - React 19 server-side rendering
 * - Tailwind CSS compilation (no build step)
 * - Type-safe configuration validation
 * - Graceful shutdown handling
 */

import { Effect } from 'effect'
import { startServer } from '@/application/use-cases/server/StartServer'
import { withGracefulShutdown, logServerInfo } from '@/infrastructure/services/server-lifecycle'
import type { StartOptions } from '@/application/use-cases/server/StartServer'
import type { ServerInstance } from '@/infrastructure/services/server'

/**
 * Simple server interface with Promise-based methods
 */
export interface SimpleServer {
  /**
   * Server URL (e.g., "http://localhost:3000")
   */
  readonly url: string

  /**
   * Stop the server gracefully
   * @returns Promise that resolves when server is stopped
   */
  stop: () => Promise<void>
}

/**
 * Convert Effect-based ServerInstance to simple Promise-based interface
 */
const toSimpleServer = (server: ServerInstance): SimpleServer => ({
  url: server.url,
  stop: () => Effect.runPromise(server.stop),
})

/**
 * Start an Omnera server with automatic logging and graceful shutdown
 *
 * This is the main entry point for Omnera applications. It:
 * 1. Validates the app configuration using Effect Schema
 * 2. Compiles Tailwind CSS dynamically using PostCSS
 * 3. Creates a Hono web server with React SSR
 * 4. Serves the homepage at "/" and compiled CSS at "/output.css"
 * 5. Sets up graceful shutdown handlers (SIGINT, SIGTERM)
 * 6. Returns a simple server interface with url and stop method
 *
 * @param app - Application configuration with name and description
 * @param options - Optional server configuration (port, hostname)
 * @returns Promise that resolves to a simple server interface
 *
 * @example
 * Basic usage:
 * ```typescript
 * import { start } from 'omnera'
 *
 * const myApp = {
 *   name: 'My App',
 *   description: 'A simple Bun application'
 * }
 *
 * // Start with default port (3000) and hostname ('localhost')
 * const server = await start(myApp)
 * console.log(`Server running at ${server.url}`)
 * // Server stays alive until Ctrl+C
 * ```
 *
 * @example
 * With custom configuration:
 * ```typescript
 * const server = await start(myApp, {
 *   port: 8080,
 *   hostname: '0.0.0.0'
 * })
 * ```
 *
 * @example
 * With error handling:
 * ```typescript
 * start(myApp).catch((error) => {
 *   console.error('Failed to start server:', error)
 *   process.exit(1)
 * })
 * ```
 */
export const start = async (app: unknown, options: StartOptions = {}): Promise<SimpleServer> => {
  const program = Effect.gen(function* () {
    console.log('Starting Omnera server...')

    // Start the server
    const server = yield* startServer(app, options)

    // Log server information
    yield* logServerInfo(server)

    // Setup graceful shutdown (keeps process alive)
    yield* withGracefulShutdown(server)

    // This line is never reached due to Effect.never in withGracefulShutdown
    // But TypeScript needs a return value
    return server
  })

  // Run the Effect program and convert to simple server interface
  const server = await Effect.runPromise(program)
  return toSimpleServer(server)
}

/**
 * Re-export types for convenience
 */
export type { StartOptions }
export type { App, AppEncoded } from '@/domain/models/app'
export { AppSchema } from '@/domain/models/app'
