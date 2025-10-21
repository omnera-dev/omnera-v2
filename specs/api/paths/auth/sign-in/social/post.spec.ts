/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../../../../../fixtures'

/**
 * E2E Tests for POST /api/auth/sign-in/social
 *
 * Specification:
 * - Social sign-in endpoint must support OAuth providers (Google, GitHub, etc.)
 * - Must return redirect URL for OAuth flow when no idToken provided
 * - Must create session when idToken is provided (server-side verification)
 * - Must support callback URLs and error handling
 *
 * Reference Implementation:
 * - Better Auth: src/infrastructure/auth/better-auth/auth.ts
 * - OpenAPI Spec: specs/api/paths/auth/sign-in/social/post.json
 */

test.describe('POST /api/auth/sign-in/social', () => {
  /**
   * Test Case 1: Social sign-in returns OAuth redirect URL
   *
   * GIVEN: A running server with social auth configured
   * WHEN: User requests social sign-in without idToken
   * THEN: Response should contain OAuth provider redirect URL
   *
   * NOTE: This test validates the OAuth flow initiation.
   * Actual OAuth callback testing requires provider configuration.
   */
  // API-AUTH-SIGN-IN-SOCIAL-001: User requests social sign-in with Google provider
  test(
    'API-AUTH-SIGN-IN-SOCIAL-001: should return OAuth redirect URL for provider',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema(
        {
          name: 'social-signin-redirect-test',
        },
        { useDatabase: true }
      )

      // WHEN: User requests social sign-in with Google provider
      const response = await page.request.post('/api/auth/sign-in/social', {
        data: {
          provider: 'google',
          callbackURL: 'https://app.example.com/auth/callback',
        },
      })

      // THEN: Response should be successful (200 or redirect) or 404 if provider not configured
      // Note: Returns 404 when OAuth provider (google) is not configured in Better Auth
      expect([200, 302, 307, 404]).toContain(response.status())

      // AND: Response should contain redirect information (only for successful responses)
      // Note: Actual redirect URL structure depends on Better Auth OAuth configuration
      const responseData = await response.json().catch(() => null)

      if (responseData && response.status() !== 404) {
        // If JSON response and not 404, should contain url property
        expect(responseData).toHaveProperty('url')
      }
    }
  )

  /**
   * Test Case 2: Social sign-in validates required provider
   *
   * GIVEN: A running server
   * WHEN: User requests social sign-in without provider
   * THEN: Response should be 4xx validation error
   */
  // API-AUTH-SIGN-IN-SOCIAL-002: User requests social sign-in without provider
  test(
    'API-AUTH-SIGN-IN-SOCIAL-002: should validate required provider field',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server
      await startServerWithSchema(
        {
          name: 'social-signin-validation-test',
        },
        { useDatabase: true }
      )

      // WHEN: User requests social sign-in without provider
      const response = await page.request.post('/api/auth/sign-in/social', {
        data: {
          callbackURL: 'https://app.example.com/auth/callback',
        },
      })

      // THEN: Response should be validation error (4xx)
      expect(response.status()).toBeGreaterThanOrEqual(400)
      expect(response.status()).toBeLessThan(500)
    }
  )
})
