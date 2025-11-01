/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Resource Preloading
 *
 * Source: specs/app/pages/meta/performance/preload.schema.json
 * Spec Count: 10
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (10 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Resource Preloading', () => {
  test.fixme(
    'APP-PAGES-PRELOAD-001: should preload critical resource',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: preload resource with href and as
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: {
              lang: 'en-US',
              title: 'Test',
              description: 'Test',
              preload: [{ href: './output.css', as: 'style' }],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(
        page.locator('link[rel="preload"][href="./output.css"][as="style"]')
      ).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-PRELOAD-002: should preload critical stylesheet',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: preload with as='style'
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: {
              lang: 'en-US',
              title: 'Test',
              description: 'Test',
              preload: [{ href: './styles/main.css', as: 'style' }],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="preload"][as="style"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-PRELOAD-003: should preload critical scripts',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: preload with as='script'
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: {
              lang: 'en-US',
              title: 'Test',
              description: 'Test',
              preload: [{ href: './scripts/app.js', as: 'script' }],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="preload"][as="script"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-PRELOAD-004: should preload web fonts',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: preload with as='font'
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: {
              lang: 'en-US',
              title: 'Test',
              description: 'Test',
              preload: [
                { href: './fonts/MyFont.woff2', as: 'font', type: 'font/woff2', crossorigin: true },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const preload = page.locator('link[rel="preload"][as="font"]')
      await expect(preload).toHaveAttribute('type', 'font/woff2')
      await expect(preload).toHaveAttribute('crossorigin', '')
    }
  )

  test.fixme(
    'APP-PAGES-PRELOAD-005: should preload hero images',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: preload with as='image'
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: {
              lang: 'en-US',
              title: 'Test',
              description: 'Test',
              preload: [{ href: './images/hero.jpg', as: 'image' }],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="preload"][as="image"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-PRELOAD-006: should prefetch critical API responses',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: preload with as='fetch'
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: {
              lang: 'en-US',
              title: 'Test',
              description: 'Test',
              preload: [{ href: '/api/data.json', as: 'fetch' }],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="preload"][as="fetch"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-PRELOAD-007: should set CORS for cross-origin fonts',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: preload with crossorigin for fonts
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: {
              lang: 'en-US',
              title: 'Test',
              description: 'Test',
              preload: [
                {
                  href: './fonts/font.woff2',
                  as: 'font',
                  type: 'font/woff2',
                  crossorigin: 'anonymous',
                },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="preload"][as="font"]')).toHaveAttribute(
        'crossorigin',
        'anonymous'
      )
    }
  )

  test.fixme(
    'APP-PAGES-PRELOAD-008: should help browser prioritize resource',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: preload with type attribute
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: {
              lang: 'en-US',
              title: 'Test',
              description: 'Test',
              preload: [{ href: './fonts/font.woff2', as: 'font', type: 'font/woff2' }],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="preload"][type="font/woff2"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-PRELOAD-009: should preload only when media query matches',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: preload with media query
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: {
              lang: 'en-US',
              title: 'Test',
              description: 'Test',
              preload: [
                { href: './images/hero-mobile.jpg', as: 'image', media: '(max-width: 768px)' },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="preload"][media="(max-width: 768px)"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-PRELOAD-010: should optimize First Contentful Paint (FCP)',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: preload for critical rendering path
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: {
              lang: 'en-US',
              title: 'Test',
              description: 'Test',
              preload: [
                { href: './output.css', as: 'style' },
                { href: './fonts/font.woff2', as: 'font', type: 'font/woff2', crossorigin: true },
                { href: './images/hero.jpg', as: 'image' },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="preload"]')).toHaveCount(3)
    }
  )

  test.fixme(
    'user can complete full preload workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: {
              lang: 'en-US',
              title: 'Test',
              description: 'Test',
              preload: [
                { href: './output.css', as: 'style' },
                {
                  href: './fonts/Inter-Regular.woff2',
                  as: 'font',
                  type: 'font/woff2',
                  crossorigin: true,
                },
                { href: './images/hero.jpg', as: 'image' },
                { href: '/api/data.json', as: 'fetch' },
              ],
            },
            sections: [],
          },
        ],
      })

      await page.goto('/')

      // Verify all preload links
      await expect(page.locator('link[rel="preload"]')).toHaveCount(4)
      await expect(page.locator('link[rel="preload"][as="style"]')).toBeVisible()
      await expect(page.locator('link[rel="preload"][as="font"]')).toBeVisible()
      await expect(page.locator('link[rel="preload"][as="image"]')).toBeVisible()
      await expect(page.locator('link[rel="preload"][as="fetch"]')).toBeVisible()
    }
  )
})
