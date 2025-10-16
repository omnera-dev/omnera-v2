import { Schema } from 'effect'
import { DescriptionSchema } from './description.ts'
import { NameSchema } from './name.ts'
import { VersionSchema } from './version.ts'

/**
 * AppSchema defines the structure of an application configuration.
 *
 * This schema represents the core metadata for any application built
 * with Omnera, including its name, optional version, and optional description.
 *
 * @example
 * ```typescript
 * const myApp = {
 *   name: 'todo-app',
 *   version: '1.0.0',
 *   description: 'A simple todo list application',
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
  name: NameSchema,

  /**
   * The version of the application (optional).
   *
   * Must follow Semantic Versioning (SemVer) 2.0.0 specification:
   * - Format: MAJOR.MINOR.PATCH (e.g., 1.0.0)
   * - No leading zeros in version components
   * - Optional pre-release identifiers (e.g., 1.0.0-alpha)
   * - Optional build metadata (e.g., 1.0.0+build.123)
   */
  version: Schema.optional(VersionSchema),

  /**
   * A description of the application (optional).
   *
   * Must be a single-line string:
   * - No line breaks allowed (\n, \r, or \r\n)
   * - No maximum length restriction
   * - Can contain any characters except line breaks
   * - Unicode characters and emojis are supported
   */
  description: Schema.optional(DescriptionSchema),
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
