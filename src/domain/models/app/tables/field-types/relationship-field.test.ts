/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { RelationshipFieldSchema } from './relationship-field'

describe('RelationshipFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid relationship field', () => {
      // Given: A valid input
      const field = {
        id: 1,
        name: 'author',
        type: 'relationship' as const,
        relatedTable: 'users',
        relationType: 'many-to-one',

        // When: The value is validated against the schema
        // Then: Validation succeeds and the value is accepted
      }

      const result = Schema.decodeSync(RelationshipFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without relatedTable', () => {
      // Given: An invalid input
      const field = {
        id: 1,
        name: 'author',
        type: 'relationship' as const,
        relationType: 'many-to-one',

        // When: The value is validated against the schema
        // Then: Validation should throw an error
      }

      expect(() => {
        // @ts-expect-error - Testing missing required property: relatedTable
        Schema.decodeSync(RelationshipFieldSchema)(field)
      }).toThrow()
    })
  })
})
