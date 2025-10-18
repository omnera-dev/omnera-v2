import { Context, Effect, Layer } from 'effect'
import { auth } from './auth.js'
import { AuthError } from '../../errors/auth-error.js'

/**
 * Auth Effect Context
 *
 * Provides Better Auth instance for dependency injection in Effect programs.
 * Use this in Application layer to access authentication without direct imports.
 *
 * @example
 * ```typescript
 * const protectedProgram = Effect.gen(function* () {
 *   const authService = yield* Auth
 *   const session = yield* authService.requireSession(headers)
 *   return { userId: session.user.id, email: session.user.email }
 * })
 * ```
 */
export class BetterAuth extends Context.Tag('Auth')<
  BetterAuth,
  {
    readonly api: typeof auth.api
    readonly getSession: (
      headers: Headers
    ) => Effect.Effect<Awaited<ReturnType<typeof auth.api.getSession>>, AuthError>
    readonly requireSession: (
      headers: Headers
    ) => Effect.Effect<NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>, AuthError>
  }
>() {}

/**
 * Live Auth Layer
 *
 * Provides the production Better Auth instance with Effect-wrapped methods.
 */
export const BetterAuthLive = Layer.succeed(
  BetterAuth,
  BetterAuth.of({
    api: auth.api,

    getSession: (headers) =>
      Effect.tryPromise({
        try: () => auth.api.getSession({ headers }),
        catch: (error) => new AuthError(error),
      }),

    requireSession: (headers) =>
      Effect.gen(function* () {
        const session = yield* Effect.tryPromise({
          try: () => auth.api.getSession({ headers }),
          catch: (error) => new AuthError(error),
        })

        if (!session) {
          return yield* Effect.fail(new AuthError('Unauthorized'))
        }

        return session
      }),
  })
)
