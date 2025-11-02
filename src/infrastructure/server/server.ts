/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Scalar } from '@scalar/hono-api-reference'
import { Console, Effect } from 'effect'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { ServerCreationError } from '@/infrastructure/errors/server-creation-error'
import { createApiRoutes } from '@/presentation/api/app'
import { getOpenAPIDocument } from '@/presentation/api/openapi-schema'
import { auth } from '../auth/better-auth/auth'
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
  readonly renderPage: (app: App, path: string) => string | undefined
  readonly renderNotFoundPage: () => string
  readonly renderErrorPage: () => string
}

/**
 * Creates a Hono application with routes
 *
 * Mounts the following routes:
 * - GET /api/* - API routes (health, tables, records) with RPC type safety
 * - GET /api/openapi.json - Generated OpenAPI specification (application endpoints)
 * - GET /api/auth/openapi.json - Generated OpenAPI specification (authentication endpoints)
 * - GET /api/scalar - Unified Scalar API documentation UI (shows both API and Auth tabs)
 * - POST/GET /api/auth/* - Better Auth authentication endpoints
 * - GET / - Homepage
 * - GET /assets/output.css - Compiled Tailwind CSS
 * - GET /test/error - Test error handler (non-production only)
 *
 * @param app - Validated application data from AppSchema
 * @param renderHomePage - Function to render the homepage
 * @param renderPage - Function to render any page by path
 * @param renderNotFoundPage - Function to render 404 page
 * @param renderErrorPage - Function to render error page
 * @returns Configured Hono app instance
 */
function createHonoApp(
  app: App,
  renderHomePage: (app: App) => string,
  renderPage: (app: App, path: string) => string | undefined,
  renderNotFoundPage: () => string,
  renderErrorPage: () => string
): Readonly<Hono> {
  // Create base Hono app and chain API routes directly
  // This pattern is required for Hono RPC type inference to work correctly
  const honoApp = createApiRoutes(app, new Hono())

  // Continue chaining with other routes
  return (
    honoApp
      .get('/api/openapi.json', (c) => {
        const openApiDoc = getOpenAPIDocument()
        return c.json(openApiDoc)
      })
      .get('/api/auth/openapi.json', async (c) => {
        const authOpenApiDoc = await auth.api.generateOpenAPISchema()
        return c.json(authOpenApiDoc)
      })
      .get(
        '/api/scalar',
        Scalar({
          pageTitle: 'Omnera API Documentation',
          theme: 'default',
          sources: [
            { url: '/api/openapi.json', title: 'API' },
            { url: '/api/auth/openapi.json', title: 'Auth' },
          ],
        })
      )
      // Configure CORS for Better Auth endpoints
      // IMPORTANT: CORS middleware must be registered BEFORE auth routes
      // See: https://www.better-auth.com/docs/integrations/hono
      .use(
        '/api/auth/*',
        cors({
          origin: (origin) => {
            // Allow all localhost origins for development and testing
            if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
              return origin
            }
            // In production, this should be configured with specific allowed origins
            return origin
          },
          allowHeaders: ['Content-Type', 'Authorization'],
          allowMethods: ['POST', 'GET', 'OPTIONS'],
          exposeHeaders: ['Content-Length'],
          maxAge: 600,
          credentials: true, // Required for cookie-based authentication
        })
      )
      .on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))
      .get('/', (c) => {
        try {
          const html = renderHomePage(app)
          return c.html(html)
        } catch (error) {
          // Log rendering error

          console.error('Error rendering homepage:', error)
          return c.html(renderErrorPage(), 500)
        }
      })
      .get('/assets/output.css', async (c) => {
        try {
          const result = await Effect.runPromise(
            compileCSS().pipe(Effect.tap(() => Console.log('CSS compiled successfully')))
          )

          return c.text(result.css, 200, {
            'Content-Type': 'text/css',
            'Cache-Control': `public, max-age=${CSS_CACHE_DURATION_SECONDS}`,
          })
        } catch (error) {
          // Log error - intentional side effect for error tracking
          // eslint-disable-next-line functional/no-expression-statements
          await Effect.runPromise(Console.error('CSS compilation failed:', error))
          return c.text('/* CSS compilation failed */', 500, {
            'Content-Type': 'text/css',
          })
        }
      })
      .get('/assets/language-switcher.js', async (c) => {
        try {
          // Resolve path from project root (where Bun is executed)
          const scriptPath = './src/presentation/scripts/client/language-switcher.js'
          const file = Bun.file(scriptPath)
          const content = await file.text()

          return c.text(content, 200, {
            'Content-Type': 'application/javascript',
            'Cache-Control': `public, max-age=${CSS_CACHE_DURATION_SECONDS}`,
          })
        } catch (error) {
          // Log error - intentional side effect for error tracking
          // eslint-disable-next-line functional/no-expression-statements
          await Effect.runPromise(Console.error('Failed to load language-switcher.js:', error))
          return c.text('/* Language switcher script failed to load */', 500, {
            'Content-Type': 'application/javascript',
          })
        }
      })
      .get('/test/error', (c) => {
        if (process.env.NODE_ENV === 'production') {
          return c.html(renderNotFoundPage(), 404)
        }
        // Intentionally trigger error handler for testing
        // eslint-disable-next-line functional/no-throw-statements
        throw new Error('Test error')
      })
      // Dynamic page routes - catch-all for custom pages
      .get('*', (c) => {
        const { path } = c.req

        // Render dynamic page
        const html = renderPage(app, path)
        if (!html) {
          return c.html(renderNotFoundPage(), 404)
        }

        return c.html(html)
      })
      .notFound((c) => c.html(renderNotFoundPage(), 404))
      .onError((error, c) => {
        // Fire-and-forget error logging (onError handler is synchronous)
        Effect.runPromise(Console.error('Server error:', error)).catch(() => {
          // Silently ignore logging failures to prevent unhandled promise rejections
        })
        return c.html(renderErrorPage(), 500)
      })
  )
}

/**
 * Creates and starts a Bun server with Hono
 *
 * This function:
 * 1. Pre-compiles CSS on startup for faster initial requests
 * 2. Creates a Hono app with routes (/, /assets/output.css, /api/*)
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
      renderPage,
      renderNotFoundPage,
      renderErrorPage,
    } = config

    // Pre-compile CSS on startup
    yield* Console.log('Compiling CSS...')
    const cssResult = yield* compileCSS()
    yield* Console.log(`CSS compiled: ${cssResult.css.length} bytes`)

    // Create Hono app
    const honoApp = createHonoApp(
      app,
      renderHomePage,
      renderPage,
      renderNotFoundPage,
      renderErrorPage
    )

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

    // Log server startup information
    yield* Console.log('✓ Server started successfully!')
    yield* Console.log(`✓ Homepage: ${url}`)
    yield* Console.log(`✓ Health check: ${url}/api/health`)
    yield* Console.log(`✓ API documentation: ${url}/api/scalar`)
    yield* Console.log(`✓ OpenAPI schema: ${url}/api/openapi.json`)
    yield* Console.log(`✓ Compiled CSS: ${url}/assets/output.css`)

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
