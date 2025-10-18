import { Schema } from 'effect'
import { IdSchema } from '@/domain/models/table/id.ts'

export const RelationshipFieldSchema = Schema.Struct({
  id: IdSchema,
  name: Schema.Unknown,
  required: Schema.optional(Schema.Boolean),
  indexed: Schema.optional(Schema.Boolean),
  type: Schema.String,
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
}).pipe(
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
