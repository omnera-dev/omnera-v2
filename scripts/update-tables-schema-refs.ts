#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Update Tables Schema with $ref References
 *
 * Replaces the inline anyOf array in tables.schema.json with $ref references
 * to the individual field type schema files.
 */

import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const TABLES_SCHEMA_PATH = join(
  process.cwd(),
  'docs/specifications/schemas/tables/tables.schema.json'
)
const FIELD_TYPES_DIR = join(process.cwd(), 'docs/specifications/schemas/tables/field-types')

/**
 * Update tables.schema.json with $ref references
 */
async function updateTablesSchema(): Promise<void> {
  console.log('📖 Reading tables.schema.json...')
  const tablesSchemaContent = await readFile(TABLES_SCHEMA_PATH, 'utf-8')
  const tablesSchema = JSON.parse(tablesSchemaContent)

  console.log('📖 Reading field type schema files...')
  const fieldTypeFiles = await readdir(FIELD_TYPES_DIR)
  const schemaFiles = fieldTypeFiles.filter((f) => f.endsWith('.schema.json')).sort()

  console.log(`✅ Found ${schemaFiles.length} field type schema files`)

  // Create $ref array
  const refArray = schemaFiles.map((filename) => ({
    $ref: `./field-types/${filename}`,
  }))

  // Replace the inline anyOf array with $ref references
  if (
    !tablesSchema.items?.properties?.fields?.items ||
    typeof tablesSchema.items.properties.fields.items !== 'object'
  ) {
    throw new Error('Could not find fields.items in tables.schema.json')
  }

  // Replace anyOf with our $ref array
  tablesSchema.items.properties.fields.items.anyOf = refArray

  console.log(`✅ Replaced inline definitions with ${refArray.length} $ref references`)

  // Write back to file with pretty formatting
  await writeFile(TABLES_SCHEMA_PATH, JSON.stringify(tablesSchema, null, 2) + '\n', 'utf-8')

  console.log('🎉 Successfully updated tables.schema.json')
  console.log('📁 Location:', TABLES_SCHEMA_PATH)
  console.log('\n📝 Next steps:')
  console.log('  1. Run: bun run scripts/validate-schema.ts')
  console.log('  2. If validation passes, run: bun run scripts/generate-roadmap.ts')
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  try {
    await updateTablesSchema()
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

main()
