#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Quality check script - runs linting, type checking, and unit tests in parallel
 *
 * Usage:
 *   bun run scripts/quality.ts        # Run all checks in parallel
 *   bun run quality                    # Via package.json script
 *
 * Performance optimizations:
 * - Runs all checks concurrently using Promise.all()
 * - Uses ESLint cache for faster subsequent runs
 * - Uses TypeScript incremental mode for faster type checking
 * - Aggregates results and provides clear success/failure feedback
 */

import { $ } from 'bun'

interface CheckResult {
  name: string
  success: boolean
  duration: number
  error?: string
}

/**
 * Run a single quality check command
 */
async function runCheck(
  name: string,
  command: string,
  timeoutMs: number = 60_000
): Promise<CheckResult> {
  const startTime = performance.now()

  try {
    console.log(`  🔄 ${name}...`)

    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`${name} timed out after ${timeoutMs}ms`)), timeoutMs)
    })

    // Race between command and timeout
    const result = await Promise.race([$`${command}`.quiet(), timeoutPromise])

    const duration = Math.round(performance.now() - startTime)
    const success = result.exitCode === 0

    if (success) {
      console.log(`  ✅ ${name} passed (${duration}ms)`)
    } else {
      console.error(`  ❌ ${name} failed (${duration}ms)`)
      if (result.stderr.length > 0) {
        console.error(result.stderr.toString())
      }
    }

    return {
      name,
      success,
      duration,
      error: success ? undefined : result.stderr.toString(),
    }
  } catch (error) {
    const duration = Math.round(performance.now() - startTime)
    const errorMessage = error instanceof Error ? error.message : String(error)

    console.error(`  ❌ ${name} failed (${duration}ms)`)
    console.error(`     ${errorMessage}`)

    return {
      name,
      success: false,
      duration,
      error: errorMessage,
    }
  }
}

async function main() {
  console.log('🔍 Running quality checks in parallel...\n')

  const overallStart = performance.now()

  // Run all checks in parallel
  const results = await Promise.all([
    runCheck('ESLint', 'bunx eslint . --max-warnings 0 --cache', 30_000),
    runCheck('TypeScript', 'bunx tsc --noEmit --incremental', 60_000),
    runCheck('Unit Tests', 'bun test --concurrent src scripts', 30_000),
  ])

  const overallDuration = Math.round(performance.now() - overallStart)
  const allPassed = results.every((r) => r.success)

  // Print summary
  console.log('\n' + '─'.repeat(50))
  console.log('📊 Quality Check Summary')
  console.log('─'.repeat(50))

  for (const result of results) {
    const status = result.success ? '✅' : '❌'
    console.log(`${status} ${result.name.padEnd(20)} ${result.duration}ms`)
  }

  console.log('─'.repeat(50))
  console.log(`Total time: ${overallDuration}ms`)
  console.log('─'.repeat(50))

  if (allPassed) {
    console.log('✨ All quality checks passed!')
    process.exit(0)
  } else {
    const failedChecks = results
      .filter((r) => !r.success)
      .map((r) => r.name)
      .join(', ')
    console.error(`\n❌ Quality checks failed: ${failedChecks}`)
    console.error('\nRun individual commands to see detailed errors:')
    if (!results[0].success) console.error('  bun run lint')
    if (!results[1].success) console.error('  bun run typecheck')
    if (!results[2].success) console.error('  bun test:unit')
    process.exit(1)
  }
}

// Run the script
main().catch((error) => {
  console.error('Failed to run quality checks:', error)
  process.exit(1)
})
