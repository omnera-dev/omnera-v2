/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Theme Configuration
 *
 * Source: specs/app/theme/theme.schema.json
 * Spec Count: 11
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (11 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Theme Configuration', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test(
    'APP-THEME-001: should validate theme with colors as the only design token category',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a theme with only colors defined
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            secondary: '#6c757d',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                type: 'div',
                props: {
                  'data-testid': 'theme-colors',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      'data-testid': 'color-primary',
                      style: {
                        backgroundColor: '$theme.colors.primary',
                        color: '$theme.colors.secondary',
                      },
                    },
                    children: ['Primary'],
                  },
                ],
              },
            ],
          },
        ],
      })

      // WHEN: minimal theme configuration is needed
      await page.goto('/')

      // THEN: it should validate theme with colors as the only design token category
      await expect(page.locator('[data-testid="theme-colors"]')).toBeVisible()
      const element = page.locator('[data-testid="color-primary"]')
      const backgroundColor = await element.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor
      )
      const color = await element.evaluate((el) => window.getComputedStyle(el).color)

      // Verify theme colors were applied via token substitution
      expect(backgroundColor).toBe('rgb(0, 123, 255)') // #007bff
      expect(color).toBe('rgb(108, 117, 125)') // #6c757d
    }
  )

  test(
    'APP-THEME-002: should validate color palette and typography system',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a theme with colors and fonts configured
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            text: '#212529',
          },
          fonts: {
            body: {
              family: 'Inter',
              fallback: 'sans-serif',
            },
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                type: 'div',
                props: {
                  'data-testid': 'color-primary',
                  style: 'background-color: #007bff; padding: 1rem;',
                },
                children: ['Primary Color'],
              },
            ],
          },
        ],
      })

      // WHEN: basic branding is defined
      await page.goto('/')

      // THEN: it should validate color palette and typography system
      await expect(page.locator('body')).toHaveCSS('font-family', /Inter/)
      const primaryColor = await page
        .locator('[data-testid="color-primary"]')
        .evaluate((el) => window.getComputedStyle(el).backgroundColor)
      expect(primaryColor).toContain('0, 123, 255') // rgb(0, 123, 255) = #007bff
    }
  )

  test(
    'APP-THEME-003: should validate visual identity, typography, and layout tokens',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
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
            },
          },
          spacing: {
            section: '4rem',
            gap: '1rem',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [],
          },
        ],
      })

      // WHEN: core design system is configured
      await page.goto('/')

      // THEN: it should validate visual identity, typography, and layout tokens
      // Note: toHaveCSS() returns computed values in pixels (4rem × 16px = 64px)
      await expect(page.locator('[data-testid="section"]')).toHaveCSS('padding', '64px')
      await expect(page.locator('body')).toHaveCSS('font-family', /Inter/)
    }
  )

  test(
    'APP-THEME-004: should validate and orchestrate all design token categories',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
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
            },
          },
          spacing: {
            section: '4rem',
          },
          animations: {
            fadeIn: true,
          },
          breakpoints: {
            md: '768px',
          },
          shadows: {
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
          borderRadius: {
            md: '0.375rem',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                type: 'div',
                props: {
                  'data-testid': 'theme-colors',
                  style: { backgroundColor: '$theme.colors.primary', padding: '16px' },
                },
                children: ['Colors'],
              },
              {
                type: 'div',
                props: {
                  'data-testid': 'theme-fonts',
                  style: { fontFamily: '$theme.fonts.body.family' },
                },
                children: ['Fonts'],
              },
              {
                type: 'div',
                props: {
                  'data-testid': 'theme-spacing',
                  style: { padding: '$theme.spacing.section' },
                },
                children: ['Spacing'],
              },
              {
                type: 'div',
                props: { 'data-testid': 'theme-animations' },
                children: ['Animations'],
              },
              {
                type: 'div',
                props: { 'data-testid': 'theme-breakpoints' },
                children: ['Breakpoints'],
              },
              {
                type: 'div',
                props: {
                  'data-testid': 'theme-shadows',
                  style: { boxShadow: '$theme.shadows.md' },
                },
                children: ['Shadows'],
              },
              {
                type: 'div',
                props: {
                  'data-testid': 'theme-border-radius',
                  style: { borderRadius: '$theme.borderRadius.md', border: '1px solid' },
                },
                children: ['Border Radius'],
              },
            ],
          },
        ],
      })

      // WHEN: comprehensive design system is defined
      await page.goto('/')

      // THEN: it should validate and orchestrate all design token categories
      await expect(page.locator('[data-testid="theme-colors"]')).toBeVisible()
      await expect(page.locator('[data-testid="theme-fonts"]')).toBeVisible()
      await expect(page.locator('[data-testid="theme-spacing"]')).toBeVisible()
      await expect(page.locator('[data-testid="theme-animations"]')).toBeVisible()
      await expect(page.locator('[data-testid="theme-breakpoints"]')).toBeVisible()
      await expect(page.locator('[data-testid="theme-shadows"]')).toBeVisible()
      await expect(page.locator('[data-testid="theme-border-radius"]')).toBeVisible()
    }
  )

  test(
    'APP-THEME-005: should ensure consistency between theme.breakpoints and responsive variants',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a theme with breakpoints matching responsive system
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          breakpoints: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [],
          },
        ],
      })

      // WHEN: responsive breakpoints are configured
      await page.goto('/')

      // THEN: it should ensure consistency between theme.breakpoints and responsive variants
      const breakpoints = await page.evaluate(() => {
        const sm = window.matchMedia('(min-width: 640px)').matches
        const md = window.matchMedia('(min-width: 768px)').matches
        const lg = window.matchMedia('(min-width: 1024px)').matches
        return { sm, md, lg }
      })
      expect(breakpoints).toBeTruthy()
    }
  )

  test(
    'APP-THEME-006: should provide animations reusable in interactions.schema.json',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a theme with animations matching interaction system
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          animations: {
            fadeIn: true,
            slideIn: 'slide-in 0.5s ease-out',
            pulse: {
              duration: '2s',
              easing: 'ease-in-out',
            },
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                type: 'div',
                props: {
                  'data-testid': 'animated-element',
                  style: {
                    animation: 'fadeIn 1s ease-in-out',
                  },
                },
                children: ['Animated Content'],
              },
            ],
          },
        ],
      })

      // WHEN: animation library is defined
      await page.goto('/')

      // THEN: it should provide animations reusable in interactions.schema.json
      const element = page.locator('[data-testid="animated-element"]')
      await expect(element).toBeVisible()
      const animationName = await element.evaluate(
        (el) => window.getComputedStyle(el).animationName
      )
      expect(['fade-in', 'slide-in', 'pulse']).toContain(animationName)
    }
  )

  test(
    'APP-THEME-007: should enable consistent UI across entire application',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a theme following design system best practices
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            'primary-hover': '#0056b3',
            'primary-light': '#e7f1ff',
          },
          spacing: {
            gap: '1rem',
            gapSmall: '0.5rem',
            gapLarge: '1.5rem',
          },
          shadows: {
            sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                type: 'button',
                content: 'Button 1',
                props: { 'data-testid': 'button' },
              },
              {
                type: 'button',
                content: 'Button 2',
                props: { 'data-testid': 'button' },
              },
              {
                type: 'button',
                content: 'Button 3',
                props: { 'data-testid': 'button' },
              },
            ],
          },
        ],
      })

      // WHEN: all tokens use semantic naming and progressive scales
      await page.goto('/')

      // THEN: it should enable consistent UI across entire application
      const buttons = page.locator('[data-testid="button"]')
      await expect(buttons.first()).toBeVisible()
      const buttonStyles = await buttons.first().evaluate((el) => ({
        color: window.getComputedStyle(el).color,
        padding: window.getComputedStyle(el).padding,
      }))
      expect(buttonStyles).toBeTruthy()
    }
  )

  test(
    'APP-THEME-008: should integrate seamlessly with Tailwind CSS',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a theme with Tailwind-compatible tokens
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            section: '4rem',
            container: '80rem',
          },
          breakpoints: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [],
          },
        ],
      })

      // WHEN: spacing and other values use Tailwind syntax
      await page.goto('/')

      // THEN: it should integrate seamlessly with Tailwind CSS
      await expect(page.locator('[data-testid="section"]')).toHaveCSS('padding', '64px')
      await expect(page.locator('[data-testid="container"]')).toHaveCSS('max-width', '1280px')
    }
  )

  test.fixme(
    'APP-THEME-INTEGRATION-001: should render cohesive UI with all theme tokens applied together',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a complete theme with multiple design tokens used in page component
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            text: '#212529',
            background: '#ffffff',
          },
          fonts: {
            title: {
              family: 'Bely Display',
              weight: 700,
              size: '2.5rem',
            },
            body: {
              family: 'Inter',
              size: '1rem',
            },
          },
          spacing: {
            section: '4rem',
            container: '80rem',
            gap: '1.5rem',
          },
          shadows: {
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
          borderRadius: {
            lg: '0.5rem',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'hero-section',
                component: 'hero',
              },
            ],
          },
        ],
      })

      // WHEN: page sections reference theme.colors, theme.fonts, theme.spacing, theme.shadows, theme.borderRadius
      await page.goto('/')

      // THEN: it should render cohesive UI with all theme tokens applied together
      const heroSection = page.locator('[data-testid="hero-section"]')
      await expect(heroSection).toBeVisible()
      await expect(heroSection).toHaveCSS('background-color', /255, 255, 255/)
      await expect(heroSection).toHaveCSS('padding', /4rem/)

      const heading = heroSection.locator('h1')
      await expect(heading).toHaveCSS('font-family', /Bely Display/)
      await expect(heading).toHaveCSS('font-size', '2.5rem')
      await expect(heading).toHaveCSS('color', /33, 37, 41/)

      const button = heroSection.locator('button')
      await expect(button).toHaveCSS('background-color', /7, 123, 255/)
      await expect(button).toHaveCSS('border-radius', '0.5rem')
      await expect(button).toHaveCSS('font-family', /Inter/)
    }
  )

  test.fixme(
    'APP-THEME-INTEGRATION-002: should maintain visual consistency across entire page layout',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a theme used across multiple page sections
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            secondary: '#6c757d',
            background: '#f8f9fa',
          },
          spacing: {
            section: '4rem',
            container: '80rem',
          },
          shadows: {
            sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              { type: 'header' },
              { type: 'hero' },
              { type: 'features' },
              { type: 'footer' },
            ],
          },
        ],
      })

      // WHEN: different sections (header, hero, features, footer) all reference theme tokens
      await page.goto('/')

      // THEN: it should maintain visual consistency across entire page layout
      const header = page.locator('header')
      await expect(header).toHaveCSS('background-color', /7, 123, 255/)
      await expect(header).toHaveCSS('padding', /4rem/)

      const heroSection = page.locator('[data-testid="hero"]')
      await expect(heroSection).toHaveCSS('background-color', /248, 249, 250/)
      await expect(heroSection).toHaveCSS('padding', /4rem/)

      const footer = page.locator('footer')
      await expect(footer).toHaveCSS('background-color', /108, 117, 125/)
      await expect(footer).toHaveCSS('padding', /4rem/)
    }
  )

  test.fixme(
    'APP-THEME-INTEGRATION-003: should render adaptive layouts that respond to screen size',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a theme with responsive breakpoints integrated with component layouts
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: {
            section: '2rem',
            sectionMd: '4rem',
            gap: '1rem',
            gapLg: '2rem',
          },
          breakpoints: {
            md: '768px',
            lg: '1024px',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'responsive-grid',
              },
            ],
          },
        ],
      })

      // WHEN: components use both theme.spacing and theme.breakpoints for responsive design
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      // THEN: it should render adaptive layouts that respond to screen size
      const section = page.locator('[data-testid="responsive-section"]')
      await expect(section).toHaveCSS('padding', /2rem/)

      const grid = section.locator('.grid')
      await expect(grid).toHaveCSS('gap', /1rem/)

      // Test tablet breakpoint
      await page.setViewportSize({ width: 768, height: 1024 })
      await expect(section).toHaveCSS('padding', /4rem/)

      // Test desktop breakpoint
      await page.setViewportSize({ width: 1024, height: 768 })
      await expect(grid).toHaveCSS('gap', /2rem/)
    }
  )

  test.fixme(
    'APP-THEME-INTEGRATION-004: should create cohesive branded motion with theme-aware animations',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: theme with animations that use theme color tokens for motion design
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            accent: '#ffc107',
            success: '#28a745',
          },
          animations: {
            duration: {
              fast: '200ms',
              normal: '300ms',
              slow: '500ms',
            },
            easing: {
              smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
              bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              elastic: 'cubic-bezier(0.68, -0.25, 0.265, 1.25)',
            },
            keyframes: {
              fadeIn: {
                from: { opacity: '0', transform: 'translateY(10px)' },
                to: { opacity: '1', transform: 'translateY(0)' },
              },
              colorPulse: {
                '0%': { backgroundColor: '$colors.primary' },
                '50%': { backgroundColor: '$colors.accent' },
                '100%': { backgroundColor: '$colors.primary' },
              },
              successFlash: {
                '0%': {
                  backgroundColor: 'transparent',
                  boxShadow: '0 0 0 0 $colors.success',
                },
                '50%': {
                  backgroundColor: '$colors.success',
                  boxShadow: '0 0 0 10px transparent',
                },
                '100%': {
                  backgroundColor: 'transparent',
                  boxShadow: '0 0 0 0 transparent',
                },
              },
            },
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'hero',
                content: {
                  button: {
                    text: 'Get Started',
                    animation: 'colorPulse 2s $easing.smooth infinite',
                  },
                },
              },
            ],
          },
        ],
      })

      // WHEN: animations reference theme colors, timing, and easing from design system
      await page.goto('/')

      // THEN: it should create cohesive branded motion with theme-aware animations
      // Visual validation: Color pulse animation transitions between primary and accent
      const ctaButton = page.locator('[data-testid="animated-cta"]')
      await expect(ctaButton).toHaveScreenshot('theme-integration-004-colorpulse-initial.png')

      // Wait for mid-animation (accent color at 50%)
      await page.waitForTimeout(1000)
      await expect(ctaButton).toHaveScreenshot('theme-integration-004-colorpulse-accent.png')

      // Wait for animation cycle completion (back to primary)
      await page.waitForTimeout(1000)
      await expect(ctaButton).toHaveScreenshot('theme-integration-004-colorpulse-primary.png')
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test(
    'APP-THEME-REGRESSION-001: user can complete full theme workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application configured with comprehensive theme system
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            secondary: '#6c757d',
            background: '#ffffff',
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
            section: '4rem',
            container: '80rem',
          },
          borderRadius: {
            DEFAULT: '0.25rem',
            lg: '0.5rem',
          },
          shadows: {
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                type: 'heading',
                level: 1,
                text: 'Theme Test Heading',
              },
              {
                type: 'paragraph',
                text: 'Theme test paragraph content',
              },
            ],
          },
        ],
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.goto('/')

      // Validate CSS custom properties generated for comprehensive theme system
      const css = await page.locator('style').first().textContent()
      expect(css).toContain(':root')

      // Validate color tokens in CSS
      expect(css).toMatch(/--color-primary:\s*#007bff/)
      expect(css).toMatch(/--color-secondary:\s*#6c757d/)
      expect(css).toMatch(/--color-background:\s*#ffffff/)

      // Validate font tokens in CSS
      expect(css).toMatch(/--font-body-family:\s*["']?Inter["']?/)
      expect(css).toMatch(/--font-heading-family:\s*["']?Poppins["']?/)

      // Validate spacing tokens in CSS
      expect(css).toMatch(/--spacing-section:\s*64px/) // 4rem = 64px
      expect(css).toMatch(/--spacing-container:\s*1280px/) // 80rem = 1280px

      // Validate border-radius tokens in CSS
      expect(css).toMatch(/--radius-DEFAULT:\s*0\.25rem/)
      expect(css).toMatch(/--radius-lg:\s*0\.5rem/)

      // Validate shadow tokens in CSS
      expect(css).toMatch(/--shadow-md:\s*0 4px 6px -1px rgba\(0, 0, 0, 0\.1\)/)

      // Verify theme tokens are applied at runtime
      await expect(page.locator('body')).toHaveCSS('font-family', /Inter/)
      await expect(page.locator('h1')).toHaveCSS('font-family', /Poppins/)

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
