/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, expect, test } from 'bun:test'
import { Schema } from 'effect'
import { PhoneNumberFieldSchema } from './phone-number-field'

describe('PhoneNumberFieldSchema', () => {
  test('should accept valid phone number field configuration', () => {
    const field = {
      id: 1,
      name: 'mobile_phone',
      type: 'phone-number' as const,
      required: true,
      unique: true,
      indexed: true,
    }

    const result = Schema.decodeSync(PhoneNumberFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should accept phone number field with default value', () => {
    const field = {
      id: 2,
      name: 'office_phone',
      type: 'phone-number' as const,
      required: false,
      default: '+1 (555) 000-0000',
    }

    const result = Schema.decodeSync(PhoneNumberFieldSchema)(field)
    expect(result.default).toBe('+1 (555) 000-0000')
  })

  test('should accept minimal phone number field configuration', () => {
    const field = {
      id: 1,
      name: 'phone',
      type: 'phone-number' as const,
    }

    const result = Schema.decodeSync(PhoneNumberFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should reject wrong type value', () => {
    const field = {
      id: 1,
      name: 'mobile_phone',
      type: 'email' as const,
    }

    expect(() => {
      // @ts-expect-error - Testing wrong type value
      Schema.decodeSync(PhoneNumberFieldSchema)(field)
    }).toThrow()
  })

  test('should accept international phone number format as default', () => {
    const field = {
      id: 1,
      name: 'phone',
      type: 'phone-number' as const,
      default: '+44 20 7123 4567',
    }

    const result = Schema.decodeSync(PhoneNumberFieldSchema)(field)
    expect(result.default).toBe('+44 20 7123 4567')
  })
})
