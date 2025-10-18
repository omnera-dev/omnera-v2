import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { UserFieldSchema } from './user-field.ts'

describe('UserFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid user field', () => {
      const field = {
        id: 1,
        name: 'assigned_to',
        type: 'user',
      }

      const result = Schema.decodeUnknownSync(UserFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept user field with all optional properties', () => {
      const field = {
        id: 1,
        name: 'assigned_to',
        type: 'user',
        required: true,
        indexed: true,
        allowMultiple: true,
      }

      const result = Schema.decodeUnknownSync(UserFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept user field allowing single user', () => {
      const field = {
        id: 1,
        name: 'owner',
        type: 'user',
        allowMultiple: false,
      }

      const result = Schema.decodeUnknownSync(UserFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'assigned_to',
        type: 'user',
      }

      expect(() => {
        Schema.decodeUnknownSync(UserFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'assigned_to',
      }

      expect(() => {
        Schema.decodeUnknownSync(UserFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof UserFieldSchema> = {
        id: 1,
        name: 'assigned_to',
        type: 'user',
        allowMultiple: true,
      }
      expect(field.id).toBe(1)
    })
  })
})
