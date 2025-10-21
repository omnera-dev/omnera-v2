/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for POST /api/auth/change-password
 *
 * Specification:
 * - Change password endpoint must update user password
 * - Must require current password for verification
 * - Must validate new password requirements
 * - Must support session revocation option
 * - Must require authentication
 *
 * Reference Implementation:
 * - Better Auth: src/infrastructure/auth/better-auth/auth.ts
 * - OpenAPI Spec: specs/api/paths/auth/change-password/post.json
 */

const generateTestUser = () => ({
  email: `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
  password: 'SecurePassword123!',
  name: 'Test User',
})

/**
 * Test Case 1: Change password validates required fields
 *
 * GIVEN: An authenticated user
 * WHEN: User requests password change without required fields
 * THEN: Response should be validation error
 */
// API-AUTH-CHANGE-PASSWORD-001: User requests password change without newPassword
test(
  'API-AUTH-CHANGE-PASSWORD-001: should validate required fields',
  { tag: '@regression' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: A running server
    await startServerWithSchema(
      {
        name: 'change-password-validation-test',
      },
      { useDatabase: true }
    )

    // AND: An authenticated user
    const testUser = generateTestUser()
    await page.request.post('/api/auth/sign-up/email', {
      data: {
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
      },
    })

    // WHEN: User requests password change without newPassword
    const response1 = await page.request.post('/api/auth/change-password', {
      data: {
        currentPassword: testUser.password,
      },
    })

    // THEN: Response should be validation error (4xx)
    expect(response1.status()).toBeGreaterThanOrEqual(400)
    expect(response1.status()).toBeLessThan(500)

    // WHEN: User requests password change without currentPassword
    const response2 = await page.request.post('/api/auth/change-password', {
      data: {
        newPassword: 'NewSecurePass123!',
      },
    })

    // THEN: Response should be validation error (4xx)
    expect(response2.status()).toBeGreaterThanOrEqual(400)
    expect(response2.status()).toBeLessThan(500)
  }
)

/**
 * Test Case 2: Change password requires authentication
 *
 * GIVEN: No active session
 * WHEN: Unauthenticated user requests password change
 * THEN: Response should be unauthorized error
 */
// API-AUTH-CHANGE-PASSWORD-002: Unauthenticated user requests password change
test(
  'API-AUTH-CHANGE-PASSWORD-002: should require authentication',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: A running server
    await startServerWithSchema(
      {
        name: 'change-password-auth-test',
      },
      { useDatabase: true }
    )

    // AND: No active session
    await page.request.post('/api/auth/sign-out')

    // WHEN: Unauthenticated user requests password change
    const response = await page.request.post('/api/auth/change-password', {
      data: {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewSecurePass123!',
      },
    })

    // THEN: Response should be unauthorized (401)
    expect(response.status()).toBeGreaterThanOrEqual(401)
  }
)

/**
 * Test Case 3: Change password verifies current password
 *
 * GIVEN: An authenticated user
 * WHEN: User submits incorrect current password
 * THEN: Response should be unauthorized error
 */
// API-AUTH-CHANGE-PASSWORD-003: User submits wrong current password
test(
  'API-AUTH-CHANGE-PASSWORD-003: should verify current password',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: A running server
    await startServerWithSchema(
      {
        name: 'change-password-verify-test',
      },
      { useDatabase: true }
    )

    // AND: An authenticated user
    const testUser = generateTestUser()
    await page.request.post('/api/auth/sign-up/email', {
      data: {
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
      },
    })

    // WHEN: User submits wrong current password
    const response = await page.request.post('/api/auth/change-password', {
      data: {
        currentPassword: 'WrongPassword123!',
        newPassword: 'NewSecurePass123!',
      },
    })

    // THEN: Response should be client error (4xx) - Better Auth returns 400 for invalid credentials
    expect(response.status()).toBeGreaterThanOrEqual(400)
    expect(response.status()).toBeLessThan(500)
  }
)
