/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, expect, test } from 'bun:test'
import { Effect, Layer } from 'effect'
import { AppValidationError } from '@/application/errors/app-validation-error'
import { PageRenderer } from '@/application/ports/page-renderer'
import { ServerFactory } from '@/application/ports/server-factory'
import { startServer } from './start-server'
import type { ServerInstance } from '@/application/models/server'

/**
 * Mock ServerFactory for testing (no actual server creation)
 */
const MockServerFactory = Layer.succeed(ServerFactory, {
  create: (config) =>
    Effect.succeed({
      url: `http://${config.hostname ?? 'localhost'}:${config.port ?? 3000}`,
      stop: Effect.sync(() => {}),
    } as ServerInstance),
})

/**
 * Mock PageRenderer for testing (simple HTML strings)
 */
const MockPageRenderer = Layer.succeed(PageRenderer, {
  renderHome: (app) => `<html><body><h1>${app.name}</h1></body></html>`,
  renderNotFound: () => '<html><body><h1>404 Not Found</h1></body></html>',
  renderError: () => '<html><body><h1>500 Error</h1></body></html>',
})

/**
 * Test Layer composition (MockServerFactory + MockPageRenderer)
 */
const TestLayer = Layer.mergeAll(MockServerFactory, MockPageRenderer)

describe('startServer', () => {
  test('should start server with valid app configuration', async () => {
    const app = {
      name: 'test-app',
      description: 'A test application',
    }

    const program = startServer(app).pipe(Effect.provide(TestLayer))

    const server = await Effect.runPromise(program)

    expect(server.url).toBe('http://localhost:3000')
  })

  test('should start server with custom port and hostname', async () => {
    const app = {
      name: 'test-app',
      description: 'A test application',
    }

    const program = startServer(app, { port: 8080, hostname: '0.0.0.0' }).pipe(
      Effect.provide(TestLayer)
    )

    const server = await Effect.runPromise(program)

    expect(server.url).toBe('http://0.0.0.0:8080')
  })

  test('should fail with AppValidationError for empty name', async () => {
    const invalidApp = {
      name: '', // Invalid: empty name
      description: 'A test application',
    }

    const program = startServer(invalidApp).pipe(Effect.provide(TestLayer))

    const result = await Effect.runPromise(Effect.either(program))

    expect(result._tag).toBe('Left')
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(AppValidationError)
    }
  })

  test('should fail with AppValidationError for invalid name format', async () => {
    const invalidApp = {
      name: 'Invalid App Name', // Invalid: uppercase and spaces
      description: 'A test application',
    }

    const program = startServer(invalidApp).pipe(Effect.provide(TestLayer))

    const result = await Effect.runPromise(Effect.either(program))

    expect(result._tag).toBe('Left')
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(AppValidationError)
    }
  })

  test('should succeed when description is omitted (optional field)', async () => {
    const app = {
      name: 'test-app',
      // Description is optional, so this should succeed
    }

    const program = startServer(app).pipe(Effect.provide(TestLayer))

    const server = await Effect.runPromise(program)

    expect(server.url).toBe('http://localhost:3000')
  })

  test('should use default options when none provided', async () => {
    const app = {
      name: 'test-app',
      description: 'A test application',
    }

    const program = startServer(app).pipe(Effect.provide(TestLayer))

    const server = await Effect.runPromise(program)

    // Default: localhost:3000
    expect(server.url).toBe('http://localhost:3000')
  })
})
