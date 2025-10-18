/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { ArrayFieldSchema } from './array-field'

describe('ArrayFieldSchema', () => {
  test('should accept valid array field', () => {
    const field = { id: 1, name: 'tags', type: 'array' as const, itemType: 'string' }
    const result = Schema.decodeSync(ArrayFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
