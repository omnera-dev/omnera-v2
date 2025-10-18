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
  name: FieldNameSchema,
  required: Schema.optional(Schema.Boolean),
  type: Schema.Literal('geolocation'),
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
