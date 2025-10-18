import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { ArrayFieldSchema } from './array-field'

describe('ArrayFieldSchema', () => {
  test('should accept valid array field', () => {
    const field = { id: 1, name: 'tags', type: 'array', itemType: 'string' }
    const result = Schema.decodeUnknownSync(ArrayFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
