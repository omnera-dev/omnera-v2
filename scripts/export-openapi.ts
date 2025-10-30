#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Export OpenAPI Schema Script (Effect-based)
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

import { join } from 'node:path'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import {
  FileSystemService,
  FileSystemServiceLive,
  LoggerServiceLive,
  progress,
  success,
  section,
} from './lib/effect'
import { auth } from '../src/infrastructure/auth/better-auth/auth'
import { getOpenAPIDocument } from '../src/presentation/api/openapi-schema'

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
 * Get package version from package.json
 */
const getPackageVersion = Effect.gen(function* () {
  const fs = yield* FileSystemService
  const content = yield* fs.readFile('package.json')
  const packageJson = JSON.parse(content)
  return packageJson.version as string
})

/**
 * Add /api/auth/ prefix to all paths in an OpenAPI schema
 *
 * BetterAuth generates paths without the mount prefix (e.g., /sign-in/email).
 * This function transforms them to match our API structure (e.g., /api/auth/sign-in/email).
 */
const addAuthPrefixToPaths = (schema: OpenAPIDocument): OpenAPIDocument => {
  if (!schema.paths) {
    return schema
  }

  const prefixedPaths: Record<string, unknown> = {}
  for (const [path, methods] of Object.entries(schema.paths)) {
    // Add /api/auth prefix to the path
    const prefixedPath = `/api/auth${path}`
    prefixedPaths[prefixedPath] = methods
  }

  return {
    ...schema,
    paths: prefixedPaths,
  }
}

/**
 * Merge OpenAPI schemas from multiple sources
 *
 * This function merges the main application OpenAPI schema with the
 * BetterAuth authentication schema into a single unified document.
 */
const mergeOpenAPISchemas = (
  mainSchema: OpenAPIDocument,
  authSchema: OpenAPIDocument
): OpenAPIDocument => {
  // Add /api/auth/ prefix to all auth paths before merging
  const prefixedAuthSchema = addAuthPrefixToPaths(authSchema)

  return {
    ...mainSchema,
    // Merge paths from both schemas
    paths: {
      ...mainSchema.paths,
      ...prefixedAuthSchema.paths,
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
 * Calculate summary statistics from merged OpenAPI document
 */
const calculateSummary = (mergedDoc: OpenAPIDocument) => {
  const paths = mergedDoc.paths || {}
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
  const authEndpoints = Object.keys(paths).filter((path) => path.startsWith('/api/auth/')).length
  const appEndpoints = endpointCount - authEndpoints

  return {
    endpointCount,
    methodCount,
    authEndpoints,
    appEndpoints,
    tagCount: (mergedDoc.tags || []).length,
  }
}

/**
 * Main export function
 */
const exportOpenAPI = Effect.gen(function* () {
  const fs = yield* FileSystemService

  yield* section('Starting OpenAPI schema export')

  // Get package version
  const version = yield* getPackageVersion
  yield* Effect.log(`📦 Package version: ${version}`)

  // Create output directory
  const outputDir = join(process.cwd(), 'schemas', version)
  const dirExists = yield* fs.exists(outputDir)

  if (!dirExists) {
    yield* fs.mkdir(outputDir)
    yield* success(`Created directory: schemas/${version}/`)
  } else {
    yield* Effect.log(`📁 Directory already exists: schemas/${version}/`)
  }

  // Generate OpenAPI documents
  yield* Effect.log('')
  yield* progress('Generating OpenAPI schemas...')

  const mainOpenApiDoc = getOpenAPIDocument()
  yield* success('Main API schema generated')

  const authOpenApiDoc = yield* Effect.promise(() => auth.api.generateOpenAPISchema())
  yield* success('Auth API schema generated')

  // Merge schemas
  yield* Effect.log('')
  yield* progress('Merging schemas...')
  const mergedOpenApiDoc = mergeOpenAPISchemas(
    mainOpenApiDoc as OpenAPIDocument,
    authOpenApiDoc as OpenAPIDocument
  )
  yield* success('Schemas merged successfully')

  // Write full OpenAPI document
  yield* Effect.log('')
  yield* progress('Writing OpenAPI file...')
  const fullSchemaPath = join(outputDir, 'app.openapi.json')
  yield* fs.writeFormatted(fullSchemaPath, JSON.stringify(mergedOpenApiDoc), { parser: 'json' })
  yield* success('app.openapi.json')

  // Calculate and display summary
  const summary = calculateSummary(mergedOpenApiDoc)

  yield* Effect.log('')
  yield* Effect.log(`✨ OpenAPI export completed successfully!`)
  yield* Effect.log(`📂 Output location: schemas/${version}/`)
  yield* Effect.log(`📊 Summary:`)
  yield* Effect.log(`   - ${summary.endpointCount} total endpoint paths`)
  yield* Effect.log(`     • ${summary.appEndpoints} application endpoints`)
  yield* Effect.log(`     • ${summary.authEndpoints} authentication endpoints (/api/auth/*)`)
  yield* Effect.log(`   - ${summary.methodCount} HTTP methods`)
  yield* Effect.log(`   - ${summary.tagCount} tags`)
  yield* Effect.log('')
})

// Main layer combining all services
const MainLayer = Layer.mergeAll(FileSystemServiceLive, LoggerServiceLive())

// Run the export
const program = exportOpenAPI.pipe(Effect.provide(MainLayer))

Effect.runPromise(program)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error exporting OpenAPI schema:', error)
    process.exit(1)
  })
