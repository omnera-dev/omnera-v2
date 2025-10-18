/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'
import { FieldNameSchema } from '@/domain/models/table/field-name'
import { IdSchema } from '@/domain/models/table/id'

export const LookupFieldSchema = Schema.Struct({
  id: IdSchema,
  name: FieldNameSchema,
  type: Schema.Literal('lookup'),
  relationshipField: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'This field is required' }),
    Schema.annotations({ description: 'Name of the relationship field to lookup from' })
  ),
  relatedField: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'This field is required' }),
    Schema.annotations({ description: 'Name of the field in the related table to display' })
  ),
}).pipe(
  Schema.annotations({
    title: 'Lookup Field',
    description: 'Displays values from related records without aggregation.',
    examples: [
      {
        id: 1,
        name: 'customer_email',
        type: 'lookup',
        relationshipField: 'customer',
        relatedField: 'email',
      },
    ],
  })
)

export type LookupField = Schema.Schema.Type<typeof LookupFieldSchema>
