/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../../fixtures'

/**
 * E2E Tests for Tables - Property: name
 *
 * Test Organization:
 * 1. @spec tests - Granular specification tests (2 tests)
 * 2. @regression test - ONE consolidated workflow test
 * 3. @critical test - Essential name validation
 *
 * Source: docs/specifications/schemas/tables/tables.schema.json (lines 32-35)
 */

test.describe('Tables - Property: name', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec) - name property
  // Source: lines 32-35 in tables.schema.json
  // ============================================================================

  test.fixme(
    'should accept name value meeting schema requirements',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: User configures name
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'valid_table_name',
            fields: [{ id: 1, name: 'field1', type: 'single-line-text' }],
          },
        ],
      })

      // WHEN: Validating input
      await page.goto('/_admin/tables')

      // THEN: Value should be accepted and used correctly
      await expect(page.locator('text=valid_table_name')).toBeVisible()
    }
  )

  test.fixme(
    'should use name value correctly when processing configuration',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Name is set
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'products',
            fields: [{ id: 1, name: 'title', type: 'single-line-text' }],
          },
        ],
      })

      // WHEN: Processing configuration
      const response = await page.request.get('/api/tables/1')

      // THEN: Value should be used correctly
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.name).toBe('products')
    }
  )
})

// ============================================================================
// REGRESSION TEST (@regression)
// ONE consolidated test covering complete name workflow
// Run during: CI/CD, pre-release (bun test:e2e:ci)
// ============================================================================

test.fixme(
  'user can configure and use table names throughout application',
  { tag: '@regression' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: Multiple tables with valid names
    await startServerWithSchema({
      name: 'test-app',
      description: 'Test application',
      version: '1.0.0',
      tables: [
        {
          id: 1,
          name: 'users',
          fields: [{ id: 1, name: 'email', type: 'email' }],
        },
        {
          id: 2,
          name: 'products',
          fields: [{ id: 1, name: 'title', type: 'single-line-text' }],
        },
        {
          id: 3,
          name: 'order_items',
          fields: [{ id: 1, name: 'quantity', type: 'integer' }],
        },
      ],
    })

    // WHEN: User navigates to tables page
    await page.goto('/_admin/tables')

    // THEN: All table names should be visible
    await expect(page.locator('text=users')).toBeVisible()
    await expect(page.locator('text=products')).toBeVisible()
    await expect(page.locator('text=order_items')).toBeVisible()

    // WHEN: User retrieves table via API
    const response1 = await page.request.get('/api/tables/1')
    const response2 = await page.request.get('/api/tables/2')
    const response3 = await page.request.get('/api/tables/3')

    // THEN: Names should be preserved exactly as configured
    expect((await response1.json()).name).toBe('users')
    expect((await response2.json()).name).toBe('products')
    expect((await response3.json()).name).toBe('order_items')

    // WHEN: User creates records in named tables
    const createResponse = await page.request.post('/api/tables/1/records', {
      data: { email: 'user@example.com' },
    })
    expect(createResponse.status()).toBe(201)

    // THEN: Table name context is preserved throughout operations
    await page.goto('/_admin/tables/1')
    await expect(page.locator('text=users')).toBeVisible()
  }
)

// ============================================================================
// CRITICAL PATH TEST (@critical)
// Essential name validation and usage
// Run during: Every commit, production smoke tests (bun test:e2e:critical)
// ============================================================================

test.fixme(
  'critical: table name is validated and used correctly',
  { tag: '@critical' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: A table with valid name
    await startServerWithSchema({
      name: 'test-app',
      description: 'Test application',
      version: '1.0.0',
      tables: [
        {
          id: 1,
          name: 'critical_table',
          fields: [{ id: 1, name: 'field', type: 'single-line-text' }],
        },
      ],
    })

    // WHEN: Retrieving table configuration
    const response = await page.request.get('/api/tables/1')

    // THEN: Name should match exactly
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.name).toBe('critical_table')

    // AND: Name should be visible in UI
    await page.goto('/_admin/tables')
    await expect(page.locator('text=critical_table')).toBeVisible()
  }
)
