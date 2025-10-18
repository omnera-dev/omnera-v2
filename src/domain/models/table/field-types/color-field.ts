import { Schema } from 'effect'
import { IdSchema } from '@/domain/models/table/id.ts'

/**
 * Color Field
 *
 * Stores color values in hexadecimal format (#RRGGBB).
 * Typically rendered with a color picker in the UI.
 * Supports optional default color value.
 *
 * @example
 * ```typescript
 * const field = {
 *   id: 1,
 *   name: 'brand_color',
 *   type: 'color',
 *   required: true,
 *   default: '#3B82F6'
 * }
 * ```
 */
export const ColorFieldSchema = Schema.Struct({
  id: IdSchema,
  name: Schema.Unknown,
  required: Schema.optional(Schema.Boolean),
  type: Schema.String,
  default: Schema.optional(
    Schema.String.pipe(
      Schema.pattern(/^#[0-9a-fA-F]{6}$/, {
        message: () => 'Invalid format',
      })
    )
  ),
}).pipe(
  Schema.annotations({
    title: 'Color Field',
    description: 'Stores color values in hexadecimal format. Rendered with color picker in UI.',
    examples: [
      {
        id: 1,
        name: 'brand_color',
        type: 'color',
        required: true,
        default: '#3B82F6',
      },
    ],
  })
)

export type ColorField = Schema.Schema.Type<typeof ColorFieldSchema>
