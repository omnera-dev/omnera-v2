import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { SingleSelectFieldSchema } from './single-select-field'

describe('SingleSelectFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid single-select field', () => {
      const field = {
        id: 1,
        name: 'category',
        type: 'single-select',
        options: ['Electronics', 'Clothing', 'Food'],
      }

      const result = Schema.decodeUnknownSync(SingleSelectFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept single-select field with default', () => {
      const field = {
        id: 1,
        name: 'category',
        type: 'single-select',
        required: true,
        indexed: true,
        options: ['Electronics', 'Clothing', 'Food'],
        default: 'Electronics',
      }

      const result = Schema.decodeUnknownSync(SingleSelectFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'category',
        type: 'single-select',
        options: ['A', 'B'],
      }

      expect(() => {
        Schema.decodeUnknownSync(SingleSelectFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof SingleSelectFieldSchema> = {
        id: 1,
        name: 'category',
        type: 'single-select',
        options: ['A', 'B'],
      }
      expect(field.id).toBe(1)
    })
  })
})
