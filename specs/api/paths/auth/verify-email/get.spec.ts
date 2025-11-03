/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for GET /api/auth/verify-email
 *
 * Specification:
 * - Email verification endpoint must verify user email with valid token
 * - Must update emailVerified flag in user record
 * - Must reject invalid or expired tokens
 * - Must support callback URL redirection
 *
 * Reference Implementation:
 * - Better Auth: src/infrastructure/auth/better-auth/auth.ts
 * - OpenAPI Spec: specs/api/paths/auth/verify-email/get.json
 */

/**
 * Test Case 1: Email verification requires token parameter
 *
 * GIVEN: A running server
 * WHEN: User requests email verification without token
 * THEN: Response should be validation error
 */
// API-AUTH-VERIFY-EMAIL-001: User requests verification without token
test(
  'API-AUTH-VERIFY-EMAIL-001: should require verification token',
  { tag: '@regression' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: A running server
    await startServerWithSchema(
      {
        name: 'verify-email-missing-token-test',
      },
      { useDatabase: true }
    )

    // WHEN: User requests verification without token
    const response = await page.request.get('/api/auth/verify-email')

    // THEN: Response should be validation error (4xx)
    expect(response.status()).toBeGreaterThanOrEqual(400)
    expect(response.status()).toBeLessThan(500)
  }
)

/**
 * Test Case 2: Email verification rejects invalid token
 *
 * GIVEN: A running server
 * WHEN: User submits invalid verification token
 * THEN: Response should be unauthorized error
 */
// API-AUTH-VERIFY-EMAIL-002: User submits invalid token
test(
  'API-AUTH-VERIFY-EMAIL-002: should reject invalid verification token',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: A running server
    await startServerWithSchema(
      {
        name: 'verify-email-invalid-token-test',
      },
      { useDatabase: true }
    )

    // WHEN: User submits invalid token
    const response = await page.request.get('/api/auth/verify-email?token=invalid-token-12345')

    // THEN: Response should be unauthorized error (401)
    expect(response.status()).toBeGreaterThanOrEqual(401)
  }
)
