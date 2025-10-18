#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Fix Field Type Schema References
 *
 * Updates all $ref paths in field type schema files to use correct relative paths.
 * Changes: ../common/definitions.schema.json -> ../../common/definitions.schema.json
 */

import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const FIELD_TYPES_DIR = join(process.cwd(), 'docs/specifications/schemas/tables/field-types')

/**
 * Fix $ref paths in all field type schema files
 */
async function fixFieldTypeRefs(): Promise<void> {
  console.log('📖 Reading field type schema files...')
  const files = await readdir(FIELD_TYPES_DIR)
  const schemaFiles = files.filter((f) => f.endsWith('.schema.json'))

  console.log(`✅ Found ${schemaFiles.length} field type schema files`)

  let fixedCount = 0

  for (const filename of schemaFiles) {
    const filepath = join(FIELD_TYPES_DIR, filename)

    // Read file
    const content = await readFile(filepath, 'utf-8')

    // Replace incorrect path with correct path
    // From: ../common/definitions.schema.json
    // To: ../../common/definitions.schema.json
    const updatedContent = content.replace(
      /"\.\.\/common\/definitions\.schema\.json/g,
      '"../../common/definitions.schema.json'
    )

    // Only write if content changed
    if (updatedContent !== content) {
      await writeFile(filepath, updatedContent, 'utf-8')
      console.log(`  ✓ Fixed ${filename}`)
      fixedCount++
    }
  }

  console.log(`\n🎉 Fixed $ref paths in ${fixedCount} files`)
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  try {
    await fixFieldTypeRefs()
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

main()
