/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, expect, test } from 'bun:test'
import { Schema } from 'effect'
import { DecimalFieldSchema } from './decimal-field'

describe('DecimalFieldSchema', () => {
  test('should accept valid decimal field configuration', () => {
    const field = {
      id: 1,
      name: 'weight',
      type: 'decimal' as const,
      required: true,
      precision: 2,
      min: 0.01,
      max: 999.99,
      default: 1.0,
    }

    const result = Schema.decodeSync(DecimalFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should accept decimal field without precision (optional)', () => {
    const field = {
      id: 1,
      name: 'weight',
      type: 'decimal' as const,
    }

    const result = Schema.decodeSync(DecimalFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should accept tax rate with 4 decimal precision', () => {
    const field = {
      id: 2,
      name: 'tax_rate',
      type: 'decimal' as const,
      required: true,
      precision: 4,
      min: 0,
      max: 1,
      default: 0.0825,
    }

    const result = Schema.decodeSync(DecimalFieldSchema)(field)
    expect(result.precision).toBe(4)
    expect(result.default).toBe(0.0825)
  })

  test('should accept minimal decimal field configuration', () => {
    const field = {
      id: 1,
      name: 'amount',
      type: 'decimal' as const,
    }

    const result = Schema.decodeSync(DecimalFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should reject wrong type value', () => {
    const field = {
      id: 1,
      name: 'weight',
      type: 'integer' as const,
    }

    expect(() => {
      Schema.decodeSync(DecimalFieldSchema)(field)
    }).toThrow()
  })

  test('should reject precision less than 0', () => {
    const field = {
      id: 1,
      name: 'weight',
      type: 'decimal' as const,
      precision: -1,
    }

    expect(() => {
      Schema.decodeSync(DecimalFieldSchema)(field)
    }).toThrow()
  })

  test('should reject precision greater than 10', () => {
    const field = {
      id: 1,
      name: 'weight',
      type: 'decimal' as const,
      precision: 11,
    }

    expect(() => {
      Schema.decodeSync(DecimalFieldSchema)(field)
    }).toThrow()
  })

  test('should accept precision of 0 for whole numbers', () => {
    const field = {
      id: 1,
      name: 'rounded_value',
      type: 'decimal' as const,
      precision: 0,
    }

    const result = Schema.decodeSync(DecimalFieldSchema)(field)
    expect(result.precision).toBe(0)
  })
})
