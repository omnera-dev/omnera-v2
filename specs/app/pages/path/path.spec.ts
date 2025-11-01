/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for URL Path
 *
 * Source: specs/app/pages/path/path.schema.json
 * Spec Count: 10
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (10 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('URL Path', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-PAGES-PATH-001: should validate as homepage path',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a root path
      await startServerWithSchema({
        name: 'test-app',
        pages: [{ name: 'Home', path: '/', meta: { lang: 'en-US', title: 'Home' }, sections: [] }],
      })

      // WHEN: value is '/'
      await page.goto('/')

      // THEN: it should validate as homepage path
      await expect(page).toHaveURL('/')
      await expect(page.locator('[data-testid="page-home"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-PATH-002: should follow shared path pattern from common definitions',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a path referencing common definition
      // WHEN: schema uses $ref to definitions.schema.json#/definitions/path
      // THEN: it should follow shared path pattern from common definitions
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          { name: 'About', path: '/about', meta: { lang: 'en-US', title: 'About' }, sections: [] },
        ],
      })
      await page.goto('/about')
      await expect(page).toHaveURL('/about')
    }
  )

  test.fixme(
    'APP-PAGES-PATH-003: should accept paths with leading slash',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a single-level path
      // WHEN: value is '/about' or '/pricing'
      // THEN: it should accept paths with leading slash

      // GIVEN: a single-level path
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          { name: 'About', path: '/about', meta: { lang: 'en-US', title: 'About' }, sections: [] },
          {
            name: 'Pricing',
            path: '/pricing',
            meta: { lang: 'en-US', title: 'Pricing' },
            sections: [],
          },
          {
            name: 'Contact',
            path: '/contact',
            meta: { lang: 'en-US', title: 'Contact' },
            sections: [],
          },
        ],
      })

      // WHEN: value is '/about' or '/pricing'
      await page.goto('/about')
      await expect(page).toHaveURL('/about')
      await page.goto('/pricing')
      await expect(page).toHaveURL('/pricing')

      // THEN: it should accept paths with leading slash
    }
  )

  test.fixme(
    'APP-PAGES-PATH-004: should accept multi-level URL paths',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a nested path
      // WHEN: value is '/products/pricing' or '/blog/article'
      // THEN: it should accept multi-level URL paths

      // GIVEN: a nested path
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Pricing',
            path: '/products/pricing',
            meta: { lang: 'en-US', title: 'Pricing' },
            sections: [],
          },
          {
            name: 'Article',
            path: '/blog/article',
            meta: { lang: 'en-US', title: 'Article' },
            sections: [],
          },
        ],
      })

      // WHEN: value is '/products/pricing' or '/blog/article'
      await page.goto('/products/pricing')
      await expect(page).toHaveURL('/products/pricing')
      await page.goto('/blog/article')
      await expect(page).toHaveURL('/blog/article')

      // THEN: it should accept multi-level URL paths
    }
  )

  test.fixme(
    'APP-PAGES-PATH-005: should accept kebab-case URL segments',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a path with kebab-case segments
      // WHEN: value is '/our-team' or '/contact-us'
      // THEN: it should accept kebab-case URL segments

      // GIVEN: a path with kebab-case segments
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Team',
            path: '/our-team',
            meta: { lang: 'en-US', title: 'Our Team' },
            sections: [],
          },
          {
            name: 'Contact',
            path: '/contact-us',
            meta: { lang: 'en-US', title: 'Contact Us' },
            sections: [],
          },
        ],
      })

      // WHEN: value is '/our-team' or '/contact-us'
      await page.goto('/our-team')
      await expect(page).toHaveURL('/our-team')
      await page.goto('/contact-us')
      await expect(page).toHaveURL('/contact-us')

      // THEN: it should accept kebab-case URL segments
    }
  )

  test.fixme(
    'APP-PAGES-PATH-006: should provide examples for typical URL patterns',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: common website paths (/, /about, /pricing, /contact)
      // WHEN: standard website pages are defined
      // THEN: it should provide examples for typical URL patterns

      // GIVEN: common website paths (/, /about, /pricing, /contact)
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          { name: 'Home', path: '/', meta: { lang: 'en-US', title: 'Home' }, sections: [] },
          { name: 'About', path: '/about', meta: { lang: 'en-US', title: 'About' }, sections: [] },
          {
            name: 'Pricing',
            path: '/pricing',
            meta: { lang: 'en-US', title: 'Pricing' },
            sections: [],
          },
          {
            name: 'Contact',
            path: '/contact',
            meta: { lang: 'en-US', title: 'Contact' },
            sections: [],
          },
        ],
      })

      // WHEN: standard website pages are defined
      await page.goto('/')
      await expect(page).toHaveURL('/')
      await page.goto('/about')
      await expect(page).toHaveURL('/about')

      // THEN: it should provide examples for typical URL patterns
    }
  )

  test.fixme(
    'APP-PAGES-PATH-007: should fail validation (path is required)',
    { tag: '@spec' },
    async ({ startServerWithSchema }) => {
      // GIVEN: path as required field
      // WHEN: page is created without path
      // THEN: it should fail validation (path is required)
      // Note: This test validates build-time schema validation
      await expect(async () => {
        await startServerWithSchema({
          name: 'test-app',
          pages: [{ name: 'About', meta: { lang: 'en-US', title: 'About' }, sections: [] }],
        })
      }).rejects.toThrow()
    }
  )

  test.fixme(
    'APP-PAGES-PATH-008: should ensure unique routing for all pages',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: paths across multiple pages
      // WHEN: each page has unique path
      // THEN: it should ensure unique routing for all pages

      // GIVEN: paths across multiple pages
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          { name: 'Home', path: '/', meta: { lang: 'en-US', title: 'Home' }, sections: [] },
          { name: 'About', path: '/about', meta: { lang: 'en-US', title: 'About' }, sections: [] },
          {
            name: 'Pricing',
            path: '/pricing',
            meta: { lang: 'en-US', title: 'Pricing' },
            sections: [],
          },
          {
            name: 'Contact',
            path: '/contact',
            meta: { lang: 'en-US', title: 'Contact' },
            sections: [],
          },
        ],
      })

      // WHEN: each page has unique path
      await page.goto('/')
      await expect(page.locator('[data-testid="page-home"]')).toBeVisible()
      await page.goto('/about')
      await expect(page.locator('[data-testid="page-about"]')).toBeVisible()

      // THEN: it should ensure unique routing for all pages
    }
  )

  test.fixme(
    'APP-PAGES-PATH-009: should map URL to page configuration for rendering',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: path determining page accessibility
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Pricing',
            path: '/pricing',
            meta: { lang: 'en-US', title: 'Pricing Plans' },
            sections: [],
          },
        ],
      })

      // WHEN: user navigates to path in browser
      await page.goto('/pricing')

      // THEN: it should map URL to page configuration for rendering
      await expect(page).toHaveURL('/pricing')
      await expect(page).toHaveTitle('Pricing Plans')
      await expect(page.locator('[data-testid="page-pricing"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-PATH-010: should support dynamic route parameters (if applicable)',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: path with dynamic segments
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Blog Post',
            path: '/blog/:slug',
            meta: { lang: 'en-US', title: 'Blog' },
            sections: [],
          },
          {
            name: 'Product',
            path: '/products/:id',
            meta: { lang: 'en-US', title: 'Product' },
            sections: [],
          },
        ],
      })

      // WHEN: value is '/blog/:slug' or '/products/:id'
      await page.goto('/blog/hello-world')
      await expect(page).toHaveURL('/blog/hello-world')
      await expect(page.locator('[data-slug="hello-world"]')).toBeVisible()

      await page.goto('/products/123')
      await expect(page).toHaveURL('/products/123')
      await expect(page.locator('[data-product-id="123"]')).toBeVisible()

      // THEN: it should support dynamic route parameters (if applicable)
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full path workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application with various path patterns
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          { name: 'Home', path: '/', meta: { lang: 'en-US', title: 'Home' }, sections: [] },
          { name: 'About', path: '/about', meta: { lang: 'en-US', title: 'About' }, sections: [] },
          {
            name: 'Pricing',
            path: '/products/pricing',
            meta: { lang: 'en-US', title: 'Pricing' },
            sections: [],
          },
          { name: 'Team', path: '/our-team', meta: { lang: 'en-US', title: 'Team' }, sections: [] },
        ],
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.goto('/')
      await expect(page).toHaveURL('/')

      await page.goto('/about')
      await expect(page).toHaveURL('/about')

      await page.goto('/products/pricing')
      await expect(page).toHaveURL('/products/pricing')

      await page.goto('/our-team')
      await expect(page).toHaveURL('/our-team')

      // Focus on workflow continuity, not exhaustive coverage
    }
  )
})
