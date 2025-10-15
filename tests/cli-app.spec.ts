import { test, expect } from '@playwright/test'
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

test.describe('CLI App E2E - F.I.R.S.T Principles', () => {
  // Each test is Fast, Independent, Repeatable, Self-validating, and Timely
  // Tests run in parallel using Bun's automatic port selection (port 0)

  test('should display app name as title', async ({ page }) => {
    // Fast: Starts its own server, Independent: No shared state
    const server = await startCliServer({
      name: 'Test App Alpha',
      description: 'Alpha test description',
    })

    try {
      // Self-validating: Clear assertions
      await page.goto(server.url)
      const heading = page.locator('h1')
      await expect(heading).toHaveText('Test App Alpha')
    } finally {
      // Timely: Clean up immediately after test
      await stopServer(server.process)
    }
  })

  test('should display app description as subtitle', async ({ page }) => {
    // Fast: Starts its own server, Independent: No shared state
    const server = await startCliServer({
      name: 'Test App Beta',
      description: 'Beta test description',
    })

    try {
      // Self-validating: Clear assertions
      await page.goto(server.url)
      const description = page.locator('p.text-xl').first()
      await expect(description).toHaveText('Beta test description')
    } finally {
      // Timely: Clean up immediately after test
      await stopServer(server.process)
    }
  })

  test('should display both name and description together', async ({ page }) => {
    // Fast: Starts its own server, Independent: No shared state
    const server = await startCliServer({
      name: 'Test App Gamma',
      description: 'Gamma test description',
    })

    try {
      // Self-validating: Multiple clear assertions
      await page.goto(server.url)

      await expect(page.locator('h1')).toContainText('Test App Gamma')
      await expect(page.locator('p.text-xl').first()).toContainText('Gamma test description')
      await expect(page).toHaveTitle(/Test App Gamma - Powered by Omnera/)
    } finally {
      // Timely: Clean up immediately after test
      await stopServer(server.process)
    }
  })

  test('should display different app configurations correctly', async ({ page }) => {
    // Repeatable: Each run uses fresh configuration
    const server = await startCliServer({
      name: 'Dynamic App',
      description: 'Dynamically generated content',
    })

    try {
      // Self-validating: Verifies dynamic content rendering
      await page.goto(server.url)

      await expect(page.locator('h1')).toHaveText('Dynamic App')
      await expect(page.locator('p.text-xl').first()).toHaveText('Dynamically generated content')

      // Verify meta description is also set correctly
      const metaDescription = page.locator('meta[name="description"]')
      await expect(metaDescription).toHaveAttribute('content', 'Dynamically generated content')
    } finally {
      // Timely: Clean up immediately after test
      await stopServer(server.process)
    }
  })

  test('should handle special characters in app name and description', async ({ page }) => {
    // Repeatable: Tests edge case with special characters
    const server = await startCliServer({
      name: 'Test & App <Special>',
      description: 'Description with "quotes" & symbols',
    })

    try {
      // Self-validating: Ensures proper HTML escaping
      await page.goto(server.url)

      await expect(page.locator('h1')).toHaveText('Test & App <Special>')
      await expect(page.locator('p.text-xl').first()).toHaveText(
        'Description with "quotes" & symbols'
      )
    } finally {
      // Timely: Clean up immediately after test
      await stopServer(server.process)
    }
  })
})
