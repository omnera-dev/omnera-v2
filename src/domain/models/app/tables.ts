import { Schema } from 'effect'
import { IdSchema } from '@/domain/models/table/id.ts'
import { NameSchema } from '@/domain/models/table/name.ts'
import { FieldsSchema } from '@/domain/models/table/fields.ts'
import { PrimaryKeySchema } from '@/domain/models/table/primary-key.ts'
import { UniqueConstraintsSchema } from '@/domain/models/table/unique-constraints.ts'
import { IndexesSchema } from '@/domain/models/table/indexes.ts'

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
export const TablesSchema = Schema.Array(
  Schema.Struct({
    id: IdSchema,
    name: NameSchema,
    fields: FieldsSchema,
    primaryKey: Schema.optional(PrimaryKeySchema),
    uniqueConstraints: Schema.optional(UniqueConstraintsSchema),
    indexes: Schema.optional(IndexesSchema),
  })
).pipe(
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
            { id: 1, name: 'email', type: 'email', required: true },
            { id: 2, name: 'name', type: 'text', required: true },
          ],
        },
      ],
    ],
  })
)

export type Tables = Schema.Schema.Type<typeof TablesSchema>
