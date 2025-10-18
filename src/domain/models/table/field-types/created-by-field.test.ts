import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { CreatedByFieldSchema } from './created-by-field.ts'

describe('CreatedByFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid created-by field', () => {
      const field = {
        id: 1,
        name: 'created_by',
        type: 'created-by',
      }

      const result = Schema.decodeUnknownSync(CreatedByFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept created-by field with indexed flag', () => {
      const field = {
        id: 1,
        name: 'created_by',
        type: 'created-by',
        indexed: true,
      }

      const result = Schema.decodeUnknownSync(CreatedByFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept created-by field without indexed flag', () => {
      const field = {
        id: 1,
        name: 'created_by',
        type: 'created-by',
        indexed: false,
      }

      const result = Schema.decodeUnknownSync(CreatedByFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'created_by',
        type: 'created-by',
      }

      expect(() => {
        Schema.decodeUnknownSync(CreatedByFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'created_by',
      }

      expect(() => {
        Schema.decodeUnknownSync(CreatedByFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof CreatedByFieldSchema> = {
        id: 1,
        name: 'created_by',
        type: 'created-by',
        indexed: true,
      }
      expect(field.id).toBe(1)
    })
  })
})
