/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { BannerLinkSchema, BannerSchema } from './banner'
import { HexColorSchema } from '@/domain/models/app/common/definitions'

describe('HexColorSchema', () => {
  test('should accept valid hex colors', () => {
    // GIVEN: Valid hex colors
    const colors = ['#FF5733', '#ffffff', '#1A2B3C', '#000000']

    // WHEN: Schema validation is performed on each
    const results = colors.map((c) => Schema.decodeUnknownSync(HexColorSchema)(c))

    // THEN: All hex colors should be accepted
    expect(results).toEqual(colors)
  })

  test('should reject hex without hash', () => {
    // GIVEN: Hex without # prefix
    const color = 'FF5733'

    // WHEN: Schema validation is performed
    // THEN: Should be rejected
    expect(() => Schema.decodeUnknownSync(HexColorSchema)(color)).toThrow()
  })

  test('should reject short hex', () => {
    // GIVEN: 3-digit hex code
    const color = '#FFF'

    // WHEN: Schema validation is performed
    // THEN: Should be rejected
    expect(() => Schema.decodeUnknownSync(HexColorSchema)(color)).toThrow()
  })

  test('should reject invalid hex characters', () => {
    // GIVEN: Invalid hex code
    const color = '#GGGGGG'

    // WHEN: Schema validation is performed
    // THEN: Should be rejected
    expect(() => Schema.decodeUnknownSync(HexColorSchema)(color)).toThrow()
  })
})

describe('BannerLinkSchema', () => {
  test('should accept link with href and label', () => {
    // GIVEN: Banner link
    const link = {
      href: '/features',
      label: 'Learn more',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BannerLinkSchema)(link)

    // THEN: Link should be accepted
    expect(result.href).toBe('/features')
    expect(result.label).toBe('Learn more')
  })
})

describe('BannerSchema', () => {
  test('should accept banner with enabled only', () => {
    // GIVEN: Minimal banner
    const banner = {
      enabled: true,
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BannerSchema)(banner)

    // THEN: Enabled property should be accepted
    expect(result.enabled).toBe(true)
  })

  test('should accept banner with text', () => {
    // GIVEN: Banner with text
    const banner = {
      enabled: true,
      text: '🎉 New feature available!',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BannerSchema)(banner)

    // THEN: Text should be accepted
    expect(result.text).toBe('🎉 New feature available!')
  })

  test('should accept banner with link', () => {
    // GIVEN: Banner with CTA link
    const banner = {
      enabled: true,
      text: 'Check out our new features',
      link: {
        href: '/features',
        label: 'Learn more',
      },
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BannerSchema)(banner)

    // THEN: Link should be accepted
    expect(result.link?.href).toBe('/features')
    expect(result.link?.label).toBe('Learn more')
  })

  test('should accept banner with gradient', () => {
    // GIVEN: Banner with gradient background
    const banner = {
      enabled: true,
      text: 'Announcement',
      gradient: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BannerSchema)(banner)

    // THEN: Gradient should be accepted
    expect(result.gradient).toBe('linear-gradient(90deg, #667eea 0%, #764ba2 100%)')
  })

  test('should accept banner with backgroundColor', () => {
    // GIVEN: Banner with solid color
    const banner = {
      enabled: true,
      text: 'Announcement',
      backgroundColor: '#DC2626',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BannerSchema)(banner)

    // THEN: Background color should be accepted
    expect(result.backgroundColor).toBe('#DC2626')
  })

  test('should accept banner with textColor', () => {
    // GIVEN: Banner with custom text color
    const banner = {
      enabled: true,
      text: 'Announcement',
      backgroundColor: '#1E40AF',
      textColor: '#FFFFFF',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BannerSchema)(banner)

    // THEN: Text color should be accepted
    expect(result.textColor).toBe('#FFFFFF')
  })

  test('should accept dismissible banner', () => {
    // GIVEN: Dismissible banner
    const banner = {
      enabled: true,
      text: 'Cookie consent',
      dismissible: true,
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BannerSchema)(banner)

    // THEN: Dismissible flag should be accepted
    expect(result.dismissible).toBe(true)
  })

  test('should accept sticky banner', () => {
    // GIVEN: Sticky banner
    const banner = {
      enabled: true,
      text: 'Flash sale',
      sticky: true,
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BannerSchema)(banner)

    // THEN: Sticky flag should be accepted
    expect(result.sticky).toBe(true)
  })

  test('should reject banner with invalid hex color', () => {
    // GIVEN: Banner with invalid background color
    const banner = {
      enabled: true,
      backgroundColor: '#FFF',
    }

    // WHEN: Schema validation is performed
    // THEN: Should be rejected
    expect(() => Schema.decodeUnknownSync(BannerSchema)(banner)).toThrow()
  })
})
