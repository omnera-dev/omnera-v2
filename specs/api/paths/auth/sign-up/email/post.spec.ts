/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../../../../../fixtures'

/**
 * E2E Tests for POST /api/auth/sign-up/email
 *
 * Specification:
 * - Sign-up endpoint must create user and session in database
 * - Must validate required fields (email, password, name)
 * - Must reject duplicate email addresses with proper error
 * - Must return user data and session token on success
 *
 * Reference Implementation:
 * - Better Auth: src/infrastructure/auth/better-auth/auth.ts
 * - Database Schema: src/infrastructure/database/drizzle/schema.ts (users table)
 * - OpenAPI Spec: specs/api/paths/auth/sign-up/email/post.json
 */

/**
 * Helper function to generate unique test user data
 * Uses timestamp and random string to prevent email collisions across test runs
 */
const generateTestUser = () => ({
  email: `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
  password: 'SecurePassword123!',
  name: 'Test User',
})

test.describe('POST /api/auth/sign-up/email', () => {
  /**
   * Test Case 1: Sign-up creates user and returns session
   *
   * GIVEN: A user with valid email, password, and name
   * WHEN: User posts credentials to /api/auth/sign-up/email
   * THEN: Response should be 200 OK with user data and session token
   */
  // API-AUTH-SIGN-UP-EMAIL-001: User signs up with valid credentials
  test(
    'should create user account and return session',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema(
        {
          name: 'auth-signup-test',
        },
        { useDatabase: true }
      )

      // AND: A unique test user
      const testUser = generateTestUser()

      // WHEN: User signs up with valid credentials
      const response = await page.request.post('/api/auth/sign-up/email', {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        },
      })

      // THEN: Response should be 200 OK
      expect(response.status()).toBe(200)

      const responseData = await response.json()

      // AND: Response should contain user data
      expect(responseData).toHaveProperty('user')
      expect(responseData.user).toHaveProperty('email', testUser.email)
      expect(responseData.user).toHaveProperty('name', testUser.name)
      expect(responseData.user).toHaveProperty('id')

      // AND: Response should contain session token
      expect(responseData).toHaveProperty('token')
      expect(typeof responseData.token).toBe('string')
    }
  )

  /**
   * Test Case 2: Sign-up rejects duplicate email
   *
   * GIVEN: A user that already exists in the database
   * WHEN: Another user attempts to sign up with the same email
   * THEN: Response should be 4xx error with error message
   */
  // API-AUTH-SIGN-UP-EMAIL-002: Another user attempts sign-up with same email
  test(
    'should reject duplicate email addresses',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema(
        {
          name: 'duplicate-email-test',
        },
        { useDatabase: true }
      )

      // AND: A user that successfully signed up
      const testUser = generateTestUser()
      await page.request.post('/api/auth/sign-up/email', {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        },
      })

      // WHEN: Another user attempts sign-up with same email
      const duplicateResponse = await page.request.post('/api/auth/sign-up/email', {
        data: {
          email: testUser.email,
          password: 'DifferentPassword123!',
          name: 'Different Name',
        },
      })

      // THEN: Response should be client error (4xx)
      expect(duplicateResponse.status()).toBeGreaterThanOrEqual(400)
      expect(duplicateResponse.status()).toBeLessThan(500)

      // AND: Response should contain error message
      const errorData = await duplicateResponse.json()
      expect(errorData).toHaveProperty('message')
      expect(errorData).toHaveProperty('code')
    }
  )

  /**
   * Test Case 3: Sign-up validates required fields
   *
   * GIVEN: A running server
   * WHEN: User submits incomplete sign-up data
   * THEN: Response should be 4xx error for each missing/invalid field
   */
  // API-AUTH-SIGN-UP-EMAIL-003: User attempts sign-up without email
  test(
    'should validate required fields and email format',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema(
        {
          name: 'signup-validation-test',
        },
        { useDatabase: true }
      )

      // WHEN: User attempts sign-up without email
      const noEmailResponse = await page.request.post('/api/auth/sign-up/email', {
        data: {
          password: 'SecurePassword123!',
          name: 'Test User',
        },
      })

      // THEN: Request should fail
      expect(noEmailResponse.status()).toBeGreaterThanOrEqual(400)

      // WHEN: User attempts sign-up without password
      const noPasswordResponse = await page.request.post('/api/auth/sign-up/email', {
        data: {
          email: 'test@example.com',
          name: 'Test User',
        },
      })

      // THEN: Request should fail
      expect(noPasswordResponse.status()).toBeGreaterThanOrEqual(400)

      // WHEN: User attempts sign-up with invalid email
      const invalidEmailResponse = await page.request.post('/api/auth/sign-up/email', {
        data: {
          email: 'not-an-email',
          password: 'SecurePassword123!',
          name: 'Test User',
        },
      })

      // THEN: Request should fail
      expect(invalidEmailResponse.status()).toBeGreaterThanOrEqual(400)
    }
  )
})
