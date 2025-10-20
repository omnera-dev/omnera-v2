/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../../fixtures'

/**
 * E2E Tests for Tables - Property: fields
 *
 * Test Organization:
 * 1. @spec tests - Granular specification tests (2 tests)
 * 2. @regression test - ONE consolidated workflow test
 * 3. @critical test - Essential fields validation
 *
 * Source: docs/specifications/schemas/tables/tables.schema.json (lines 160-163)
 */

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
      await page.goto('/_admin/tables/1')

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

// ============================================================================
// REGRESSION TEST (@regression)
// ONE consolidated test covering complete fields workflow
// Run during: CI/CD, pre-release (bun test:e2e:ci)
// ============================================================================

test.fixme(
  'user can configure and manage table fields',
  { tag: '@regression' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: A table with multiple fields
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
            { id: 4, name: 'age', type: 'integer' },
            { id: 5, name: 'bio', type: 'long-text' },
          ],
        },
      ],
    })

    // WHEN: User views table configuration
    await page.goto('/_admin/tables/1')

    // THEN: All fields should be visible
    await expect(page.locator('[data-testid="field-item"]')).toHaveCount(5)

    // WHEN: User retrieves table via API
    const response = await page.request.get('/api/tables/1')
    const table = await response.json()

    // THEN: Fields array should be complete and in order
    expect(table.fields).toHaveLength(5)
    expect(table.fields[0].name).toBe('email')
    expect(table.fields[1].name).toBe('first_name')
    expect(table.fields[2].name).toBe('last_name')
    expect(table.fields[3].name).toBe('age')
    expect(table.fields[4].name).toBe('bio')

    // WHEN: User creates a record with all fields
    await page.locator('[data-testid="create-record-button"]').click()
    await page.locator('[data-testid="email-field"]').fill('complete@example.com')
    await page.locator('[data-testid="first_name-field"]').fill('John')
    await page.locator('[data-testid="last_name-field"]').fill('Doe')
    await page.locator('[data-testid="age-field"]').fill('30')
    await page.locator('[data-testid="bio-field"]').fill('A software developer')
    await page.locator('[data-testid="submit-button"]').click()

    // THEN: Record should be created with all field values
    await expect(page.locator('text=Record created')).toBeVisible()

    // WHEN: User retrieves the record
    const recordResponse = await page.request.get('/api/tables/1/records/1')
    const record = await recordResponse.json()

    // THEN: All fields should be present
    expect(record.email).toBe('complete@example.com')
    expect(record.first_name).toBe('John')
    expect(record.last_name).toBe('Doe')
    expect(record.age).toBe(30)
    expect(record.bio).toBe('A software developer')
  }
)

// ============================================================================
// CRITICAL PATH TEST (@critical)
// Essential fields array validation
// Run during: Every commit, production smoke tests (bun test:e2e:critical)
// ============================================================================

test.fixme(
  'critical: table must have at least one field',
  { tag: '@critical' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: A table with minimum required fields (1 field)
    await startServerWithSchema({
      name: 'test-app',
      description: 'Test application',
      version: '1.0.0',
      tables: [
        {
          id: 1,
          name: 'minimal_table',
          fields: [{ id: 1, name: 'required_field', type: 'single-line-text' }],
        },
      ],
    })

    // WHEN: Retrieving table configuration
    const response = await page.request.get('/api/tables/1')

    // THEN: Table should have the field
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.fields).toHaveLength(1)
    expect(body.fields[0].name).toBe('required_field')

    // AND: Field should be usable for record creation
    const createResponse = await page.request.post('/api/tables/1/records', {
      data: { required_field: 'test value' },
    })
    expect(createResponse.status()).toBe(201)
  }
)
