/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, expect, test } from 'bun:test'
import { Schema } from 'effect'
import { LongTextFieldSchema } from './long-text-field'

describe('LongTextFieldSchema', () => {
  test('should accept valid long-text field configuration', () => {
    const field = {
      id: 1,
      name: 'description',
      type: 'long-text' as const,
      required: true,
      indexed: false,
      default: 'Enter description here...',
    }

    const result = Schema.decodeSync(LongTextFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should accept minimal long-text field configuration', () => {
    const field = {
      id: 1,
      name: 'notes',
      type: 'long-text' as const,
    }

    const result = Schema.decodeSync(LongTextFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should reject missing required property: type', () => {
    const field = {
      id: 1,
      name: 'description',
    }

    expect(() => {
      Schema.decodeSync(LongTextFieldSchema)(field)
    }).toThrow()
  })

  test('should reject wrong type value', () => {
    const field = {
      id: 1,
      name: 'description',
      type: 'single-line-text' as const,
    }

    expect(() => {
      Schema.decodeSync(LongTextFieldSchema)(field)
    }).toThrow()
  })

  test('should accept multi-line default value', () => {
    const field = {
      id: 1,
      name: 'description',
      type: 'long-text' as const,
      default: 'Line 1\nLine 2\nLine 3',
    }

    const result = Schema.decodeSync(LongTextFieldSchema)(field)
    expect(result.default).toBe('Line 1\nLine 2\nLine 3')
  })
})
