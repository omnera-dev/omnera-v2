/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { MultipleAttachmentsFieldSchema } from './multiple-attachments-field'

describe('MultipleAttachmentsFieldSchema', () => {
  test('should accept valid multiple-attachments field', () => {
    const field = { id: 1, name: 'documents', type: 'multiple-attachments' as const, maxFiles: 5 }
    const result = Schema.decodeSync(MultipleAttachmentsFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
