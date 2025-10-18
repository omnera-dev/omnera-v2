/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../fixtures'

/**
 * E2E Tests for Tables
 *
 * Test Organization:
 * 1. @spec tests - Granular specification tests (52 tests from x-user-stories)
 * 2. @regression test - ONE consolidated workflow test per file
 * 3. @critical test - Essential CRUD operations (tables are core data model)
 *
 * Source: docs/specifications/schemas/tables/tables.schema.json
 * Total user stories: 52
 * - Root level: 18 stories (CRUD operations)
 * - Nested properties: 34 stories (id, name, fields, primaryKey, uniqueConstraints, indexes)
 */

test.describe('Tables - Root Level CRUD Operations', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec) - Root Level
  // Granular tests defining acceptance criteria during TDD development
  // Run during: Development, pre-commit (bun test:e2e:spec)
  // ============================================================================

  test.fixme(
    'should return admin tables page correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [],
      })

      // WHEN: I navigate to the admin tables page
      await page.goto('/admin/tables')

      // THEN: The page should load correctly
      await expect(page).toHaveURL(/\/admin\/tables/)
      await expect(page.locator('[data-testid="tables-page"]')).toBeVisible()
    }
  )

  test.fixme(
    'should list tables correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running with configured tables
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
        ],
      })

      // WHEN: I list tables
      await page.goto('/admin/tables')

      // THEN: All tables should be displayed
      await expect(page.locator('[data-testid="table-item"]')).toHaveCount(2)
      await expect(page.locator('text=users')).toBeVisible()
      await expect(page.locator('text=products')).toBeVisible()
    }
  )

  test.fixme(
    'should list table records correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running with a table containing records
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

      // WHEN: I navigate to the table records page
      await page.goto('/admin/tables/1')

      // THEN: Records should be listed
      await expect(page.locator('[data-testid="table-records"]')).toBeVisible()
    }
  )

  test.fixme(
    'should search table records correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running with a table containing searchable records
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

      // WHEN: I search for records
      await page.goto('/admin/tables/1')
      await page.locator('[data-testid="search-input"]').fill('test@example.com')

      // THEN: Search results should be displayed
      await expect(page.locator('[data-testid="search-results"]')).toBeVisible()
    }
  )

  test.fixme(
    'should open and display a table record correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running with a table containing a record
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

      // WHEN: I open a table record
      await page.goto('/admin/tables/1/records/1')

      // THEN: Record details should be displayed
      await expect(page.locator('[data-testid="record-detail"]')).toBeVisible()
    }
  )

  test.fixme(
    'should create a table record correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running with a table
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

      // WHEN: I create a new record
      await page.goto('/admin/tables/1')
      await page.locator('[data-testid="create-record-button"]').click()
      await page.locator('[data-testid="email-field"]').fill('test@example.com')
      await page.locator('[data-testid="submit-button"]').click()

      // THEN: Record should be created successfully
      await expect(page.locator('text=Record created')).toBeVisible()
    }
  )

  test.fixme(
    'should create a table record with required fields successfully',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: I am working with required fields
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email', required: true }],
          },
        ],
      })

      // WHEN: I create a table record with all required fields
      await page.goto('/admin/tables/1')
      await page.locator('[data-testid="create-record-button"]').click()
      await page.locator('[data-testid="email-field"]').fill('required@example.com')
      await page.locator('[data-testid="submit-button"]').click()

      // THEN: Creation should complete successfully
      await expect(page.locator('text=Record created')).toBeVisible()
    }
  )

  test.fixme(
    'should update a table record correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running with an existing record
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

      // WHEN: I update the record
      await page.goto('/admin/tables/1/records/1')
      await page.locator('[data-testid="edit-button"]').click()
      await page.locator('[data-testid="email-field"]').fill('updated@example.com')
      await page.locator('[data-testid="submit-button"]').click()

      // THEN: Record should be updated successfully
      await expect(page.locator('text=Record updated')).toBeVisible()
    }
  )

  test.fixme(
    'should delete a table record correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running with an existing record
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

      // WHEN: I delete the record
      await page.goto('/admin/tables/1/records/1')
      await page.locator('[data-testid="delete-button"]').click()
      await page.locator('[data-testid="confirm-delete"]').click()

      // THEN: Record should be deleted successfully
      await expect(page.locator('text=Record deleted')).toBeVisible()
    }
  )

  test.fixme(
    'should not create a record with missing required fields from POST request',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: I am working with missing required fields
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email', required: true }],
          },
        ],
      })

      // WHEN: I attempt to create a record via POST without required fields
      const response = await page.request.post('/api/tables/1/records', {
        data: {},
      })

      // THEN: Request should fail with validation error
      expect(response.status()).toBe(400)
      const body = await response.json()
      expect(body.error).toContain('required')
    }
  )

  test.fixme(
    'should create a record from a POST request correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running
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

      // WHEN: I create a record via POST request
      const response = await page.request.post('/api/tables/1/records', {
        data: { email: 'post@example.com' },
      })

      // THEN: Record should be created successfully
      expect(response.status()).toBe(201)
      const body = await response.json()
      expect(body.email).toBe('post@example.com')
    }
  )

  test.fixme(
    'should not create multiple records with missing required fields from POST request',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: I am working with missing required fields
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'email', type: 'email', required: true }],
          },
        ],
      })

      // WHEN: I attempt to create multiple records via POST without required fields
      const response = await page.request.post('/api/tables/1/records/bulk', {
        data: [{ name: 'User 1' }, { name: 'User 2' }],
      })

      // THEN: Request should fail with validation error
      expect(response.status()).toBe(400)
      const body = await response.json()
      expect(body.error).toContain('required')
    }
  )

  test.fixme(
    'should create multiple records from a POST request correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running
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

      // WHEN: I create multiple records via POST request
      const response = await page.request.post('/api/tables/1/records/bulk', {
        data: [{ email: 'user1@example.com' }, { email: 'user2@example.com' }],
      })

      // THEN: Records should be created successfully
      expect(response.status()).toBe(201)
      const body = await response.json()
      expect(body).toHaveLength(2)
    }
  )

  test.fixme(
    'should read a record from a GET request correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running with an existing record
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

      // WHEN: I read a record via GET request
      const response = await page.request.get('/api/tables/1/records/1')

      // THEN: Record should be retrieved successfully
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.id).toBe(1)
    }
  )

  test.fixme(
    'should list records from a GET request correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running with records
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

      // WHEN: I list records via GET request
      const response = await page.request.get('/api/tables/1/records')

      // THEN: Records should be listed successfully
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(Array.isArray(body)).toBe(true)
    }
  )

  test.fixme(
    'should update a record from a PATCH request correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running with an existing record
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

      // WHEN: I update a record via PATCH request
      const response = await page.request.patch('/api/tables/1/records/1', {
        data: { email: 'patched@example.com' },
      })

      // THEN: Record should be updated successfully
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.email).toBe('patched@example.com')
    }
  )

  test.fixme(
    'should update multiple records from a PATCH request correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running with multiple records
      await startServerWithSchema({
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [{ id: 1, name: 'status', type: 'single-line-text' }],
          },
        ],
      })

      // WHEN: I update multiple records via PATCH request
      const response = await page.request.patch('/api/tables/1/records/bulk', {
        data: {
          ids: [1, 2, 3],
          updates: { status: 'active' },
        },
      })

      // THEN: Records should be updated successfully
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.updated).toBe(3)
    }
  )

  test.fixme(
    'should delete a record from a DELETE request correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running with an existing record
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

      // WHEN: I delete a record via DELETE request
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      const response = await page.request.delete('/api/tables/1/records/1')

      // THEN: Record should be deleted successfully
      expect(response.status()).toBe(204)
    }
  )

  test.fixme(
    'should delete multiple records from a DELETE request correctly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: The application is running with multiple records
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

      // WHEN: I delete multiple records via DELETE request
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      const response = await page.request.delete('/api/tables/1/records/bulk', {
        data: { ids: [1, 2, 3] },
      })

      // THEN: Records should be deleted successfully
      expect(response.status()).toBe(204)
    }
  )
})

