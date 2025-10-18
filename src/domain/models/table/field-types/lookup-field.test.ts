import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { LookupFieldSchema } from './lookup-field.ts'

describe('LookupFieldSchema', () => {
  test('should accept valid lookup field', () => {
    const field = {
      id: 1,
      name: 'email',
      type: 'lookup',
      relationshipField: 'customer',
      relatedField: 'email',
    }
    const result = Schema.decodeUnknownSync(LookupFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
