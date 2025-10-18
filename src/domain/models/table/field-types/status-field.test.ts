import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { StatusFieldSchema } from './status-field'

describe('StatusFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid status field', () => {
      const field = {
        id: 1,
        name: 'status',
        type: 'status',
        options: [{ value: 'todo', color: '#94A3B8' }],
      }

      const result = Schema.decodeUnknownSync(StatusFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'status',
        type: 'status',
        options: [{ value: 'todo' }],
      }

      expect(() => {
        Schema.decodeUnknownSync(StatusFieldSchema)(field)
      }).toThrow()
    })
  })
})