test.describe('Tables - Property: id', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec) - id property
  // Source: lines 18-22 in tables.schema.json
  // ============================================================================

  test.fixme(
    'should assign unique ID when new entity is created',
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
    'should prevent ID modification for existing entity',
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
    'should retrieve entity successfully when ID is valid',
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
})

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
      await page.goto('/admin/tables')

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

test.describe('Tables - Property: fields', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec) - fields property
  // Source: lines 160-163 in tables.schema.json
  // ============================================================================

  test.fixme(
    'should accept fields array with at least 1 item',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: User provides fields with at least 1 items
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

      // WHEN: Validating input
      await page.goto('/admin/tables/1')

      // THEN: Array should be accepted
      await expect(page.locator('[data-testid="field-item"]')).toHaveCount(1)
    }
  )

  test.fixme(
    'should reject fields array with fewer than 1 item',
    { tag: '@spec' },
    async ({ page: _page, startServerWithSchema }) => {
      // GIVEN: User provides fields with fewer than 1 items
      // WHEN: Validating input
      // THEN: Error should enforce minimum items

      // This test will validate schema-level constraint
      // Implementation will reject empty fields array during configuration
      const invalidConfig = {
        name: 'test-app',
        description: 'Test application',
        version: '1.0.0',
        tables: [
          {
            id: 1,
            name: 'users',
            fields: [], // Invalid: empty array
          },
        ],
      }

      // Attempt to start server with invalid config should fail
      await expect(async () => {
        await startServerWithSchema(invalidConfig)
      }).rejects.toThrow()
    }
  )
})

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
      await page.goto('/admin/tables/1/settings')
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
      await page.goto('/admin/tables/1/settings')

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
      await page.goto('/admin/tables/1/settings')

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
      await page.goto('/admin/tables/1/settings')

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
})

