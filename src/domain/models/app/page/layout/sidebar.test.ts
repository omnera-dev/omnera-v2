/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { SidebarPositionSchema, SidebarItemTypeSchema, SidebarSchema } from './sidebar'

describe('SidebarPositionSchema', () => {
  test('should accept left and right positions', () => {
    // GIVEN: Valid sidebar positions
    const positions = ['left', 'right'] as const

    // WHEN: Schema validation is performed on each
    const results = positions.map((p) => Schema.decodeUnknownSync(SidebarPositionSchema)(p))

    // THEN: Both positions should be accepted
    expect(results).toEqual([...positions])
  })
})

describe('SidebarItemTypeSchema', () => {
  test('should accept all 3 item types', () => {
    // GIVEN: Valid item types
    const types = ['link', 'group', 'divider'] as const

    // WHEN: Schema validation is performed on each
    const results = types.map((t) => Schema.decodeUnknownSync(SidebarItemTypeSchema)(t))

    // THEN: All types should be accepted
    expect(results).toEqual([...types])
  })
})

describe('SidebarSchema', () => {
  test('should accept sidebar with enabled only', () => {
    // GIVEN: Minimal sidebar
    const sidebar = { enabled: true }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SidebarSchema)(sidebar)

    // THEN: Enabled should be accepted
    expect(result.enabled).toBe(true)
  })

  test('should accept sidebar with left position', () => {
    // GIVEN: Left sidebar
    const sidebar = { enabled: true, position: 'left' as const }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SidebarSchema)(sidebar)

    // THEN: Left position should be accepted
    expect(result.position).toBe('left')
  })

  test('should accept sidebar with custom width', () => {
    // GIVEN: Sidebar with custom width
    const sidebar = { enabled: true, width: '320px' }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SidebarSchema)(sidebar)

    // THEN: Custom width should be accepted
    expect(result.width).toBe('320px')
  })

  test('should accept collapsible sidebar', () => {
    // GIVEN: Collapsible sidebar
    const sidebar = { enabled: true, collapsible: true }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SidebarSchema)(sidebar)

    // THEN: Collapsible flag should be accepted
    expect(result.collapsible).toBe(true)
  })

  test('should accept sidebar defaulting to collapsed', () => {
    // GIVEN: Sidebar starting collapsed
    const sidebar = { enabled: true, collapsible: true, defaultCollapsed: true }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SidebarSchema)(sidebar)

    // THEN: Default collapsed should be accepted
    expect(result.defaultCollapsed).toBe(true)
  })

  test('should accept sticky sidebar', () => {
    // GIVEN: Sticky sidebar
    const sidebar = { enabled: true, sticky: true }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SidebarSchema)(sidebar)

    // THEN: Sticky flag should be accepted
    expect(result.sticky).toBe(true)
  })

  test('should accept sidebar with link items', () => {
    // GIVEN: Sidebar with links
    const sidebar = {
      enabled: true,
      items: [
        { type: 'link' as const, label: 'Dashboard', href: '/dashboard', icon: 'home' },
        { type: 'link' as const, label: 'Settings', href: '/settings', icon: 'settings' },
      ],
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SidebarSchema)(sidebar)

    // THEN: Link items should be accepted
    expect(result.items?.length).toBe(2)
    expect(result.items?.[0]?.type).toBe('link')
  })

  test('should accept sidebar with group items', () => {
    // GIVEN: Sidebar with collapsible group
    const sidebar = {
      enabled: true,
      items: [
        {
          type: 'group' as const,
          label: 'Products',
          icon: 'package',
          children: [
            { type: 'link' as const, label: 'All Products', href: '/products' },
            { type: 'link' as const, label: 'Add Product', href: '/products/new' },
          ],
        },
      ],
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SidebarSchema)(sidebar)

    // THEN: Group items should be accepted
    expect(result.items?.[0]?.type).toBe('group')
    expect(result.items?.[0]?.children?.length).toBe(2)
  })

  test('should accept sidebar with divider items', () => {
    // GIVEN: Sidebar with divider
    const sidebar = {
      enabled: true,
      items: [
        { type: 'link' as const, label: 'Dashboard', href: '/dashboard' },
        { type: 'divider' as const },
        { type: 'link' as const, label: 'Settings', href: '/settings' },
      ],
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SidebarSchema)(sidebar)

    // THEN: Divider should be accepted
    expect(result.items?.[1]?.type).toBe('divider')
  })

  test('should accept sidebar with nested groups', () => {
    // GIVEN: Deeply nested sidebar structure
    const sidebar = {
      enabled: true,
      items: [
        {
          type: 'group' as const,
          label: 'Docs',
          children: [
            {
              type: 'group' as const,
              label: 'Getting Started',
              children: [
                { type: 'link' as const, label: 'Installation', href: '/docs/installation' },
                { type: 'link' as const, label: 'Quick Start', href: '/docs/quick-start' },
              ],
            },
          ],
        },
      ],
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(SidebarSchema)(sidebar)

    // THEN: Nested structure should be accepted
    expect(result.items?.[0]?.children?.[0]?.children?.length).toBe(2)
  })
})
