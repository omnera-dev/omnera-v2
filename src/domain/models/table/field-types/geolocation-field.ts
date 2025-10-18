import { Schema } from 'effect'
import { IdSchema } from '@/domain/models/table/id.ts'

/**
 * Geolocation Field
 *
 * Stores geographic coordinates (latitude and longitude).
 * Used for location-based features like maps, distance calculations, and proximity searches.
 * Typically rendered with a map picker in the UI.
 *
 * @example
 * ```typescript
 * const field = {
 *   id: 1,
 *   name: 'office_location',
 *   type: 'geolocation',
 *   required: true
 * }
 * ```
 */
export const GeolocationFieldSchema = Schema.Struct({
  id: IdSchema,
  name: Schema.Unknown,
  required: Schema.optional(Schema.Boolean),
  type: Schema.String,
}).pipe(
  Schema.annotations({
    title: 'Geolocation Field',
    description:
      'Stores geographic coordinates (latitude and longitude). Used for location-based features.',
    examples: [
      {
        id: 1,
        name: 'office_location',
        type: 'geolocation',
        required: true,
      },
    ],
  })
)

export type GeolocationField = Schema.Schema.Type<typeof GeolocationFieldSchema>
