/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { TextFieldSchema } from './text-field'

describe('TextFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid text field with single-line-text type', () => {
      const field = {
        id: 1,
        name: 'description',
        type: 'single-line-text' as const,
      }

      const result = Schema.decodeSync(TextFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept valid name patterns', () => {
      const validNames = ['email', 'user_status', 'created_at', 'field123', 'a']

      validNames.forEach((name) => {
        const field = {
          id: 1,
          name,
          type: 'long-text' as const,
        }
        const result = Schema.decodeSync(TextFieldSchema)(field)
        expect(result.name).toBe(name)
      })
    })

    test('should accept all valid text field types', () => {
      const validTypes = ['single-line-text', 'long-text', 'phone-number', 'email', 'url']

      validTypes.forEach((type) => {
        const field = {
          id: 1,
          name: 'test_field',
          type,
        }
        const result = Schema.decodeSync(TextFieldSchema)(field)
        expect(result.type).toBe(type)
      })
    })

    test('should accept text field with all optional properties', () => {
      const field = {
        id: 1,
        name: 'description',
        type: 'email' as const,
        required: true,
        unique: true,
        indexed: true,
        default: 'Default text',
      }

      const result = Schema.decodeSync(TextFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept text field with default value', () => {
      const field = {
        id: 1,
        name: 'description',
        type: 'phone-number' as const,
        default: 'Enter text here',
      }

      const result = Schema.decodeSync(TextFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'description',
        type: 'single-line-text' as const,
      }

      expect(() => {
        Schema.decodeSync(TextFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'description',
      }

      expect(() => {
        Schema.decodeSync(TextFieldSchema)(field)
      }).toThrow()
    })

    test('should reject invalid name patterns', () => {
      const invalidNames = [
        'Email', // uppercase
        '123field', // starts with number
        'field-name', // contains hyphen
        'Field Name', // contains space
        '', // empty
      ]

      invalidNames.forEach((name) => {
        const field = {
          id: 1,
          name,
          type: 'single-line-text' as const,
        }
        expect(() => {
          Schema.decodeSync(TextFieldSchema)(field)
        }).toThrow()
      })
    })

    test('should reject name exceeding 63 characters', () => {
      const field = {
        id: 1,
        name: 'a'.repeat(64),
        type: 'single-line-text' as const,
      }

      expect(() => {
        Schema.decodeSync(TextFieldSchema)(field)
      }).toThrow()
    })

    test('should reject invalid type values', () => {
      const invalidTypes = ['text', 'string', 'varchar', 'invalid']

      invalidTypes.forEach((type) => {
        const field = {
          id: 1,
          name: 'test_field',
          type,
        }
        expect(() => {
          Schema.decodeSync(TextFieldSchema)(field)
        }).toThrow()
      })
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof TextFieldSchema> = {
        id: 1,
        name: 'description',
        type: 'single-line-text' as const,
        required: true,
      }
      expect(field.id).toBe(1)
    })
  })
})
