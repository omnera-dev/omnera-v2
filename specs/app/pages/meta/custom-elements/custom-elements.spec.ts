/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Custom Head Elements
 *
 * Source: specs/app/pages/meta/custom-elements/custom-elements.schema.json
 * Spec Count: 8
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (8 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Custom Head Elements', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-PAGES-CUSTOM-001: should add custom meta tag to head',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: custom element with type meta
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
              customElements: [
                { type: 'meta', attrs: { name: 'theme-color', content: '#FFAF00' } },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#FFAF00')
    }
  )

  test.fixme(
    'APP-PAGES-CUSTOM-002: should add custom link element to head',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: custom element with type link
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
              customElements: [
                { type: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com' } },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(
        page.locator('link[rel="preconnect"][href="https://fonts.gstatic.com"]')
      ).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-CUSTOM-003: should add custom script to head',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: custom element with type script
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
              customElements: [
                { type: 'script', attrs: { src: 'https://example.com/script.js', async: 'true' } },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('script[src="https://example.com/script.js"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-CUSTOM-004: should add inline style to head',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: custom element with type style
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
              customElements: [{ type: 'style', content: 'body { background-color: red; }' }],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const styleContent = await page.locator('style').textContent()
      expect(styleContent).toContain('body { background-color: red; }')
    }
  )

  test.fixme(
    'APP-PAGES-CUSTOM-005: should apply attributes to element',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: custom element with attrs object
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
              customElements: [
                {
                  type: 'meta',
                  attrs: {
                    name: 'robots',
                    content: 'noindex, nofollow',
                    'data-testid': 'robots-meta',
                  },
                },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('[data-testid="robots-meta"]')).toHaveAttribute('name', 'robots')
      await expect(page.locator('[data-testid="robots-meta"]')).toHaveAttribute(
        'content',
        'noindex, nofollow'
      )
    }
  )

  test.fixme(
    'APP-PAGES-CUSTOM-006: should set element inner content',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: custom element with content property
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
              customElements: [
                { type: 'script', content: 'console.log("Hello from inline script");' },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script:not([src])').first().textContent()
      expect(scriptContent).toContain('console.log("Hello from inline script");')
    }
  )

  test.fixme(
    'APP-PAGES-CUSTOM-007: should customize browser chrome color',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: custom elements for theme-color meta
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
              customElements: [
                { type: 'meta', attrs: { name: 'theme-color', content: '#4285f4' } },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#4285f4')
    }
  )

  test.fixme(
    'APP-PAGES-CUSTOM-008: should configure mobile viewport',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: custom elements for viewport meta
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
              customElements: [
                {
                  type: 'meta',
                  attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                },
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
        'content',
        'width=device-width, initial-scale=1'
      )
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full custom elements workflow',
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
              customElements: [
                { type: 'meta', attrs: { name: 'theme-color', content: '#FFAF00' } },
                {
                  type: 'meta',
                  attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                },
                { type: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com' } },
                { type: 'style', content: 'body { margin: 0; }' },
              ],
            },
            sections: [],
          },
        ],
      })

      await page.goto('/')

      // Verify meta tags
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#FFAF00')
      await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
        'content',
        'width=device-width, initial-scale=1'
      )

      // Verify link
      await expect(
        page.locator('link[rel="preconnect"][href="https://fonts.gstatic.com"]')
      ).toBeVisible()

      // Verify style
      const styleContent = await page.locator('style').textContent()
      expect(styleContent).toContain('body { margin: 0; }')
    }
  )
})
