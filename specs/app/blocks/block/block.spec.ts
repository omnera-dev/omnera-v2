/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures.ts'

/**
 * E2E Tests for Block Template
 *
 * Source: specs/app/blocks/block/block.schema.json
 * Spec Count: 12
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (12 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Block Template', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-BLOCKS-BLOCK-001: should validate minimal block definition at build time',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-BLOCKS-BLOCK-001
      // GIVEN: block with required properties
      await startServerWithSchema({
        name: 'test-app',
        blocks: [{ name: 'simple-block', type: 'div' }],
      })

      // WHEN: name and type are provided
      await page.goto('/')

      // THEN: it should validate minimal block definition at build time
      await expect(page.locator('[data-block="simple-block"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-BLOCK-002: should use URL-friendly naming convention for data-testid',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-BLOCKS-BLOCK-002
      // GIVEN: block name in kebab-case
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          { name: 'icon-badge', type: 'badge' },
          { name: 'section-header', type: 'container' },
          { name: 'feature-card', type: 'card' },
        ],
      })

      // WHEN: name is 'icon-badge', 'section-header', or 'feature-card'
      await page.goto('/')

      // THEN: it should use URL-friendly naming convention for data-testid
      await expect(page.locator('[data-testid="block-icon-badge"]')).toBeVisible()
      await expect(page.locator('[data-testid="block-section-header"]')).toBeVisible()
      await expect(page.locator('[data-testid="block-feature-card"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-BLOCK-003: should reject invalid names at build time',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-BLOCKS-BLOCK-003
      // GIVEN: block name pattern validation
      // WHEN: name matches ^[a-z][a-z0-9-]*$ (lowercase, hyphens, no spaces)
      // THEN: it should reject invalid names at build time
      const validBlocks = [
        { name: 'icon-badge', type: 'div' },
        { name: 'cta', type: 'div' },
        { name: 'section-header-2', type: 'div' },
        { name: 'feature-list-item', type: 'div' },
      ]
      await startServerWithSchema({ name: 'test-app', blocks: validBlocks })
      await page.goto('/')
      await expect(page.locator('[data-block="icon-badge"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-BLOCK-004: should render corresponding HTML element or component',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-BLOCKS-BLOCK-004
      // GIVEN: block type specification
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          { name: 'layout', type: 'container' },
          { name: 'row', type: 'flex' },
          { name: 'columns', type: 'grid' },
          { name: 'panel', type: 'card' },
          { name: 'heading', type: 'text' },
          { name: 'cta', type: 'button' },
        ],
      })

      // WHEN: type is 'container', 'flex', 'grid', 'card', 'text', 'button', etc.
      await page.goto('/')

      // THEN: it should render corresponding HTML element or component
      await expect(
        page.locator('[data-testid="block-layout"][data-type="container"]')
      ).toBeVisible()
      await expect(page.locator('[data-testid="block-row"][data-type="flex"]')).toBeVisible()
      await expect(page.locator('[data-testid="block-cta"][data-type="button"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-BLOCK-005: should render with properties including variable substitution',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-BLOCKS-BLOCK-005
      // GIVEN: block with props
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          {
            name: 'styled-box',
            type: 'div',
            props: { className: 'box-$variant', id: '$boxId', ariaLabel: '$label' },
          },
        ],
        pages: [
          {
            path: '/',
            sections: [
              {
                block: 'styled-box',
                vars: { variant: 'primary', boxId: 'main-box', label: 'Main content' },
              },
            ],
          },
        ],
      })

      // WHEN: props references block-props.schema.json
      await page.goto('/')

      // THEN: it should render with properties including variable substitution
      const styledBox = page.locator('[data-testid="block-styled-box"]')
      await expect(styledBox).toHaveClass(/box-primary/)
      await expect(styledBox).toHaveAttribute('id', 'main-box')
      await expect(styledBox).toHaveAttribute('aria-label', 'Main content')
    }
  )

  test.fixme(
    'APP-BLOCKS-BLOCK-006: should render nested child components',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-BLOCKS-BLOCK-006
      // GIVEN: block with children
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          {
            name: 'card-header',
            type: 'div',
            children: [
              { type: 'text', props: { level: 'h3' }, content: '$title' },
              { type: 'text', props: { level: 'p' }, content: '$subtitle' },
            ],
          },
        ],
        pages: [
          {
            path: '/',
            sections: [
              { block: 'card-header', vars: { title: 'Card Title', subtitle: 'Card subtitle' } },
            ],
          },
        ],
      })

      // WHEN: children references block-children.schema.json
      await page.goto('/')

      // THEN: it should render nested child components
      await expect(page.locator('[data-testid="block-card-header"] h3')).toHaveText('Card Title')
      await expect(page.locator('[data-testid="block-card-header"] p')).toHaveText('Card subtitle')
    }
  )

  test.fixme(
    'APP-BLOCKS-BLOCK-007: should render text content with substituted variables',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-BLOCKS-BLOCK-007
      // GIVEN: block with content
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          {
            name: 'alert-message',
            type: 'div',
            props: { className: 'alert' },
            content: '$message',
          },
        ],
        pages: [
          {
            path: '/',
            sections: [{ block: 'alert-message', vars: { message: 'Operation successful!' } }],
          },
        ],
      })

      // WHEN: content is string with $variable references
      await page.goto('/')

      // THEN: it should render text content with substituted variables
      await expect(page.locator('[data-testid="block-alert-message"]')).toHaveText(
        'Operation successful!'
      )
      await expect(page.locator('[data-testid="block-alert-message"]')).toHaveClass(/alert/)
    }
  )

  test.fixme(
    'APP-BLOCKS-BLOCK-008: should render text element with dynamic styling and content',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-BLOCKS-BLOCK-008
      // GIVEN: simple text block example
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          {
            name: 'simple-text',
            type: 'text',
            props: { className: 'text-$color text-lg' },
            content: '$message',
          },
        ],
        pages: [
          {
            path: '/',
            sections: [{ block: 'simple-text', vars: { color: 'blue', message: 'Hello World' } }],
          },
        ],
      })

      // WHEN: block has type 'text', className with $color, and content with $message
      await page.goto('/')

      // THEN: it should render text element with dynamic styling and content
      const textBlock = page.locator('[data-testid="block-simple-text"]')
      await expect(textBlock).toHaveText('Hello World')
      await expect(textBlock).toHaveClass(/text-blue/)
      await expect(textBlock).toHaveClass(/text-lg/)
    }
  )

  test.fixme(
    'APP-BLOCKS-BLOCK-009: should render flex container with icon and text components',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-BLOCKS-BLOCK-009
      // GIVEN: feature-list-item block example
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          {
            name: 'feature-list-item',
            type: 'flex',
            props: { align: 'start', gap: 3 },
            children: [
              { type: 'icon', props: { name: '$icon', color: '$iconColor' } },
              { type: 'text', content: '$text' },
            ],
          },
        ],
        pages: [
          {
            path: '/',
            sections: [
              {
                block: 'feature-list-item',
                vars: { icon: 'check-circle', iconColor: 'green', text: 'Feature enabled' },
              },
            ],
          },
        ],
      })

      // WHEN: block has type 'flex' with icon and text children using $icon, $iconColor, $text
      await page.goto('/')

      // THEN: it should render flex container with icon and text components
      const flexBlock = page.locator('[data-testid="block-feature-list-item"]')
      await expect(flexBlock).toHaveClass(/flex/)
      await expect(flexBlock).toHaveClass(/items-start/)
      await expect(page.locator('[data-testid="icon-check-circle"]')).toBeVisible()
      await expect(flexBlock.locator('span')).toHaveText('Feature enabled')
    }
  )

  test.fixme(
    'APP-BLOCKS-BLOCK-010: should render multiple instances with different data',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-BLOCKS-BLOCK-010
      // GIVEN: block as reusable template
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          {
            name: 'stat-card',
            type: 'card',
            children: [
              { type: 'text', props: { level: 'h4' }, content: '$value' },
              { type: 'text', props: { level: 'p' }, content: '$label' },
            ],
          },
        ],
        pages: [
          {
            path: '/',
            sections: [
              { block: 'stat-card', vars: { value: '1,234', label: 'Users' } },
              { block: 'stat-card', vars: { value: '567', label: 'Projects' } },
              { block: 'stat-card', vars: { value: '89%', label: 'Success Rate' } },
            ],
          },
        ],
      })

      // WHEN: block defines structure with variable placeholders
      await page.goto('/')

      // THEN: it should render multiple instances with different data
      await expect(page.locator('[data-testid="block-stat-card-0"] h4')).toHaveText('1,234')
      await expect(page.locator('[data-testid="block-stat-card-0"] p')).toHaveText('Users')
      await expect(page.locator('[data-testid="block-stat-card-1"] h4')).toHaveText('567')
      await expect(page.locator('[data-testid="block-stat-card-2"] h4')).toHaveText('89%')
    }
  )

  test.fixme(
    'APP-BLOCKS-BLOCK-011: should render complete component with all aspects integrated',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-BLOCKS-BLOCK-011
      // GIVEN: block composition patterns
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          {
            name: 'complete-card',
            type: 'card',
            props: { className: 'card-$variant p-6 rounded-lg' },
            children: [
              { type: 'text', props: { level: 'h3', className: 'mb-2' }, content: '$title' },
              { type: 'text', props: { level: 'p' }, content: '$description' },
            ],
          },
        ],
        pages: [
          {
            path: '/',
            sections: [
              {
                block: 'complete-card',
                vars: {
                  variant: 'primary',
                  title: 'Premium Plan',
                  description: 'Best value for teams',
                },
              },
            ],
          },
        ],
      })

      // WHEN: block combines layout (type), styling (props), and content (children/content)
      await page.goto('/')

      // THEN: it should render complete component with all aspects integrated
      const card = page.locator('[data-testid="block-complete-card"]')
      await expect(card).toHaveClass(/card-primary/)
      await expect(card).toHaveClass(/p-6/)
      await expect(card).toHaveClass(/rounded-lg/)
      await expect(card.locator('h3')).toHaveText('Premium Plan')
      await expect(card.locator('p')).toHaveText('Best value for teams')
    }
  )

  test.fixme(
    'APP-BLOCKS-BLOCK-012: should transform template placeholders into concrete values in DOM',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-BLOCKS-BLOCK-012
      // GIVEN: block template instantiation
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          {
            name: 'pricing-badge',
            type: 'badge',
            props: { className: 'badge-$color' },
            content: '$price/month',
          },
        ],
        pages: [
          {
            path: '/',
            sections: [{ block: 'pricing-badge', vars: { color: 'gold', price: '49' } }],
          },
        ],
      })

      // WHEN: block is referenced via block-reference.schema.json with vars
      await page.goto('/')

      // THEN: it should transform template placeholders into concrete values in DOM
      const badge = page.locator('[data-testid="block-pricing-badge"]')
      await expect(badge).toHaveClass(/badge-gold/)
      await expect(badge).toHaveText('49/month')
      const html = await badge.innerHTML()
      expect(html).not.toContain('$')
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full block workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application with comprehensive block templates
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          {
            name: 'simple-text',
            type: 'text',
            props: { className: 'text-$color' },
            content: '$message',
          },
          {
            name: 'feature-item',
            type: 'flex',
            props: { gap: 3 },
            children: [
              { type: 'icon', props: { name: '$icon' } },
              { type: 'text', content: '$text' },
            ],
          },
        ],
        pages: [
          {
            path: '/',
            sections: [
              { block: 'simple-text', vars: { color: 'blue', message: 'Welcome' } },
              { block: 'feature-item', vars: { icon: 'check', text: 'Feature 1' } },
              { block: 'feature-item', vars: { icon: 'star', text: 'Feature 2' } },
            ],
          },
        ],
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.goto('/')

      // Verify text block
      await expect(page.locator('[data-testid="block-simple-text"]')).toHaveText('Welcome')
      await expect(page.locator('[data-testid="block-simple-text"]')).toHaveClass(/text-blue/)

      // Verify feature blocks
      await expect(page.locator('[data-testid="block-feature-item-0"]')).toBeVisible()
      await expect(page.locator('[data-testid="icon-check"]')).toBeVisible()
      await expect(page.locator('[data-testid="block-feature-item-1"]')).toBeVisible()
      await expect(page.locator('[data-testid="icon-star"]')).toBeVisible()

      // Focus on workflow continuity, not exhaustive coverage
    }
  )
})
