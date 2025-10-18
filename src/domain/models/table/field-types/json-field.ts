/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'
import { BaseFieldSchema } from './base-field'

export const JsonFieldSchema = BaseFieldSchema.pipe(
  Schema.extend(
    Schema.Struct({
      required: Schema.optional(Schema.Boolean),
      type: Schema.Literal('json'),
      schema: Schema.optional(Schema.Struct({})),
    })
  )
).pipe(
  Schema.annotations({
    title: 'JSON Field',
    description: 'Stores structured JSON data with optional schema validation.',
    examples: [{ id: 1, name: 'metadata', type: 'json', required: false }],
  })
)

export type JsonField = Schema.Schema.Type<typeof JsonFieldSchema>
