/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { StatusFieldSchema } from './status-field'

describe('StatusFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid status field', () => {
      const field = {
        id: 1,
        name: 'status',
        type: 'status' as const,
        options: [{ value: 'todo', color: '#94A3B8' }],
      }

      const result = Schema.decodeSync(StatusFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'status',
        type: 'status' as const,
        options: [{ value: 'todo' }],
      }

      expect(() => {
        // @ts-expect-error - Testing missing required property: id
        Schema.decodeSync(StatusFieldSchema)(field)
      }).toThrow()
    })
  })
})
