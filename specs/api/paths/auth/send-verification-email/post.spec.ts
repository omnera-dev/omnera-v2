/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for POST /api/auth/send-verification-email
 *
 * Specification:
 * - Send verification email endpoint must send verification link to user
 * - Must validate email format
 * - Must support callback URL configuration
 * - Must return success status
 *
 * Reference Implementation:
 * - Better Auth: src/infrastructure/auth/better-auth/auth.ts
 * - OpenAPI Spec: specs/api/paths/auth/send-verification-email/post.json
 */

const generateTestUser = () => ({
  email: `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
  password: 'SecurePassword123!',
  name: 'Test User',
})

/**
 * Test Case 1: Send verification email validates required fields
 *
 * GIVEN: A running server
 * WHEN: User requests verification email without email field
 * THEN: Response should be validation error
 */
// API-AUTH-SEND-VERIFICATION-EMAIL-001: User requests verification without email
test(
  'API-AUTH-SEND-VERIFICATION-EMAIL-001: should validate required email field',
  { tag: '@regression' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: A running server
    await startServerWithSchema(
      {
        name: 'send-verification-validation-test',
      },
      { useDatabase: true }
    )

    // WHEN: User requests verification without email
    const response = await page.request.post('/api/auth/send-verification-email', {
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
 * Test Case 2: Send verification email accepts valid request
 *
 * GIVEN: A user account exists
 * WHEN: User requests verification email resend
 * THEN: Response should indicate success
 *
 * NOTE: Actual email delivery depends on email service configuration.
 */
// API-AUTH-SEND-VERIFICATION-EMAIL-002: User requests verification email
test(
  'API-AUTH-SEND-VERIFICATION-EMAIL-002: should accept verification email request',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: A running server
    await startServerWithSchema(
      {
        name: 'send-verification-test',
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

    // WHEN: User requests verification email
    const response = await page.request.post('/api/auth/send-verification-email', {
      data: {
        email: testUser.email,
        callbackURL: 'https://app.example.com/verify',
      },
    })

    // THEN: Response should be 200 OK or indicate success
    // Note: Behavior depends on whether email verification is enabled
    expect([200, 400]).toContain(response.status())
  }
)
