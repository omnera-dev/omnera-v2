import { Schema } from 'effect'
import { IdSchema } from '@/domain/models/table/id.ts'

export const AutonumberFieldSchema = Schema.Struct({
  id: IdSchema,
  name: Schema.Unknown,
  type: Schema.String,
  prefix: Schema.optional(
    Schema.String.pipe(
      Schema.annotations({
        description: 'Optional prefix for the autonumber',
        examples: ['INV-', 'ORD-', ''],
      })
    )
  ),
  startFrom: Schema.optional(
    Schema.Int.pipe(
      Schema.greaterThanOrEqualTo(1),
      Schema.annotations({ description: 'Starting number' })
    )
  ),
  digits: Schema.optional(
    Schema.Int.pipe(
      Schema.greaterThanOrEqualTo(1),
      Schema.lessThanOrEqualTo(10),
      Schema.annotations({ description: 'Number of digits with zero padding' })
    )
  ),
}).pipe(
  Schema.annotations({
    title: 'Autonumber Field',
    description: 'Auto-incrementing number field with optional prefix and zero padding.',
    examples: [
      {
        id: 1,
        name: 'invoice_number',
        type: 'autonumber',
        prefix: 'INV-',
        startFrom: 1000,
        digits: 5,
      },
    ],
  })
)

export type AutonumberField = Schema.Schema.Type<typeof AutonumberFieldSchema>
