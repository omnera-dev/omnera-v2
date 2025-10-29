/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Article Schema
 *
 * Source: specs/app/pages/meta/structured-data/article.schema.json
 * Spec Count: 14
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (14 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Article Schema', () => {
  test.fixme(
    'APP-PAGES-ARTICLE-001: should validate minimal Article structured data',
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
      expect(scriptContent).toContain('Amazing Article Title')
    }
  )

  test.fixme(
    'APP-PAGES-ARTICLE-002: should categorize content type',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      const types = ['Article', 'NewsArticle', 'BlogPosting']
      for (const type of types) {
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
                    '@type': type,
                    headline: 'Test Article',
                  },
                },
              },
              sections: [],
            },
          ],
        })
        await page.goto('/')
        const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
        expect(scriptContent).toContain(`"@type":"${type}"`)
      }
    }
  )

  test.fixme(
    'APP-PAGES-ARTICLE-003: should provide article title for rich results',
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
                  headline: '10 Tips for Better Productivity',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('10 Tips for Better Productivity')
    }
  )

  test.fixme(
    'APP-PAGES-ARTICLE-004: should provide article summary',
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
                  headline: 'Article Title',
                  description:
                    'This article explores proven strategies for improving daily productivity',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('proven strategies for improving daily productivity')
    }
  )

  test.fixme(
    'APP-PAGES-ARTICLE-005: should support single or multiple article images',
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
                  headline: 'Test',
                  image: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('image1.jpg')
      expect(scriptContent).toContain('image2.jpg')
    }
  )

  test.fixme(
    'APP-PAGES-ARTICLE-006: should provide simple author name',
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
                  headline: 'Test',
                  author: 'John Doe',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('John Doe')
    }
  )

  test.fixme(
    'APP-PAGES-ARTICLE-007: should provide structured author information',
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
                  headline: 'Test',
                  author: {
                    '@type': 'Person',
                    name: 'Jane Smith',
                    url: 'https://example.com/jane',
                  },
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
      expect(scriptContent).toContain('Jane Smith')
    }
  )

  test.fixme(
    'APP-PAGES-ARTICLE-008: should attribute content to organization',
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
                  headline: 'Test',
                  author: { '@type': 'Organization', name: 'Tech Blog' },
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
      expect(scriptContent).toContain('Tech Blog')
    }
  )

  test.fixme(
    'APP-PAGES-ARTICLE-009: should provide publication date',
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
                  headline: 'Test',
                  datePublished: '2025-01-15T09:00:00Z',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('2025-01-15T09:00:00Z')
    }
  )

  test.fixme(
    'APP-PAGES-ARTICLE-010: should indicate last update date',
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
                  headline: 'Test',
                  datePublished: '2025-01-15T09:00:00Z',
                  dateModified: '2025-01-20T14:30:00Z',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('2025-01-20T14:30:00Z')
    }
  )

  test.fixme(
    'APP-PAGES-ARTICLE-011: should identify publishing organization',
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
                  headline: 'Test',
                  publisher: {
                    '@type': 'Organization',
                    name: 'Tech Media',
                    logo: { '@type': 'ImageObject', url: 'https://example.com/logo.png' },
                  },
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('Tech Media')
      expect(scriptContent).toContain('logo.png')
    }
  )

  test.fixme(
    "APP-PAGES-ARTICLE-012: should specify article's primary page URL",
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
                  headline: 'Test',
                  mainEntityOfPage: 'https://example.com/articles/productivity-tips',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('https://example.com/articles/productivity-tips')
    }
  )

  test.fixme(
    'APP-PAGES-ARTICLE-013: should enable Google News and article rich results',
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
                  '@type': 'NewsArticle',
                  headline: 'Breaking News Story',
                  author: { '@type': 'Person', name: 'Reporter Name' },
                  datePublished: '2025-01-15T09:00:00Z',
                  publisher: {
                    '@type': 'Organization',
                    name: 'News Corp',
                    logo: { '@type': 'ImageObject', url: 'https://example.com/logo.png' },
                  },
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
    'APP-PAGES-ARTICLE-014: should properly attribute content to authors and publishers',
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
                  '@type': 'BlogPosting',
                  headline: 'Complete Blog Post',
                  description: 'Comprehensive guide',
                  author: { '@type': 'Person', name: 'John Doe', url: 'https://example.com/john' },
                  datePublished: '2025-01-15T09:00:00Z',
                  publisher: { '@type': 'Organization', name: 'Blog Network' },
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('John Doe')
      expect(scriptContent).toContain('Blog Network')
    }
  )

  test.fixme(
    'user can complete full Article workflow',
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
                article: {
                  '@context': 'https://schema.org',
                  '@type': 'Article',
                  headline: 'Complete Article Test',
                  description: 'Testing all article features',
                  image: 'https://example.com/article-image.jpg',
                  author: { '@type': 'Person', name: 'Test Author' },
                  datePublished: '2025-01-15T09:00:00Z',
                  dateModified: '2025-01-20T14:30:00Z',
                  publisher: {
                    '@type': 'Organization',
                    name: 'Test Publisher',
                    logo: { '@type': 'ImageObject', url: 'https://example.com/logo.png' },
                  },
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
      expect(scriptContent).toContain('Complete Article Test')
      expect(scriptContent).toContain('Test Author')
      expect(scriptContent).toContain('Test Publisher')
    }
  )
})
