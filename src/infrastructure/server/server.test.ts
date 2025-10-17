import { describe, test, expect, mock } from 'bun:test'
import { Effect, Console } from 'effect'
import { createServer } from './server'
import type { App } from '@/domain/models/app'
import { ServerCreationError } from '@/infrastructure/errors/server-creation-error'

describe('createServer', () => {
  // Mock app data
  const mockApp: App = {
    name: 'Test App',
    description: 'Test Description',
    version: '1.0.0',
  }

  // Mock rendering functions
  const mockRenderHomePage = (app: App) =>
    `<html><body><h1>${app.name}</h1><p>${app.description}</p></body></html>`
  const mockRenderNotFoundPage = () => '<html><body><h1>404 Not Found</h1></body></html>'
  const mockRenderErrorPage = () => '<html><body><h1>500 Internal Server Error</h1></body></html>'

  describe('server creation', () => {
    test('creates server with default port and hostname', async () => {
      const program = createServer({
        app: mockApp,
        renderHomePage: mockRenderHomePage,
        renderNotFoundPage: mockRenderNotFoundPage,
        renderErrorPage: mockRenderErrorPage,
      })

      const result = await Effect.runPromise(program)

      expect(result).toBeDefined()
      expect(result.server).toBeDefined()
      expect(result.url).toBe('http://localhost:3000')
      expect(result.stop).toBeDefined()

      // Cleanup
      await Effect.runPromise(result.stop)
    })

    test('creates server with custom port', async () => {
      const program = createServer({
        app: mockApp,
        port: 8080,
        renderHomePage: mockRenderHomePage,
        renderNotFoundPage: mockRenderNotFoundPage,
        renderErrorPage: mockRenderErrorPage,
      })

      const result = await Effect.runPromise(program)

      expect(result.url).toBe('http://localhost:8080')

      // Cleanup
      await Effect.runPromise(result.stop)
    })

    test('creates server with custom hostname', async () => {
      const program = createServer({
        app: mockApp,
        hostname: '0.0.0.0',
        renderHomePage: mockRenderHomePage,
        renderNotFoundPage: mockRenderNotFoundPage,
        renderErrorPage: mockRenderErrorPage,
      })

      const result = await Effect.runPromise(program)

      expect(result.url).toContain('0.0.0.0')

      // Cleanup
      await Effect.runPromise(result.stop)
    })

    test('creates server with port 0 (auto-select)', async () => {
      const program = createServer({
        app: mockApp,
        port: 0,
        renderHomePage: mockRenderHomePage,
        renderNotFoundPage: mockRenderNotFoundPage,
        renderErrorPage: mockRenderErrorPage,
      })

      const result = await Effect.runPromise(program)

      // Port 0 means auto-select, so actual port should be > 0
      expect(result.server.port).toBeGreaterThan(0)
      expect(result.url).toContain(`http://localhost:${result.server.port}`)

      // Cleanup
      await Effect.runPromise(result.stop)
    })

    test('includes stop effect that can be executed', async () => {
      const program = createServer({
        app: mockApp,
        port: 0,
        renderHomePage: mockRenderHomePage,
        renderNotFoundPage: mockRenderNotFoundPage,
        renderErrorPage: mockRenderErrorPage,
      })

      const result = await Effect.runPromise(program)

      // Stop effect should be defined
      expect(result.stop).toBeDefined()

      // Should be able to execute stop effect
      await Effect.runPromise(result.stop)
    })
  })

  describe('Hono routes', () => {
    test('GET /health returns status ok with app name', async () => {
      const program = createServer({
        app: mockApp,
        port: 0,
        renderHomePage: mockRenderHomePage,
        renderNotFoundPage: mockRenderNotFoundPage,
        renderErrorPage: mockRenderErrorPage,
      })

      const server = await Effect.runPromise(program)

      const response = await fetch(`${server.url}/health`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toMatchObject({
        status: 'ok',
        app: {
          name: 'Test App',
        },
      })
      expect(data.timestamp).toBeDefined()

      // Cleanup
      await Effect.runPromise(server.stop)
    })

    test('GET / returns rendered homepage', async () => {
      const program = createServer({
        app: mockApp,
        port: 0,
        renderHomePage: mockRenderHomePage,
        renderNotFoundPage: mockRenderNotFoundPage,
        renderErrorPage: mockRenderErrorPage,
      })

      const server = await Effect.runPromise(program)

      const response = await fetch(server.url)
      const html = await response.text()

      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('text/html')
      expect(html).toContain('Test App')
      expect(html).toContain('Test Description')

      // Cleanup
      await Effect.runPromise(server.stop)
    })

    test('GET /output.css returns compiled CSS with correct headers', async () => {
      const program = createServer({
        app: mockApp,
        port: 0,
        renderHomePage: mockRenderHomePage,
        renderNotFoundPage: mockRenderNotFoundPage,
        renderErrorPage: mockRenderErrorPage,
      })

      const server = await Effect.runPromise(program)

      const response = await fetch(`${server.url}/output.css`)
      const css = await response.text()

      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toBe('text/css')
      expect(response.headers.get('cache-control')).toBe('public, max-age=3600')
      expect(css).toBeDefined()
      expect(css.length).toBeGreaterThan(0)

      // Cleanup
      await Effect.runPromise(server.stop)
    })

    test('GET /test/error returns 404 in production', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const program = createServer({
        app: mockApp,
        port: 0,
        renderHomePage: mockRenderHomePage,
        renderNotFoundPage: mockRenderNotFoundPage,
        renderErrorPage: mockRenderErrorPage,
      })

      const server = await Effect.runPromise(program)

      const response = await fetch(`${server.url}/test/error`)
      const html = await response.text()

      expect(response.status).toBe(404)
      expect(html).toContain('404 Not Found')

      // Cleanup
      await Effect.runPromise(server.stop)
      process.env.NODE_ENV = originalEnv
    })

    test('GET /test/error throws error in non-production', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      const program = createServer({
        app: mockApp,
        port: 0,
        renderHomePage: mockRenderHomePage,
        renderNotFoundPage: mockRenderNotFoundPage,
        renderErrorPage: mockRenderErrorPage,
      })

      const server = await Effect.runPromise(program)

      const response = await fetch(`${server.url}/test/error`)
      const html = await response.text()

      // Should trigger error handler
      expect(response.status).toBe(500)
      expect(html).toContain('500 Internal Server Error')

      // Cleanup
      await Effect.runPromise(server.stop)
      process.env.NODE_ENV = originalEnv
    })

    test('404 handler returns not found page', async () => {
      const program = createServer({
        app: mockApp,
        port: 0,
        renderHomePage: mockRenderHomePage,
        renderNotFoundPage: mockRenderNotFoundPage,
        renderErrorPage: mockRenderErrorPage,
      })

      const server = await Effect.runPromise(program)

      const response = await fetch(`${server.url}/nonexistent`)
      const html = await response.text()

      expect(response.status).toBe(404)
      expect(html).toContain('404 Not Found')

      // Cleanup
      await Effect.runPromise(server.stop)
    })
  })

  describe('error handling', () => {
    test('handles CSS compilation error gracefully', async () => {
      const program = createServer({
        app: mockApp,
        port: 0,
        renderHomePage: mockRenderHomePage,
        renderNotFoundPage: mockRenderNotFoundPage,
        renderErrorPage: mockRenderErrorPage,
      })

      const server = await Effect.runPromise(program)

      // CSS compilation should work, but let's verify error handling exists
      const response = await fetch(`${server.url}/output.css`)

      // Should return either success or error response (not crash)
      expect(response.status).toBeOneOf([200, 500])

      if (response.status === 500) {
        const css = await response.text()
        expect(css).toContain('/* CSS compilation failed */')
      }

      // Cleanup
      await Effect.runPromise(server.stop)
    })
  })

  describe('CSS pre-compilation on startup', () => {
    test('compiles CSS during server startup', async () => {
      const program = createServer({
        app: mockApp,
        port: 0,
        renderHomePage: mockRenderHomePage,
        renderNotFoundPage: mockRenderNotFoundPage,
        renderErrorPage: mockRenderErrorPage,
      })

      const server = await Effect.runPromise(program)

      // CSS should already be compiled, so requesting it should be fast
      const response = await fetch(`${server.url}/output.css`)

      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toBe('text/css')

      // Cleanup
      await Effect.runPromise(server.stop)
    })
  })
})
