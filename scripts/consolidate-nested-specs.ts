#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Consolidate Nested Specs into Parent Schemas
 *
 * Problem:
 * Some parent schemas (like primary-key.schema.json) only have 2 high-level specs,
 * but their test files have 16 detailed tests because the actual specs are scattered
 * across nested property schemas (type/, field/, fields/).
 *
 * Solution:
 * Move all specs from nested property schemas into their parent schema's specs array.
 * This creates a single source of truth and matches the test file structure.
 *
 * Target schemas:
 * - specs/app/tables/primary-key/primary-key.schema.json
 * - specs/app/tables/fields/fields.schema.json
 * - specs/app/tables/id/id.schema.json
 * - specs/app/tables/name/name.schema.json
 * - specs/app/tables/unique-constraints/unique-constraints.schema.json
 * - specs/app/tables/indexes/indexes.schema.json
 */

import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

const PROJECT_ROOT = join(import.meta.dir, '..')

interface Spec {
  id: string
  given: string
  when: string
  then: string
  title?: string
}

interface Schema {
  specs?: Spec[]
  properties?: Record<string, unknown>
  [key: string]: unknown
}

/**
 * Recursively find all schema files in a directory
 */
async function findSchemaFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await findSchemaFiles(fullPath)))
    } else if (entry.isFile() && entry.name.endsWith('.schema.json')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Extract specs from a nested property schema and remove them
 */
async function extractAndRemoveSpecsFromNestedSchema(schemaPath: string): Promise<Spec[]> {
  const content = await Bun.file(schemaPath).json()
  const specs = (content.specs as Spec[]) || []

  if (specs.length > 0) {
    // Remove specs array from nested schema
    const { specs: _, ...schemaWithoutSpecs } = content as Schema
    await Bun.write(schemaPath, JSON.stringify(schemaWithoutSpecs, null, 2) + '\n')
  }

  return specs
}

/**
 * Consolidate specs from nested property schemas into parent
 */
async function consolidateSpecs(
  parentSchemaPath: string
): Promise<{ updated: boolean; specsAdded: number }> {
  // Read parent schema
  const parentSchema = (await Bun.file(parentSchemaPath).json()) as Schema
  const existingSpecs = parentSchema.specs || []

  // Get parent directory (e.g., specs/app/tables/primary-key/)
  const parentDir = parentSchemaPath.substring(0, parentSchemaPath.lastIndexOf('/'))

  // Find all nested property directories
  const entries = await readdir(parentDir, { withFileTypes: true })
  const propertyDirs = entries.filter((e) => e.isDirectory())

  // Collect all specs from nested schemas
  const allSpecs: Spec[] = [...existingSpecs]

  for (const dir of propertyDirs) {
    const propertySchemaPath = join(parentDir, dir.name, `${dir.name}.schema.json`)

    try {
      const nestedSpecs = await extractAndRemoveSpecsFromNestedSchema(propertySchemaPath)

      if (nestedSpecs.length > 0) {
        console.log(`   📦 Moved ${nestedSpecs.length} specs from ${dir.name}/`)
        allSpecs.push(...nestedSpecs)
      }
    } catch {
      // Schema file doesn't exist or has no specs, skip
    }
  }

  // Check if any specs were added
  if (allSpecs.length === existingSpecs.length) {
    return { updated: false, specsAdded: 0 }
  }

  // Update parent schema with consolidated specs
  const updatedSchema = {
    ...parentSchema,
    specs: allSpecs,
  }

  await Bun.write(parentSchemaPath, JSON.stringify(updatedSchema, null, 2) + '\n')

  return {
    updated: true,
    specsAdded: allSpecs.length - existingSpecs.length,
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Consolidating nested specs into parent schemas...\n')

  const schemasToProcess = [
    'specs/app/tables/primary-key/primary-key.schema.json',
    'specs/app/tables/fields/fields.schema.json',
    'specs/app/tables/id/id.schema.json',
    'specs/app/tables/name/name.schema.json',
    'specs/app/tables/unique-constraints/unique-constraints.schema.json',
    'specs/app/tables/indexes/indexes.schema.json',
  ]

  let totalConsolidated = 0

  for (const schemaPath of schemasToProcess) {
    const fullPath = join(PROJECT_ROOT, schemaPath)

    console.log(`📄 Processing ${schemaPath}...`)

    try {
      const result = await consolidateSpecs(fullPath)

      if (result.updated) {
        console.log(`   ✅ Added ${result.specsAdded} specs from nested schemas\n`)
        totalConsolidated += result.specsAdded
      } else {
        console.log(`   ⏭️  No nested specs found\n`)
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error}\n`)
    }
  }

  console.log(`\n🎉 Done! Consolidated ${totalConsolidated} specs into parent schemas`)
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
