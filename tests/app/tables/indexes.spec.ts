/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../../fixtures'

/**
 * E2E Tests for Tables - Property: indexes
 *
 * Test Organization:
 * 1. @spec tests - Granular specification tests (13 tests)
 * 2. @regression test - ONE consolidated workflow test
 * 3. @critical test - Essential index functionality
 *
 * Source: docs/specifications/schemas/tables/tables.schema.json (lines 353-403)
 */

test.describe('Tables - Property: indexes', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec) - indexes property
  // Source: lines 353-403 in tables.schema.json
  // ============================================================================

  // indexes[].name tests (lines 353-357)
  test.fixme(
    'should return indexes name via API',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: User provides name matching pattern
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email' }],
            indexes: [{ name: 'idx_users_email', fields: ['email'] }],
          },
        ],
      })

      // WHEN: Retrieving configuration via API
      const response = await page.request.get('/api/tables/1')

      // THEN: Value should be returned correctly
      const body = await response.json()
      expect(body.indexes[0].name).toBe('idx_users_email')
    }
  )

  test.fixme(
    'should create index in database with correct name',
    { tag: '@spec' },
    async ({ startServerWithSchema, executeQuery }) => {
      // GIVEN: User provides name matching pattern
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email' }],
            indexes: [{ name: 'idx_users_email', fields: ['email'] }],
          },
        ],
      })

      // WHEN: Querying database for index
      const result = await executeQuery(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND tablename = 'users'
        AND indexname = 'idx_users_email'
      `)

      // THEN: Index should exist with correct name
      expect(result.rows.length).toBe(1)
      expect(result.rows[0].indexname).toBe('idx_users_email')
    }
  )

  test.fixme(
    'should reject indexes name not matching pattern',
    { tag: '@spec' },
    async ({ startServerWithSchema }) => {
      // GIVEN: User provides name not matching pattern
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
            indexes: [{ name: 'Invalid-Index-Name', fields: ['email'] }],
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
    'should preserve indexes name original format when retrieved',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Name is stored
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email' }],
            indexes: [{ name: 'idx_custom_index', fields: ['email'] }],
          },
        ],
      })

      // WHEN: Retrieved later
      const response = await page.request.get('/api/tables/1')

      // THEN: Original format should be preserved
      const body = await response.json()
      expect(body.indexes[0].name).toBe('idx_custom_index')
    }
  )

  // indexes[].fields tests (lines 371-374)
  test.fixme(
    'should return indexes fields via API',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: User provides fields with at least 1 item
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [
              { id: 1, name: 'first_name', type: 'single-line-text' },
              { id: 2, name: 'last_name', type: 'single-line-text' },
            ],
            indexes: [{ name: 'idx_users_name', fields: ['first_name', 'last_name'] }],
          },
        ],
      })

      // WHEN: Retrieving configuration via API
      const response = await page.request.get('/api/tables/1')

      // THEN: Fields should be returned correctly
      const body = await response.json()
      expect(body.indexes[0].fields).toEqual(['first_name', 'last_name'])
    }
  )

  test.fixme(
    'should create index on specified fields in database',
    { tag: '@spec' },
    async ({ startServerWithSchema, executeQuery }) => {
      // GIVEN: User provides fields with at least 1 item
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [
              { id: 1, name: 'first_name', type: 'single-line-text' },
              { id: 2, name: 'last_name', type: 'single-line-text' },
            ],
            indexes: [{ name: 'idx_users_name', fields: ['first_name', 'last_name'] }],
          },
        ],
      })

      // WHEN: Querying database for index definition
      const result = await executeQuery(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND tablename = 'users'
        AND indexname = 'idx_users_name'
      `)

      // THEN: Index should include both fields
      expect(result.rows.length).toBe(1)
      expect(result.rows[0].indexdef).toContain('first_name')
      expect(result.rows[0].indexdef).toContain('last_name')
    }
  )

  test.fixme(
    'should reject indexes fields array with fewer than 1 item',
    { tag: '@spec' },
    async ({ startServerWithSchema }) => {
      // GIVEN: User provides fields with fewer than 1 items
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
            fields: [{ id: 1, name: 'email', type: 'email' }],
            indexes: [
              { name: 'idx_users_empty', fields: [] }, // Invalid: empty array
            ],
          },
        ],
      }

      await expect(async () => {
        // @ts-expect-error - Invalid pattern
        await startServerWithSchema(invalidConfig)
      }).rejects.toThrow(/minimum/)
    }
  )

  // indexes[].unique tests (lines 384-388)
  test.fixme(
    'should enforce behavior when indexes unique is true',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Unique is true
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email' }],
            indexes: [{ name: 'idx_users_email_unique', fields: ['email'], unique: true }],
          },
        ],
      })

      // WHEN: Processing entity
      // THEN: Corresponding behavior should be enforced (prevent duplicate emails)
      const response1 = await page.request.post('/api/tables/1/records', {
        data: { email: 'unique@example.com' },
      })
      expect(response1.status()).toBe(201)

      const response2 = await page.request.post('/api/tables/1/records', {
        data: { email: 'unique@example.com' },
      })
      expect(response2.status()).toBe(409) // Conflict due to unique constraint
    }
  )

  test.fixme(
    'should not enforce unique behavior when indexes unique is false',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Unique is false (default: False)
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email' }],
            indexes: [{ name: 'idx_users_email', fields: ['email'], unique: false }],
          },
        ],
      })

      // WHEN: Processing entity
      // THEN: Corresponding behavior should not be enforced (allow duplicate emails)
      const response1 = await page.request.post('/api/tables/1/records', {
        data: { email: 'duplicate@example.com' },
      })
      expect(response1.status()).toBe(201)

      const response2 = await page.request.post('/api/tables/1/records', {
        data: { email: 'duplicate@example.com' },
      })
      expect(response2.status()).toBe(201) // Allowed
    }
  )

  test.fixme(
    'should accept boolean value for indexes unique',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Configuration with unique
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email' }],
            indexes: [{ name: 'idx_users_email', fields: ['email'], unique: true }],
          },
        ],
      })

      // WHEN: Validating settings
      const response = await page.request.get('/api/tables/1')

      // THEN: Boolean value should be accepted
      const body = await response.json()
      expect(typeof body.indexes[0].unique).toBe('boolean')
    }
  )

  // indexes root tests (lines 400-403)
  test.fixme(
    'should process indexes array items in order',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: User provides indexes array
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [
              { id: 1, name: 'email', type: 'email' },
              { id: 2, name: 'status', type: 'single-line-text' },
            ],
            indexes: [
              { name: 'idx_email', fields: ['email'] },
              { name: 'idx_status', fields: ['status'] },
            ],
          },
        ],
      })

      // WHEN: Validating input
      const response = await page.request.get('/api/tables/1')

      // THEN: Items should be processed in order
      const body = await response.json()
      expect(body.indexes[0].name).toBe('idx_email')
      expect(body.indexes[1].name).toBe('idx_status')
    }
  )

  test.fixme(
    'should handle empty indexes array correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Indexes array is empty
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email' }],
            indexes: [],
          },
        ],
      })

      // WHEN: Validating input
      const response = await page.request.get('/api/tables/1')

      // THEN: Behavior should follow optional/required rules
      const body = await response.json()
      expect(body.indexes).toEqual([])
    }
  )
})

