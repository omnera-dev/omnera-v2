/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../../../../fixtures'

/**
 * E2E Tests for POST /api/auth/sign-out
 *
 * Specification:
 * - Sign-out endpoint must invalidate current session
 * - Must clear session cookies
 * - Must return success status
 * - Subsequent session checks should return null
 *
 * Reference Implementation:
 * - Better Auth: src/infrastructure/auth/better-auth/auth.ts
 * - OpenAPI Spec: specs/api/paths/auth/sign-out/post.json
 */

const generateTestUser = () => ({
  email: `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
  password: 'SecurePassword123!',
  name: 'Test User',
})

test.describe('POST /api/auth/sign-out', () => {
  /**
   * Test Case: Sign-out invalidates session
   *
   * GIVEN: A user is authenticated
   * WHEN: User posts to /api/auth/sign-out
   * THEN: Session should be cleared and subsequent session check should return null
   */
  // API-AUTH-SIGN-OUT-001: User signs out
  test(
    'API-AUTH-SIGN-OUT-001: should invalidate session on sign-out',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema(
        {
          name: 'signout-test',
        },
        { useDatabase: true }
      )

      // AND: A user that is authenticated
      const testUser = generateTestUser()
      await page.request.post('/api/auth/sign-up/email', {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        },
      })

      // WHEN: User signs out
      const signOutResponse = await page.request.post('/api/auth/sign-out')

      // THEN: Sign-out should succeed
      expect(signOutResponse.status()).toBe(200)

      // AND: Subsequent session check should return no user
      const sessionResponse = await page.request.get('/api/auth/get-session')
      const sessionData = await sessionResponse.json()
      expect(sessionData?.user || sessionData).toBeNull()
    }
  )
})
