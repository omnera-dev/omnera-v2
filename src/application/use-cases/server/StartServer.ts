import { Effect, Schema } from 'effect'
import { AppSchema } from '@/domain/models/app'
import type { App } from '@/domain/models/app'
import type { CSSCompilationError } from '@/infrastructure/services/css-compiler'
import type { ServerInstance, ServerCreationError } from '@/infrastructure/services/server'

/**
 * Error class for app validation failures
 */
export class AppValidationError {
  readonly _tag = 'AppValidationError'
  constructor(readonly cause: unknown) {}
}

/**
 * Server configuration options
 */
export interface StartOptions {
  /**
   * Port number for the HTTP server
   * @default 3000
   */
  readonly port?: number

  /**
   * Hostname to bind the server to
   * @default "localhost"
   */
  readonly hostname?: string
}

/**
 * Use case for starting an Omnera web server
 *
 * This orchestrates the server startup process:
 * 1. Validates the app configuration using Effect Schema
 * 2. Creates and starts the server via infrastructure layer
 *
 * @param app - Application configuration
 * @param options - Server configuration options
 * @returns Effect that yields ServerInstance or errors
 */
export const startServer = (
  app: unknown,
  options: StartOptions = {}
): Effect.Effect<ServerInstance, AppValidationError | ServerCreationError | CSSCompilationError> =>
  Effect.gen(function* () {
    // Validate app configuration using domain model schema
    const validatedApp = yield* Effect.try({
      try: (): App => Schema.decodeUnknownSync(AppSchema)(app),
      catch: (error) => new AppValidationError(error),
    })

    // Import presentation layer rendering function
    const { renderHomePage } = yield* Effect.promise(
      () => import('@/presentation/utils/render-homepage')
    )

    // Defer to infrastructure layer for actual server creation
    const { createServer } = yield* Effect.promise(() => import('@/infrastructure/services/server'))

    const serverInstance = yield* createServer({
      app: validatedApp,
      port: options.port,
      hostname: options.hostname,
      renderHomePage,
    })

    return serverInstance
  })
