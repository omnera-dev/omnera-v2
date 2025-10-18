/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { JsonFieldSchema } from './json-field'

describe('JsonFieldSchema', () => {
  test('should accept valid json field', () => {
    const field = { id: 1, name: 'metadata', type: 'json' as const }
    const result = Schema.decodeSync(JsonFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
