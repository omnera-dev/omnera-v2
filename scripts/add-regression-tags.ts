/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Add @regression tag to first test in each API test file
 *
 * According to validation rules:
 * - Each .spec.ts file must have EXACTLY ONE @regression test
 * - Regression tests run in CI/pre-merge
 * - @spec tests are for rapid development iteration
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const API_PATHS_DIR = join(process.cwd(), 'specs', 'api', 'paths')

async function findTestFiles(dir: string): Promise<string[]> {
  const files: string[] = []

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.name.endsWith('.spec.ts')) {
        files.push(fullPath)
      }
    }
  }

  await walk(dir)
  return files
}

async function addRegressionTag(filePath: string): Promise<boolean> {
  const content = await readFile(filePath, 'utf-8')

  // Check if @regression tag already exists
  if (content.includes('@regression')) {
    return false
  }

  const lines = content.split('\n')
  let modified = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue

    // Find the first test( declaration
    if (line.trim().startsWith('test(') || line.trim().startsWith('test.skip(')) {
      // Look for { tag: '@spec' } on the same or next line
      const _tagLineIndex = i

      // Check if tag is on the same line as test(
      if (line.includes('{') && line.includes('tag:')) {
        // Tag is inline: test('description', { tag: '@spec' }, async () => {
        // Replace @spec with @regression on first test only
        lines[i] = line.replace("tag: '@spec'", "tag: '@regression'")
        modified = true
        break
      } else {
        // Tag might be on next line
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const tagLine = lines[j]
          if (tagLine?.includes("tag: '@spec'")) {
            lines[j] = tagLine.replace("tag: '@spec'", "tag: '@regression'")
            modified = true
            break
          }
        }
        if (modified) break
      }
    }
  }

  if (modified) {
    const newContent = lines.join('\n')
    await writeFile(filePath, newContent, 'utf-8')
  }

  return modified
}

async function main() {
  console.log('🔍 Adding @regression tags to API test files...\n')

  const files = await findTestFiles(API_PATHS_DIR)
  let totalFiles = 0

  for (const file of files) {
    const modified = await addRegressionTag(file)

    if (modified) {
      const relativePath = file.replace(process.cwd() + '/', '')
      console.log(`  ✅ ${relativePath}`)
      totalFiles++
    }
  }

  console.log(`\n✅ Added @regression tags to ${totalFiles} test files`)
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
