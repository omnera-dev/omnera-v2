/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures.ts'

/**
 * E2E Tests for Favicon
 *
 * Source: specs/app/pages/meta/favicons/favicon.schema.json
 * Spec Count: 8
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (8 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Favicon', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-PAGES-FAVICON-001: should reference default favicon file',
    { tag: '@spec' },
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
              favicon: './public/favicon.ico',
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="icon"][href="./public/favicon.ico"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-FAVICON-002: should support legacy ICO format',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test', favicon: './favicon.ico' },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const href = await page.locator('link[rel="icon"]').getAttribute('href')
      expect(href).toMatch(/\.ico$/)
    }
  )

  test.fixme(
    'APP-PAGES-FAVICON-003: should support PNG format',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test', favicon: './favicon.png' },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const href = await page.locator('link[rel="icon"]').getAttribute('href')
      expect(href).toMatch(/\.png$/)
    }
  )

  test.fixme(
    'APP-PAGES-FAVICON-004: should support modern SVG format',
    { tag: '@spec' },
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
              favicon: './assets/favicon.svg',
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const href = await page.locator('link[rel="icon"]').getAttribute('href')
      expect(href).toMatch(/\.svg$/)
    }
  )

  test.fixme(
    'APP-PAGES-FAVICON-005: should use relative file paths',
    { tag: '@spec' },
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
              favicon: './public/favicon.ico',
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const href = await page.locator('link[rel="icon"]').getAttribute('href')
      expect(href).toMatch(/^\.\//)
    }
  )

  test.fixme(
    'APP-PAGES-FAVICON-006: should enable quick favicon setup',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test', favicon: './favicon.ico' },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="icon"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-FAVICON-007: should provide site branding in tabs',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: {
              lang: 'en-US',
              title: 'Test Page',
              description: 'Test',
              favicon: './favicon.ico',
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
    'APP-PAGES-FAVICON-008: should support both simple and complete configurations',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test', favicon: './favicon.ico' },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const iconCount = await page.locator('link[rel="icon"]').count()
      expect(iconCount).toBeGreaterThan(0)
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full favicon workflow',
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
              favicon: './public/favicon.ico',
            },
            sections: [],
          },
        ],
      })

      await page.goto('/')

      // Verify favicon link
      const favicon = page.locator('link[rel="icon"]')
      await expect(favicon).toBeVisible()
      await expect(favicon).toHaveAttribute('href', './public/favicon.ico')
    }
  )
})
