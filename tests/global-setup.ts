/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { DatabaseTemplateManager } from './database-utils'

/**
 * Playwright Global Setup
 *
 * Initializes shared resources before all tests run:
 * - Starts PostgreSQL testcontainer
 * - Creates database template with all migrations applied
 * - Stores container connection URL in environment for test workers
 *
 * This runs once per test run, not per worker.
 */
export default async function globalSetup() {
  console.log('🚀 Initializing global test database...')

  // Start PostgreSQL container
  const container = await new PostgreSqlContainer('postgres:16-alpine').withReuse().start()

  const connectionUrl = container.getConnectionUri()

  // Store connection URL for test workers
  process.env.TEST_DATABASE_CONTAINER_URL = connectionUrl

  // Create template manager and initialize template database
  const templateManager = new DatabaseTemplateManager(connectionUrl)
  await templateManager.createTemplate()

  console.log('✅ Global test database ready')

  // Return teardown function
  return async () => {
    console.log('🧹 Cleaning up global test database...')
    await templateManager.cleanup()
    await container.stop()
    console.log('✅ Global test database cleaned up')
  }
}
