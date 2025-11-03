/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Animation Configuration
 *
 * Source: specs/app/theme/animations/animations.schema.json
 * Spec Count: 11
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (11 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Animation Configuration', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test(
    'APP-THEME-ANIMATIONS-001: should validate animation enablement',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an animation with boolean value true
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          animations: {
            fadeIn: true,
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

      // WHEN: animation is simply enabled/disabled
      await page.goto('/')

      // THEN: it should validate animation enablement
      await expect(page.locator('[data-testid="animation-fadeIn"]')).toBeVisible()
    }
  )

  test(
    'APP-THEME-ANIMATIONS-002: should validate CSS animation string',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an animation with string CSS value
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          animations: {
            slideIn: 'slide-in 0.5s ease-out',
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

      // WHEN: animation uses CSS shorthand (e.g., 'slide-in 0.5s ease-out')
      await page.goto('/')

      // THEN: it should validate CSS animation string
      const animValue = await page
        .locator('[data-testid="animation-slideIn"]')
        .evaluate((el) => window.getComputedStyle(el).animation)
      expect(animValue).toContain('slide-in')
    }
  )

  test(
    'APP-THEME-ANIMATIONS-003: should validate timing properties',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an animation with duration and easing object config
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          animations: {
            transition: {
              duration: '300ms',
              easing: 'ease-in-out',
            },
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

      // WHEN: animation has custom duration '300ms' and easing 'ease-in-out'
      await page.goto('/')

      // THEN: it should validate timing properties
      await expect(page.locator('[data-testid="animation-transition"]')).toBeVisible()
    }
  )

  test(
    'APP-THEME-ANIMATIONS-004: should validate animation delay',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an animation with delay property
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          animations: {
            delayedFade: {
              duration: '500ms',
              delay: '200ms',
            },
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

      // WHEN: animation should wait before starting
      await page.goto('/')

      // THEN: it should validate animation delay
      await expect(page.locator('[data-testid="animation-delayedFade"]')).toBeVisible()
    }
  )

  test(
    'APP-THEME-ANIMATIONS-005: should validate animation frames definition',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an animation with keyframes object
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          animations: {
            custom: {
              keyframes: {
                '0%': {
                  opacity: 0,
                },
                '100%': {
                  opacity: 1,
                },
              },
            },
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

      // WHEN: animation uses custom CSS keyframes
      await page.goto('/')

      // THEN: it should validate animation frames definition
      await expect(page.locator('[data-testid="animation-custom"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-ANIMATIONS-006: should validate disabled state',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an animation with enabled set to false
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          animations: {
            fadeIn: {
              enabled: false,
            },
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

      // WHEN: animation is disabled via config
      await page.goto('/')

      // THEN: it should validate disabled state
      const element = page.locator('[data-testid="animation-fadeIn"]')
      const animValue = await element.evaluate((el) => window.getComputedStyle(el).animation)
      expect(animValue).toBe('none')
    }
  )

  test.fixme(
    'APP-THEME-ANIMATIONS-007: should validate reusable animation library',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: common animations (fadeIn, fadeInUp, pulse, float)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          animations: {
            fadeIn: true,
            fadeInUp: true,
            pulse: true,
            float: true,
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

      // WHEN: theme defines standard animation library
      await page.goto('/')

      // THEN: it should validate reusable animation library
      await expect(page.locator('[data-testid="animation-fadeIn"]')).toBeVisible()
      await expect(page.locator('[data-testid="animation-pulse"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-ANIMATIONS-008: should validate default transition behavior',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: transition config with duration and easing
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          animations: {
            transition: {
              duration: '300ms',
              easing: 'ease-in-out',
            },
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

      // WHEN: global transition timing is defined
      await page.goto('/')

      // THEN: it should validate default transition behavior
      await expect(page.locator('[data-testid="animation-transition"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-ANIMATIONS-APPLICATION-001: should render modal with fade-in animation on mount',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: fadeIn animation applied to modal component
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          animations: {
            fadeIn: {
              duration: '300ms',
              easing: 'ease-in',
            },
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
                  'data-testid': 'modal',
                },
              },
            ],
          },
        ],
      })

      // WHEN: modal uses theme.animations.fadeIn
      await page.goto('/')

      // THEN: it should render modal with fade-in animation on mount
      const modal = page.locator('[data-testid="modal"]')
      await expect(modal).toBeVisible()
      const animValue = await modal.evaluate((el) => window.getComputedStyle(el).animation)
      expect(animValue).toContain('fadeIn')
    }
  )

  test.fixme(
    'APP-THEME-ANIMATIONS-APPLICATION-002: should render badge with pulsing animation loop',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: pulse animation applied to notification badge
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          animations: {
            pulse: {
              duration: '2s',
              easing: 'ease-in-out',
            },
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'badge',
                content: '3',
                props: {
                  'data-testid': 'notification-badge',
                },
              },
            ],
          },
        ],
      })

      // WHEN: badge uses theme.animations.pulse
      await page.goto('/')

      // THEN: it should render badge with pulsing animation loop
      const badge = page.locator('[data-testid="notification-badge"]')
      await expect(badge).toBeVisible()
      const animValue = await badge.evaluate((el) => window.getComputedStyle(el).animation)
      expect(animValue).toContain('pulse')
    }
  )

  test.fixme(
    'APP-THEME-ANIMATIONS-APPLICATION-003: should render button with CSS transition on hover',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: transition animation applied to button hover state
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          animations: {
            transition: {
              duration: '200ms',
              easing: 'ease-in-out',
            },
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'button',
                content: 'Hover me',
                props: {
                  'data-testid': 'action-button',
                },
              },
            ],
          },
        ],
      })

      // WHEN: button uses theme.animations.transition for smooth state changes
      await page.goto('/')

      // THEN: it should render button with CSS transition on hover
      const button = page.locator('[data-testid="action-button"]')
      await expect(button).toBeVisible()
      const transValue = await button.evaluate((el) => window.getComputedStyle(el).transition)
      expect(transValue).toMatch(/200ms|0.2s/)
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full animations workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application with comprehensive animation system
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          animations: {
            fadeIn: true,
            pulse: {
              duration: '2s',
              easing: 'ease-in-out',
            },
            transition: {
              duration: '200ms',
              easing: 'ease-in-out',
            },
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'modal',
                content: 'Modal',
                props: {
                  'data-testid': 'modal',
                },
              },
              {
                type: 'badge',
                content: '5',
                props: {
                  'data-testid': 'badge',
                },
              },
              {
                type: 'button',
                content: 'Click',
                props: {
                  'data-testid': 'button',
                },
              },
            ],
          },
        ],
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.goto('/')

      // Verify modal fade-in
      await expect(page.locator('[data-testid="modal"]')).toBeVisible()

      // Verify badge pulse
      await expect(page.locator('[data-testid="badge"]')).toBeVisible()

      // Verify button transition
      await expect(page.locator('[data-testid="button"]')).toBeVisible()

      // Focus on workflow continuity, not exhaustive coverage
    }
  )
})
