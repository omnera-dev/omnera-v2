/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../../../../fixtures'

/**
 * E2E Tests for GET /api/auth/get-session
 *
 * Specification:
 * - Session endpoint must return current authenticated user session
 * - Must return null/empty when no active session exists
 * - Must include both user and session data when authenticated
 *
 * Reference Implementation:
 * - Better Auth: src/infrastructure/auth/better-auth/auth.ts
 * - OpenAPI Spec: specs/api/paths/auth/get-session/get.json
 */

const generateTestUser = () => ({
  email: `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
  password: 'SecurePassword123!',
  name: 'Test User',
})

test.describe('GET /api/auth/get-session', () => {
  /**
   * Test Case 1: Session endpoint returns current session
   *
   * GIVEN: A user is authenticated
   * WHEN: User requests GET /api/auth/get-session
   * THEN: Response should contain current user session
   */
  // API-AUTH-GET-SESSION-001: User requests current session
  test(
    'should return current session for authenticated user',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema(
        {
          name: 'session-check-test',
        },
        { useDatabase: true }
      )

      // AND: A user that signed up
      const testUser = generateTestUser()
      const signUpResponse = await page.request.post('/api/auth/sign-up/email', {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        },
      })
      const signUpData = await signUpResponse.json()
      const userId = signUpData.user.id

      // WHEN: User requests current session
      const sessionResponse = await page.request.get('/api/auth/get-session')

      // THEN: Response should be 200 OK
      expect(sessionResponse.status()).toBe(200)

      const sessionData = await sessionResponse.json()

      // AND: Session should contain user data
      expect(sessionData.user).toHaveProperty('id', userId)
    }
  )

  /**
   * Test Case 2: Session endpoint returns null when not authenticated
   *
   * GIVEN: No active session exists
   * WHEN: User requests GET /api/auth/get-session
   * THEN: Response should be 200 OK with null user
   */
  // API-AUTH-GET-SESSION-002: User requests current session
  test(
    'should return null session when not authenticated',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema(
        {
          name: 'no-session-test',
        },
        { useDatabase: true }
      )

      // AND: No active session (explicit sign-out)
      await page.request.post('/api/auth/sign-out')

      // WHEN: User requests current session
      const response = await page.request.get('/api/auth/get-session')

      // THEN: Response should be 200 OK
      expect(response.status()).toBe(200)

      const sessionData = await response.json()

      // AND: User should be undefined (no session)
      expect(sessionData?.user || sessionData).toBeNull()
    }
  )
})
