import { Effect, Schema } from 'effect'
import { AppValidationError } from '@/application/errors/app-validation-error'
import { AppSchema } from '@/domain/models/app'
import type { App } from '@/domain/models/app'
import type { CSSCompilationError } from '@/infrastructure/errors/css-compilation-error'
import type { ServerCreationError } from '@/infrastructure/errors/server-creation-error'
import type { ServerInstance } from '@/infrastructure/server/server'

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

    // Import presentation layer rendering functions
    const { renderHomePage } = yield* Effect.promise(
      () => import('@/presentation/utils/render-homepage')
    )
    const { renderNotFoundPage, renderErrorPage } = yield* Effect.promise(
      () => import('@/presentation/utils/render-error-pages')
    )

    // Defer to infrastructure layer for actual server creation
    const { createServer } = yield* Effect.promise(() => import('@/infrastructure/server/server'))

    const serverInstance = yield* createServer({
      app: validatedApp,
      port: options.port,
      hostname: options.hostname,
      renderHomePage,
      renderNotFoundPage,
      renderErrorPage,
    })

    return serverInstance
  })
