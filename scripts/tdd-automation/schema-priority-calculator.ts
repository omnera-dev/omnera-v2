/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Schema-Based Priority Calculator
 *
 * Calculates spec priority based on app.schema.json hierarchy:
 * - Level 1 (Priority 1-3): Required root properties (name, description, version)
 * - Level 2 (Priority 4-6): Optional root properties (theme, languages, blocks)
 * - Level 3 (Priority 7-9): Nested properties (theme/colors, theme/fonts)
 * - Level 4+ (Priority 10+): Deep nested properties
 *
 * This ensures foundational features are implemented before dependent features.
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

/**
 * Schema property metadata
 */
interface SchemaProperty {
  name: string
  level: number
  required: boolean
  parent: string | null
}

/**
 * Schema hierarchy map
 */
type SchemaHierarchy = Map<string, SchemaProperty>

/**
 * Load and parse app.schema.json to build hierarchy
 */
export function loadSchemaHierarchy(rootSchemaPath: string): SchemaHierarchy {
  const hierarchy = new Map<string, SchemaProperty>()
  const schemasDir = path.dirname(rootSchemaPath)

  // Load root schema
  const rootSchema = JSON.parse(fs.readFileSync(rootSchemaPath, 'utf-8'))
  const requiredProps = new Set(rootSchema.required || [])

  // Process root properties
  for (const [propName, propDef] of Object.entries(rootSchema.properties || {})) {
    const prop: SchemaProperty = {
      name: propName,
      level: 1,
      required: requiredProps.has(propName),
      parent: null,
    }
    hierarchy.set(`app/${propName}`, prop)

    // Load nested schema if referenced
    const ref = (propDef as { $ref?: string }).$ref
    if (ref) {
      const nestedSchemaPath = path.resolve(schemasDir, ref)
      if (fs.existsSync(nestedSchemaPath)) {
        processNestedSchema(nestedSchemaPath, `app/${propName}`, 2, hierarchy)
      }
    }
  }

  return hierarchy
}

/**
 * Recursively process nested schema files
 */
function processNestedSchema(
  schemaPath: string,
  parentPath: string,
  level: number,
  hierarchy: SchemaHierarchy
): void {
  try {
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'))
    const requiredProps = new Set(schema.required || [])
    const schemasDir = path.dirname(schemaPath)

    for (const [propName, propDef] of Object.entries(schema.properties || {})) {
      const fullPath = `${parentPath}/${propName}`
      const prop: SchemaProperty = {
        name: propName,
        level,
        required: requiredProps.has(propName),
        parent: parentPath,
      }
      hierarchy.set(fullPath, prop)

      // Recursively process nested references (limit depth to prevent infinite loops)
      if (level < 5) {
        const ref = (propDef as { $ref?: string }).$ref
        if (ref) {
          const nestedSchemaPath = path.resolve(schemasDir, ref)
          if (fs.existsSync(nestedSchemaPath)) {
            processNestedSchema(nestedSchemaPath, fullPath, level + 1, hierarchy)
          }
        }
      }
    }
  } catch (error) {
    // Silently skip schemas that can't be parsed
    console.error(`Warning: Could not parse schema at ${schemaPath}:`, error)
  }
}

/**
 * Calculate priority for a feature path based on schema hierarchy
 *
 * Priority calculation:
 * - Level 1 Required: 1-3 (name=1, description=2, version=3)
 * - Level 1 Optional: 4-10 (theme=4, languages=5, blocks=6, etc.)
 * - Level 2: 11-20 (theme/colors, theme/fonts, etc.)
 * - Level 3: 21-30
 * - Level 4+: 31+
 * - Unknown: 100 (fallback)
 */
export function calculateSchemaBasedPriority(
  featurePath: string,
  hierarchy: SchemaHierarchy
): number {
  // Direct match in hierarchy
  const property = hierarchy.get(featurePath)
  if (property) {
    return calculatePropertyPriority(property, hierarchy)
  }

  // Try parent paths (for deeply nested features not directly in schema)
  const parts = featurePath.split('/')
  for (let i = parts.length - 1; i > 0; i--) {
    const parentPath = parts.slice(0, i).join('/')
    const parentProp = hierarchy.get(parentPath)
    if (parentProp) {
      // Inherit parent priority + 10 per additional level
      const additionalLevels = parts.length - i
      return calculatePropertyPriority(parentProp, hierarchy) + additionalLevels * 10
    }
  }

  // Fallback for unknown paths
  return 100
}

/**
 * Calculate priority for a specific property
 */
function calculatePropertyPriority(property: SchemaProperty, hierarchy: SchemaHierarchy): number {
  const baseByLevel = {
    1: property.required ? 1 : 4, // Root level: required (1-3) or optional (4-10)
    2: 11, // Nested level 2
    3: 21, // Nested level 3
    4: 31, // Nested level 4
  }

  const base = baseByLevel[property.level as keyof typeof baseByLevel] || 40

  // Add offset based on alphabetical order within same level
  // This ensures consistent ordering for properties at same level
  const siblings = Array.from(hierarchy.values()).filter(
    (p) => p.level === property.level && p.parent === property.parent
  )
  siblings.sort((a, b) => a.name.localeCompare(b.name))
  const offset = siblings.findIndex((p) => p.name === property.name)

  return base + offset
}

/**
 * Get feature path from spec ID
 * Examples:
 * - APP-VERSION-001 → app/version
 * - APP-THEME-COLORS-001 → app/theme/colors
 * - API-PATHS-HEALTH-001 → api/paths/health
 */
export function getFeaturePathFromSpecId(specId: string): string {
  // Split by hyphens and convert to lowercase path
  const parts = specId.split('-')

  // Remove numeric suffix (last part)
  const pathParts = parts.slice(0, -1)

  return pathParts.join('/').toLowerCase()
}

/**
 * Load schema hierarchy and create priority calculator function
 */
export function createSchemaPriorityCalculator(
  rootSchemaPath: string
): (feature: string) => number {
  const hierarchy = loadSchemaHierarchy(rootSchemaPath)

  return (feature: string) => calculateSchemaBasedPriority(feature, hierarchy)
}
