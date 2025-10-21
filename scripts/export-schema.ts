#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
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
import prettier from 'prettier'
// Import schemas
import { AppSchema } from '../src/domain/models/app'

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
 * Format JSON content with Prettier
 */
async function formatJson(content: unknown): Promise<string> {
  const prettierConfig = await prettier.resolveConfig(process.cwd())
  return prettier.format(JSON.stringify(content), {
    ...prettierConfig,
    parser: 'json',
  })
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
  const formattedContent = await formatJson(appJsonSchemaWithId)
  await writeFile(appSchemaPath, formattedContent)
  console.log('   ✓ app.schema.json')
}

// Run the export
exportSchema().catch((error) => {
  console.error('❌ Error exporting schema:', error)
  process.exit(1)
})
