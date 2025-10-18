import { Schema } from 'effect'
import { FieldNameSchema } from '@/domain/models/table/field-name'
import { IdSchema } from '@/domain/models/table/id'

/**
 * Created At Field
 *
 * Automatically captures the timestamp when a record is created.
 * This field is system-managed and cannot be manually edited.
 * Commonly used for audit trails and sorting by creation date.
 *
 * @example
 * ```typescript
 * const field = {
 *   id: 1,
 *   name: 'created_at',
 *   type: 'created-at',
 *   indexed: true
 * }
 * ```
 */
export const CreatedAtFieldSchema = Schema.Struct({
  id: IdSchema,
  name: FieldNameSchema,
  type: Schema.Literal('created-at'),
  indexed: Schema.optional(Schema.Boolean),
}).pipe(
  Schema.annotations({
    title: 'Created At Field',
    description:
      'Automatically captures the timestamp when a record is created. System-managed field that cannot be manually edited.',
    examples: [
      {
        id: 1,
        name: 'created_at',
        type: 'created-at',
        indexed: true,
      },
    ],
  })
)

export type CreatedAtField = Schema.Schema.Type<typeof CreatedAtFieldSchema>
