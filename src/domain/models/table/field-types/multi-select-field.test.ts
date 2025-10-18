/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { MultiSelectFieldSchema } from './multi-select-field'

describe('MultiSelectFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid multi-select field', () => {
      const field = {
        id: 1,
        name: 'tags',
        type: 'multi-select' as const,
        options: ['Urgent', 'Important'],
      }

      const result = Schema.decodeSync(MultiSelectFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'tags',
        type: 'multi-select' as const,
        options: ['A'],
      }

      expect(() => {
        // @ts-expect-error - Testing missing required property: id
        Schema.decodeSync(MultiSelectFieldSchema)(field)
      }).toThrow()
    })
  })
})
