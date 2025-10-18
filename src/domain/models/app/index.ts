/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'
import { DescriptionSchema } from './description'
import { NameSchema } from './name'
import { TablesSchema } from './tables'
import { VersionSchema } from './version'

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

  /**
   * Data tables that define the data structure (optional).
   *
   * Collection of database tables that define the data structure of your application.
   * Each table represents an entity (e.g., users, products, orders) with fields that
   * define the schema. Tables support relationships, indexes, constraints, and various
   * field types.
   */
  tables: Schema.optional(TablesSchema),
}).pipe(
  Schema.annotations({
    title: 'Application Configuration',
    description:
      'Complete application configuration including name, version, description, and data tables. This is the root schema for Omnera applications.',
    examples: [
      {
        name: 'todo-app',
        version: '1.0.0',
        description: 'A simple todo list application',
        tables: [
          {
            id: 1,
            name: 'tasks',
            fields: [
              { id: 1, name: 'title', type: 'single-line-text' as const, required: true },
              { id: 2, name: 'completed', type: 'checkbox' as const, required: true },
            ],
          },
        ],
      },
      {
        name: '@myorg/dashboard',
        version: '2.0.0-beta.1',
        description: 'Admin dashboard for analytics and reporting',
      },
      {
        name: 'blog-system',
      },
    ],
  })
)

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

// Re-export all domain model schemas and types for convenient imports
export * from './name'
export * from './version'
export * from './description'
export * from './tables'
