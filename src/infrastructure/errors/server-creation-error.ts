/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Error class for server creation failures
 */
export class ServerCreationError {
  readonly _tag = 'ServerCreationError'
  constructor(readonly cause: unknown) {}
}
