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

import { start } from '@/simple'
import type { StartOptions } from '@/index'

interface AppSchema {
  name?: string
  description?: string
  [key: string]: unknown
}

// Read environment variables
const appSchemaString = process.env.OMNERA_APP_SCHEMA || Bun.env.OMNERA_APP_SCHEMA
const port = process.env.OMNERA_PORT || Bun.env.OMNERA_PORT
const hostname = process.env.OMNERA_HOSTNAME || Bun.env.OMNERA_HOSTNAME

// Validate required environment variables
if (!appSchemaString) {
  console.error('Error: OMNERA_APP_SCHEMA environment variable is required')
  console.error('')
  console.error('Usage:')
  console.error('  OMNERA_APP_SCHEMA=\'{"name":"My App"}\' bun run omnera')
  console.error('')
  console.error('Example with description:')
  console.error(
    '  OMNERA_APP_SCHEMA=\'{"name":"My App","description":"My Description"}\' bun run omnera'
  )
  console.error('')
  console.error('Optional environment variables:')
  console.error('  OMNERA_PORT - Server port (default: 3000)')
  console.error('  OMNERA_HOSTNAME - Server hostname (default: localhost)')
  // eslint-disable-next-line functional/no-expression-statements
  process.exit(1)
}

// Parse app schema JSON
const app: AppSchema = (() => {
  try {
    return JSON.parse(appSchemaString) as AppSchema
  } catch {
    console.error('Error: OMNERA_APP_SCHEMA must be valid JSON')
    console.error('')
    console.error('Received:', appSchemaString)
    console.error('')
    console.error('Example:')
    console.error(
      '  OMNERA_APP_SCHEMA=\'{"name":"My App","description":"My Description"}\' bun run omnera'
    )
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
    console.error(
      `Error: Invalid port number "${port}". Must be between 0 and 65535 (0 = auto-select).`
    )
    // eslint-disable-next-line functional/no-expression-statements
    process.exit(1)
  }

  return {
    ...(parsedPort !== undefined && { port: parsedPort }),
    ...(hostname && { hostname }),
  }
})()

// Start the server
console.log('Starting Omnera server from CLI...')
console.log(`App: ${app.name}${app.description ? ` - ${app.description}` : ''}`)
if (options.port) console.log(`Port: ${options.port}`)
if (options.hostname) console.log(`Hostname: ${options.hostname}`)
console.log('')

 
start(app, options).catch((error) => {
  console.error('Failed to start server:', error)
  // eslint-disable-next-line functional/no-expression-statements
  process.exit(1)
})
