/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Font Configuration
 *
 * Source: specs/app/theme/fonts/fonts.schema.json
 * Spec Count: 12
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (12 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Font Configuration', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-THEME-FONTS-001: should validate font family as the only required property',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a font with only family defined
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          fonts: {
            body: {
              family: 'Inter',
            },
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

      // WHEN: font uses minimal configuration
      await page.goto('/')

      // THEN: it should validate font family as the only required property
      await expect(page.locator('body')).toHaveCSS('font-family', /Inter/)
    }
  )

  test.fixme(
    'APP-THEME-FONTS-002: should validate graceful fallback for missing fonts',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a font with family and fallback stack
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          fonts: {
            body: {
              family: 'Inter',
              fallback: 'system-ui, sans-serif',
            },
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

      // WHEN: font includes fallback fonts (e.g., 'Inter', 'system-ui, sans-serif')
      await page.goto('/')

      // THEN: it should validate graceful fallback for missing fonts
      const fontFamily = await page
        .locator('body')
        .evaluate((el) => window.getComputedStyle(el).fontFamily)
      expect(fontFamily).toContain('Inter')
    }
  )

  test.fixme(
    'APP-THEME-FONTS-003: should validate weight values from 100-900 in increments of 100',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a font with multiple weights [300, 400, 500, 600, 700]
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          fonts: {
            body: {
              family: 'Inter',
              weights: [300, 400, 500, 600, 700],
            },
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

      // WHEN: font supports various weight options
      await page.goto('/')

      // THEN: it should validate weight values from 100-900 in increments of 100
      await expect(page.locator('[data-testid="font-weights"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-FONTS-004: should validate normal, italic, or oblique styles',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a font with style set to 'italic'
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          fonts: {
            title: {
              family: 'Georgia',
              style: 'italic',
            },
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

      // WHEN: font uses italic style
      await page.goto('/')

      // THEN: it should validate normal, italic, or oblique styles
      await expect(page.locator('h1')).toHaveCSS('font-style', 'italic')
    }
  )

  test.fixme(
    'APP-THEME-FONTS-005: should validate typography metrics for body text',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a font with size '16px' and lineHeight '1.5'
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          fonts: {
            body: {
              family: 'Inter',
              size: '16px',
              lineHeight: '1.5',
            },
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

      // WHEN: font defines default size and line spacing
      await page.goto('/')

      // THEN: it should validate typography metrics for body text
      await expect(page.locator('body')).toHaveCSS('font-size', '16px')
      await expect(page.locator('body')).toHaveCSS('line-height', '24px')
    }
  )

  test.fixme(
    'APP-THEME-FONTS-006: should validate character spacing for readability',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a font with letterSpacing '0.05em'
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          fonts: {
            title: {
              family: 'Bely Display',
              letterSpacing: '0.05em',
            },
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

      // WHEN: font includes letter spacing for display text
      await page.goto('/')

      // THEN: it should validate character spacing for readability
      await expect(page.locator('h1')).toHaveCSS('letter-spacing', /0\.05em|0\.8px/)
    }
  )

  test.fixme(
    'APP-THEME-FONTS-007: should validate none, uppercase, lowercase, or capitalize',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a font with transform 'uppercase'
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          fonts: {
            label: {
              family: 'Inter',
              transform: 'uppercase',
            },
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

      // WHEN: font uses text transformation
      await page.goto('/')

      // THEN: it should validate none, uppercase, lowercase, or capitalize
      await expect(page.locator('[data-testid="label"]')).toHaveCSS('text-transform', 'uppercase')
    }
  )

  test.fixme(
    'APP-THEME-FONTS-008: should validate font URL for remote loading',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a font with Google Fonts URL
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          fonts: {
            body: {
              family: 'Inter',
              url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300..700',
            },
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

      // WHEN: font is loaded from external source
      await page.goto('/')

      // THEN: it should validate font URL for remote loading
      const linkTag = page.locator('link[href*="fonts.googleapis.com"]')
      await expect(linkTag).toHaveAttribute('rel', 'stylesheet')
    }
  )

  test.fixme(
    'APP-THEME-FONTS-009: should validate comprehensive typography settings',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a complete font config with all properties
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          fonts: {
            body: {
              family: 'Inter',
              fallback: 'system-ui, sans-serif',
              weights: [400, 700],
              style: 'normal',
              size: '16px',
              lineHeight: '1.5',
              letterSpacing: '0',
              transform: 'none',
              url: 'https://fonts.googleapis.com/css2?family=Inter',
            },
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

      // WHEN: font is fully configured
      await page.goto('/')

      // THEN: it should validate comprehensive typography settings
      await expect(page.locator('body')).toHaveCSS('font-family', /Inter/)
      await expect(page.locator('body')).toHaveCSS('font-size', '16px')
    }
  )

  test.fixme(
    'APP-THEME-FONTS-010: should validate semantic font system for all UI contexts',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a theme with multiple font categories (title, body, mono)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          fonts: {
            title: {
              family: 'Bely Display',
              fallback: 'Georgia, serif',
            },
            body: {
              family: 'Inter',
              fallback: 'system-ui, sans-serif',
            },
            mono: {
              family: 'JetBrains Mono',
              fallback: 'monospace',
            },
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

      // WHEN: different fonts are defined for headings, body text, and code
      await page.goto('/')

      // THEN: it should validate semantic font system for all UI contexts
      await expect(page.locator('h1')).toHaveCSS('font-family', /Bely Display/)
      await expect(page.locator('body')).toHaveCSS('font-family', /Inter/)
      await expect(page.locator('code')).toHaveCSS('font-family', /JetBrains Mono/)
    }
  )

  test.fixme(
    'APP-THEME-FONTS-APPLICATION-001: should render with body font family and metrics',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: body font applied to paragraph
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          fonts: {
            body: {
              family: 'Inter',
              fallback: 'sans-serif',
              size: '16px',
              lineHeight: '1.5',
            },
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'paragraph',
                content: 'Body text',
              },
            ],
          },
        ],
      })

      // WHEN: paragraph uses theme.fonts.body
      await page.goto('/')

      // THEN: it should render with body font family and metrics
      const paragraph = page.locator('p')
      await expect(paragraph).toHaveCSS('font-family', /Inter/)
      await expect(paragraph).toHaveCSS('font-size', '16px')
      await expect(paragraph).toHaveCSS('line-height', '24px')
    }
  )

  test.fixme(
    'APP-THEME-FONTS-APPLICATION-002: should render with title font and text transformation',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: title font applied to heading
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          fonts: {
            title: {
              family: 'Bely Display',
              transform: 'lowercase',
              letterSpacing: '0.05em',
            },
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'heading',
                content: 'Our Mission',
              },
            ],
          },
        ],
      })

      // WHEN: heading uses theme.fonts.title with transform
      await page.goto('/')

      // THEN: it should render with title font and text transformation
      const heading = page.locator('h1')
      await expect(heading).toHaveCSS('font-family', /Bely Display/)
      await expect(heading).toHaveCSS('text-transform', 'lowercase')
      await expect(heading).toHaveText('our mission')
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'APP-THEME-FONTS-FONTS-REGRESSION-001: user can complete full fonts workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application with comprehensive font system
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          fonts: {
            title: {
              family: 'Bely Display',
              fallback: 'Georgia, serif',
            },
            body: {
              family: 'Inter',
              fallback: 'sans-serif',
              size: '16px',
              lineHeight: '1.5',
            },
            mono: {
              family: 'JetBrains Mono',
              fallback: 'monospace',
            },
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
                type: 'paragraph',
                content: 'Body text',
              },
              {
                type: 'code',
                content: 'console.log()',
              },
            ],
          },
        ],
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.goto('/')

      // Verify title font
      await expect(page.locator('h1')).toHaveCSS('font-family', /Bely Display/)

      // Verify body font
      await expect(page.locator('p')).toHaveCSS('font-family', /Inter/)
      await expect(page.locator('p')).toHaveCSS('font-size', '16px')

      // Verify mono font
      await expect(page.locator('code')).toHaveCSS('font-family', /JetBrains Mono/)

      // Focus on workflow continuity, not exhaustive coverage
    }
  )
})
