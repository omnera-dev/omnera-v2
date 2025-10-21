/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Tables - Property: uniqueConstraints
 *
 * Test Organization:
 * 1. @spec tests - Granular specification tests (13 tests)
 * 2. @regression test - ONE consolidated workflow test
 * 3. @spec test - Essential unique constraint enforcement
 *
 * Source: docs/specifications/schemas/tables/tables.schema.json (lines 281-321)
 */

// ============================================================================
// SPECIFICATION TESTS (@spec) - uniqueConstraints property
// Source: lines 281-321 in tables.schema.json
// ============================================================================

// uniqueConstraints[].name tests (lines 281-285)
test.fixme(
  'APP-TABLES-UNIQUECONSTRAINTS-001: should return uniqueConstraints name via API',
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
          fields: [
            { id: 1, name: 'email', type: 'email' },
            { id: 2, name: 'tenant_id', type: 'integer' },
          ],
          uniqueConstraints: [{ name: 'uq_users_email_tenant', fields: ['email', 'tenant_id'] }],
        },
      ],
    })

    // WHEN: Retrieving configuration via API
    const response = await page.request.get('/api/tables/1')

    // THEN: Value should be returned correctly
    const body = await response.json()
    expect(body.uniqueConstraints[0].name).toBe('uq_users_email_tenant')
  }
)

