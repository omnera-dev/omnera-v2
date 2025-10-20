#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Export OpenAPI Schema Script
 *
 * This script exports the runtime-generated OpenAPI schema to versioned files
 * in the schemas/ folder. These exported schemas serve multiple purposes:
 *
 * 1. **Roadmap Tracking**: Compare with hand-written specs in docs/specifications/
 *    to show implementation progress
 * 2. **Version History**: Track API evolution across package versions
 * 3. **External Consumption**: Allow external tools to consume API schema
 *
 * The script generates:
 * - schemas/0.0.1/app.openapi.json - Full OpenAPI specification
 *
 * Usage: bun run scripts/export-openapi.ts
 */

import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getOpenAPIDocument } from '../src/presentation/api/openapi-schema'

/**
 * Get package version from package.json
 */
async function getPackageVersion(): Promise<string> {
  const packageJson = await Bun.file('package.json').json()
  return packageJson.version
}

/**
 * Main export function
 */
async function exportOpenAPI(): Promise<void> {
  console.log('🚀 Starting OpenAPI schema export...\n')

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

  // Generate OpenAPI document
  console.log('\n📝 Generating OpenAPI schema...')
  const openApiDoc = getOpenAPIDocument()

  // Write full OpenAPI document
  const fullSchemaPath = join(outputDir, 'app.openapi.json')
  await writeFile(fullSchemaPath, JSON.stringify(openApiDoc, null, 2))
  console.log('   ✓ app.openapi.json')

  // Count endpoints by tag for summary
  const paths = openApiDoc.paths || {}
  const endpointCount = Object.keys(paths).length
  const methodCount = Object.values(paths).reduce((count, pathItem) => {
    return (
      count +
      Object.keys(pathItem || {}).filter((key) =>
        ['get', 'post', 'put', 'patch', 'delete'].includes(key)
      ).length
    )
  }, 0)

  console.log(`\n✨ OpenAPI export completed successfully!`)
  console.log(`📂 Output location: schemas/${version}/`)
  console.log(`📊 Summary:`)
  console.log(`   - ${endpointCount} endpoint paths`)
  console.log(`   - ${methodCount} HTTP methods`)
  console.log(`   - ${(openApiDoc.tags || []).length} tags\n`)
}

// Run the export
exportOpenAPI().catch((error) => {
  console.error('❌ Error exporting OpenAPI schema:', error)
  process.exit(1)
})
