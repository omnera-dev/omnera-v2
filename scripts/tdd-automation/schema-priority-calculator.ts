/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Schema-Based Priority Calculator
 *
 * Processes tests by schema group in serial, with regression tests last for each group.
 *
 * Priority calculation:
 * - Schema groups get base priorities (1000, 2000, 3000, etc.) based on hierarchy
 * - Within each schema: individual tests (+1, +2, +3, etc.)
 * - Regression tests: +900 (ensures they run last in their schema group)
 *
 * Example execution order:
 * - APP-VERSION-001 (1001), APP-VERSION-002 (1002), APP-VERSION-REGRESSION (1900)
 * - APP-NAME-001 (2001), APP-NAME-002 (2002), APP-NAME-REGRESSION (2900)
 * - APP-THEME-001 (3001), APP-THEME-002 (3002), APP-THEME-REGRESSION (3900)
 *
 * This ensures:
 * 1. All tests from same schema are processed together
 * 2. Regression tests validate the schema after all its tests
 * 3. Schema order follows hierarchy (required root → optional root → nested)
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
 * Calculate priority for a spec ID based on schema hierarchy
 *
 * Priority calculation:
 * - Schema groups get base priorities (1000, 2000, 3000, etc.)
 * - Individual tests within schema: base + test number (1, 2, 3, etc.)
 * - Regression tests: base + 900 (always last in group)
 *
 * @param specId The full spec ID (e.g., "APP-VERSION-001" or "APP-VERSION-REGRESSION")
 * @param hierarchy The schema hierarchy map
 * @returns Priority number for queue ordering
 */
export function calculateSchemaBasedPriority(specId: string, hierarchy: SchemaHierarchy): number {
  // Extract feature path and test identifier
  const parts = specId.split('-')
  const testIdentifier = parts[parts.length - 1] || ''
  const isRegression = testIdentifier.toUpperCase() === 'REGRESSION'

  // Get feature path (without test number/regression suffix)
  const featurePath = getFeaturePathFromSpecId(specId)

  // Calculate base priority for the schema group
  const schemaBasePriority = calculateSchemaGroupPriority(featurePath, hierarchy)

  // Add offset within the group
  if (isRegression) {
    // Regression tests always run last in their group
    return schemaBasePriority + 900
  } else {
    // Individual test number (001 → 1, 002 → 2, etc.)
    const testNumber = parseInt(testIdentifier, 10) || 1
    return schemaBasePriority + testNumber
  }
}

/**
 * Calculate base priority for a schema group
 * Groups are separated by 1000 to ensure all tests from one schema
 * complete before moving to the next schema
 */
function calculateSchemaGroupPriority(featurePath: string, hierarchy: SchemaHierarchy): number {
  // Direct match in hierarchy
  const property = hierarchy.get(featurePath)
  if (property) {
    return calculatePropertyGroupPriority(property, hierarchy) * 1000
  }

  // Try parent paths (for deeply nested features not directly in schema)
  const parts = featurePath.split('/')
  for (let i = parts.length - 1; i > 0; i--) {
    const parentPath = parts.slice(0, i).join('/')
    const parentProp = hierarchy.get(parentPath)
    if (parentProp) {
      // Inherit parent group priority + offset for nesting
      const baseGroup = calculatePropertyGroupPriority(parentProp, hierarchy)
      const additionalLevels = parts.length - i
      return (baseGroup + additionalLevels * 0.1) * 1000
    }
  }

  // Fallback for unknown paths
  return 100_000
}

/**
 * Calculate group priority for a specific property
 * Returns a group number (1, 2, 3, etc.) that will be multiplied by 1000
 * for the final schema group base priority
 */
