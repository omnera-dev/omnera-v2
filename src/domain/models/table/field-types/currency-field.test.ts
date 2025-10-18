/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, expect, test } from 'bun:test'
import { Schema } from 'effect'
import { CurrencyFieldSchema } from './currency-field'

describe('CurrencyFieldSchema', () => {
  test('should accept valid currency field configuration', () => {
    const field = {
      id: 1,
      name: 'price',
      type: 'currency' as const,
      required: true,
      currency: 'USD',
      precision: 2,
      min: 0,
      default: 0.0,
    }

    const result = Schema.decodeSync(CurrencyFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should accept currency field without precision (optional)', () => {
    const field = {
      id: 1,
      name: 'price',
      type: 'currency' as const,
      currency: 'USD',
    }

    const result = Schema.decodeSync(CurrencyFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should accept EUR currency', () => {
    const field = {
      id: 2,
      name: 'total_cost',
      type: 'currency' as const,
      required: true,
      currency: 'EUR',
      precision: 2,
    }

    const result = Schema.decodeSync(CurrencyFieldSchema)(field)
    expect(result.currency).toBe('EUR')
  })

  test('should accept minimal currency field configuration', () => {
    const field = {
      id: 1,
      name: 'amount',
      type: 'currency' as const,
      currency: 'GBP',
    }

    const result = Schema.decodeSync(CurrencyFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should reject missing currency code', () => {
    const field = {
      id: 1,
      name: 'price',
      type: 'currency' as const,
    }

    expect(() => {
      // @ts-expect-error - Testing missing required property: currency
      Schema.decodeSync(CurrencyFieldSchema)(field)
    }).toThrow()
  })

  test('should reject invalid currency code (not 3 letters)', () => {
    const field = {
      id: 1,
      name: 'price',
      type: 'currency' as const,
      currency: 'US',
    }

    expect(() => {
      Schema.decodeSync(CurrencyFieldSchema)(field)
    }).toThrow()
  })

  test('should reject lowercase currency code', () => {
    const field = {
      id: 1,
      name: 'price',
      type: 'currency' as const,
      currency: 'usd',
    }

    expect(() => {
      Schema.decodeSync(CurrencyFieldSchema)(field)
    }).toThrow()
  })

  test('should reject wrong type value', () => {
    const field = {
      id: 1,
      name: 'price',
      type: 'decimal' as const,
      currency: 'USD',
    }

    expect(() => {
      // @ts-expect-error - Testing wrong type value
      Schema.decodeSync(CurrencyFieldSchema)(field)
    }).toThrow()
  })

  test('should accept various ISO 4217 currency codes', () => {
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']

    currencies.forEach((currency) => {
      const field = {
        id: 1,
        name: 'price',
        type: 'currency' as const,
        currency,
      }

      const result = Schema.decodeSync(CurrencyFieldSchema)(field)
      expect(result.currency).toBe(currency)
    })
  })

  test('should reject precision greater than 10', () => {
    const field = {
      id: 1,
      name: 'price',
      type: 'currency' as const,
      currency: 'USD',
      precision: 11,
    }

    expect(() => {
      Schema.decodeSync(CurrencyFieldSchema)(field)
    }).toThrow()
  })
})