test.fixme(
  'APP-TABLES-UNIQUECONSTRAINTS-002: should create unique constraint in database with correct name',
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
          fields: [
            { id: 1, name: 'email', type: 'email' },
            { id: 2, name: 'tenant_id', type: 'integer' },
          ],
          uniqueConstraints: [{ name: 'uq_users_email_tenant', fields: ['email', 'tenant_id'] }],
        },
      ],
    })

    // WHEN: Querying database for unique constraint
    const result = await executeQuery(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_schema = 'public'
      AND table_name = 'users'
      AND constraint_type = 'UNIQUE'
      AND constraint_name = 'uq_users_email_tenant'
    `)

    // THEN: Constraint should exist with correct name
    expect(result.rows.length).toBe(1)
    expect(result.rows[0].constraint_name).toBe('uq_users_email_tenant')
  }
)

test.fixme(
  'should reject uniqueConstraints name not matching pattern',
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
          fields: [
            { id: 1, name: 'email', type: 'email' },
            { id: 2, name: 'tenant_id', type: 'integer' },
          ],
          uniqueConstraints: [{ name: 'Invalid-Constraint-Name', fields: ['email', 'tenant_id'] }],
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
  'should preserve uniqueConstraints name original format when retrieved',
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
          fields: [
            { id: 1, name: 'email', type: 'email' },
            { id: 2, name: 'tenant_id', type: 'integer' },
          ],
          uniqueConstraints: [{ name: 'uq_custom_name', fields: ['email', 'tenant_id'] }],
        },
      ],
    })

    // WHEN: Retrieved later
    const response = await page.request.get('/api/tables/1')

    // THEN: Original format should be preserved
    const body = await response.json()
    expect(body.uniqueConstraints[0].name).toBe('uq_custom_name')
  }
)

// uniqueConstraints[].fields tests (lines 302-305)
test.fixme(
  'should return uniqueConstraints fields via API',
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
          name: 'users',
          fields: [
            { id: 1, name: 'email', type: 'email' },
            { id: 2, name: 'tenant_id', type: 'integer' },
          ],
          uniqueConstraints: [{ name: 'uq_users_email_tenant', fields: ['email', 'tenant_id'] }],
        },
      ],
    })

    // WHEN: Retrieving configuration via API
    const response = await page.request.get('/api/tables/1')

    // THEN: Fields should be returned correctly
    const body = await response.json()
    expect(body.uniqueConstraints[0].fields).toEqual(['email', 'tenant_id'])
  }
)

test.fixme(
  'should create unique constraint on specified fields in database',
  { tag: '@spec' },
  async ({ startServerWithSchema, executeQuery }) => {
    // GIVEN: User provides fields with at least 2 items
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
            { id: 2, name: 'tenant_id', type: 'integer' },
          ],
          uniqueConstraints: [{ name: 'uq_users_email_tenant', fields: ['email', 'tenant_id'] }],
        },
      ],
    })

    // WHEN: Querying database for constraint columns
    const result = await executeQuery(`
      SELECT column_name
      FROM information_schema.key_column_usage
      WHERE table_schema = 'public'
      AND table_name = 'users'
      AND constraint_name = 'uq_users_email_tenant'
      ORDER BY ordinal_position
    `)

    // THEN: Both fields should be part of constraint
    expect(result.rows.length).toBe(2)
    expect(result.rows[0].column_name).toBe('email')
    expect(result.rows[1].column_name).toBe('tenant_id')
  }
)

test.fixme(
  'should reject uniqueConstraints fields array with fewer than 2 items',
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
          fields: [{ id: 1, name: 'email', type: 'email' }],
          uniqueConstraints: [
            { name: 'uq_users_email', fields: ['email'] }, // Invalid: only 1 field
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

// uniqueConstraints root tests (lines 318-321)
test.fixme(
  'should process uniqueConstraints array items in order',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: User provides uniqueConstraints array
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
            { id: 2, name: 'tenant_id', type: 'integer' },
            { id: 3, name: 'username', type: 'single-line-text' },
          ],
          uniqueConstraints: [
            { name: 'uq_email_tenant', fields: ['email', 'tenant_id'] },
            { name: 'uq_username_tenant', fields: ['username', 'tenant_id'] },
          ],
        },
      ],
    })

    // WHEN: Validating input
    const response = await page.request.get('/api/tables/1')

    // THEN: Items should be processed in order
    const body = await response.json()
    expect(body.uniqueConstraints[0].name).toBe('uq_email_tenant')
    expect(body.uniqueConstraints[1].name).toBe('uq_username_tenant')
  }
)

test.fixme(
  'should handle empty uniqueConstraints array correctly',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: UniqueConstraints array is empty
    await startServerWithSchema({
      name: 'test-app',
      description: 'Test application',
      version: '1.0.0',
      tables: [
        {
          id: 1,
          name: 'users',
          fields: [{ id: 1, name: 'email', type: 'email' }],
          uniqueConstraints: [],
        },
      ],
    })

    // WHEN: Validating input
    const response = await page.request.get('/api/tables/1')

    // THEN: Behavior should follow optional/required rules
    const body = await response.json()
    expect(body.uniqueConstraints).toEqual([])
  }
)

test.fixme(
  'should enforce uniqueConstraints on record creation',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: Table with unique constraint
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
            { id: 2, name: 'tenant_id', type: 'integer' },
          ],
          uniqueConstraints: [{ name: 'uq_email_tenant', fields: ['email', 'tenant_id'] }],
        },
      ],
    })

    // WHEN: Creating first record
    const response1 = await page.request.post('/api/tables/1/records', {
      data: { email: 'user@example.com', tenant_id: 1 },
    })
    expect(response1.status()).toBe(201)

    // WHEN: Attempting to create duplicate
    const response2 = await page.request.post('/api/tables/1/records', {
      data: { email: 'user@example.com', tenant_id: 1 },
    })

    // THEN: Should be rejected
    expect(response2.status()).toBe(409)
  }
)

// ============================================================================
// REGRESSION TEST (@regression)
// ONE consolidated test covering complete uniqueConstraints workflow
// Run during: CI/CD, pre-release (bun test:e2e:regression)
// ============================================================================

test.fixme(
  'user can configure and enforce unique constraints',
  { tag: '@regression' },
  async ({ page, startServerWithSchema, executeQuery }) => {
    // GIVEN: Table with multiple unique constraints
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
            { id: 3, name: 'tenant_id', type: 'integer' },
            { id: 4, name: 'external_id', type: 'single-line-text' },
          ],
          uniqueConstraints: [
            { name: 'uq_email_tenant', fields: ['email', 'tenant_id'] },
            { name: 'uq_username_tenant', fields: ['username', 'tenant_id'] },
            { name: 'uq_external_tenant', fields: ['external_id', 'tenant_id'] },
          ],
        },
      ],
    })

    // WHEN: Retrieving table configuration
    const tableResponse = await page.request.get('/api/tables/1')
    const table = await tableResponse.json()

    // THEN: All constraints should be configured
    expect(table.uniqueConstraints).toHaveLength(3)
    expect(table.uniqueConstraints[0].name).toBe('uq_email_tenant')
    expect(table.uniqueConstraints[0].fields).toEqual(['email', 'tenant_id'])
    expect(table.uniqueConstraints[1].name).toBe('uq_username_tenant')
    expect(table.uniqueConstraints[2].name).toBe('uq_external_tenant')

    // WHEN: Creating first record
    const create1 = await page.request.post('/api/tables/1/records', {
      data: {
        email: 'user1@example.com',
        username: 'user1',
        tenant_id: 1,
        external_id: 'ext001',
      },
    })
    expect(create1.status()).toBe(201)

    // WHEN: Creating record with different tenant (should allow duplicate email)
    const create2 = await page.request.post('/api/tables/1/records', {
      data: {
        email: 'user1@example.com',
        username: 'user2',
        tenant_id: 2,
        external_id: 'ext002',
      },
    })
    expect(create2.status()).toBe(201)

    // WHEN: Attempting duplicate email+tenant
    const createDupEmail = await page.request.post('/api/tables/1/records', {
      data: {
        email: 'user1@example.com',
        username: 'different',
        tenant_id: 1,
        external_id: 'ext003',
      },
    })
    expect(createDupEmail.status()).toBe(409)

    // WHEN: Attempting duplicate username+tenant
    const createDupUsername = await page.request.post('/api/tables/1/records', {
      data: {
        email: 'different@example.com',
        username: 'user1',
        tenant_id: 1,
        external_id: 'ext004',
      },
    })
    expect(createDupUsername.status()).toBe(409)

    // WHEN: Attempting duplicate external_id+tenant
    const createDupExternal = await page.request.post('/api/tables/1/records', {
      data: {
        email: 'another@example.com',
        username: 'another',
        tenant_id: 1,
        external_id: 'ext001',
      },
    })
    expect(createDupExternal.status()).toBe(409)

    // WHEN: Creating valid record with unique combinations
    const createValid = await page.request.post('/api/tables/1/records', {
      data: {
        email: 'valid@example.com',
        username: 'valid_user',
        tenant_id: 1,
        external_id: 'ext_valid',
      },
    })
    expect(createValid.status()).toBe(201)

    // WHEN: Verifying constraints exist in database
    const dbResult = await executeQuery(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_schema = 'public'
      AND table_name = 'users'
      AND constraint_type = 'UNIQUE'
      ORDER BY constraint_name
    `)

    // THEN: All constraints should exist in database
    expect(dbResult.rows.length).toBe(3)
    expect(dbResult.rows[0].constraint_name).toBe('uq_email_tenant')
    expect(dbResult.rows[1].constraint_name).toBe('uq_external_tenant')
    expect(dbResult.rows[2].constraint_name).toBe('uq_username_tenant')
  }
)

