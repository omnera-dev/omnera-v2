import { Schema } from 'effect'
import { IdSchema } from '@/domain/models/table/id.ts'

export const MultiSelectFieldSchema = Schema.Struct({
  id: IdSchema,
  name: Schema.Unknown,
  required: Schema.optional(Schema.Boolean),
  indexed: Schema.optional(Schema.Boolean),
  type: Schema.String,
  options: Schema.Array(Schema.String),
  maxSelections: Schema.optional(
    Schema.Int.pipe(
      Schema.greaterThanOrEqualTo(1),
      Schema.annotations({
        description: 'Maximum number of selections allowed',
      })
    )
  ),
  default: Schema.optional(Schema.Array(Schema.String)),
}).pipe(
  Schema.annotations({
    title: 'Multi Select Field',
    description: 'Allows selection of multiple options from predefined list.',
    examples: [
      {
        id: 1,
        name: 'tags',
        type: 'multi-select',
        options: ['Urgent', 'Important', 'Review'],
        maxSelections: 3,
      },
    ],
  })
)

export type MultiSelectField = Schema.Schema.Type<typeof MultiSelectFieldSchema>
