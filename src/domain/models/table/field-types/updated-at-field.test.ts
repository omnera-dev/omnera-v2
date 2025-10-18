import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { UpdatedAtFieldSchema } from './updated-at-field'

describe('UpdatedAtFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid updated-at field', () => {
      const field = {
        id: 1,
        name: 'updated_at',
        type: 'updated-at',
      }

      const result = Schema.decodeUnknownSync(UpdatedAtFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept updated-at field with indexed flag', () => {
      const field = {
        id: 1,
        name: 'updated_at',
        type: 'updated-at',
        indexed: true,
      }

      const result = Schema.decodeUnknownSync(UpdatedAtFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept updated-at field without indexed flag', () => {
      const field = {
        id: 1,
        name: 'updated_at',
        type: 'updated-at',
        indexed: false,
      }

      const result = Schema.decodeUnknownSync(UpdatedAtFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'updated_at',
        type: 'updated-at',
      }

      expect(() => {
        Schema.decodeUnknownSync(UpdatedAtFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'updated_at',
      }

      expect(() => {
        Schema.decodeUnknownSync(UpdatedAtFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof UpdatedAtFieldSchema> = {
        id: 1,
        name: 'updated_at',
        type: 'updated-at',
        indexed: true,
      }
      expect(field.id).toBe(1)
    })
  })
})
