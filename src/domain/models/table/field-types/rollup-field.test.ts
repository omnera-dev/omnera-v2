/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { RollupFieldSchema } from './rollup-field'

describe('RollupFieldSchema', () => {
  test('should accept valid rollup field', () => {
    const field = {
      id: 1,
      name: 'total',
      type: 'rollup' as const,
      relationshipField: 'orders',
      relatedField: 'amount',
      aggregation: 'SUM',
    }
    const result = Schema.decodeSync(RollupFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
