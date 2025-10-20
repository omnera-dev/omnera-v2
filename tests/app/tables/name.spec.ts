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
 * 1. @spec tests - Granular specification tests (4 tests)
 * 2. @regression test - ONE consolidated workflow test
 * 3. @spec test - Essential name validation
 *
 * Source: docs/specifications/schemas/tables/tables.schema.json (lines 32-35)
 */

test.describe('Tables - Property: name', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec) - name property
  // Source: lines 32-35 in tables.schema.json
  // ============================================================================

  test.fixme(
    'should return table with correct name via API',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: User configures table name
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

      // WHEN: Retrieving table via API
      const response = await page.request.get('/api/tables/1')

      // THEN: Name should be returned correctly
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.name).toBe('valid_table_name')
    }
  )

  test.fixme(
    'should create table with correct name in database',
    { tag: '@spec' },
    async ({ startServerWithSchema, executeQuery }) => {
      // GIVEN: User configures table name
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

      // WHEN: Querying database for table
      const result = await executeQuery(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'valid_table_name'
      `)

      // THEN: Table should exist with correct name
      expect(result.rows.length).toBe(1)
      expect(result.rows[0].table_name).toBe('valid_table_name')
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

  test.fixme(
    'should preserve name case and format in database',
    { tag: '@spec' },
    async ({ startServerWithSchema, executeQuery }) => {
      // GIVEN: Table name with specific format
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'user_profiles',
            fields: [{ id: 1, name: 'bio', type: 'single-line-text' }],
          },
        ],
      })

      // WHEN: Querying database for table name
      const result = await executeQuery(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'user_profiles'
      `)

      // THEN: Name format should be preserved exactly
      expect(result.rows.length).toBe(1)
      expect(result.rows[0].table_name).toBe('user_profiles')
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
  async ({ page, startServerWithSchema, executeQuery }) => {
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

    // WHEN: Retrieving tables via API
    const response1 = await page.request.get('/api/tables/1')
    const response2 = await page.request.get('/api/tables/2')
    const response3 = await page.request.get('/api/tables/3')

    // THEN: Names should be preserved exactly as configured in API
    expect((await response1.json()).name).toBe('users')
    expect((await response2.json()).name).toBe('products')
    expect((await response3.json()).name).toBe('order_items')

    // WHEN: Querying database for all tables
    const dbResult = await executeQuery(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'products', 'order_items')
      ORDER BY table_name
    `)

    // THEN: All table names should exist in database
    expect(dbResult.rows.length).toBe(3)
    expect(dbResult.rows[0].table_name).toBe('order_items')
    expect(dbResult.rows[1].table_name).toBe('products')
    expect(dbResult.rows[2].table_name).toBe('users')

    // WHEN: Creating records in named tables
    const createResponse = await page.request.post('/api/tables/1/records', {
      data: { email: 'user@example.com' },
    })
    expect(createResponse.status()).toBe(201)

    // THEN: Table name context is preserved in API operations
    const getResponse = await page.request.get('/api/tables/1')
    expect((await getResponse.json()).name).toBe('users')
  }
)

// ============================================================================
// CRITICAL PATH TEST (@spec)
// Essential name validation and usage
// Run during: Every commit, production smoke tests (bun test:e2e:critical)
// ============================================================================

test.fixme(
  'critical: table name is validated and used correctly',
  { tag: '@spec' },
  async ({ page, startServerWithSchema, executeQuery }) => {
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

    // WHEN: Retrieving table via API
    const response = await page.request.get('/api/tables/1')

    // THEN: Name should match exactly in API
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.name).toBe('critical_table')

    // AND: Table should exist in database with correct name
    const dbResult = await executeQuery(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'critical_table'
    `)
    expect(dbResult.rows.length).toBe(1)
    expect(dbResult.rows[0].table_name).toBe('critical_table')
  }
)
