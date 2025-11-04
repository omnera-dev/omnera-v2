/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Shadows
 *
 * Source: specs/app/theme/shadows/shadows.schema.json
 * Spec Count: 17 (16 @spec + 1 @regression)
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (16 tests: 6 validation + 10 application) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Shadows', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-THEME-SHADOWS-001: should validate elevation system from subtle to dramatic',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: shadow scale from sm to 2xl
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
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

      // WHEN: shadows increase in depth and blur
      await page.goto('/')

      // THEN: it should validate elevation system from subtle to dramatic
      await expect(page.locator('[data-testid="shadow-sm"]')).toBeVisible()
      await expect(page.locator('[data-testid="shadow-2xl"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-002: should validate rgb(0 0 0 / 0.1) format',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: shadow with rgb color and opacity
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
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

      // WHEN: shadow uses modern CSS color syntax
      await page.goto('/')

      // THEN: it should validate rgb(0 0 0 / 0.1) format
      // Validate CSS custom property generated in :root
      const css = await page.locator('style').first().textContent()
      expect(css).toContain(':root')
      expect(css).toMatch(/--shadow-md:\s*0 4px 6px -1px rgb\(0 0 0 \/ 0\.1\)/)

      // Visual validation
      const element = page.locator('[data-testid="shadow-md"]')
      await expect(element).toHaveScreenshot('shadow-002-rgb-format.png')
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-003: should validate inset box-shadow',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: inner shadow for inset effects
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
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

      // WHEN: shadow creates depth inside element
      await page.goto('/')

      // THEN: it should validate inset box-shadow
      const element = page.locator('[data-testid="shadow-inner"]')
      await expect(element).toHaveScreenshot('shadow-003-inset-box-shadow.png')
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-004: should validate shadow removal',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: shadow 'none' to remove shadows
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            none: '0 0 #0000',
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

      // WHEN: flat design with no elevation is needed
      await page.goto('/')

      // THEN: it should validate shadow removal
      const element = page.locator('[data-testid="shadow-none"]')
      await expect(element).toHaveScreenshot('shadow-004-none.png')
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-005: should validate kebab-case convention',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: shadows with kebab-case naming
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            'drop-shadow': '0 4px 6px rgb(0 0 0 / 0.1)',
            'card-shadow': '0 2px 4px rgb(0 0 0 / 0.05)',
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

      // WHEN: shadow uses multi-word names
      await page.goto('/')

      // THEN: it should validate kebab-case convention
      await expect(page.locator('[data-testid="shadow-drop-shadow"]')).toBeVisible()
      await expect(page.locator('[data-testid="shadow-card-shadow"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-006: should validate complete shadow system',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: complete shadow system (sm, md, lg, xl, 2xl, inner, none)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            sm: '0 1px 2px',
            md: '0 4px 6px',
            lg: '0 10px 15px',
            xl: '0 20px 25px',
            '2xl': '0 25px 50px',
            inner: 'inset 0 2px 4px',
            none: '0 0 #0000',
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

      // WHEN: all elevation tokens are defined
      await page.goto('/')

      // THEN: it should validate complete shadow system
      await expect(page.locator('[data-testid="shadow-sm"]')).toBeVisible()
      await expect(page.locator('[data-testid="shadow-none"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-APPLICATION-001: should render card with medium box-shadow creating depth',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: md shadow applied to card component
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'card',
                content: 'Card content',
                props: {
                  'data-testid': 'product-card',
                },
              },
            ],
          },
        ],
      })

      // WHEN: card uses theme.shadows.md for moderate elevation
      await page.goto('/')

      // THEN: it should render card with medium box-shadow creating depth
      const card = page.locator('[data-testid="product-card"]')
      await expect(card).toHaveScreenshot('shadow-app-001-card-depth.png')
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-APPLICATION-002: should render modal with dramatic shadow emphasizing importance',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: xl shadow applied to modal overlay
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'modal',
                content: 'Modal content',
                props: {
                  'data-testid': 'confirmation-modal',
                },
              },
            ],
          },
        ],
      })

      // WHEN: modal uses theme.shadows.xl for high elevation above content
      await page.goto('/')

      // THEN: it should render modal with dramatic shadow emphasizing importance
      const modal = page.locator('[data-testid="confirmation-modal"]')
      await expect(modal).toHaveScreenshot('shadow-app-002-modal-dramatic.png')
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-APPLICATION-003: should render input with inset shadow creating depth inward',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: inner shadow applied to input field
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'input',
                props: {
                  'data-testid': 'text-input',
                },
              },
            ],
          },
        ],
      })

      // WHEN: input uses theme.shadows.inner for recessed appearance
      await page.goto('/')

      // THEN: it should render input with inset shadow creating depth inward
      const input = page.locator('[data-testid="text-input"]')
      await expect(input).toHaveScreenshot('shadow-app-003-input-inset.png')
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-APPLICATION-004: should render button with smooth shadow transition creating lift effect',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: shadow transition on button hover interaction
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'button',
                content: 'Hover me',
                props: {
                  'data-testid': 'elevated-button',
                },
              },
            ],
          },
        ],
      })

      // WHEN: button hover state increases shadow elevation from md to lg
      await page.goto('/')

      // THEN: it should render button with smooth shadow transition creating lift effect
      const button = page.locator('[data-testid="elevated-button"]')
      await button.hover()
      await expect(button).toHaveScreenshot('shadow-app-004-button-lift.png')
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-APPLICATION-005: should render button with colored shadow matching brand identity',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: colored shadow for brand accent
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            brand: '0 4px 14px 0 rgb(59 130 246 / 0.4)',
          },
          colors: {
            primary: '#3b82f6',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'button',
                content: 'Get Started',
                props: {
                  'data-testid': 'brand-button',
                },
              },
            ],
          },
        ],
      })

      // WHEN: button uses custom shadow with brand color tint
      await page.goto('/')

      // THEN: it should render button with colored shadow matching brand identity
      const button = page.locator('[data-testid="brand-button"]')
      await expect(button).toHaveScreenshot('shadow-app-005-brand-colored.png')
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-APPLICATION-006: should render element with multi-layered shadow creating subtle 3D effect',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: layered shadows for enhanced depth (neumorphism)
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            neumorphic: '8px 8px 16px rgb(0 0 0 / 0.1), -8px -8px 16px rgb(255 255 255 / 0.5)',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'card',
                content: 'Neumorphic design',
                props: {
                  'data-testid': 'neumorphic-card',
                },
              },
            ],
          },
        ],
      })

      // WHEN: element combines multiple shadow values for soft depth
      await page.goto('/')

      // THEN: it should render element with multi-layered shadow creating subtle 3D effect
      const card = page.locator('[data-testid="neumorphic-card"]')
      await expect(card).toHaveScreenshot('shadow-app-006-neumorphic.png')
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-APPLICATION-007: should render input with prominent focus shadow for keyboard navigation',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: focus ring shadow for accessibility
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            focus: '0 0 0 3px rgb(59 130 246 / 0.5)',
          },
          colors: {
            primary: '#3b82f6',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'input',
                props: {
                  'data-testid': 'text-input',
                  type: 'text',
                },
              },
            ],
          },
        ],
      })

      // WHEN: input focus state combines border and shadow for clear focus indicator
      await page.goto('/')

      // THEN: it should render input with prominent focus shadow for keyboard navigation
      const input = page.locator('[data-testid="text-input"]')
      await input.focus()
      await expect(input).toHaveScreenshot('shadow-app-007-focus-ring.png')
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-APPLICATION-008: should render card with appropriate shadow depth per device',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: responsive shadow scaling for mobile vs desktop
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'card',
                content: 'Card content',
                props: {
                  'data-testid': 'responsive-card',
                },
              },
            ],
          },
        ],
      })

      // WHEN: card uses larger shadow on desktop, smaller on mobile for touch interfaces
      await page.goto('/')

      // THEN: it should render card with appropriate shadow depth per device
      const card = page.locator('[data-testid="responsive-card"]')
      await expect(card).toHaveScreenshot('shadow-app-008-responsive.png')
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-APPLICATION-009: should render components with consistent elevation scale',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: shadow elevation hierarchy in component system
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'list-item',
                content: 'Item',
                props: {
                  'data-testid': 'list-item',
                },
              },
              {
                type: 'card',
                content: 'Card',
                props: {
                  'data-testid': 'card',
                },
              },
              {
                type: 'dropdown',
                content: 'Menu',
                props: {
                  'data-testid': 'dropdown',
                },
              },
              {
                type: 'modal',
                content: 'Modal',
                props: {
                  'data-testid': 'modal',
                },
              },
            ],
          },
        ],
      })

      // WHEN: app uses shadows to convey information hierarchy (sm→md→lg→xl→2xl)
      await page.goto('/')

      // THEN: it should render components with consistent elevation scale
      await expect(page.locator('[data-testid="list-item"]')).toBeVisible()
      await expect(page.locator('[data-testid="card"]')).toBeVisible()
      await expect(page.locator('[data-testid="dropdown"]')).toBeVisible()
      await expect(page.locator('[data-testid="modal"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-THEME-SHADOWS-APPLICATION-010: should render button with reduced shadow creating pressed-in effect',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: active/pressed shadow state for buttons
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'button',
                content: 'Press me',
                props: {
                  'data-testid': 'pressable-button',
                },
              },
            ],
          },
        ],
      })

      // WHEN: button active state reduces shadow to simulate press depth
      await page.goto('/')

      // THEN: it should render button with reduced shadow creating pressed-in effect
      const button = page.locator('[data-testid="pressable-button"]')
      await button.click()
      await expect(button).toHaveScreenshot('shadow-app-010-pressed.png')
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'APP-THEME-SHADOWS-REGRESSION-001: user can complete full shadows workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application with comprehensive shadow system
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          shadows: {
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'card',
                content: 'Card',
                props: {
                  'data-testid': 'card',
                },
              },
              {
                type: 'modal',
                content: 'Modal',
                props: {
                  'data-testid': 'modal',
                },
              },
              {
                type: 'input',
                props: {
                  'data-testid': 'input',
                },
              },
            ],
          },
        ],
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.goto('/')

      // Validate CSS custom properties generated for shadow system
      const css = await page.locator('style').first().textContent()
      expect(css).toContain(':root')
      expect(css).toMatch(/--shadow-md:\s*0 4px 6px -1px rgb\(0 0 0 \/ 0\.1\)/)
      expect(css).toMatch(/--shadow-xl:\s*0 20px 25px -5px rgb\(0 0 0 \/ 0\.1\)/)
      expect(css).toMatch(/--shadow-inner:\s*inset 0 2px 4px 0 rgb\(0 0 0 \/ 0\.05\)/)

      // Verify card shadow
      await expect(page.locator('[data-testid="card"]')).toBeVisible()

      // Verify modal shadow
      await expect(page.locator('[data-testid="modal"]')).toBeVisible()

      // Verify input shadow
      await expect(page.locator('[data-testid="input"]')).toBeVisible()

      // Focus on workflow continuity, not exhaustive coverage
    }
  )
})
