import { Schema } from 'effect'
import { FieldNameSchema } from '@/domain/models/table/field-name'
import { IdSchema } from '@/domain/models/table/id'

/**
 * Progress Field
 *
 * Displays a percentage value as a progress bar.
 * Used for tracking completion status, goals, or percentages.
 * Supports optional color customization for the progress bar.
 * Values are typically stored as numbers between 0 and 100.
 *
 * @example
 * ```typescript
 * const field = {
 *   id: 1,
 *   name: 'task_completion',
 *   type: 'progress',
 *   required: true,
 *   color: '#10B981'
 * }
 * ```
 */
export const ProgressFieldSchema = Schema.Struct({
  id: IdSchema,
  name: FieldNameSchema,
  required: Schema.optional(Schema.Boolean),
  type: Schema.Literal('progress'),
  color: Schema.optional(
    Schema.String.pipe(
      Schema.pattern(/^#[0-9a-fA-F]{6}$/, {
        message: () => 'Color of the progress bar',
      }),
      Schema.annotations({
        description: 'Color of the progress bar',
      })
    )
  ),
}).pipe(
  Schema.annotations({
    title: 'Progress Field',
    description:
      'Displays percentage value as progress bar. Used for tracking completion status or goals.',
    examples: [
      {
        id: 1,
        name: 'task_completion',
        type: 'progress',
        required: true,
        color: '#10B981',
      },
    ],
  })
)

export type ProgressField = Schema.Schema.Type<typeof ProgressFieldSchema>
