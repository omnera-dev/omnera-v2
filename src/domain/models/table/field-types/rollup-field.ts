import { Schema } from 'effect'
import { FieldNameSchema } from '@/domain/models/table/field-name'
import { IdSchema } from '@/domain/models/table/id'

export const RollupFieldSchema = Schema.Struct({
  id: IdSchema,
  name: FieldNameSchema,
  type: Schema.Literal('rollup'),
  relationshipField: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'This field is required' }),
    Schema.annotations({ description: 'Name of the relationship field to aggregate from' })
  ),
  relatedField: Schema.String.pipe(
    Schema.minLength(1, { message: () => 'This field is required' }),
    Schema.annotations({ description: 'Name of the field in the related table to aggregate' })
  ),
  aggregation: Schema.String.pipe(
    Schema.annotations({ description: 'Aggregation function to apply' })
  ),
  format: Schema.optional(
    Schema.String.pipe(
      Schema.annotations({
        description: 'Display format for the result',
        examples: ['currency', 'number', 'percentage'],
      })
    )
  ),
}).pipe(
  Schema.annotations({
    title: 'Rollup Field',
    description: 'Aggregates values from related records using functions like SUM, AVG, COUNT.',
    examples: [
      {
        id: 1,
        name: 'total_sales',
        type: 'rollup',
        relationshipField: 'orders',
        relatedField: 'amount',
        aggregation: 'SUM',
      },
    ],
  })
)

export type RollupField = Schema.Schema.Type<typeof RollupFieldSchema>
