import type { App } from '@/schema'
import { test as base } from '@playwright/test'
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
async function startCliServer(appSchema: App): Promise<{
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
  startServerWithSchema: (appSchema: App) => Promise<void>
}

/**
 * Extend Playwright test with server fixture
 * Provides a function to start server with custom AppSchema configuration
 * Server is automatically cleaned up after test completion
 * Configures baseURL for relative navigation with page.goto('/')
 */
export const test = base.extend<ServerFixtures>({
  startServerWithSchema: async ({ page }, use) => {
    let serverProcess: ChildProcess | null = null
    let serverUrl = ''

    // Provide function to start server with custom schema
    await use(async (appSchema: App) => {
      const server = await startCliServer(appSchema)
      serverProcess = server.process
      serverUrl = server.url

      // Override page.goto to prepend baseURL for relative paths
      const originalGoto = page.goto.bind(page)
      page.goto = async (
        url: string,
        options?: Parameters<typeof page.goto>[1]
      ): ReturnType<typeof page.goto> => {
        const fullUrl = url.startsWith('/') ? `${serverUrl}${url}` : url
        return originalGoto(fullUrl, options)
      }
    })

    // Cleanup: Stop server after test
    if (serverProcess) {
      await stopServer(serverProcess)
    }
  },
})

export { expect } from '@playwright/test'
