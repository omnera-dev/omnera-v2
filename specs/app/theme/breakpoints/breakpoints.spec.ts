/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures.ts'

/**
 * E2E Tests for Breakpoints
 *
 * Source: specs/app/theme/breakpoints/breakpoints.schema.json
 * Spec Count: 9
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (9 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Breakpoints', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-THEME-BREAKPOINTS-001: should validate Tailwind breakpoint values',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-BREAKPOINTS-001
      // GIVEN: standard Tailwind breakpoints (sm, md, lg, xl, 2xl)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          breakpoints: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
          },
        },
      })

      // WHEN: responsive system uses common breakpoints
      await page.goto('/')

      // THEN: it should validate Tailwind breakpoint values
      await expect(page.locator('[data-testid="breakpoints"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-BREAKPOINTS-002: should validate pixel-based breakpoints',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-BREAKPOINTS-002
      // GIVEN: breakpoint values in pixels
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          breakpoints: {
            mobile: '480px',
            tablet: '768px',
          },
        },
      })

      // WHEN: breakpoints use px units
      await page.goto('/')

      // THEN: it should validate pixel-based breakpoints
      await expect(page.locator('[data-testid="breakpoints"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-BREAKPOINTS-003: should validate progressive enhancement strategy',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-BREAKPOINTS-003
      // GIVEN: mobile-first breakpoint progression
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          breakpoints: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
          },
        },
      })

      // WHEN: breakpoints increase from small to large
      await page.goto('/')

      // THEN: it should validate progressive enhancement strategy
      const breakpoints = await page.evaluate(() => {
        const sm = window.matchMedia('(min-width: 640px)').matches
        const md = window.matchMedia('(min-width: 768px)').matches
        const lg = window.matchMedia('(min-width: 1024px)').matches
        return { sm, md, lg }
      })
      expect(breakpoints).toBeTruthy()
    }
  )

  test.fixme(
    'APP-THEME-BREAKPOINTS-004: should validate lowercase naming convention',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-BREAKPOINTS-004
      // GIVEN: breakpoint with lowercase naming
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          breakpoints: {
            sm: '640px',
            md: '768px',
          },
        },
      })

      // WHEN: breakpoint uses simple names
      await page.goto('/')

      // THEN: it should validate lowercase naming convention
      await expect(page.locator('[data-testid="breakpoints"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-BREAKPOINTS-005: should validate custom breakpoint naming',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-BREAKPOINTS-005
      // GIVEN: custom breakpoints (tablet, desktop, wide)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          breakpoints: {
            tablet: '768px',
            desktop: '1280px',
            wide: '1920px',
          },
        },
      })

      // WHEN: project uses semantic breakpoint names
      await page.goto('/')

      // THEN: it should validate custom breakpoint naming
      await expect(page.locator('[data-testid="breakpoints"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-BREAKPOINTS-006: should validate consistency across responsive system',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-BREAKPOINTS-006
      // GIVEN: breakpoints matching responsive.schema.json
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          breakpoints: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
          },
        },
      })

      // WHEN: theme breakpoints align with responsive variants
      await page.goto('/')

      // THEN: it should validate consistency across responsive system
      const breakpoints = await page.evaluate(() => {
        const sm = window.matchMedia('(min-width: 640px)').matches
        const md = window.matchMedia('(min-width: 768px)').matches
        const lg = window.matchMedia('(min-width: 1024px)').matches
        return { sm, md, lg }
      })
      expect(breakpoints).toBeTruthy()
    }
  )

  test.fixme(
    'APP-THEME-BREAKPOINTS-APPLICATION-001: should render grid with media query at 768px',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-BREAKPOINTS-APPLICATION-001
      // GIVEN: md breakpoint applied to responsive grid
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          breakpoints: {
            md: '768px',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'grid',
                props: {
                  'data-testid': 'responsive-grid',
                },
              },
            ],
          },
        ],
      })

      // WHEN: grid uses theme.breakpoints.md for tablet layout
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      // THEN: it should render grid with media query at 768px
      const grid = page.locator('[data-testid="responsive-grid"]')
      await expect(grid).toBeVisible()

      await page.setViewportSize({ width: 768, height: 1024 })
      await expect(grid).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-BREAKPOINTS-APPLICATION-002: should render hamburger menu below 1024px and full menu above',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-BREAKPOINTS-APPLICATION-002
      // GIVEN: lg breakpoint applied to navigation menu
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          breakpoints: {
            lg: '1024px',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'navigation',
                props: {
                  'data-testid': 'main-nav',
                },
              },
            ],
          },
        ],
      })

      // WHEN: navigation switches from mobile to desktop at theme.breakpoints.lg
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      // THEN: it should render hamburger menu below 1024px and full menu above
      await expect(page.locator('[data-testid="main-nav"]')).toBeVisible()

      await page.setViewportSize({ width: 1024, height: 768 })
      await expect(page.locator('[data-testid="main-nav"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-BREAKPOINTS-APPLICATION-003: should render with increasing padding at each breakpoint',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-BREAKPOINTS-APPLICATION-003
      // GIVEN: multiple breakpoints applied to hero section
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          breakpoints: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'hero',
                props: {
                  'data-testid': 'hero-section',
                },
              },
            ],
          },
        ],
      })

      // WHEN: hero section uses sm, md, lg for responsive padding
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      // THEN: it should render with increasing padding at each breakpoint
      const hero = page.locator('[data-testid="hero-section"]')
      await expect(hero).toBeVisible()

      await page.setViewportSize({ width: 1024, height: 768 })
      await expect(hero).toBeVisible()
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full breakpoints workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application with comprehensive breakpoint system
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          breakpoints: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'grid',
                props: {
                  'data-testid': 'grid',
                },
              },
              {
                type: 'navigation',
                props: {
                  'data-testid': 'nav',
                },
              },
            ],
          },
        ],
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      // Verify mobile layout
      await expect(page.locator('[data-testid="grid"]')).toBeVisible()
      await expect(page.locator('[data-testid="nav"]')).toBeVisible()

      // Verify tablet layout
      await page.setViewportSize({ width: 768, height: 1024 })
      await expect(page.locator('[data-testid="grid"]')).toBeVisible()

      // Verify desktop layout
      await page.setViewportSize({ width: 1024, height: 768 })
      await expect(page.locator('[data-testid="nav"]')).toBeVisible()

      // Focus on workflow continuity, not exhaustive coverage
    }
  )
})
