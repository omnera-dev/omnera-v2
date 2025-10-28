/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

export interface AppSchemaComparison {
  totalProperties: number
  currentTotalProperties: number
  implementedProperties: number
  missingProperties: number
  completionPercent: number
  missingPropertyPaths: string[]
  implementedPropertyPaths: string[]
  currentPropertyPaths: string[]
}

/**
 * Resolve a $ref by loading the referenced file
 */
async function resolveRef(
  ref: string,
  baseDir: string,
  visited: Set<string> = new Set()
): Promise<unknown> {
  // Handle JSON pointer references (internal to same file)
  if (ref.startsWith('#/')) {
    return null // We don't handle internal refs for now
  }

  // Strip fragment
  const refWithoutFragment = ref.split('#')[0]
  if (!refWithoutFragment) {
    return null
  }

  // Resolve file path
  const refPath = resolve(baseDir, refWithoutFragment)

  // Avoid circular references
  if (visited.has(refPath)) {
    return null
  }
  visited.add(refPath)

  try {
    const content = await readFile(refPath, 'utf-8')
    const parsed = JSON.parse(content)

    // Strip x-specs and specs before processing
    return stripExamplesAndSpecs(parsed)
  } catch {
    return null // File doesn't exist or can't be read
  }
}

/**
 * Strip examples, x-specs, and specs from a schema
 */
function stripExamplesAndSpecs(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(stripExamplesAndSpecs)
  }

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    // Skip documentation arrays
    if (key === 'examples' || key === 'x-specs' || key === 'specs' || key === 'x-test') {
      continue
    }
    result[key] = stripExamplesAndSpecs(value)
  }
  return result
}

/**
 * Recursively extract all property paths from a JSON Schema
 *
 * Returns an array of dot-notation paths like:
 * - "name"
 * - "tables"
 * - "tables.items.id"
 * - "tables.items.fields.items.type"
 */
async function extractPropertyPaths(
  schema: unknown,
  baseDir: string,
  prefix = '',
  visited: Set<string> = new Set()
): Promise<string[]> {
  if (typeof schema !== 'object' || schema === null) {
    return []
  }

  const obj = schema as Record<string, unknown>
  const paths: string[] = []

  // Handle $ref - resolve it and extract paths from the referenced schema
  if ('$ref' in obj && typeof obj.$ref === 'string') {
    const resolved = await resolveRef(obj.$ref, baseDir, visited)
    if (resolved) {
      paths.push(...(await extractPropertyPaths(resolved, baseDir, prefix, visited)))
    }
    // Don't continue processing this object - the $ref is the only thing that matters
    return paths
  }

  // Handle object properties
  if ('properties' in obj && typeof obj.properties === 'object' && obj.properties !== null) {
    const properties = obj.properties as Record<string, unknown>

    for (const [key, value] of Object.entries(properties)) {
      const path = prefix ? `${prefix}.${key}` : key
      paths.push(path)

      // Recursively extract nested properties
      paths.push(...(await extractPropertyPaths(value, baseDir, path, visited)))
    }
  }

  // Handle array items
  if ('items' in obj && typeof obj.items === 'object' && obj.items !== null) {
    const itemPath = prefix ? `${prefix}.items` : 'items'
    paths.push(...(await extractPropertyPaths(obj.items, baseDir, itemPath, visited)))
  }

  // Handle oneOf/anyOf/allOf schemas
  for (const combiner of ['oneOf', 'anyOf', 'allOf']) {
    if (combiner in obj && Array.isArray(obj[combiner])) {
      const schemas = obj[combiner] as unknown[]
      for (const subSchema of schemas) {
        paths.push(...(await extractPropertyPaths(subSchema, baseDir, prefix, visited)))
      }
    }
  }

  return paths
}

/**
 * Compare two app schemas and calculate implementation progress
 *
 * Manually resolves $ref pointers while skipping documentation examples (x-specs, specs, x-test).
 * This ensures accurate diff calculation between modular goal schemas and flattened current schemas.
 */
export async function compareAppSchemas(
  goalSchemaPath: string,
  currentSchemaPath: string
): Promise<AppSchemaComparison> {
  // Load schemas
  const goalSchemaContent = await readFile(goalSchemaPath, 'utf-8')
  const goalSchema = JSON.parse(goalSchemaContent)

  const currentSchemaContent = await readFile(currentSchemaPath, 'utf-8')
  const currentSchema = JSON.parse(currentSchemaContent)

  // Strip documentation examples from root schemas
  const goalSchemaClean = stripExamplesAndSpecs(goalSchema)
  const currentSchemaClean = stripExamplesAndSpecs(currentSchema)

  // Get base directories for resolving $refs
  const goalBaseDir = dirname(goalSchemaPath)
  const currentBaseDir = dirname(currentSchemaPath)

  // Extract all property paths recursively (resolving $refs manually)
  const goalPropertiesRaw = await extractPropertyPaths(goalSchemaClean, goalBaseDir)
  const currentPropertiesRaw = await extractPropertyPaths(currentSchemaClean, currentBaseDir)

  // Deduplicate paths (oneOf/anyOf can create duplicates)
  const goalProperties = Array.from(new Set(goalPropertiesRaw))
  const currentProperties = Array.from(new Set(currentPropertiesRaw))

  // Create sets for efficient lookup
  const currentPropsSet = new Set(currentProperties)

  // Calculate diff
  const missingPaths = goalProperties.filter((prop) => !currentPropsSet.has(prop))
  const implementedPaths = goalProperties.filter((prop) => currentPropsSet.has(prop))

  const completionPercent =
    goalProperties.length > 0
      ? Math.round((implementedPaths.length / goalProperties.length) * 100)
      : 0

  return {
    totalProperties: goalProperties.length,
    currentTotalProperties: currentProperties.length,
    implementedProperties: implementedPaths.length,
    missingProperties: missingPaths.length,
    completionPercent,
    missingPropertyPaths: missingPaths.sort(),
    implementedPropertyPaths: implementedPaths.sort(),
    currentPropertyPaths: currentProperties.sort(),
  }
}
