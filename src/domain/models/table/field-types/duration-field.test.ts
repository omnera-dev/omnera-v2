/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { DurationFieldSchema } from './duration-field'

describe('DurationFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid duration field', () => {
      const field = {
        id: 1,
        name: 'work_hours',
        type: 'duration' as const,
      }

      const result = Schema.decodeSync(DurationFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept duration field with all optional properties', () => {
      const field = {
        id: 1,
        name: 'work_hours',
        type: 'duration' as const,
        required: true,
        format: 'h:mm',
      }

      const result = Schema.decodeSync(DurationFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept duration field with custom format', () => {
      const field = {
        id: 1,
        name: 'elapsed_time',
        type: 'duration' as const,
        format: 'h:mm:ss',
      }

      const result = Schema.decodeSync(DurationFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'work_hours',
        type: 'duration' as const,
      }

      expect(() => {
        // @ts-expect-error - Testing missing required property: id
        Schema.decodeSync(DurationFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'work_hours',
      }

      expect(() => {
        // @ts-expect-error - Testing missing required property: type
        Schema.decodeSync(DurationFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof DurationFieldSchema> = {
        id: 1,
        name: 'work_hours',
        type: 'duration' as const,
        format: 'h:mm',
      }
      expect(field.id).toBe(1)
    })
  })
})
