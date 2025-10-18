/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, expect, test } from 'bun:test'
import { Schema } from 'effect'
import { UrlFieldSchema } from './url-field'

describe('UrlFieldSchema', () => {
  test('should accept valid URL field configuration', () => {
    const field = {
      id: 1,
      name: 'website',
      type: 'url' as const,
      required: true,
      unique: false,
      indexed: true,
    }

    const result = Schema.decodeSync(UrlFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should accept URL field with default value', () => {
    const field = {
      id: 2,
      name: 'profile_url',
      type: 'url' as const,
      required: false,
      default: 'https://example.com/profile',
    }

    const result = Schema.decodeSync(UrlFieldSchema)(field)
    expect(result.default).toBe('https://example.com/profile')
  })

  test('should accept minimal URL field configuration', () => {
    const field = {
      id: 1,
      name: 'website',
      type: 'url' as const,
    }

    const result = Schema.decodeSync(UrlFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should reject wrong type value', () => {
    const field = {
      id: 1,
      name: 'website',
      type: 'email' as const,
    }

    expect(() => {
      // @ts-expect-error - Testing wrong type value
      Schema.decodeSync(UrlFieldSchema)(field)
    }).toThrow()
  })

  test('should accept https URL as default', () => {
    const field = {
      id: 1,
      name: 'api_endpoint',
      type: 'url' as const,
      default: 'https://api.example.com/v1',
    }

    const result = Schema.decodeSync(UrlFieldSchema)(field)
    expect(result.default).toBe('https://api.example.com/v1')
  })
})
