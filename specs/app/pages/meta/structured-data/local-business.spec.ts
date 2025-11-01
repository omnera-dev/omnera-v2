/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Local Business Schema
 *
 * Source: specs/app/pages/meta/structured-data/local-business.schema.json
 * Spec Count: 14
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (14 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Local Business Schema', () => {
  test.fixme(
    'APP-PAGES-LOCALBUSINESS-001: should validate minimal LocalBusiness structured data',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: LocalBusiness with required properties
      // WHEN: @context is 'https://schema.org', @type is 'LocalBusiness', and name is provided
      // THEN: it should validate minimal LocalBusiness structured data

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
      expect(scriptContent).toContain('Coffee Shop')
    }
  )

  test.fixme(
    'APP-PAGES-LOCALBUSINESS-002: should provide business identity',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: LocalBusiness with name and description
      // WHEN: name and description describe the business
      // THEN: it should provide business identity

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
                  name: 'Best Coffee Shop',
                  description: 'Artisanal coffee and pastries',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('Best Coffee Shop')
      expect(scriptContent).toContain('Artisanal coffee and pastries')
    }
  )

  test.fixme(
    'APP-PAGES-LOCALBUSINESS-003: should provide business branding',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: LocalBusiness with url and logo
      // WHEN: url is website and logo is business logo URL
      // THEN: it should provide business branding

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
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('https://example.com')
      expect(scriptContent).toContain('logo.png')
    }
  )

  test.fixme(
    'APP-PAGES-LOCALBUSINESS-004: should support single or multiple business images',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: LocalBusiness with image
      // WHEN: image is string URL or array of URLs
      // THEN: it should support single or multiple business images

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
                  name: 'Shop',
                  image: ['https://example.com/interior.jpg', 'https://example.com/exterior.jpg'],
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('interior.jpg')
      expect(scriptContent).toContain('exterior.jpg')
    }
  )

  test.fixme(
    'APP-PAGES-LOCALBUSINESS-005: should provide business contact information',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: LocalBusiness with contact info
      // WHEN: email and telephone are provided
      // THEN: it should provide business contact information

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
                  name: 'Shop',
                  email: 'contact@example.com',
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
      expect(scriptContent).toContain('contact@example.com')
      expect(scriptContent).toContain('+1-555-123-4567')
    }
  )

  test.fixme(
    'APP-PAGES-LOCALBUSINESS-006: should indicate business price level',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: LocalBusiness with priceRange
      // WHEN: priceRange is '$', '$$', '$$$', or '$$$$'
      // THEN: it should indicate business price level

      const priceRanges = ['$', '$$', '$$$', '$$$$']
      for (const priceRange of priceRanges) {
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
                    name: 'Restaurant',
                    priceRange,
                  },
                },
              },
              sections: [],
            },
          ],
        })
        await page.goto('/')
        const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
        expect(scriptContent).toContain(priceRange)
      }
    }
  )

  test.fixme(
    'APP-PAGES-LOCALBUSINESS-007: should include physical address for maps',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: LocalBusiness with address
      // WHEN: address references postal-address.schema.json
      // THEN: it should include physical address for maps

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
                  name: 'Shop',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '123 Main St',
                    addressLocality: 'City',
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
      expect(scriptContent).toContain('123 Main St')
    }
  )

  test.fixme(
    'APP-PAGES-LOCALBUSINESS-008: should provide precise map location',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: LocalBusiness with geo coordinates
      // WHEN: geo is object with @type 'GeoCoordinates', latitude, and longitude
      // THEN: it should provide precise map location

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
                  name: 'Shop',
                  geo: { '@type': 'GeoCoordinates', latitude: '48.5734', longitude: '7.7521' },
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('GeoCoordinates')
      expect(scriptContent).toContain('48.5734')
      expect(scriptContent).toContain('7.7521')
    }
  )

  test.fixme(
    'APP-PAGES-LOCALBUSINESS-009: should link business to social profiles',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: LocalBusiness with social profiles
      // WHEN: sameAs is array of social media URLs
      // THEN: it should link business to social profiles

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
                  name: 'Shop',
                  sameAs: [
                    'https://facebook.com/shop',
                    'https://twitter.com/shop',
                    'https://instagram.com/shop',
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
      expect(scriptContent).toContain('facebook.com/shop')
      expect(scriptContent).toContain('twitter.com/shop')
    }
  )

  test.fixme(
    'APP-PAGES-LOCALBUSINESS-010: should provide business hours for each day',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: LocalBusiness with opening hours
      // WHEN: openingHoursSpecification is array with @type, dayOfWeek, opens, closes
      // THEN: it should provide business hours for each day

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
                  name: 'Shop',
                  openingHoursSpecification: [
                    {
                      '@type': 'OpeningHoursSpecification',
                      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                      opens: '09:00',
                      closes: '18:00',
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
      expect(scriptContent).toContain('OpeningHoursSpecification')
      expect(scriptContent).toContain('09:00')
      expect(scriptContent).toContain('18:00')
    }
  )

  test.fixme(
    'APP-PAGES-LOCALBUSINESS-011: should specify which days hours apply to',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: LocalBusiness with dayOfWeek enum
      // WHEN: dayOfWeek is array of 'Monday', 'Tuesday', etc.
      // THEN: it should specify which days hours apply to

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
                  name: 'Shop',
                  openingHoursSpecification: [
                    {
                      '@type': 'OpeningHoursSpecification',
                      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday'],
                      opens: '09:00',
                      closes: '17:00',
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
      expect(scriptContent).toContain('Monday')
      expect(scriptContent).toContain('Tuesday')
      expect(scriptContent).toContain('Wednesday')
    }
  )

  test.fixme(
    'APP-PAGES-LOCALBUSINESS-012: should specify daily operating hours',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: LocalBusiness with opens/closes times
      // WHEN: opens is '09:00' and closes is '18:00' (HH:MM format)
      // THEN: it should specify daily operating hours

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
                  name: 'Shop',
                  openingHoursSpecification: [
                    {
                      '@type': 'OpeningHoursSpecification',
                      dayOfWeek: ['Monday'],
                      opens: '09:00',
                      closes: '18:00',
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
      expect(scriptContent).toMatch(/"opens":\s*"09:00"/)
      expect(scriptContent).toMatch(/"closes":\s*"18:00"/)
    }
  )

  test.fixme(
    'APP-PAGES-LOCALBUSINESS-013: should enable Google Business Profile rich results',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: LocalBusiness for local SEO
      // WHEN: complete business data with address, geo, and hours is provided
      // THEN: it should enable Google Business Profile rich results

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
                  name: 'Complete Business',
                  address: { '@type': 'PostalAddress', streetAddress: '123 Main St' },
                  geo: { '@type': 'GeoCoordinates', latitude: '48.5734', longitude: '7.7521' },
                  openingHoursSpecification: [
                    {
                      '@type': 'OpeningHoursSpecification',
                      dayOfWeek: ['Monday'],
                      opens: '09:00',
                      closes: '17:00',
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
    'APP-PAGES-LOCALBUSINESS-014: should enable map pin and directions in search results',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: LocalBusiness for map display
      // WHEN: address and geo coordinates are provided
      // THEN: it should enable map pin and directions in search results

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
                  name: 'Mappable Business',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '456 Oak Ave',
                    addressLocality: 'Springfield',
                  },
                  geo: { '@type': 'GeoCoordinates', latitude: '39.7817', longitude: '-89.6501' },
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('GeoCoordinates')
      expect(scriptContent).toContain('PostalAddress')
    }
  )

  test.fixme(
    'user can complete full Local Business workflow',
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
                localBusiness: {
                  '@context': 'https://schema.org',
                  '@type': 'LocalBusiness',
                  name: 'Complete Coffee Shop',
                  description: 'Best coffee in town',
                  url: 'https://example.com',
                  telephone: '+1-555-123-4567',
                  priceRange: '$$',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '123 Main St',
                    addressLocality: 'Strasbourg',
                    postalCode: '67000',
                    addressCountry: 'FR',
                  },
                  geo: { '@type': 'GeoCoordinates', latitude: '48.5734', longitude: '7.7521' },
                  openingHoursSpecification: [
                    {
                      '@type': 'OpeningHoursSpecification',
                      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                      opens: '07:00',
                      closes: '19:00',
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
      expect(scriptContent).toContain('"@type":"LocalBusiness"')
      expect(scriptContent).toContain('Complete Coffee Shop')
      expect(scriptContent).toContain('Strasbourg')
    }
  )
})
