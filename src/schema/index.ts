import { Schema } from 'effect'

/**
 * AppSchema defines the structure of an application configuration.
 *
 * This schema represents the core metadata for any application built
 * with Omnera, including its name and description.
 *
 * @example
 * ```typescript
 * const myApp = {
 *   name: 'Todo App',
 * }
 *
 * const validated = Schema.decodeUnknownSync(AppSchema)(myApp)
 * ```
 */
export const AppSchema = Schema.Struct({
  /**
   * The name of the application.
   *
   * Must be a non-empty string that clearly identifies the application.
   */
  name: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'Name must not be empty' }),
    Schema.annotations({
      title: 'Application Name',
      description: 'The name of the application',
      examples: ['Todo App', 'E-commerce Platform', 'Blog System', 'Dashboard Admin'],
    })
  ),
})

/**
 * TypeScript type inferred from AppSchema.
 *
 * Use this type for type-safe access to validated application data.
 *
 * @example
 * ```typescript
 * const app: App = {
 *   name: 'My App',
 * }
 * ```
 */
export type App = Schema.Schema.Type<typeof AppSchema>

/**
 * Encoded type of AppSchema (what goes in).
 *
 * In this case, it's the same as App since we don't use transformations.
 */
export type AppEncoded = Schema.Schema.Encoded<typeof AppSchema>
