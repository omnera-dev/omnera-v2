import { Schema } from 'effect'
import { IdSchema } from '@/domain/models/table/id.ts'

/**
 * Updated At Field
 *
 * Automatically updates the timestamp whenever a record is modified.
 * This field is system-managed and cannot be manually edited.
 * Automatically updates on every record update operation.
 * Commonly used for tracking last modification time and cache invalidation.
 *
 * @example
 * ```typescript
 * const field = {
 *   id: 1,
 *   name: 'updated_at',
 *   type: 'updated-at',
 *   indexed: true
 * }
 * ```
 */
export const UpdatedAtFieldSchema = Schema.Struct({
  id: IdSchema,
  name: Schema.Unknown,
  type: Schema.String,
  indexed: Schema.optional(Schema.Boolean),
}).pipe(
  Schema.annotations({
    title: 'Updated At Field',
    description:
      'Automatically updates the timestamp whenever a record is modified. System-managed field that updates on every change.',
    examples: [
      {
        id: 1,
        name: 'updated_at',
        type: 'updated-at',
        indexed: true,
      },
    ],
  })
)

export type UpdatedAtField = Schema.Schema.Type<typeof UpdatedAtFieldSchema>
