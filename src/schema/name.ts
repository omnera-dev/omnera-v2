import { Schema } from 'effect'

/**
 * NameSchema defines validation rules for application names.
 *
 * Application names must follow npm package naming conventions:
 * - Lowercase only
 * - Maximum 214 characters (including scope for scoped packages)
 * - Cannot start with a dot or underscore
 * - Cannot contain leading/trailing spaces
 * - Cannot contain non-URL-safe characters
 * - Scoped packages: @scope/package-name format allowed
 * - Can include hyphens and underscores (but not at the start)
 *
 * @example
 * ```typescript
 * // Valid names
 * const name1 = 'my-app'
 * const name2 = 'todo-app'
 * const name3 = '@myorg/my-app'
 * const name4 = 'blog-system'
 * const name5 = 'dashboard-admin'
 *
 * // Validate name
 * const validated = Schema.decodeUnknownSync(NameSchema)(name1)
 * ```
 */
export const NameSchema = Schema.String.pipe(
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
)

/**
 * TypeScript type for application names.
 *
 * Represents a validated application name that follows npm package naming conventions.
 */
export type Name = Schema.Schema.Type<typeof NameSchema>
