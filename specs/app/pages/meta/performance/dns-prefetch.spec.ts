/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

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
      // GIVEN: DNS prefetch array with domains
      // WHEN: array contains external domain URLs
      // THEN: it should prefetch DNS for listed domains

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
      // GIVEN: DNS prefetch for font domains
      // WHEN: array includes 'https://fonts.googleapis.com' and 'https://fonts.gstatic.com'
      // THEN: it should optimize Google Fonts loading

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
      // GIVEN: DNS prefetch for analytics domains
      // WHEN: array includes 'https://www.google-analytics.com' or 'https://plausible.io'
      // THEN: it should optimize analytics script loading

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
      // GIVEN: DNS prefetch for CDN domains
      // WHEN: array includes 'https://unpkg.com' or 'https://cdn.jsdelivr.net'
      // THEN: it should optimize CDN resource loading

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
      // GIVEN: DNS prefetch for API domains
      // WHEN: array includes API endpoint domains
      // THEN: it should optimize API request latency

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
      // GIVEN: DNS prefetch with http/https protocol
      // WHEN: URLs start with https:// or http://
      // THEN: it should validate protocol in URL pattern

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
      // GIVEN: DNS prefetch with unique items
      // WHEN: array has uniqueItems constraint
      // THEN: it should prevent duplicate domain entries

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
      // GIVEN: DNS prefetch for multiple third-party services
      // WHEN: array contains [fonts, analytics, CDN, social] domains
      // THEN: it should optimize multiple external connections

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
      // GIVEN: DNS prefetch before resource fetch
      // WHEN: DNS resolution happens early in page load
      // THEN: it should reduce connection latency

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
      // GIVEN: DNS prefetch performance benefit
      // WHEN: domains are resolved before actual requests
      // THEN: it should improve perceived page load speed

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
