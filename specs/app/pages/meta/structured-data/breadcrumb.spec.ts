/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures.ts'

/**
 * E2E Tests for Breadcrumb Schema
 *
 * Source: specs/app/pages/meta/structured-data/breadcrumb.schema.json
 * Spec Count: 10
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (10 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Breadcrumb Schema', () => {
  test.fixme(
    'APP-PAGES-BREADCRUMB-001: should validate minimal BreadcrumbList structured data',
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
                  itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home' }],
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
    'APP-PAGES-BREADCRUMB-002: should define navigation path',
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
                    { '@type': 'ListItem', position: 1, name: 'Home' },
                    { '@type': 'ListItem', position: 2, name: 'Products' },
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
      expect(scriptContent).toContain('itemListElement')
    }
  )

  test.fixme(
    'APP-PAGES-BREADCRUMB-003: should define breadcrumb item structure',
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
                  itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home' }],
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('"@type":"ListItem"')
      expect(scriptContent).toContain('position')
      expect(scriptContent).toContain('name')
    }
  )

  test.fixme(
    'APP-PAGES-BREADCRUMB-004: should order breadcrumb trail',
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
                    { '@type': 'ListItem', position: 1, name: 'Home' },
                    { '@type': 'ListItem', position: 2, name: 'Products' },
                    { '@type': 'ListItem', position: 3, name: 'Widget' },
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
      expect(scriptContent).toMatch(/"position":\s*1/)
      expect(scriptContent).toMatch(/"position":\s*2/)
      expect(scriptContent).toMatch(/"position":\s*3/)
    }
  )

  test.fixme(
    'APP-PAGES-BREADCRUMB-005: should provide human-readable breadcrumb label',
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
                    { '@type': 'ListItem', position: 1, name: 'Home' },
                    { '@type': 'ListItem', position: 2, name: 'Products' },
                    { '@type': 'ListItem', position: 3, name: 'Widget' },
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
      expect(scriptContent).toContain('Home')
      expect(scriptContent).toContain('Products')
      expect(scriptContent).toContain('Widget')
    }
  )

  test.fixme(
    'APP-PAGES-BREADCRUMB-006: should provide clickable breadcrumb link',
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
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com' },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Products',
                      item: 'https://example.com/products',
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
      expect(scriptContent).toContain('https://example.com/products')
    }
  )

  test.fixme(
    'APP-PAGES-BREADCRUMB-007: should represent multi-level navigation path',
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
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com' },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Products',
                      item: 'https://example.com/products',
                    },
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: 'Widgets',
                      item: 'https://example.com/products/widgets',
                    },
                    {
                      '@type': 'ListItem',
                      position: 4,
                      name: 'Blue Widget',
                      item: 'https://example.com/products/widgets/blue',
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
      const positions = (scriptContent?.match(/"position":\s*\d+/g) || []).length
      expect(positions).toBeGreaterThanOrEqual(3)
    }
  )

  test.fixme(
    'APP-PAGES-BREADCRUMB-008: should help search engines understand site architecture',
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
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com' },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Category',
                      item: 'https://example.com/category',
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
      await expect(page.locator('script[type="application/ld+json"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-BREADCRUMB-009: should display breadcrumb trail in Google search results',
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
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com' },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Products',
                      item: 'https://example.com/products',
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
      expect(scriptContent).toContain('schema.org')
    }
  )

  test.fixme(
    'APP-PAGES-BREADCRUMB-010: should improve navigation and reduce bounce rate',
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
                    { '@type': 'ListItem', position: 1, name: 'Home' },
                    { '@type': 'ListItem', position: 2, name: 'Current Page' },
                  ],
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
    'user can complete full Breadcrumb workflow',
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
                breadcrumb: {
                  '@context': 'https://schema.org',
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com' },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Products',
                      item: 'https://example.com/products',
                    },
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: 'Widget',
                      item: 'https://example.com/products/widget',
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
      expect(scriptContent).toContain('Home')
      expect(scriptContent).toContain('Products')
      expect(scriptContent).toContain('Widget')
    }
  )
})
