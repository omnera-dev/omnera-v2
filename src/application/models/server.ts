import type { Effect } from 'effect'

/**
 * Running server instance with stop capability
 *
 * This represents a domain concept of a running web server
 * that can be controlled (stopped) through Effect operations.
 *
 * The actual server implementation (Bun.serve) is hidden
 * behind this interface to maintain layer separation.
 */
export interface ServerInstance {
  readonly server: ReturnType<typeof Bun.serve>
  readonly url: string
  readonly stop: Effect.Effect<void>
}
