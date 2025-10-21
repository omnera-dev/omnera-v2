/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readFile } from 'node:fs/promises'

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

