/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, expect, test } from 'bun:test'
import { Schema } from 'effect'
import { FieldNameSchema } from './field-name'

describe('FieldNameSchema', () => {
  describe('valid field names', () => {
    test('accepts single lowercase letter', () => {
      const result = Schema.decodeUnknownSync(FieldNameSchema)('a')
      expect(result).toBe('a')
    })

    test('accepts lowercase letters', () => {
      const result = Schema.decodeUnknownSync(FieldNameSchema)('email')
      expect(result).toBe('email')
    })

    test('accepts letters with numbers', () => {
      const result = Schema.decodeUnknownSync(FieldNameSchema)('field123')
      expect(result).toBe('field123')
    })

    test('accepts letters with underscores', () => {
      const result = Schema.decodeUnknownSync(FieldNameSchema)('user_status')
      expect(result).toBe('user_status')
    })

    test('accepts snake_case names', () => {
      const result = Schema.decodeUnknownSync(FieldNameSchema)('order_item')
      expect(result).toBe('order_item')
    })

    test('accepts names with multiple underscores', () => {
      const result = Schema.decodeUnknownSync(FieldNameSchema)('customer_email_address')
      expect(result).toBe('customer_email_address')
    })

    test('accepts timestamp names', () => {
      const result = Schema.decodeUnknownSync(FieldNameSchema)('created_at')
      expect(result).toBe('created_at')
    })

    test('accepts names ending with numbers', () => {
      const result = Schema.decodeUnknownSync(FieldNameSchema)('field_1')
      expect(result).toBe('field_1')
    })

    test('accepts maximum length (63 characters)', () => {
      const name = 'a'.repeat(63)
      const result = Schema.decodeUnknownSync(FieldNameSchema)(name)
      expect(result).toBe(name)
    })
  })

  describe('invalid types', () => {
    test('rejects number', () => {
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)(123)).toThrow()
    })

    test('rejects boolean', () => {
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)(true)).toThrow()
    })

    test('rejects null', () => {
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)(null)).toThrow()
    })

    test('rejects undefined', () => {
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)(undefined)).toThrow()
    })

    test('rejects array', () => {
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)([])).toThrow()
    })

    test('rejects object', () => {
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)({})).toThrow()
    })
  })

  describe('invalid patterns', () => {
    test('rejects name starting with uppercase', () => {
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)('Email')).toThrow()
    })

    test('rejects name with uppercase letters', () => {
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)('userStatus')).toThrow()
    })

    test('rejects name starting with number', () => {
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)('1field')).toThrow()
    })

    test('rejects name starting with underscore', () => {
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)('_private')).toThrow()
    })

    test('rejects name with hyphen', () => {
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)('user-status')).toThrow()
    })

    test('rejects name with space', () => {
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)('user status')).toThrow()
    })

    test('rejects name with special characters', () => {
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)('user@email')).toThrow()
    })

    test('rejects name with dots', () => {
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)('user.email')).toThrow()
    })
  })

  describe('length constraints', () => {
    test('rejects empty string', () => {
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)('')).toThrow()
    })

    test('rejects string longer than 63 characters', () => {
      const name = 'a'.repeat(64)
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)(name)).toThrow()
    })

    test('rejects very long string', () => {
      const name = 'field_name_that_is_way_too_long_and_exceeds_postgresql_limit_'.repeat(2)
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)(name)).toThrow()
    })
  })

  describe('edge cases', () => {
    test('accepts single character at minimum length', () => {
      const result = Schema.decodeUnknownSync(FieldNameSchema)('x')
      expect(result).toBe('x')
    })

    test('accepts name at boundary (63 chars)', () => {
      const name = 'a' + '_'.repeat(61) + 'b'
      const result = Schema.decodeUnknownSync(FieldNameSchema)(name)
      expect(result).toBe(name)
    })

    test('rejects name just over boundary (64 chars)', () => {
      const name = 'a'.repeat(64)
      expect(() => Schema.decodeUnknownSync(FieldNameSchema)(name)).toThrow()
    })
  })
})
