/**
 * Server Infrastructure Module
 *
 * Provides HTTP server creation, lifecycle management, and factory implementations.
 * Uses Hono web framework with graceful shutdown support.
 *
 * @example
 * ```typescript
 * import { ServerFactoryLive } from '@/infrastructure/server'
 *
 * const program = startServer(config).pipe(
 *   Effect.provide(ServerFactoryLive)
 * )
 * ```
 */

export { createServer } from './server'
export { withGracefulShutdown } from './lifecycle'
export { ServerFactoryLive } from './server-factory-live'
