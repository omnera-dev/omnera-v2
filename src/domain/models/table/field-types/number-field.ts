import { Schema } from 'effect'
import { FieldNameSchema } from '@/domain/models/table/field-name'
import { IdSchema } from '@/domain/models/table/id'

/**
 * Number Field
 *
 * Stores numeric values with support for integers, decimals, and currency.
 * Supports validation constraints like min/max ranges and decimal precision.
 * Can be configured with currency codes for financial data.
 *
 * @example
 * ```typescript
 * const field = {
 *   id: 1,
 *   name: 'price',
 *   type: 'number',
 *   required: true,
 *   min: 0,
 *   precision: 2,
 *   currency: 'USD'
 * }
 * ```
 */
export const NumberFieldSchema = Schema.Struct({
  id: IdSchema,
  name: FieldNameSchema,
  required: Schema.optional(Schema.Boolean),
  unique: Schema.optional(Schema.Boolean),
  indexed: Schema.optional(Schema.Boolean),
  type: Schema.Literal('integer', 'decimal', 'currency', 'percentage'),
  min: Schema.optional(
    Schema.Number.pipe(
      Schema.annotations({
        description: 'Minimum value',
      })
    )
  ),
  max: Schema.optional(
    Schema.Number.pipe(
      Schema.annotations({
        description: 'Maximum value',
      })
    )
  ),
  precision: Schema.optional(
    Schema.Int.pipe(
      Schema.greaterThanOrEqualTo(0),
      Schema.lessThanOrEqualTo(10),
      Schema.annotations({
        description: 'Number of decimal places (for decimal type)',
      })
    )
  ),
  currency: Schema.optional(
    Schema.String.pipe(
      Schema.annotations({
        description: 'Currency code (for currency type)',
        examples: ['USD', 'EUR', 'GBP'],
      })
    )
  ),
  default: Schema.optional(Schema.Number),
}).pipe(
  Schema.annotations({
    title: 'Number Field',
    description:
      'Stores numeric values with support for integers, decimals, and currency. Supports min/max validation and precision control.',
    examples: [
      {
        id: 1,
        name: 'price',
        type: 'number',
        required: true,
        min: 0,
        precision: 2,
        currency: 'USD',
      },
    ],
  })
)

export type NumberField = Schema.Schema.Type<typeof NumberFieldSchema>
