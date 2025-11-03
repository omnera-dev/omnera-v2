/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Border Radius
 *
 * Source: specs/app/theme/border-radius/border-radius.schema.json
 * Spec Count: 9
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (9 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Border Radius', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-THEME-RADIUS-001: should validate radius tokens from 0 to 1.5rem',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: border-radius scale from none to 3xl
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          borderRadius: {
            none: '0',
            sm: '0.125rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '0.75rem',
            '2xl': '1rem',
            '3xl': '1.5rem',
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

      // WHEN: radius system defines progressive rounding
      await page.goto('/')

      // THEN: it should validate radius tokens from 0 to 1.5rem
      await expect(page.locator('[data-testid="radius-none"]')).toBeVisible()
      await expect(page.locator('[data-testid="radius-3xl"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-RADIUS-002: should validate no rounding',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: border-radius 'none' with value '0'
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          borderRadius: {
            none: '0',
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

      // WHEN: sharp corners are needed
      await page.goto('/')

      // THEN: it should validate no rounding
      const element = page.locator('[data-testid="radius-none"]')
      await expect(element).toHaveCSS('border-radius', '0px')
    }
  )

  test.fixme(
    'APP-THEME-RADIUS-003: should validate fully rounded elements',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: border-radius 'full' with value '9999px'
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          borderRadius: {
            full: '9999px',
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

      // WHEN: perfect circles or pills are needed
      await page.goto('/')

      // THEN: it should validate fully rounded elements
      const element = page.locator('[data-testid="radius-full"]')
      await expect(element).toHaveCSS('border-radius', '9999px')
    }
  )

  test.fixme(
    'APP-THEME-RADIUS-004: should validate rem-based radius values',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: border-radius using rem units
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          borderRadius: {
            sm: '0.125rem',
            md: '0.375rem',
            lg: '0.5rem',
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

      // WHEN: radius scales with font size
      await page.goto('/')

      // THEN: it should validate rem-based radius values
      await expect(page.locator('[data-testid="radius-sm"]')).toBeVisible()
      await expect(page.locator('[data-testid="radius-lg"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-RADIUS-005: should validate kebab-case convention',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: border-radius with kebab-case naming
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          borderRadius: {
            'button-radius': '0.5rem',
            'card-radius': '1rem',
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

      // WHEN: radius uses multi-word names
      await page.goto('/')

      // THEN: it should validate kebab-case convention
      await expect(page.locator('[data-testid="radius-button-radius"]')).toBeVisible()
      await expect(page.locator('[data-testid="radius-card-radius"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-RADIUS-006: should validate complete rounding system',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: complete radius system (none, sm, md, lg, xl, 2xl, 3xl, full)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          borderRadius: {
            none: '0',
            sm: '0.125rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '0.75rem',
            '2xl': '1rem',
            '3xl': '1.5rem',
            full: '9999px',
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

      // WHEN: all radius tokens are defined
      await page.goto('/')

      // THEN: it should validate complete rounding system
      await expect(page.locator('[data-testid="radius-none"]')).toBeVisible()
      await expect(page.locator('[data-testid="radius-full"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-RADIUS-APPLICATION-001: should render button with 0.375rem border-radius creating soft corners',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: md radius applied to button component
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          borderRadius: {
            md: '0.375rem',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'button',
                content: 'Click me',
                props: {
                  'data-testid': 'primary-button',
                },
              },
            ],
          },
        ],
      })

      // WHEN: button uses theme.borderRadius.md for moderate rounding
      await page.goto('/')

      // THEN: it should render button with 0.375rem border-radius creating soft corners
      const button = page.locator('[data-testid="primary-button"]')
      await expect(button).toBeVisible()
      await expect(button).toHaveCSS('border-radius', '0.375rem')
    }
  )

  test.fixme(
    'APP-THEME-RADIUS-APPLICATION-002: should render image as circle with 9999px border-radius',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: full radius applied to avatar image
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          borderRadius: {
            full: '9999px',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'avatar',
                props: {
                  'data-testid': 'user-avatar',
                  src: 'avatar.jpg',
                  alt: 'User',
                },
              },
            ],
          },
        ],
      })

      // WHEN: avatar uses theme.borderRadius.full for perfect circle
      await page.goto('/')

      // THEN: it should render image as circle with 9999px border-radius
      const avatar = page.locator('[data-testid="user-avatar"]')
      await expect(avatar).toBeVisible()
      await expect(avatar).toHaveCSS('border-radius', '9999px')
    }
  )

  test.fixme(
    'APP-THEME-RADIUS-APPLICATION-003: should render card with 0.5rem border-radius creating soft edges',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: lg radius applied to card component
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          borderRadius: {
            lg: '0.5rem',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'card',
                content: 'Card content',
                props: {
                  'data-testid': 'content-card',
                },
              },
            ],
          },
        ],
      })

      // WHEN: card uses theme.borderRadius.lg for noticeable rounding
      await page.goto('/')

      // THEN: it should render card with 0.5rem border-radius creating soft edges
      const card = page.locator('[data-testid="content-card"]')
      await expect(card).toBeVisible()
      await expect(card).toHaveCSS('border-radius', '0.5rem')
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'APP-THEME-BORDER-RADIUS-BORDER-RADIUS-REGRESSION-001: user can complete full border-radius workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application with comprehensive border-radius system
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          borderRadius: {
            none: '0',
            md: '0.375rem',
            lg: '0.5rem',
            full: '9999px',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'button',
                content: 'Button',
                props: {
                  'data-testid': 'button',
                },
              },
              {
                type: 'card',
                content: 'Card',
                props: {
                  'data-testid': 'card',
                },
              },
              {
                type: 'avatar',
                props: {
                  'data-testid': 'avatar',
                },
              },
            ],
          },
        ],
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.goto('/')

      // Verify button radius
      await expect(page.locator('[data-testid="button"]')).toHaveCSS('border-radius', '0.375rem')

      // Verify card radius
      await expect(page.locator('[data-testid="card"]')).toHaveCSS('border-radius', '0.5rem')

      // Verify avatar radius
      await expect(page.locator('[data-testid="avatar"]')).toHaveCSS('border-radius', '9999px')

      // Focus on workflow continuity, not exhaustive coverage
    }
  )
})
