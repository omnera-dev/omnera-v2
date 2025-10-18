import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { MultiSelectFieldSchema } from './multi-select-field'

describe('MultiSelectFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid multi-select field', () => {
      const field = {
        id: 1,
        name: 'tags',
        type: 'multi-select',
        options: ['Urgent', 'Important'],
      }

      const result = Schema.decodeUnknownSync(MultiSelectFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'tags',
        type: 'multi-select',
        options: ['A'],
      }

      expect(() => {
        Schema.decodeUnknownSync(MultiSelectFieldSchema)(field)
      }).toThrow()
    })
  })
})
