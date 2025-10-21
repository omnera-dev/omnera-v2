/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Recursively find all .schema.json files in a directory
 */
function findSchemaFiles(dir: string): string[] {
  const files: string[] = []
  const entries = readdirSync(dir)

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...findSchemaFiles(fullPath))
    } else if (entry.endsWith('.schema.json')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Remove all x-business-rules from a schema object (recursively)
 */
function removeBusinessRules(obj: Record<string, unknown>): boolean {
  let removed = false

  function traverse(current: unknown): void {
    if (typeof current !== 'object' || current === null) {
      return
    }

    const currentObj = current as Record<string, unknown>

    // Remove x-business-rules if found
    if ('x-business-rules' in currentObj) {
      delete currentObj['x-business-rules']
      removed = true
    }

    // Recursively traverse all properties
    for (const key in currentObj) {
      traverse(currentObj[key])
    }
  }

  traverse(obj)
  return removed
}

/**
 * Process a single schema file
 */
function processSchemaFile(filePath: string): boolean {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const schema = JSON.parse(content)

    const wasRemoved = removeBusinessRules(schema)

    if (!wasRemoved) {
      return false
    }

    // Write back with proper formatting
    writeFileSync(filePath, JSON.stringify(schema, null, 2) + '\n', 'utf-8')

    console.log(`✅ Removed x-business-rules from ${filePath}`)
    return true
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error)
    return false
  }
}

/**
 * Main function
 */
function main() {
  const specsDir = join(process.cwd(), 'specs', 'app')

  console.log('🔍 Finding schema files...')
  const schemaFiles = findSchemaFiles(specsDir)
  console.log(`📝 Found ${schemaFiles.length} schema files\n`)

  let processed = 0
  let skipped = 0

  for (const file of schemaFiles) {
    const result = processSchemaFile(file)
    if (result === true) {
      processed++
    } else {
      skipped++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`   ✅ Processed: ${processed}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
}

main()
