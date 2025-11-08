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

  test(
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
                  style: {
                    backgroundColor: '$theme.colors.primary',
                    color: '$theme.colors.secondary',
                    padding: '20px',
                  },
                },
                children: ['Primary Color Text'],
              },
            ],
          },
        ],
      })

      // WHEN: colors are defined with hex values
      await page.goto('/')

      // THEN: it should validate 6-digit hex colors at build time
      // Visual validation captures all color properties
      await expect(page.locator('[data-testid="color-primary"]')).toHaveScreenshot(
        'colors-001-hex-colors.png',
        {
          animations: 'disabled',
          threshold: 0.2, // Color tolerance
        }
      )
    }
  )

  test(
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
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                type: 'div',
                props: {
                  'data-testid': 'color-primary-transparent',
                  style: {
                    backgroundColor: '$theme.colors.primary-transparent',
                    padding: '40px',
                    position: 'relative',
                  },
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '50%',
                        backgroundColor: '#ffffff',
                        zIndex: '-1',
                      },
                    },
                  },
                  'Transparent Background (50% opacity)',
                ],
              },
            ],
          },
        ],
      })

      // WHEN: color includes alpha channel
      await page.goto('/')

      // THEN: it should validate 8-digit hex colors with opacity at build time
      // Visual validation captures transparency effect
      await expect(page.locator('[data-testid="color-primary-transparent"]')).toHaveScreenshot(
        'colors-002-hex-opacity.png',
        {
          animations: 'disabled',
          threshold: 0.2,
        }
      )
    }
  )

  test(
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
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                type: 'div',
                props: {
                  'data-testid': 'color-danger',
                  style: {
                    backgroundColor: '$theme.colors.danger',
                    padding: '20px',
                    color: '#ffffff',
                  },
                },
                children: ['Danger Color (RGB format)'],
              },
            ],
          },
        ],
      })

      // WHEN: color is defined as rgb(255, 0, 0)
      await page.goto('/')

      // THEN: it should validate rgb color format at build time
      // Visual validation captures RGB color rendering
      await expect(page.locator('[data-testid="color-danger"]')).toHaveScreenshot(
        'colors-003-rgb-format.png',
        {
          animations: 'disabled',
          threshold: 0.2,
        }
      )
    }
  )

  test(
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
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                type: 'div',
                props: {
                  'data-testid': 'color-danger-semi',
                  style: {
                    backgroundColor: '$theme.colors.danger-semi',
                    padding: '40px',
                    color: '#ffffff',
                  },
                },
                children: ['Danger Semi-transparent (RGBA)'],
              },
            ],
          },
        ],
      })

      // WHEN: color is defined as rgba(255, 0, 0, 0.5)
      await page.goto('/')

      // THEN: it should validate rgba color format with alpha at build time
      // Visual validation captures RGBA transparency
      await expect(page.locator('[data-testid="color-danger-semi"]')).toHaveScreenshot(
        'colors-004-rgba-format.png',
        {
          animations: 'disabled',
          threshold: 0.2,
        }
      )
    }
  )

  test(
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
                  style: {
                    backgroundColor: '$theme.colors.primary',
                    padding: '20px',
                    color: '#ffffff',
                  },
                },
                children: ['Primary Color (HSL format)'],
              },
            ],
          },
        ],
      })

      // WHEN: color is defined as hsl(210, 100%, 50%)
      await page.goto('/')

      // THEN: it should validate hsl color format at build time
      // Visual validation captures HSL color rendering
      await expect(page.locator('[data-testid="color-primary"]')).toHaveScreenshot(
        'colors-005-hsl-format.png',
        {
          animations: 'disabled',
          threshold: 0.2,
        }
      )
    }
  )

  test(
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
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                type: 'div',
                props: {
                  'data-testid': 'color-primary-overlay',
                  style: {
                    backgroundColor: '$theme.colors.primary-overlay',
                    padding: '40px',
                    color: '#ffffff',
                  },
                },
                children: ['Primary Overlay (HSLA)'],
              },
            ],
          },
        ],
      })

      // WHEN: color is defined as hsla(210, 100%, 50%, 0.8)
      await page.goto('/')

      // THEN: it should validate hsla color format with alpha at build time
      // Visual validation captures HSLA transparency
      await expect(page.locator('[data-testid="color-primary-overlay"]')).toHaveScreenshot(
        'colors-006-hsla-format.png',
        {
          animations: 'disabled',
          threshold: 0.2,
        }
      )
    }
  )

  test(
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
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                type: 'div',
                props: {
                  'data-testid': 'color-variants',
                  style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    gap: '16px',
                  },
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.primary',
                        padding: '20px',
                        color: '#ffffff',
                        textAlign: 'center',
                      },
                    },
                    children: ['Primary'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.primary-hover',
                        padding: '20px',
                        color: '#ffffff',
                        textAlign: 'center',
                      },
                    },
                    children: ['Hover'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.primary-light',
                        padding: '20px',
                        color: '#000000',
                        textAlign: 'center',
                      },
                    },
                    children: ['Light'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.primary-dark',
                        padding: '20px',
                        color: '#ffffff',
                        textAlign: 'center',
                      },
                    },
                    children: ['Dark'],
                  },
                ],
              },
            ],
          },
        ],
      })

      // WHEN: colors use kebab-case variant naming
      await page.goto('/')

      // THEN: it should validate color variants for hover states and tints
      // Visual validation shows all variants side-by-side
      await expect(page.locator('[data-testid="color-variants"]')).toHaveScreenshot(
        'colors-007-variants.png',
        {
          animations: 'disabled',
          threshold: 0.2,
        }
      )
    }
  )

  test(
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
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                type: 'div',
                props: {
                  'data-testid': 'color-scale',
                  style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '8px',
                  },
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.gray-100',
                        padding: '24px',
                        textAlign: 'center',
                        color: '#000000',
                      },
                    },
                    children: ['100'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.gray-300',
                        padding: '24px',
                        textAlign: 'center',
                        color: '#000000',
                      },
                    },
                    children: ['300'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.gray-500',
                        padding: '24px',
                        textAlign: 'center',
                        color: '#ffffff',
                      },
                    },
                    children: ['500'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.gray-700',
                        padding: '24px',
                        textAlign: 'center',
                        color: '#ffffff',
                      },
                    },
                    children: ['700'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.gray-900',
                        padding: '24px',
                        textAlign: 'center',
                        color: '#ffffff',
                      },
                    },
                    children: ['900'],
                  },
                ],
              },
            ],
          },
        ],
      })

      // WHEN: colors use numbered scale system
      await page.goto('/')

      // THEN: it should validate numbered color scales for systematic gradients
      // Visual validation shows complete scale progression
      await expect(page.locator('[data-testid="color-scale"]')).toHaveScreenshot(
        'colors-008-numbered-scale.png',
        {
          animations: 'disabled',
          threshold: 0.2,
        }
      )
    }
  )

  test(
    'APP-THEME-COLORS-009: should validate comprehensive color system for all UI needs',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
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
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                type: 'div',
                props: {
                  'data-testid': 'color-system',
                  style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px',
                  },
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.primary',
                        padding: '20px',
                        color: '#ffffff',
                        textAlign: 'center',
                      },
                    },
                    children: ['Primary'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.secondary',
                        padding: '20px',
                        color: '#ffffff',
                        textAlign: 'center',
                      },
                    },
                    children: ['Secondary'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.success',
                        padding: '20px',
                        color: '#ffffff',
                        textAlign: 'center',
                      },
                    },
                    children: ['Success'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.danger',
                        padding: '20px',
                        color: '#ffffff',
                        textAlign: 'center',
                      },
                    },
                    children: ['Danger'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.warning',
                        padding: '20px',
                        color: '#000000',
                        textAlign: 'center',
                      },
                    },
                    children: ['Warning'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.info',
                        padding: '20px',
                        color: '#ffffff',
                        textAlign: 'center',
                      },
                    },
                    children: ['Info'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.light',
                        padding: '20px',
                        color: '#000000',
                        textAlign: 'center',
                        border: '1px solid #dee2e6',
                      },
                    },
                    children: ['Light'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.dark',
                        padding: '20px',
                        color: '#ffffff',
                        textAlign: 'center',
                      },
                    },
                    children: ['Dark'],
                  },
                ],
              },
            ],
          },
        ],
      })

      // WHEN: palette includes primary, secondary, success, danger, warning, info, light, dark, grays
      await page.goto('/')

      // THEN: it should validate comprehensive color system for all UI needs
      // Visual validation shows complete semantic color palette
      await expect(page.locator('[data-testid="color-system"]')).toHaveScreenshot(
        'colors-009-comprehensive-system.png',
        {
          animations: 'disabled',
          threshold: 0.2,
        }
      )
    }
  )

  test(
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
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                type: 'div',
                props: {
                  'data-testid': 'kebab-case-colors',
                  style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                  },
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        color: '$theme.colors.text-primary',
                        padding: '20px',
                        textAlign: 'center',
                        border: '2px solid',
                        borderColor: '$theme.colors.border-subtle',
                      },
                    },
                    children: ['text-primary'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.background-light',
                        padding: '20px',
                        textAlign: 'center',
                        border: '2px solid',
                        borderColor: '$theme.colors.border-subtle',
                      },
                    },
                    children: ['background-light'],
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        backgroundColor: '$theme.colors.primary',
                        padding: '20px',
                        color: '#ffffff',
                        textAlign: 'center',
                      },
                    },
                    children: ['primary'],
                  },
                ],
              },
            ],
          },
        ],
      })

      // WHEN: color names use multi-word kebab-case format
      await page.goto('/')

      // THEN: it should validate kebab-case naming convention
      // Visual validation shows kebab-case color application
      await expect(page.locator('[data-testid="kebab-case-colors"]')).toHaveScreenshot(
        'colors-010-kebab-case.png',
        {
          animations: 'disabled',
          threshold: 0.2,
        }
      )
    }
  )

  test(
    'APP-THEME-COLORS-APPLICATION-001: should render button with primary background color',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
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
      await expect(button).toHaveScreenshot('color-app-001-button-primary.png')
    }
  )

  test(
    'APP-THEME-COLORS-APPLICATION-002: should render darker blue on hover',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
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
      await expect(button).toHaveScreenshot('color-app-002-button-hover.png')
    }
  )

  test(
    'APP-THEME-COLORS-APPLICATION-003: should render text with theme text color',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
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
      await expect(heading).toHaveScreenshot('color-app-003-heading-text.png')
    }
  )

  test(
    'APP-THEME-COLORS-APPLICATION-004: should render green alert indicating success state',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
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
      await expect(alert).toHaveScreenshot('color-app-004-alert-success.png')
    }
  )

  test(
    'APP-THEME-COLORS-APPLICATION-005: should create visual hierarchy through tonal variation',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
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
            name: 'home',
            path: '/',
            meta: {
              lang: 'en-US',
              title: 'Test Page',
              description: 'Test page for color hierarchy',
            },
            sections: [
              {
                type: 'div',
                props: {
                  'data-testid': 'page-background',
                  style: {
                    backgroundColor: '$theme.colors.gray-100',
                    padding: '20px',
                  },
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      'data-testid': 'card',
                      style: {
                        backgroundColor: '#ffffff',
                        border: '1px solid',
                        borderColor: '$theme.colors.gray-300',
                        padding: '16px',
                      },
                    },
                    children: [
                      {
                        type: 'heading',
                        content: 'Main Heading',
                        props: {
                          'data-testid': 'heading',
                          style: {
                            color: '$theme.colors.gray-900',
                          },
                        },
                      },
                      {
                        type: 'span',
                        children: ['Placeholder text'],
                        props: {
                          'data-testid': 'placeholder',
                          style: {
                            color: '$theme.colors.gray-500',
                          },
                        },
                      },
                    ],
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
      // 1. Page background: gray-100 (#f8f9fa)
      const pageBackground = page.locator('[data-testid="page-background"]')
      const pageBgColor = await pageBackground.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor
      )
      expect(pageBgColor).toBe('rgb(248, 249, 250)') // gray-100

      // 2. Card border: gray-300 (#dee2e6)
      const card = page.locator('[data-testid="card"]')
      const cardBorderColor = await card.evaluate((el) => window.getComputedStyle(el).borderColor)
      expect(cardBorderColor).toBe('rgb(222, 226, 230)') // gray-300

      // 3. Placeholder text: gray-500 (#adb5bd)
      const placeholder = page.locator('[data-testid="placeholder"]')
      const placeholderColor = await placeholder.evaluate((el) => window.getComputedStyle(el).color)
      expect(placeholderColor).toBe('rgb(173, 181, 189)') // gray-500

      // 4. Heading text: gray-900 (#212529)
      const heading = page.locator('[data-testid="heading"]')
      const headingColor = await heading.evaluate((el) => window.getComputedStyle(el).color)
      expect(headingColor).toBe('rgb(33, 37, 41)') // gray-900
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'APP-THEME-COLORS-REGRESSION-001: user can complete full colors workflow',
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
