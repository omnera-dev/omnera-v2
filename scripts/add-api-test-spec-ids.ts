/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Add spec ID comments to API test files
 *
 * This script:
 * 1. Reads each .json file to extract spec IDs
 * 2. Reads corresponding .spec.ts file
 * 3. Adds // SPEC-ID: comments before each test() call
 * 4. Matches tests to specs by order (1st test = 1st spec, etc.)
 */

import { readdir, readFile, writeFile, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'

const API_DIR = join(process.cwd(), 'specs', 'api', 'paths')

interface SpecFile {
  path: string
  relativePath: string
  specs: Array<{ id: string; given: string; when: string; then: string }>
  testFilePath: string
}

async function findJsonFiles(dir: string): Promise<SpecFile[]> {
  const files: SpecFile[] = []

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.name.endsWith('.json') && !entry.name.includes('openapi')) {
        try {
          const content = await readFile(fullPath, 'utf-8')
          const json = JSON.parse(content)

          if (json.specs && Array.isArray(json.specs)) {
            const testFileName = entry.name.replace('.json', '.spec.ts')
            const testFilePath = join(dirname(fullPath), testFileName)

            // Check if test file exists
            try {
              await stat(testFilePath)
              files.push({
                path: fullPath,
                relativePath: fullPath.replace(process.cwd() + '/', ''),
                specs: json.specs,
                testFilePath,
              })
            } catch {
              // Test file doesn't exist, skip
            }
          }
        } catch (_error) {
          // Ignore invalid JSON files
        }
      }
    }
  }

  await walk(dir)
  return files
}

async function addSpecIdsToTestFile(specFile: SpecFile): Promise<boolean> {
  const testContent = await readFile(specFile.testFilePath, 'utf-8')

  // Check if spec IDs already exist
  if (testContent.includes('// API-')) {
    return false
  }

  const lines = testContent.split('\n')
  let modified = false
  let specIndex = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue

    // Look for test( declarations
    if (line.trim().startsWith('test(') || line.trim().startsWith('test.skip(')) {
      const spec = specFile.specs[specIndex]
      if (spec) {
        const specId = spec.id

        // Get the indentation of the test line
        const indentMatch = line.match(/^(\s*)/)
        const indent = indentMatch?.[1] ?? ''

        // Add spec ID comment above test
        lines.splice(i, 0, `${indent}// ${specId}: ${spec.when}`)

        modified = true
        specIndex++
        i++ // Skip the line we just added
      }
    }
  }

  if (modified) {
    const newContent = lines.join('\n')
    await writeFile(specFile.testFilePath, newContent, 'utf-8')
  }

  return modified
}

async function main() {
  console.log('🔍 Adding spec ID comments to API test files...\n')

  const files = await findJsonFiles(API_DIR)
  let totalFiles = 0

  for (const file of files) {
    const modified = await addSpecIdsToTestFile(file)

    if (modified) {
      const testRelativePath = file.testFilePath.replace(process.cwd() + '/', '')
      console.log(`  ✅ ${testRelativePath}`)
      totalFiles++
    }
  }

  console.log(`\n✅ Added spec IDs to ${totalFiles} test files`)
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
