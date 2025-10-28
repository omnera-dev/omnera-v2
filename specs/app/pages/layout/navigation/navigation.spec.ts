/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures.ts'

/**
 * E2E Tests for Navigation Configuration
 *
 * Source: specs/app/pages/layout/navigation/navigation.schema.json
 * Spec Count: 12
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (12 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Navigation Configuration', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-PAGES-NAV-001: should display logo image',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            layout: { navigation: { logo: './public/logo.svg' } },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('[data-testid="nav-logo"]')).toHaveAttribute(
        'src',
        './public/logo.svg'
      )
      await expect(page.locator('[data-testid="nav-logo-link"]')).toHaveAttribute('href', '/')
    }
  )

  test.fixme(
    'APP-PAGES-NAV-002: should use alternative logo for mobile devices',
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
              navigation: { logo: './public/logo.svg', logoMobile: './public/logo-mobile.svg' },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await page.setViewportSize({ width: 375, height: 667 })
      await expect(page.locator('[data-testid="nav-logo-mobile"]')).toHaveAttribute(
        'src',
        './public/logo-mobile.svg'
      )
      await page.setViewportSize({ width: 1024, height: 768 })
      await expect(page.locator('[data-testid="nav-logo"]')).toHaveAttribute(
        'src',
        './public/logo.svg'
      )
    }
  )

  test.fixme(
    'APP-PAGES-NAV-003: should provide accessible alt text for logo',
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
              navigation: { logo: './public/logo.svg', logoAlt: 'Acme Inc - Building the Future' },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('[data-testid="nav-logo"]')).toHaveAttribute(
        'alt',
        'Acme Inc - Building the Future'
      )
    }
  )

  test.fixme(
    'APP-PAGES-NAV-004: should stick to top on scroll',
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
                logo: './public/logo.svg',
                sticky: true,
                links: { desktop: [{ label: 'Products', href: '/products' }] },
              },
            },
            sections: [{ type: 'div', props: { style: 'height: 2000px' }, children: ['Content'] }],
          },
        ],
      })
      await page.goto('/')
      const nav = page.locator('[data-testid="navigation"]')
      await expect(nav).toHaveCSS('position', 'sticky')
      await page.evaluate(() => window.scrollTo(0, 1000))
      await expect(nav).toBeInViewport()
    }
  )

  test.fixme(
    'APP-PAGES-NAV-005: should have transparent background (becomes opaque on scroll)',
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
                logo: './public/logo.svg',
                transparent: true,
                sticky: true,
                links: { desktop: [{ label: 'Features', href: '/features' }] },
              },
            },
            sections: [{ type: 'div', props: { style: 'height: 2000px' }, children: ['Content'] }],
          },
        ],
      })
      await page.goto('/')
      const nav = page.locator('[data-testid="navigation"]')
      const initialBg = await nav.evaluate((el) => window.getComputedStyle(el).backgroundColor)
      expect(initialBg).toMatch(/rgba?\(.*,\s*0\)|transparent/)
      await page.evaluate(() => window.scrollTo(0, 150))
      await page.waitForTimeout(100)
      const scrolledBg = await nav.evaluate((el) => window.getComputedStyle(el).backgroundColor)
      expect(scrolledBg).not.toMatch(/rgba?\(.*,\s*0\)|transparent/)
    }
  )

  test.fixme(
    'APP-PAGES-NAV-006: should render desktop navigation menu',
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
                logo: './public/logo.svg',
                links: {
                  desktop: [
                    { label: 'Products', href: '/products' },
                    { label: 'Pricing', href: '/pricing' },
                    { label: 'About', href: '/about' },
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
      await expect(links).toHaveCount(3)
      await expect(links.nth(0)).toContainText('Products')
      await expect(links.nth(1)).toContainText('Pricing')
      await expect(links.nth(2)).toContainText('About')
    }
  )

  test.fixme(
    'APP-PAGES-NAV-007: should render different links for mobile menu',
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
                logo: './public/logo.svg',
                links: {
                  desktop: [
                    { label: 'Products', href: '/products' },
                    { label: 'Pricing', href: '/pricing' },
                    { label: 'About', href: '/about' },
                  ],
                  mobile: [
                    { label: 'Home', href: '/' },
                    { label: 'Products', href: '/products' },
                  ],
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await page.setViewportSize({ width: 375, height: 667 })
      await page.click('[data-testid="mobile-menu-toggle"]')
      const mobileLinks = page.locator('[data-testid="mobile-menu"] a')
      await expect(mobileLinks).toHaveCount(2)
      await expect(mobileLinks.nth(0)).toContainText('Home')
      await expect(mobileLinks.nth(1)).toContainText('Products')
    }
  )

  test.fixme(
    'APP-PAGES-NAV-008: should render prominent call-to-action button',
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
                logo: './public/logo.svg',
                links: {
                  desktop: [
                    { label: 'Features', href: '/features' },
                    { label: 'Pricing', href: '/pricing' },
                  ],
                },
                cta: { text: 'Get Started', href: '/signup', variant: 'primary' },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const cta = page.locator('[data-testid="nav-cta"]')
      await expect(cta).toContainText('Get Started')
      await expect(cta).toHaveAttribute('href', '/signup')
      await expect(cta).toHaveClass(/btn-primary/)
    }
  )

  test.fixme(
    'APP-PAGES-NAV-009: should display search input in navigation',
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
                logo: './public/logo.svg',
                links: { desktop: [{ label: 'Docs', href: '/docs' }] },
                search: { enabled: true, placeholder: 'Search documentation...' },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const search = page.locator('[data-testid="nav-search"] input')
      await expect(search).toBeVisible()
      await expect(search).toHaveAttribute('placeholder', 'Search documentation...')
    }
  )

  test.fixme(
    'APP-PAGES-NAV-010: should show user account menu with login/signup links',
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
                logo: './public/logo.svg',
                links: { desktop: [{ label: 'Features', href: '/features' }] },
                user: { enabled: true, loginUrl: '/login', signupUrl: '/signup' },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('[data-testid="login-link"]')).toHaveAttribute('href', '/login')
      await expect(page.locator('[data-testid="signup-link"]')).toHaveAttribute('href', '/signup')
    }
  )

  test.fixme(
    'APP-PAGES-NAV-011: should render minimal navigation with logo',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            layout: { navigation: { logo: './public/logo.svg' } },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('[data-testid="navigation"]')).toBeVisible()
      await expect(page.locator('[data-testid="nav-logo"]')).toBeVisible()
      await expect(page.locator('[data-testid="nav-link"]')).toHaveCount(0)
    }
  )

  test.fixme(
    'APP-PAGES-NAV-012: should compose navigation from modular schemas',
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
                logo: './public/logo.svg',
                links: { desktop: [{ label: 'Products', href: '/products' }] },
                cta: { text: 'Get Started', href: '/signup', variant: 'primary' },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('[data-testid="nav-link"]')).toContainText('Products')
      await expect(page.locator('[data-testid="nav-cta"]')).toContainText('Get Started')
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full navigation workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Home',
            path: '/',
            meta: { lang: 'en-US', title: 'Home' },
            layout: {
              navigation: {
                logo: './public/logo.svg',
                logoAlt: 'Acme Inc',
                sticky: true,
                transparent: true,
                links: {
                  desktop: [
                    { label: 'Features', href: '/features' },
                    { label: 'Pricing', href: '/pricing' },
                  ],
                },
                cta: { text: 'Get Started', href: '/signup', variant: 'primary' },
                search: { enabled: true, placeholder: 'Search...' },
                user: { enabled: true, loginUrl: '/login', signupUrl: '/signup' },
              },
            },
            sections: [{ type: 'div', props: { style: 'height: 2000px' }, children: ['Content'] }],
          },
        ],
      })

      await page.goto('/')

      // Verify logo and sticky behavior
      const nav = page.locator('[data-testid="navigation"]')
      await expect(page.locator('[data-testid="nav-logo"]')).toHaveAttribute('alt', 'Acme Inc')
      await expect(nav).toHaveCSS('position', 'sticky')

      // Verify transparent to opaque transition
      await page.evaluate(() => window.scrollTo(0, 150))
      await expect(nav).toBeInViewport()

      // Verify desktop links
      await expect(page.locator('[data-testid="nav-link"]')).toHaveCount(2)

      // Verify CTA button
      await expect(page.locator('[data-testid="nav-cta"]')).toContainText('Get Started')

      // Verify search
      await expect(page.locator('[data-testid="nav-search"] input')).toBeVisible()

      // Verify user menu
      await expect(page.locator('[data-testid="login-link"]')).toBeVisible()
    }
  )
})