// ============================================================================
// CRITICAL PATH TEST (@spec)
// Essential unique constraint enforcement
// Run during: Every commit, production smoke tests (bun test:e2e:critical)
// ============================================================================

test.fixme(
  'critical: unique constraints prevent duplicate data',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: Table with unique constraint
    await startServerWithSchema({
      name: 'test-app',
      description: 'Test application',
      version: '1.0.0',
      tables: [
        {
          id: 1,
          name: 'critical_table',
          fields: [
            { id: 1, name: 'email', type: 'email' },
            { id: 2, name: 'org_id', type: 'integer' },
          ],
          uniqueConstraints: [{ name: 'uq_email_org', fields: ['email', 'org_id'] }],
        },
      ],
    })

    // WHEN: Creating first record
    const response1 = await page.request.post('/api/tables/1/records', {
      data: { email: 'critical@example.com', org_id: 1 },
    })

    // THEN: Should succeed
    expect(response1.status()).toBe(201)

    // WHEN: Attempting duplicate
    const response2 = await page.request.post('/api/tables/1/records', {
      data: { email: 'critical@example.com', org_id: 1 },
    })

    // THEN: Should be rejected
    expect(response2.status()).toBe(409)

    // WHEN: Creating with different org_id
    const response3 = await page.request.post('/api/tables/1/records', {
      data: { email: 'critical@example.com', org_id: 2 },
    })

    // THEN: Should succeed (different combination)
    expect(response3.status()).toBe(201)
  }
)
