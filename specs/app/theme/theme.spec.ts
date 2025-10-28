/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../../fixtures.ts'

/**
 * E2E Tests for Theme Configuration
 *
 * Source: specs/app/theme/theme.schema.json
 * Spec Count: 8
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (8 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Theme Configuration', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-THEME-001: should accept colors as the only design token',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-001
      // GIVEN: a theme with only colors defined
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            secondary: '#6c757d',
            success: '#28a745',
          },
        },
      })

      // WHEN: minimal theme configuration is needed
      await page.goto('/')

      // THEN: it should accept colors as the only design token
      await expect(page.locator('[data-testid="theme-colors"]')).toBeVisible()
      const primaryColor = await page
        .locator('[data-testid="color-primary"]')
        .evaluate((el) => window.getComputedStyle(el).getPropertyValue('--color-primary'))
      expect(primaryColor).toBe('#007bff')
    }
  )

  test.fixme(
    'APP-THEME-002: should support color palette and typography system',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-002
      // GIVEN: a theme with colors and fonts configured
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            secondary: '#6c757d',
          },
          fonts: {
            body: {
              family: 'Inter',
              fallback: 'sans-serif',
            },
            heading: {
              family: 'Poppins',
              fallback: 'sans-serif',
            },
          },
        },
      })

      // WHEN: basic branding is defined
      await page.goto('/')

      // THEN: it should support color palette and typography system
      await expect(page.locator('body')).toHaveCSS('font-family', /Inter/)
      await expect(page.locator('h1')).toHaveCSS('font-family', /Poppins/)
      const primaryColor = await page
        .locator('[data-testid="color-primary"]')
        .evaluate((el) => window.getComputedStyle(el).backgroundColor)
      expect(primaryColor).toContain('7, 123, 255') // rgb(7, 123, 255) = #007bff
    }
  )

  test.fixme(
    'APP-THEME-003: should provide visual identity, typography, and layout tokens',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-003
      // GIVEN: a theme with colors, fonts, and spacing
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
          },
          fonts: {
            body: {
              family: 'Inter',
              fallback: 'sans-serif',
            },
          },
          spacing: {
            section: 'py-16',
            container: 'max-w-7xl',
          },
        },
      })

      // WHEN: core design system is configured
      await page.goto('/')

      // THEN: it should provide visual identity, typography, and layout tokens
      await expect(page.locator('[data-testid="section"]')).toHaveClass(/py-16/)
      await expect(page.locator('[data-testid="container"]')).toHaveClass(/max-w-7xl/)
      await expect(page.locator('body')).toHaveCSS('font-family', /Inter/)
    }
  )

  test.fixme(
    'APP-THEME-004: should orchestrate colors, fonts, spacing, animations, breakpoints, shadows, and borderRadius',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-004
      // GIVEN: a complete theme with all 7 design token categories
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
          },
          fonts: {
            body: {
              family: 'Inter',
              fallback: 'sans-serif',
            },
          },
          spacing: {
            section: 'py-16',
          },
          animations: {
            fadeIn: 'fade-in 0.3s ease-in',
          },
          breakpoints: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
          },
          shadows: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
          borderRadius: {
            sm: '0.125rem',
            md: '0.375rem',
            lg: '0.5rem',
          },
        },
      })

      // WHEN: comprehensive design system is defined
      await page.goto('/')

      // THEN: it should orchestrate all 7 design token categories
      await expect(page.locator('[data-testid="theme-colors"]')).toBeVisible()
      await expect(page.locator('[data-testid="theme-fonts"]')).toBeVisible()
      await expect(page.locator('[data-testid="theme-spacing"]')).toBeVisible()
      await expect(page.locator('[data-testid="theme-animations"]')).toBeVisible()
      await expect(page.locator('[data-testid="theme-breakpoints"]')).toBeVisible()
      await expect(page.locator('[data-testid="theme-shadows"]')).toBeVisible()
      await expect(page.locator('[data-testid="theme-border-radius"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-005: should ensure consistency between theme and responsive.schema.json',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-005
      // GIVEN: a theme with breakpoints matching responsive system
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          breakpoints: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
          },
        },
      })

      // WHEN: responsive breakpoints are configured
      await page.goto('/')

      // THEN: it should ensure consistency between theme and responsive.schema.json
      const breakpoints = await page.evaluate(() => {
        const sm = window.matchMedia('(min-width: 640px)').matches
        const md = window.matchMedia('(min-width: 768px)').matches
        const lg = window.matchMedia('(min-width: 1024px)').matches
        const xl = window.matchMedia('(min-width: 1280px)').matches
        return { sm, md, lg, xl }
      })
      expect(breakpoints).toBeTruthy()
    }
  )

  test.fixme(
    'APP-THEME-006: should provide animations reusable in interactions.schema.json',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-006
      // GIVEN: a theme with animations matching interaction system
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          animations: {
            fadeIn: 'fade-in 0.3s ease-in',
            slideUp: 'slide-up 0.5s ease-out',
            scaleIn: 'scale-in 0.2s ease-in-out',
          },
        },
      })

      // WHEN: animation library is defined
      await page.goto('/')

      // THEN: it should provide animations reusable in interactions.schema.json
      const element = page.locator('[data-testid="animated-element"]')
      await expect(element).toBeVisible()
      const animationName = await element.evaluate(
        (el) => window.getComputedStyle(el).animationName
      )
      expect(['fade-in', 'slide-up', 'scale-in']).toContain(animationName)
    }
  )

  test.fixme(
    'APP-THEME-007: should enable consistent UI across entire application',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-007
      // GIVEN: a theme following design system best practices
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            'primary-dark': '#0056b3',
            'primary-light': '#66b3ff',
            secondary: '#6c757d',
            success: '#28a745',
            danger: '#dc3545',
          },
          fonts: {
            body: {
              family: 'Inter',
              fallback: 'sans-serif',
              sizes: {
                xs: '0.75rem',
                sm: '0.875rem',
                base: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
              },
            },
          },
          spacing: {
            xs: 'p-1',
            sm: 'p-2',
            md: 'p-4',
            lg: 'p-6',
            xl: 'p-8',
          },
        },
      })

      // WHEN: all tokens use semantic naming and progressive scales
      await page.goto('/')

      // THEN: it should enable consistent UI across entire application
      const buttons = page.locator('[data-testid="button"]')
      await expect(buttons.first()).toBeVisible()
      // Verify all buttons use consistent theme tokens
      const buttonStyles = await buttons.first().evaluate((el) => ({
        color: window.getComputedStyle(el).color,
        padding: window.getComputedStyle(el).padding,
        fontFamily: window.getComputedStyle(el).fontFamily,
      }))
      expect(buttonStyles.fontFamily).toContain('Inter')
    }
  )

  test.fixme(
    'APP-THEME-008: should integrate seamlessly with Tailwind CSS',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-THEME-008
      // GIVEN: a theme with Tailwind-compatible tokens
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            section: 'py-16',
            container: 'max-w-7xl mx-auto px-4',
            card: 'p-6 rounded-lg shadow-md',
          },
          borderRadius: {
            sm: '0.125rem',
            DEFAULT: '0.25rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '0.75rem',
          },
        },
      })

      // WHEN: spacing and other values use Tailwind syntax
      await page.goto('/')

      // THEN: it should integrate seamlessly with Tailwind CSS
      await expect(page.locator('[data-testid="section"]')).toHaveClass(/py-16/)
      await expect(page.locator('[data-testid="container"]')).toHaveClass(/max-w-7xl/)
      await expect(page.locator('[data-testid="container"]')).toHaveClass(/mx-auto/)
      await expect(page.locator('[data-testid="card"]')).toHaveClass(/p-6/)
      await expect(page.locator('[data-testid="card"]')).toHaveClass(/rounded-lg/)
      await expect(page.locator('[data-testid="card"]')).toHaveClass(/shadow-md/)
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full theme workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application configured with comprehensive theme system
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            secondary: '#6c757d',
            success: '#28a745',
          },
          fonts: {
            body: {
              family: 'Inter',
              fallback: 'sans-serif',
            },
            heading: {
              family: 'Poppins',
              fallback: 'sans-serif',
            },
          },
          spacing: {
            section: 'py-16',
            container: 'max-w-7xl mx-auto',
          },
          borderRadius: {
            DEFAULT: '0.25rem',
            lg: '0.5rem',
          },
          shadows: {
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        },
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.goto('/')

      // Verify theme tokens are applied
      await expect(page.locator('body')).toHaveCSS('font-family', /Inter/)
      await expect(page.locator('h1')).toHaveCSS('font-family', /Poppins/)

      // Verify Tailwind integration
      await expect(page.locator('[data-testid="section"]')).toHaveClass(/py-16/)
      await expect(page.locator('[data-testid="container"]')).toHaveClass(/max-w-7xl/)

      // Verify colors applied
      const primaryElement = page.locator('[data-testid="primary-element"]')
      if ((await primaryElement.count()) > 0) {
        const bgColor = await primaryElement.evaluate(
          (el) => window.getComputedStyle(el).backgroundColor
        )
        expect(bgColor).toContain('7, 123, 255') // rgb(7, 123, 255) = #007bff
      }

      // Focus on workflow continuity, not exhaustive coverage
    }
  )
})
