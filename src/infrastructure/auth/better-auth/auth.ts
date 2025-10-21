/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { openAPI } from 'better-auth/plugins'
import { db } from '../../database/drizzle/db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  // Allow any redirect URL for testing (should be restricted in production)
  trustedOrigins: ['*'],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Allow sign-up without email verification for testing
    // Password reset configuration
    sendResetPassword: async ({
      user,
      url,
      token,
    }: Readonly<{
      user: Readonly<{ email: string }>
      url: string
      token: string
    }>) => {
      // TODO: Implement email sending in production
      // For now, just log the reset link (for E2E tests to pass)
      console.log(`[TEST] Password reset for ${user.email}: ${url}?token=${token}`)
    },
    // Email verification configuration
    sendVerificationEmail: async ({
      user,
      url,
      token,
    }: Readonly<{
      user: Readonly<{ email: string }>
      url: string
      token: string
    }>) => {
      // TODO: Implement email sending in production
      // For now, just log the verification link (for E2E tests to pass)
      console.log(`[TEST] Email verification for ${user.email}: ${url}?token=${token}`)
    },
  },
  plugins: [
    openAPI({
      disableDefaultReference: true, // Use unified Scalar UI instead
    }),
  ],
})
