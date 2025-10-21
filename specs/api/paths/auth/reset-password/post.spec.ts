/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../../../../fixtures'

/**
 * E2E Tests for POST /api/auth/reset-password
 *
 * Specification:
 * - Reset password endpoint must update password with valid token
 * - Must validate new password requirements
 * - Must reject expired or invalid tokens
 * - User should be able to sign in with new password after reset
 *
 * Reference Implementation:
 * - Better Auth: src/infrastructure/auth/better-auth/auth.ts
 * - OpenAPI Spec: specs/api/paths/auth/reset-password/post.json
 */

const generateTestUser = () => ({
  email: `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
  password: 'SecurePassword123!',
  name: 'Test User',
})

test.describe('POST /api/auth/reset-password', () => {
  /**
   * Test Case: Reset password validates new password
   *
   * GIVEN: A running server
   * WHEN: User submits password reset without required fields
   * THEN: Response should be validation error
   *
   * NOTE: Full password reset flow requires email integration.
   * This test validates endpoint validation behavior.
   */
  test(
    'should validate required fields',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema(
        {
          name: 'reset-password-validation-test',
        },
        { useDatabase: true }
      )

      // WHEN: User submits reset without new password
      const response = await page.request.post('/api/auth/reset-password', {
        data: {
          token: 'some-token',
        },
      })

      // THEN: Response should be validation error (4xx)
      expect(response.status()).toBeGreaterThanOrEqual(400)
      expect(response.status()).toBeLessThan(500)
    }
  )

  /**
   * Test Case: Reset password rejects invalid token
   *
   * GIVEN: A running server
   * WHEN: User submits password reset with invalid token
   * THEN: Response should be unauthorized error
   */
  test(
    'should reject invalid reset token',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema(
        {
          name: 'reset-password-invalid-token-test',
        },
        { useDatabase: true }
      )

      // WHEN: User submits reset with invalid token
      const response = await page.request.post('/api/auth/reset-password', {
        data: {
          newPassword: 'NewSecurePass123!',
          token: 'invalid-token-12345',
        },
      })

      // THEN: Response should be client error (4xx) - Better Auth returns 400 for invalid token
      expect(response.status()).toBeGreaterThanOrEqual(400)
      expect(response.status()).toBeLessThan(500)
    }
  )
})
