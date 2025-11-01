/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Twitter Card Metadata
 *
 * Source: specs/app/pages/meta/social/twitter-card.schema.json
 * Spec Count: 12
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (12 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Twitter Card Metadata', () => {
  test.fixme(
    'APP-PAGES-TWITTER-001: should validate minimal Twitter Card configuration',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Twitter Card with required card type
      // WHEN: card property specifies card type
      // THEN: it should validate minimal Twitter Card configuration

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
              twitter: { card: 'summary_large_image' },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image'
      )
    }
  )

  test.fixme(
    'APP-PAGES-TWITTER-002: should display small square image card',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Twitter Card with type 'summary'
      // WHEN: card is 'summary' for default card
      // THEN: it should display small square image card

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
              twitter: {
                card: 'summary',
                title: 'Quick Update',
                description: 'Brief news or update',
                image: 'https://example.com/image-144x144.jpg',
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary')
    }
  )

  test.fixme(
    'APP-PAGES-TWITTER-003: should display large rectangular image card',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Twitter Card with type 'summary_large_image'
      // WHEN: card is 'summary_large_image' for featured content
      // THEN: it should display large rectangular image card

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
              twitter: {
                card: 'summary_large_image',
                title: 'Major Product Launch',
                description: 'Introducing our revolutionary new product',
                image: 'https://example.com/twitter-image-800x418.jpg',
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image'
      )
    }
  )

  test.fixme(
    'APP-PAGES-TWITTER-004: should promote mobile app downloads',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Twitter Card with type 'app'
      // WHEN: card is 'app' with appName and appId
      // THEN: it should promote mobile app downloads

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
              twitter: {
                card: 'app',
                title: 'Download Our Mobile App',
                description: 'Get the best experience on mobile',
                image: 'https://example.com/app-icon.jpg',
                appName: { iPhone: 'MyApp', iPad: 'MyApp for iPad', googlePlay: 'MyApp' },
                appId: { iPhone: '123456789', iPad: '123456789', googlePlay: 'com.example.myapp' },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'app')
    }
  )

  test.fixme(
    'APP-PAGES-TWITTER-005: should embed video/audio player',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Twitter Card with type 'player'
      // WHEN: card is 'player' with player URL and dimensions
      // THEN: it should embed video/audio player

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
              twitter: {
                card: 'player',
                title: 'Product Demo Video',
                description: 'Watch our product in action',
                image: 'https://example.com/video-thumbnail.jpg',
                player: 'https://example.com/player.html',
                playerWidth: 1280,
                playerHeight: 720,
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'player')
      await expect(page.locator('meta[name="twitter:player"]')).toHaveAttribute(
        'content',
        'https://example.com/player.html'
      )
    }
  )

  test.fixme(
    'APP-PAGES-TWITTER-006: should enforce title length for Twitter display',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Twitter Card title with maxLength
      // WHEN: title has 70 characters max
      // THEN: it should enforce title length for Twitter display

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
              twitter: {
                card: 'summary_large_image',
                title: 'Transform Your Business with AI-Powered Analytics Platform',
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content')
      expect(twitterTitle?.length).toBeLessThanOrEqual(70)
    }
  )

  test.fixme(
    'APP-PAGES-TWITTER-007: should enforce description length for Twitter cards',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Twitter Card description with maxLength
      // WHEN: description has 200 characters max
      // THEN: it should enforce description length for Twitter cards

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
              twitter: {
                card: 'summary_large_image',
                description:
                  'Discover how our AI-powered platform helps businesses make data-driven decisions. Get real-time insights and automated reporting. Start your free trial today.',
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const twitterDesc = await page
        .locator('meta[name="twitter:description"]')
        .getAttribute('content')
      expect(twitterDesc?.length).toBeLessThanOrEqual(200)
    }
  )

  test.fixme(
    'APP-PAGES-TWITTER-008: should provide properly sized social image',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Twitter Card image with size requirements
      // WHEN: image is min 144x144px for summary or 300x157px for large
      // THEN: it should provide properly sized social image

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
              twitter: {
                card: 'summary_large_image',
                title: 'Product Launch',
                description: 'Revolutionary product',
                image: 'https://example.com/twitter-800x418.jpg',
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        'content',
        'https://example.com/twitter-800x418.jpg'
      )
    }
  )

  test.fixme(
    'APP-PAGES-TWITTER-009: should attribute content to website Twitter account',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Twitter Card with site @username
      // WHEN: site is '@mysite' for website attribution
      // THEN: it should attribute content to website Twitter account

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
              twitter: {
                card: 'summary_large_image',
                title: '10 Ways to Boost Productivity',
                description: 'Proven strategies from experts',
                image: 'https://example.com/image.jpg',
                site: '@acmeblog',
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const site = await page.locator('meta[name="twitter:site"]').getAttribute('content')
      expect(site).toMatch(/^@[A-Za-z0-9_]+$/)
    }
  )

  test.fixme(
    'APP-PAGES-TWITTER-010: should attribute content to author Twitter account',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Twitter Card with creator @username
      // WHEN: creator is '@johndoe' for content author
      // THEN: it should attribute content to author Twitter account

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
              twitter: {
                card: 'summary_large_image',
                title: 'How I Built a Successful Startup',
                description: 'Lessons learned from my journey',
                image: 'https://example.com/image.jpg',
                site: '@techblog',
                creator: '@johndoe',
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const creator = await page.locator('meta[name="twitter:creator"]').getAttribute('content')
      expect(creator).toMatch(/^@[A-Za-z0-9_]+$/)
    }
  )

  test.fixme(
    'APP-PAGES-TWITTER-011: should provide accessible image description',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Twitter Card imageAlt with maxLength
      // WHEN: imageAlt has 420 characters max
      // THEN: it should provide accessible image description

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
              twitter: {
                card: 'summary_large_image',
                title: 'Product Launch',
                description: 'Revolutionary product',
                image: 'https://example.com/image.jpg',
                imageAlt:
                  'Product screenshot showing dashboard with three main sections: analytics graphs displaying monthly revenue trends, user activity heatmap with peak usage times highlighted in red, and automated reporting panel with scheduled report configuration options.',
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const imageAlt = await page.locator('meta[name="twitter:image:alt"]').getAttribute('content')
      expect(imageAlt?.length).toBeLessThanOrEqual(420)
    }
  )

  test.fixme(
    'APP-PAGES-TWITTER-012: should display enhanced Twitter sharing card',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Twitter Card rich preview
      // WHEN: all properties create rich card on Twitter/X
      // THEN: it should display enhanced Twitter sharing card

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
              twitter: {
                card: 'summary_large_image',
                title: 'Transform Your Business with AI-Powered Analytics',
                description:
                  'Get real-time insights, automated reporting, and predictive analytics. Start your free 14-day trial today with no credit card required.',
                image: 'https://example.com/twitter-800x418.jpg',
                imageAlt: 'Dashboard screenshot showing analytics graphs and metrics',
                site: '@acmeanalytics',
                creator: '@producthunt',
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image'
      )
      await expect(page.locator('meta[name="twitter:title"]')).toBeVisible()
      await expect(page.locator('meta[name="twitter:description"]')).toBeVisible()
      await expect(page.locator('meta[name="twitter:image"]')).toBeVisible()
      await expect(page.locator('meta[name="twitter:site"]')).toBeVisible()
      await expect(page.locator('meta[name="twitter:creator"]')).toBeVisible()
    }
  )

  test.fixme(
    'user can complete full Twitter Card workflow',
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
              twitter: {
                card: 'summary_large_image',
                title: 'Complete Twitter Card Test',
                description: 'Testing all Twitter Card features',
                image: 'https://example.com/twitter-image.jpg',
                imageAlt: 'Test image',
                site: '@testsite',
                creator: '@testcreator',
              },
            },
            sections: [],
          },
        ],
      })

      await page.goto('/')

      // Verify required property
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image'
      )

      // Verify optional properties
      await expect(page.locator('meta[name="twitter:title"]')).toBeVisible()
      await expect(page.locator('meta[name="twitter:description"]')).toBeVisible()
      await expect(page.locator('meta[name="twitter:image"]')).toBeVisible()
      await expect(page.locator('meta[name="twitter:site"]')).toBeVisible()
      await expect(page.locator('meta[name="twitter:creator"]')).toBeVisible()
    }
  )
})
