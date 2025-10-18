/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'
import { FieldsSchema } from '@/domain/models/table/fields'
import { IdSchema } from '@/domain/models/table/id'
import { IndexesSchema } from '@/domain/models/table/indexes'
import { NameSchema } from '@/domain/models/table/name'
import { PrimaryKeySchema } from '@/domain/models/table/primary-key'
import { UniqueConstraintsSchema } from '@/domain/models/table/unique-constraints'

/**
 * Table Schema
 *
 * Defines a single database table entity with its structure, fields, and constraints.
 * Each table represents a distinct entity (e.g., users, products, orders) with fields
 * that define the data schema. Tables support primary keys, unique constraints, and
 * indexes for efficient data access and integrity.
 *
 * @example
 * ```typescript
 * const userTable = {
 *   id: 1,
 *   name: 'users',
 *   fields: [
 *     { id: 1, name: 'email', type: 'email', required: true },
 *     { id: 2, name: 'name', type: 'single-line-text', required: true }
 *   ],
 *   primaryKey: { fields: ['id'] },
 *   uniqueConstraints: [{ fields: ['email'] }]
 * }
 * ```
 *
 * @see docs/specifications/roadmap/tables.md for full specification
 */
export const TableSchema = Schema.Struct({
  id: IdSchema,
  name: NameSchema,
  fields: FieldsSchema,
  primaryKey: Schema.optional(PrimaryKeySchema),
  uniqueConstraints: Schema.optional(UniqueConstraintsSchema),
  indexes: Schema.optional(IndexesSchema),
}).pipe(
  Schema.annotations({
    title: 'Table',
    description:
      'A database table that defines the structure of an entity in your application. Contains fields, constraints, and indexes to organize and validate data.',
    examples: [
      {
        id: 1,
        name: 'users',
        fields: [
          { id: 1, name: 'email', type: 'email' as const, required: true },
          { id: 2, name: 'name', type: 'single-line-text' as const, required: true },
        ],
      },
      {
        id: 2,
        name: 'products',
        fields: [
          { id: 1, name: 'title', type: 'single-line-text' as const, required: true },
          { id: 2, name: 'price', type: 'currency' as const, required: true, currency: 'USD' },
          { id: 3, name: 'description', type: 'long-text' as const, required: false },
        ],
        primaryKey: { type: 'composite', fields: ['id'] },
      },
    ],
  })
)

export type Table = Schema.Schema.Type<typeof TableSchema>

/**
 * Data Tables
 *
 * Collection of database tables that define the data structure of your application.
 * Each table represents an entity (e.g., users, products, orders) with fields that
 * define the schema. Tables support relationships, indexes, constraints, and various
 * field types. Tables are the foundation of your application's data model and
 * determine what information can be stored and how it relates.
 *
 * @example
 * ```typescript
 * const tables = [
 *   {
 *     id: 1,
 *     name: 'users',
 *     fields: [
 *       { id: 1, name: 'email', type: 'email', required: true },
 *       { id: 2, name: 'name', type: 'text', required: true }
 *     ]
 *   }
 * ]
 * ```
 *
 * @see docs/specifications/roadmap/tables.md for full specification
 */
export const TablesSchema = Schema.Array(TableSchema).pipe(
  Schema.annotations({
    title: 'Data Tables',
    description:
      'Collection of database tables that define the data structure of your application. Each table represents an entity (e.g., users, products, orders) with fields that define the schema. Tables support relationships, indexes, constraints, and various field types. Tables are the foundation of your application data model and determine what information can be stored and how it relates.',
    examples: [
      [
        {
          id: 1,
          name: 'users',
          fields: [
            { id: 1, name: 'email', type: 'email' as const, required: true },
            { id: 2, name: 'name', type: 'single-line-text' as const, required: true },
          ],
        },
      ],
    ],
  })
)

export type Tables = Schema.Schema.Type<typeof TablesSchema>
