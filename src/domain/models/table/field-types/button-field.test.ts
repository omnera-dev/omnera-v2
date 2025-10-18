import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { ButtonFieldSchema } from './button-field.ts'

describe('ButtonFieldSchema', () => {
  test('should accept valid button field', () => {
    const field = { id: 1, name: 'approve', type: 'button', label: 'Approve', action: 'automation' }
    const result = Schema.decodeUnknownSync(ButtonFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
