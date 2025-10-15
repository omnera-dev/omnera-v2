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
 *   name: 'todo-app',
 * }
 *
 * const validated = Schema.decodeUnknownSync(AppSchema)(myApp)
 * ```
 */
export const AppSchema = Schema.Struct({
  /**
   * The name of the application.
   *
   * Must follow npm package naming conventions:
   * - Lowercase only
   * - Maximum 214 characters (including scope for scoped packages)
   * - Cannot start with a dot or underscore
   * - Cannot contain leading/trailing spaces
   * - Cannot contain non-URL-safe characters
   * - Scoped packages: @scope/package-name format allowed
   * - Can include hyphens and underscores (but not at the start)
   */
  name: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'Name must not be empty' }),
    Schema.maxLength(214, { message: () => 'Name must not exceed 214 characters' }),
    Schema.pattern(/^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/, {
      message: () =>
        'Name must be lowercase and follow npm package naming conventions (no leading dots/underscores, URL-safe characters only)',
    }),
    Schema.filter(
      (name) => name.trim() === name,
      { message: () => 'Name cannot contain leading or trailing spaces' }
    ),
    Schema.annotations({
      title: 'Application Name',
      description: 'The name of the application (follows npm package naming conventions)',
      examples: ['my-app', 'todo-app', '@myorg/my-app', 'blog-system', 'dashboard-admin'],
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
 *   name: 'my-app',
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
