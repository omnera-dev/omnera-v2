/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Fix $ref paths in API specs to correctly reference components
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, dirname, relative } from 'node:path'

const API_DIR = join(process.cwd(), 'specs', 'api')
const PATHS_DIR = join(API_DIR, 'paths')

function calculateRelativePath(fromFile: string): string {
  // Get relative path from file to API directory
  const dir = dirname(fromFile)
  const relativeToApi = relative(dir, API_DIR)

  // Return path to components directory
  return relativeToApi ? `${relativeToApi}/components` : './components'
}

async function fixFile(filePath: string) {
  const content = await readFile(filePath, 'utf-8')
  const json = JSON.parse(content)

  const correctPath = calculateRelativePath(filePath)
  let modified = false

  // Find and replace all $ref paths that point to components
  const jsonString = JSON.stringify(json, null, 2)

  // Replace any path that ends with /components/...
  const fixedString = jsonString.replace(/"(\.\.\/)+components\//g, `"${correctPath}/`)

  if (jsonString !== fixedString) {
    await writeFile(filePath, fixedString + '\n', 'utf-8')
    modified = true
  }

  return modified
}

async function findJsonFiles(dir: string): Promise<string[]> {
  const files: string[] = []

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.name.endsWith('.json')) {
        files.push(fullPath)
      }
    }
  }

  await walk(dir)
  return files
}

async function main() {
  console.log('🔍 Fixing $ref paths in API specs...\n')

  const files = await findJsonFiles(PATHS_DIR)
  let fixed = 0

  for (const file of files) {
    const relativePath = relative(process.cwd(), file)
    const modified = await fixFile(file)

    if (modified) {
      console.log(`  ✅ ${relativePath}`)
      fixed++
    }
  }

  console.log(`\n✅ Fixed ${fixed} files`)
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
