/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures.ts'

/**
 * E2E Tests for FAQ Page Schema
 *
 * Source: specs/app/pages/meta/structured-data/faq-page.schema.json
 * Spec Count: 10
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (10 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('FAQ Page Schema', () => {
  test.fixme(
    'APP-PAGES-FAQPAGE-001: should validate minimal FAQPage structured data',
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
                faqPage: { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] },
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
    'APP-PAGES-FAQPAGE-002: should contain list of Q&A pairs',
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
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'What is the refund policy?',
                      acceptedAnswer: { '@type': 'Answer', text: 'We offer 30-day returns' },
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
      expect(scriptContent).toContain('mainEntity')
    }
  )

  test.fixme(
    'APP-PAGES-FAQPAGE-003: should define question structure',
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
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'What is the refund policy?',
                      acceptedAnswer: { '@type': 'Answer', text: 'We offer 30-day returns' },
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
      expect(scriptContent).toContain('"@type":"Question"')
      expect(scriptContent).toContain('name')
      expect(scriptContent).toContain('acceptedAnswer')
    }
  )

  test.fixme(
    'APP-PAGES-FAQPAGE-004: should provide question text',
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
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'What is the refund policy?',
                      acceptedAnswer: { '@type': 'Answer', text: 'Answer text' },
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
      expect(scriptContent).toContain('What is the refund policy?')
    }
  )

  test.fixme(
    'APP-PAGES-FAQPAGE-005: should provide answer structure',
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
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'Test question?',
                      acceptedAnswer: { '@type': 'Answer', text: 'Test answer' },
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
      expect(scriptContent).toContain('"@type":"Answer"')
      expect(scriptContent).toContain('text')
    }
  )

  test.fixme(
    'APP-PAGES-FAQPAGE-006: should provide answer content',
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
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'Question?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'We offer a 30-day money-back guarantee',
                      },
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
      expect(scriptContent).toContain('30-day money-back guarantee')
    }
  )

  test.fixme(
    'APP-PAGES-FAQPAGE-007: should support comprehensive FAQ section',
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
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'Q1?',
                      acceptedAnswer: { '@type': 'Answer', text: 'A1' },
                    },
                    {
                      '@type': 'Question',
                      name: 'Q2?',
                      acceptedAnswer: { '@type': 'Answer', text: 'A2' },
                    },
                    {
                      '@type': 'Question',
                      name: 'Q3?',
                      acceptedAnswer: { '@type': 'Answer', text: 'A3' },
                    },
                    {
                      '@type': 'Question',
                      name: 'Q4?',
                      acceptedAnswer: { '@type': 'Answer', text: 'A4' },
                    },
                    {
                      '@type': 'Question',
                      name: 'Q5?',
                      acceptedAnswer: { '@type': 'Answer', text: 'A5' },
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
      const questionCount = (scriptContent?.match(/"@type":"Question"/g) || []).length
      expect(questionCount).toBeGreaterThanOrEqual(5)
    }
  )

  test.fixme(
    'APP-PAGES-FAQPAGE-008: should display expandable Q&A in Google search results',
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
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'How do I return an item?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Visit our returns page and follow the instructions',
                      },
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
    'APP-PAGES-FAQPAGE-009: should reduce support load by surfacing answers in search',
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
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'Common support question?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Detailed answer to reduce support tickets',
                      },
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
    'APP-PAGES-FAQPAGE-010: should increase click-through rate from search results',
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
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'Why choose us?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'We offer the best service in the industry',
                      },
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
      expect(scriptContent).toContain('FAQPage')
    }
  )

  test.fixme(
    'user can complete full FAQ Page workflow',
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
                faqPage: {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'What is the refund policy?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'We offer a 30-day money-back guarantee on all purchases',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'How long is shipping?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Standard shipping takes 5-7 business days',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'Do you ship internationally?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes, we ship to over 100 countries worldwide',
                      },
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
      expect(scriptContent).toContain('"@type":"FAQPage"')
      expect(scriptContent).toContain('refund policy')
      expect(scriptContent).toContain('shipping')
    }
  )
})
