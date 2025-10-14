import { Effect, Console } from 'effect'
import { Hono } from 'hono'
import type { App } from '@/schema'
import { renderHomePage } from '@/components/HomePage'
import { compileCSS, type CSSCompilationError } from './css-compiler'

/**
 * Error class for server creation failures
 */
export class ServerCreationError {
  readonly _tag = 'ServerCreationError'
  constructor(readonly cause: unknown) {}
}

/**
 * Server configuration options
 */
export interface ServerConfig {
  readonly app: App
  readonly port?: number
  readonly hostname?: string
}

/**
 * Running server instance with stop capability
 */
export interface ServerInstance {
  readonly server: ReturnType<typeof Bun.serve>
  readonly url: string
  readonly stop: Effect.Effect<void>
}

/**
 * Creates a Hono application with routes
 *
 * @param app - Validated application data from AppSchema
 * @returns Configured Hono app instance
 */
function createHonoApp(app: App): Hono {
  const honoApp = new Hono()

  // Health check route
  honoApp.get('/health', (c) => {
    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      app: {
        name: app.name,
        description: app.description,
      },
    })
  })

  // Homepage route - Renders React component to HTML
  honoApp.get('/', (c) => {
    const html = renderHomePage(app)
    return c.html(html)
  })

  // CSS route - Serves dynamically compiled Tailwind CSS
  honoApp.get('/output.css', async (c) => {
    try {
      // Compile CSS using Effect
      const result = await Effect.runPromise(
        compileCSS().pipe(Effect.tap(() => Console.log('CSS compiled successfully')))
      )

      return c.text(result.css, 200, {
        'Content-Type': 'text/css',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      })
    } catch (error) {
      console.error('CSS compilation failed:', error)
      return c.text('/* CSS compilation failed */', 500, {
        'Content-Type': 'text/css',
      })
    }
  })

  // 404 handler
  honoApp.notFound((c) => {
    return c.html(
      `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>404 - Not Found</title>
          <link rel="stylesheet" href="/output.css">
        </head>
        <body class="min-h-screen bg-gray-50 flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p class="text-xl text-gray-600 mb-8">Page not found</p>
            <a href="/" class="text-blue-600 hover:text-blue-700 font-medium">Go back home</a>
          </div>
        </body>
      </html>
      `,
      404
    )
  })

  // Error handler
  honoApp.onError((error, c) => {
    console.error('Server error:', error)
    return c.html(
      `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>500 - Internal Server Error</title>
          <link rel="stylesheet" href="/output.css">
        </head>
        <body class="min-h-screen bg-gray-50 flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-6xl font-bold text-red-600 mb-4">500</h1>
            <p class="text-xl text-gray-600 mb-8">Internal Server Error</p>
            <a href="/" class="text-blue-600 hover:text-blue-700 font-medium">Go back home</a>
          </div>
        </body>
      </html>
      `,
      500
    )
  })

  return honoApp
}

/**
 * Creates and starts a Bun server with Hono
 *
 * This function:
 * 1. Pre-compiles CSS on startup for faster initial requests
 * 2. Creates a Hono app with routes (/, /output.css, /health)
 * 3. Starts a Bun HTTP server
 * 4. Returns server instance with stop capability
 *
 * @param config - Server configuration with app data and optional port/hostname
 * @returns Effect that yields ServerInstance or ServerCreationError
 *
 * @example
 * ```typescript
 * const program = Effect.gen(function* () {
 *   const server = yield* createServer({
 *     app: { name: 'My App', description: 'A great app' },
 *     port: 3000
 *   })
 *   console.log(`Server running at ${server.url}`)
 * })
 *
 * Effect.runPromise(program)
 * ```
 */
export const createServer = (
  config: ServerConfig
): Effect.Effect<ServerInstance, ServerCreationError | CSSCompilationError> =>
  Effect.gen(function* () {
    const { app, port = 3000, hostname = 'localhost' } = config

    // Pre-compile CSS on startup
    yield* Console.log('Compiling CSS...')
    const cssResult = yield* compileCSS()
    yield* Console.log(`CSS compiled: ${cssResult.css.length} bytes`)

    // Create Hono app
    const honoApp = createHonoApp(app)

    // Start Bun server
    const server = yield* Effect.try({
      try: () =>
        Bun.serve({
          port,
          hostname,
          fetch: honoApp.fetch,
        }),
      catch: (error) => new ServerCreationError(error),
    })

    const url = `http://${hostname}:${port}`

    // Create stop effect
    const stop = Effect.gen(function* () {
      yield* Console.log('Stopping server...')
      yield* Effect.sync(() => server.stop())
      yield* Console.log('Server stopped')
    })

    return {
      server,
      url,
      stop,
    }
  })
