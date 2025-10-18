import { Schema } from 'effect'
import { IdSchema } from '@/domain/models/table/id.ts'

export const MultipleAttachmentsFieldSchema = Schema.Struct({
  id: IdSchema,
  name: Schema.Unknown,
  required: Schema.optional(Schema.Boolean),
  indexed: Schema.optional(Schema.Boolean),
  type: Schema.String,
  maxFiles: Schema.optional(
    Schema.Int.pipe(
      Schema.greaterThanOrEqualTo(1),
      Schema.annotations({ description: 'Maximum number of files allowed' })
    )
  ),
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
          Schema.annotations({ description: 'Maximum file size in bytes per file' })
        )
      ),
      allowedTypes: Schema.optional(Schema.Array(Schema.String)),
    })
  ),
}).pipe(
  Schema.annotations({
    title: 'Multiple Attachments Field',
    description: 'Stores multiple file attachments with storage configuration.',
    examples: [{ id: 1, name: 'documents', type: 'multiple-attachments', maxFiles: 10 }],
  })
)

export type MultipleAttachmentsField = Schema.Schema.Type<typeof MultipleAttachmentsFieldSchema>
