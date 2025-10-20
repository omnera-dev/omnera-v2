/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../../fixtures'

/**
 * E2E Tests for Tables - Property: primaryKey
 *
 * Test Organization:
 * 1. @spec tests - Granular specification tests (12 tests)
 * 2. @regression test - ONE consolidated workflow test
 * 3. @critical test - Essential primary key operation
 *
 * Source: docs/specifications/schemas/tables/tables.schema.json (lines 194-245)
 */

test.describe('Tables - Property: primaryKey', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec) - primaryKey property and nested properties
  // Source: lines 194-245 in tables.schema.json
  // ============================================================================

  // primaryKey.type tests (lines 194-198)
  test.fixme(
    'should assign unique ID when new entity is created for primaryKey type',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A new entity is created
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email' }],
            primaryKey: { type: 'auto-increment', field: 'id' },
          },
        ],
      })

      // WHEN: The system assigns an ID
      const response = await page.request.post('/api/tables/1/records', {
        data: { email: 'test@example.com' },
      })

      // THEN: It should be unique within the parent collection
      expect(response.status()).toBe(201)
      const body = await response.json()
      expect(body.id).toBeDefined()
    }
  )

  test.fixme(
    'should prevent primaryKey type modification for existing entity',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: An entity exists with primaryKey type
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email' }],
            primaryKey: { type: 'auto-increment', field: 'id' },
          },
        ],
      })

      // WHEN: Attempting to modify its type
      // THEN: The system should prevent changes (read-only constraint)
      // This is a schema-level constraint test
      await page.goto('/_admin/tables/1/settings')
      await expect(page.locator('[data-testid="primary-key-type"]')).toHaveAttribute('readonly', '')
    }
  )

  test.fixme(
    'should retrieve entity by primaryKey type when ID is valid',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A client requests an entity by ID
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email' }],
            primaryKey: { type: 'uuid', field: 'id' },
          },
        ],
      })

      // WHEN: The ID is valid
      const response = await page.request.get('/api/tables/1/records/some-uuid')

      // THEN: The entity should be retrieved successfully
      expect(response.status()).toBe(200)
    }
  )

  // primaryKey.field tests (lines 210-214)
  test.fixme(
    'should accept primaryKey field matching pattern',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: User provides field matching pattern
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'user_id', type: 'integer' }],
            primaryKey: { type: 'auto-increment', field: 'user_id' },
          },
        ],
      })

      // WHEN: Validating input
      await page.goto('/_admin/tables/1/settings')

      // THEN: Value should be accepted
      await expect(page.locator('[data-testid="primary-key-field"]')).toHaveValue('user_id')
    }
  )

  test.fixme(
    'should reject primaryKey field not matching pattern',
    { tag: '@spec' },
    async ({ page: _page, startServerWithSchema }) => {
      // GIVEN: User provides field not matching pattern
      // WHEN: Validating input
      // THEN: Clear error message should explain format requirement

      const invalidConfig = {
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email' }],
            primaryKey: { type: 'auto-increment', field: 'Invalid-Field' }, // Invalid pattern
          },
        ],
      }

      await expect(async () => {
        // @ts-expect-error - Invalid pattern
        await startServerWithSchema(invalidConfig)
      }).rejects.toThrow(/pattern/)
    }
  )

  test.fixme(
    'should preserve primaryKey field original format when retrieved',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Field is stored
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'custom_id', type: 'integer' }],
            primaryKey: { type: 'auto-increment', field: 'custom_id' },
          },
        ],
      })

      // WHEN: Retrieved later
      const response = await page.request.get('/api/tables/1')

      // THEN: Original format should be preserved
      const body = await response.json()
      expect(body.primaryKey.field).toBe('custom_id')
    }
  )

  // primaryKey.fields tests (lines 232-234)
  test.fixme(
    'should accept primaryKey fields array with at least 2 items',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: User provides fields with at least 2 items
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'user_roles',
            fields: [
              { id: 1, name: 'tenant_id', type: 'integer' },
              { id: 2, name: 'user_id', type: 'integer' },
            ],
            primaryKey: { type: 'composite', fields: ['tenant_id', 'user_id'] },
          },
        ],
      })

      // WHEN: Validating input
      await page.goto('/_admin/tables/1/settings')

      // THEN: Array should be accepted
      await expect(page.locator('[data-testid="composite-key-fields"]')).toBeVisible()
    }
  )

  test.fixme(
    'should reject primaryKey fields array with fewer than 2 items',
    { tag: '@spec' },
    async ({ startServerWithSchema }) => {
      // GIVEN: User provides fields with fewer than 2 items
      // WHEN: Validating input
      // THEN: Error should enforce minimum items

      const invalidConfig = {
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'tenant_id', type: 'integer' }],
            primaryKey: { type: 'composite', fields: ['tenant_id'] }, // Invalid: only 1 field
          },
        ],
      }

      await expect(async () => {
        // @ts-expect-error - Invalid pattern
        await startServerWithSchema(invalidConfig)
      }).rejects.toThrow(/minimum/)
    }
  )

  // primaryKey root tests (lines 242-245)
  test.fixme(
    'should accept primaryKey configuration meeting schema requirements',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: User configures primaryKey
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email' }],
            primaryKey: { type: 'uuid', field: 'id' },
          },
        ],
      })

      // WHEN: Validating input
      await page.goto('/_admin/tables/1/settings')

      // THEN: Value should meet schema requirements
      await expect(page.locator('[data-testid="primary-key-config"]')).toBeVisible()
    }
  )

  test.fixme(
    'should use primaryKey correctly when processing configuration',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: PrimaryKey is set
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email' }],
            primaryKey: { type: 'auto-increment', field: 'id' },
          },
        ],
      })

      // WHEN: Processing configuration
      const response = await page.request.post('/api/tables/1/records', {
        data: { email: 'test@example.com' },
      })

      // THEN: Value should be used correctly
      expect(response.status()).toBe(201)
      const body = await response.json()
      expect(body.id).toBeDefined()
    }
  )

  // Additional tests for different primary key types
  test.fixme(
    'should handle auto-increment primary key correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Table with auto-increment primary key
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'products',
            fields: [{ id: 1, name: 'name', type: 'single-line-text' }],
            primaryKey: { type: 'auto-increment', field: 'id' },
          },
        ],
      })

      // WHEN: Creating multiple records
      const response1 = await page.request.post('/api/tables/1/records', {
        data: { name: 'Product 1' },
      })
      const response2 = await page.request.post('/api/tables/1/records', {
        data: { name: 'Product 2' },
      })

      // THEN: IDs should auto-increment
      const record1 = await response1.json()
      const record2 = await response2.json()
      expect(record2.id).toBeGreaterThan(record1.id)
    }
  )

  test.fixme(
    'should handle composite primary key correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Table with composite primary key
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'user_roles',
            fields: [
              { id: 1, name: 'user_id', type: 'integer' },
              { id: 2, name: 'role_id', type: 'integer' },
            ],
            primaryKey: { type: 'composite', fields: ['user_id', 'role_id'] },
          },
        ],
      })

      // WHEN: Creating records with composite key
      const response1 = await page.request.post('/api/tables/1/records', {
        data: { user_id: 1, role_id: 1 },
      })
      const response2 = await page.request.post('/api/tables/1/records', {
        data: { user_id: 1, role_id: 2 },
      })

      // THEN: Different composite keys should be allowed
      expect(response1.status()).toBe(201)
      expect(response2.status()).toBe(201)

      // WHEN: Attempting duplicate composite key
      const response3 = await page.request.post('/api/tables/1/records', {
        data: { user_id: 1, role_id: 1 },
      })

      // THEN: Should be rejected
      expect(response3.status()).toBe(409)
    }
  )
})

