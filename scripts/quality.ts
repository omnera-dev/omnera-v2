#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Quality check script - runs linting, type checking, unit tests, and E2E regression tests in parallel
 *
 * Usage:
 *   bun run quality                   # Run all checks on entire codebase (ESLint, TypeScript, unit tests, E2E regression)
 *   bun run quality <file>            # Run checks on specific file (ESLint, TypeScript, unit tests only)
 *   bun run quality src/index.ts      # Example: check specific file
 *
 * Performance optimizations:
 * - Runs all checks concurrently using Promise.all()
 * - Uses ESLint cache for faster subsequent runs
 * - Uses TypeScript incremental mode for faster type checking
 * - Skips checks for comment-only changes (file mode)
 * - Aggregates results and provides clear success/failure feedback
 */

import { existsSync } from 'node:fs'
import { basename, dirname, extname, join } from 'node:path'
import { $ } from 'bun'

interface CheckResult {
  name: string
  success: boolean
  duration: number
  error?: string
}

/**
 * Check if file is a TypeScript file
 */
function isTypeScriptFile(filePath: string): boolean {
  const ext = extname(filePath)
  return ext === '.ts' || ext === '.tsx'
}

/**
 * Remove all comments from TypeScript code
 */
function stripComments(code: string): string {
  // Remove single-line comments
  let stripped = code.replace(/\/\/.*$/gm, '')

  // Remove multi-line comments
  stripped = stripped.replace(/\/\*[\s\S]*?\*\//g, '')

  // Remove JSDoc comments
  stripped = stripped.replace(/\/\*\*[\s\S]*?\*\//g, '')

  return stripped
}

/**
 * Check if only comments changed in a file using git diff
 */
async function isCommentOnlyChange(filePath: string): Promise<boolean> {
  try {
    // Check if file is tracked by git
    const statusResult = await $`git ls-files --error-unmatch "${filePath}"`.quiet()
    if (statusResult.exitCode !== 0) {
      // New file, not tracked - run checks
      return false
    }

    // Get the current staged/working version
    const currentContent = await Bun.file(filePath).text()

    // Get the HEAD version
    const headResult = await $`git show HEAD:"${filePath}"`.quiet()
    if (headResult.exitCode !== 0) {
      // File doesn't exist in HEAD (newly added) - run checks
      return false
    }
    const headContent = headResult.stdout.toString()

    // Strip comments from both versions
    const currentStripped = stripComments(currentContent).trim()
    const headStripped = stripComments(headContent).trim()

    // If stripped versions are identical, only comments changed
    return currentStripped === headStripped
  } catch {
    // On any error, assume it's not a comment-only change (safer to run checks)
    return false
  }
}

/**
 * Find test file for a given source file
 */
function findTestFile(filePath: string): string | null {
  const dir = dirname(filePath)
  const base = basename(filePath).replace(/\.(ts|tsx)$/, '')

  const testPatterns = [
    `${filePath.replace(/\.(ts|tsx)$/, '.test.ts')}`,
    `${filePath.replace(/\.(ts|tsx)$/, '.test.tsx')}`,
    join(dir, `${base}.test.ts`),
    join(dir, `${base}.test.tsx`),
  ]

  for (const pattern of testPatterns) {
    if (existsSync(pattern)) {
      return pattern
    }
  }

  return null
}

/**
 * Run a single quality check command
 */
async function runCheck(
  name: string,
  command: string[],
  timeoutMs: number = 60_000
): Promise<CheckResult> {
  const startTime = performance.now()

  try {
    console.log(`  🔄 ${name}...`)

    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`${name} timed out after ${timeoutMs}ms`)), timeoutMs)
    })

    // Execute command with proper argument splitting
    const proc = Bun.spawn(command, {
      stdout: 'pipe',
      stderr: 'pipe',
    })

    // Race between command completion and timeout
    const result = await Promise.race([
      (async () => {
        const exitCode = await proc.exited
        const stderr = await new Response(proc.stderr).text()
        const stdout = await new Response(proc.stdout).text()
        return { exitCode, stderr, stdout }
      })(),
      timeoutPromise,
    ])

    const duration = Math.round(performance.now() - startTime)
    const success = result.exitCode === 0

    if (success) {
      console.log(`  ✅ ${name} passed (${duration}ms)`)
    } else {
      console.error(`  ❌ ${name} failed (${duration}ms)`)
      if (result.stderr.length > 0) {
        console.error(result.stderr)
      }
    }

    return {
      name,
      success,
      duration,
      error: success ? undefined : result.stderr,
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
  // Parse command line arguments
  const args = process.argv.slice(2)
  const filePath = args[0]

  // Single file mode
  if (filePath) {
    // Validate file exists and is TypeScript
    if (!existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`)
      process.exit(1)
    }

    if (!isTypeScriptFile(filePath)) {
      console.log(`⏭️  Skipping checks for ${basename(filePath)} (not a TypeScript file)`)
      process.exit(0)
    }

    // Check if only comments changed
    const commentOnly = await isCommentOnlyChange(filePath)
    if (commentOnly) {
      console.log(`⏭️  Skipping checks for ${basename(filePath)} (comment-only change)`)
      process.exit(0)
    }

    const fileName = basename(filePath)
    console.log(`🔍 Running quality checks on ${fileName}...\n`)

    const overallStart = performance.now()

    // Run checks in parallel for specific file
    // Note: TypeScript always checks entire project (incremental makes it fast)
    const checks = [
      runCheck('ESLint', ['bunx', 'eslint', filePath, '--max-warnings', '0', '--cache'], 30_000),
      runCheck('TypeScript', ['bunx', 'tsc', '--noEmit', '--incremental'], 60_000),
    ]

    // Add test file check if it exists
    const testFile = findTestFile(filePath)
    if (testFile) {
      const testFileName = basename(testFile)
      checks.push(
        runCheck(
          `Unit Test (${testFileName})`,
          ['bun', 'test', testFile, '--bail', '--concurrent'],
          30_000
        )
      )
    }

    const results = await Promise.all(checks)
    const overallDuration = Math.round(performance.now() - overallStart)
    const allPassed = results.every((r) => r.success)

    console.log(`\n✨ Quality checks completed in ${overallDuration}ms`)

    if (!allPassed) {
      process.exit(1)
    }
    process.exit(0)
  }

  // Full codebase mode
  console.log('🔍 Running quality checks on entire codebase in parallel...\n')

  const overallStart = performance.now()

  // Run all checks in parallel
  const results = await Promise.all([
    runCheck('ESLint', ['bunx', 'eslint', '.', '--max-warnings', '0', '--cache'], 30_000),
    runCheck('TypeScript', ['bunx', 'tsc', '--noEmit', '--incremental'], 60_000),
    runCheck('Unit Tests', ['bun', 'test', '--concurrent', 'src', 'scripts'], 30_000),
    runCheck('E2E Regression Tests', ['bunx', 'playwright', 'test', '--grep=@regression'], 120_000),
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
    if (!results[3].success) console.error('  bun test:e2e:regression')
    process.exit(1)
  }
}

// Run the script
main().catch((error) => {
  console.error('Failed to run quality checks:', error)
  process.exit(1)
})
