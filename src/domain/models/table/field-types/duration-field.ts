import { Schema } from 'effect'
import { FieldNameSchema } from '@/domain/models/table/field-name'
import { IdSchema } from '@/domain/models/table/id'

/**
 * Duration Field
 *
 * Stores time duration values (e.g., hours, minutes, seconds).
 * Used for tracking elapsed time, work hours, or time intervals.
 * Supports custom display formats for presenting duration values.
 *
 * @example
 * ```typescript
 * const field = {
 *   id: 1,
 *   name: 'work_hours',
 *   type: 'duration',
 *   required: true,
 *   format: 'h:mm'
 * }
 * ```
 */
export const DurationFieldSchema = Schema.Struct({
  id: IdSchema,
  name: FieldNameSchema,
  required: Schema.optional(Schema.Boolean),
  type: Schema.Literal('duration'),
  format: Schema.optional(
    Schema.String.pipe(
      Schema.annotations({
        description: 'Display format for the duration',
      })
    )
  ),
}).pipe(
  Schema.annotations({
    title: 'Duration Field',
    description:
      'Stores time duration values. Used for tracking elapsed time or work hours with custom formats.',
    examples: [
      {
        id: 1,
        name: 'work_hours',
        type: 'duration',
        required: true,
        format: 'h:mm',
      },
    ],
  })
)

export type DurationField = Schema.Schema.Type<typeof DurationFieldSchema>
