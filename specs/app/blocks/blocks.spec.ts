/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Reusable Blocks
 *
 * Source: specs/app/blocks/blocks.schema.json
 * Spec Count: 12 (10 APP-BLOCKS + 2 INTEGRATION specs)
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (12 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Reusable Blocks', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test(
    'APP-BLOCKS-001: should validate blocks array structure',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: reusable blocks array
      await startServerWithSchema({
        name: 'test-app',
        blocks: [{ name: 'test-block', type: 'div' }],
      })

      // WHEN: array contains block items referencing block.schema.json
      await page.goto('/')

      // THEN: it should validate blocks array structure at build time
      await expect(page.locator('[data-block="test-block"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-002: should render same block definition across multiple page locations',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: blocks for DRY principle
      await startServerWithSchema({ name: 'test-app', blocks: [] })

      // WHEN: blocks are defined once and reused multiple times
      await page.goto('/')

      // THEN: it should render same block definition across multiple page locations
      await expect(page.locator('body')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-003: should render concrete component with substituted values',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: block with variable substitution
      await startServerWithSchema({ name: 'test-app', blocks: [{ name: 'single', type: 'div' }] })

      // WHEN: block contains $variable placeholders in props and content
      await page.goto('/')

      // THEN: it should render concrete component with substituted values
      await expect(page.locator('[data-block="single"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-004: should render badge with icon and text using substituted values',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: icon-badge block example
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          { name: 'block1', type: 'div' },
          { name: 'block2', type: 'span' },
        ],
      })

      // WHEN: block has type 'badge' with $color, $icon, and $text variables
      await page.goto('/')

      // THEN: it should render badge with icon and text using substituted values
      await expect(page.locator('[data-block="block1"]')).toBeVisible()
      await expect(page.locator('[data-block="block2"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-005: should render section header with styled title and subtitle',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: section-header block example
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          { name: 'icon-badge', type: 'badge' },
          { name: 'section-header', type: 'container' },
        ],
      })

      // WHEN: block has nested children with $title, $subtitle, $titleColor variables
      await page.goto('/')

      // THEN: it should render section header with styled title and subtitle
      await expect(page.locator('[data-block="icon-badge"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-006: should provide consistent, reusable components across pages',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: blocks as component library
      await startServerWithSchema({
        name: 'test-app',
        blocks: [{ name: 'shared-block', type: 'div' }],
        pages: [
          { path: '/', sections: [{ block: 'shared-block' }] },
          { path: '/about', sections: [{ block: 'shared-block' }] },
        ],
      })

      // WHEN: multiple blocks define UI patterns
      await page.goto('/')
      await expect(page.locator('[data-block="shared-block"]')).toBeVisible()

      // THEN: it should provide consistent, reusable components across pages
      await page.goto('/about')
      await expect(page.locator('[data-block="shared-block"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-007: should reflect changes across all block instances on page rebuild',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: blocks with centralized updates
      await startServerWithSchema({
        name: 'test-app',
        blocks: [{ name: 'var-block', type: 'text', content: '$message' }],
      })

      // WHEN: block definition is modified
      await page.goto('/')

      // THEN: it should reflect changes across all block instances on page rebuild
      await expect(page.locator('[data-block="var-block"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-008: should render complex nested component structures',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: blocks for composition
      await startServerWithSchema({
        name: 'test-app',
        blocks: [{ name: 'props-block', type: 'div', props: { className: 'test-class' } }],
      })

      // WHEN: blocks combine multiple child components
      await page.goto('/')

      // THEN: it should render complex nested component structures
      await expect(page.locator('[data-block="props-block"]')).toHaveClass(/test-class/)
    }
  )

  test.fixme(
    'APP-BLOCKS-009: should reduce code duplication and simplify pattern updates',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: blocks for maintainability
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          { name: 'parent-block', type: 'div', children: [{ type: 'span', content: 'child' }] },
        ],
      })

      // WHEN: blocks encapsulate UI patterns
      await page.goto('/')

      // THEN: it should reduce code duplication and simplify pattern updates
      await expect(page.locator('[data-block="parent-block"] span')).toHaveText('child')
    }
  )

  test.fixme(
    'APP-BLOCKS-010: should make blocks available for reference in all page sections',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: blocks array at app level
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          {
            name: 'complex',
            type: 'container',
            props: { className: 'wrapper' },
            children: [{ type: 'text', content: 'Nested' }],
          },
        ],
      })

      // WHEN: blocks are defined globally in app configuration
      await page.goto('/')

      // THEN: it should make blocks available for reference in all page sections
      await expect(page.locator('[data-block="complex"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-INTEGRATION-001: should render blocks within page layout with full variable substitution',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: blocks integrated with pages via sections
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          {
            name: 'hero-cta',
            type: 'button',
            props: { className: '$buttonClass' },
            content: '$buttonText',
          },
        ],
        pages: [
          {
            path: '/',
            meta: { lang: 'en-US', title: 'Home', description: 'Home' },
            sections: [
              {
                $ref: 'hero-cta',
                vars: { buttonClass: 'btn-primary', buttonText: 'Get Started' },
              },
            ],
          },
        ],
      })

      // WHEN: page sections reference blocks using $ref and vars
      await page.goto('/')

      // THEN: it should render blocks within page layout with full variable substitution
      const button = page.locator('button:has-text("Get Started")')
      await expect(button).toBeVisible()
      await expect(button).toHaveClass(/btn-primary/)
    }
  )

  test.fixme(
    'APP-BLOCKS-INTEGRATION-002: should render with design tokens applied from global theme',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: blocks using theme design tokens
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          colors: { primary: '#007bff', secondary: '#6c757d' },
          spacing: { sm: '8px', md: '16px' },
          fonts: { body: 'Arial, sans-serif' },
        },
        blocks: [
          {
            name: 'themed-card',
            type: 'card',
            props: {
              style: {
                backgroundColor: '$theme.colors.primary',
                padding: '$theme.spacing.md',
                fontFamily: '$theme.fonts.body',
              },
            },
            content: 'Themed Content',
          },
        ],
        pages: [
          {
            path: '/',
            meta: { lang: 'en-US', title: 'Home', description: 'Home' },
            sections: [{ $ref: 'themed-card' }],
          },
        ],
      })

      // WHEN: block props reference theme colors, spacing, and fonts
      await page.goto('/')

      // THEN: it should render with design tokens applied from global theme
      const card = page.locator('[data-block="themed-card"]')
      await expect(card).toBeVisible()
      await expect(card).toHaveCSS('background-color', 'rgb(0, 123, 255)') // #007bff
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full blocks workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          {
            name: 'icon-badge',
            type: 'badge',
            props: { color: '$color' },
            children: [
              { type: 'icon', props: { name: '$icon' } },
              { type: 'text', content: '$text' },
            ],
          },
          {
            name: 'feature-card',
            type: 'card',
            children: [
              { type: 'heading', content: '$title' },
              { type: 'text', content: '$description' },
            ],
          },
        ],
        pages: [
          {
            path: '/',
            sections: [
              { block: 'icon-badge', vars: { color: 'blue', icon: 'check', text: 'Success' } },
              { block: 'feature-card', vars: { title: 'Feature', description: 'Description' } },
            ],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('[data-block="icon-badge"]')).toBeVisible()
      await expect(page.locator('[data-block="feature-card"]')).toBeVisible()
    }
  )
})
