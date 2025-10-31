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
 * Spec Count: 12
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
      await startServerWithSchema({
        name: 'test-app',
        blocks: [{ name: 'test-block', type: 'div' }],
      })
      await page.goto('/')
      await expect(page.locator('[data-block="test-block"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-002: should validate empty blocks array',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({ name: 'test-app', blocks: [] })
      await page.goto('/')
      await expect(page.locator('body')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-003: should validate single block in array',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({ name: 'test-app', blocks: [{ name: 'single', type: 'div' }] })
      await page.goto('/')
      await expect(page.locator('[data-block="single"]')).toBeVisible()
    }
  )

  test(
    'APP-BLOCKS-004: should validate multiple blocks in array',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          { name: 'block1', type: 'div' },
          { name: 'block2', type: 'span' },
        ],
      })
      await page.goto('/')
      await expect(page.locator('[data-block="block1"]')).toBeVisible()
      await expect(page.locator('[data-block="block2"]')).toBeVisible()
    }
  )

  test(
    'APP-BLOCKS-005: should validate block library organization',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          { name: 'icon-badge', type: 'badge' },
          { name: 'section-header', type: 'container' },
        ],
      })
      await page.goto('/')
      await expect(page.locator('[data-block="icon-badge"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-006: should validate block reusability across pages',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        blocks: [{ name: 'shared-block', type: 'div' }],
        pages: [
          { path: '/', sections: [{ block: 'shared-block' }] },
          { path: '/about', sections: [{ block: 'shared-block' }] },
        ],
      })
      await page.goto('/')
      await expect(page.locator('[data-block="shared-block"]')).toBeVisible()
      await page.goto('/about')
      await expect(page.locator('[data-block="shared-block"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-007: should validate block with variable substitution',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        blocks: [{ name: 'var-block', type: 'text', content: '$message' }],
      })
      await page.goto('/')
      await expect(page.locator('[data-block="var-block"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-008: should validate block with props',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        blocks: [{ name: 'props-block', type: 'div', props: { className: 'test-class' } }],
      })
      await page.goto('/')
      await expect(page.locator('[data-block="props-block"]')).toHaveClass(/test-class/)
    }
  )

  test.fixme(
    'APP-BLOCKS-009: should validate block with children',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          { name: 'parent-block', type: 'div', children: [{ type: 'span', content: 'child' }] },
        ],
      })
      await page.goto('/')
      await expect(page.locator('[data-block="parent-block"] span')).toHaveText('child')
    }
  )

  test.fixme(
    'APP-BLOCKS-010: should validate complex block composition',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
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
      await page.goto('/')
      await expect(page.locator('[data-block="complex"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-011: should validate block naming uniqueness',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          { name: 'unique-1', type: 'div' },
          { name: 'unique-2', type: 'div' },
        ],
      })
      await page.goto('/')
      await expect(page.locator('[data-block="unique-1"]')).toBeVisible()
      await expect(page.locator('[data-block="unique-2"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-012: should validate block library for DRY principle',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        blocks: [{ name: 'reusable', type: 'div' }],
        pages: [{ path: '/', sections: [{ block: 'reusable' }] }],
      })
      await page.goto('/')
      await expect(page.locator('[data-block="reusable"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-BLOCKS-INTEGRATION-001: should render blocks within page layout with full variable substitution',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: blocks integrated with pages via sections
      // WHEN: page sections reference blocks using $ref and vars
      // THEN: it should render blocks within page layout with full variable substitution
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
      await page.goto('/')
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
      // WHEN: block props reference theme colors, spacing, and fonts
      // THEN: it should render with design tokens applied from global theme
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
      await page.goto('/')
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
