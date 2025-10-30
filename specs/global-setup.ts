/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { DatabaseTemplateManager } from './database-utils'
import { ensureDockerRunning } from './docker-utils'

/**
 * Playwright Global Setup
 *
 * Initializes shared resources before all tests run:
 * - Ensures Docker daemon is running (auto-installs Colima on macOS if needed)
 * - Starts PostgreSQL testcontainer
 * - Creates database template with all migrations applied
 * - Stores container connection URL in environment for test workers
 *
 * **Note:** Docker Desktop is NOT required. This works with any Docker-compatible runtime:
 * - Colima (macOS) - auto-installed if missing
 * - Docker Engine (Linux)
 * - Podman (all platforms)
 * - Docker Desktop (all platforms) - if already installed
 *
 * This runs once per test run, not per worker.
 */
export default async function globalSetup() {
  console.log('🚀 Initializing global test database...')

  // Ensure Docker daemon is running (auto-install/start if needed)
  // On macOS: auto-installs Colima if no Docker found
  // On Linux/Windows: starts existing Docker installation
  await ensureDockerRunning()

  // Fix Docker credential provider issues by creating a temporary Docker config without credential helpers
  // This prevents "spawn docker-credential-desktop ENOENT" errors when pulling public images
  const tempDockerConfigDir = mkdtempSync(join(tmpdir(), 'docker-config-'))
  const tempDockerConfig = join(tempDockerConfigDir, 'config.json')
  writeFileSync(tempDockerConfig, JSON.stringify({ auths: {} }))
  process.env.DOCKER_CONFIG = tempDockerConfigDir

  // Also ensure testcontainers uses the correct Docker socket
  process.env.TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE = '/var/run/docker.sock'

  // Start PostgreSQL container
  const container = await new PostgreSqlContainer('postgres:16-alpine').start()

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

    // Clean up temporary Docker config directory
    try {
      const { rmSync } = await import('node:fs')
      rmSync(tempDockerConfigDir, { recursive: true, force: true })
    } catch {
      // Ignore cleanup errors
    }

    console.log('✅ Global test database cleaned up')
  }
}
