/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'

/**
 * Database Indexes
 *
 * Custom database indexes for query optimization. Indexes improve query performance by creating efficient lookup structures for specified fields.
 *
 * @example
 * ```typescript
 * [
 *   {
 *     "name": "idx_user_email",
 *     "fields": [
 *       "email"
 *     ]
 *   },
 *   {
 *     "name": "idx_user_created",
 *     "fields": [
 *       "created_at"
 *     ],
 *     "unique": false
 *   }
 * ]
 * ```
 */
export const IndexesSchema = Schema.Array(
  Schema.Struct({
    name: Schema.String.pipe(
      Schema.minLength(1, { message: () => 'This field is required' }),
      Schema.pattern(/^[a-z][a-z0-9_]*$/, {
        message: () => "Name of the index. Use descriptive names like 'idx_tablename_fieldname'",
      }),
      Schema.annotations({
        description: "Name of the index. Use descriptive names like 'idx_tablename_fieldname'",
        examples: ['idx_users_email', 'idx_products_sku', 'idx_orders_status'],
      })
    ),
    fields: Schema.Array(
      Schema.String.pipe(Schema.minLength(1, { message: () => 'This field is required' }))
    ).pipe(Schema.minItems(1, { message: () => 'At least one field is required' })),
    unique: Schema.optional(Schema.Boolean),
  })
).pipe(
  Schema.annotations({
    title: 'Database Indexes',
    description:
      'Custom database indexes for query optimization. Indexes improve query performance by creating efficient lookup structures for specified fields.',
    examples: [
      [
        { name: 'idx_user_email', fields: ['email'] },
        { name: 'idx_user_created', fields: ['created_at'], unique: false },
      ],
    ],
  })
)

export type Indexes = Schema.Schema.Type<typeof IndexesSchema>
