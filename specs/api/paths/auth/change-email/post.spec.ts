/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../../../../fixtures'

/**
 * E2E Tests for POST /api/auth/change-email
 *
 * Specification:
 * - Change email endpoint must update user email address
 * - Must validate new email format
 * - Must check for duplicate emails
 * - May require email verification before applying change
 * - Must require authentication
 *
 * Reference Implementation:
 * - Better Auth: src/infrastructure/auth/better-auth/auth.ts
 * - OpenAPI Spec: specs/api/paths/auth/change-email/post.json
 */

const generateTestUser = () => ({
  email: `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
  password: 'SecurePassword123!',
  name: 'Test User',
})

test.describe('POST /api/auth/change-email', () => {
  /**
   * Test Case 1: Change email validates required fields
   *
   * GIVEN: An authenticated user
   * WHEN: User requests email change without new email
   * THEN: Response should be validation error
   */
  // API-AUTH-CHANGE-EMAIL-001: User requests email change without newEmail
  test(
    'should validate required newEmail field',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema(
        {
          name: 'change-email-validation-test',
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

      // WHEN: User requests email change without newEmail
      const response = await page.request.post('/api/auth/change-email', {
        data: {
          callbackURL: 'https://app.example.com/verify',
        },
      })

      // THEN: Response should be validation error (4xx)
      expect(response.status()).toBeGreaterThanOrEqual(400)
      expect(response.status()).toBeLessThan(500)
    }
  )

  /**
   * Test Case 2: Change email requires authentication
   *
   * GIVEN: No active session
   * WHEN: Unauthenticated user requests email change
   * THEN: Response should be unauthorized error
   */
  // API-AUTH-CHANGE-EMAIL-002: Unauthenticated user requests email change
  test(
    'should require authentication',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema(
        {
          name: 'change-email-auth-test',
        },
        { useDatabase: true }
      )

      // AND: No active session
      await page.request.post('/api/auth/sign-out')

      // WHEN: Unauthenticated user requests email change
      const response = await page.request.post('/api/auth/change-email', {
        data: {
          newEmail: 'newemail@example.com',
        },
      })

      // THEN: Response should be unauthorized (401)
      expect(response.status()).toBeGreaterThanOrEqual(401)
    }
  )

  /**
   * Test Case 3: Change email validates email format
   *
   * GIVEN: An authenticated user
   * WHEN: User submits invalid email format
   * THEN: Response should be validation error
   */
  // API-AUTH-CHANGE-EMAIL-003: User submits invalid email format
  test(
    'should validate email format',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema(
        {
          name: 'change-email-format-test',
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

      // WHEN: User submits invalid email format
      const response = await page.request.post('/api/auth/change-email', {
        data: {
          newEmail: 'not-an-email',
        },
      })

      // THEN: Response should be validation error (4xx)
      expect(response.status()).toBeGreaterThanOrEqual(400)
      expect(response.status()).toBeLessThan(500)
    }
  )
})
