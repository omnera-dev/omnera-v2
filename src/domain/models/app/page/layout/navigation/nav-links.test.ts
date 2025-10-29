/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { NavLinkTargetSchema, NavLinkSchema, NavLinksSchema } from './nav-links'

describe('NavLinkTargetSchema', () => {
  test('should accept all 4 target types', () => {
    // GIVEN: All valid link targets
    const targets = ['_self', '_blank', '_parent', '_top'] as const

    // WHEN: Schema validation is performed on each
    const results = targets.map((t) => Schema.decodeUnknownSync(NavLinkTargetSchema)(t))

    // THEN: All targets should be accepted
    expect(results).toEqual([...targets])
  })
})

describe('NavLinkSchema', () => {
  test('should accept link with label and href', () => {
    // GIVEN: Basic navigation link
    const link = {
      label: 'Home',
      href: '/',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavLinkSchema)(link)

    // THEN: Link should be accepted
    expect(result.label).toBe('Home')
    expect(result.href).toBe('/')
  })

  test('should accept link with target _blank', () => {
    // GIVEN: External link
    const link = {
      label: 'Documentation',
      href: 'https://docs.example.com',
      target: '_blank' as const,
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavLinkSchema)(link)

    // THEN: Target _blank should be accepted
    expect(result.target).toBe('_blank')
  })

  test('should accept link with icon', () => {
    // GIVEN: Link with icon
    const link = {
      label: 'Products',
      href: '/products',
      icon: 'package',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavLinkSchema)(link)

    // THEN: Icon should be accepted
    expect(result.icon).toBe('package')
  })

  test('should accept link with badge', () => {
    // GIVEN: Link with badge
    const link = {
      label: 'Features',
      href: '/features',
      badge: 'New',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavLinkSchema)(link)

    // THEN: Badge should be accepted
    expect(result.badge).toBe('New')
  })

  test('should accept link with children dropdown', () => {
    // GIVEN: Dropdown menu link
    const link = {
      label: 'Products',
      href: '/products',
      children: [
        { label: 'Product A', href: '/products/a' },
        { label: 'Product B', href: '/products/b' },
      ],
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavLinkSchema)(link)

    // THEN: Children dropdown should be accepted
    expect(result.children?.length).toBe(2)
    expect(result.children?.[0]?.label).toBe('Product A')
  })

  test('should accept deeply nested children', () => {
    // GIVEN: Multi-level dropdown
    const link = {
      label: 'Products',
      href: '/products',
      children: [
        {
          label: 'Category A',
          href: '/products/category-a',
          children: [
            { label: 'Item 1', href: '/products/category-a/item-1' },
            { label: 'Item 2', href: '/products/category-a/item-2' },
          ],
        },
      ],
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavLinkSchema)(link)

    // THEN: Nested structure should be accepted
    expect(result.children?.[0]?.children?.length).toBe(2)
  })
})

describe('NavLinksSchema', () => {
  test('should accept array of flat links', () => {
    // GIVEN: Flat navigation array
    const links = [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '#contact' },
    ]

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavLinksSchema)(links)

    // THEN: Flat array should be accepted
    expect(result.length).toBe(3)
  })

  test('should accept array with dropdowns', () => {
    // GIVEN: Navigation with dropdown menus
    const links = [
      { label: 'Home', href: '/' },
      {
        label: 'Products',
        href: '/products',
        children: [
          { label: 'Product A', href: '/products/a' },
          { label: 'Product B', href: '/products/b' },
        ],
      },
      { label: 'Pricing', href: '/pricing' },
    ]

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavLinksSchema)(links)

    // THEN: Array with dropdowns should be accepted
    expect(result.length).toBe(3)
    expect(result[1]?.children?.length).toBe(2)
  })

  test('should accept empty array', () => {
    // GIVEN: Empty navigation
    const links: unknown[] = []

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavLinksSchema)(links)

    // THEN: Empty array should be accepted
    expect(result).toEqual([])
  })
})
