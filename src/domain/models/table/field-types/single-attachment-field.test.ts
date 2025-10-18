/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { SingleAttachmentFieldSchema } from './single-attachment-field'

describe('SingleAttachmentFieldSchema', () => {
  test('should accept valid single-attachment field', () => {
    const field = { id: 1, name: 'profile_pic', type: 'single-attachment' as const }
    const result = Schema.decodeSync(SingleAttachmentFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
