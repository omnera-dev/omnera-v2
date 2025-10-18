/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Auth Error
 *
 * Tagged error for authentication failures.
 */
export class AuthError {
  readonly _tag = 'AuthError'
  constructor(readonly cause: unknown) {}
}
