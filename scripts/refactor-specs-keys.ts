/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Refactor JSON Schema Custom Keys
 *
 * This script refactors JSON schemas to follow proper JSON Schema extension conventions:
 * 1. Rename `specs` → `x-specs` (top-level custom property must use x- prefix)
 * 2. Rename `x-validation` → `validation` (already namespaced under x-specs)
 * 3. Rename `x-application` → `application` (already namespaced under x-specs)
 *
 * Rationale:
 * - Top-level custom properties should use `x-` prefix (JSON Schema convention)
 * - Properties WITHIN custom properties don't need `x-` prefix (already namespaced)
 *
 * Before:
 * {
 *   "specs": [{ "id": "...", "x-validation": {}, "x-application": {} }]
 * }
 *
 * After:
 * {
 *   "x-specs": [{ "id": "...", "validation": {}, "application": {} }]
 * }
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

interface JsonSchema {
  specs?: Array<{
    id: string
    given: string
    when: string
    then: string
    'x-validation'?: unknown
    'x-application'?: unknown
    [key: string]: unknown
  }>
  'x-specs'?: unknown
  [key: string]: unknown
}

/**
 * Recursively find all .schema.json files in a directory
 */
function findSchemaFiles(dir: string): string[] {
  const files: string[] = []

  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push(...findSchemaFiles(fullPath))
      }
    } else if (entry.name.endsWith('.schema.json')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Refactor a single spec object
 */
function refactorSpec(spec: Record<string, unknown>): Record<string, unknown> {
  const refactored = { ...spec }

  // Rename x-validation → validation
  if ('x-validation' in refactored) {
    refactored.validation = refactored['x-validation']
    delete refactored['x-validation']
  }

  // Rename x-application → application
  if ('x-application' in refactored) {
    refactored.application = refactored['x-application']
    delete refactored['x-application']
  }

  return refactored
}

/**
 * Refactor a single JSON schema file
 */
function refactorSchemaFile(filePath: string): boolean {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const schema = JSON.parse(content) as JsonSchema

    let modified = false

    // Rename specs → x-specs
    if ('specs' in schema && !('x-specs' in schema)) {
      const specs = schema.specs

      if (Array.isArray(specs)) {
        // Refactor each spec object
        const refactoredSpecs = specs.map((spec) => refactorSpec(spec))

        schema['x-specs'] = refactoredSpecs
        delete schema.specs
        modified = true

        console.log(`✓ ${filePath}`)
        console.log(`  - Renamed 'specs' → 'x-specs' (${refactoredSpecs.length} specs)`)

        // Count how many specs had x-validation or x-application
        const validationCount = refactoredSpecs.filter((s) => 'validation' in s).length
        const applicationCount = refactoredSpecs.filter((s) => 'application' in s).length

        if (validationCount > 0) {
          console.log(`  - Renamed 'x-validation' → 'validation' (${validationCount} specs)`)
        }
        if (applicationCount > 0) {
          console.log(`  - Renamed 'x-application' → 'application' (${applicationCount} specs)`)
        }
      }
    }

    if (modified) {
      // Write back to file
      writeFileSync(filePath, JSON.stringify(schema, null, 2) + '\n', 'utf-8')
      return true
    }

    return false
  } catch (error) {
    console.error(`✗ ${filePath}`)
    console.error(`  Error: ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
}

/**
 * Main function
 */
function main() {
  const specsDir = join(process.cwd(), 'specs')

  console.log('🔍 Finding all .schema.json files...\n')
  const schemaFiles = findSchemaFiles(specsDir)
  console.log(`Found ${schemaFiles.length} schema files\n`)

  console.log('🔄 Refactoring schema files...\n')

  let modifiedCount = 0
  for (const file of schemaFiles) {
    const wasModified = refactorSchemaFile(file)
    if (wasModified) {
      modifiedCount++
    }
  }

  console.log(`\n✅ Refactored ${modifiedCount} files`)

  if (modifiedCount > 0) {
    console.log('\n💡 Next steps:')
    console.log('   1. Run: bun run format')
    console.log('   2. Review changes: git diff specs/')
    console.log(
      '   3. Commit: git add specs/ && git commit -m "refactor(specs): rename to x-specs convention"'
    )
  } else {
    console.log('\n✨ All files already follow the convention!')
  }
}

// Run the script
main()