// ============================================================================
// REGRESSION TEST (@regression)
// ONE consolidated test covering complete primaryKey workflow
// Run during: CI/CD, pre-release (bun test:e2e:ci)
// ============================================================================

test.fixme(
  'user can configure and use different primary key strategies',
  { tag: '@regression' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: Tables with different primary key configurations
    await startServerWithSchema({
      name: 'test-app',
      description: 'Test application',
      version: '1.0.0',
      tables: [
        {
          id: 1,
          name: 'auto_increment_table',
          fields: [{ id: 1, name: 'name', type: 'single-line-text' }],
          primaryKey: { type: 'auto-increment', field: 'id' },
        },
        {
          id: 2,
          name: 'uuid_table',
          fields: [{ id: 1, name: 'name', type: 'single-line-text' }],
          primaryKey: { type: 'uuid', field: 'uid' },
        },
        {
          id: 3,
          name: 'composite_table',
          fields: [
            { id: 1, name: 'tenant_id', type: 'integer' },
            { id: 2, name: 'user_id', type: 'integer' },
            { id: 3, name: 'name', type: 'single-line-text' },
          ],
          primaryKey: { type: 'composite', fields: ['tenant_id', 'user_id'] },
        },
      ],
    })

    // WHEN: Retrieving table configurations
    const table1 = await (await page.request.get('/api/tables/1')).json()
    const table2 = await (await page.request.get('/api/tables/2')).json()
    const table3 = await (await page.request.get('/api/tables/3')).json()

    // THEN: Each table should have correct primary key configuration
    expect(table1.primaryKey.type).toBe('auto-increment')
    expect(table1.primaryKey.field).toBe('id')

    expect(table2.primaryKey.type).toBe('uuid')
    expect(table2.primaryKey.field).toBe('uid')

    expect(table3.primaryKey.type).toBe('composite')
    expect(table3.primaryKey.fields).toEqual(['tenant_id', 'user_id'])

    // WHEN: Creating records in auto-increment table
    const auto1 = await page.request.post('/api/tables/1/records', {
      data: { name: 'Record 1' },
    })
    const auto2 = await page.request.post('/api/tables/1/records', {
      data: { name: 'Record 2' },
    })

    // THEN: IDs should increment
    const autoRecord1 = await auto1.json()
    const autoRecord2 = await auto2.json()
    expect(autoRecord2.id).toBeGreaterThan(autoRecord1.id)

    // WHEN: Creating records in composite key table
    const comp1 = await page.request.post('/api/tables/3/records', {
      data: { tenant_id: 1, user_id: 1, name: 'User 1' },
    })
    const comp2 = await page.request.post('/api/tables/3/records', {
      data: { tenant_id: 1, user_id: 2, name: 'User 2' },
    })

    // THEN: Different combinations should be allowed
    expect(comp1.status()).toBe(201)
    expect(comp2.status()).toBe(201)

    // WHEN: Attempting to modify primary key configuration
    await page.goto('/_admin/tables/1/settings')

    // THEN: Primary key type should be read-only
    await expect(page.locator('[data-testid="primary-key-type"]')).toHaveAttribute('readonly', '')
  }
)

// ============================================================================
// CRITICAL PATH TEST (@critical)
// Essential primary key operation
// Run during: Every commit, production smoke tests (bun test:e2e:critical)
// ============================================================================

test.fixme(
  'critical: primary key uniquely identifies records',
  { tag: '@critical' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: A table with auto-increment primary key
    await startServerWithSchema({
      name: 'test-app',
      description: 'Test application',
      version: '1.0.0',
      tables: [
        {
          id: 1,
          name: 'critical_table',
          fields: [{ id: 1, name: 'data', type: 'single-line-text' }],
          primaryKey: { type: 'auto-increment', field: 'id' },
        },
      ],
    })

    // WHEN: Creating a record
    const createResponse = await page.request.post('/api/tables/1/records', {
      data: { data: 'test' },
    })
    const created = await createResponse.json()

    // THEN: Record should have primary key
    expect(created.id).toBeDefined()

    // AND: Record should be retrievable by primary key
    const getResponse = await page.request.get(`/api/tables/1/records/${created.id}`)
    expect(getResponse.status()).toBe(200)
    const retrieved = await getResponse.json()
    expect(retrieved.id).toBe(created.id)
  }
)
