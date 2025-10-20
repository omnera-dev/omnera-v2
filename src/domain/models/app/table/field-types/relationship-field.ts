/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'
import { BaseFieldSchema } from './base-field'

export const RelationshipFieldSchema = BaseFieldSchema.pipe(
  Schema.extend(
    Schema.Struct({
      type: Schema.Literal('relationship'),
      relatedTable: Schema.String.pipe(
        Schema.minLength(1, { message: () => 'This field is required' }),
        Schema.annotations({
          description: 'Name of the related table',
        })
      ),
      relationType: Schema.String.pipe(
        Schema.annotations({
          description: 'Type of relationship',
        })
      ),
      displayField: Schema.optional(
        Schema.String.pipe(
          Schema.minLength(1, { message: () => 'This field is required' }),
          Schema.annotations({
            description: 'Field from related table to display in UI',
          })
        )
      ),
      onDelete: Schema.optional(
        Schema.String.pipe(
          Schema.annotations({
            description: 'Action to take when the related record is deleted',
          })
        )
      ),
      onUpdate: Schema.optional(
        Schema.String.pipe(
          Schema.annotations({
            description: "Action to take when the related record's key is updated",
          })
        )
      ),
    })
  )
).pipe(
  Schema.annotations({
    title: 'Relationship Field',
    description: 'Links records to another table with referential integrity.',
    examples: [
      {
        id: 1,
        name: 'author',
        type: 'relationship',
        relatedTable: 'users',
        relationType: 'many-to-one',
      },
    ],
  })
)

export type RelationshipField = Schema.Schema.Type<typeof RelationshipFieldSchema>
