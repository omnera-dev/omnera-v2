/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Fix fixture imports to use TypeScript path alias
 *
 * This script:
 * 1. Finds all .spec.ts files
 * 2. Replaces relative fixture imports with @/specs/fixtures
 * 3. Updates validation scripts to expect new import format
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

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

async function fixFixtureImports(filePath: string): Promise<boolean> {
  const content = await readFile(filePath, 'utf-8')

  // Match any relative import from fixtures (../../fixtures, ../../../fixtures, etc.)
  const fixtureImportRegex = /import\s*{\s*test\s*,\s*expect\s*}\s*from\s*['"](\.\.\/)+fixtures['"]/g

  const newContent = content.replace(
    fixtureImportRegex,
    "import { test, expect } from '@/specs/fixtures'"
  )

  if (content !== newContent) {
    await writeFile(filePath, newContent, 'utf-8')
    return true
  }

  return false
}

async function main() {
  const specsDir = join(process.cwd(), 'specs')

  console.log('🔍 Updating fixture imports to use TypeScript path alias...\n')

  const files = await findTestFiles(specsDir)
  let modifiedCount = 0

  for (const file of files) {
    const relativePath = file.replace(process.cwd() + '/', '')
    const modified = await fixFixtureImports(file)

    if (modified) {
      console.log(`✓ ${relativePath}`)
      modifiedCount++
    }
  }

  console.log(`\n✅ Updated ${modifiedCount} files to use @/specs/fixtures`)
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
