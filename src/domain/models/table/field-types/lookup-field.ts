import { Schema } from 'effect'
import { IdSchema } from '@/domain/models/table/id.ts'

export const LookupFieldSchema = Schema.Struct({
  id: IdSchema,
  name: Schema.Unknown,
  type: Schema.String,
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
