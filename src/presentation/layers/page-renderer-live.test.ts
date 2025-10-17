import { describe, test, expect } from 'bun:test'
import { Effect, Layer, Context } from 'effect'
import { PageRendererLive } from './page-renderer-live'
import { PageRenderer } from '@/application/ports/page-renderer'
import { ServerFactoryLive } from '@/infrastructure/server/server-factory-live'
import { ServerFactory } from '@/application/ports/server-factory'
import type { App } from '@/domain/models/app'

describe('PageRendererLive', () => {
  // Mock app data
  const mockApp: App = {
    name: 'Test App',
    description: 'Test Description',
    version: '1.0.0',
  }

  describe('Layer structure', () => {
    test('is a valid Effect Layer', () => {
      expect(PageRendererLive).toBeDefined()
      // Layer should have the Effect Layer structure
      expect(typeof PageRendererLive).toBe('object')
    })

    test('provides PageRenderer service', async () => {
      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        return renderer
      }).pipe(Effect.provide(PageRendererLive))

      const renderer = await Effect.runPromise(program)

      expect(renderer).toBeDefined()
      expect(renderer.renderHome).toBeDefined()
      expect(renderer.renderNotFound).toBeDefined()
      expect(renderer.renderError).toBeDefined()
    })
  })

  describe('PageRenderer.renderHome', () => {
    test('renders home page with app data', async () => {
      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        return renderer.renderHome(mockApp)
      }).pipe(Effect.provide(PageRendererLive))

      const html = await Effect.runPromise(program)

      expect(html).toStartWith('<!DOCTYPE html>')
      expect(html).toContain('Test App')
      expect(html).toContain('Test Description')
    })

    test('renderHome is a pure function', async () => {
      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        return renderer.renderHome(mockApp)
      }).pipe(Effect.provide(PageRendererLive))

      const html1 = await Effect.runPromise(program)
      const html2 = await Effect.runPromise(program)

      expect(html1).toBe(html2)
    })

    test('renderHome handles different app data', async () => {
      const app1: App = {
        name: 'App 1',
        description: 'Description 1',
        version: '1.0.0',
      }

      const app2: App = {
        name: 'App 2',
        description: 'Description 2',
        version: '2.0.0',
      }

      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        return {
          html1: renderer.renderHome(app1),
          html2: renderer.renderHome(app2),
        }
      }).pipe(Effect.provide(PageRendererLive))

      const result = await Effect.runPromise(program)

      expect(result.html1).toContain('App 1')
      expect(result.html2).toContain('App 2')
      expect(result.html1).not.toBe(result.html2)
    })
  })

  describe('PageRenderer.renderNotFound', () => {
    test('renders 404 not found page', async () => {
      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        return renderer.renderNotFound()
      }).pipe(Effect.provide(PageRendererLive))

      const html = await Effect.runPromise(program)

      expect(html).toStartWith('<!DOCTYPE html>')
      const lowerHtml = html.toLowerCase()
      expect(lowerHtml).toMatch(/404|not found/)
    })

    test('renderNotFound is a pure function', async () => {
      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        return renderer.renderNotFound()
      }).pipe(Effect.provide(PageRendererLive))

      const html1 = await Effect.runPromise(program)
      const html2 = await Effect.runPromise(program)

      expect(html1).toBe(html2)
    })

    test('renderNotFound includes CSS link', async () => {
      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        return renderer.renderNotFound()
      }).pipe(Effect.provide(PageRendererLive))

      const html = await Effect.runPromise(program)

      expect(html).toContain('/output.css')
    })
  })

  describe('PageRenderer.renderError', () => {
    test('renders 500 error page', async () => {
      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        return renderer.renderError()
      }).pipe(Effect.provide(PageRendererLive))

      const html = await Effect.runPromise(program)

      expect(html).toStartWith('<!DOCTYPE html>')
      const lowerHtml = html.toLowerCase()
      expect(lowerHtml).toMatch(/500|error/)
    })

    test('renderError is a pure function', async () => {
      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        return renderer.renderError()
      }).pipe(Effect.provide(PageRendererLive))

      const html1 = await Effect.runPromise(program)
      const html2 = await Effect.runPromise(program)

      expect(html1).toBe(html2)
    })

    test('renderError includes CSS link', async () => {
      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        return renderer.renderError()
      }).pipe(Effect.provide(PageRendererLive))

      const html = await Effect.runPromise(program)

      expect(html).toContain('/output.css')
    })
  })

  describe('all rendering methods', () => {
    test('all three render methods work together', async () => {
      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        return {
          home: renderer.renderHome(mockApp),
          notFound: renderer.renderNotFound(),
          error: renderer.renderError(),
        }
      }).pipe(Effect.provide(PageRendererLive))

      const result = await Effect.runPromise(program)

      expect(result.home).toStartWith('<!DOCTYPE html>')
      expect(result.notFound).toStartWith('<!DOCTYPE html>')
      expect(result.error).toStartWith('<!DOCTYPE html>')
    })

    test('all render methods return different HTML', async () => {
      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        return {
          home: renderer.renderHome(mockApp),
          notFound: renderer.renderNotFound(),
          error: renderer.renderError(),
        }
      }).pipe(Effect.provide(PageRendererLive))

      const result = await Effect.runPromise(program)

      expect(result.home).not.toBe(result.notFound)
      expect(result.home).not.toBe(result.error)
      expect(result.notFound).not.toBe(result.error)
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

      const ComposedLayer = Layer.mergeAll(PageRendererLive, MockLayer)

      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        const mockService = yield* MockService
        return { renderer, mockService }
      }).pipe(Effect.provide(ComposedLayer))

      const result = await Effect.runPromise(program)

      expect(result.renderer).toBeDefined()
      expect(result.mockService.getValue()).toBe('mock value')
    })

    test('can be used with ServerFactoryLive', async () => {
      const AppLayer = Layer.mergeAll(PageRendererLive, ServerFactoryLive)

      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        const factory = yield* ServerFactory

        return { renderer, factory }
      }).pipe(Effect.provide(AppLayer))

      const result = await Effect.runPromise(program)

      expect(result.renderer).toBeDefined()
      expect(result.factory).toBeDefined()
    })
  })

  describe('Layer.succeed usage', () => {
    test('PageRendererLive uses Layer.succeed for synchronous operations', async () => {
      // The implementation uses Layer.succeed because all rendering is pure/synchronous
      // This test verifies that the layer provides immediate access to rendering functions

      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        // Should be able to call rendering methods synchronously
        const html = renderer.renderHome(mockApp)
        return html
      }).pipe(Effect.provide(PageRendererLive))

      const html = await Effect.runPromise(program)

      expect(html).toBeDefined()
      expect(html).toContain('Test App')
    })
  })

  describe('rendering function types', () => {
    test('renderHome accepts App parameter', async () => {
      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        return typeof renderer.renderHome
      }).pipe(Effect.provide(PageRendererLive))

      const renderHomeType = await Effect.runPromise(program)

      expect(renderHomeType).toBe('function')
    })

    test('renderNotFound accepts no parameters', async () => {
      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        // Should be callable without arguments
        const html = renderer.renderNotFound()
        return html
      }).pipe(Effect.provide(PageRendererLive))

      const html = await Effect.runPromise(program)

      expect(html).toBeDefined()
    })

    test('renderError accepts no parameters', async () => {
      const program = Effect.gen(function* () {
        const renderer = yield* PageRenderer
        // Should be callable without arguments
        const html = renderer.renderError()
        return html
      }).pipe(Effect.provide(PageRendererLive))

      const html = await Effect.runPromise(program)

      expect(html).toBeDefined()
    })
  })
})
