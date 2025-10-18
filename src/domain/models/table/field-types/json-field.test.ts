import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { JsonFieldSchema } from './json-field.ts'

describe('JsonFieldSchema', () => {
  test('should accept valid json field', () => {
    const field = { id: 1, name: 'metadata', type: 'json' }
    const result = Schema.decodeUnknownSync(JsonFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