test.describe('Tables - Property: uniqueConstraints', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec) - uniqueConstraints property
  // Source: lines 281-321 in tables.schema.json
  // ============================================================================

  // uniqueConstraints[].name tests (lines 281-285)
  test.fixme(
    'should accept uniqueConstraints name matching pattern',
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

      // WHEN: Validating input
      await page.goto('/admin/tables/1/settings')

      // THEN: Value should be accepted
      await expect(page.locator('text=uq_users_email_tenant')).toBeVisible()
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
            uniqueConstraints: [
              { name: 'Invalid-Constraint-Name', fields: ['email', 'tenant_id'] },
            ],
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
    'should accept uniqueConstraints fields array with at least 2 items',
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

      // WHEN: Validating input
      await page.goto('/admin/tables/1/settings')

      // THEN: Array should be accepted
      await expect(page.locator('[data-testid="unique-constraint-fields"]')).toBeVisible()
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
})

test.describe('Tables - Property: indexes', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec) - indexes property
  // Source: lines 353-403 in tables.schema.json
  // ============================================================================

  // indexes[].name tests (lines 353-357)
  test.fixme(
    'should accept indexes name matching pattern',
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

      // WHEN: Validating input
      await page.goto('/admin/tables/1/settings')

      // THEN: Value should be accepted
      await expect(page.locator('text=idx_users_email')).toBeVisible()
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
    'should accept indexes fields array with at least 1 item',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: User provides fields with at least 1 items
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

      // WHEN: Validating input
      await page.goto('/admin/tables/1/settings')

      // THEN: Array should be accepted
      await expect(page.locator('[data-testid="index-fields"]')).toBeVisible()
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
// ONE consolidated test covering complete workflow
// Run during: CI/CD, pre-release (bun test:e2e:ci)
// ============================================================================

test.fixme(
  'user can complete full tables workflow',
  { tag: '@regression' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: User is on the admin tables page with a complete table configuration
    await startServerWithSchema({
      name: 'test-app',
      description: 'Test application',
      version: '1.0.0',
      tables: [
        {
          id: 1,
          name: 'users',
          fields: [
            { id: 1, name: 'email', type: 'email', required: true },
            { id: 2, name: 'first_name', type: 'single-line-text' },
            { id: 3, name: 'last_name', type: 'single-line-text' },
            { id: 4, name: 'tenant_id', type: 'integer' },
          ],
          primaryKey: { type: 'auto-increment', field: 'id' },
          uniqueConstraints: [{ name: 'uq_users_email_tenant', fields: ['email', 'tenant_id'] }],
          indexes: [
            { name: 'idx_users_email', fields: ['email'], unique: false },
            { name: 'idx_users_name', fields: ['first_name', 'last_name'], unique: false },
          ],
        },
      ],
    })

    // WHEN: User performs complete workflow

    // Step 1: Navigate to admin tables page
    await page.goto('/admin/tables')
    await expect(page.locator('[data-testid="tables-page"]')).toBeVisible()

    // Step 2: View table list
    await expect(page.locator('[data-testid="table-item"]')).toHaveCount(1)
    await expect(page.locator('text=users')).toBeVisible()

    // Step 3: Navigate to table records
    await page.locator('text=users').click()
    await expect(page.locator('[data-testid="table-records"]')).toBeVisible()

    // Step 4: Create a new record with required fields
    await page.locator('[data-testid="create-record-button"]').click()
    await page.locator('[data-testid="email-field"]').fill('john@example.com')
    await page.locator('[data-testid="first_name-field"]').fill('John')
    await page.locator('[data-testid="last_name-field"]').fill('Doe')
    await page.locator('[data-testid="tenant_id-field"]').fill('1')
    await page.locator('[data-testid="submit-button"]').click()
    await expect(page.locator('text=Record created')).toBeVisible()

    // Step 5: Search for the created record
    await page.locator('[data-testid="search-input"]').fill('john@example.com')
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible()
    await expect(page.locator('text=john@example.com')).toBeVisible()

    // Step 6: Open and view record details
    await page.locator('text=john@example.com').click()
    await expect(page.locator('[data-testid="record-detail"]')).toBeVisible()
    await expect(page.locator('text=John')).toBeVisible()
    await expect(page.locator('text=Doe')).toBeVisible()

    // Step 7: Update the record
    await page.locator('[data-testid="edit-button"]').click()
    await page.locator('[data-testid="first_name-field"]').fill('Jane')
    await page.locator('[data-testid="submit-button"]').click()
    await expect(page.locator('text=Record updated')).toBeVisible()
    await expect(page.locator('text=Jane')).toBeVisible()

    // Step 8: Test unique constraint (attempt duplicate email+tenant)
    await page.goto('/admin/tables/1')
    await page.locator('[data-testid="create-record-button"]').click()
    await page.locator('[data-testid="email-field"]').fill('john@example.com')
    await page.locator('[data-testid="tenant_id-field"]').fill('1')
    await page.locator('[data-testid="submit-button"]').click()
    await expect(page.locator('text=unique constraint')).toBeVisible()

    // Step 9: Create multiple records via API
    const bulkResponse = await page.request.post('/api/tables/1/records/bulk', {
      data: [
        { email: 'user1@example.com', first_name: 'User', last_name: 'One', tenant_id: 2 },
        { email: 'user2@example.com', first_name: 'User', last_name: 'Two', tenant_id: 2 },
      ],
    })
    expect(bulkResponse.status()).toBe(201)

    // Step 10: List all records via API
    const listResponse = await page.request.get('/api/tables/1/records')
    expect(listResponse.status()).toBe(200)
    const records = await listResponse.json()
    expect(records.length).toBeGreaterThanOrEqual(3)

    // Step 11: Update multiple records via API
    const updateResponse = await page.request.patch('/api/tables/1/records/bulk', {
      data: {
        ids: [2, 3],
        updates: { tenant_id: 3 },
      },
    })
    expect(updateResponse.status()).toBe(200)

    // Step 12: Delete a record
    await page.goto('/admin/tables/1/records/1')
    await page.locator('[data-testid="delete-button"]').click()
    await page.locator('[data-testid="confirm-delete"]').click()
    await expect(page.locator('text=Record deleted')).toBeVisible()

    // Step 13: Delete multiple records via API
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    const deleteResponse = await page.request.delete('/api/tables/1/records/bulk', {
      data: { ids: [2, 3] },
    })
    expect(deleteResponse.status()).toBe(204)

    // THEN: All expected outcomes are verified
    // - Table page navigation works
    // - Table listing displays correctly
    // - Record creation with required fields succeeds
    // - Record search functions properly
    // - Record details display correctly
    // - Record updates work
    // - Unique constraints are enforced
    // - Bulk operations (create, update, delete) work via API
    // - Single operations (read, delete) work via API
  }
)

// ============================================================================
// CRITICAL PATH TEST (@critical)
// Essential CRUD operations (tables are core data model)
// Run during: Every commit, production smoke tests (bun test:e2e:critical)
// ============================================================================

test.fixme(
  'critical: user can create and read table record',
  { tag: '@critical' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: Tables feature is configured
    await startServerWithSchema({
      name: 'test-app',
      description: 'Test application',
      version: '1.0.0',
      tables: [
        {
          id: 1,
          name: 'users',
          fields: [{ id: 1, name: 'email', type: 'email', required: true }],
          primaryKey: { type: 'auto-increment', field: 'id' },
        },
      ],
    })

    // WHEN: User creates a record
    await page.goto('/admin/tables/1')
    await page.locator('[data-testid="create-record-button"]').click()
    await page.locator('[data-testid="email-field"]').fill('critical@example.com')
    await page.locator('[data-testid="submit-button"]').click()

    // THEN: Record is created and can be read
    await expect(page.locator('text=Record created')).toBeVisible()
    await page.goto('/admin/tables/1')
    await expect(page.locator('text=critical@example.com')).toBeVisible()

    // Verify via API
    const response = await page.request.get('/api/tables/1/records/1')
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.email).toBe('critical@example.com')
  }
)
