/**
 * Example usage of Omnera's start function
 *
 * This file demonstrates the basic usage of Omnera to create and run
 * a web application with minimal boilerplate.
 *
 * ## Running this example
 *
 * ```bash
 * bun run example.ts
 * ```
 *
 * Then visit http://localhost:3000 in your browser.
 *
 * ## What This Example Shows
 *
 * - Basic server startup with `start()` function
 * - Automatic graceful shutdown handling (Ctrl+C)
 * - Automatic server information logging
 * - Simple Promise-based API (no Effect knowledge required)
 * - Default configuration (port: 3000, hostname: 'localhost')
 */

import { start } from './src/index'

// Define your application configuration
const myApp = {
  name: 'Omnera Demo',
  description:
    'A modern fullstack TypeScript framework built with Bun, Effect, Hono, React, and Tailwind CSS',
}

// Start the server (handles everything automatically with defaults)
start(myApp).catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
