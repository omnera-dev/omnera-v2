/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Structured Data
 *
 * Source: specs/app/pages/meta/structured-data/structured-data.schema.json
 * Spec Count: 10
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (10 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Structured Data', () => {
  test.fixme(
    'APP-PAGES-STRUCTUREDDATA-001: should include Organization structured data',
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
              schema: {
                organization: {
                  '@context': 'https://schema.org',
                  '@type': 'Organization',
                  name: 'My Company',
                  url: 'https://example.com',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('"@type":"Organization"')
    }
  )

  test.fixme(
    'APP-PAGES-STRUCTUREDDATA-002: should include Person structured data',
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
              schema: {
                person: {
                  '@context': 'https://schema.org',
                  '@type': 'Person',
                  name: 'John Doe',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('"@type":"Person"')
    }
  )

  test.fixme(
    'APP-PAGES-STRUCTUREDDATA-003: should include LocalBusiness structured data',
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
              schema: {
                localBusiness: {
                  '@context': 'https://schema.org',
                  '@type': 'LocalBusiness',
                  name: 'Coffee Shop',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('"@type":"LocalBusiness"')
    }
  )

  test.fixme(
    'APP-PAGES-STRUCTUREDDATA-004: should include Product structured data',
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
              schema: {
                product: {
                  '@context': 'https://schema.org',
                  '@type': 'Product',
                  name: 'Widget',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('"@type":"Product"')
    }
  )

  test.fixme(
    'APP-PAGES-STRUCTUREDDATA-005: should include Article structured data',
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
              schema: {
                article: {
                  '@context': 'https://schema.org',
                  '@type': 'Article',
                  headline: 'Amazing Article Title',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('"@type":"Article"')
    }
  )

  test.fixme(
    'APP-PAGES-STRUCTUREDDATA-006: should include BreadcrumbList structured data',
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
              schema: {
                breadcrumb: {
                  '@context': 'https://schema.org',
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: 'Home',
                      item: 'https://example.com',
                    },
                  ],
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('"@type":"BreadcrumbList"')
    }
  )

  test.fixme(
    'APP-PAGES-STRUCTUREDDATA-007: should include FAQPage structured data',
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
              schema: {
                faqPage: {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: [],
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('"@type":"FAQPage"')
    }
  )

  test.fixme(
    'APP-PAGES-STRUCTUREDDATA-008: should include EducationEvent structured data',
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
              schema: {
                educationEvent: {
                  '@type': 'EducationEvent',
                  name: 'Workshop',
                  startDate: '2025-06-01T09:00:00Z',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('"@type":"EducationEvent"')
    }
  )

  test.fixme(
    'APP-PAGES-STRUCTUREDDATA-009: should support multiple Schema.org types on same page',
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
              schema: {
                organization: {
                  '@context': 'https://schema.org',
                  '@type': 'Organization',
                  name: 'My Company',
                  url: 'https://example.com',
                },
                faqPage: {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: [],
                },
                breadcrumb: {
                  '@context': 'https://schema.org',
                  '@type': 'BreadcrumbList',
                  itemListElement: [],
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptCount = await page.locator('script[type="application/ld+json"]').count()
      expect(scriptCount).toBeGreaterThanOrEqual(3)
    }
  )

  test.fixme(
    'APP-PAGES-STRUCTUREDDATA-010: should enable rich search results and enhanced SERP display',
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
              schema: {
                organization: {
                  '@context': 'https://schema.org',
                  '@type': 'Organization',
                  name: 'Tech Corp',
                  url: 'https://example.com',
                  logo: 'https://example.com/logo.png',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('script[type="application/ld+json"]')).toBeVisible()
    }
  )

  test.fixme(
    'user can complete full structured data workflow',
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
              schema: {
                organization: {
                  '@context': 'https://schema.org',
                  '@type': 'Organization',
                  name: 'Complete Test Org',
                  url: 'https://example.com',
                },
                breadcrumb: {
                  '@context': 'https://schema.org',
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: 'Home',
                    },
                  ],
                },
              },
            },
            sections: [],
          },
        ],
      })

      await page.goto('/')

      // Verify structured data scripts exist
      const scripts = await page.locator('script[type="application/ld+json"]').all()
      expect(scripts.length).toBeGreaterThan(0)

      // Verify content includes Schema.org types
      const allContent = await Promise.all(scripts.map((script) => script.textContent()))
      const combinedContent = allContent.join(' ')
      expect(combinedContent).toContain('schema.org')
    }
  )
})
