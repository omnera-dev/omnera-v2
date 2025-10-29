/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for CTA Button
 *
 * Source: specs/app/pages/layout/navigation/cta-button.schema.json
 * Spec Count: 10
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (10 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('CTA Button', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-PAGES-CTA-001: should render call-to-action button',
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
              navigation: { logo: './logo.svg', cta: { text: 'Get Started', href: '/signup' } },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const cta = page.locator('[data-testid="nav-cta"]')
      await expect(cta).toContainText('Get Started')
      await expect(cta).toHaveAttribute('href', '/signup')
    }
  )

  test.fixme(
    'APP-PAGES-CTA-002: should apply primary button styling',
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
                cta: { text: 'Get Started', href: '/signup', variant: 'primary' },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('[data-testid="nav-cta"]')).toHaveClass(/btn-primary/)
    }
  )

  test.fixme(
    'APP-PAGES-CTA-003: should support all button style variants',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      const variants = ['primary', 'secondary', 'outline', 'ghost', 'link']
      for (const variant of variants) {
        await startServerWithSchema({
          name: 'test-app',
          pages: [
            {
              name: 'Test',
              path: '/',
              meta: { lang: 'en-US', title: 'Test' },
              layout: {
                navigation: { logo: './logo.svg', cta: { text: 'Button', href: '/test', variant } },
              },
              sections: [],
            },
          ],
        })
        await page.goto('/')
        await expect(page.locator('[data-testid="nav-cta"]')).toHaveClass(
          new RegExp(`btn-${variant}`)
        )
      }
    }
  )

  test.fixme(
    'APP-PAGES-CTA-004: should apply size styling',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      const sizes = ['sm', 'md', 'lg', 'xl']
      for (const size of sizes) {
        await startServerWithSchema({
          name: 'test-app',
          pages: [
            {
              name: 'Test',
              path: '/',
              meta: { lang: 'en-US', title: 'Test' },
              layout: {
                navigation: { logo: './logo.svg', cta: { text: 'Button', href: '/test', size } },
              },
              sections: [],
            },
          ],
        })
        await page.goto('/')
        await expect(page.locator('[data-testid="nav-cta"]')).toHaveClass(new RegExp(`btn-${size}`))
      }
    }
  )

  test.fixme(
    'APP-PAGES-CTA-005: should apply theme-based color',
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
                cta: { text: 'Button', href: '/test', color: 'orange' },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const cta = page.locator('[data-testid="nav-cta"]')
      const bgColor = await cta.evaluate((el) => window.getComputedStyle(el).backgroundColor)
      expect(bgColor).toMatch(/rgb/)
    }
  )

  test.fixme(
    'APP-PAGES-CTA-006: should display icon on right side of text',
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
                cta: {
                  text: 'Download',
                  href: '/download',
                  icon: 'download',
                  iconPosition: 'right',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const cta = page.locator('[data-testid="nav-cta"]')
      await expect(cta.locator('[data-testid="icon"]')).toBeVisible()
      const iconPosition = await cta.evaluate((el) => {
        const text = el.textContent?.trim()
        const icon = el.querySelector('[data-testid="icon"]')
        return icon && text
          ? Array.from(el.childNodes).indexOf(icon) > 0
            ? 'right'
            : 'left'
          : null
      })
      expect(iconPosition).toBe('right')
    }
  )

  test.fixme(
    'APP-PAGES-CTA-007: should display icon on left side of text',
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
                cta: { text: 'Start', href: '/start', icon: 'rocket', iconPosition: 'left' },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const cta = page.locator('[data-testid="nav-cta"]')
      await expect(cta.locator('[data-testid="icon"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-CTA-008: should serve as prominent call-to-action in header',
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
                links: { desktop: [{ label: 'About', href: '/about' }] },
                cta: { text: 'Sign Up', href: '/signup', variant: 'primary' },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const nav = page.locator('[data-testid="navigation"]')
      const cta = nav.locator('[data-testid="nav-cta"]')
      await expect(cta).toBeVisible()
      await expect(cta).toContainText('Sign Up')
    }
  )

  test.fixme(
    'APP-PAGES-CTA-009: should validate as complete CTA configuration',
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
              navigation: { logo: './logo.svg', cta: { text: 'Get Started', href: '/signup' } },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const cta = page.locator('[data-testid="nav-cta"]')
      await expect(cta).toContainText('Get Started')
      await expect(cta).toHaveAttribute('href', '/signup')
    }
  )

  test.fixme(
    'APP-PAGES-CTA-010: should support fully customized button appearance',
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
                cta: {
                  text: 'Download',
                  href: '/download',
                  variant: 'outline',
                  size: 'lg',
                  color: 'blue',
                  icon: 'download',
                  iconPosition: 'right',
                },
              },
            },
            sections: [],
          },
        ],
      })
      await page.goto('/')
      const cta = page.locator('[data-testid="nav-cta"]')
      await expect(cta).toContainText('Download')
      await expect(cta).toHaveClass(/btn-outline/)
      await expect(cta).toHaveClass(/btn-lg/)
      await expect(cta.locator('[data-testid="icon"]')).toBeVisible()
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full CTA button workflow',
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
                links: { desktop: [{ label: 'Features', href: '/features' }] },
                cta: {
                  text: 'Get Started',
                  href: '/signup',
                  variant: 'primary',
                  size: 'lg',
                  icon: 'arrow-right',
                  iconPosition: 'right',
                },
              },
            },
            sections: [],
          },
        ],
      })

      await page.goto('/')

      // Verify CTA button visible
      const cta = page.locator('[data-testid="nav-cta"]')
      await expect(cta).toBeVisible()

      // Verify text and link
      await expect(cta).toContainText('Get Started')
      await expect(cta).toHaveAttribute('href', '/signup')

      // Verify styling
      await expect(cta).toHaveClass(/btn-primary/)
      await expect(cta).toHaveClass(/btn-lg/)

      // Verify icon
      await expect(cta.locator('[data-testid="icon"]')).toBeVisible()

      // Verify clickable
      await cta.click()
      await expect(page).toHaveURL('/signup')
    }
  )
})
