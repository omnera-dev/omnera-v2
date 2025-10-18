import { Schema } from 'effect'
import { IdSchema } from '@/domain/models/table/id.ts'

/**
 * Barcode Field
 *
 * Stores barcode values with support for various barcode formats.
 * Used for product identification, inventory tracking, and asset management.
 * Can be configured to support specific barcode standards (e.g., EAN, UPC, QR Code).
 *
 * @example
 * ```typescript
 * const field = {
 *   id: 1,
 *   name: 'product_barcode',
 *   type: 'barcode',
 *   required: true,
 *   format: 'EAN-13'
 * }
 * ```
 */
export const BarcodeFieldSchema = Schema.Struct({
  id: IdSchema,
  name: Schema.Unknown,
  required: Schema.optional(Schema.Boolean),
  type: Schema.String,
  format: Schema.optional(
    Schema.String.pipe(
      Schema.annotations({
        description: 'Barcode format',
      })
    )
  ),
}).pipe(
  Schema.annotations({
    title: 'Barcode Field',
    description:
      'Stores barcode values with various format support. Used for product identification and inventory.',
    examples: [
      {
        id: 1,
        name: 'product_barcode',
        type: 'barcode',
        required: true,
        format: 'EAN-13',
      },
    ],
  })
)

export type BarcodeField = Schema.Schema.Type<typeof BarcodeFieldSchema>
