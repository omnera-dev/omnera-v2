/**
 * Simple Promise-based API for Omnera
 *
 * This module provides a straightforward Promise-based interface for starting
 * an Omnera server without requiring knowledge of Effect. It wraps the
 * Effect-based implementation in Promises for ease of use.
 */

import { Effect } from 'effect'
import { startEffect, withGracefulShutdown, logServerInfo } from '@/index'
import type { StartOptions } from '@/index'
import type { ServerInstance } from '@/services/server'

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
 * This is a simplified API that doesn't require knowledge of Effect.
 * It starts the server, logs startup information, sets up graceful shutdown
 * handling, and returns a simple server interface.
 *
 * @param app - Application configuration with name and description
 * @param options - Optional server configuration (port, hostname)
 * @returns Promise that resolves to a simple server interface
 *
 * @example
 * Basic usage:
 * ```typescript
 * import { start } from '@/simple'
 *
 * const myApp = {
 *   name: 'My App',
 *   description: 'A simple application'
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
    const server = yield* startEffect(app, options)

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
