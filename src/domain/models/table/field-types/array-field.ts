import { Schema } from 'effect'
import { FieldNameSchema } from '@/domain/models/table/field-name'
import { IdSchema } from '@/domain/models/table/id'

export const ArrayFieldSchema = Schema.Struct({
  id: IdSchema,
  name: FieldNameSchema,
  required: Schema.optional(Schema.Boolean),
  type: Schema.Literal('array'),
  itemType: Schema.optional(
    Schema.String.pipe(Schema.annotations({ description: 'Type of items in the array' }))
  ),
  maxItems: Schema.optional(
    Schema.Int.pipe(
      Schema.greaterThanOrEqualTo(1),
      Schema.annotations({ description: 'Maximum number of items allowed' })
    )
  ),
}).pipe(
  Schema.annotations({
    title: 'Array Field',
    description: 'Stores arrays of values with optional type and length constraints.',
    examples: [{ id: 1, name: 'tags', type: 'array', itemType: 'string', maxItems: 10 }],
  })
)

export type ArrayField = Schema.Schema.Type<typeof ArrayFieldSchema>
