/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Tables - Property: id
 *
 * Test Organization:
 * 1. @spec tests - Granular specification tests (5 tests)
 * 2. @regression test - ONE consolidated workflow test
 * 3. @spec test - Essential ID operation
 *
 * Source: docs/specifications/schemas/tables/tables.schema.json (lines 18-22)
 */

test.describe('Tables - Property: id', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec) - id property
  // Source: lines 18-22 in tables.schema.json
  // ============================================================================

  test.fixme(
    'APP-TABLES-ID-001: should assign unique ID when new entity is created',
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
      expect(typeof body.id).toBe('number')
    }
  )

  test.fixme(
    'APP-TABLES-ID-002: should prevent ID modification for existing entity',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: An entity exists
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
        ],
      })

      // WHEN: Attempting to modify its ID
      const response = await page.request.patch('/api/tables/1/records/1', {
        data: { id: 999, email: 'test@example.com' },
      })

      // THEN: The system should prevent changes (read-only constraint)
      const body = await response.json()
      expect(body.id).not.toBe(999)
    }
  )

  test.fixme(
    'APP-TABLES-ID-003: should retrieve entity successfully when ID is valid',
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
          },
        ],
      })

      // WHEN: The ID is valid
      const response = await page.request.get('/api/tables/1/records/1')

      // THEN: The entity should be retrieved successfully
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.id).toBe(1)
    }
  )

  test.fixme(
    'should store ID as primary key column in database',
    { tag: '@spec' },
    async ({ startServerWithSchema, executeQuery }) => {
      // GIVEN: A table with ID field
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
        ],
      })

      // WHEN: Querying database schema for primary key
      const result = await executeQuery(`
        SELECT constraint_name, column_name
        FROM information_schema.key_column_usage
        WHERE table_name = 'users'
        AND constraint_name LIKE '%_pkey'
      `)

      // THEN: ID should be defined as primary key
      expect(result.rows.length).toBeGreaterThan(0)
      expect(result.rows[0].column_name).toBe('id')
    }
  )

  test.fixme(
    'should create auto-incrementing sequence in database when using auto-increment',
    { tag: '@spec' },
    async ({ startServerWithSchema, executeQuery }) => {
      // GIVEN: A table with auto-increment ID
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

      // WHEN: Querying database for sequences
      const result = await executeQuery(`
        SELECT sequencename
        FROM pg_sequences
        WHERE schemaname = 'public'
        AND sequencename LIKE '%products%'
      `)

      // THEN: Auto-increment sequence should exist
      expect(result.rows.length).toBeGreaterThan(0)
    }
  )
})

// ============================================================================
// REGRESSION TEST (@regression)
// ONE consolidated test covering complete ID workflow
// Run during: CI/CD, pre-release (bun test:e2e:regression)
// ============================================================================

test.fixme(
  'user can work with table record IDs throughout lifecycle',
  { tag: '@regression' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: A table is configured
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
      ],
    })

    // WHEN: User creates a new record
    const createResponse = await page.request.post('/api/tables/1/records', {
      data: { email: 'workflow@example.com' },
    })
    expect(createResponse.status()).toBe(201)
    const created = await createResponse.json()
    const recordId = created.id

    // THEN: ID should be assigned
    expect(recordId).toBeDefined()
    expect(typeof recordId).toBe('number')

    // WHEN: User retrieves the record by ID
    const getResponse = await page.request.get(`/api/tables/1/records/${recordId}`)
    expect(getResponse.status()).toBe(200)
    const retrieved = await getResponse.json()

    // THEN: ID should match and be retrievable
    expect(retrieved.id).toBe(recordId)

    // WHEN: User attempts to modify the ID
    const updateResponse = await page.request.patch(`/api/tables/1/records/${recordId}`, {
      data: { id: 999, email: 'updated@example.com' },
    })
    const updated = await updateResponse.json()

    // THEN: ID should remain unchanged (read-only)
    expect(updated.id).toBe(recordId)
    expect(updated.id).not.toBe(999)

    // WHEN: User creates another record
    const createResponse2 = await page.request.post('/api/tables/1/records', {
      data: { email: 'second@example.com' },
    })
    const created2 = await createResponse2.json()

    // THEN: New ID should be unique
    expect(created2.id).toBeDefined()
    expect(created2.id).not.toBe(recordId)
  }
)

// ============================================================================
// CRITICAL PATH TEST (@spec)
// Essential ID retrieval operation
// Run during: Every commit, production smoke tests (bun test:e2e:critical)
// ============================================================================

test.fixme(
  'critical: record ID is assigned and retrievable',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: A table exists
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
      ],
    })

    // WHEN: A record is created
    const createResponse = await page.request.post('/api/tables/1/records', {
      data: { email: 'critical@example.com' },
    })

    // THEN: ID is assigned
    expect(createResponse.status()).toBe(201)
    const body = await createResponse.json()
    expect(body.id).toBeDefined()

    // AND: Record can be retrieved by ID
    const getResponse = await page.request.get(`/api/tables/1/records/${body.id}`)
    expect(getResponse.status()).toBe(200)
  }
)
