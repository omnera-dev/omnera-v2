import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { UpdatedByFieldSchema } from './updated-by-field.ts'

describe('UpdatedByFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid updated-by field', () => {
      const field = {
        id: 1,
        name: 'updated_by',
        type: 'updated-by',
      }

      const result = Schema.decodeUnknownSync(UpdatedByFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept updated-by field with indexed flag', () => {
      const field = {
        id: 1,
        name: 'updated_by',
        type: 'updated-by',
        indexed: true,
      }

      const result = Schema.decodeUnknownSync(UpdatedByFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept updated-by field without indexed flag', () => {
      const field = {
        id: 1,
        name: 'updated_by',
        type: 'updated-by',
        indexed: false,
      }

      const result = Schema.decodeUnknownSync(UpdatedByFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'updated_by',
        type: 'updated-by',
      }

      expect(() => {
        Schema.decodeUnknownSync(UpdatedByFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'updated_by',
      }

      expect(() => {
        Schema.decodeUnknownSync(UpdatedByFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof UpdatedByFieldSchema> = {
        id: 1,
        name: 'updated_by',
        type: 'updated-by',
        indexed: true,
      }
      expect(field.id).toBe(1)
    })
  })
})
