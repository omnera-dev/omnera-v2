/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Script to add "specs" arrays to OpenAPI JSON files in specs/api/
 *
 * This script extracts Given-When-Then test specifications from co-located .spec.ts files
 * and adds them to the corresponding .json OpenAPI specification files as "specs" arrays.
 *
 * Pattern matching specs/app/ structure where each schema has:
 * - JSON Schema file (.schema.json or .json)
 * - E2E test file (.spec.ts)
 * - "specs" array in JSON with { id, given, when, then } objects
 */

interface SpecEntry {
  id: string
  given: string
  when: string
  then: string
}

/**
 * Extract spec entries from a .spec.ts test file
 *
 * Parses test comments to find GIVEN/WHEN/THEN statements
 * and generates spec entries with unique IDs
 */
async function extractSpecsFromTestFile(filePath: string): Promise<SpecEntry[]> {
  const content = await readFile(filePath, 'utf-8')
  const specs: SpecEntry[] = []

  // Match test cases with their GIVEN/WHEN/THEN comments
  // Pattern: Look for test( followed by comments containing GIVEN/WHEN/THEN
  const testBlocks = content.split(/test\(/g).slice(1) // Skip first split (before any test)

  let specCounter = 1

  for (const block of testBlocks) {
    // Extract test name from first parameter
    const testNameMatch = block.match(/['"`](.+?)['"`]\s*,/)

    // Skip if not a @spec test
    if (!block.includes("{ tag: '@spec' }")) {
      continue
    }

    // Extract GIVEN/WHEN/THEN from comments
    const givenMatch = block.match(/\/\/\s*GIVEN:\s*(.+?)$/m)
    const whenMatch = block.match(/\/\/\s*WHEN:\s*(.+?)$/m)
    const thenMatch = block.match(/\/\/\s*THEN:\s*(.+?)$/m)

    if (givenMatch && whenMatch && thenMatch) {
      // Generate ID from endpoint path
      const pathMatch = filePath.match(/specs\/api\/paths\/(.+?)\/([^/]+)\.spec\.ts/)
      let idPrefix = 'API'

      if (pathMatch) {
        const [, path, _method] = pathMatch
        if (path) {
          const pathParts = path.split('/').filter(Boolean)
          idPrefix = pathParts.map((p) => p.toUpperCase().replace(/[{}]/g, '')).join('-')
        }
      }

      const id = `${idPrefix}-${String(specCounter).padStart(3, '0')}`

      const givenText = givenMatch?.[1]?.trim()
      const whenText = whenMatch?.[1]?.trim()
      const thenText = thenMatch?.[1]?.trim()

      if (givenText && whenText && thenText) {
        specs.push({
          id,
          given: givenText,
          when: whenText,
          then: thenText,
        })
      }

      specCounter++
    }
  }

  return specs
}

/**
 * Find all .spec.ts files in specs/api/paths/
 */
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

/**
 * Add specs array to a JSON file
 */
async function addSpecsToJson(jsonPath: string, specs: SpecEntry[]): Promise<void> {
  const content = await readFile(jsonPath, 'utf-8')
  const json = JSON.parse(content)

  // Add specs array
  json.specs = specs

  // Write back with formatting
  await writeFile(jsonPath, JSON.stringify(json, null, 2) + '\n', 'utf-8')

  console.log(`✓ Added ${specs.length} specs to ${jsonPath}`)
}

/**
 * Main execution
 */
async function main() {
  const specsApiDir = join(process.cwd(), 'specs/api/paths')

  console.log('🔍 Finding all .spec.ts files in specs/api/paths/...')
  const specFiles = await findSpecFiles(specsApiDir)

  console.log(`📝 Found ${specFiles.length} test files\n`)

  for (const specFile of specFiles) {
    // Find corresponding .json file
    // Pattern: /path/to/method.spec.ts → /path/to/method.json
    const jsonPath = specFile.replace('.spec.ts', '.json')

    try {
      // Extract specs from test file
      const specs = await extractSpecsFromTestFile(specFile)

      if (specs.length === 0) {
        console.log(`⚠ No @spec tests found in ${specFile}`)
        continue
      }

      // Add specs to JSON file
      await addSpecsToJson(jsonPath, specs)
    } catch (error) {
      console.error(`❌ Error processing ${specFile}:`, error)
    }
  }

  console.log('\n✨ Done! All specs have been added to OpenAPI JSON files.')
}

main().catch(console.error)
