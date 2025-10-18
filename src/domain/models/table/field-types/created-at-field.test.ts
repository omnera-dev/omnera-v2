import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { CreatedAtFieldSchema } from './created-at-field'

describe('CreatedAtFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid created-at field', () => {
      const field = {
        id: 1,
        name: 'created_at',
        type: 'created-at',
      }

      const result = Schema.decodeUnknownSync(CreatedAtFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept created-at field with indexed flag', () => {
      const field = {
        id: 1,
        name: 'created_at',
        type: 'created-at',
        indexed: true,
      }

      const result = Schema.decodeUnknownSync(CreatedAtFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept created-at field without indexed flag', () => {
      const field = {
        id: 1,
        name: 'created_at',
        type: 'created-at',
        indexed: false,
      }

      const result = Schema.decodeUnknownSync(CreatedAtFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'created_at',
        type: 'created-at',
      }

      expect(() => {
        Schema.decodeUnknownSync(CreatedAtFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'created_at',
      }

      expect(() => {
        Schema.decodeUnknownSync(CreatedAtFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof CreatedAtFieldSchema> = {
        id: 1,
        name: 'created_at',
        type: 'created-at',
        indexed: true,
      }
      expect(field.id).toBe(1)
    })
  })
})
