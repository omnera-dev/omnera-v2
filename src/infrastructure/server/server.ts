import { Console, Effect } from 'effect'
import { Hono } from 'hono'
import { ServerCreationError } from '@/infrastructure/errors/server-creation-error'
import { compileCSS } from '../css/compiler'
import type { ServerInstance } from '@/application/models/server'
import type { App } from '@/domain/models/app'
import type { CSSCompilationError } from '@/infrastructure/errors/css-compilation-error'

/**
 * Cache duration for CSS files in seconds (1 hour)
 */
const CSS_CACHE_DURATION_SECONDS = 3600

/**
 * Server configuration options
 */
export interface ServerConfig {
  readonly app: App
  readonly port?: number
  readonly hostname?: string
  readonly renderHomePage: (app: App) => string
  readonly renderNotFoundPage: () => string
  readonly renderErrorPage: () => string
}

/**
 * Creates a Hono application with routes
 *
 * @param app - Validated application data from AppSchema
 * @param renderHomePage - Function to render the homepage
 * @param renderNotFoundPage - Function to render 404 page
 * @param renderErrorPage - Function to render error page
 * @returns Configured Hono app instance
 */
function createHonoApp(
  app: App,
  renderHomePage: (app: App) => string,
  renderNotFoundPage: () => string,
  renderErrorPage: () => string
): Readonly<Hono> {
  return new Hono()
    .get('/health', (c) =>
      c.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        app: {
          name: app.name,
        },
      })
    )
    .get('/', (c) => {
      const html = renderHomePage(app)
      return c.html(html)
    })
    .get('/output.css', async (c) => {
      try {
        const result = await Effect.runPromise(
          compileCSS().pipe(Effect.tap(() => Console.log('CSS compiled successfully')))
        )

        return c.text(result.css, 200, {
          'Content-Type': 'text/css',
          'Cache-Control': `public, max-age=${CSS_CACHE_DURATION_SECONDS}`,
        })
      } catch (error) {
        Effect.runSync(Console.error('CSS compilation failed:', error))
        return c.text('/* CSS compilation failed */', 500, {
          'Content-Type': 'text/css',
        })
      }
    })
    .notFound((c) => c.html(renderNotFoundPage(), 404))
    .onError((error, c) => {
      Effect.runSync(Console.error('Server error:', error))
      return c.html(renderErrorPage(), 500)
    })
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
 *     app: { name: 'My App' },
 *     port: 3000
 *   })
 *   console.log(`Server running at ${server.url}`)
 * })
 *
 * Effect.runPromise(program)
 * ```
 */
// @knip-ignore - Used via dynamic import in StartServer.ts
export const createServer = (
  config: ServerConfig
): Effect.Effect<ServerInstance, ServerCreationError | CSSCompilationError> =>
  Effect.gen(function* () {
    const {
      app,
      port = 3000,
      hostname = 'localhost',
      renderHomePage,
      renderNotFoundPage,
      renderErrorPage,
    } = config

    // Pre-compile CSS on startup
    yield* Console.log('Compiling CSS...')
    const cssResult = yield* compileCSS()
    yield* Console.log(`CSS compiled: ${cssResult.css.length} bytes`)

    // Create Hono app
    const honoApp = createHonoApp(app, renderHomePage, renderNotFoundPage, renderErrorPage)

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

    // Use actual port from server (important when port is 0)
    const actualPort = server.port
    const url = `http://${hostname}:${actualPort}`

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