function calculatePropertyGroupPriority(
  property: SchemaProperty,
  hierarchy: SchemaHierarchy
): number {
  // Group assignment based on schema hierarchy
  // Required root properties get groups 1-3
  // Optional root properties get groups 4+
  // Nested properties get higher groups

  if (property.level === 1 && property.required) {
    // Required root property: Only 'name' is required in the schema
    // Priority group 1 for 'name'
    if (property.name === 'name') {
      return 1
    }
    // If other properties become required in the future
    return 2
  }

  if (property.level === 1 && !property.required) {
    // Optional root properties: Priority groups 2+
    // Prioritize common metadata fields (version, description) before others

    // High-priority optional metadata fields
    const metadataOrder = ['version', 'description']
    const metadataIndex = metadataOrder.indexOf(property.name)
    if (metadataIndex >= 0) {
      return 2 + metadataIndex // version=2, description=3
    }

    // Other optional root properties (alphabetical)
    const otherOptionalProps = Array.from(hierarchy.values())
      .filter((p) => p.level === 1 && !p.required && !metadataOrder.includes(p.name))
      .sort((a, b) => a.name.localeCompare(b.name))

    const index = otherOptionalProps.findIndex((p) => p.name === property.name)
    return 4 + index // Starting from group 4
  }

  // Nested properties (level 2+): Higher group numbers
  // Calculate base group based on parent property
  const parentProp = hierarchy.get(property.parent!)
  if (parentProp) {
    const parentGroup = calculatePropertyGroupPriority(parentProp, hierarchy)

    // Get siblings at same level and sort
    const siblings = Array.from(hierarchy.values())
      .filter((p) => p.level === property.level && p.parent === property.parent)
      .sort((a, b) => a.name.localeCompare(b.name))

    const siblingIndex = siblings.findIndex((p) => p.name === property.name)

    // Nested properties start at parent + 100 to ensure they come after parent's regression tests
    // Each nesting level adds 100, siblings add 10
    return parentGroup + 100 * property.level + 10 + siblingIndex
  }

  // Fallback for unknown properties
  return 100
}

/**
 * Get feature path from spec ID
 * Examples:
 * - APP-VERSION-001 → app/version
 * - APP-VERSION-REGRESSION → app/version
 * - APP-THEME-COLORS-001 → app/theme/colors
 * - APP-THEME-COLORS-REGRESSION → app/theme/colors
 * - API-PATHS-HEALTH-001 → api/paths/health
 */
export function getFeaturePathFromSpecId(specId: string): string {
  // Split by hyphens and convert to lowercase path
  const parts = specId.split('-')

  // Check if last part is "REGRESSION" (case-insensitive)
  const lastPart = parts[parts.length - 1] || ''
  const isRegression = lastPart.toUpperCase() === 'REGRESSION'

  // Remove suffix (numeric or "REGRESSION")
  const pathParts = isRegression || /^\d+$/.test(lastPart) ? parts.slice(0, -1) : parts

  return pathParts.join('/').toLowerCase()
}

/**
 * Load schema hierarchy and create priority calculator function
 * Returns a function that takes a spec ID and returns its priority
 *
 * @param rootSchemaPath Path to the root app.schema.json file
 * @returns Function that calculates priority for spec IDs
 */
export function createSchemaPriorityCalculator(rootSchemaPath: string): (specId: string) => number {
  const hierarchy = loadSchemaHierarchy(rootSchemaPath)

  return (specId: string) => calculateSchemaBasedPriority(specId, hierarchy)
}

/**
 * Calculate priority for spec IDs with grouped schema processing
 * This is the main export for TDD automation queue ordering
 *
 * @param specId Full spec ID (e.g., "APP-VERSION-001", "APP-THEME-REGRESSION")
 * @param rootSchemaPath Path to the root app.schema.json file
 * @returns Priority number (lower = higher priority)
 */
export function calculateSpecPriority(specId: string, rootSchemaPath: string): number {
  const hierarchy = loadSchemaHierarchy(rootSchemaPath)
  return calculateSchemaBasedPriority(specId, hierarchy)
}
