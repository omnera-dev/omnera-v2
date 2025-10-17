#!/usr/bin/env bun
/**
 * Claude Code hook for running quality checks on TypeScript files.
 * Runs on PostToolUse events for Edit and Write tools.
 *
 * This Bun-based implementation is ~10x faster than Python equivalent
 * with startup time of ~3-4ms vs 30-50ms for Python.
 */

import { $ } from 'bun'
import { existsSync } from 'node:fs'
import { basename, extname, join, dirname } from 'node:path'

interface HookInput {
  tool_name: string
  tool_input: {
    file_path?: string
    [key: string]: unknown
  }
  tool_output?: unknown
}

/**
 * Run a command with timeout and return success status
 */
async function runCommand(
  command: string,
  timeoutMs: number = 30000
): Promise<boolean> {
  try {
    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Command timeout')), timeoutMs)
    })

    // Race between command and timeout
    const result = await Promise.race([
      $`${command}`.quiet(),
      timeoutPromise
    ])

    return result.exitCode === 0
  } catch (error) {
    // Command failed or timed out
    return false
  }
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
  } catch (error) {
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

async function main() {
  const startTime = performance.now()

  try {
    // Read JSON input from stdin
    const input = await Bun.stdin.json() as HookInput

    // Only process Edit and Write tools
    if (!['Edit', 'Write'].includes(input.tool_name)) {
      process.exit(0)
    }

    // Get the file path
    const filePath = input.tool_input.file_path
    if (!filePath || !isTypeScriptFile(filePath)) {
      process.exit(0)
    }

    // Check if only comments changed
    const commentOnly = await isCommentOnlyChange(filePath)
    if (commentOnly) {
      console.log(`⏭️  Skipping checks for ${basename(filePath)} (comment-only change)`)
      process.exit(0)
    }

    const fileName = basename(filePath)
    console.log(`🔍 Running quality checks on ${fileName}...`)

    // Check if file is in src directory for Knip
    // Only run for source files to keep it fast (Knip analyzes the entire codebase)
    // Skip test files as they often have intentional "unused" exports
    const shouldRunKnip = filePath.includes('/src/') &&
                         !filePath.includes('.test.') &&
                         !filePath.includes('.spec.')

    // Run checks in parallel for maximum speed
    const checks = [
      // ESLint
      (async () => {
        console.log(`  📝 Linting ${fileName}...`)
        return await runCommand(`bunx eslint "${filePath}" --max-warnings 0`, 30000)
      })(),

      // TypeScript incremental check
      (async () => {
        console.log(`  ✅ Type checking...`)
        return await runCommand('bunx tsc --noEmit', 60000)
      })(),
    ]

    // Add Knip for source files only (not tests)
    if (shouldRunKnip) {
      checks.push(
        (async () => {
          console.log(`  🧹 Checking for unused code with Knip...`)
          const knipResult = await runCommand('bunx knip --no-progress --reporter compact', 45000)
          if (!knipResult) {
            console.log(`  ⚠️  Unused code detected! Run 'bun run clean' to see details`)
          } else {
            console.log(`  ✨ No unused code found`)
          }
          return knipResult
        })()
      )
    }

    await Promise.all(checks)

    // Run test if test file exists (sequential since it might depend on formatted code)
    const testFile = findTestFile(filePath)
    if (testFile) {
      const testFileName = basename(testFile)
      console.log(`  🧪 Running tests in ${testFileName}...`)
      await runCommand(`CLAUDECODE=1 bun test "${testFile}" --bail --concurrent`, 30000)
    }

    const elapsed = Math.round(performance.now() - startTime)
    console.log(`✨ Quality checks completed in ${elapsed}ms`)

  } catch (error) {
    console.error('Error in quality check hook:', error)
    process.exit(1)
  }
}

// Run the hook
main().catch((error) => {
  console.error('Failed to run quality check hook:', error)
  process.exit(1)
})
