import { Schema } from 'effect'
import { IdSchema } from '@/domain/models/table/id.ts'

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
  name: Schema.Unknown,
  type: Schema.String,
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
