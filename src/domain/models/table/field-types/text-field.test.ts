import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { TextFieldSchema } from './text-field.ts'

describe('TextFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid text field', () => {
      const field = {
        id: 1,
        name: 'description',
        type: 'text',
      }

      const result = Schema.decodeUnknownSync(TextFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept text field with all optional properties', () => {
      const field = {
        id: 1,
        name: 'description',
        type: 'text',
        required: true,
        unique: true,
        indexed: true,
        default: 'Default text',
      }

      const result = Schema.decodeUnknownSync(TextFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept text field with default value', () => {
      const field = {
        id: 1,
        name: 'description',
        type: 'text',
        default: 'Enter text here',
      }

      const result = Schema.decodeUnknownSync(TextFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'description',
        type: 'text',
      }

      expect(() => {
        Schema.decodeUnknownSync(TextFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'description',
      }

      expect(() => {
        Schema.decodeUnknownSync(TextFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof TextFieldSchema> = {
        id: 1,
        name: 'description',
        type: 'text',
        required: true,
      }
      expect(field.id).toBe(1)
    })
  })
})
