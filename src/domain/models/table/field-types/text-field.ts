import { Schema } from 'effect'
import { IdSchema } from '@/domain/models/table/id.ts'

/**
 * Text Field
 *
 * Basic text input field for storing single-line or multi-line text.
 * Supports optional default values and common validation flags.
 * Can be marked as required, unique, or indexed for database optimization.
 *
 * @example
 * ```typescript
 * const field = {
 *   id: 1,
 *   name: 'description',
 *   type: 'text',
 *   required: true,
 *   default: 'Enter description here'
 * }
 * ```
 */
export const TextFieldSchema = Schema.Struct({
  id: IdSchema,
  name: Schema.Unknown,
  required: Schema.optional(Schema.Boolean),
  unique: Schema.optional(Schema.Boolean),
  indexed: Schema.optional(Schema.Boolean),
  type: Schema.String,
  default: Schema.optional(Schema.String),
}).pipe(
  Schema.annotations({
    title: 'Text Field',
    description:
      'Basic text input field for single-line or multi-line text. Supports required, unique, and indexed flags.',
    examples: [
      {
        id: 1,
        name: 'description',
        type: 'text',
        required: true,
        default: 'Enter description here',
      },
    ],
  })
)

export type TextField = Schema.Schema.Type<typeof TextFieldSchema>
