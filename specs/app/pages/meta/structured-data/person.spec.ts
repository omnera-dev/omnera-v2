/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures.ts'

/**
 * E2E Tests for Person Schema
 *
 * Source: specs/app/pages/meta/structured-data/person.schema.json
 * Spec Count: 12
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (12 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Person Schema', () => {
  test.fixme(
    'APP-PAGES-PERSON-001: should validate minimal Person structured data',
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
                person: { '@context': 'https://schema.org', '@type': 'Person', name: 'John Doe' },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('"@type":"Person"')
      expect(scriptContent).toContain('John Doe')
    }
  )

  test.fixme(
    "APP-PAGES-PERSON-002: should provide person's full name",
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
                person: { '@context': 'https://schema.org', '@type': 'Person', name: 'John Doe' },
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
    'APP-PAGES-PERSON-003: should provide structured first and last names',
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
                  givenName: 'John',
                  familyName: 'Doe',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('givenName')
      expect(scriptContent).toContain('John')
      expect(scriptContent).toContain('familyName')
      expect(scriptContent).toContain('Doe')
    }
  )

  test.fixme(
    'APP-PAGES-PERSON-004: should provide person contact information',
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
                  email: 'john@example.com',
                  telephone: '+1-555-123-4567',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('john@example.com')
      expect(scriptContent).toContain('+1-555-123-4567')
    }
  )

  test.fixme(
    "APP-PAGES-PERSON-005: should link to person's web presence",
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
                  url: 'https://johndoe.com',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('https://johndoe.com')
    }
  )

  test.fixme(
    'APP-PAGES-PERSON-006: should provide visual representation',
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
                  image: 'https://example.com/john-photo.jpg',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('john-photo.jpg')
    }
  )

  test.fixme(
    "APP-PAGES-PERSON-007: should indicate person's professional role",
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      const jobTitles = ['CEO', 'Software Engineer', 'Product Manager', 'Designer']
      for (const jobTitle of jobTitles) {
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
                    jobTitle,
                  },
                },
              },
              sections: [],
            },
          ],
        })
        await page.goto('/')
        const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
        expect(scriptContent).toContain(jobTitle)
      }
    }
  )

  test.fixme(
    'APP-PAGES-PERSON-008: should link person to their employer',
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
                  worksFor: { '@type': 'Organization', name: 'Tech Corp' },
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
      expect(scriptContent).toContain('Tech Corp')
    }
  )

  test.fixme(
    'APP-PAGES-PERSON-009: should link person to their social profiles',
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
                  sameAs: [
                    'https://twitter.com/johndoe',
                    'https://linkedin.com/in/johndoe',
                    'https://github.com/johndoe',
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
      expect(scriptContent).toContain('twitter.com/johndoe')
      expect(scriptContent).toContain('linkedin.com/in/johndoe')
      expect(scriptContent).toContain('github.com/johndoe')
    }
  )

  test.fixme(
    'APP-PAGES-PERSON-010: should include PostalAddress structured data',
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
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'New York',
                    addressRegion: 'NY',
                    addressCountry: 'US',
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
      expect(scriptContent).toContain('PostalAddress')
      expect(scriptContent).toContain('New York')
    }
  )

  test.fixme(
    'APP-PAGES-PERSON-011: should attribute content to specific author',
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
                  name: 'Jane Author',
                  jobTitle: 'Writer',
                  url: 'https://janeauthor.com',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('Jane Author')
      expect(scriptContent).toContain('Writer')
    }
  )

  test.fixme(
    'APP-PAGES-PERSON-012: should enable Google Knowledge Graph panel for notable persons',
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
                  name: 'Notable Person',
                  jobTitle: 'Industry Leader',
                  url: 'https://notableperson.com',
                  image: 'https://example.com/photo.jpg',
                  sameAs: ['https://twitter.com/notable', 'https://linkedin.com/in/notable'],
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
    'user can complete full Person workflow',
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
                person: {
                  '@context': 'https://schema.org',
                  '@type': 'Person',
                  name: 'Complete Person Profile',
                  givenName: 'John',
                  familyName: 'Smith',
                  email: 'john.smith@example.com',
                  telephone: '+1-555-987-6543',
                  url: 'https://johnsmith.com',
                  image: 'https://example.com/john.jpg',
                  jobTitle: 'Senior Software Engineer',
                  worksFor: { '@type': 'Organization', name: 'Tech Innovations Inc' },
                  sameAs: [
                    'https://twitter.com/johnsmith',
                    'https://linkedin.com/in/johnsmith',
                    'https://github.com/johnsmith',
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
      expect(scriptContent).toContain('"@type":"Person"')
      expect(scriptContent).toContain('Complete Person Profile')
      expect(scriptContent).toContain('Tech Innovations Inc')
    }
  )
})
