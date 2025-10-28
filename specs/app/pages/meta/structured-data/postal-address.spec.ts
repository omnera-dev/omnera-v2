/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures.ts'

/**
 * E2E Tests for Postal Address
 *
 * Source: specs/app/pages/meta/structured-data/postal-address.schema.json
 * Spec Count: 10
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (10 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Postal Address', () => {
  test.fixme(
    'APP-PAGES-POSTALADDRESS-001: should validate minimal PostalAddress structured data',
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
                  name: 'Company',
                  address: { '@type': 'PostalAddress' },
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('"@type":"PostalAddress"')
    }
  )

  test.fixme(
    'APP-PAGES-POSTALADDRESS-002: should provide street address',
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
                  name: 'Company',
                  address: { '@type': 'PostalAddress', streetAddress: '123 Main St' },
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('123 Main St')
    }
  )

  test.fixme(
    'APP-PAGES-POSTALADDRESS-003: should provide city or locality name',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      const localities = ['Strasbourg', 'Paris', 'New York', 'Tokyo']
      for (const locality of localities) {
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
                    name: 'Company',
                    address: { '@type': 'PostalAddress', addressLocality: locality },
                  },
                },
              },
              sections: [],
            },
          ],
        })
        await page.goto('/')
        const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
        expect(scriptContent).toContain(locality)
      }
    }
  )

  test.fixme(
    'APP-PAGES-POSTALADDRESS-004: should provide state or region name',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      const regions = ['Grand Est', 'California', 'New York', 'Tokyo']
      for (const region of regions) {
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
                    name: 'Company',
                    address: { '@type': 'PostalAddress', addressRegion: region },
                  },
                },
              },
              sections: [],
            },
          ],
        })
        await page.goto('/')
        const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
        expect(scriptContent).toContain(region)
      }
    }
  )

  test.fixme(
    'APP-PAGES-POSTALADDRESS-005: should provide postal or ZIP code',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      const postalCodes = ['67000', '94105', '10001', '75001']
      for (const postalCode of postalCodes) {
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
                    name: 'Company',
                    address: { '@type': 'PostalAddress', postalCode },
                  },
                },
              },
              sections: [],
            },
          ],
        })
        await page.goto('/')
        const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
        expect(scriptContent).toContain(postalCode)
      }
    }
  )

  test.fixme(
    'APP-PAGES-POSTALADDRESS-006: should provide country code',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      const countryCodes = ['FR', 'US', 'GB', 'DE']
      for (const country of countryCodes) {
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
                    name: 'Company',
                    address: { '@type': 'PostalAddress', addressCountry: country },
                  },
                },
              },
              sections: [],
            },
          ],
        })
        await page.goto('/')
        const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
        expect(scriptContent).toContain(country)
      }
    }
  )

  test.fixme(
    'APP-PAGES-POSTALADDRESS-007: should provide full mailing address',
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
                  name: 'Company',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '123 Main St',
                    addressLocality: 'Strasbourg',
                    addressRegion: 'Grand Est',
                    postalCode: '67000',
                    addressCountry: 'FR',
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
      expect(scriptContent).toContain('123 Main St')
      expect(scriptContent).toContain('Strasbourg')
      expect(scriptContent).toContain('Grand Est')
      expect(scriptContent).toContain('67000')
      expect(scriptContent).toContain('FR')
    }
  )

  test.fixme(
    "APP-PAGES-POSTALADDRESS-008: should provide organization's physical address",
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
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '456 Innovation Dr',
                    addressLocality: 'San Francisco',
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
      expect(scriptContent).toContain('456 Innovation Dr')
      expect(scriptContent).toContain('San Francisco')
    }
  )

  test.fixme(
    'APP-PAGES-POSTALADDRESS-009: should enable local business map display in search results',
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
                  name: 'Local Shop',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '789 Commerce St',
                    addressLocality: 'Chicago',
                    addressRegion: 'IL',
                    postalCode: '60601',
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
      expect(scriptContent).toContain('789 Commerce St')
      expect(scriptContent).toContain('Chicago')
    }
  )

  test.fixme(
    'APP-PAGES-POSTALADDRESS-010: should improve local search ranking and map visibility',
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
                  name: 'SEO Optimized Business',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '321 Market St',
                    addressLocality: 'Boston',
                    addressRegion: 'MA',
                    postalCode: '02101',
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
      await expect(page.locator('script[type="application/ld+json"]')).toBeVisible()
    }
  )

  test.fixme(
    'user can complete full Postal Address workflow',
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
                  name: 'Complete Address Test',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '100 Business Blvd',
                    addressLocality: 'Strasbourg',
                    addressRegion: 'Grand Est',
                    postalCode: '67000',
                    addressCountry: 'FR',
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
      expect(scriptContent).toContain('"@type":"PostalAddress"')
      expect(scriptContent).toContain('100 Business Blvd')
      expect(scriptContent).toContain('Strasbourg')
      expect(scriptContent).toContain('FR')
    }
  )
})
