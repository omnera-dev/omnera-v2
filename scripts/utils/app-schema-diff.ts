/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

export interface PropertyGroup {
  rootProperty: string
  totalProperties: number
  implementedProperties: number
  completionPercent: number
}

export interface AppSchemaComparison {
  totalProperties: number
  currentTotalProperties: number
  implementedProperties: number
  missingProperties: number
  completionPercent: number
  missingPropertyPaths: string[]
  implementedPropertyPaths: string[]
  currentPropertyPaths: string[]
  propertyGroups: PropertyGroup[]
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
 * Recursively extract all property paths and count properties across all schema files
 *
 * This collects full property paths like "pages.blocks.button.label" while also
 * counting total properties from ALL anyOf/oneOf branches.
 */
async function extractSchemaProperties(
  schema: unknown,
  baseDir: string,
  visited: Set<string> = new Set(),
  currentPath: string = ''
): Promise<{ count: number; paths: string[] }> {
  if (typeof schema !== 'object' || schema === null) {
    return { count: 0, paths: [] }
  }

  const obj = schema as Record<string, unknown>
  let count = 0
  const paths: string[] = []

  // Handle $ref - resolve it and extract properties from the referenced schema
  if ('$ref' in obj && typeof obj.$ref === 'string') {
    const resolved = await resolveRef(obj.$ref, baseDir, visited)
    if (resolved) {
      // Update baseDir to the directory of the resolved file
      const refWithoutFragment = obj.$ref.split('#')[0] || ''
      const newBaseDir = dirname(resolve(baseDir, refWithoutFragment))
      const result = await extractSchemaProperties(resolved, newBaseDir, visited, currentPath)
      count += result.count
      paths.push(...result.paths)
    }
    // Don't continue processing this object - the $ref is the only thing that matters
    return { count, paths }
  }

  // Extract object properties
  if ('properties' in obj && typeof obj.properties === 'object' && obj.properties !== null) {
    const properties = obj.properties as Record<string, unknown>

    for (const [propName, value] of Object.entries(properties)) {
      count++ // Count this property
      const propPath = currentPath ? `${currentPath}.${propName}` : propName
      paths.push(propPath)

      // Recursively extract nested properties
      const result = await extractSchemaProperties(value, baseDir, visited, propPath)
      count += result.count
      paths.push(...result.paths)
    }
  }

  // Handle array items
  if ('items' in obj && typeof obj.items === 'object' && obj.items !== null) {
    const result = await extractSchemaProperties(obj.items, baseDir, visited, currentPath + '[]')
    count += result.count
    paths.push(...result.paths)
  }

  // Handle oneOf/anyOf/allOf schemas - extract properties from ALL branches
  for (const combiner of ['oneOf', 'anyOf', 'allOf']) {
    if (combiner in obj && Array.isArray(obj[combiner])) {
      const schemas = obj[combiner] as unknown[]
      for (let i = 0; i < schemas.length; i++) {
        const branchPath = currentPath ? `${currentPath}[${combiner}:${i}]` : `[${combiner}:${i}]`
        const result = await extractSchemaProperties(schemas[i], baseDir, visited, branchPath)
        count += result.count
        paths.push(...result.paths)
      }
    }
  }

  return { count, paths }
}

/**
 * Group property paths by root property and calculate progress for each
 */
function groupPropertiesByRoot(goalPaths: string[], implementedPaths: string[]): PropertyGroup[] {
  // Get unique root properties from goal paths
  const rootProperties = new Set<string>()
  for (const path of goalPaths) {
    const root = (path.split('.')[0] || path).split('[')[0] || path // Get root before . or [
    rootProperties.add(root)
  }

  // Calculate stats for each root property
  const groups: PropertyGroup[] = []
  const implementedSet = new Set(implementedPaths)

  for (const root of Array.from(rootProperties).sort()) {
    // Find all paths that start with this root
    const rootGoalPaths = goalPaths.filter(
      (p) => p === root || p.startsWith(`${root}.`) || p.startsWith(`${root}[`)
    )
    const rootImplementedPaths = rootGoalPaths.filter((p) => implementedSet.has(p))

    const totalProperties = rootGoalPaths.length
    const implementedProperties = rootImplementedPaths.length
    const completionPercent =
      totalProperties > 0 ? Math.round((implementedProperties / totalProperties) * 100) : 0

    groups.push({
      rootProperty: root,
      totalProperties,
      implementedProperties,
      completionPercent,
    })
  }

  return groups
}

/**
 * Compare two app schemas and calculate implementation progress
 *
 * Extracts all property paths across all schema files (including anyOf/oneOf branches).
 * This provides detailed tracking of which properties are implemented vs missing.
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

  // Extract all property paths and counts from both schemas
  const goalResult = await extractSchemaProperties(goalSchemaClean, goalBaseDir)
  const currentResult = await extractSchemaProperties(currentSchemaClean, currentBaseDir)

  // Convert current paths to Set for efficient lookup
  const currentPathsSet = new Set(currentResult.paths)

  // Find implemented and missing paths
  const implementedPaths: string[] = []
  const missingPaths: string[] = []

  for (const path of goalResult.paths) {
    if (currentPathsSet.has(path)) {
      implementedPaths.push(path)
    } else {
      missingPaths.push(path)
    }
  }

  // Calculate completion percentage based on property counts
  const implementedCount = Math.min(currentResult.count, goalResult.count)
  const missingCount = Math.max(0, goalResult.count - currentResult.count)
  const completionPercent =
    goalResult.count > 0 ? Math.round((implementedCount / goalResult.count) * 100) : 0

  // Group properties by root for detailed progress tracking
  const propertyGroups = groupPropertiesByRoot(goalResult.paths, implementedPaths)

  return {
    totalProperties: goalResult.count,
    currentTotalProperties: currentResult.count,
    implementedProperties: implementedCount,
    missingProperties: missingCount,
    completionPercent,
    missingPropertyPaths: missingPaths.sort(),
    implementedPropertyPaths: implementedPaths.sort(),
    currentPropertyPaths: currentResult.paths.sort(),
    propertyGroups,
  }
}
