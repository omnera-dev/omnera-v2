/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Fix all spec IDs in specs/app/ to have APP- prefix
 *
 * This script automatically adds the APP- prefix to all spec IDs that don't have it.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const SPECS_APP_DIR = join(process.cwd(), 'specs', 'app')

interface SpecFile {
  path: string
  relativePath: string
  content: any
  modified: boolean
}

async function findSchemaFiles(dir: string): Promise<SpecFile[]> {
  const files: SpecFile[] = []

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.schema.json')) {
        try {
          const content = await readFile(fullPath, 'utf-8')
          const parsed = JSON.parse(content)

          files.push({
            path: fullPath,
            relativePath: fullPath.replace(SPECS_APP_DIR + '/', ''),
            content: parsed,
            modified: false,
          })
        } catch (error) {
          console.warn(`⚠️  Failed to parse ${fullPath}:`, error)
        }
      }
    }
  }

  await walk(dir)
  return files
}

async function fixSpecIds() {
  console.log('🔍 Finding all schema files with specs arrays...\n')

  const files = await findSchemaFiles(SPECS_APP_DIR)
  let totalFixed = 0
  let totalFiles = 0

  for (const file of files) {
    if (!file.content.specs || !Array.isArray(file.content.specs)) {
      continue
    }

    let fileModified = false

    for (const spec of file.content.specs) {
      if (!spec.id || typeof spec.id !== 'string') {
        continue
      }

      // Check if spec ID needs APP- prefix
      if (!spec.id.startsWith('APP-')) {
        const oldId = spec.id
        spec.id = `APP-${spec.id}`
        console.log(`  ${file.relativePath}`)
        console.log(`    ${oldId} → ${spec.id}`)
        totalFixed++
        fileModified = true
      }
    }

    if (fileModified) {
      // Write the modified JSON back to file
      const jsonString = JSON.stringify(file.content, null, 2) + '\n'
      await writeFile(file.path, jsonString, 'utf-8')
      totalFiles++
      file.modified = true
    }
  }

  console.log(`\n✅ Fixed ${totalFixed} spec IDs across ${totalFiles} files`)
}

fixSpecIds().catch((error) => {
  console.error('❌ Error fixing spec IDs:', error)
  process.exit(1)
})
