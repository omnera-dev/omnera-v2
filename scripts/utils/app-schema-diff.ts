/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { resolveJsonSchema } from '../lib/schema-resolver.js'

export interface AppSchemaComparison {
  totalProperties: number
  implementedProperties: number
  missingProperties: number
  completionPercent: number
  missingPropertyPaths: string[]
  implementedPropertyPaths: string[]
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
function extractPropertyPaths(schema: unknown, prefix = ''): string[] {
  if (typeof schema !== 'object' || schema === null) {
    return []
  }

  const obj = schema as Record<string, unknown>
  const paths: string[] = []

  // Handle object properties
  if ('properties' in obj && typeof obj.properties === 'object' && obj.properties !== null) {
    const properties = obj.properties as Record<string, unknown>

    for (const [key, value] of Object.entries(properties)) {
      const path = prefix ? `${prefix}.${key}` : key
      paths.push(path)

      // Recursively extract nested properties
      paths.push(...extractPropertyPaths(value, path))
    }
  }

  // Handle array items
  if ('items' in obj && typeof obj.items === 'object' && obj.items !== null) {
    const itemPath = prefix ? `${prefix}.items` : 'items'
    paths.push(...extractPropertyPaths(obj.items, itemPath))
  }

  // Handle oneOf/anyOf/allOf schemas
  for (const combiner of ['oneOf', 'anyOf', 'allOf']) {
    if (combiner in obj && Array.isArray(obj[combiner])) {
      const schemas = obj[combiner] as unknown[]
      for (const subSchema of schemas) {
        paths.push(...extractPropertyPaths(subSchema, prefix))
      }
    }
  }

  return paths
}

/**
 * Compare two app schemas and calculate implementation progress
 *
 * Resolves all $ref pointers before comparison to ensure accurate diff
 * calculation between modular goal schemas and flattened current schemas.
 */
export async function compareAppSchemas(
  goalSchemaPath: string,
  currentSchemaPath: string
): Promise<AppSchemaComparison> {
  // Load and resolve schemas (dereference all $ref pointers)
  const goalSchema = await resolveJsonSchema(goalSchemaPath)
  const currentSchema = await resolveJsonSchema(currentSchemaPath)

  // Extract all property paths recursively (including nested properties)
  const goalPropertiesRaw = extractPropertyPaths(goalSchema)
  const currentPropertiesRaw = extractPropertyPaths(currentSchema)

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
    implementedProperties: implementedPaths.length,
    missingProperties: missingPaths.length,
    completionPercent,
    missingPropertyPaths: missingPaths.sort(),
    implementedPropertyPaths: implementedPaths.sort(),
  }
}
