/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import {
  CtaButtonVariantSchema,
  CtaButtonSizeSchema,
  CtaButtonIconPositionSchema,
  CtaButtonSchema,
} from './cta-button'

describe('CtaButtonVariantSchema', () => {
  test('should accept all 5 variant types', () => {
    // GIVEN: All valid button variants
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'link'] as const

    // WHEN: Schema validation is performed on each
    const results = variants.map((v) => Schema.decodeUnknownSync(CtaButtonVariantSchema)(v))

    // THEN: All variants should be accepted
    expect(results).toEqual([...variants])
  })

  test('should reject invalid variant', () => {
    // GIVEN: Invalid variant
    const variant = 'invalid'

    // WHEN: Schema validation is performed
    // THEN: Should be rejected
    expect(() => Schema.decodeUnknownSync(CtaButtonVariantSchema)(variant)).toThrow()
  })
})

describe('CtaButtonSizeSchema', () => {
  test('should accept all 4 size types', () => {
    // GIVEN: All valid button sizes
    const sizes = ['sm', 'md', 'lg', 'xl'] as const

    // WHEN: Schema validation is performed on each
    const results = sizes.map((s) => Schema.decodeUnknownSync(CtaButtonSizeSchema)(s))

    // THEN: All sizes should be accepted
    expect(results).toEqual([...sizes])
  })

  test('should reject invalid size', () => {
    // GIVEN: Invalid size
    const size = 'invalid'

    // WHEN: Schema validation is performed
    // THEN: Should be rejected
    expect(() => Schema.decodeUnknownSync(CtaButtonSizeSchema)(size)).toThrow()
  })
})

describe('CtaButtonIconPositionSchema', () => {
  test('should accept left position', () => {
    // GIVEN: Left icon position
    const position = 'left'

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(CtaButtonIconPositionSchema)(position)

    // THEN: Left position should be accepted
    expect(result).toBe('left')
  })

  test('should accept right position', () => {
    // GIVEN: Right icon position
    const position = 'right'

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(CtaButtonIconPositionSchema)(position)

    // THEN: Right position should be accepted
    expect(result).toBe('right')
  })
})

describe('CtaButtonSchema', () => {
  test('should accept CTA with text and href only', () => {
    // GIVEN: Minimal CTA configuration
    const cta = {
      text: 'Get Started',
      href: '/signup',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(CtaButtonSchema)(cta)

    // THEN: Minimal CTA should be accepted
    expect(result.text).toBe('Get Started')
    expect(result.href).toBe('/signup')
  })

  test('should accept CTA with primary variant', () => {
    // GIVEN: CTA with primary variant
    const cta = {
      text: 'Sign Up',
      href: '/signup',
      variant: 'primary' as const,
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(CtaButtonSchema)(cta)

    // THEN: Primary variant should be accepted
    expect(result.variant).toBe('primary')
  })

  test('should accept CTA with all variant types', () => {
    // GIVEN: CTAs with each variant
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'link'] as const
    const ctas = variants.map((variant) => ({
      text: 'Click Me',
      href: '/action',
      variant,
    }))

    // WHEN: Schema validation is performed on each
    const results = ctas.map((cta) => Schema.decodeUnknownSync(CtaButtonSchema)(cta))

    // THEN: All variants should be accepted
    expect(results.map((r) => r.variant)).toEqual([...variants])
  })

  test('should accept CTA with large size', () => {
    // GIVEN: Large CTA button
    const cta = {
      text: 'Get Started',
      href: '/signup',
      size: 'lg' as const,
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(CtaButtonSchema)(cta)

    // THEN: Large size should be accepted
    expect(result.size).toBe('lg')
  })

  test('should accept CTA with custom color', () => {
    // GIVEN: CTA with theme color
    const cta = {
      text: 'Get Started',
      href: '/signup',
      color: 'orange',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(CtaButtonSchema)(cta)

    // THEN: Custom color should be accepted
    expect(result.color).toBe('orange')
  })

  test('should accept CTA with icon', () => {
    // GIVEN: CTA with icon
    const cta = {
      text: 'Download',
      href: '/download',
      icon: 'download',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(CtaButtonSchema)(cta)

    // THEN: Icon should be accepted
    expect(result.icon).toBe('download')
  })

  test('should accept CTA with icon on right', () => {
    // GIVEN: CTA with icon positioned right
    const cta = {
      text: 'Learn More',
      href: '/docs',
      icon: 'arrow-right',
      iconPosition: 'right' as const,
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(CtaButtonSchema)(cta)

    // THEN: Right icon position should be accepted
    expect(result.iconPosition).toBe('right')
  })

  test('should accept CTA with all properties configured', () => {
    // GIVEN: Complete CTA configuration
    const cta = {
      text: 'Get Started',
      href: '/signup',
      variant: 'primary' as const,
      size: 'lg' as const,
      color: 'orange',
      icon: 'rocket',
      iconPosition: 'left' as const,
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(CtaButtonSchema)(cta)

    // THEN: All properties should be accepted
    expect(result.text).toBe('Get Started')
    expect(result.href).toBe('/signup')
    expect(result.variant).toBe('primary')
    expect(result.size).toBe('lg')
    expect(result.color).toBe('orange')
    expect(result.icon).toBe('rocket')
    expect(result.iconPosition).toBe('left')
  })

  test('should reject CTA without required text', () => {
    // GIVEN: CTA missing text property
    const cta = {
      href: '/signup',
    }

    // WHEN: Schema validation is performed
    // THEN: Should be rejected (text is required)
    expect(() => Schema.decodeUnknownSync(CtaButtonSchema)(cta)).toThrow()
  })

  test('should reject CTA without required href', () => {
    // GIVEN: CTA missing href property
    const cta = {
      text: 'Get Started',
    }

    // WHEN: Schema validation is performed
    // THEN: Should be rejected (href is required)
    expect(() => Schema.decodeUnknownSync(CtaButtonSchema)(cta)).toThrow()
  })
})
