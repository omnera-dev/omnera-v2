/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

interface JSONSchema {
  $schema?: string
  $id?: string
  $ref?: string
  type?: string | string[]
  properties?: Record<string, JSONSchema>
  items?: JSONSchema
  additionalProperties?: boolean | JSONSchema
  required?: string[]
  [key: string]: any
}

export interface AppSchemaComparison {
  totalProperties: number
  implementedProperties: number
  missingProperties: number
  completionPercent: number
  missingPropertyPaths: string[]
  implementedPropertyPaths: string[]
}

/**
 * Compare two app schemas and calculate implementation progress
 * Simplified: only compare top-level required properties
 */
export async function compareAppSchemas(
  goalSchemaPath: string,
  currentSchemaPath: string
): Promise<AppSchemaComparison> {
  // Load schemas
  const goalSchema = await loadSchema(goalSchemaPath)
  const currentSchema = await loadSchema(currentSchemaPath)

  // Get top-level required properties from goal schema
  const goalProperties = goalSchema.required || []
  const currentProperties = currentSchema.required || []

  // Calculate diff
  const missingPaths = goalProperties.filter((prop) => !currentProperties.includes(prop))
  const implementedPaths = goalProperties.filter((prop) => currentProperties.includes(prop))

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

/**
 * Load JSON schema from file
 */
async function loadSchema(path: string): Promise<JSONSchema> {
  const content = await readFile(path, 'utf-8')
  return JSON.parse(content) as JSONSchema
}

/**
 * Resolve all $ref in schema recursively
 */
async function resolveRefs(
  schema: JSONSchema,
  baseDir: string,
  visited = new Set<string>()
): Promise<JSONSchema> {
  if (!schema || typeof schema !== 'object') {
    return schema
  }

  // Handle $ref
  if (schema.$ref && typeof schema.$ref === 'string') {
    // Avoid circular references
    if (visited.has(schema.$ref)) {
      return schema
    }
    visited.add(schema.$ref)

    // Split $ref into file path and JSON pointer
    const [refFile, jsonPointer] = schema.$ref.split('#')

    if (!refFile) {
      // Internal reference within same file (e.g., "#/definitions/id")
      // For now, skip resolution of internal references
      return schema
    }

    // Resolve relative path
    const refPath = join(baseDir, refFile)
    let refSchema = await loadSchema(refPath)
    const refDir = dirname(refPath)

    // If there's a JSON pointer, resolve it
    if (jsonPointer) {
      refSchema = resolveJsonPointer(refSchema, jsonPointer)
    }

    // Recursively resolve refs in the referenced schema
    return await resolveRefs(refSchema, refDir, visited)
  }

  // Recursively resolve refs in nested objects
  const resolved: JSONSchema = Array.isArray(schema) ? [] : {}

  for (const [key, value] of Object.entries(schema)) {
    if (value && typeof value === 'object') {
      resolved[key] = await resolveRefs(value as JSONSchema, baseDir, visited)
    } else {
      resolved[key] = value
    }
  }

  return resolved
}

/**
 * Resolve JSON pointer (e.g., "/definitions/id")
 */
function resolveJsonPointer(schema: any, pointer: string): any {
  if (!pointer || pointer === '') {
    return schema
  }

  // Remove leading slash and split path
  const path = pointer.replace(/^\//, '').split('/')

  let current = schema
  for (const segment of path) {
    if (current && typeof current === 'object' && segment in current) {
      current = current[segment]
    } else {
      // Pointer doesn't resolve, return original schema
      return schema
    }
  }

  return current
}

/**
 * Extract all property paths from schema recursively
 * Example paths: "name", "tables", "tables.fields", "tables.fields.type"
 */
function extractPropertyPaths(schema: JSONSchema, prefix = ''): string[] {
  const paths: string[] = []

  if (!schema || typeof schema !== 'object') {
    return paths
  }

  // Add current level if it has a type (it's a property definition)
  if (schema.type && prefix) {
    paths.push(prefix)
  }

  // Process properties object
  if (schema.properties && typeof schema.properties === 'object') {
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      const propPath = prefix ? `${prefix}.${propName}` : propName

      // Add this property
      paths.push(propPath)

      // Recursively process nested properties
      if (propSchema && typeof propSchema === 'object') {
        const nestedPaths = extractPropertyPaths(propSchema as JSONSchema, propPath)
        paths.push(...nestedPaths)
      }
    }
  }

  // Process array items
  if (schema.items && typeof schema.items === 'object') {
    const itemPaths = extractPropertyPaths(schema.items as JSONSchema, prefix)
    paths.push(...itemPaths)
  }

  return paths
}
