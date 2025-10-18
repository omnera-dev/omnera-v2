/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { SingleSelectFieldSchema } from './single-select-field'

describe('SingleSelectFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid single-select field', () => {
      const field = {
        id: 1,
        name: 'category',
        type: 'single-select' as const,
        options: ['Electronics', 'Clothing', 'Food'],
      }

      const result = Schema.decodeSync(SingleSelectFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept single-select field with default', () => {
      const field = {
        id: 1,
        name: 'category',
        type: 'single-select' as const,
        required: true,
        indexed: true,
        options: ['Electronics', 'Clothing', 'Food'],
        default: 'Electronics',
      }

      const result = Schema.decodeSync(SingleSelectFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'category',
        type: 'single-select' as const,
        options: ['A', 'B'],
      }

      expect(() => {
        // @ts-expect-error - Testing missing required property: id
        Schema.decodeSync(SingleSelectFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof SingleSelectFieldSchema> = {
        id: 1,
        name: 'category',
        type: 'single-select' as const,
        options: ['A', 'B'],
      }
      expect(field.id).toBe(1)
    })
  })
})
