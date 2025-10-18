import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { NumberFieldSchema } from './number-field.ts'

describe('NumberFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid number field', () => {
      const field = {
        id: 1,
        name: 'price',
        type: 'number',
      }

      const result = Schema.decodeUnknownSync(NumberFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept number field with all optional properties', () => {
      const field = {
        id: 1,
        name: 'price',
        type: 'number',
        required: true,
        unique: false,
        indexed: true,
        min: 0,
        max: 1000,
        precision: 2,
        currency: 'USD',
        default: 10.5,
      }

      const result = Schema.decodeUnknownSync(NumberFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept number field with currency', () => {
      const field = {
        id: 1,
        name: 'price',
        type: 'number',
        currency: 'EUR',
        precision: 2,
      }

      const result = Schema.decodeUnknownSync(NumberFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept number field with min/max constraints', () => {
      const field = {
        id: 1,
        name: 'quantity',
        type: 'number',
        min: 1,
        max: 100,
      }

      const result = Schema.decodeUnknownSync(NumberFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'price',
        type: 'number',
      }

      expect(() => {
        Schema.decodeUnknownSync(NumberFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field with precision out of range', () => {
      const field = {
        id: 1,
        name: 'price',
        type: 'number',
        precision: 15,
      }

      expect(() => {
        Schema.decodeUnknownSync(NumberFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field with negative precision', () => {
      const field = {
        id: 1,
        name: 'price',
        type: 'number',
        precision: -1,
      }

      expect(() => {
        Schema.decodeUnknownSync(NumberFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof NumberFieldSchema> = {
        id: 1,
        name: 'price',
        type: 'number',
        precision: 2,
      }
      expect(field.id).toBe(1)
    })
  })
})
