/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Entrance Animation
 *
 * Source: specs/app/pages/common/interactions/entrance-animation.schema.json
 * Spec Count: 8
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (8 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Entrance Animation', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-INTERACTION-ENTRANCE-001: should fade in smoothly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a component with entrance animation 'fadeIn'
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            sections: [
              {
                type: 'div',
                props: {},
                interactions: { entrance: { animation: 'fadeIn' } },
                children: ['Fade In'],
              },
            ],
          },
        ],
      })

      // WHEN: page loads
      await page.goto('/')

      // THEN: it should fade in smoothly
      const element = page.locator('div').first()
      await expect(element).toHaveClass(/animate-fadeIn/)
    }
  )

  test.fixme(
    'APP-INTERACTION-ENTRANCE-002: should fade in while moving up from below',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a component with entrance animation 'fadeInUp'
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            sections: [
              {
                type: 'div',
                props: {},
                interactions: { entrance: { animation: 'fadeInUp' } },
                children: ['Fade In Up'],
              },
            ],
          },
        ],
      })

      // WHEN: page loads
      await page.goto('/')

      // THEN: it should fade in while moving up from below
      const element = page.locator('div').first()
      await expect(element).toHaveClass(/animate-fadeInUp/)
    }
  )

  test.fixme(
    'APP-INTERACTION-ENTRANCE-003: should zoom in from small to normal size',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a component with entrance animation 'zoomIn'
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            sections: [
              {
                type: 'div',
                props: {},
                interactions: { entrance: { animation: 'zoomIn' } },
                children: ['Zoom In'],
              },
            ],
          },
        ],
      })

      // WHEN: page loads
      await page.goto('/')

      // THEN: it should zoom in from small to normal size
      const element = page.locator('div').first()
      await expect(element).toHaveClass(/animate-zoomIn/)
    }
  )

  test.fixme(
    'APP-INTERACTION-ENTRANCE-004: should wait 500ms before starting the entrance animation',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a component with entrance delay '500ms'
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            sections: [
              {
                type: 'div',
                props: {},
                interactions: { entrance: { animation: 'fadeIn', delay: '500ms' } },
                children: ['Delayed'],
              },
            ],
          },
        ],
      })

      // WHEN: page loads
      await page.goto('/')

      // THEN: it should wait 500ms before starting the entrance animation
      const element = page.locator('div').first()
      await expect(element).toHaveCSS('animation-delay', '500ms')
    }
  )

  test.fixme(
    'APP-INTERACTION-ENTRANCE-005: should complete the entrance animation in 1 second',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a component with entrance duration '1000ms'
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            sections: [
              {
                type: 'div',
                props: {},
                interactions: { entrance: { animation: 'fadeIn', duration: '1000ms' } },
                children: ['Long Duration'],
              },
            ],
          },
        ],
      })

      // WHEN: animation starts
      await page.goto('/')

      // THEN: it should complete the entrance animation in 1 second
      const element = page.locator('div').first()
      await expect(element).toHaveCSS('animation-duration', '1000ms')
    }
  )

  test.fixme(
    'APP-INTERACTION-ENTRANCE-006: each component should animate 100ms after the previous sibling',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: multiple sibling components with stagger '100ms'
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            sections: [
              {
                type: 'div',
                props: {},
                children: [
                  {
                    type: 'div',
                    props: {},
                    interactions: { entrance: { animation: 'fadeIn', stagger: '100ms' } },
                    children: ['Item 1'],
                  },
                  {
                    type: 'div',
                    props: {},
                    interactions: { entrance: { animation: 'fadeIn', stagger: '100ms' } },
                    children: ['Item 2'],
                  },
                  {
                    type: 'div',
                    props: {},
                    interactions: { entrance: { animation: 'fadeIn', stagger: '100ms' } },
                    children: ['Item 3'],
                  },
                ],
              },
            ],
          },
        ],
      })

      // WHEN: page loads
      await page.goto('/')

      // THEN: each component should animate 100ms after the previous sibling
      const items = page.locator('div > div')
      await expect(items.nth(0)).toHaveCSS('animation-delay', '0ms')
      await expect(items.nth(1)).toHaveCSS('animation-delay', '100ms')
      await expect(items.nth(2)).toHaveCSS('animation-delay', '200ms')
    }
  )

  test.fixme(
    'APP-INTERACTION-ENTRANCE-007: should wait 200ms base delay plus 50ms per sibling index before animating',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a component with delay '200ms' and stagger '50ms'
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            sections: [
              {
                type: 'div',
                props: {},
                children: [
                  {
                    type: 'div',
                    props: {},
                    interactions: {
                      entrance: { animation: 'fadeIn', delay: '200ms', stagger: '50ms' },
                    },
                    children: ['Item 1'],
                  },
                  {
                    type: 'div',
                    props: {},
                    interactions: {
                      entrance: { animation: 'fadeIn', delay: '200ms', stagger: '50ms' },
                    },
                    children: ['Item 2'],
                  },
                ],
              },
            ],
          },
        ],
      })

      // WHEN: page loads
      await page.goto('/')

      // THEN: it should wait 200ms base delay plus 50ms per sibling index before animating
      const items = page.locator('div > div')
      await expect(items.nth(0)).toHaveCSS('animation-delay', '200ms')
      await expect(items.nth(1)).toHaveCSS('animation-delay', '250ms')
    }
  )

  test.fixme(
    'APP-INTERACTION-ENTRANCE-008: should wait the delay period then animate for the specified duration',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a component with animation, delay, and duration all configured
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            sections: [
              {
                type: 'div',
                props: {},
                interactions: {
                  entrance: { animation: 'fadeInUp', delay: '300ms', duration: '800ms' },
                },
                children: ['Complete Config'],
              },
            ],
          },
        ],
      })

      // WHEN: page loads
      await page.goto('/')

      // THEN: it should wait the delay period then animate for the specified duration
      const element = page.locator('div').first()
      await expect(element).toHaveClass(/animate-fadeInUp/)
      await expect(element).toHaveCSS('animation-delay', '300ms')
      await expect(element).toHaveCSS('animation-duration', '800ms')
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full entrance animation workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application with comprehensive entrance animations
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            sections: [
              {
                type: 'div',
                props: {},
                interactions: { entrance: { animation: 'fadeIn', duration: '600ms' } },
                children: ['Hero'],
              },
              {
                type: 'div',
                props: {},
                children: [
                  {
                    type: 'div',
                    props: {},
                    interactions: {
                      entrance: { animation: 'fadeInUp', delay: '100ms', stagger: '100ms' },
                    },
                    children: ['Feature 1'],
                  },
                  {
                    type: 'div',
                    props: {},
                    interactions: {
                      entrance: { animation: 'fadeInUp', delay: '100ms', stagger: '100ms' },
                    },
                    children: ['Feature 2'],
                  },
                  {
                    type: 'div',
                    props: {},
                    interactions: {
                      entrance: { animation: 'fadeInUp', delay: '100ms', stagger: '100ms' },
                    },
                    children: ['Feature 3'],
                  },
                ],
              },
            ],
          },
        ],
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.goto('/')

      // Verify hero animation
      const hero = page.locator('div').filter({ hasText: 'Hero' }).first()
      await expect(hero).toHaveClass(/animate-fadeIn/)

      // Verify staggered list animations
      const features = page.locator('div').filter({ hasText: /Feature/ })
      await expect(features.nth(0)).toHaveCSS('animation-delay', '100ms')
      await expect(features.nth(1)).toHaveCSS('animation-delay', '200ms')

      // Focus on workflow continuity, not exhaustive coverage
    }
  )
})
