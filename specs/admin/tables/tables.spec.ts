/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../fixtures'

/**
 * E2E Tests for Tables - Root Level CRUD Operations
 *
 * Test Organization:
 * 1. @spec tests - Granular specification tests (18 tests from x-user-stories)
 * 2. @regression test - ONE consolidated workflow test
 *
 * Source: docs/specifications/schemas/tables/tables.schema.json (lines 412-431)
 */

test.describe('Tables - Root Level CRUD Operations', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec) - Root Level
  // Granular tests defining acceptance criteria during TDD development
  // Run during: Development, pre-commit (bun test:e2e:spec)
  // ============================================================================

  // ADMIN-TABLES-001: application is running → user navigates to admin tables page → page should load correctly
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
      await page.goto('/_admin/tables')

      // THEN: The page should load correctly
      await expect(page).toHaveURL(/\/admin\/tables/)
      await expect(page.locator('[data-testid="tables-page"]')).toBeVisible()
    }
  )

  // ADMIN-TABLES-002: application is running with configured tables → user lists tables → all tables should be displayed
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
      await page.goto('/_admin/tables')

      // THEN: All tables should be displayed
      await expect(page.locator('[data-testid="table-item"]')).toHaveCount(2)
      await expect(page.locator('text=users')).toBeVisible()
      await expect(page.locator('text=products')).toBeVisible()
    }
  )

  // ADMIN-TABLES-003: application is running with a table containing records → user navigates to table records page → records should be listed
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
      await page.goto('/_admin/tables/1')

      // THEN: Records should be listed
      await expect(page.locator('[data-testid="table-records"]')).toBeVisible()
    }
  )

  // ADMIN-TABLES-004: application is running with a table containing searchable records → user searches for records → search results should be displayed
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
      await page.goto('/_admin/tables/1')
      await page.locator('[data-testid="search-input"]').fill('test@example.com')

      // THEN: Search results should be displayed
      await expect(page.locator('[data-testid="search-results"]')).toBeVisible()
    }
  )

  // ADMIN-TABLES-005: application is running with a table containing a record → user opens a table record → record details should be displayed
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
      await page.goto('/_admin/tables/1/records/1')

      // THEN: Record details should be displayed
      await expect(page.locator('[data-testid="record-detail"]')).toBeVisible()
    }
  )

  // ADMIN-TABLES-006: application is running with a table → user creates a new record → record should be created successfully
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
      await page.goto('/_admin/tables/1')
      await page.locator('[data-testid="create-record-button"]').click()
      await page.locator('[data-testid="email-field"]').fill('test@example.com')
      await page.locator('[data-testid="submit-button"]').click()

      // THEN: Record should be created successfully
      await expect(page.locator('text=Record created')).toBeVisible()
    }
  )

  // ADMIN-TABLES-007: user is working with required fields → user creates a table record with all required fields → creation should complete successfully
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
      await page.goto('/_admin/tables/1')
      await page.locator('[data-testid="create-record-button"]').click()
      await page.locator('[data-testid="email-field"]').fill('required@example.com')
      await page.locator('[data-testid="submit-button"]').click()

      // THEN: Creation should complete successfully
      await expect(page.locator('text=Record created')).toBeVisible()
    }
  )

  // ADMIN-TABLES-008: application is running with an existing record → user updates the record → record should be updated successfully
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
      await page.goto('/_admin/tables/1/records/1')
      await page.locator('[data-testid="edit-button"]').click()
      await page.locator('[data-testid="email-field"]').fill('updated@example.com')
      await page.locator('[data-testid="submit-button"]').click()

      // THEN: Record should be updated successfully
      await expect(page.locator('text=Record updated')).toBeVisible()
    }
  )

  // ADMIN-TABLES-009: application is running with an existing record → user deletes the record → record should be deleted successfully
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
      await page.goto('/_admin/tables/1/records/1')
      await page.locator('[data-testid="delete-button"]').click()
      await page.locator('[data-testid="confirm-delete"]').click()

      // THEN: Record should be deleted successfully
      await expect(page.locator('text=Record deleted')).toBeVisible()
    }
  )

  // ADMIN-TABLES-010: user is working with missing required fields → user attempts to create a record via POST without required fields → request should fail with validation error
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

  // ADMIN-TABLES-011: application is running → user creates a record via POST request → record should be created successfully
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

  // ADMIN-TABLES-012: user is working with missing required fields → user attempts to create multiple records via POST without required fields → request should fail with validation error
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

  // ADMIN-TABLES-013: application is running → user creates multiple records via POST request → records should be created successfully
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

  // ADMIN-TABLES-014: application is running with an existing record → user reads a record via GET request → record should be retrieved successfully
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

  // ADMIN-TABLES-015: application is running with records → user lists records via GET request → records should be listed successfully
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

  // ADMIN-TABLES-016: application is running with an existing record → user updates a record via PATCH request → record should be updated successfully
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

  // ADMIN-TABLES-017: application is running with multiple records → user updates multiple records via PATCH request → records should be updated successfully
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

  // ADMIN-TABLES-018: application is running with an existing record → user deletes a record via DELETE request → record should be deleted successfully
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

  // ADMIN-TABLES-019: application is running with multiple records → user deletes multiple records via DELETE request → records should be deleted successfully
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

// ============================================================================
// REGRESSION TEST (@regression)
// ONE consolidated test covering complete workflow
// Run during: CI/CD, pre-release (bun test:e2e:regression)
// ============================================================================

// ADMIN-TABLES-020: user is on the admin tables page with a complete table configuration → user performs complete workflow → all expected outcomes are verified
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
    await page.goto('/_admin/tables')
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
    await page.goto('/_admin/tables/1')
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
    await page.goto('/_admin/tables/1/records/1')
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
