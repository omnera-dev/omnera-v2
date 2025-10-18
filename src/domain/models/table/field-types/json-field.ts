import { Schema } from 'effect'
import { IdSchema } from '@/domain/models/table/id.ts'

export const JsonFieldSchema = Schema.Struct({
  id: IdSchema,
  name: Schema.Unknown,
  required: Schema.optional(Schema.Boolean),
  type: Schema.String,
  schema: Schema.optional(Schema.Struct({})),
}).pipe(
  Schema.annotations({
    title: 'JSON Field',
    description: 'Stores structured JSON data with optional schema validation.',
    examples: [{ id: 1, name: 'metadata', type: 'json', required: false }],
  })
)

export type JsonField = Schema.Schema.Type<typeof JsonFieldSchema>
