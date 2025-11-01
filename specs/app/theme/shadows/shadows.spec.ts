/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Shadows
 *
 * Source: specs/app/theme/shadows/shadows.schema.json
 * Spec Count: 9
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (9 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Shadows', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-THEME-SHADOWS-001: should validate elevation system from subtle to dramatic',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: shadow scale from sm to 2xl
      // WHEN: shadows increase in depth and blur
      // THEN: it should validate elevation system from subtle to dramatic

      // GIVEN: shadow scale from sm to 2xl
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
          },
        },
      })

      // WHEN: shadows increase in depth and blur
      await page.goto('/')

      // THEN: it should validate elevation system from subtle to dramatic
      await expect(page.locator('[data-testid="shadow-sm"]')).toBeVisible()
      await expect(page.locator('[data-testid="shadow-2xl"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-002: should validate rgb(0 0 0 / 0.1) format',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: shadow with rgb color and opacity
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
        },
      })

      // WHEN: shadow uses modern CSS color syntax
      await page.goto('/')

      // THEN: it should validate rgb(0 0 0 / 0.1) format
      const element = page.locator('[data-testid="shadow-md"]')
      const shadow = await element.evaluate((el) => window.getComputedStyle(el).boxShadow)
      expect(shadow).toContain('rgb')
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-003: should validate inset box-shadow',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: inner shadow for inset effects
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
          },
        },
      })

      // WHEN: shadow creates depth inside element
      await page.goto('/')

      // THEN: it should validate inset box-shadow
      const element = page.locator('[data-testid="shadow-inner"]')
      const shadow = await element.evaluate((el) => window.getComputedStyle(el).boxShadow)
      expect(shadow).toContain('inset')
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-004: should validate shadow removal',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: shadow 'none' to remove shadows
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            none: '0 0 #0000',
          },
        },
      })

      // WHEN: flat design with no elevation is needed
      await page.goto('/')

      // THEN: it should validate shadow removal
      const element = page.locator('[data-testid="shadow-none"]')
      const shadow = await element.evaluate((el) => window.getComputedStyle(el).boxShadow)
      expect(shadow).toBe('none')
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-005: should validate kebab-case convention',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: shadows with kebab-case naming
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            'drop-shadow': '0 4px 6px rgb(0 0 0 / 0.1)',
            'card-shadow': '0 2px 4px rgb(0 0 0 / 0.05)',
          },
        },
      })

      // WHEN: shadow uses multi-word names
      await page.goto('/')

      // THEN: it should validate kebab-case convention
      await expect(page.locator('[data-testid="shadow-drop-shadow"]')).toBeVisible()
      await expect(page.locator('[data-testid="shadow-card-shadow"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-006: should validate complete shadow system',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: complete shadow system (sm, md, lg, xl, 2xl, inner, none)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            sm: '0 1px 2px',
            md: '0 4px 6px',
            lg: '0 10px 15px',
            xl: '0 20px 25px',
            '2xl': '0 25px 50px',
            inner: 'inset 0 2px 4px',
            none: '0 0 #0000',
          },
        },
      })

      // WHEN: all elevation tokens are defined
      await page.goto('/')

      // THEN: it should validate complete shadow system
      await expect(page.locator('[data-testid="shadow-sm"]')).toBeVisible()
      await expect(page.locator('[data-testid="shadow-none"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-APPLICATION-001: should render card with medium box-shadow creating depth',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: md shadow applied to card component
      // WHEN: card uses theme.shadows.md for moderate elevation
      // THEN: it should render card with medium box-shadow creating depth

      // GIVEN: md shadow applied to card component
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
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
                  'data-testid': 'product-card',
                },
              },
            ],
          },
        ],
      })

      // WHEN: card uses theme.shadows.md for moderate elevation
      await page.goto('/')

      // THEN: it should render card with medium box-shadow creating depth
      const card = page.locator('[data-testid="product-card"]')
      await expect(card).toBeVisible()
      const shadow = await card.evaluate((el) => window.getComputedStyle(el).boxShadow)
      expect(shadow).toContain('rgb')
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-APPLICATION-002: should render modal with dramatic shadow emphasizing importance',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: xl shadow applied to modal overlay
      // WHEN: modal uses theme.shadows.xl for high elevation above content
      // THEN: it should render modal with dramatic shadow emphasizing importance

      // GIVEN: xl shadow applied to modal overlay
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'modal',
                content: 'Modal content',
                props: {
                  'data-testid': 'confirmation-modal',
                },
              },
            ],
          },
        ],
      })

      // WHEN: modal uses theme.shadows.xl for high elevation above content
      await page.goto('/')

      // THEN: it should render modal with dramatic shadow emphasizing importance
      const modal = page.locator('[data-testid="confirmation-modal"]')
      await expect(modal).toBeVisible()
      const shadow = await modal.evaluate((el) => window.getComputedStyle(el).boxShadow)
      expect(shadow).toContain('20px')
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-APPLICATION-003: should render input with inset shadow creating depth inward',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: inner shadow applied to input field
      // WHEN: input uses theme.shadows.inner for recessed appearance
      // THEN: it should render input with inset shadow creating depth inward

      // GIVEN: inner shadow applied to input field
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'input',
                props: {
                  'data-testid': 'text-input',
                },
              },
            ],
          },
        ],
      })

      // WHEN: input uses theme.shadows.inner for recessed appearance
      await page.goto('/')

      // THEN: it should render input with inset shadow creating depth inward
      const input = page.locator('[data-testid="text-input"]')
      await expect(input).toBeVisible()
      const shadow = await input.evaluate((el) => window.getComputedStyle(el).boxShadow)
      expect(shadow).toContain('inset')
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full shadows workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application with comprehensive shadow system
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'card',
                content: 'Card',
                props: {
                  'data-testid': 'card',
                },
              },
              {
                type: 'modal',
                content: 'Modal',
                props: {
                  'data-testid': 'modal',
                },
              },
              {
                type: 'input',
                props: {
                  'data-testid': 'input',
                },
              },
            ],
          },
        ],
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.goto('/')

      // Verify card shadow
      await expect(page.locator('[data-testid="card"]')).toBeVisible()

      // Verify modal shadow
      await expect(page.locator('[data-testid="modal"]')).toBeVisible()

      // Verify input shadow
      await expect(page.locator('[data-testid="input"]')).toBeVisible()

      // Focus on workflow continuity, not exhaustive coverage
    }
  )
})
