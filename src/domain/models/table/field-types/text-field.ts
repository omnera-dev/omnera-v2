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
 * Text Field
 *
 * Basic text input field for storing single-line or multi-line text.
 * Supports optional default values and common validation flags.
 * Can be marked as required, unique, or indexed for database optimization.
 *
 * @example
 * ```typescript
 * const field = {
 *   id: 1,
 *   name: 'description',
 *   type: 'text',
 *   required: true,
 *   default: 'Enter description here'
 * }
 * ```
 */
export const TextFieldSchema = Schema.Struct({
  id: IdSchema,
  name: FieldNameSchema,
  required: Schema.optional(Schema.Boolean),
  unique: Schema.optional(Schema.Boolean),
  indexed: Schema.optional(Schema.Boolean),
  type: Schema.Literal('single-line-text', 'long-text', 'phone-number', 'email', 'url'),
  default: Schema.optional(Schema.String),
}).pipe(
  Schema.annotations({
    title: 'Text Field',
    description:
      'Basic text input field for single-line or multi-line text. Supports required, unique, and indexed flags.',
    examples: [
      {
        id: 1,
        name: 'description',
        type: 'text',
        required: true,
        default: 'Enter description here',
      },
    ],
  })
)

export type TextField = Schema.Schema.Type<typeof TextFieldSchema>
