/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Color Palette
 *
 * Source: specs/app/theme/colors/colors.schema.json
 * Spec Count: 15
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (15 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Color Palette', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-THEME-COLORS-001: should validate 6-digit hex colors at build time',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a color palette with semantic colors (primary, secondary)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            secondary: '#6c757d',
          },
        },
      })

      // WHEN: colors are defined with hex values
      await page.goto('/')

      // THEN: it should validate 6-digit hex colors at build time
      const primaryColor = await page
        .locator('[data-testid="color-primary"]')
        .evaluate((el) => window.getComputedStyle(el).getPropertyValue('--color-primary'))
      expect(primaryColor).toMatch(/#[0-9A-Fa-f]{6}/)
    }
  )

  test.fixme(
    'APP-THEME-COLORS-002: should validate 8-digit hex colors with opacity at build time',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a color with 8-digit hex value for transparency
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            'primary-transparent': '#007bff80',
          },
        },
      })

      // WHEN: color includes alpha channel
      await page.goto('/')

      // THEN: it should validate 8-digit hex colors with opacity at build time
      const colorValue = await page
        .locator('[data-testid="color-primary-transparent"]')
        .evaluate((el) =>
          window.getComputedStyle(el).getPropertyValue('--color-primary-transparent')
        )
      expect(colorValue).toMatch(/#[0-9A-Fa-f]{8}/)
    }
  )

  test.fixme(
    'APP-THEME-COLORS-003: should validate rgb color format at build time',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a color with rgb() format
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            danger: 'rgb(255, 0, 0)',
          },
        },
      })

      // WHEN: color is defined as rgb(255, 0, 0)
      await page.goto('/')

      // THEN: it should validate rgb color format at build time
      const colorValue = await page
        .locator('[data-testid="color-danger"]')
        .evaluate((el) => window.getComputedStyle(el).getPropertyValue('--color-danger'))
      expect(colorValue).toMatch(/rgb\(/)
    }
  )

  test.fixme(
    'APP-THEME-COLORS-004: should validate rgba color format with alpha at build time',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a color with rgba() format for transparency
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            'danger-semi': 'rgba(255, 0, 0, 0.5)',
          },
        },
      })

      // WHEN: color is defined as rgba(255, 0, 0, 0.5)
      await page.goto('/')

      // THEN: it should validate rgba color format with alpha at build time
      const colorValue = await page
        .locator('[data-testid="color-danger-semi"]')
        .evaluate((el) => window.getComputedStyle(el).getPropertyValue('--color-danger-semi'))
      expect(colorValue).toMatch(/rgba\(/)
    }
  )

  test.fixme(
    'APP-THEME-COLORS-005: should validate hsl color format at build time',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a color with hsl() format
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: 'hsl(210, 100%, 50%)',
          },
        },
      })

      // WHEN: color is defined as hsl(210, 100%, 50%)
      await page.goto('/')

      // THEN: it should validate hsl color format at build time
      const colorValue = await page
        .locator('[data-testid="color-primary"]')
        .evaluate((el) => window.getComputedStyle(el).getPropertyValue('--color-primary'))
      expect(colorValue).toMatch(/hsl\(/)
    }
  )

  test.fixme(
    'APP-THEME-COLORS-006: should validate hsla color format with alpha at build time',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a color with hsla() format for transparency
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            'primary-overlay': 'hsla(210, 100%, 50%, 0.8)',
          },
        },
      })

      // WHEN: color is defined as hsla(210, 100%, 50%, 0.8)
      await page.goto('/')

      // THEN: it should validate hsla color format with alpha at build time
      const colorValue = await page
        .locator('[data-testid="color-primary-overlay"]')
        .evaluate((el) => window.getComputedStyle(el).getPropertyValue('--color-primary-overlay'))
      expect(colorValue).toMatch(/hsla\(/)
    }
  )

  test.fixme(
    'APP-THEME-COLORS-007: should validate color variants for hover states and tints',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: color variants with suffixes (primary-hover, primary-light)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            'primary-hover': '#0056b3',
            'primary-light': '#e7f1ff',
            'primary-dark': '#003d7a',
          },
        },
      })

      // WHEN: colors use kebab-case variant naming
      await page.goto('/')

      // THEN: it should validate color variants for hover states and tints
      await expect(page.locator('[data-testid="color-primary"]')).toBeVisible()
      await expect(page.locator('[data-testid="color-primary-hover"]')).toBeVisible()
      await expect(page.locator('[data-testid="color-primary-light"]')).toBeVisible()
      await expect(page.locator('[data-testid="color-primary-dark"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-COLORS-008: should validate numbered color scales for systematic gradients',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: gray scale with numbered variants (gray-100 to gray-900)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            'gray-100': '#f8f9fa',
            'gray-300': '#dee2e6',
            'gray-500': '#adb5bd',
            'gray-700': '#495057',
            'gray-900': '#212529',
          },
        },
      })

      // WHEN: colors use numbered scale system
      await page.goto('/')

      // THEN: it should validate numbered color scales for systematic gradients
      await expect(page.locator('[data-testid="color-gray-100"]')).toBeVisible()
      await expect(page.locator('[data-testid="color-gray-900"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-COLORS-009: should validate comprehensive color system for all UI needs',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a complete color system with semantic, descriptive, and variant colors
      // WHEN: palette includes primary, secondary, success, danger, warning, info, light, dark, grays
      // THEN: it should validate comprehensive color system for all UI needs

      // GIVEN: a complete color system with semantic, descriptive, and variant colors
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            secondary: '#6c757d',
            success: '#28a745',
            danger: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8',
            light: '#f8f9fa',
            dark: '#343a40',
          },
        },
      })

      // WHEN: palette includes primary, secondary, success, danger, warning, info, light, dark, grays
      await page.goto('/')

      // THEN: it should validate comprehensive color system for all UI needs
      await expect(page.locator('[data-testid="color-primary"]')).toBeVisible()
      await expect(page.locator('[data-testid="color-success"]')).toBeVisible()
      await expect(page.locator('[data-testid="color-danger"]')).toBeVisible()
      await expect(page.locator('[data-testid="color-warning"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-COLORS-010: should validate kebab-case naming convention',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: color names in kebab-case (primary-color, background-primary)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            'text-primary': '#212529',
            'background-light': '#f8f9fa',
            'border-subtle': '#dee2e6',
          },
        },
      })

      // WHEN: color names use multi-word kebab-case format
      await page.goto('/')

      // THEN: it should validate kebab-case naming convention
      await expect(page.locator('[data-testid="color-text-primary"]')).toBeVisible()
      await expect(page.locator('[data-testid="color-background-light"]')).toBeVisible()
      await expect(page.locator('[data-testid="color-border-subtle"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-COLORS-APPLICATION-001: should render button with primary background color',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: primary color used in button component
      // WHEN: button applies theme.colors.primary
      // THEN: it should render button with primary background color

      // GIVEN: primary color used in button component
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'button',
                content: 'Click me',
                props: {
                  'data-testid': 'cta-button',
                },
              },
            ],
          },
        ],
      })

      // WHEN: button applies theme.colors.primary
      await page.goto('/')

      // THEN: it should render button with primary background color
      const button = page.locator('[data-testid="cta-button"]')
      await expect(button).toBeVisible()
      const bgColor = await button.evaluate((el) => window.getComputedStyle(el).backgroundColor)
      expect(bgColor).toContain('7, 123, 255') // rgb(7, 123, 255) = #007bff
    }
  )

  test.fixme(
    'APP-THEME-COLORS-APPLICATION-002: should render darker blue on hover',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: primary-hover color used on button:hover
      // WHEN: button hover state applies theme.colors.primary-hover
      // THEN: it should render darker blue on hover

      // GIVEN: primary-hover color used on button:hover
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            'primary-hover': '#0056b3',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'button',
                content: 'Hover me',
              },
            ],
          },
        ],
      })

      // WHEN: button hover state applies theme.colors.primary-hover
      await page.goto('/')

      // THEN: it should render darker blue on hover
      const button = page.locator('button')
      await button.hover()
      const hoverColor = await button.evaluate((el) => window.getComputedStyle(el).backgroundColor)
      expect(hoverColor).toContain('0, 86, 179') // rgb(0, 86, 179) = #0056b3
    }
  )

  test.fixme(
    'APP-THEME-COLORS-APPLICATION-003: should render text with theme text color',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: text color used in typography
      // WHEN: heading applies theme.colors.text
      // THEN: it should render text with theme text color

      // GIVEN: text color used in typography
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            text: '#212529',
            'text-muted': '#6c757d',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'heading',
                content: 'Page Title',
              },
            ],
          },
        ],
      })

      // WHEN: heading applies theme.colors.text
      await page.goto('/')

      // THEN: it should render text with theme text color
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()
      const textColor = await heading.evaluate((el) => window.getComputedStyle(el).color)
      expect(textColor).toContain('33, 37, 41') // rgb(33, 37, 41) = #212529
    }
  )

  test.fixme(
    'APP-THEME-COLORS-APPLICATION-004: should render green alert indicating success state',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: success color used in alert
      // WHEN: alert applies theme.colors.success
      // THEN: it should render green alert indicating success state

      // GIVEN: success color used in alert
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            success: '#28a745',
            'success-light': '#d4edda',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'alert',
                content: 'Success!',
                props: {
                  'data-testid': 'alert-success',
                  variant: 'success',
                },
              },
            ],
          },
        ],
      })

      // WHEN: alert applies theme.colors.success
      await page.goto('/')

      // THEN: it should render green alert indicating success state
      const alert = page.locator('[data-testid="alert-success"]')
      await expect(alert).toBeVisible()
      const bgColor = await alert.evaluate((el) => window.getComputedStyle(el).backgroundColor)
      expect(bgColor).toMatch(/212, 237, 218/) // rgb(212, 237, 218) = #d4edda
    }
  )

  test.fixme(
    'APP-THEME-COLORS-APPLICATION-005: should create visual hierarchy through tonal variation',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: gray scale used in UI hierarchy
      // WHEN: components use gray-100 to gray-900 for depth
      // THEN: it should create visual hierarchy through tonal variation

      // GIVEN: gray scale used in UI hierarchy
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            'gray-100': '#f8f9fa',
            'gray-300': '#dee2e6',
            'gray-500': '#adb5bd',
            'gray-900': '#212529',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'container',
                children: [
                  {
                    type: 'heading',
                    content: 'Main Heading',
                  },
                  {
                    type: 'text',
                    content: 'Placeholder text',
                    props: {
                      'data-testid': 'placeholder',
                    },
                  },
                ],
              },
            ],
          },
        ],
      })

      // WHEN: components use gray-100 to gray-900 for depth
      await page.goto('/')

      // THEN: it should create visual hierarchy through tonal variation
      const heading = page.locator('h1')
      const placeholder = page.locator('[data-testid="placeholder"]')

      const headingColor = await heading.evaluate((el) => window.getComputedStyle(el).color)
      const placeholderColor = await placeholder.evaluate((el) => window.getComputedStyle(el).color)

      expect(headingColor).toContain('33, 37, 41') // gray-900
      expect(placeholderColor).toContain('173, 181, 189') // gray-500
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full colors workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application with comprehensive color palette
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: {
            primary: '#007bff',
            'primary-hover': '#0056b3',
            success: '#28a745',
            danger: '#dc3545',
            text: '#212529',
            'gray-500': '#adb5bd',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'heading',
                content: 'Welcome',
              },
              {
                type: 'button',
                content: 'Get Started',
                props: {
                  'data-testid': 'cta-button',
                },
              },
              {
                type: 'alert',
                content: 'Success!',
                props: {
                  variant: 'success',
                },
              },
            ],
          },
        ],
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.goto('/')

      // Verify text color
      const heading = page.locator('h1')
      await expect(heading).toHaveText('Welcome')
      const textColor = await heading.evaluate((el) => window.getComputedStyle(el).color)
      expect(textColor).toContain('33, 37, 41')

      // Verify button color
      const button = page.locator('[data-testid="cta-button"]')
      await expect(button).toBeVisible()
      const btnColor = await button.evaluate((el) => window.getComputedStyle(el).backgroundColor)
      expect(btnColor).toContain('7, 123, 255')

      // Focus on workflow continuity, not exhaustive coverage
    }
  )
})
