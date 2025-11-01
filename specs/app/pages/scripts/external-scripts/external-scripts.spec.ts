/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for External Scripts
 *
 * Source: specs/app/pages/scripts/external-scripts/external-scripts.schema.json
 * Spec Count: 12
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (12 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('External Scripts', () => {
  test.fixme(
    'APP-PAGES-EXTERNAL-001: should load external JavaScript from CDN',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an external script with src URL
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: {
              externalScripts: [{ src: 'https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js' }],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(
        page.locator('script[src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"]')
      ).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-EXTERNAL-002: should load script asynchronously (non-blocking)',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an external script with async true
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: {
              externalScripts: [{ src: 'https://cdn.example.com/script.js', async: true }],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const script = page.locator('script[src="https://cdn.example.com/script.js"]')
      await expect(script).toHaveAttribute('async', '')
    }
  )

  test.fixme(
    'APP-PAGES-EXTERNAL-003: should defer script execution until DOM loaded',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an external script with defer true
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: {
              externalScripts: [{ src: 'https://cdn.example.com/script.js', defer: true }],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const script = page.locator('script[src="https://cdn.example.com/script.js"]')
      await expect(script).toHaveAttribute('defer', '')
    }
  )

  test.fixme(
    "APP-PAGES-EXTERNAL-004: should load script with type='module'",
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: { externalScripts: [{ src: './js/app.js', module: true }] },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const script = page.locator('script[src="./js/app.js"]')
      await expect(script).toHaveAttribute('type', 'module')
    }
  )

  test.fixme(
    'APP-PAGES-EXTERNAL-005: should verify subresource integrity for security',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an external script with integrity hash
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: {
              externalScripts: [
                { src: 'https://cdn.example.com/lib.js', integrity: 'sha384-abc123' },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const script = page.locator('script[src="https://cdn.example.com/lib.js"]')
      await expect(script).toHaveAttribute('integrity', 'sha384-abc123')
    }
  )

  test.fixme(
    'APP-PAGES-EXTERNAL-006: should set CORS policy for script loading',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an external script with crossorigin
      const crossorigins = ['anonymous', 'use-credentials']
      for (const crossorigin of crossorigins) {
        await startServerWithSchema({
          name: 'test-app',
          pages: [
            {
              name: 'Test',
              path: '/',
              meta: { lang: 'en-US', title: 'Test', description: 'Test' },
              scripts: {
                externalScripts: [{ src: 'https://cdn.example.com/lib.js', crossorigin }],
              },
              sections: [],
            },
          ],
        })
        await page.goto('/')
        const script = page.locator('script[src="https://cdn.example.com/lib.js"]')
        await expect(script).toHaveAttribute('crossorigin', crossorigin)
      }
    }
  )

  test.fixme(
    'APP-PAGES-EXTERNAL-007: should insert script in document head',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an external script with position 'head'
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: {
              externalScripts: [
                { src: 'https://cdn.example.com/head-script.js', position: 'head' },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const script = page.locator('head script[src="https://cdn.example.com/head-script.js"]')
      await expect(script).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-EXTERNAL-008: should insert script at end of body',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an external script with position 'body-end'
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: {
              externalScripts: [
                { src: 'https://cdn.example.com/body-script.js', position: 'body-end' },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const script = page.locator('body script[src="https://cdn.example.com/body-script.js"]')
      await expect(script).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-EXTERNAL-009: should insert script at start of body',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an external script with position 'body-start'
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: {
              externalScripts: [
                { src: 'https://cdn.example.com/body-start-script.js', position: 'body-start' },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const script = page.locator('body script[src="https://cdn.example.com/body-start-script.js"]')
      await expect(script).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-EXTERNAL-010: should load multiple external scripts in order',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: external scripts array with multiple libraries
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: {
              externalScripts: [
                { src: 'https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js' },
                { src: 'https://cdn.jsdelivr.net/npm/chart.js' },
                { src: './js/app.js' },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(
        page.locator('script[src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"]')
      ).toBeVisible()
      await expect(
        page.locator('script[src="https://cdn.jsdelivr.net/npm/chart.js"]')
      ).toBeVisible()
      await expect(page.locator('script[src="./js/app.js"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-EXTERNAL-011: should load local JavaScript file',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: external script with relative src
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: { externalScripts: [{ src: './js/app.js' }] },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('script[src="./js/app.js"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-EXTERNAL-012: should load script with default settings (sync, body-end)',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: external script with required src only
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: { externalScripts: [{ src: 'https://cdn.example.com/script.js' }] },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const script = page.locator('script[src="https://cdn.example.com/script.js"]')
      await expect(script).toBeVisible()
      await expect(script).not.toHaveAttribute('async')
      await expect(script).not.toHaveAttribute('defer')
    }
  )

  test.fixme(
    'user can complete full External Scripts workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: {
              externalScripts: [
                {
                  src: 'https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js',
                  defer: true,
                  position: 'head',
                },
                { src: 'https://cdn.jsdelivr.net/npm/chart.js', async: true },
                { src: './js/app.js', module: true, position: 'body-end' },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('head script[src*="alpinejs"]')).toBeVisible()
      await expect(page.locator('script[src*="chart.js"]')).toBeVisible()
      await expect(page.locator('script[src="./js/app.js"][type="module"]')).toBeVisible()
    }
  )
})
