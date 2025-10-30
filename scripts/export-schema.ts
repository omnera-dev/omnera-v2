#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Export Schema Script (Effect-based)
 *
 * This script exports the AppSchema to a versioned schema folder at the root of the project.
 * It generates:
 * - JSON Schema files for validation and documentation
 * - TypeScript type definition files
 * - README with schema documentation
 *
 * Usage: bun run scripts/export-schema.ts
 */

import { join } from 'node:path'
import { JSONSchema, type Schema } from 'effect'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import { AppSchema } from '../src/domain/models/app'
import {
  FileSystemService,
  FileSystemServiceLive,
  LoggerServicePretty,
  progress,
  success,
  section,
} from './lib/effect'
// Import schemas

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
 * Generate JSON Schema from Effect Schema
 */
const generateJsonSchema = (schema: Schema.Schema.Any): unknown => {
  return JSONSchema.make(schema)
}

/**
 * Add $id field to JSON Schema
 */
const addSchemaId = (
  jsonSchema: unknown,
  version: string,
  schemaName: string
): Record<string, unknown> => {
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
const exportSchema = Effect.gen(function* () {
  const fs = yield* FileSystemService

  yield* section('Starting schema export')

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

  // Generate and write App JSON Schema
  yield* Effect.log('')
  yield* progress('Generating JSON Schemas...')

  const appJsonSchema = generateJsonSchema(AppSchema)
  const appJsonSchemaWithId = addSchemaId(appJsonSchema, version, 'app')
  const appSchemaPath = join(outputDir, 'app.schema.json')

  // Write formatted JSON
  yield* fs.writeFormatted(appSchemaPath, JSON.stringify(appJsonSchemaWithId), {
    parser: 'json',
  })
  yield* success('app.schema.json')
})

// Main layer combining all services
const MainLayer = Layer.mergeAll(FileSystemServiceLive, LoggerServicePretty())

// Run the export
const program = exportSchema.pipe(Effect.provide(MainLayer))

Effect.runPromise(program)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error exporting schema:', error)
    process.exit(1)
  })
