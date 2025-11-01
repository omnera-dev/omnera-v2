/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Favicon Set
 *
 * Source: specs/app/pages/meta/favicons/favicon-set.schema.json
 * Spec Count: 7
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (7 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Favicon Set', () => {
  test.fixme(
    'APP-PAGES-FAVICONSET-001: should define browser icon',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a favicon with rel 'icon'
      // WHEN: rel is 'icon' for standard favicon
      // THEN: it should define browser icon

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
              favicons: [{ rel: 'icon', href: './favicon.png' }],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="icon"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-FAVICONSET-002: should define Apple touch icon',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a favicon with rel 'apple-touch-icon'
      // WHEN: rel is 'apple-touch-icon' for iOS devices
      // THEN: it should define Apple touch icon

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
              favicons: [
                { rel: 'apple-touch-icon', sizes: '180x180', href: './apple-touch-icon.png' },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('sizes', '180x180')
    }
  )

  test.fixme(
    'APP-PAGES-FAVICONSET-003: should define Safari mask icon with color',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a favicon with rel 'mask-icon'
      // WHEN: rel is 'mask-icon' for Safari pinned tabs
      // THEN: it should define Safari mask icon with color

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
              favicons: [{ rel: 'mask-icon', href: './safari-pinned-tab.svg', color: '#FF5733' }],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="mask-icon"]')).toHaveAttribute('color', '#FF5733')
    }
  )

  test.fixme(
    'APP-PAGES-FAVICONSET-004: should specify icon dimensions for different contexts',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a favicon with sizes attribute
      // WHEN: sizes is '16x16', '32x32', '180x180', or '192x192'
      // THEN: it should specify icon dimensions for different contexts

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
              favicons: [
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: './favicon-16x16.png' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: './favicon-32x32.png' },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="icon"][sizes="16x16"]')).toBeVisible()
      await expect(page.locator('link[rel="icon"][sizes="32x32"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-FAVICONSET-005: should specify MIME type',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a favicon with type attribute
      // WHEN: type is 'image/png', 'image/x-icon', or 'image/svg+xml'
      // THEN: it should specify MIME type

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
              favicons: [{ rel: 'icon', type: 'image/svg+xml', href: './icon.svg' }],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-FAVICONSET-006: should define Safari pinned tab color',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a favicon with color for mask-icon
      // WHEN: color is hex value like '#FF5733'
      // THEN: it should define Safari pinned tab color

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
              favicons: [{ rel: 'mask-icon', href: './safari-tab.svg', color: '#4285F4' }],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const color = await page.locator('link[rel="mask-icon"]').getAttribute('color')
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  )

  test.fixme(
    'APP-PAGES-FAVICONSET-007: should provide comprehensive multi-device icon support',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a complete favicon set
      // WHEN: array contains icons for all devices (16x16, 32x32, 180x180, 192x192, 512x512, manifest)
      // THEN: it should provide comprehensive multi-device icon support

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
              favicons: [
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: './favicon-16x16.png' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: './favicon-32x32.png' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: './apple-touch-icon.png' },
                { rel: 'manifest', href: './site.webmanifest' },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="icon"]')).toHaveCount(2)
      await expect(page.locator('link[rel="apple-touch-icon"]')).toBeVisible()
      await expect(page.locator('link[rel="manifest"]')).toBeVisible()
    }
  )

  test.fixme(
    'user can complete full favicon set workflow',
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
              favicons: [
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: './favicon-16x16.png' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: './favicon-32x32.png' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: './apple-touch-icon.png' },
                { rel: 'mask-icon', href: './safari-tab.svg', color: '#4285F4' },
              ],
            },
            sections: [],
          },
        ],
      })

      await page.goto('/')

      // Verify all icon types
      await expect(page.locator('link[rel="icon"]')).toHaveCount(2)
      await expect(page.locator('link[rel="apple-touch-icon"]')).toBeVisible()
      await expect(page.locator('link[rel="mask-icon"]')).toBeVisible()
    }
  )
})
