/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Fix missing specs arrays in schema files
 *
 * This script adds empty specs arrays to schema files that are missing them.
 * Property schemas (like id, name, type, etc.) typically don't need individual
 * specs since they inherit behavioral specs from their parent entity.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const SPECS_APP_DIR = join(process.cwd(), 'specs', 'app')

async function findSchemaFiles(dir: string): Promise<string[]> {
  const files: string[] = []

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.schema.json')) {
        files.push(fullPath)
      }
    }
  }

  await walk(dir)
  return files
}

async function fixMissingSpecsArray(filePath: string): Promise<boolean> {
  const content = await readFile(filePath, 'utf-8')

  try {
    const json = JSON.parse(content)

    // Check if specs array is missing
    if (!('specs' in json)) {
      json.specs = []

      // Write back with pretty formatting
      const newContent = JSON.stringify(json, null, 2) + '\n'
      await writeFile(filePath, newContent, 'utf-8')
      return true
    }

    return false
  } catch (error) {
    console.error(`Failed to parse ${filePath}:`, error)
    return false
  }
}

async function main() {
  console.log('🔧 Fixing missing specs arrays in schema files...\n')

  const schemaFiles = await findSchemaFiles(SPECS_APP_DIR)
  let fixedCount = 0

  for (const filePath of schemaFiles) {
    const relativePath = filePath.replace(process.cwd() + '/', '')
    const fixed = await fixMissingSpecsArray(filePath)

    if (fixed) {
      console.log(`✓ ${relativePath}`)
      fixedCount++
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} schema files (added empty specs arrays)`)
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
