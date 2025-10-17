#!/usr/bin/env bun
/**
 * Omnera CLI - Command-line interface for starting an Omnera server
 *
 * This script allows running an Omnera server from the command line using
 * environment variables for configuration.
 *
 * ## Usage
 *
 * ```bash
 * # Using JSON schema environment variable
 * OMNERA_APP_SCHEMA='{"name":"My App","description":"Description"}' bun run omnera
 *
 * # Or with npx
 * OMNERA_APP_SCHEMA='{"name":"My App"}' npx omnera
 *
 * # With custom port and hostname
 * OMNERA_PORT=8080 OMNERA_HOSTNAME="0.0.0.0" OMNERA_APP_SCHEMA='{"name":"My App"}' bun run omnera
 * ```
 *
 * ## Environment Variables
 *
 * - `OMNERA_APP_SCHEMA` (required) - JSON string containing app configuration (name, description, etc.)
 * - `OMNERA_PORT` (optional) - Server port (default: 3000)
 * - `OMNERA_HOSTNAME` (optional) - Server hostname (default: localhost)
 */

import { Effect, Console } from 'effect'
import { start, type StartOptions } from '@/index'

interface AppSchema {
  name?: string
  description?: string
  [key: string]: unknown
}

// Read environment variables (Bun-specific)
const appSchemaString = Bun.env.OMNERA_APP_SCHEMA
const port = Bun.env.OMNERA_PORT
const hostname = Bun.env.OMNERA_HOSTNAME

// Validate required environment variables
if (!appSchemaString) {
  Effect.runSync(
    Effect.gen(function* () {
      yield* Console.error('Error: OMNERA_APP_SCHEMA environment variable is required')
      yield* Console.error('')
      yield* Console.error('Usage:')
      yield* Console.error('  OMNERA_APP_SCHEMA=\'{"name":"My App"}\' bun run omnera')
      yield* Console.error('')
      yield* Console.error('Example with description:')
      yield* Console.error(
        '  OMNERA_APP_SCHEMA=\'{"name":"My App","description":"My Description"}\' bun run omnera'
      )
      yield* Console.error('')
      yield* Console.error('Optional environment variables:')
      yield* Console.error('  OMNERA_PORT - Server port (default: 3000)')
      yield* Console.error('  OMNERA_HOSTNAME - Server hostname (default: localhost)')
    })
  )
  // Terminate process - imperative statement required for CLI
  // eslint-disable-next-line functional/no-expression-statements
  process.exit(1)
}

// Parse app schema JSON
const app: Readonly<AppSchema> = (() => {
  try {
    return JSON.parse(appSchemaString) as AppSchema
  } catch {
    Effect.runSync(
      Effect.gen(function* () {
        yield* Console.error('Error: OMNERA_APP_SCHEMA must be valid JSON')
        yield* Console.error('')
        yield* Console.error('Received:', appSchemaString)
        yield* Console.error('')
        yield* Console.error('Example:')
        yield* Console.error(
          '  OMNERA_APP_SCHEMA=\'{"name":"My App","description":"My Description"}\' bun run omnera'
        )
      })
    )
    // Terminate process - imperative statement required for CLI
    // eslint-disable-next-line functional/no-expression-statements
    process.exit(1)
  }
})()

// Build server options
const options: StartOptions = (() => {
  if (!port && !hostname) {
    return {}
  }

  const parsedPort = port ? parseInt(port, 10) : undefined
  if (parsedPort !== undefined && (isNaN(parsedPort) || parsedPort < 0 || parsedPort > 65_535)) {
    Effect.runSync(
      Console.error(
        `Error: Invalid port number "${port}". Must be between 0 and 65535 (0 = auto-select).`
      )
    )
    // Terminate process - imperative statement required for CLI
    // eslint-disable-next-line functional/no-expression-statements
    process.exit(1)
  }

  return {
    ...(parsedPort !== undefined && { port: parsedPort }),
    ...(hostname && { hostname }),
  }
})()

// Start the server
Effect.runSync(
  Effect.gen(function* () {
    yield* Console.log('Starting Omnera server from CLI...')
    yield* Console.log(`App: ${app.name}${app.description ? ` - ${app.description}` : ''}`)
    if (options.port) yield* Console.log(`Port: ${options.port}`)
    if (options.hostname) yield* Console.log(`Hostname: ${options.hostname}`)
    yield* Console.log('')
  })
)

// CLI entry point - side effects required to start server and handle errors
// eslint-disable-next-line functional/no-expression-statements
start(app, options).catch((error) => {
  Effect.runSync(Console.error('Failed to start server:', error))
  // Terminate process - imperative statement required for CLI
  // eslint-disable-next-line functional/no-expression-statements
  process.exit(1)
})
