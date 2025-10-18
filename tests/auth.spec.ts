/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from './fixtures'

/**
 * E2E Tests for Better Auth Integration
 *
 * These tests specify the behavior of authentication endpoints and database persistence.
 * They validate sign-up, sign-in, session management, and Better Auth + Drizzle integration.
 *
 * Specification:
 * - Sign-up endpoint (/api/auth/sign-up/email) must create user and session in database
 * - Sign-in endpoint (/api/auth/sign-in/email) must authenticate users and create sessions
 * - Session endpoint (/api/auth/session) must return current session or null
 * - Sign-out endpoint (/api/auth/sign-out) must invalidate sessions
 * - Database must persist user data across sign-in/sign-out cycles
 * - Duplicate emails must be rejected with proper error messages
 * - Invalid credentials must return appropriate authentication errors
 *
 * Reference Implementation:
 * - Better Auth: src/infrastructure/auth/better-auth/auth.ts
 * - Database Schema: src/infrastructure/database/drizzle/schema.ts (users, sessions, accounts, verifications)
 * - Server Integration: src/infrastructure/server/server.ts (line 59: Better Auth routes)
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

test.describe('Better Auth Integration', () => {
  /**
   * Test Suite: Sign-Up Endpoint (/api/auth/sign-up/email)
   *
   * The sign-up endpoint creates new user accounts with:
   * - User record in database
   * - Active session for immediate use
   * - Password hashing and security
   * - Email uniqueness validation
   */
  test.describe('/api/auth/sign-up/email endpoint', () => {
    /**
     * Test Case 1: Sign-up creates user and returns session
     *
     * GIVEN: A user with valid email, password, and name
     * WHEN: User posts credentials to /api/auth/sign-up/email
     * THEN: Response should be 200 OK with user data and session token
     *
     * Validates basic sign-up functionality and session creation
     * Reference: src/infrastructure/auth/better-auth/auth.ts
     */
    test(
      'should create user account and return session',
      { tag: '@spec' },
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
     *
     * Validates email uniqueness constraint
     * Reference: src/infrastructure/database/drizzle/schema.ts (users table - email unique constraint)
     */
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
     *
     * Validates input validation on sign-up endpoint
     */
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

  /**
   * Test Suite: Sign-In Endpoint (/api/auth/sign-in/email)
   *
   * The sign-in endpoint authenticates existing users with:
   * - Credential validation
   * - Session creation
   * - Cookie management
   * - Error handling for invalid credentials
   */
  test.describe('/api/auth/sign-in/email endpoint', () => {
    /**
     * Test Case 4: Sign-in authenticates valid credentials
     *
     * GIVEN: A user account exists in the database
     * WHEN: User posts correct credentials to /api/auth/sign-in/email
     * THEN: Response should be 200 OK with user data and session
     *
     * Validates successful authentication flow
     * Reference: src/infrastructure/auth/better-auth/auth.ts
     */
    test(
      'should authenticate user with valid credentials',
      { tag: '@critical' },
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
     * Test Case 5: Sign-in rejects wrong password
     *
     * GIVEN: A user account exists in the database
     * WHEN: User attempts sign-in with incorrect password
     * THEN: Response should be 4xx error with authentication error
     *
     * Validates password verification
     */
    test(
      'should reject incorrect password',
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
     * Test Case 6: Sign-in rejects non-existent email
     *
     * GIVEN: A running server
     * WHEN: User attempts sign-in with email that doesn't exist
     * THEN: Response should be 4xx error with authentication error
     *
     * Validates user existence check
     */
    test(
      'should reject non-existent email',
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

  /**
   * Test Suite: Session Management (/api/auth/session, /api/auth/sign-out)
   *
   * Session management validates:
   * - Current session retrieval
   * - Session invalidation on sign-out
   * - Null session for unauthenticated users
   */
  test.describe('Session management', () => {
    /**
     * Test Case 7: Session endpoint returns current session
     *
     * GIVEN: A user is authenticated
     * WHEN: User requests GET /api/auth/session
     * THEN: Response should contain current user session
     *
     * Validates session retrieval
     */
    test(
      'should return current session for authenticated user',
      { tag: '@spec' },
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
     * Test Case 8: Session endpoint returns null when not authenticated
     *
     * GIVEN: No active session exists
     * WHEN: User requests GET /api/auth/session
     * THEN: Response should be 200 OK with null user
     *
     * Validates unauthenticated session behavior
     */
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

    /**
     * Test Case 9: Sign-out invalidates session
     *
     * GIVEN: A user is authenticated
     * WHEN: User posts to /api/auth/sign-out
     * THEN: Session should be cleared and subsequent session check should return null
     *
     * Validates session termination
     */
    test(
      'should invalidate session on sign-out',
      { tag: '@spec' },
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

  /**
   * Test Suite: Database Persistence
   *
   * Validates that user data persists in Drizzle database:
   * - User records persist across sessions
   * - Data integrity (all required fields)
   * - Timestamps are set correctly
   */
  test.describe('Database persistence', () => {
    /**
     * Test Case 10: User data persists across sign-in/sign-out cycles
     *
     * GIVEN: A user signed up and created database records
     * WHEN: User signs out and signs in again
     * THEN: Same user ID and data should be retrieved from database
     *
     * Validates Drizzle database integration
     * Reference: src/infrastructure/database/drizzle/schema.ts (users table)
     */
    test(
      'should persist user data across authentication cycles',
      { tag: '@regression' },
      async ({ page, startServerWithSchema }) => {
        // GIVEN: A running server
        await startServerWithSchema(
          {
            name: 'persistence-test',
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
        const originalUserId = signUpData.user.id

        // Verify user data structure from sign-up
        expect(signUpData.user).toHaveProperty('id')
        expect(signUpData.user).toHaveProperty('email', testUser.email)
        expect(signUpData.user).toHaveProperty('name', testUser.name)
        expect(signUpData.user).toHaveProperty('emailVerified')
        expect(signUpData.user).toHaveProperty('createdAt')
        expect(signUpData.user).toHaveProperty('updatedAt')

        // Verify session token
        expect(signUpData).toHaveProperty('token')
        expect(typeof signUpData.token).toBe('string')

        // WHEN: User signs out and signs in again
        await page.request.post('/api/auth/sign-out')

        const signInResponse = await page.request.post('/api/auth/sign-in/email', {
          data: {
            email: testUser.email,
            password: testUser.password,
          },
        })

        const signInData = await signInResponse.json()

        // THEN: Same user ID should be returned (data persisted in database)
        expect(signInData.user.id).toBe(originalUserId)
        expect(signInData.user.email).toBe(testUser.email)
        expect(signInData.user.name).toBe(testUser.name)
      }
    )
  })

  /**
   * REGRESSION TEST: Complete Authentication Workflow
   *
   * This comprehensive test validates the entire authentication system
   * from end to end, covering all endpoints and database persistence.
   *
   * GIVEN: A running server with Better Auth + Drizzle integration
   * WHEN: User completes full authentication lifecycle
   * THEN: All authentication requirements should be met:
   *   1. Sign-up: Creates user in database with session
   *   2. Session check: Returns active session
   *   3. Sign-out: Invalidates session
   *   4. Sign-in: Authenticates and creates new session
   *   5. Persistence: Same user data across cycles
   *
   * This test serves as a regression suite to prevent breaking changes
   * to core authentication infrastructure.
   */
  test(
    'should handle complete authentication workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A running server with authentication enabled
      await startServerWithSchema(
        {
          name: 'complete-auth-workflow-test',
        },
        { useDatabase: true }
      )

      // AND: A unique test user
      const testUser = generateTestUser()

      // WHEN: User signs up
      const signUpResponse = await page.request.post('/api/auth/sign-up/email', {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        },
      })

      // THEN: Sign-up should succeed
      expect(signUpResponse.status()).toBe(200)
      const signUpData = await signUpResponse.json()
      const userId = signUpData.user.id

      // WHEN: User checks their session
      const sessionCheckResponse = await page.request.get('/api/auth/get-session')

      // THEN: Session should be active
      expect(sessionCheckResponse.status()).toBe(200)
      const sessionData = await sessionCheckResponse.json()
      expect(sessionData.user).toHaveProperty('id', userId)

      // WHEN: User signs out
      const signOutResponse = await page.request.post('/api/auth/sign-out')

      // THEN: Sign-out should succeed
      expect(signOutResponse.status()).toBe(200)

      // AND: Session should be cleared
      const noSessionResponse = await page.request.get('/api/auth/get-session')
      const noSessionData = await noSessionResponse.json()
      expect(noSessionData?.user || noSessionData).toBeNull()

      // WHEN: User signs in again with same credentials
      const signInResponse = await page.request.post('/api/auth/sign-in/email', {
        data: {
          email: testUser.email,
          password: testUser.password,
        },
      })

      // THEN: Sign-in should succeed
      expect(signInResponse.status()).toBe(200)

      // AND: Session should be restored with same user
      const restoredSessionResponse = await page.request.get('/api/auth/get-session')
      expect(restoredSessionResponse.status()).toBe(200)
      const restoredSessionData = await restoredSessionResponse.json()
      expect(restoredSessionData.user).toHaveProperty('id', userId)

      // Cleanup: Sign out
      await page.request.post('/api/auth/sign-out')
    }
  )
})
