/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { spawn } from 'node:child_process'
import { test as base } from '@playwright/test'
import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { DatabaseTemplateManager, generateTestDatabaseName } from './database-utils'
import type { App } from '@/domain/models/app'
import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import type { ChildProcess } from 'node:child_process'

/**
 * Global PostgreSQL container and database template manager
 * Initialized once per test run, shared across all workers
 */
let globalPostgresContainer: StartedPostgreSqlContainer | null = null
let globalTemplateManager: DatabaseTemplateManager | null = null

/**
 * Helper function to extract port from server output
 */
function extractPortFromOutput(output: string): number | null {
  const match = output.match(/Homepage: http:\/\/localhost:(\d+)/)
  return match?.[1] ? parseInt(match[1], 10) : null
}

/**
 * Helper function to wait for server to be ready and extract port
 */
async function waitForServerPort(
  serverProcess: ChildProcess,
  maxAttempts: number = 50
): Promise<number> {
  return new Promise((resolve, reject) => {
    let attempts = 0
    const outputBuffer: string[] = []

    const checkOutput = (data: Buffer) => {
      const output = data.toString()
      outputBuffer.push(output)

      const port = extractPortFromOutput(output)
      if (port) {
        resolve(port)
      }
    }

    serverProcess.stdout?.on('data', checkOutput)
    serverProcess.stderr?.on('data', checkOutput)

    serverProcess.on('error', (error) => {
      reject(new Error(`Failed to start server process: ${error.message}`))
    })

    const interval = setInterval(() => {
      attempts++
      if (attempts >= maxAttempts) {
        clearInterval(interval)
        reject(
          new Error(
            `Server did not start within ${maxAttempts * 100}ms. Output: ${outputBuffer.join('\n')}`
          )
        )
      }
    }, 100)

    // Clean up interval when port is found
    serverProcess.once('exit', () => {
      clearInterval(interval)
      reject(new Error(`Server exited before starting. Output: ${outputBuffer.join('\n')}`))
    })
  })
}

/**
 * Get or create global database template manager
 * Lazily initializes on first use
 */
async function getTemplateManager(): Promise<DatabaseTemplateManager> {
  if (globalTemplateManager) {
    return globalTemplateManager
  }

  // Check if running in global setup context (connection URL in env)
  const connectionUrl = process.env.TEST_DATABASE_CONTAINER_URL
  if (!connectionUrl) {
    throw new Error(
      'Database container not initialized. Ensure globalSetup is configured in playwright.config.ts'
    )
  }

  // Create template manager (template already created in global setup)
  globalTemplateManager = new DatabaseTemplateManager(connectionUrl)
  return globalTemplateManager
}

/**
 * Initialize global PostgreSQL container and database template
 * Called once before all tests
 */
export async function initializeGlobalDatabase(): Promise<void> {
  if (globalPostgresContainer) {
    return // Already initialized
  }

  // Start PostgreSQL container
  globalPostgresContainer = await new PostgreSqlContainer('postgres:16-alpine').withReuse().start()

  const connectionUrl = globalPostgresContainer.getConnectionUri()

  // Store connection URL for test workers
  process.env.TEST_DATABASE_CONTAINER_URL = connectionUrl

  // Create template manager and initialize template database
  globalTemplateManager = new DatabaseTemplateManager(connectionUrl)
  await globalTemplateManager.createTemplate()
}

/**
 * Cleanup global PostgreSQL container and template
 * Called once after all tests
 */
export async function cleanupGlobalDatabase(): Promise<void> {
  if (globalTemplateManager) {
    await globalTemplateManager.cleanup()
    globalTemplateManager = null
  }

  if (globalPostgresContainer) {
    await globalPostgresContainer.stop()
    globalPostgresContainer = null
  }
}

/**
 * Helper function to start the CLI server with given app schema
 * Uses port 0 to let Bun automatically select an available port
 */
async function startCliServer(
  appSchema: App,
  databaseUrl?: string
): Promise<{
  process: ChildProcess
  url: string
  port: number
}> {
  // Start the server with CLI command using port 0 (Bun auto-selects available port)
  const serverProcess = spawn('bun', ['run', 'src/cli.ts'], {
    env: {
      ...process.env,
      OMNERA_APP_SCHEMA: JSON.stringify(appSchema),
      OMNERA_PORT: '0', // Let Bun select an available port
      ...(databaseUrl && { DATABASE_URL: databaseUrl }),
    },
    stdio: 'pipe',
  })

  try {
    // Wait for server to start and extract the actual port Bun selected
    const port = await waitForServerPort(serverProcess)
    const url = `http://localhost:${port}`

    // Verify server is ready by checking health endpoint
    const response = await fetch(`${url}/health`)
    if (!response.ok) {
      throw new Error(`Health check failed with status ${response.status}`)
    }

    return { process: serverProcess, url, port }
  } catch (error) {
    serverProcess.kill('SIGTERM')
    throw error
  }
}

