/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'
import { FieldNameSchema } from '@/domain/models/table/field-name'
import { IdSchema } from '@/domain/models/table/id'

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
  name: FieldNameSchema,
  required: Schema.optional(Schema.Boolean),
  unique: Schema.optional(Schema.Boolean),
  indexed: Schema.optional(Schema.Boolean),
  type: Schema.Literal('date', 'datetime', 'time'),
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
