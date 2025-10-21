/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Fix duplicate generic spec IDs (APP-SPEC-XXX) by making them entity-specific
 *
 * This script renames generic spec IDs like APP-SPEC-001 to entity-specific IDs
 * based on the file path (e.g., APP-MULTI-SELECT-FIELD-001).
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, basename, dirname } from 'node:path'

const SPECS_APP_DIR = join(process.cwd(), 'specs', 'app')

interface SpecFile {
  path: string
  relativePath: string
  content: any
  entityName: string
}

function extractEntityName(filePath: string): string {
  // Get the directory name (entity name)
  const dir = dirname(filePath)
  const entity = basename(dir)

  // Convert kebab-case to UPPERCASE-WITH-HYPHENS
  return entity.toUpperCase().replace(/-/g, '-')
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
            entityName: extractEntityName(fullPath),
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

async function fixDuplicateSpecIds() {
  console.log('🔍 Finding and fixing generic spec IDs...\n')

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

      // Check if spec ID is generic (APP-SPEC-XXX)
      const genericMatch = spec.id.match(/^APP-SPEC-(\d+)$/)
      if (genericMatch) {
        const number = genericMatch[1]
        const oldId = spec.id
        spec.id = `APP-${file.entityName}-${number}`

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
    }
  }

  console.log(`\n✅ Fixed ${totalFixed} generic spec IDs across ${totalFiles} files`)
}

fixDuplicateSpecIds().catch((error) => {
  console.error('❌ Error fixing spec IDs:', error)
  process.exit(1)
})
