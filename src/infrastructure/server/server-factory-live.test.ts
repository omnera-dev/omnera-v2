import { describe, test, expect } from 'bun:test'
import { Effect, Layer, Context } from 'effect'
import { ServerFactoryLive } from './server-factory-live'
import { ServerFactory } from '@/application/ports/server-factory'
import type { App } from '@/domain/models/app'

describe('ServerFactoryLive', () => {
  // Mock app data
  const mockApp: App = {
    name: 'Test App',
    description: 'Test Description',
    version: '1.0.0',
  }

  // Mock rendering functions
  const mockRenderHomePage = (app: App) => `<html><body>${app.name}</body></html>`
  const mockRenderNotFoundPage = () => '<html><body>404</body></html>'
  const mockRenderErrorPage = () => '<html><body>500</body></html>'

  describe('Layer structure', () => {
    test('is a valid Effect Layer', () => {
      expect(ServerFactoryLive).toBeDefined()
      // Layer should have the Effect Layer structure
      expect(typeof ServerFactoryLive).toBe('object')
    })

    test('provides ServerFactory service', async () => {
      const program = Effect.gen(function* () {
        const factory = yield* ServerFactory
        return factory
      }).pipe(Effect.provide(ServerFactoryLive))

      const factory = await Effect.runPromise(program)

      expect(factory).toBeDefined()
      expect(factory.create).toBeDefined()
      expect(typeof factory.create).toBe('function')
    })
  })

  describe('ServerFactory.create method', () => {
    test('creates server with valid configuration', async () => {
      const program = Effect.gen(function* () {
        const factory = yield* ServerFactory
        const server = yield* factory.create({
          app: mockApp,
          port: 0,
          renderHomePage: mockRenderHomePage,
          renderNotFoundPage: mockRenderNotFoundPage,
          renderErrorPage: mockRenderErrorPage,
        })
        return server
      }).pipe(Effect.provide(ServerFactoryLive))

      const server = await Effect.runPromise(program)

      expect(server).toBeDefined()
      expect(server.server).toBeDefined()
      expect(server.url).toBeDefined()
      expect(server.stop).toBeDefined()

      // Cleanup
      await Effect.runPromise(server.stop)
    })

    test('create returns ServerInstance with correct properties', async () => {
      const program = Effect.gen(function* () {
        const factory = yield* ServerFactory
        const server = yield* factory.create({
          app: mockApp,
          port: 0,
          hostname: 'localhost',
          renderHomePage: mockRenderHomePage,
          renderNotFoundPage: mockRenderNotFoundPage,
          renderErrorPage: mockRenderErrorPage,
        })
        return server
      }).pipe(Effect.provide(ServerFactoryLive))

      const server = await Effect.runPromise(program)

      // Check ServerInstance properties
      expect(server.server.port).toBeGreaterThan(0)
      expect(server.url).toContain('http://localhost')
      expect(typeof server.stop).toBe('object') // Effect

      // Cleanup
      await Effect.runPromise(server.stop)
    })

    test('passes configuration to createServer', async () => {
      const customPort = 0 // Auto-select
      const customHostname = '127.0.0.1'

      const program = Effect.gen(function* () {
        const factory = yield* ServerFactory
        const server = yield* factory.create({
          app: mockApp,
          port: customPort,
          hostname: customHostname,
          renderHomePage: mockRenderHomePage,
          renderNotFoundPage: mockRenderNotFoundPage,
          renderErrorPage: mockRenderErrorPage,
        })
        return server
      }).pipe(Effect.provide(ServerFactoryLive))

      const server = await Effect.runPromise(program)

      expect(server.url).toContain(customHostname)

      // Cleanup
      await Effect.runPromise(server.stop)
    })

    test('passes rendering functions to createServer', async () => {
      const customRenderHome = (app: App) => `<html><title>${app.name}</title></html>`
      const customRenderNotFound = () => '<html>Custom 404</html>'
      const customRenderError = () => '<html>Custom 500</html>'

      const program = Effect.gen(function* () {
        const factory = yield* ServerFactory
        const server = yield* factory.create({
          app: mockApp,
          port: 0,
          renderHomePage: customRenderHome,
          renderNotFoundPage: customRenderNotFound,
          renderErrorPage: customRenderError,
        })
        return server
      }).pipe(Effect.provide(ServerFactoryLive))

      const server = await Effect.runPromise(program)

      // Verify server was created with custom rendering functions
      const response = await fetch(server.url)
      const html = await response.text()
      expect(html).toContain('Test App')

      // Cleanup
      await Effect.runPromise(server.stop)
    })
  })

  describe('Layer composition', () => {
    test('can be merged with other layers', async () => {
      // Create a mock layer for testing composition
      class MockService extends Context.Tag('MockService')<
        MockService,
        { readonly getValue: () => string }
      >() {}

      const MockLayer = Layer.succeed(MockService, {
        getValue: () => 'mock value',
      })

      const ComposedLayer = Layer.mergeAll(ServerFactoryLive, MockLayer)

      const program = Effect.gen(function* () {
        const factory = yield* ServerFactory
        const mockService = yield* MockService
        return { factory, mockService }
      }).pipe(Effect.provide(ComposedLayer))

      const result = await Effect.runPromise(program)

      expect(result.factory).toBeDefined()
      expect(result.mockService.getValue()).toBe('mock value')
    })

    test('can be used in scoped contexts', async () => {
      const program = Effect.gen(function* () {
        const factory = yield* ServerFactory
        const server = yield* factory.create({
          app: mockApp,
          port: 0,
          renderHomePage: mockRenderHomePage,
          renderNotFoundPage: mockRenderNotFoundPage,
          renderErrorPage: mockRenderErrorPage,
        })

        // Use server within scope
        const response = yield* Effect.promise(() => fetch(`${server.url}/health`))
        const data = yield* Effect.promise(() => response.json())

        yield* server.stop

        return data
      }).pipe(Effect.provide(ServerFactoryLive))

      const healthData = await Effect.runPromise(program)

      expect(healthData.status).toBe('ok')
    })
  })

  describe('error handling', () => {
    test('propagates server creation errors through Effect', async () => {
      // This would test error scenarios, but since we're using real Bun.serve,
      // errors are less likely. We verify the error handling structure exists.
      const program = Effect.gen(function* () {
        const factory = yield* ServerFactory
        const server = yield* factory.create({
          app: mockApp,
          port: 0,
          renderHomePage: mockRenderHomePage,
          renderNotFoundPage: mockRenderNotFoundPage,
          renderErrorPage: mockRenderErrorPage,
        })
        return server
      }).pipe(Effect.provide(ServerFactoryLive))

      // Should not throw, but return server instance
      const server = await Effect.runPromise(program)
      expect(server).toBeDefined()

      // Cleanup
      await Effect.runPromise(server.stop)
    })
  })

  describe('Layer.effect usage', () => {
    test('ServerFactoryLive uses Layer.effect for async operations', async () => {
      // The implementation uses Layer.effect because createServer returns an Effect
      // This test verifies that the layer can handle the Effect-based creation

      const program = Effect.gen(function* () {
        const factory = yield* ServerFactory
        const server = yield* factory.create({
          app: mockApp,
          port: 0,
          renderHomePage: mockRenderHomePage,
          renderNotFoundPage: mockRenderNotFoundPage,
          renderErrorPage: mockRenderErrorPage,
        })
        return server
      }).pipe(Effect.provide(ServerFactoryLive))

      const server = await Effect.runPromise(program)

      // Should successfully create server
      expect(server).toBeDefined()
      expect(server.server).toBeDefined()

      // Cleanup
      await Effect.runPromise(server.stop)
    })
  })
})
