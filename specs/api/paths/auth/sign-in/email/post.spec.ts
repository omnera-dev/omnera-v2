/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../../../../../fixtures'

/**
 * E2E Tests for POST /api/auth/sign-in/email
 *
 * Specification:
 * - Sign-in endpoint must authenticate existing users with email/password
 * - Must create new session on successful authentication
 * - Must reject invalid credentials with proper error
 * - Must set session cookies correctly
 *
 * Reference Implementation:
 * - Better Auth: src/infrastructure/auth/better-auth/auth.ts
 * - OpenAPI Spec: specs/api/paths/auth/sign-in/email/post.json
 */

const generateTestUser = () => ({
  email: `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
  password: 'SecurePassword123!',
  name: 'Test User',
})

test.describe('POST /api/auth/sign-in/email', () => {
  /**
   * Test Case 1: Sign-in authenticates valid credentials
   *
   * GIVEN: A user account exists in the database
   * WHEN: User posts correct credentials to /api/auth/sign-in/email
   * THEN: Response should be 200 OK with user data and session
   */
  // API-AUTH-SIGN-IN-EMAIL-001: User signs in with correct credentials
  test(
    'API-AUTH-SIGN-IN-EMAIL-001: should authenticate user with valid credentials',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema(
        {
          name: 'signin-test',
        },
        { useDatabase: true }
      )

      // AND: A user that already signed up
      const testUser = generateTestUser()
      await page.request.post('/api/auth/sign-up/email', {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        },
      })

      // AND: User has signed out
      await page.request.post('/api/auth/sign-out')

      // WHEN: User signs in with correct credentials
      const response = await page.request.post('/api/auth/sign-in/email', {
        data: {
          email: testUser.email,
          password: testUser.password,
        },
      })

      // THEN: Response should be 200 OK
      expect(response.status()).toBe(200)

      const responseData = await response.json()

      // AND: Response should contain user data
      expect(responseData).toHaveProperty('user')
      expect(responseData.user).toHaveProperty('email', testUser.email)

      // AND: Response should contain session token
      expect(responseData).toHaveProperty('token')
      expect(typeof responseData.token).toBe('string')

      // AND: Session cookie should be set
      const cookies = await page.context().cookies()
      const sessionCookie = cookies.find((cookie) => cookie.name.includes('session'))
      expect(sessionCookie).toBeDefined()
    }
  )

  /**
   * Test Case 2: Sign-in rejects wrong password
   *
   * GIVEN: A user account exists in the database
   * WHEN: User attempts sign-in with incorrect password
   * THEN: Response should be 4xx error with authentication error
   */
  // API-AUTH-SIGN-IN-EMAIL-002: User attempts sign-in with wrong password
  test(
    'API-AUTH-SIGN-IN-EMAIL-002: should reject incorrect password',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema(
        {
          name: 'wrong-password-test',
        },
        { useDatabase: true }
      )

      // AND: A user that signed up
      const testUser = generateTestUser()
      await page.request.post('/api/auth/sign-up/email', {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        },
      })

      await page.request.post('/api/auth/sign-out')

      // WHEN: User attempts sign-in with wrong password
      const response = await page.request.post('/api/auth/sign-in/email', {
        data: {
          email: testUser.email,
          password: 'WrongPassword123!',
        },
      })

      // THEN: Response should be authentication error (4xx)
      expect(response.status()).toBeGreaterThanOrEqual(400)
      expect(response.status()).toBeLessThan(500)

      // AND: Response should contain error message
      const errorData = await response.json()
      expect(errorData).toHaveProperty('message')
      expect(errorData).toHaveProperty('code')
    }
  )

  /**
   * Test Case 3: Sign-in rejects non-existent email
   *
   * GIVEN: A running server
   * WHEN: User attempts sign-in with email that doesn't exist
   * THEN: Response should be 4xx error with authentication error
   */
  // API-AUTH-SIGN-IN-EMAIL-003: User attempts sign-in with non-existent email
  test(
    'API-AUTH-SIGN-IN-EMAIL-003: should reject non-existent email',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema(
        {
          name: 'nonexistent-email-test',
        },
        { useDatabase: true }
      )

      // WHEN: User attempts sign-in with non-existent email
      const response = await page.request.post('/api/auth/sign-in/email', {
        data: {
          email: 'nonexistent@example.com',
          password: 'SomePassword123!',
        },
      })

      // THEN: Response should be authentication error (4xx)
      expect(response.status()).toBeGreaterThanOrEqual(400)
      expect(response.status()).toBeLessThan(500)

      // AND: Response should contain error message
      const errorData = await response.json()
      expect(errorData).toHaveProperty('message')
      expect(errorData).toHaveProperty('code')
    }
  )
})
