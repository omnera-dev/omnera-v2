/**
 * Example usage of Omnera's start function
 *
 * This file demonstrates how to create and run an Omnera web application
 * with Effect-based server management, React SSR, and dynamic Tailwind CSS.
 *
 * ## Running this example
 *
 * ```bash
 * bun run example.ts
 * ```
 *
 * Then visit http://localhost:3000 in your browser.
 *
 * ## Key Features Demonstrated
 *
 * 1. Effect-based error handling
 * 2. AppSchema validation
 * 3. Graceful server shutdown with SIGINT
 * 4. React SSR with Typography components
 * 5. Dynamic Tailwind CSS compilation
 */

import { Effect, Console } from 'effect'
import { start } from './src/index'

// Define your application configuration
const myApp = {
  name: 'Omnera Demo',
  description:
    'A modern fullstack TypeScript framework built with Bun, Effect, Hono, React, and Tailwind CSS',
}

// Create the main program using Effect
const program = Effect.gen(function* () {
  // Start the server
  yield* Console.log('Starting Omnera server...')

  const server = yield* start(myApp, {
    port: 3000,
    hostname: 'localhost',
  })

  yield* Console.log('✓ Server started successfully!')
  yield* Console.log(`✓ Homepage: ${server.url}`)
  yield* Console.log(`✓ Health check: ${server.url}/health`)
  yield* Console.log(`✓ Compiled CSS: ${server.url}/output.css`)
  yield* Console.log('')
  yield* Console.log('Press Ctrl+C to stop the server')

  // Setup graceful shutdown on SIGINT (Ctrl+C)
  process.on('SIGINT', () => {
    Effect.runPromise(
      Effect.gen(function* () {
        yield* Console.log('\nReceived SIGINT, stopping server...')
        yield* server.stop
        process.exit(0)
      })
    ).catch((error) => {
      console.error('Failed to stop server:', error)
      process.exit(1)
    })
  })

  // Keep the process alive
  yield* Effect.never
})

// Run the program with comprehensive error handling
Effect.runPromise(
  program.pipe(
    Effect.catchAll((error) =>
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

        process.exit(1)
      })
    )
  )
).catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
