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

  test(
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
      const body = page.locator('body')
      await expect(body).toHaveScreenshot('font-001-family-required.png')
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
      const body = page.locator('body')
      await expect(body).toHaveScreenshot('font-002-fallback.png')
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
            sections: [
              {
                type: 'div',
                props: {
                  'data-testid': 'font-weights',
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    padding: '20px',
                  },
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '300',
                        fontSize: '18px',
                      },
                    },
                    children: ['Font Weight 300 - Light'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '400',
                        fontSize: '18px',
                      },
                    },
                    children: ['Font Weight 400 - Regular'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '500',
                        fontSize: '18px',
                      },
                    },
                    children: ['Font Weight 500 - Medium'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '600',
                        fontSize: '18px',
                      },
                    },
                    children: ['Font Weight 600 - Semibold'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '700',
                        fontSize: '18px',
                      },
                    },
                    children: ['Font Weight 700 - Bold'],
                  },
                ],
              },
            ],
          },
        ],
      })

      // WHEN: font supports various weight options
      await page.goto('/')

      // THEN: it should validate weight values from 100-900 in increments of 100
      // Visual validation shows weight progression
      await expect(page.locator('[data-testid="font-weights"]')).toHaveScreenshot(
        'font-003-weights.png',
        {
          animations: 'disabled',
        }
      )
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
      const heading = page.locator('h1')
      await expect(heading).toHaveScreenshot('font-004-italic-style.png')
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
      const body = page.locator('body')
      await expect(body).toHaveScreenshot('font-005-metrics.png')
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
      const heading = page.locator('h1')
      await expect(heading).toHaveScreenshot('font-006-letter-spacing.png')
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
      const label = page.locator('[data-testid="label"]')
      await expect(label).toHaveScreenshot('font-007-text-transform.png')
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
      const body = page.locator('body')
      await expect(body).toHaveScreenshot('font-009-comprehensive.png')
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
      const heading = page.locator('h1')
      const body = page.locator('body')
      const code = page.locator('code')
      await expect(heading).toHaveScreenshot('font-010-title.png')
      await expect(body).toHaveScreenshot('font-010-body.png')
      await expect(code).toHaveScreenshot('font-010-mono.png')
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
      await expect(paragraph).toHaveScreenshot('font-app-001-paragraph.png')
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
      await expect(heading).toHaveScreenshot('font-app-002-heading-transform.png')
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'APP-THEME-FONTS-REGRESSION-001: user can complete full fonts workflow',
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
              size: '32px',
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
              size: '14px',
            },
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'div',
                props: {
                  'data-testid': 'font-system',
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    padding: '20px',
                  },
                },
                children: [
                  {
                    type: 'h1',
                    props: {
                      style: {
                        fontFamily: '$theme.fonts.title.family',
                        fontSize: '$theme.fonts.title.size',
                      },
                    },
                    children: ['Welcome to Omnera'],
                  },
                  {
                    type: 'p',
                    props: {
                      style: {
                        fontFamily: '$theme.fonts.body.family',
                        fontSize: '$theme.fonts.body.size',
                        lineHeight: '$theme.fonts.body.lineHeight',
                      },
                    },
                    children: [
                      'This is body text using Inter font family with 16px size and 1.5 line-height for optimal readability.',
                    ],
                  },
                  {
                    type: 'code',
                    props: {
                      style: {
                        fontFamily: '$theme.fonts.mono.family',
                        fontSize: '$theme.fonts.mono.size',
                        display: 'block',
                        padding: '12px',
                        backgroundColor: '#f5f5f5',
                      },
                    },
                    children: ['console.log("Hello, World!")'],
                  },
                ],
              },
            ],
          },
        ],
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.goto('/')

      // 1. Structure validation (ARIA)
      await expect(page.locator('[data-testid="font-system"]')).toMatchAriaSnapshot(`
        - group:
          - heading "Welcome to Omnera" [level=1]
          - paragraph: "This is body text using Inter font family with 16px size and 1.5 line-height for optimal readability."
          - code: "console.log(\\"Hello, World!\\")"
      `)

      // 2. Visual validation (Screenshot) - captures all typography rendering
      await expect(page.locator('[data-testid="font-system"]')).toHaveScreenshot(
        'font-regression-001-complete-system.png',
        {
          animations: 'disabled',
        }
      )

      // Focus on workflow continuity, not exhaustive coverage
    }
  )
})
