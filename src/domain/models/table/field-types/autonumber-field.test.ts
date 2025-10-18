/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { AutonumberFieldSchema } from './autonumber-field'

describe('AutonumberFieldSchema', () => {
  test('should accept valid autonumber field', () => {
    const field = {
      id: 1,
      name: 'invoice_num',
      type: 'autonumber' as const,
      prefix: 'INV-',
      startFrom: 1000,
    }
    const result = Schema.decodeSync(AutonumberFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
