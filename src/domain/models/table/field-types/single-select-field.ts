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
 * Single Select Field
 *
 * Allows selection of one option from a predefined list.
 * Commonly used for categories, statuses, or any enumerated values.
 * Supports optional default value selection.
 *
 * @example
 * ```typescript
 * const field = {
 *   id: 1,
 *   name: 'category',
 *   type: 'single-select',
 *   options: ['Electronics', 'Clothing', 'Food'],
 *   default: 'Electronics'
 * }
 * ```
 */
export const SingleSelectFieldSchema = Schema.Struct({
  id: IdSchema,
  name: FieldNameSchema,
  required: Schema.optional(Schema.Boolean),
  indexed: Schema.optional(Schema.Boolean),
  type: Schema.Literal('single-select'),
  options: Schema.Array(Schema.String),
  default: Schema.optional(Schema.String),
}).pipe(
  Schema.annotations({
    title: 'Single Select Field',
    description:
      'Allows selection of one option from predefined list. Used for categories or enumerated values.',
    examples: [
      {
        id: 1,
        name: 'category',
        type: 'single-select',
        options: ['Electronics', 'Clothing', 'Food'],
        default: 'Electronics',
      },
    ],
  })
)

export type SingleSelectField = Schema.Schema.Type<typeof SingleSelectFieldSchema>
