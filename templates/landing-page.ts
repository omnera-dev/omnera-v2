/**
 * Landing Page Template - Minimal Omnera Application
 *
 * This template demonstrates the simplest possible Omnera application:
 * a single landing page with just an app name.
 *
 * ## Running This Template
 *
 * ```bash
 * bun run templates/landing-page.ts
 * ```
 *
 * Then visit http://localhost:3000 in your browser.
 *
 * ## What You Get
 *
 * - **Single-page app** - Clean landing page with app name
 * - **React SSR** - Server-side rendered with React 19
 * - **Tailwind CSS** - Styled with gradient background, auto-compiled
 * - **Auto-shutdown** - Graceful shutdown on Ctrl+C (SIGINT/SIGTERM)
 * - **Zero config** - Runs on port 3000, localhost by default
 *
 * ## Customization
 *
 * To customize the port or hostname:
 *
 * ```typescript
 * start(myApp, {
 *   port: 8080,
 *   hostname: '0.0.0.0'
 * })
 * ```
 */

import { start, type App } from '@/index'

// Define your application configuration
const myApp: App = {
  name: 'omnera-landing-page-demo',
}

// Start the server (handles everything automatically with defaults)
start(myApp)
