import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { FieldsSchema } from './fields.ts'

describe('FieldsSchema', () => {
  describe('valid values', () => {
    test('should accept array with at least one field', () => {
      const fields = [
        {
          id: 1,
          name: 'email',
          type: 'text',
        },
      ]

      const result = Schema.decodeUnknownSync(FieldsSchema)(fields)
      expect(result).toEqual(fields)
    })

    test('should accept multiple fields', () => {
      const fields = [
        {
          id: 1,
          name: 'email',
          type: 'text',
        },
        {
          id: 2,
          name: 'name',
          type: 'text',
        },
      ]

      const result = Schema.decodeUnknownSync(FieldsSchema)(fields)
      expect(result).toEqual(fields)
    })
  })

  describe('invalid values', () => {
    test('should reject empty array', () => {
      expect(() => {
        Schema.decodeUnknownSync(FieldsSchema)([])
      }).toThrow()
    })

    test('should reject non-array value', () => {
      expect(() => {
        Schema.decodeUnknownSync(FieldsSchema)({
          id: 1,
          name: 'email',
          type: 'text',
        })
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const fields: Schema.Schema.Type<typeof FieldsSchema> = [
        {
          id: 1,
          name: 'email',
          type: 'text',
        },
      ]
      expect(fields).toHaveLength(1)
    })
  })
})
