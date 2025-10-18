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
 * Decimal Field
 *
 * Numeric field for storing numbers with decimal places. Ideal for measurements,
 * calculations, percentages (as decimals), and any value requiring fractional precision.
 * Supports configurable precision (number of decimal places) and min/max range validation.
 * Can be marked as required, unique, or indexed. Stored using DECIMAL database type for
 * exact precision without floating-point errors.
 *
 * Business Rules:
 * - Precision defines number of decimal places (0-10), defaulting to 2 for common use cases
 * - DECIMAL storage ensures exact representation without floating-point rounding errors
 * - Min/max validation optional - useful for enforcing valid ranges
 * - Precision of 0 effectively creates an integer (use Integer Field instead for clarity)
 * - Indexing recommended for fields used in sorting, filtering, or calculations
 * - Constant value 'decimal' ensures type safety and enables discriminated unions
 *
 * @example
 * ```typescript
 * const field = {
 *   id: 1,
 *   name: 'weight',
 *   type: 'decimal',
 *   required: true,
 *   precision: 2,
 *   min: 0.01,
 *   max: 999.99,
 *   default: 1.00
 * }
 * ```
 */
export const DecimalFieldSchema = Schema.Struct({
  id: IdSchema,
  name: FieldNameSchema,
  type: Schema.Literal('decimal').pipe(
    Schema.annotations({
      description: "Constant value 'decimal' for type discrimination in discriminated unions",
    })
  ),
  required: Schema.optional(Schema.Boolean).pipe(
    Schema.annotations({
      description: 'Whether this field is required (cannot be empty)',
    })
  ),
  unique: Schema.optional(Schema.Boolean).pipe(
    Schema.annotations({
      description: 'Whether this field must contain unique values across all rows',
    })
  ),
  indexed: Schema.optional(Schema.Boolean).pipe(
    Schema.annotations({
      description: 'Whether to create a database index for faster numeric queries and sorting',
    })
  ),
  precision: Schema.optional(
    Schema.Int.pipe(
      Schema.greaterThanOrEqualTo(0),
      Schema.lessThanOrEqualTo(10),
      Schema.annotations({
        description: 'Number of decimal places (0-10)',
      })
    )
  ),
  min: Schema.optional(
    Schema.Number.pipe(
      Schema.annotations({
        description: 'Minimum allowed value (inclusive)',
      })
    )
  ),
  max: Schema.optional(
    Schema.Number.pipe(
      Schema.annotations({
        description: 'Maximum allowed value (inclusive)',
      })
    )
  ),
  default: Schema.optional(
    Schema.Number.pipe(
      Schema.annotations({
        description: 'Default decimal value when creating new records',
      })
    )
  ),
}).pipe(
  Schema.annotations({
    title: 'Decimal Field',
    description:
      'Numeric field for numbers with decimal places. Supports configurable precision (0-10 decimal places) and min/max range validation. Uses exact DECIMAL storage.',
    examples: [
      {
        id: 1,
        name: 'weight',
        type: 'decimal',
        required: true,
        precision: 2,
        min: 0.01,
        max: 999.99,
        default: 1.0,
      },
      {
        id: 2,
        name: 'tax_rate',
        type: 'decimal',
        required: true,
        precision: 4,
        min: 0,
        max: 1,
        default: 0.0825,
      },
    ],
  })
)

export type DecimalField = Schema.Schema.Type<typeof DecimalFieldSchema>
