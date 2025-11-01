/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Education Event Schema
 *
 * Source: specs/app/pages/meta/structured-data/education-event.schema.json
 * Spec Count: 14
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (14 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Education Event Schema', () => {
  test.fixme(
    'APP-PAGES-EDUCATIONEVENT-001: should validate minimal EducationEvent structured data',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: EducationEvent with required properties
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
                  name: 'React Workshop',
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
    'APP-PAGES-EDUCATIONEVENT-002: should provide event identity',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: EducationEvent with name and description
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
                  name: 'Advanced TypeScript Course',
                  description: 'Learn advanced TypeScript patterns',
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
      expect(scriptContent).toContain('Advanced TypeScript Course')
      expect(scriptContent).toContain('Learn advanced TypeScript patterns')
    }
  )

  test.fixme(
    'APP-PAGES-EDUCATIONEVENT-003: should specify when event begins',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: EducationEvent with startDate
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
                  startDate: '2025-06-15T14:00:00Z',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('2025-06-15T14:00:00Z')
    }
  )

  test.fixme(
    'APP-PAGES-EDUCATIONEVENT-004: should specify when event ends',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: EducationEvent with endDate
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
                  startDate: '2025-06-15T09:00:00Z',
                  endDate: '2025-06-15T17:00:00Z',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('2025-06-15T17:00:00Z')
    }
  )

  test.fixme(
    'APP-PAGES-EDUCATIONEVENT-005: should specify whether event is in-person, online, or hybrid',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: EducationEvent with eventAttendanceMode
      const modes = [
        'https://schema.org/OfflineEventAttendanceMode',
        'https://schema.org/OnlineEventAttendanceMode',
        'https://schema.org/MixedEventAttendanceMode',
      ]
      for (const mode of modes) {
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
                    eventAttendanceMode: mode,
                  },
                },
              },
              sections: [],
            },
          ],
        })
        await page.goto('/')
        const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
        expect(scriptContent).toContain(mode)
      }
    }
  )

  test.fixme(
    'APP-PAGES-EDUCATIONEVENT-006: should communicate event status',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: EducationEvent with eventStatus
      const statuses = [
        'https://schema.org/EventScheduled',
        'https://schema.org/EventCancelled',
        'https://schema.org/EventPostponed',
        'https://schema.org/EventRescheduled',
      ]
      for (const status of statuses) {
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
                    eventStatus: status,
                  },
                },
              },
              sections: [],
            },
          ],
        })
        await page.goto('/')
        const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
        expect(scriptContent).toContain(status)
      }
    }
  )

  test.fixme(
    'APP-PAGES-EDUCATIONEVENT-007: should provide event venue information',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: EducationEvent with location
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
                  location: {
                    '@type': 'Place',
                    name: 'Convention Center',
                    address: { '@type': 'PostalAddress', streetAddress: '123 Main St' },
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
      expect(scriptContent).toContain('Place')
      expect(scriptContent).toContain('Convention Center')
    }
  )

  test.fixme(
    'APP-PAGES-EDUCATIONEVENT-008: should identify event organizer',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: EducationEvent with organizer
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
                  organizer: {
                    '@type': 'Organization',
                    name: 'Education Corp',
                    url: 'https://example.com',
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
      expect(scriptContent).toContain('Education Corp')
    }
  )

  test.fixme(
    'APP-PAGES-EDUCATIONEVENT-009: should provide ticket pricing and availability',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: EducationEvent with offers
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
                  offers: {
                    '@type': 'Offer',
                    price: '29.99',
                    priceCurrency: 'EUR',
                    availability: 'https://schema.org/InStock',
                    url: 'https://example.com/tickets',
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
      expect(scriptContent).toContain('29.99')
      expect(scriptContent).toContain('EUR')
    }
  )

  test.fixme(
    'APP-PAGES-EDUCATIONEVENT-010: should specify event ticket price',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: EducationEvent with price and priceCurrency
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
                  name: 'Free Workshop',
                  startDate: '2025-06-01T09:00:00Z',
                  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toMatch(/"price":\s*"0"/)
      expect(scriptContent).toContain('EUR')
    }
  )

  test.fixme(
    'APP-PAGES-EDUCATIONEVENT-011: should indicate ticket availability status',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: EducationEvent with availability enum
      const availabilities = [
        'https://schema.org/InStock',
        'https://schema.org/OutOfStock',
        'https://schema.org/PreOrder',
        'https://schema.org/SoldOut',
      ]
      for (const availability of availabilities) {
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
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', availability },
                  },
                },
              },
              sections: [],
            },
          ],
        })
        await page.goto('/')
        const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
        expect(scriptContent).toContain(availability)
      }
    }
  )

  test.fixme(
    'APP-PAGES-EDUCATIONEVENT-012: should specify event capacity limits',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: EducationEvent with capacity
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
                  maximumAttendeeCapacity: 50,
                  minimumAttendeeCapacity: 10,
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('50')
      expect(scriptContent).toContain('10')
    }
  )

  test.fixme(
    'APP-PAGES-EDUCATIONEVENT-013: should enable Google Events rich results',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: EducationEvent for rich results
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
                  name: 'Complete Workshop',
                  description: 'Comprehensive training',
                  startDate: '2025-06-01T09:00:00Z',
                  endDate: '2025-06-01T17:00:00Z',
                  location: { '@type': 'Place', name: 'Venue' },
                  offers: { '@type': 'Offer', price: '99', priceCurrency: 'USD' },
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
    'APP-PAGES-EDUCATIONEVENT-014: should display event in Google Search, Maps, and event discovery features',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: EducationEvent for event discovery
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
                  name: 'Public Workshop',
                  startDate: '2025-06-01T09:00:00Z',
                  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                  eventStatus: 'https://schema.org/EventScheduled',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const scriptContent = await page.locator('script[type="application/ld+json"]').textContent()
      expect(scriptContent).toContain('EducationEvent')
    }
  )

  test.fixme(
    'user can complete full Education Event workflow',
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
                educationEvent: {
                  '@type': 'EducationEvent',
                  name: 'Advanced React Workshop',
                  description: 'Learn advanced React patterns and best practices',
                  startDate: '2025-06-15T09:00:00Z',
                  endDate: '2025-06-15T17:00:00Z',
                  eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
                  eventStatus: 'https://schema.org/EventScheduled',
                  location: { '@type': 'Place', name: 'Tech Conference Center' },
                  organizer: { '@type': 'Organization', name: 'Tech Education Inc' },
                  offers: {
                    '@type': 'Offer',
                    price: '199',
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/InStock',
                    url: 'https://example.com/register',
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
      expect(scriptContent).toContain('"@type":"EducationEvent"')
      expect(scriptContent).toContain('Advanced React Workshop')
      expect(scriptContent).toContain('Tech Education Inc')
    }
  )
})
