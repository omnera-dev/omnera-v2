/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures.ts'

/**
 * E2E Tests for Client Scripts Configuration
 *
 * Source: specs/app/pages/scripts/scripts.schema.json
 * Spec Count: 10
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (10 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Client Scripts Configuration', () => {
  test.fixme(
    'APP-PAGES-SCRIPTS-001: should orchestrate client-side script management',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a scripts configuration with all 4 properties
      // WHEN: scripts includes features, externalScripts, inlineScripts, config
      // THEN: it should orchestrate client-side script management
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: {
              features: { darkMode: true },
              externalScripts: [{ src: 'https://cdn.example.com/lib.js', async: true }],
              inlineScripts: [{ code: 'console.log("ready")' }],
              config: { apiUrl: 'https://api.example.com' },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('script[src="https://cdn.example.com/lib.js"]')).toBeVisible()
      const inlineScript = await page
        .locator('script')
        .filter({ hasText: 'console.log("ready")' })
        .textContent()
      expect(inlineScript).toContain('console.log("ready")')
    }
  )

  test.fixme(
    'APP-PAGES-SCRIPTS-002: should enable client-side feature toggles',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: scripts with features only
      // WHEN: features defines darkMode, animations, analytics
      // THEN: it should enable client-side feature toggles
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: { features: { darkMode: true, animations: true, analytics: false } },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const html = await page.locator('html').getAttribute('data-features')
      expect(html).toBeTruthy()
    }
  )

  test.fixme(
    'APP-PAGES-SCRIPTS-003: should include external JavaScript dependencies',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: scripts with externalScripts
      // WHEN: externalScripts array loads CDN libraries
      // THEN: it should include external JavaScript dependencies
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: {
              externalScripts: [
                { src: 'https://cdn.example.com/script.js', async: true, defer: false },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('script[src="https://cdn.example.com/script.js"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-SCRIPTS-004: should inject inline JavaScript code',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: scripts with inlineScripts
      // WHEN: inlineScripts array contains code snippets
      // THEN: it should inject inline JavaScript code
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: { inlineScripts: [{ code: 'console.log("Hello")' }] },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const inlineScript = await page
        .locator('script')
        .filter({ hasText: 'console.log("Hello")' })
        .textContent()
      expect(inlineScript).toContain('console.log("Hello")')
    }
  )

  test.fixme(
    'APP-PAGES-SCRIPTS-005: should provide client-side configuration data',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: scripts with config object
      // WHEN: config has apiUrl and environment properties
      // THEN: it should provide client-side configuration data
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: { config: { apiUrl: 'https://api.example.com', environment: 'production' } },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const config = await page.evaluate(() => (window as any).APP_CONFIG)
      expect(config).toBeTruthy()
    }
  )

  test.fixme(
    'APP-PAGES-SCRIPTS-006: should allow pages without client-side scripts',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: empty scripts configuration
      // WHEN: all properties are omitted
      // THEN: it should allow pages without client-side scripts
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: {},
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptTags = await page.locator('script[src]').count()
      expect(scriptTags).toBe(0)
    }
  )

  test.fixme(
    'APP-PAGES-SCRIPTS-007: should support flexible client configuration',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: scripts config with additionalProperties true
      // WHEN: config accepts any custom properties
      // THEN: it should support flexible client configuration
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: { config: { customProp: 'value', anotherProp: 123 } },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const config = await page.evaluate(() => (window as any).APP_CONFIG)
      expect(config?.customProp).toBe('value')
      expect(config?.anotherProp).toBe(123)
    }
  )

  test.fixme(
    'APP-PAGES-SCRIPTS-008: should enable feature-driven configuration',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: scripts combining features and config
      // WHEN: features toggle behavior and config provides data
      // THEN: it should enable feature-driven configuration
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: { features: { analytics: true }, config: { analyticsId: 'G-XXXXX' } },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const config = await page.evaluate(() => (window as any).APP_CONFIG)
      expect(config?.analyticsId).toBe('G-XXXXX')
    }
  )

  test.fixme(
    'APP-PAGES-SCRIPTS-009: should support per-page script customization',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: scripts at page level
      // WHEN: each page can define custom scripts
      // THEN: it should support per-page script customization
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Home',
            path: '/',
            meta: { lang: 'en-US', title: 'Home', description: 'Home' },
            scripts: { features: { analytics: true } },
            sections: [],
          },
          {
            name: 'Blog',
            path: '/blog',
            meta: { lang: 'en-US', title: 'Blog', description: 'Blog' },
            scripts: {},
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const homeHtml = await page.locator('html').getAttribute('data-features')
      expect(homeHtml).toBeTruthy()
      await page.goto('/blog')
      const blogHtml = await page.locator('html').getAttribute('data-features')
      expect(blogHtml).toBeFalsy()
    }
  )

  test.fixme(
    'APP-PAGES-SCRIPTS-010: should compose scripts from modular schemas',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: scripts referencing sub-schemas
      // WHEN: features, externalScripts, inlineScripts use $ref
      // THEN: it should compose scripts from modular schemas
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            scripts: {
              features: { darkMode: true },
              externalScripts: [{ src: 'https://cdn.example.com/lib.js' }],
              inlineScripts: [{ code: 'console.log("ready")' }],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('script[src="https://cdn.example.com/lib.js"]')).toBeVisible()
    }
  )

  test.fixme(
    'user can complete full Client Scripts workflow',
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
              features: { darkMode: true, animations: true },
              externalScripts: [
                {
                  src: 'https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js',
                  async: true,
                  defer: true,
                },
              ],
              inlineScripts: [{ code: 'window.APP_CONFIG = { ready: true };' }],
              config: { apiUrl: 'https://api.example.com', environment: 'production' },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('script[src*="alpinejs"]')).toBeVisible()
      const config = await page.evaluate(() => (window as any).APP_CONFIG)
      expect(config?.ready).toBe(true)
      expect(config?.apiUrl).toBe('https://api.example.com')
    }
  )
})