// ============================================================================
// REGRESSION TEST (@regression)
// ONE consolidated test covering complete indexes workflow
// Run during: CI/CD, pre-release (bun test:e2e:ci)
// ============================================================================

test.fixme(
  'user can configure and use database indexes',
  { tag: '@regression' },
  async ({ page, startServerWithSchema, executeQuery }) => {
    // GIVEN: Table with multiple indexes including unique and composite
    await startServerWithSchema({
      name: 'test-app',
      description: 'Test application',
      version: '1.0.0',
      tables: [
        {
          id: 1,
          name: 'users',
          fields: [
            { id: 1, name: 'email', type: 'email' },
            { id: 2, name: 'username', type: 'single-line-text' },
            { id: 3, name: 'first_name', type: 'single-line-text' },
            { id: 4, name: 'last_name', type: 'single-line-text' },
            { id: 5, name: 'status', type: 'single-line-text' },
            { id: 6, name: 'created_at', type: 'date' },
          ],
          indexes: [
            { name: 'idx_email', fields: ['email'], unique: true },
            { name: 'idx_username', fields: ['username'], unique: true },
            { name: 'idx_name', fields: ['first_name', 'last_name'], unique: false },
            { name: 'idx_status', fields: ['status'], unique: false },
            { name: 'idx_status_created', fields: ['status', 'created_at'], unique: false },
          ],
        },
      ],
    })

    // WHEN: Retrieving table configuration
    const tableResponse = await page.request.get('/api/tables/1')
    const table = await tableResponse.json()

    // THEN: All indexes should be configured
    expect(table.indexes).toHaveLength(5)
    expect(table.indexes[0].name).toBe('idx_email')
    expect(table.indexes[0].unique).toBe(true)
    expect(table.indexes[1].name).toBe('idx_username')
    expect(table.indexes[1].unique).toBe(true)
    expect(table.indexes[2].name).toBe('idx_name')
    expect(table.indexes[2].fields).toEqual(['first_name', 'last_name'])
    expect(table.indexes[2].unique).toBe(false)
    expect(table.indexes[3].name).toBe('idx_status')
    expect(table.indexes[4].name).toBe('idx_status_created')
    expect(table.indexes[4].fields).toEqual(['status', 'created_at'])

    // WHEN: Creating first record
    const create1 = await page.request.post('/api/tables/1/records', {
      data: {
        email: 'user1@example.com',
        username: 'user1',
        first_name: 'John',
        last_name: 'Doe',
        status: 'active',
        created_at: '2025-01-01',
      },
    })
    expect(create1.status()).toBe(201)

    // WHEN: Attempting duplicate email (unique index)
    const createDupEmail = await page.request.post('/api/tables/1/records', {
      data: {
        email: 'user1@example.com',
        username: 'user2',
        first_name: 'Jane',
        last_name: 'Smith',
        status: 'active',
        created_at: '2025-01-02',
      },
    })
    expect(createDupEmail.status()).toBe(409)

    // WHEN: Attempting duplicate username (unique index)
    const createDupUsername = await page.request.post('/api/tables/1/records', {
      data: {
        email: 'user2@example.com',
        username: 'user1',
        first_name: 'Jane',
        last_name: 'Smith',
        status: 'active',
        created_at: '2025-01-02',
      },
    })
    expect(createDupUsername.status()).toBe(409)

    // WHEN: Creating with duplicate name (non-unique composite index)
    const createDupName = await page.request.post('/api/tables/1/records', {
      data: {
        email: 'user2@example.com',
        username: 'user2',
        first_name: 'John',
        last_name: 'Doe',
        status: 'active',
        created_at: '2025-01-02',
      },
    })
    expect(createDupName.status()).toBe(201) // Allowed (non-unique)

    // WHEN: Creating with duplicate status (non-unique single field index)
    const createDupStatus = await page.request.post('/api/tables/1/records', {
      data: {
        email: 'user3@example.com',
        username: 'user3',
        first_name: 'Alice',
        last_name: 'Johnson',
        status: 'active',
        created_at: '2025-01-03',
      },
    })
    expect(createDupStatus.status()).toBe(201) // Allowed (non-unique)

    // WHEN: Verifying indexes exist in database
    const dbResult = await executeQuery(`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND tablename = 'users'
      AND indexname IN ('idx_email', 'idx_username', 'idx_name', 'idx_status', 'idx_status_created')
      ORDER BY indexname
    `)

    // THEN: All indexes should exist in database
    expect(dbResult.rows.length).toBe(5)
    expect(dbResult.rows[0].indexname).toBe('idx_email')
    expect(dbResult.rows[1].indexname).toBe('idx_name')
    expect(dbResult.rows[2].indexname).toBe('idx_status')
    expect(dbResult.rows[3].indexname).toBe('idx_status_created')
    expect(dbResult.rows[4].indexname).toBe('idx_username')

    // WHEN: Viewing index details
    const emailIndex = table.indexes.find((idx: any) => idx.name === 'idx_email')
    const nameIndex = table.indexes.find((idx: any) => idx.name === 'idx_name')

    // THEN: Index configurations should be correct
    expect(emailIndex.fields).toEqual(['email'])
    expect(emailIndex.unique).toBe(true)
    expect(nameIndex.fields).toEqual(['first_name', 'last_name'])
    expect(nameIndex.unique).toBe(false)
  }
)

