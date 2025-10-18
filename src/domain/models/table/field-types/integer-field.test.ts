/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, expect, test } from 'bun:test'
import { Schema } from 'effect'
import { IntegerFieldSchema } from './integer-field'

describe('IntegerFieldSchema', () => {
  test('should accept valid integer field configuration', () => {
    const field = {
      id: 1,
      name: 'quantity',
      type: 'integer' as const,
      required: true,
      min: 0,
      max: 1000,
      default: 1,
    }

    const result = Schema.decodeSync(IntegerFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should accept integer field with age constraints', () => {
    const field = {
      id: 2,
      name: 'age',
      type: 'integer' as const,
      required: false,
      min: 0,
      max: 150,
    }

    const result = Schema.decodeSync(IntegerFieldSchema)(field)
    expect(result.min).toBe(0)
    expect(result.max).toBe(150)
  })

  test('should accept minimal integer field configuration', () => {
    const field = {
      id: 1,
      name: 'count',
      type: 'integer' as const,
    }

    const result = Schema.decodeSync(IntegerFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should reject wrong type value', () => {
    const field = {
      id: 1,
      name: 'quantity',
      type: 'decimal' as const,
    }

    expect(() => {
      // @ts-expect-error - Testing wrong type value
      Schema.decodeSync(IntegerFieldSchema)(field)
    }).toThrow()
  })

  test('should reject non-integer default value', () => {
    const field = {
      id: 1,
      name: 'quantity',
      type: 'integer' as const,
      default: 1.5,
    }

    expect(() => {
      Schema.decodeSync(IntegerFieldSchema)(field)
    }).toThrow()
  })

  test('should accept negative min value', () => {
    const field = {
      id: 1,
      name: 'temperature',
      type: 'integer' as const,
      min: -100,
      max: 100,
    }

    const result = Schema.decodeSync(IntegerFieldSchema)(field)
    expect(result.min).toBe(-100)
  })
})
