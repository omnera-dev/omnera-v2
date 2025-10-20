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
 * - schemas/0.0.1/app.openapi.json - Full OpenAPI specification (includes auth endpoints)
 *
 * Usage: bun run scripts/export-openapi.ts
 */

import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { auth } from '../src/infrastructure/auth/better-auth/auth'
import { getOpenAPIDocument } from '../src/presentation/api/openapi-schema'

/**
 * Get package version from package.json
 */
async function getPackageVersion(): Promise<string> {
  const packageJson = await Bun.file('package.json').json()
  return packageJson.version
}

/**
 * OpenAPI Document type (simplified for merging)
 */
interface OpenAPIDocument extends Record<string, unknown> {
  readonly openapi: string
  readonly info: unknown
  readonly paths?: Record<string, unknown>
  readonly components?: {
    readonly schemas?: Record<string, unknown>
    readonly parameters?: Record<string, unknown>
    readonly responses?: Record<string, unknown>
    readonly securitySchemes?: Record<string, unknown>
  }
  readonly tags?: ReadonlyArray<{ readonly name: string }>
}

/**
 * Merge OpenAPI schemas from multiple sources
 *
 * This function merges the main application OpenAPI schema with the
 * BetterAuth authentication schema into a single unified document.
 *
 * @param mainSchema - Main application OpenAPI schema
 * @param authSchema - BetterAuth OpenAPI schema
 * @returns Merged OpenAPI schema
 */
function mergeOpenAPISchemas(
  mainSchema: OpenAPIDocument,
  authSchema: OpenAPIDocument
): OpenAPIDocument {
  return {
    ...mainSchema,
    // Merge paths from both schemas
    paths: {
      ...mainSchema.paths,
      ...authSchema.paths,
    },
    // Merge component schemas
    components: {
      schemas: {
        ...(mainSchema.components?.schemas || {}),
        ...(authSchema.components?.schemas || {}),
      },
      parameters: {
        ...(mainSchema.components?.parameters || {}),
        ...(authSchema.components?.parameters || {}),
      },
      responses: {
        ...(mainSchema.components?.responses || {}),
        ...(authSchema.components?.responses || {}),
      },
      securitySchemes: {
        ...(mainSchema.components?.securitySchemes || {}),
        ...(authSchema.components?.securitySchemes || {}),
      },
    },
    // Merge tags (deduplicate by name)
    tags: [
      ...(mainSchema.tags || []),
      ...(authSchema.tags || []).filter(
        (authTag) => !mainSchema.tags?.some((mainTag) => mainTag.name === authTag.name)
      ),
    ],
  }
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

  // Generate OpenAPI documents
  console.log('\n📝 Generating OpenAPI schemas...')
  const mainOpenApiDoc = getOpenAPIDocument()
  console.log('   ✓ Main API schema generated')

  const authOpenApiDoc = await auth.api.generateOpenAPISchema()
  console.log('   ✓ Auth API schema generated')

  // Merge schemas
  console.log('\n🔗 Merging schemas...')
  const mergedOpenApiDoc = mergeOpenAPISchemas(
    mainOpenApiDoc as OpenAPIDocument,
    authOpenApiDoc as OpenAPIDocument
  )
  console.log('   ✓ Schemas merged successfully')

  // Write full OpenAPI document
  const fullSchemaPath = join(outputDir, 'app.openapi.json')
  await writeFile(fullSchemaPath, JSON.stringify(mergedOpenApiDoc, null, 2))
  console.log('\n💾 Written: app.openapi.json')

  // Count endpoints by tag for summary
  const paths = mergedOpenApiDoc.paths || {}
  const endpointCount = Object.keys(paths).length
  const methodCount = Object.values(paths).reduce((count: number, pathItem) => {
    return (
      count +
      Object.keys(pathItem || {}).filter((key) =>
        ['get', 'post', 'put', 'patch', 'delete'].includes(key)
      ).length
    )
  }, 0)

  // Count auth vs non-auth endpoints
  // Note: BetterAuth paths don't have /api/auth prefix in the schema (relative paths)
  const appEndpoints = Object.keys(paths).filter((path) => path.startsWith('/api/')).length
  const authEndpoints = endpointCount - appEndpoints

  console.log(`\n✨ OpenAPI export completed successfully!`)
  console.log(`📂 Output location: schemas/${version}/`)
  console.log(`📊 Summary:`)
  console.log(`   - ${endpointCount} total endpoint paths`)
  console.log(`     • ${appEndpoints} application endpoints`)
  console.log(`     • ${authEndpoints} authentication endpoints (mounted at /api/auth/*)`)
  console.log(`   - ${methodCount} HTTP methods`)
  console.log(`   - ${(mergedOpenApiDoc.tags || []).length} tags\n`)
}

// Run the export
exportOpenAPI().catch((error) => {
  console.error('❌ Error exporting OpenAPI schema:', error)
  process.exit(1)
})
