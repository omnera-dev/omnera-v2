/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { JsonFieldSchema } from './json-field'

describe('JsonFieldSchema', () => {
  test('should accept valid json field', () => {
    // Given: A valid input
    const field = { id: 1, name: 'metadata', type: 'json' as const }

    // When: The value is validated against the schema
    const result = Schema.decodeSync(JsonFieldSchema)(field)

    // Then: Validation succeeds and the value is accepted
    expect(result).toEqual(field)
  })
})
