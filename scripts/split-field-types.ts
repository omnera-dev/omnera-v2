#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Split Field Types Script
 *
 * Extracts all 36 field type definitions from tables.schema.json into separate files.
 * Each field type becomes a standalone JSON Schema Draft 7 file.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const TABLES_SCHEMA_PATH = join(
  process.cwd(),
  'docs/specifications/schemas/tables/tables.schema.json'
)
const FIELD_TYPES_DIR = join(process.cwd(), 'docs/specifications/schemas/tables/field-types')

interface FieldTypeSchema {
  title: string
  description: string
  type: string
  properties: Record<string, unknown>
  required?: string[]
  additionalProperties?: boolean
  [key: string]: unknown
}

/**
 * Convert field title to filename
 * "Single Line Text Field" -> "single-line-text-field.schema.json"
 */
function titleToFilename(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') + '.schema.json'
  )
}

/**
 * Extract field types from tables schema
 */
async function extractFieldTypes(): Promise<void> {
  console.log('📖 Reading tables.schema.json...')
  const tablesSchemaContent = await readFile(TABLES_SCHEMA_PATH, 'utf-8')
  const tablesSchema = JSON.parse(tablesSchemaContent)

  // Navigate to the fields.items.anyOf array
  const fieldsAnyOf = tablesSchema.items?.properties?.fields?.items?.anyOf

  if (!Array.isArray(fieldsAnyOf)) {
    throw new TypeError('Could not find fields.items.anyOf array in tables.schema.json')
  }

  console.log(`✅ Found ${fieldsAnyOf.length} field type definitions`)

  // Ensure output directory exists
  await mkdir(FIELD_TYPES_DIR, { recursive: true })

  // Extract each field type
  for (const fieldType of fieldsAnyOf) {
    const typedFieldType = fieldType as FieldTypeSchema
    const filename = titleToFilename(typedFieldType.title)
    const filepath = join(FIELD_TYPES_DIR, filename)

    // Create standalone schema with $schema reference
    const standaloneSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      ...typedFieldType,
    }

    // Write to file with pretty formatting
    await writeFile(filepath, JSON.stringify(standaloneSchema, null, 2) + '\n', 'utf-8')

    console.log(`  ✓ Created ${filename}`)
  }

  console.log(`\n🎉 Successfully extracted ${fieldsAnyOf.length} field type schemas`)
  console.log(`📁 Location: ${FIELD_TYPES_DIR}`)
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  try {
    await extractFieldTypes()
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

main()
