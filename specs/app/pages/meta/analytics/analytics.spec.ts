/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures.ts'

declare global {
  interface Window {
    dataLayer: unknown[]
  }
}

/**
 * E2E Tests for Analytics Configuration
 *
 * Source: specs/app/pages/meta/analytics/analytics.schema.json
 * Spec Count: 12
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (12 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Analytics Configuration', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-PAGES-ANALYTICS-001: should support multiple analytics providers',
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
              analytics: {
                providers: [
                  { name: 'plausible', enabled: true },
                  { name: 'google', enabled: true },
                ],
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('[data-testid="analytics-plausible"]')).toBeVisible()
      await expect(page.locator('[data-testid="analytics-google"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-ANALYTICS-002: should support 6 analytics providers',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      const providers = ['google', 'plausible', 'matomo', 'fathom', 'posthog', 'mixpanel']
      for (const provider of providers) {
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
                analytics: { providers: [{ name: provider, enabled: true }] },
              },
              sections: [],
            },
          ],
        })
        await page.goto('/')
        await expect(page.locator(`[data-testid="analytics-${provider}"]`)).toBeVisible()
      }
    }
  )

  test.fixme(
    'APP-PAGES-ANALYTICS-003: should allow enabling/disabling provider',
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
              analytics: {
                providers: [
                  { name: 'google', enabled: true },
                  { name: 'plausible', enabled: false },
                ],
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('[data-testid="analytics-google"]')).toBeVisible()
      await expect(page.locator('[data-testid="analytics-plausible"]')).toBeHidden()
    }
  )

  test.fixme(
    'APP-PAGES-ANALYTICS-004: should load provider scripts',
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
              analytics: {
                providers: [
                  {
                    name: 'plausible',
                    scripts: [{ src: 'https://plausible.io/js/script.js', async: true }],
                  },
                ],
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('script[src="https://plausible.io/js/script.js"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-ANALYTICS-005: should load script asynchronously',
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
              analytics: {
                providers: [
                  {
                    name: 'plausible',
                    scripts: [{ src: 'https://plausible.io/js/script.js', async: true }],
                  },
                ],
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const script = page.locator('script[src="https://plausible.io/js/script.js"]')
      await expect(script).toHaveAttribute('async', '')
    }
  )

  test.fixme(
    'APP-PAGES-ANALYTICS-006: should execute provider initialization code',
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
              analytics: {
                providers: [
                  {
                    name: 'google',
                    initScript:
                      "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXXX');",
                  },
                ],
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const dataLayer = await page.evaluate(() => window.dataLayer)
      expect(dataLayer).toBeDefined()
    }
  )

  test.fixme(
    'APP-PAGES-ANALYTICS-007: should optimize DNS resolution for provider',
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
              analytics: {
                providers: [{ name: 'plausible', dnsPrefetch: 'https://plausible.io' }],
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(
        page.locator('link[rel="dns-prefetch"][href="https://plausible.io"]')
      ).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-ANALYTICS-008: should pass configuration to provider',
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
              analytics: {
                providers: [
                  { name: 'google', config: { trackingId: 'G-XXXXX', anonymizeIp: true } },
                ],
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const config = await page.locator('[data-testid="analytics-google-config"]').textContent()
      expect(config).toContain('G-XXXXX')
    }
  )

  test.fixme(
    'APP-PAGES-ANALYTICS-009: should configure Google Analytics',
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
              analytics: {
                providers: [
                  {
                    name: 'google',
                    enabled: true,
                    scripts: [
                      {
                        src: 'https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ',
                        async: true,
                      },
                    ],
                    config: { trackingId: 'G-ABC123XYZ' },
                  },
                ],
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('script[src*="googletagmanager.com"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-ANALYTICS-010: should configure privacy-friendly Plausible analytics',
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
              analytics: {
                providers: [
                  {
                    name: 'plausible',
                    enabled: true,
                    scripts: [{ src: 'https://plausible.io/js/script.js', async: true }],
                    config: { domain: 'example.com' },
                  },
                ],
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('script[src="https://plausible.io/js/script.js"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-ANALYTICS-011: should support multi-provider analytics',
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
              analytics: {
                providers: [
                  {
                    name: 'plausible',
                    enabled: true,
                    scripts: [{ src: 'https://plausible.io/js/script.js', async: true }],
                  },
                  {
                    name: 'google',
                    enabled: true,
                    scripts: [
                      { src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXX', async: true },
                    ],
                  },
                ],
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('script[src="https://plausible.io/js/script.js"]')).toBeVisible()
      await expect(page.locator('script[src*="googletagmanager.com"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-ANALYTICS-012: should configure event tracking and feature flags',
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
              analytics: {
                providers: [
                  {
                    name: 'posthog',
                    enabled: true,
                    scripts: [{ src: 'https://app.posthog.com/static/array.js', async: true }],
                    config: { apiKey: 'phc_ABC123XYZ', apiHost: 'https://app.posthog.com' },
                  },
                ],
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('script[src*="posthog.com"]')).toBeVisible()
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full analytics workflow',
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
              analytics: {
                providers: [
                  {
                    name: 'plausible',
                    enabled: true,
                    scripts: [{ src: 'https://plausible.io/js/script.js', async: true }],
                    dnsPrefetch: 'https://plausible.io',
                    config: { domain: 'example.com' },
                  },
                  {
                    name: 'google',
                    enabled: true,
                    scripts: [
                      { src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXX', async: true },
                    ],
                    dnsPrefetch: 'https://www.googletagmanager.com',
                    config: { trackingId: 'G-XXXXX' },
                  },
                ],
              },
            },
            sections: [],
          },
        ],
      })

      await page.goto('/')

      // Verify DNS prefetch
      await expect(
        page.locator('link[rel="dns-prefetch"][href="https://plausible.io"]')
      ).toBeVisible()
      await expect(
        page.locator('link[rel="dns-prefetch"][href="https://www.googletagmanager.com"]')
      ).toBeVisible()

      // Verify scripts loaded
      await expect(page.locator('script[src="https://plausible.io/js/script.js"]')).toBeVisible()
      await expect(page.locator('script[src*="googletagmanager.com"]')).toBeVisible()

      // Verify async loading
      await expect(page.locator('script[src="https://plausible.io/js/script.js"]')).toHaveAttribute(
        'async',
        ''
      )
    }
  )
})
