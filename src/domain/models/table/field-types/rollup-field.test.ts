import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { RollupFieldSchema } from './rollup-field'

describe('RollupFieldSchema', () => {
  test('should accept valid rollup field', () => {
    const field = {
      id: 1,
      name: 'total',
      type: 'rollup',
      relationshipField: 'orders',
      relatedField: 'amount',
      aggregation: 'SUM',
    }
    const result = Schema.decodeUnknownSync(RollupFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
