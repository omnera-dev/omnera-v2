import { Schema } from 'effect'
import { FieldNameSchema } from '@/domain/models/table/field-name'
import { IdSchema } from '@/domain/models/table/id'

export const JsonFieldSchema = Schema.Struct({
  id: IdSchema,
  name: FieldNameSchema,
  required: Schema.optional(Schema.Boolean),
  type: Schema.Literal('json'),
  schema: Schema.optional(Schema.Struct({})),
}).pipe(
  Schema.annotations({
    title: 'JSON Field',
    description: 'Stores structured JSON data with optional schema validation.',
    examples: [{ id: 1, name: 'metadata', type: 'json', required: false }],
  })
)

export type JsonField = Schema.Schema.Type<typeof JsonFieldSchema>