// ============================================================================
// CRITICAL PATH TEST (@critical)
// Essential unique index functionality
// Run during: Every commit, production smoke tests (bun test:e2e:critical)
// ============================================================================

test.fixme(
  'critical: unique indexes prevent duplicate values',
  { tag: '@critical' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: Table with unique index
    await startServerWithSchema({
      name: 'test-app',
      description: 'Test application',
      version: '1.0.0',
      tables: [
        {
          id: 1,
          name: 'critical_table',
          fields: [{ id: 1, name: 'email', type: 'email' }],
          indexes: [{ name: 'idx_email_unique', fields: ['email'], unique: true }],
        },
      ],
    })

    // WHEN: Creating first record
    const response1 = await page.request.post('/api/tables/1/records', {
      data: { email: 'critical@example.com' },
    })

    // THEN: Should succeed
    expect(response1.status()).toBe(201)

    // WHEN: Attempting duplicate
    const response2 = await page.request.post('/api/tables/1/records', {
      data: { email: 'critical@example.com' },
    })

    // THEN: Should be rejected
    expect(response2.status()).toBe(409)

    // WHEN: Creating with different value
    const response3 = await page.request.post('/api/tables/1/records', {
      data: { email: 'different@example.com' },
    })

    // THEN: Should succeed
    expect(response3.status()).toBe(201)
  }
)
