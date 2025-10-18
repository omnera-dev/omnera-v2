#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Export Schema Script
 *
 * This script exports the AppSchema to a versioned schema folder at the root of the project.
 * It generates:
 * - JSON Schema files for validation and documentation
 * - TypeScript type definition files
 * - README with schema documentation
 *
 * Usage: bun run scripts/export-schema.ts
 */

import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { JSONSchema, type Schema } from 'effect'
// Import schemas
import { AppSchema, TableSchema } from '../src/domain/models/app'

/**
 * Get package version from package.json
 */
async function getPackageVersion(): Promise<string> {
  const packageJson = await Bun.file('package.json').json()
  return packageJson.version
}

/**
 * Generate JSON Schema from Effect Schema
 */
function generateJsonSchema(schema: Schema.Schema.Any): unknown {
  return JSONSchema.make(schema)
}

/**
 * Add $id field to JSON Schema
 */
function addSchemaId(jsonSchema: unknown, version: string, schemaName: string): unknown {
  const schema = jsonSchema as Record<string, unknown>
  const { $id: _existingId, ...rest } = schema
  return {
    $id: `https://omnera.dev/schemas/${version}/${schemaName}.schema.json`,
    ...rest,
  }
}

/**
 * Main export function
 */
async function exportSchema(): Promise<void> {
  console.log('🚀 Starting schema export...\n')

  // Get package version
  const version = await getPackageVersion()
  console.log(`📦 Package version: ${version}`)

  // Create output directory
  const outputDir = join(process.cwd(), 'schemas', version)
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true })
    console.log(`✅ Created directory: schemas/${version}/`)
  } else {
    console.log(`📁 Directory already exists: schemas/${version}/`)
  }

  // Generate and write App JSON Schema
  console.log('\n📝 Generating JSON Schemas...')

  const appJsonSchema = generateJsonSchema(AppSchema)
  const appJsonSchemaWithId = addSchemaId(appJsonSchema, version, 'app')
  const appSchemaPath = join(outputDir, 'app.schema.json')
  await writeFile(appSchemaPath, JSON.stringify(appJsonSchemaWithId, null, 2))
  console.log('   ✓ app.schema.json')

  // Generate and write Table JSON Schema
  const tableJsonSchema = generateJsonSchema(TableSchema)
  const tableJsonSchemaWithId = addSchemaId(tableJsonSchema, version, 'table')
  const tableSchemaPath = join(outputDir, 'table.schema.json')
  await writeFile(tableSchemaPath, JSON.stringify(tableJsonSchemaWithId, null, 2))
  console.log('   ✓ table.schema.json')

  console.log(`\n✨ Schema export completed successfully!`)
  console.log(`📂 Output location: schemas/${version}/\n`)
}

// Run the export
exportSchema().catch((error) => {
  console.error('❌ Error exporting schema:', error)
  process.exit(1)
})
