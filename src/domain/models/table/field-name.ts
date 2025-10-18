import { Schema } from 'effect'

/**
 * Field Name
 *
 * Internal identifier name used for database columns and programmatic references.
 * Must follow database naming conventions: start with a letter, contain only lowercase
 * letters, numbers, and underscores, maximum 63 characters (PostgreSQL limit).
 * This name is used in SQL queries, API endpoints, and code generation.
 * Choose descriptive names that clearly indicate the purpose (e.g., "email_address" not "ea").
 *
 * @example
 * ```typescript
 * 'email'
 * 'user_status'
 * 'created_at'
 * ```
 */
export const FieldNameSchema = Schema.String.pipe(
  Schema.minLength(1),
  Schema.maxLength(63),
  Schema.pattern(/^[a-z][a-z0-9_]*$/),
  Schema.annotations({
    title: 'Field Name',
    description:
      'Internal identifier name for database columns following PostgreSQL naming conventions. Must start with a letter, contain only lowercase letters, numbers, and underscores, maximum 63 characters.',
    examples: ['email', 'user_status', 'order_item', 'customer_email', 'created_at'],
  })
)

export type FieldName = Schema.Schema.Type<typeof FieldNameSchema>