/**
 * Helper function to stop the server gracefully
 */
async function stopServer(serverProcess: ChildProcess): Promise<void> {
  return new Promise((resolve) => {
    serverProcess.on('exit', () => {
      resolve()
    })
    serverProcess.kill('SIGTERM')
    // Force kill if not stopped within 2 seconds
    setTimeout(() => {
      if (!serverProcess.killed) {
        serverProcess.kill('SIGKILL')
      }
      resolve()
    }, 2000)
  })
}

/**
 * Custom fixtures for CLI server with AppSchema configuration and database isolation
 */
type ServerFixtures = {
  startServerWithSchema: (appSchema: App, options?: { useDatabase?: boolean }) => Promise<void>
}

/**
 * Extend Playwright test with server fixture
 * Provides:
 * - startServerWithSchema: Function to start server with custom AppSchema configuration
 *   - When options.useDatabase is true, creates an isolated test database
 * Server and database are automatically cleaned up after test completion
 * Configures baseURL for relative navigation with page.goto('/')
 */
export const test = base.extend<ServerFixtures>({
  // Server fixture: Start server with custom schema and optional database
  startServerWithSchema: async ({ page }, use, testInfo) => {
    let serverProcess: ChildProcess | null = null
    let serverUrl = ''
    let testDbName: string | null = null

    // Provide function to start server with custom schema
    await use(async (appSchema: App, options?: { useDatabase?: boolean }) => {
      let databaseUrl: string | undefined = undefined

      // Only duplicate database if requested
      if (options?.useDatabase) {
        const templateManager = await getTemplateManager()
        testDbName = generateTestDatabaseName(testInfo)
        databaseUrl = await templateManager.duplicateTemplate(testDbName)
      }

      const server = await startCliServer(appSchema, databaseUrl)
      serverProcess = server.process
      serverUrl = server.url

      // Override page.goto to prepend baseURL for relative paths
      const originalGoto = page.goto.bind(page)
      page.goto = (url: string, options?: Parameters<typeof page.goto>[1]) => {
        const fullUrl = url.startsWith('/') ? `${serverUrl}${url}` : url
        return originalGoto(fullUrl, options)
      }

      // Override page.request methods to prepend serverUrl for relative paths
      const originalPost = page.request.post.bind(page.request)
      const originalGet = page.request.get.bind(page.request)
      const originalPut = page.request.put.bind(page.request)
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      const originalDelete = page.request.delete.bind(page.request)
      const originalPatch = page.request.patch.bind(page.request)

      page.request.post = (urlOrRequest, options?) => {
        const url = typeof urlOrRequest === 'string' ? urlOrRequest : urlOrRequest
        const fullUrl = typeof url === 'string' && url.startsWith('/') ? `${serverUrl}${url}` : url
        return originalPost(fullUrl, options)
      }

      page.request.get = (urlOrRequest, options?) => {
        const url = typeof urlOrRequest === 'string' ? urlOrRequest : urlOrRequest
        const fullUrl = typeof url === 'string' && url.startsWith('/') ? `${serverUrl}${url}` : url
        return originalGet(fullUrl, options)
      }

      page.request.put = (urlOrRequest, options?) => {
        const url = typeof urlOrRequest === 'string' ? urlOrRequest : urlOrRequest
        const fullUrl = typeof url === 'string' && url.startsWith('/') ? `${serverUrl}${url}` : url
        return originalPut(fullUrl, options)
      }

      // eslint-disable-next-line drizzle/enforce-delete-with-where
      page.request.delete = (urlOrRequest, options?) => {
        const url = typeof urlOrRequest === 'string' ? urlOrRequest : urlOrRequest
        const fullUrl = typeof url === 'string' && url.startsWith('/') ? `${serverUrl}${url}` : url
        return originalDelete(fullUrl, options)
      }

      page.request.patch = (urlOrRequest, options?) => {
        const url = typeof urlOrRequest === 'string' ? urlOrRequest : urlOrRequest
        const fullUrl = typeof url === 'string' && url.startsWith('/') ? `${serverUrl}${url}` : url
        return originalPatch(fullUrl, options)
      }
    })

    // Cleanup: Stop server after test
    if (serverProcess) {
      await stopServer(serverProcess)
    }

    // Cleanup: Drop test database if it was created
    if (testDbName) {
      const templateManager = await getTemplateManager()
      await templateManager.dropTestDatabase(testDbName)
    }
  },
})

export { expect } from '@playwright/test'
