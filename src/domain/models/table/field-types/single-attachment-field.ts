/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'
import { BaseFieldSchema } from './base-field'

export const SingleAttachmentFieldSchema = BaseFieldSchema.pipe(
  Schema.extend(
    Schema.Struct({
      type: Schema.Literal('single-attachment'),
      storage: Schema.optional(
        Schema.Struct({
          provider: Schema.optional(
            Schema.String.pipe(Schema.annotations({ description: 'Storage provider' }))
          ),
          bucket: Schema.optional(
            Schema.String.pipe(
              Schema.annotations({ description: 'S3 bucket name (required for s3 provider)' })
            )
          ),
          maxSize: Schema.optional(
            Schema.Int.pipe(
              Schema.greaterThanOrEqualTo(1),
              Schema.annotations({ description: 'Maximum file size in bytes' })
            )
          ),
          allowedTypes: Schema.optional(Schema.Array(Schema.String)),
        })
      ),
    })
  )
).pipe(
  Schema.annotations({
    title: 'Single Attachment Field',
    description: 'Stores a single file attachment with storage configuration.',
    examples: [
      {
        id: 1,
        name: 'profile_pic',
        type: 'single-attachment',
        storage: { provider: 'local', maxSize: 5_242_880 },
      },
    ],
  })
)

export type SingleAttachmentField = Schema.Schema.Type<typeof SingleAttachmentFieldSchema>
