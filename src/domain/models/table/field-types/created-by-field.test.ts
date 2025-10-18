/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { CreatedByFieldSchema } from './created-by-field'

describe('CreatedByFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid created-by field', () => {
      const field = {
        id: 1,
        name: 'created_by',
        type: 'created-by' as const,
      }

      const result = Schema.decodeSync(CreatedByFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept created-by field with indexed flag', () => {
      const field = {
        id: 1,
        name: 'created_by',
        type: 'created-by' as const,
        indexed: true,
      }

      const result = Schema.decodeSync(CreatedByFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept created-by field without indexed flag', () => {
      const field = {
        id: 1,
        name: 'created_by',
        type: 'created-by' as const,
        indexed: false,
      }

      const result = Schema.decodeSync(CreatedByFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'created_by',
        type: 'created-by' as const,
      }

      expect(() => {
        // @ts-expect-error - Testing missing required property: id
        Schema.decodeSync(CreatedByFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'created_by',
      }

      expect(() => {
        // @ts-expect-error - Testing missing required property: type
        Schema.decodeSync(CreatedByFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof CreatedByFieldSchema> = {
        id: 1,
        name: 'created_by',
        type: 'created-by' as const,
        indexed: true,
      }
      expect(field.id).toBe(1)
    })
  })
})
