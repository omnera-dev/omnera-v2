import { Schema } from 'effect'
import { FieldNameSchema } from '@/domain/models/table/field-name'
import { IdSchema } from '@/domain/models/table/id'

/**
 * Checkbox Field
 *
 * Boolean field that stores true/false values.
 * Typically rendered as a checkbox in the UI.
 * Supports optional default value and database indexing.
 *
 * @example
 * ```typescript
 * const field = {
 *   id: 1,
 *   name: 'is_active',
 *   type: 'checkbox',
 *   required: true,
 *   default: false
 * }
 * ```
 */
export const CheckboxFieldSchema = Schema.Struct({
  id: IdSchema,
  name: FieldNameSchema,
  required: Schema.optional(Schema.Boolean),
  indexed: Schema.optional(Schema.Boolean),
  type: Schema.Literal('checkbox'),
  default: Schema.optional(Schema.Boolean),
}).pipe(
  Schema.annotations({
    title: 'Checkbox Field',
    description: 'Boolean field for true/false values. Typically rendered as a checkbox in the UI.',
    examples: [
      {
        id: 1,
        name: 'is_active',
        type: 'checkbox',
        required: true,
        default: false,
      },
    ],
  })
)

export type CheckboxField = Schema.Schema.Type<typeof CheckboxFieldSchema>
