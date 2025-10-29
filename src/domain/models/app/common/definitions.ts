/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'

/**
 * Unique positive integer identifier for entities
 *
 * IDs are system-generated, auto-incrementing, and immutable.
 * Must be unique within the parent collection (e.g., field IDs unique within a table).
 * IDs are read-only and assigned automatically when entities are created.
 *
 * Range: 1 to 9,007,199,254,740,991 (JavaScript MAX_SAFE_INTEGER)
 *
 * @example
 * ```typescript
 * const id = 1
 * const tableId = 100
 * const fieldId = 1000
 * ```
 *
 * @see specs/app/common/definitions.schema.json#/definitions/id
 */
export const IdSchema = Schema.Int.pipe(
  Schema.greaterThanOrEqualTo(1),
  Schema.lessThanOrEqualTo(9_007_199_254_740_991),
  Schema.annotations({
    title: 'ID',
    description: 'Unique positive integer identifier for entities',
    examples: [1, 2, 3, 100, 1000],
    readOnly: true,
  })
)

/**
 * Internal identifier name used for database tables, columns, and programmatic references
 *
 * Must follow database naming conventions:
 * - Start with a letter
 * - Contain only lowercase letters, numbers, and underscores
 * - Maximum 63 characters (PostgreSQL limit)
 *
 * Used in SQL queries, API endpoints, and code generation.
 * Choose descriptive names that clearly indicate the purpose.
 *
 * @example
 * ```typescript
 * const name1 = 'user'
 * const name2 = 'email_address'
 * const name3 = 'created_at'
 * ```
 *
 * @see specs/app/common/definitions.schema.json#/definitions/name
 */
export const NameSchema = Schema.String.pipe(
  Schema.minLength(1),
  Schema.maxLength(63),
  Schema.pattern(/^[a-z][a-z0-9_]*$/, {
    message: () =>
      'Name must start with a lowercase letter and contain only lowercase letters, numbers, and underscores (snake_case)',
  }),
  Schema.annotations({
    title: 'Name',
    description:
      'Internal identifier name for database tables, columns, and programmatic references',
    examples: ['user', 'product', 'order_item', 'customer_email', 'shipping_address', 'created_at'],
  })
)

/**
 * URL path for routing and navigation
 *
 * Must:
 * - Start with forward slash (/)
 * - Contain only lowercase letters, numbers, hyphens, and forward slashes
 * - Be descriptive and hierarchical
 *
 * Used for page routing, API endpoints, and navigation links.
 * Nested paths are supported for hierarchical structure.
 *
 * @example
 * ```typescript
 * const root = '/'
 * const simple = '/about'
 * const nested = '/products/inventory'
 * const kebabCase = '/our-team'
 * ```
 *
 * @see specs/app/common/definitions.schema.json#/definitions/path
 */
export const PathSchema = Schema.String.pipe(
  Schema.minLength(1),
  Schema.pattern(/^\/[a-z0-9-/]*$/, {
    message: () =>
      'Path must start with / and contain only lowercase letters, numbers, hyphens, and forward slashes',
  }),
  Schema.annotations({
    title: 'Path',
    description: 'URL path for routing and navigation',
    examples: ['/home', '/customers', '/products/inventory', '/admin/settings', '/reports/sales'],
  })
)

export type Id = Schema.Schema.Type<typeof IdSchema>
export type Name = Schema.Schema.Type<typeof NameSchema>
export type Path = Schema.Schema.Type<typeof PathSchema>
