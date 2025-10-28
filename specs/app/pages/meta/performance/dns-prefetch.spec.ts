/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures.ts'

/**
 * E2E Tests for DNS Prefetch
 *
 * Source: specs/app/pages/meta/performance/dns-prefetch.schema.json
 * Spec Count: 10
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (10 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('DNS Prefetch', () => {
  test.fixme(
    'APP-PAGES-DNS-001: should prefetch DNS for listed domains',
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
              dnsPrefetch: ['https://fonts.googleapis.com', 'https://www.google-analytics.com'],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(
        page.locator('link[rel="dns-prefetch"][href="https://fonts.googleapis.com"]')
      ).toBeVisible()
      await expect(
        page.locator('link[rel="dns-prefetch"][href="https://www.google-analytics.com"]')
      ).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-DNS-002: should optimize Google Fonts loading',
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
              dnsPrefetch: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(
        page.locator('link[rel="dns-prefetch"][href="https://fonts.googleapis.com"]')
      ).toBeVisible()
      await expect(
        page.locator('link[rel="dns-prefetch"][href="https://fonts.gstatic.com"]')
      ).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-DNS-003: should optimize analytics script loading',
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
              dnsPrefetch: ['https://www.google-analytics.com'],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(
        page.locator('link[rel="dns-prefetch"][href="https://www.google-analytics.com"]')
      ).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-DNS-004: should optimize CDN resource loading',
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
              dnsPrefetch: ['https://unpkg.com', 'https://cdn.jsdelivr.net'],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="dns-prefetch"][href="https://unpkg.com"]')).toBeVisible()
      await expect(
        page.locator('link[rel="dns-prefetch"][href="https://cdn.jsdelivr.net"]')
      ).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-DNS-005: should optimize API request latency',
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
              dnsPrefetch: ['https://api.example.com'],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(
        page.locator('link[rel="dns-prefetch"][href="https://api.example.com"]')
      ).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-DNS-006: should validate protocol in URL pattern',
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
              dnsPrefetch: ['https://example.com', 'http://example.org'],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const prefetchLinks = await page.locator('link[rel="dns-prefetch"]').all()
      for (const link of prefetchLinks) {
        const href = await link.getAttribute('href')
        expect(href).toMatch(/^https?:\/\//)
      }
    }
  )

  test.fixme(
    'APP-PAGES-DNS-007: should prevent duplicate domain entries',
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
              dnsPrefetch: ['https://fonts.googleapis.com'],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const count = await page
        .locator('link[rel="dns-prefetch"][href="https://fonts.googleapis.com"]')
        .count()
      expect(count).toBe(1)
    }
  )

  test.fixme(
    'APP-PAGES-DNS-008: should optimize multiple external connections',
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
              dnsPrefetch: [
                'https://fonts.googleapis.com',
                'https://www.google-analytics.com',
                'https://cdn.jsdelivr.net',
                'https://platform.twitter.com',
              ],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('link[rel="dns-prefetch"]')).toHaveCount(4)
    }
  )

  test.fixme(
    'APP-PAGES-DNS-009: should reduce connection latency',
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
              dnsPrefetch: ['https://fonts.googleapis.com'],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(
        page.locator('link[rel="dns-prefetch"][href="https://fonts.googleapis.com"]')
      ).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-DNS-010: should improve perceived page load speed',
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
              dnsPrefetch: ['https://fonts.googleapis.com', 'https://www.google-analytics.com'],
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const prefetchCount = await page.locator('link[rel="dns-prefetch"]').count()
      expect(prefetchCount).toBeGreaterThan(0)
    }
  )

  test.fixme(
    'user can complete full DNS prefetch workflow',
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
              dnsPrefetch: [
                'https://fonts.googleapis.com',
                'https://fonts.gstatic.com',
                'https://www.google-analytics.com',
                'https://cdn.jsdelivr.net',
              ],
            },
            sections: [],
          },
        ],
      })

      await page.goto('/')

      // Verify all DNS prefetch links
      await expect(page.locator('link[rel="dns-prefetch"]')).toHaveCount(4)
      await expect(
        page.locator('link[rel="dns-prefetch"][href="https://fonts.googleapis.com"]')
      ).toBeVisible()
      await expect(
        page.locator('link[rel="dns-prefetch"][href="https://www.google-analytics.com"]')
      ).toBeVisible()
    }
  )
})
