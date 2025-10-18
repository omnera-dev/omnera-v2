import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { CheckboxFieldSchema } from './checkbox-field'

describe('CheckboxFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid checkbox field', () => {
      const field = {
        id: 1,
        name: 'is_active',
        type: 'checkbox',
      }

      const result = Schema.decodeUnknownSync(CheckboxFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept checkbox field with all optional properties', () => {
      const field = {
        id: 1,
        name: 'is_active',
        type: 'checkbox',
        required: true,
        indexed: true,
        default: false,
      }

      const result = Schema.decodeUnknownSync(CheckboxFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept checkbox field with default true', () => {
      const field = {
        id: 1,
        name: 'is_active',
        type: 'checkbox',
        default: true,
      }

      const result = Schema.decodeUnknownSync(CheckboxFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'is_active',
        type: 'checkbox',
      }

      expect(() => {
        Schema.decodeUnknownSync(CheckboxFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'is_active',
      }

      expect(() => {
        Schema.decodeUnknownSync(CheckboxFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof CheckboxFieldSchema> = {
        id: 1,
        name: 'is_active',
        type: 'checkbox',
        default: true,
      }
      expect(field.id).toBe(1)
    })
  })
})
