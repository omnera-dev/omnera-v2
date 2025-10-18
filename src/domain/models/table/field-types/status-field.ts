import { Schema } from 'effect'
import { IdSchema } from '@/domain/models/table/id.ts'

export const StatusFieldSchema = Schema.Struct({
  id: IdSchema,
  name: Schema.Unknown,
  required: Schema.optional(Schema.Boolean),
  indexed: Schema.optional(Schema.Boolean),
  type: Schema.String,
  options: Schema.Array(
    Schema.Struct({
      value: Schema.String.pipe(Schema.minLength(1, { message: () => 'This field is required' })),
      color: Schema.optional(
        Schema.String.pipe(
          Schema.pattern(/^#[0-9a-fA-F]{6}$/, {
            message: () => 'Hex color code for the status',
          }),
          Schema.annotations({
            description: 'Hex color code for the status',
          })
        )
      ),
    })
  ),
  default: Schema.optional(Schema.String),
}).pipe(
  Schema.annotations({
    title: 'Status Field',
    description: 'Status field with colored options for workflow states.',
    examples: [
      {
        id: 1,
        name: 'status',
        type: 'status',
        options: [
          { value: 'todo', color: '#94A3B8' },
          { value: 'in_progress', color: '#3B82F6' },
        ],
      },
    ],
  })
)

export type StatusField = Schema.Schema.Type<typeof StatusFieldSchema>
