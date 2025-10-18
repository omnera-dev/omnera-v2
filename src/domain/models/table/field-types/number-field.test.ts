/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { NumberFieldSchema } from './number-field'

describe('NumberFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid number field with integer type', () => {
      const field = {
        id: 1,
        name: 'price',
        type: 'integer' as const,
      }

      const result = Schema.decodeSync(NumberFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept valid name patterns', () => {
      const validNames = ['price', 'total_amount', 'quantity', 'field123', 'a']

      validNames.forEach((name) => {
        const field = {
          id: 1,
          name,
          type: 'decimal' as const,
        }
        const result = Schema.decodeSync(NumberFieldSchema)(field)
        expect(result.name).toBe(name)
      })
    })

    test('should accept all valid number field types', () => {
      const validTypes = ['integer', 'decimal', 'currency', 'percentage']

      validTypes.forEach((type) => {
        const field = {
          id: 1,
          name: 'test_field',
          type,
        }
        const result = Schema.decodeSync(NumberFieldSchema)(field)
        expect(result.type).toBe(type)
      })
    })

    test('should accept number field with all optional properties', () => {
      const field = {
        id: 1,
        name: 'price',
        type: 'currency' as const,
        required: true,
        unique: false,
        indexed: true,
        min: 0,
        max: 1000,
        precision: 2,
        currency: 'USD',
        default: 10.5,
      }

      const result = Schema.decodeSync(NumberFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept number field with currency', () => {
      const field = {
        id: 1,
        name: 'price',
        type: 'currency' as const,
        currency: 'EUR',
        precision: 2,
      }

      const result = Schema.decodeSync(NumberFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept number field with min/max constraints', () => {
      const field = {
        id: 1,
        name: 'quantity',
        type: 'percentage' as const,
        min: 1,
        max: 100,
      }

      const result = Schema.decodeSync(NumberFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'price',
        type: 'integer' as const,
      }

      expect(() => {
        Schema.decodeSync(NumberFieldSchema)(field)
      }).toThrow()
    })

    test('should reject invalid name patterns', () => {
      const invalidNames = [
        'Price', // uppercase
        '123field', // starts with number
        'field-name', // contains hyphen
        'Field Name', // contains space
        '', // empty
      ]

      invalidNames.forEach((name) => {
        const field = {
          id: 1,
          name,
          type: 'integer' as const,
        }
        expect(() => {
          Schema.decodeSync(NumberFieldSchema)(field)
        }).toThrow()
      })
    })

    test('should reject name exceeding 63 characters', () => {
      const field = {
        id: 1,
        name: 'a'.repeat(64),
        type: 'integer' as const,
      }

      expect(() => {
        Schema.decodeSync(NumberFieldSchema)(field)
      }).toThrow()
    })

    test('should reject invalid type values', () => {
      const invalidTypes = ['number', 'float', 'int', 'invalid']

      invalidTypes.forEach((type) => {
        const field = {
          id: 1,
          name: 'test_field',
          type,
        }
        expect(() => {
          Schema.decodeSync(NumberFieldSchema)(field)
        }).toThrow()
      })
    })

    test('should reject field with precision out of range', () => {
      const field = {
        id: 1,
        name: 'price',
        type: 'decimal' as const,
        precision: 15,
      }

      expect(() => {
        Schema.decodeSync(NumberFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field with negative precision', () => {
      const field = {
        id: 1,
        name: 'price',
        type: 'decimal' as const,
        precision: -1,
      }

      expect(() => {
        Schema.decodeSync(NumberFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof NumberFieldSchema> = {
        id: 1,
        name: 'price',
        type: 'decimal' as const,
        precision: 2,
      }
      expect(field.id).toBe(1)
    })
  })
})
