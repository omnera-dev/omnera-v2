#!/usr/bin/env bun
/**
 * Claude Code hook for running quality checks on TypeScript files.
 * Runs on PostToolUse events for Edit and Write tools.
 *
 * This hook delegates to the centralized quality script (scripts/quality.ts)
 * which handles comment-only change detection, parallel execution, and test discovery.
 */

import { extname, basename } from 'node:path'

interface HookInput {
  tool_name: string
  tool_input: {
    file_path?: string
    [key: string]: unknown
  }
  tool_output?: unknown
}

/**
 * Check if file is a TypeScript file
 */
function isTypeScriptFile(filePath: string): boolean {
  const ext = extname(filePath)
  return ext === '.ts' || ext === '.tsx'
}

async function main() {
  try {
    // Read JSON input from stdin
    const input = (await Bun.stdin.json()) as HookInput

    // Only process Edit and Write tools
    if (!['Edit', 'Write'].includes(input.tool_name)) {
      process.exit(0)
    }

    // Get the file path
    const filePath = input.tool_input.file_path
    if (!filePath || !isTypeScriptFile(filePath)) {
      process.exit(0)
    }

    const fileName = basename(filePath)
    console.log(`🔍 Running quality checks on ${fileName}...`)

    // Delegate to centralized quality script with file path
    // This script handles:
    // - Comment-only change detection (skip if only comments changed)
    // - Parallel execution of ESLint, TypeScript, and tests
    // - Test file discovery and execution
    // - Performance optimizations (cache, incremental)
    const proc = Bun.spawn(['bun', 'run', 'scripts/quality.ts', filePath], {
      stdout: 'inherit',
      stderr: 'inherit',
      env: {
        ...process.env,
        CLAUDECODE: '1', // Flag for test environment detection
      },
    })

    const exitCode = await proc.exited

    if (exitCode !== 0) {
      process.exit(1)
    }
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
