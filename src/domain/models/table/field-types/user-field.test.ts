/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { UserFieldSchema } from './user-field'

describe('UserFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid user field', () => {
      const field = {
        id: 1,
        name: 'assigned_to',
        type: 'user' as const,
      }

      const result = Schema.decodeSync(UserFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept user field with all optional properties', () => {
      const field = {
        id: 1,
        name: 'assigned_to',
        type: 'user' as const,
        required: true,
        indexed: true,
        allowMultiple: true,
      }

      const result = Schema.decodeSync(UserFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept user field allowing single user', () => {
      const field = {
        id: 1,
        name: 'owner',
        type: 'user' as const,
        allowMultiple: false,
      }

      const result = Schema.decodeSync(UserFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'assigned_to',
        type: 'user' as const,
      }

      expect(() => {
        // @ts-expect-error
        Schema.decodeSync(UserFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'assigned_to',
      }

      expect(() => {
        // @ts-expect-error
        Schema.decodeSync(UserFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof UserFieldSchema> = {
        id: 1,
        name: 'assigned_to',
        type: 'user' as const,
        allowMultiple: true,
      }
      expect(field.id).toBe(1)
    })
  })
})
