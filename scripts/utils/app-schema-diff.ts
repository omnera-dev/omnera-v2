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

  // Get top-level properties from both schemas
  const goalProperties = Object.keys(goalSchema.properties || {})
  const currentProperties = Object.keys(currentSchema.properties || {})

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
