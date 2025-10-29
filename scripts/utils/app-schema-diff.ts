/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readFile } from 'node:fs/promises'
import { dirname, resolve, relative } from 'node:path'

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
 * Recursively count all properties across all schema files (including duplicates from anyOf/oneOf)
 *
 * This counts total schema complexity rather than unique property paths.
 * For anyOf with 30 field types, we count properties from ALL field types, not just unique names.
 */
async function countSchemaProperties(
  schema: unknown,
  baseDir: string,
  visited: Set<string> = new Set()
): Promise<number> {
  if (typeof schema !== 'object' || schema === null) {
    return 0
  }

  const obj = schema as Record<string, unknown>
  let count = 0

  // Handle $ref - resolve it and count properties from the referenced schema
  if ('$ref' in obj && typeof obj.$ref === 'string') {
    const resolved = await resolveRef(obj.$ref, baseDir, visited)
    if (resolved) {
      // Update baseDir to the directory of the resolved file
      const refWithoutFragment = obj.$ref.split('#')[0]
      const newBaseDir = dirname(resolve(baseDir, refWithoutFragment))
      count += await countSchemaProperties(resolved, newBaseDir, visited)
    }
    // Don't continue processing this object - the $ref is the only thing that matters
    return count
  }

  // Count object properties
  if ('properties' in obj && typeof obj.properties === 'object' && obj.properties !== null) {
    const properties = obj.properties as Record<string, unknown>

    for (const [, value] of Object.entries(properties)) {
      count++ // Count this property
      // Recursively count nested properties
      count += await countSchemaProperties(value, baseDir, visited)
    }
  }

  // Handle array items
  if ('items' in obj && typeof obj.items === 'object' && obj.items !== null) {
    count += await countSchemaProperties(obj.items, baseDir, visited)
  }

  // Handle oneOf/anyOf/allOf schemas - count properties from ALL branches
  for (const combiner of ['oneOf', 'anyOf', 'allOf']) {
    if (combiner in obj && Array.isArray(obj[combiner])) {
      const schemas = obj[combiner] as unknown[]
      for (const subSchema of schemas) {
        count += await countSchemaProperties(subSchema, baseDir, visited)
      }
    }
  }

  return count
}

/**
 * Compare two app schemas and calculate implementation progress
 *
 * Counts total properties across all schema files (including anyOf/oneOf branches).
 * This measures total schema complexity rather than unique property paths.
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

  // Count all properties across all schema files (including duplicates from anyOf)
  const goalPropertyCount = await countSchemaProperties(goalSchemaClean, goalBaseDir)
  const currentPropertyCount = await countSchemaProperties(currentSchemaClean, currentBaseDir)

  // For now, we can't do a precise diff of which properties are missing
  // because we're counting total complexity rather than tracking unique paths.
  // We can only estimate based on property counts.
  const implementedCount = Math.min(currentPropertyCount, goalPropertyCount)
  const missingCount = Math.max(0, goalPropertyCount - currentPropertyCount)

  const completionPercent =
    goalPropertyCount > 0 ? Math.round((implementedCount / goalPropertyCount) * 100) : 0

  return {
    totalProperties: goalPropertyCount,
    currentTotalProperties: currentPropertyCount,
    implementedProperties: implementedCount,
    missingProperties: missingCount,
    completionPercent,
    missingPropertyPaths: [], // Not applicable with count-based approach
    implementedPropertyPaths: [], // Not applicable with count-based approach
    currentPropertyPaths: [], // Not applicable with count-based approach
  }
}
