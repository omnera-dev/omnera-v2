/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, expect, test } from 'bun:test'
import { Schema } from 'effect'
import { SingleLineTextFieldSchema } from './single-line-text-field'

describe('SingleLineTextFieldSchema', () => {
  test('should accept valid single-line text field configuration', () => {
    const field = {
      id: 1,
      name: 'title',
      type: 'single-line-text' as const,
      required: true,
      unique: false,
      indexed: true,
      default: 'Untitled',
    }

    const result = Schema.decodeSync(SingleLineTextFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should accept minimal single-line text field configuration', () => {
    const field = {
      id: 1,
      name: 'first_name',
      type: 'single-line-text' as const,
    }

    const result = Schema.decodeSync(SingleLineTextFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should reject missing required property: id', () => {
    const field = {
      name: 'title',
      type: 'single-line-text' as const,
    }

    expect(() => {
      // @ts-expect-error - Testing missing required property: id
      Schema.decodeSync(SingleLineTextFieldSchema)(field)
    }).toThrow()
  })

  test('should reject missing required property: name', () => {
    const field = {
      id: 1,
      type: 'single-line-text' as const,
    }

    expect(() => {
      // @ts-expect-error - Testing missing required property: name
      Schema.decodeSync(SingleLineTextFieldSchema)(field)
    }).toThrow()
  })

  test('should reject missing required property: type', () => {
    const field = {
      id: 1,
      name: 'title',
    }

    expect(() => {
      // @ts-expect-error - Testing missing required property: type
      Schema.decodeSync(SingleLineTextFieldSchema)(field)
    }).toThrow()
  })

  test('should reject wrong type value', () => {
    const field = {
      id: 1,
      name: 'title',
      type: 'long-text' as const,
    }

    expect(() => {
      // @ts-expect-error - Testing wrong type value
      Schema.decodeSync(SingleLineTextFieldSchema)(field)
    }).toThrow()
  })

  test('should reject invalid id (not a positive integer)', () => {
    const field = {
      id: -1,
      name: 'title',
      type: 'single-line-text' as const,
    }

    expect(() => {
      Schema.decodeSync(SingleLineTextFieldSchema)(field)
    }).toThrow()
  })

  test('should reject invalid name (uppercase letters)', () => {
    const field = {
      id: 1,
      name: 'Title',
      type: 'single-line-text' as const,
    }

    expect(() => {
      Schema.decodeSync(SingleLineTextFieldSchema)(field)
    }).toThrow()
  })

  test('should accept default value as empty string', () => {
    const field = {
      id: 1,
      name: 'title',
      type: 'single-line-text' as const,
      default: '',
    }

    const result = Schema.decodeSync(SingleLineTextFieldSchema)(field)
    expect(result.default).toBe('')
  })

  test('should accept default value as string with content', () => {
    const field = {
      id: 1,
      name: 'title',
      type: 'single-line-text' as const,
      default: 'Default Title',
    }

    const result = Schema.decodeSync(SingleLineTextFieldSchema)(field)
    expect(result.default).toBe('Default Title')
  })
})
