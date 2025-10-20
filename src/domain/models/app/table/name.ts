/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'

/**
 * Table Name
 *
 * Name of the database table
 *
 * @example
 * ```typescript
 * "users"
 * ```
 */
export const NameSchema = Schema.String.pipe(
  Schema.minLength(1, { message: () => 'This field is required' }),
  Schema.maxLength(63, { message: () => 'Maximum length is 63 characters' }),
  Schema.pattern(/^[a-z][a-z0-9_]*$/, {
    message: () =>
      'Internal identifier name used for database tables, columns, and programmatic references. Must follow database naming conventions: start with a letter, contain only lowercase letters, numbers, and underscores, maximum 63 characters (PostgreSQL limit). This name is used in SQL queries, API endpoints, and code generation. Choose descriptive names that clearly indicate the purpose (e.g., "email_address" not "ea").',
  }),
  Schema.annotations({
    title: 'Name',
    description:
      'Internal identifier name used for database tables, columns, and programmatic references. Must follow database naming conventions: start with a letter, contain only lowercase letters, numbers, and underscores, maximum 63 characters (PostgreSQL limit). This name is used in SQL queries, API endpoints, and code generation. Choose descriptive names that clearly indicate the purpose (e.g., "email_address" not "ea").',
    examples: ['user', 'product', 'order_item', 'customer_email', 'shipping_address', 'created_at'],
  })
)

export type Name = Schema.Schema.Type<typeof NameSchema>
