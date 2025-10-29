/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Navigation Links
 *
 * Source: specs/app/pages/layout/navigation/nav-links.schema.json
 * Spec Count: 10
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (10 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Navigation Links', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-PAGES-NAVLINKS-001: should render navigation link',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            layout: {
              navigation: {
                logo: './logo.svg',
                links: { desktop: [{ label: 'Home', href: '/' }] },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const link = page.locator('[data-testid="nav-link"]').first()
      await expect(link).toContainText('Home')
      await expect(link).toHaveAttribute('href', '/')
    }
  )

  test.fixme(
    'APP-PAGES-NAVLINKS-002: should open link in new tab',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            layout: {
              navigation: {
                logo: './logo.svg',
                links: {
                  desktop: [{ label: 'External', href: 'https://example.com', target: '_blank' }],
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const link = page.locator('[data-testid="nav-link"]').first()
      await expect(link).toHaveAttribute('target', '_blank')
    }
  )

  test.fixme(
    'APP-PAGES-NAVLINKS-003: should display icon alongside label',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            layout: {
              navigation: {
                logo: './logo.svg',
                links: { desktop: [{ label: 'Products', href: '/products', icon: 'arrow-right' }] },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const link = page.locator('[data-testid="nav-link"]').first()
      await expect(link).toContainText('Products')
      await expect(link.locator('[data-testid="icon"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-NAVLINKS-004: should display badge to highlight link',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            layout: {
              navigation: {
                logo: './logo.svg',
                links: { desktop: [{ label: 'New Feature', href: '/new-feature', badge: 'New' }] },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const link = page.locator('[data-testid="nav-link"]').first()
      await expect(link.locator('[data-testid="badge"]')).toContainText('New')
    }
  )

  test.fixme(
    'APP-PAGES-NAVLINKS-005: should render dropdown menu on hover/click',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            layout: {
              navigation: {
                logo: './logo.svg',
                links: {
                  desktop: [
                    {
                      label: 'Products',
                      href: '/products',
                      children: [
                        { label: 'Product A', href: '/products/a' },
                        { label: 'Product B', href: '/products/b' },
                      ],
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
      const parentLink = page.locator('[data-testid="nav-link"]').filter({ hasText: 'Products' })
      await parentLink.hover()
      const dropdown = page.locator('[data-testid="nav-dropdown"]')
      await expect(dropdown).toBeVisible()
      await expect(dropdown.locator('a')).toHaveCount(2)
    }
  )

  test.fixme(
    'APP-PAGES-NAVLINKS-006: should scroll to anchor on same page',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            layout: {
              navigation: {
                logo: './logo.svg',
                links: { desktop: [{ label: 'Contact', href: '#contact' }] },
              },
            },
            sections: [
              { type: 'div', props: { style: 'height: 2000px' }, children: ['Content'] },
              { type: 'div', props: { id: 'contact' }, children: ['Contact Section'] },
            ],
          },
        ],
      })
      await page.goto('/')
      await page.click('[data-testid="nav-link"]')
      await expect(page.locator('#contact')).toBeInViewport()
    }
  )

  test.fixme(
    'APP-PAGES-NAVLINKS-007: should render horizontal navigation menu',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            layout: {
              navigation: {
                logo: './logo.svg',
                links: {
                  desktop: [
                    { label: 'Home', href: '/' },
                    { label: 'About', href: '/about' },
                    { label: 'Products', href: '/products' },
                    { label: 'Contact', href: '/contact' },
                  ],
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const links = page.locator('[data-testid="nav-link"]')
      await expect(links).toHaveCount(4)
      const navLinks = page.locator('[data-testid="nav-links"]')
      await expect(navLinks).toHaveCSS('display', /flex/)
    }
  )

  test.fixme(
    'APP-PAGES-NAVLINKS-008: should support unlimited nesting depth for menus',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            layout: {
              navigation: {
                logo: './logo.svg',
                links: {
                  desktop: [
                    {
                      label: 'Products',
                      href: '/products',
                      children: [
                        {
                          label: 'Category A',
                          href: '/products/a',
                          children: [{ label: 'Product A1', href: '/products/a/1' }],
                        },
                      ],
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
      const parentLink = page.locator('[data-testid="nav-link"]').filter({ hasText: 'Products' })
      await parentLink.hover()
      await expect(page.locator('[data-testid="nav-dropdown"]')).toBeVisible()
      const categoryLink = page.locator('text=Category A')
      await categoryLink.hover()
      await expect(page.locator('text=Product A1')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-NAVLINKS-009: should support all standard HTML link targets',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      const targets = ['_self', '_blank', '_parent', '_top']
      for (const target of targets) {
        await startServerWithSchema({
          name: 'test-app',
          pages: [
            {
              name: 'Test',
              path: '/',
              meta: { lang: 'en-US', title: 'Test' },
              layout: {
                navigation: {
                  logo: './logo.svg',
                  links: { desktop: [{ label: 'Link', href: '/test', target }] },
                },
              },
              sections: [],
            },
          ],
        })
        await page.goto('/')
        await expect(page.locator('[data-testid="nav-link"]').first()).toHaveAttribute(
          'target',
          target
        )
      }
    }
  )

  test.fixme(
    'APP-PAGES-NAVLINKS-010: should enforce required properties for valid links',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            layout: {
              navigation: {
                logo: './logo.svg',
                links: { desktop: [{ label: 'Home', href: '/' }] },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const link = page.locator('[data-testid="nav-link"]').first()
      await expect(link).toContainText('Home')
      await expect(link).toHaveAttribute('href', '/')
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full nav links workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            layout: {
              navigation: {
                logo: './logo.svg',
                links: {
                  desktop: [
                    { label: 'Home', href: '/' },
                    {
                      label: 'Products',
                      href: '/products',
                      icon: 'package',
                      children: [
                        { label: 'Product A', href: '/products/a' },
                        { label: 'Product B', href: '/products/b' },
                      ],
                    },
                    { label: 'Beta', href: '/beta', badge: 'New' },
                    { label: 'External', href: 'https://example.com', target: '_blank' },
                    { label: 'Contact', href: '#contact' },
                  ],
                },
              },
            },
            sections: [
              { type: 'div', props: { style: 'height: 2000px' }, children: ['Content'] },
              { type: 'div', props: { id: 'contact' }, children: ['Contact Section'] },
            ],
          },
        ],
      })

      await page.goto('/')

      // Verify links rendered
      const links = page.locator('[data-testid="nav-link"]')
      await expect(links).toHaveCount(5)

      // Verify dropdown menu
      const productsLink = links.filter({ hasText: 'Products' })
      await productsLink.hover()
      await expect(page.locator('[data-testid="nav-dropdown"]')).toBeVisible()

      // Verify badge
      await expect(
        links.filter({ hasText: 'Beta' }).locator('[data-testid="badge"]')
      ).toContainText('New')

      // Verify external link
      await expect(links.filter({ hasText: 'External' })).toHaveAttribute('target', '_blank')

      // Verify anchor scroll
      await page.click('text=Contact')
      await expect(page.locator('#contact')).toBeInViewport()
    }
  )
})
