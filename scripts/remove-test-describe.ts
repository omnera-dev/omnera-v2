#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Remove test.describe() blocks from all spec files
 *
 * This script:
 * 1. Finds all test.describe() blocks in spec files
 * 2. Removes the opening test.describe() line and closing })
 * 3. Unindents all content by 2 spaces
 *
 * Rationale:
 * - File paths already provide clear test organization
 * - test.describe() adds noise to test logs
 * - Cleaner, less nested code structure
 */

import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import prettier from 'prettier'

const PROJECT_ROOT = join(import.meta.dir, '..')
const SPECS_DIR = join(PROJECT_ROOT, 'specs')

/**
 * Recursively find all .spec.ts files
 */
async function findSpecFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await findSpecFiles(fullPath)))
    } else if (entry.isFile() && entry.name.endsWith('.spec.ts')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Format TypeScript content with Prettier
 */
async function formatTypeScript(content: string): Promise<string> {
  const prettierConfig = await prettier.resolveConfig(process.cwd())
  return prettier.format(content, {
    ...prettierConfig,
    parser: 'typescript',
  })
}

/**
 * Remove test.describe() wrapper from file content
 *
 * Strategy:
 * 1. Find the test.describe() line
 * 2. Find its matching closing }) by tracking brace depth
 * 3. Remove both lines and unindent everything in between
 */
function removeTestDescribe(content: string): string {
  const lines = content.split('\n')

  // Find test.describe() line
  let describeLineIndex = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]!.trim().startsWith('test.describe(')) {
      describeLineIndex = i
      break
    }
  }

  // If no test.describe() found, return unchanged
  if (describeLineIndex === -1) {
    return content
  }

  // Track brace depth starting from the test.describe() line
  let braceDepth = 0
  let closingBraceIndex = -1

  for (let i = describeLineIndex; i < lines.length; i++) {
    const line = lines[i]!
    for (const char of line) {
      if (char === '{') braceDepth++
      if (char === '}') braceDepth--

      // When we close all braces, we found the closing }) for test.describe
      if (braceDepth === 0 && char === '}' && i > describeLineIndex) {
        closingBraceIndex = i
        break
      }
    }
    if (closingBraceIndex !== -1) break
  }

  // If we didn't find the closing brace, return unchanged
  if (closingBraceIndex === -1) {
    return content
  }

  // Build result: keep lines before, unindent lines inside, skip describe lines, keep lines after
  const result: string[] = []

  // Lines before test.describe()
  for (let i = 0; i < describeLineIndex; i++) {
    result.push(lines[i]!)
  }

  // Lines inside test.describe() (unindented by 2 spaces)
  for (let i = describeLineIndex + 1; i < closingBraceIndex; i++) {
    const line = lines[i]!
    if (line.startsWith('  ')) {
      result.push(line.slice(2))
    } else {
      result.push(line)
    }
  }

  // Lines after closing })
  for (let i = closingBraceIndex + 1; i < lines.length; i++) {
    result.push(lines[i]!)
  }

  return result.join('\n')
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Finding spec files...\n')
  const specFiles = await findSpecFiles(SPECS_DIR)
  console.log(`   Found ${specFiles.length} spec files\n`)

  console.log('✂️  Removing test.describe() blocks...\n')

  for (const filePath of specFiles) {
    const content = await Bun.file(filePath).text()

    // Check if file has test.describe()
    if (!content.includes('test.describe(')) {
      console.log(`   ⏭️  ${filePath.replace(PROJECT_ROOT, '')} - No describe blocks`)
      continue
    }

    const updated = removeTestDescribe(content)
    const formatted = await formatTypeScript(updated)
    await Bun.write(filePath, formatted)
    console.log(`   ✅ ${filePath.replace(PROJECT_ROOT, '')}`)
  }

  console.log('\n🎉 Done! All test.describe() blocks removed')
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
