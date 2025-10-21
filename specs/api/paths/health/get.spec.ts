/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../../../fixtures'

/**
 * E2E Tests for GET /api/health
 *
 * The health endpoint is critical for:
 * - Load balancer health checks
 * - Monitoring and alerting systems
 * - Deployment verification
 * - Service discovery
 *
 * Specification:
 * - Health endpoint must return JSON with status, timestamp, app name
 * - Must return 200 OK status
 * - Must have current timestamp (not stale)
 * - Must support scoped package names
 *
 * Reference Implementation:
 * - Server: src/infrastructure/server/server.ts
 * - Route: createHonoApp function (lines 42-49)
 * - OpenAPI Spec: specs/api/paths/health/get.json
 */

test.describe('GET /api/health', () => {
  /**
   * Test Case 1: Health endpoint returns 200 OK
   *
   * GIVEN: A running server
   * WHEN: User requests GET /api/health
   * THEN: Response should be 200 OK with JSON content-type
   */
  test('should return 200 OK status', { tag: '@spec' }, async ({ page, startServerWithSchema }) => {
    // GIVEN: A running server
    await startServerWithSchema({
      name: 'health-test-app',
    })

    // WHEN: User requests health endpoint
    const response = await page.goto('/api/health')

    // THEN: Response should be 200 OK
    expect(response?.status()).toBe(200)

    // AND: Content-Type should be application/json
    const contentType = response?.headers()['content-type']
    expect(contentType).toContain('application/json')
  })

  /**
   * Test Case 2: Health endpoint returns proper JSON structure
   *
   * GIVEN: A server with app name "monitoring-app"
   * WHEN: User requests GET /api/health
   * THEN: JSON should contain status, timestamp, and app object
   */
  test(
    'should return JSON with status, timestamp, and app name',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server with specific app name
      await startServerWithSchema({
        name: 'monitoring-app',
      })

      // WHEN: User requests health endpoint
      const response = await page.goto('/api/health')
      const json = await response?.json()

      // THEN: JSON should have status field
      expect(json).toHaveProperty('status', 'ok')

      // AND: JSON should have timestamp field (ISO 8601 format)
      expect(json).toHaveProperty('timestamp')
      expect(json.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)

      // AND: JSON should have app object with name
      expect(json).toHaveProperty('app')
      expect(json.app).toHaveProperty('name', 'monitoring-app')
    }
  )

  /**
   * Test Case 3: Health endpoint timestamp is current
   *
   * GIVEN: A running server
   * WHEN: User requests GET /api/health
   * THEN: Timestamp should be within last 5 seconds
   */
  test(
    'should return current timestamp',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema({
        name: 'timestamp-test',
      })

      // WHEN: User requests health endpoint
      const beforeRequest = new Date()
      const response = await page.goto('/api/health')
      const afterRequest = new Date()
      const json = await response?.json()

      // THEN: Timestamp should be between request start and end
      const timestamp = new Date(json.timestamp)
      expect(timestamp.getTime()).toBeGreaterThanOrEqual(beforeRequest.getTime() - 1000)
      expect(timestamp.getTime()).toBeLessThanOrEqual(afterRequest.getTime() + 1000)
    }
  )

  /**
   * Test Case 4: Health endpoint works with scoped package names
   *
   * GIVEN: A server with scoped app name "@myorg/dashboard"
   * WHEN: User requests GET /api/health
   * THEN: App name should preserve @ and / characters
   */
  test(
    'should handle scoped package names in health response',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server with scoped package name
      await startServerWithSchema({
        name: '@myorg/dashboard',
      })

      // WHEN: User requests health endpoint
      const response = await page.goto('/api/health')
      const json = await response?.json()

      // THEN: App name should preserve special characters
      expect(json.app.name).toBe('@myorg/dashboard')
    }
  )
})
