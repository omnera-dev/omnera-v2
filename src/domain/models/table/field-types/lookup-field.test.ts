/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { LookupFieldSchema } from './lookup-field'

describe('LookupFieldSchema', () => {
  test('should accept valid lookup field', () => {
    const field = {
      id: 1,
      name: 'email',
      type: 'lookup' as const,
      relationshipField: 'customer',
      relatedField: 'email',
    }
    const result = Schema.decodeSync(LookupFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
