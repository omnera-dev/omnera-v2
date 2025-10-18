/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { NameSchema } from './name'

describe('NameSchema', () => {
  describe('valid values', () => {
    test('should accept simple lowercase names', () => {
      const validNames = ['user', 'product', 'order', 'customer']

      validNames.forEach((name) => {
        const result = Schema.decodeUnknownSync(NameSchema)(name)
        expect(result).toBe(name)
      })
    })

    test('should accept names with underscores', () => {
      const validNames = ['user_profile', 'order_item', 'shipping_address', 'created_at']

      validNames.forEach((name) => {
        const result = Schema.decodeUnknownSync(NameSchema)(name)
        expect(result).toBe(name)
      })
    })

    test('should accept names with numbers', () => {
      const validNames = ['user123', 'product_v2', 'order2023', 'item_1']

      validNames.forEach((name) => {
        const result = Schema.decodeUnknownSync(NameSchema)(name)
        expect(result).toBe(name)
      })
    })

    test('should accept single character name', () => {
      const result = Schema.decodeUnknownSync(NameSchema)('a')
      expect(result).toBe('a')
    })

    test('should accept maximum length name (63 characters)', () => {
      const maxLengthName = 'a' + '0'.repeat(62) // 63 characters total
      const result = Schema.decodeUnknownSync(NameSchema)(maxLengthName)
      expect(result).toBe(maxLengthName)
    })
  })

  describe('invalid values', () => {
    test('should reject empty string', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)('')
      }).toThrow('This field is required')
    })

    test('should reject names starting with uppercase letter', () => {
      const invalidNames = ['User', 'Product', 'OrderItem']

      invalidNames.forEach((name) => {
        expect(() => {
          Schema.decodeUnknownSync(NameSchema)(name)
        }).toThrow()
      })
    })

    test('should reject names starting with number', () => {
      const invalidNames = ['1user', '2product', '123order']

      invalidNames.forEach((name) => {
        expect(() => {
          Schema.decodeUnknownSync(NameSchema)(name)
        }).toThrow()
      })
    })

    test('should reject names starting with underscore', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)('_user')
      }).toThrow()
    })

    test('should reject names with hyphens', () => {
      const invalidNames = ['user-profile', 'order-item', 'shipping-address']

      invalidNames.forEach((name) => {
        expect(() => {
          Schema.decodeUnknownSync(NameSchema)(name)
        }).toThrow()
      })
    })

    test('should reject names with spaces', () => {
      const invalidNames = ['user profile', 'order item', 'user name']

      invalidNames.forEach((name) => {
        expect(() => {
          Schema.decodeUnknownSync(NameSchema)(name)
        }).toThrow()
      })
    })

    test('should reject names with special characters', () => {
      const invalidNames = ['user@profile', 'order#item', 'user!name', 'product$price']

      invalidNames.forEach((name) => {
        expect(() => {
          Schema.decodeUnknownSync(NameSchema)(name)
        }).toThrow()
      })
    })

    test('should reject names exceeding 63 characters', () => {
      const tooLongName = 'a' + '0'.repeat(63) // 64 characters total

      expect(() => {
        Schema.decodeUnknownSync(NameSchema)(tooLongName)
      }).toThrow('Maximum length is 63 characters')
    })

    test('should reject non-string values', () => {
      const invalidValues = [123, true, null, undefined, {}, []]

      invalidValues.forEach((value) => {
        expect(() => {
          Schema.decodeUnknownSync(NameSchema)(value)
        }).toThrow()
      })
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const name: Schema.Schema.Type<typeof NameSchema> = 'user'
      expect(name).toBe('user')
    })
  })
})
