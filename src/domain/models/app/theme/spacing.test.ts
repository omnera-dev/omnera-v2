/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { SpacingConfigSchema } from './spacing'

describe('SpacingConfigSchema', () => {
  test('APP-THEME-SPACING-001: should accept Tailwind utility classes', () => {
    // GIVEN: Spacing with Tailwind syntax
    const spacing = {
      section: 'py-16',
      container: 'px-4',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SpacingConfigSchema)(spacing)

    // THEN: Tailwind classes should be accepted
    expect(result.section).toBe('py-16')
    expect(result.container).toBe('px-4')
  })

  test('APP-THEME-SPACING-002: should accept responsive variants', () => {
    // GIVEN: Spacing with breakpoint-specific values
    const spacing = {
      section: 'py-16 sm:py-20',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SpacingConfigSchema)(spacing)

    // THEN: Responsive spacing should be accepted
    expect(result.section).toBe('py-16 sm:py-20')
  })

  test('APP-THEME-SPACING-003: should accept container constraints', () => {
    // GIVEN: Spacing with max-width and auto margins
    const spacing = {
      container: 'max-w-7xl mx-auto px-4',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SpacingConfigSchema)(spacing)

    // THEN: Container constraints should be accepted
    expect(result.container).toBe('max-w-7xl mx-auto px-4')
  })

  test('APP-THEME-SPACING-004: should accept spacing variants', () => {
    // GIVEN: Spacing with small, medium, and large variants
    const spacing = {
      gapSmall: 'gap-4',
      gap: 'gap-6',
      gapLarge: 'gap-8',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SpacingConfigSchema)(spacing)

    // THEN: All variants should be accepted
    expect(result.gapSmall).toBe('gap-4')
    expect(result.gap).toBe('gap-6')
    expect(result.gapLarge).toBe('gap-8')
  })

  test('APP-THEME-SPACING-009: should accept CSS values', () => {
    // GIVEN: Spacing with raw CSS instead of Tailwind
    const spacing = {
      section: '4rem',
      gap: '1rem',
      padding: '16px',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SpacingConfigSchema)(spacing)

    // THEN: CSS values should be accepted
    expect(result.section).toBe('4rem')
    expect(result.gap).toBe('1rem')
    expect(result.padding).toBe('16px')
  })

  test('should accept alphanumeric keys', () => {
    // GIVEN: Spacing keys with camelCase
    const spacing = {
      section: 'py-16',
      containerSmall: 'max-w-4xl',
      gapLarge: 'gap-8',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SpacingConfigSchema)(spacing)

    // THEN: All keys should be accepted
    expect(Object.keys(result)).toHaveLength(3)
  })

  test('should reject keys starting with numbers', () => {
    // GIVEN: Invalid key starting with number
    const spacing = {
      '2xl': 'py-20',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SpacingConfigSchema)(spacing)

    // THEN: Invalid key should be filtered out
    expect(result['2xl']).toBeUndefined()
  })
})
