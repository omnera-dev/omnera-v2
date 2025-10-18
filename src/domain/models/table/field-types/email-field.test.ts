/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, expect, test } from 'bun:test'
import { Schema } from 'effect'
import { EmailFieldSchema } from './email-field'

describe('EmailFieldSchema', () => {
  test('should accept valid email field configuration', () => {
    const field = {
      id: 1,
      name: 'email',
      type: 'email' as const,
      required: true,
      unique: true,
      indexed: true,
    }

    const result = Schema.decodeSync(EmailFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should accept email field with default value', () => {
    const field = {
      id: 2,
      name: 'contact_email',
      type: 'email' as const,
      required: false,
      default: 'contact@example.com',
    }

    const result = Schema.decodeSync(EmailFieldSchema)(field)
    expect(result.default).toBe('contact@example.com')
  })

  test('should accept minimal email field configuration', () => {
    const field = {
      id: 1,
      name: 'email',
      type: 'email' as const,
    }

    const result = Schema.decodeSync(EmailFieldSchema)(field)
    expect(result).toEqual(field)
  })

  test('should reject wrong type value', () => {
    const field = {
      id: 1,
      name: 'email',
      type: 'url' as const,
    }

    expect(() => {
      // @ts-expect-error - Testing wrong type value
      Schema.decodeSync(EmailFieldSchema)(field)
    }).toThrow()
  })

  test('should accept email with unique constraint for authentication', () => {
    const field = {
      id: 1,
      name: 'user_email',
      type: 'email' as const,
      required: true,
      unique: true,
      indexed: true,
    }

    const result = Schema.decodeSync(EmailFieldSchema)(field)
    expect(result.unique).toBe(true)
    expect(result.indexed).toBe(true)
  })
})
