import { Schema } from 'effect'
import { IdSchema } from '@/domain/models/table/id.ts'

/**
 * Date Field
 *
 * Stores date and optionally time values.
 * Supports custom date formats, timezone configuration, and time inclusion.
 * Can be marked as required, unique, or indexed for efficient date-based queries.
 *
 * @example
 * ```typescript
 * const field = {
 *   id: 1,
 *   name: 'due_date',
 *   type: 'date',
 *   required: true,
 *   format: 'YYYY-MM-DD',
 *   includeTime: false
 * }
 * ```
 */
export const DateFieldSchema = Schema.Struct({
  id: IdSchema,
  name: Schema.Unknown,
  required: Schema.optional(Schema.Boolean),
  unique: Schema.optional(Schema.Boolean),
  indexed: Schema.optional(Schema.Boolean),
  type: Schema.String,
  format: Schema.optional(
    Schema.String.pipe(
      Schema.annotations({
        description: 'Date format string',
        examples: ['YYYY-MM-DD', 'MM/DD/YYYY', 'DD-MM-YYYY'],
      })
    )
  ),
  includeTime: Schema.optional(Schema.Boolean),
  timezone: Schema.optional(
    Schema.String.pipe(
      Schema.annotations({
        description: 'Timezone for datetime fields',
        examples: ['UTC', 'America/New_York', 'Europe/London'],
      })
    )
  ),
  default: Schema.optional(Schema.String),
}).pipe(
  Schema.annotations({
    title: 'Date Field',
    description:
      'Stores date and optionally time values. Supports custom formats, timezones, and time inclusion.',
    examples: [
      {
        id: 1,
        name: 'due_date',
        type: 'date',
        required: true,
        format: 'YYYY-MM-DD',
        includeTime: false,
      },
    ],
  })
)

export type DateField = Schema.Schema.Type<typeof DateFieldSchema>
