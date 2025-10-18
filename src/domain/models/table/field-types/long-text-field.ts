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
 * Long Text Field
 *
 * Multi-line text input for paragraphs, descriptions, notes, and comments.
 * Supports line breaks and longer content. Text is stored as-is without rich
 * formatting (no bold, italics, etc.). Required flag makes the field mandatory.
 * Indexing improves search performance but may be slower for very long content.
 *
 * Business Rules:
 * - Multi-line support allows paragraphs and extended content while preserving line breaks
 * - Text is stored without formatting, focusing on plain text content
 * - Indexing optional due to performance trade-offs with large text content
 * - Constant value 'long-text' ensures type safety and enables discriminated unions
 *
 * @example
 * ```typescript
 * const field = {
 *   id: 1,
 *   name: 'description',
 *   type: 'long-text',
 *   required: true,
 *   indexed: false,
 *   default: 'Enter description here...'
 * }
 * ```
 */
export const LongTextFieldSchema = Schema.Struct({
  id: IdSchema,
  name: FieldNameSchema,
  type: Schema.Literal('long-text').pipe(
    Schema.annotations({
      description: "Constant value 'long-text' for type discrimination in discriminated unions",
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
      description:
        'Whether to create a database index on this field (may be slower for very long content)',
    })
  ),
  default: Schema.optional(
    Schema.String.pipe(
      Schema.annotations({
        description: 'Default value for this field when creating new records',
      })
    )
  ),
}).pipe(
  Schema.annotations({
    title: 'Long Text Field',
    description:
      'Multi-line text input for paragraphs, descriptions, notes, and comments. Supports line breaks and longer content without rich formatting.',
    examples: [
      {
        id: 1,
        name: 'description',
        type: 'long-text',
        required: true,
        indexed: false,
        default: 'Enter description here...',
      },
      {
        id: 2,
        name: 'notes',
        type: 'long-text',
        required: false,
      },
    ],
  })
)

export type LongTextField = Schema.Schema.Type<typeof LongTextFieldSchema>
