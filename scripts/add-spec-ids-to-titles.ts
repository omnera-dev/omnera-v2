/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Add spec IDs to test titles
 *
 * This script reads spec IDs from schema JSON files and adds them
 * as prefixes to test titles if they're missing.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const SPECS_APP_DIR = join(process.cwd(), 'specs', 'app')

interface Spec {
  id: string
  given: string
  when: string
  then: string
}

async function findSpecFiles(dir: string): Promise<string[]> {
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

async function getSpecsFromSchema(schemaPath: string): Promise<Spec[]> {
  try {
    const content = await readFile(schemaPath, 'utf-8')
    const json = JSON.parse(content)
    return json.specs || []
  } catch {
    return []
  }
}

async function addSpecIdsToTitles(testFilePath: string): Promise<boolean> {
  const schemaPath = testFilePath.replace('.spec.ts', '.schema.json')
  const specs = await getSpecsFromSchema(schemaPath)

  if (specs.length === 0) {
    return false
  }

  const content = await readFile(testFilePath, 'utf-8')
  const lines = content.split('\n')
  let modified = false
  let currentSpecIndex = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue

    // Match test declarations: test( or test.skip( or test.fixme(
    const testMatch = line.match(/^\s*test(?:\.skip|\.fixme)?\s*\(/)

    if (testMatch) {
      // Look for title on next lines
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const titleLine = lines[j]
        if (!titleLine) continue

        const titleMatch = titleLine.match(/^\s*['"]([^'"]+)['"]/)
        if (titleMatch) {
          const currentTitle = titleMatch[1]

          // Check if title already has spec ID prefix
          const hasSpecId = /^[A-Z]+(?:-[A-Z]+)*-\d{3,}:/.test(currentTitle || '')

          if (!hasSpecId && currentSpecIndex < specs.length) {
            const spec = specs[currentSpecIndex]
            if (spec) {
              const newTitle = `${spec.id}: ${currentTitle}`
              lines[j] = titleLine
                .replace(`'${currentTitle}'`, `'${newTitle}'`)
                .replace(`"${currentTitle}"`, `"${newTitle}"`)
              modified = true
              console.log(`  ✓ Added ${spec.id} to: "${currentTitle}"`)
            }
          }

          currentSpecIndex++
          break
        }

        // Stop if we hit opening brace or another test
        if (titleLine.includes('{') || titleLine.match(/test\s*\(/)) {
          break
        }
      }
    }
  }

  if (modified) {
    const newContent = lines.join('\n')
    await writeFile(testFilePath, newContent, 'utf-8')
  }

  return modified
}

async function main() {
  console.log('🔧 Adding spec IDs to test titles...\n')

  const testFiles = await findSpecFiles(SPECS_APP_DIR)
  let fixedCount = 0

  for (const testFile of testFiles) {
    const relativePath = testFile.replace(process.cwd() + '/', '')
    const fixed = await addSpecIdsToTitles(testFile)

    if (fixed) {
      console.log(`\n📝 ${relativePath}`)
      fixedCount++
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} test files (added spec IDs to titles)`)
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
