import { test as base, expect } from '@playwright/test'
import type { ChildProcess } from 'child_process'
import { spawn } from 'child_process'

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
 * Helper function to start the CLI server with given app schema
 * Uses port 0 to let Bun automatically select an available port
 */
async function startCliServer(appSchema: { name: string; description: string }): Promise<{
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
 * Custom fixtures for CLI server with AppSchema configuration
 */
type ServerFixtures = {
  startServerWithSchema: (appSchema: { name: string; description: string }) => Promise<string>
}

/**
 * Extend Playwright test with server fixture
 * Provides a function to start server with custom AppSchema configuration
 * Server is automatically cleaned up after test completion
 */
const test = base.extend<ServerFixtures>({
  startServerWithSchema: async ({}, use) => {
    let serverProcess: ChildProcess | null = null

    // Provide function to start server with custom schema
    await use(async (appSchema: { name: string; description: string }) => {
      const server = await startCliServer(appSchema)
      serverProcess = server.process
      return server.url
    })

    // Cleanup: Stop server after test
    if (serverProcess) {
      await stopServer(serverProcess)
    }
  },
})

test.describe('CLI App E2E - F.I.R.S.T Principles', () => {
  // Each test is Fast, Independent, Repeatable, Self-validating, and Timely
  // Tests run in parallel using Bun's automatic port selection (port 0)
  // Playwright fixtures handle server lifecycle automatically

  test('should display app name as title', async ({ page, startServerWithSchema }) => {
    // GIVEN: A server configured with a specific app name
    const serverUrl = await startServerWithSchema({
      name: 'Test App Alpha',
      description: 'Alpha test description',
    })

    // WHEN: User navigates to the homepage
    await page.goto(serverUrl)

    // THEN: The app name should be displayed as the main heading
    const heading = page.locator('h1')
    await expect(heading).toHaveText('Test App Alpha')
  })

  test('should display app description as subtitle', async ({ page, startServerWithSchema }) => {
    // GIVEN: A server configured with a specific app description
    const serverUrl = await startServerWithSchema({
      name: 'Test App Beta',
      description: 'Beta test description',
    })

    // WHEN: User navigates to the homepage
    await page.goto(serverUrl)

    // THEN: The app description should be displayed as a subtitle
    const description = page.locator('p.text-xl').first()
    await expect(description).toHaveText('Beta test description')
  })

  test('should display both name and description together', async ({
    page,
    startServerWithSchema,
  }) => {
    // GIVEN: A server configured with both name and description
    const serverUrl = await startServerWithSchema({
      name: 'Test App Gamma',
      description: 'Gamma test description',
    })

    // WHEN: User navigates to the homepage
    await page.goto(serverUrl)

    // THEN: Both name and description should be visible
    await expect(page.locator('h1')).toContainText('Test App Gamma')
    await expect(page.locator('p.text-xl').first()).toContainText('Gamma test description')
    await expect(page).toHaveTitle(/Test App Gamma - Powered by Omnera/)
  })

  test('should display different app configurations correctly', async ({
    page,
    startServerWithSchema,
  }) => {
    // GIVEN: A server configured with dynamic app content
    const serverUrl = await startServerWithSchema({
      name: 'Dynamic App',
      description: 'Dynamically generated content',
    })

    // WHEN: User navigates to the homepage
    await page.goto(serverUrl)

    // THEN: Dynamic content should be displayed correctly
    await expect(page.locator('h1')).toHaveText('Dynamic App')
    await expect(page.locator('p.text-xl').first()).toHaveText('Dynamically generated content')

    // AND: Meta description should be set correctly
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', 'Dynamically generated content')
  })

  test('should handle special characters in app name and description', async ({
    page,
    startServerWithSchema,
  }) => {
    // GIVEN: A server configured with special characters in name and description
    const serverUrl = await startServerWithSchema({
      name: 'Test & App <Special>',
      description: 'Description with "quotes" & symbols',
    })

    // WHEN: User navigates to the homepage
    await page.goto(serverUrl)

    // THEN: Special characters should be properly escaped and displayed
    await expect(page.locator('h1')).toHaveText('Test & App <Special>')
    await expect(page.locator('p.text-xl').first()).toHaveText(
      'Description with "quotes" & symbols'
    )
  })
})
