/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Spacing Configuration
 *
 * Source: specs/app/theme/spacing/spacing.schema.json
 * Spec Count: 13
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (13 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Spacing Configuration', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-THEME-SPACING-001: should validate Tailwind spacing utilities',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: spacing using Tailwind utility classes (py-16, px-4)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            section: 'py-16',
            container: 'px-4',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [],
          },
        ],
      })

      // WHEN: spacing is defined with Tailwind syntax
      await page.goto('/')

      // THEN: it should validate Tailwind spacing utilities
      await expect(page.locator('[data-testid="spacing"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-SPACING-002: should validate responsive spacing with Tailwind breakpoints',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: spacing with responsive variants (py-16 sm:py-20)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            section: 'py-16 sm:py-20',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [],
          },
        ],
      })

      // WHEN: spacing includes breakpoint-specific values
      await page.goto('/')

      // THEN: it should validate responsive spacing with Tailwind breakpoints
      await expect(page.locator('[data-testid="section"]')).toHaveClass(/py-16/)
    }
  )

  test.fixme(
    'APP-THEME-SPACING-003: should validate centering and width constraints',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: container spacing with max-width and auto margins
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            container: 'max-w-7xl mx-auto px-4',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [],
          },
        ],
      })

      // WHEN: spacing defines container constraints (max-w-7xl mx-auto px-4)
      await page.goto('/')

      // THEN: it should validate centering and width constraints
      const container = page.locator('[data-testid="container"]')
      await expect(container).toHaveClass(/max-w-7xl/)
      await expect(container).toHaveClass(/mx-auto/)
    }
  )

  test.fixme(
    'APP-THEME-SPACING-004: should validate consistent spacing scale',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: spacing variants with size modifiers (gap, gapSmall, gapLarge)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            gapSmall: 'gap-4',
            gap: 'gap-6',
            gapLarge: 'gap-8',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [],
          },
        ],
      })

      // WHEN: spacing system includes small, medium, and large variants
      await page.goto('/')

      // THEN: it should validate consistent spacing scale
      await expect(page.locator('[data-testid="gap-small"]')).toHaveClass(/gap-4/)
      await expect(page.locator('[data-testid="gap-large"]')).toHaveClass(/gap-8/)
    }
  )

  test.fixme(
    'APP-THEME-SPACING-005: should validate visual rhythm between sections',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: section spacing with vertical padding
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            section: 'py-16 sm:py-20',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [],
          },
        ],
      })

      // WHEN: spacing defines consistent section padding
      await page.goto('/')

      // THEN: it should validate visual rhythm between sections
      await expect(page.locator('[data-testid="section"]')).toHaveClass(/py-16/)
    }
  )

  test.fixme(
    'APP-THEME-SPACING-006: should validate hierarchical content width constraints',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: multiple container sizes (container, containerSmall, containerXSmall)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            container: 'max-w-7xl mx-auto px-4',
            containerSmall: 'max-w-4xl mx-auto px-4',
            containerXSmall: 'max-w-2xl mx-auto px-4',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [],
          },
        ],
      })

      // WHEN: spacing includes different max-widths for various contexts
      await page.goto('/')

      // THEN: it should validate hierarchical content width constraints
      await expect(page.locator('[data-testid="container"]')).toHaveClass(/max-w-7xl/)
      await expect(page.locator('[data-testid="container-small"]')).toHaveClass(/max-w-4xl/)
      await expect(page.locator('[data-testid="container-xsmall"]')).toHaveClass(/max-w-2xl/)
    }
  )

  test.fixme(
    'APP-THEME-SPACING-007: should validate consistent internal component spacing',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: padding variants (padding, paddingSmall, paddingLarge)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            paddingSmall: 'p-4',
            padding: 'p-6',
            paddingLarge: 'p-8',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [],
          },
        ],
      })

      // WHEN: spacing system provides padding scale
      await page.goto('/')

      // THEN: it should validate consistent internal component spacing
      await expect(page.locator('[data-testid="padding-small"]')).toHaveClass(/p-4/)
      await expect(page.locator('[data-testid="padding-large"]')).toHaveClass(/p-8/)
    }
  )

  test.fixme(
    'APP-THEME-SPACING-008: should validate consistent external component spacing',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: margin variants (margin, marginSmall, marginLarge)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            marginSmall: 'm-4',
            margin: 'm-6',
            marginLarge: 'm-8',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [],
          },
        ],
      })

      // WHEN: spacing system provides margin scale
      await page.goto('/')

      // THEN: it should validate consistent external component spacing
      await expect(page.locator('[data-testid="margin-small"]')).toHaveClass(/m-4/)
      await expect(page.locator('[data-testid="margin-large"]')).toHaveClass(/m-8/)
    }
  )

  test.fixme(
    'APP-THEME-SPACING-009: should validate custom CSS spacing values',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: spacing using CSS values (2rem, 16px, 1.5em)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            section: '4rem',
            gap: '1rem',
            padding: '16px',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [],
          },
        ],
      })

      // WHEN: spacing is defined with raw CSS instead of Tailwind
      await page.goto('/')

      // THEN: it should validate custom CSS spacing values
      const section = page.locator('[data-testid="section"]')
      await expect(section).toHaveScreenshot('spacing-009-custom-css.png')
    }
  )

  test.fixme(
    'APP-THEME-SPACING-010: should validate comprehensive spacing system',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a complete spacing system
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            section: 'py-16 sm:py-20',
            container: 'max-w-7xl mx-auto px-4',
            gap: 'gap-6',
            padding: 'p-6',
            margin: 'm-6',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [],
          },
        ],
      })

      // WHEN: all spacing tokens are configured
      await page.goto('/')

      // THEN: it should validate comprehensive spacing system
      await expect(page.locator('[data-testid="section"]')).toHaveClass(/py-16/)
      await expect(page.locator('[data-testid="container"]')).toHaveClass(/max-w-7xl/)
    }
  )

  test.fixme(
    'APP-THEME-SPACING-APPLICATION-001: should render with vertical padding creating rhythm',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: section spacing applied to page section
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            section: '4rem',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'section',
                content: 'Content',
              },
            ],
          },
        ],
      })

      // WHEN: section uses theme.spacing.section
      await page.goto('/')

      // THEN: it should render with vertical padding creating rhythm
      const section = page.locator('section')
      await expect(section).toHaveScreenshot('spacing-app-001-section-rhythm.png')
    }
  )

  test.fixme(
    'APP-THEME-SPACING-APPLICATION-002: should render centered with max-width constraint',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: container spacing applied to content wrapper
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            container: '80rem',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'container',
                content: 'Content',
              },
            ],
          },
        ],
      })

      // WHEN: div uses theme.spacing.container
      await page.goto('/')

      // THEN: it should render centered with max-width constraint
      const container = page.locator('[data-testid="container"]')
      await expect(container).toHaveScreenshot('spacing-app-002-container-centered.png')
    }
  )

  test.fixme(
    'APP-THEME-SPACING-APPLICATION-003: should render with spacing between flex items',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: gap spacing applied to flex container
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            gap: '1.5rem',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'flex',
                children: [
                  { type: 'div', content: 'Item 1' },
                  { type: 'div', content: 'Item 2' },
                ],
              },
            ],
          },
        ],
      })

      // WHEN: flex container uses theme.spacing.gap
      await page.goto('/')

      // THEN: it should render with spacing between flex items
      const flex = page.locator('[data-testid="flex"]')
      await expect(flex).toHaveScreenshot('spacing-app-003-flex-gap.png')
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'APP-THEME-SPACING-REGRESSION-001: user can complete full spacing workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application with comprehensive spacing system
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            section: '4rem',
            container: '80rem',
            gap: '1.5rem',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'section',
                content: 'Section',
              },
              {
                type: 'container',
                content: 'Container',
              },
              {
                type: 'flex',
                children: [{ type: 'div', content: 'Item' }],
              },
            ],
          },
        ],
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.goto('/')

      // Validate CSS custom properties generated for spacing system
      const css = await page.locator('style').first().textContent()
      expect(css).toContain(':root')
      expect(css).toMatch(/--spacing-section:\s*64px/)
      expect(css).toMatch(/--spacing-container:\s*1280px/)
      expect(css).toMatch(/--spacing-gap:\s*24px/)

      // Verify section spacing
      const section = page.locator('section')
      await expect(section).toHaveCSS('padding-top', '64px')

      // Verify container spacing
      const container = page.locator('[data-testid="container"]')
      await expect(container).toHaveCSS('max-width', '1280px')

      // Verify gap spacing
      const flex = page.locator('[data-testid="flex"]')
      await expect(flex).toHaveCSS('gap', '24px')

      // Focus on workflow continuity, not exhaustive coverage
    }
  )
})
