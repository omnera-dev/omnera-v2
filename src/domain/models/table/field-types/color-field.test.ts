import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { ColorFieldSchema } from './color-field.ts'

describe('ColorFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid color field', () => {
      const field = {
        id: 1,
        name: 'brand_color',
        type: 'color',
      }

      const result = Schema.decodeUnknownSync(ColorFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept color field with valid hex default', () => {
      const field = {
        id: 1,
        name: 'brand_color',
        type: 'color',
        required: true,
        default: '#3B82F6',
      }

      const result = Schema.decodeUnknownSync(ColorFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept color field with lowercase hex', () => {
      const field = {
        id: 1,
        name: 'brand_color',
        type: 'color',
        default: '#ff0000',
      }

      const result = Schema.decodeUnknownSync(ColorFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'brand_color',
        type: 'color',
      }

      expect(() => {
        Schema.decodeUnknownSync(ColorFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field with invalid hex color', () => {
      const field = {
        id: 1,
        name: 'brand_color',
        type: 'color',
        default: '#ZZZ',
      }

      expect(() => {
        Schema.decodeUnknownSync(ColorFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field with short hex color', () => {
      const field = {
        id: 1,
        name: 'brand_color',
        type: 'color',
        default: '#FFF',
      }

      expect(() => {
        Schema.decodeUnknownSync(ColorFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof ColorFieldSchema> = {
        id: 1,
        name: 'brand_color',
        type: 'color',
        default: '#3B82F6',
      }
      expect(field.id).toBe(1)
    })
  })
})
