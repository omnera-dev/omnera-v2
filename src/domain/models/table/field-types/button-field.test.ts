/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { ButtonFieldSchema } from './button-field'

describe('ButtonFieldSchema', () => {
  test('should accept valid button field', () => {
    const field = {
      id: 1,
      name: 'approve',
      type: 'button' as const,
      label: 'Approve',
      action: 'automation',
    }
    const result = Schema.decodeSync(ButtonFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
