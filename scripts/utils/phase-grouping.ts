/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Phase grouping algorithm for roadmap generation
 */

import type { Phase, PhaseStatus, PropertyStatus } from '../types/roadmap'

/**
 * Group properties into development phases
 */
export function groupIntoPhases(properties: PropertyStatus[]): Phase[] {
  const phases: Phase[] = []

  // Phase 0: Already implemented properties
  const implemented = properties.filter((p) => p.status === 'complete')
  if (implemented.length > 0) {
    phases.push(createPhase(0, 'v0.0.1', '✅ DONE', 'Foundation', implemented, []))
  }

  // Separate remaining properties by category and dependencies
  const remaining = properties.filter((p) => p.status !== 'complete')

  // Build dependency graph and group properties
  const groups = buildPropertyGroups(remaining)

  // Create phases from groups
  let phaseNumber = phases.length
  for (const group of groups) {
    const version = calculateVersion(phaseNumber)
    const status: PhaseStatus = group.properties.some((p) => p.status === 'partial')
      ? '🚧 IN PROGRESS'
      : '⏳ NOT STARTED'

    const phaseDeps = extractPhaseDependencies(group.properties, phases.slice(0, phaseNumber))

    phases.push(createPhase(phaseNumber, version, status, group.name, group.properties, phaseDeps))
    phaseNumber++
  }

  // Final phase should be v1.0.0
  if (phases.length > 0) {
    const lastPhase = phases[phases.length - 1]
    if (lastPhase) {
      lastPhase.version = 'v1.0.0'
    }
  }

  return phases
}

/**
 * Create a phase object
 */
function createPhase(
  number: number,
  version: string,
  status: PhaseStatus,
  name: string,
  properties: PropertyStatus[],
  dependencies: string[]
): Phase {
  const avgCompletion = Math.round(
    properties.reduce((sum, p) => sum + p.completionPercent, 0) / properties.length
  )

  const totalComplexity = properties.reduce((sum, p) => sum + p.complexity, 0)
  const duration = estimateDuration(totalComplexity)

  return {
    number,
    version,
    status,
    name,
    properties,
    completionPercent: avgCompletion,
    durationEstimate: duration,
    dependencies,
  }
}

/**
 * Build logical property groups based on features and dependencies
 */
interface PropertyGroup {
  name: string
  properties: PropertyStatus[]
}

function buildPropertyGroups(properties: PropertyStatus[]): PropertyGroup[] {
  const groups: PropertyGroup[] = []

  // Special handling for known properties
  const tableProps = properties.filter((p) => p.name === 'tables')
  const pageProps = properties.filter((p) => p.name === 'pages')
  const automationProps = properties.filter((p) => p.name === 'automations')
  const connectionProps = properties.filter((p) => p.name === 'connections')
  const metadataProps = properties.filter((p) =>
    ['icon', 'color', 'appVersion', 'schemaVersion'].includes(p.name)
  )

  // Group tables by complexity (basic vs advanced fields)
  if (tableProps.length > 0) {
    const table = tableProps[0]

    if (table) {
      // Check if tables have advanced field types
      const hasAdvancedFields = hasAdvancedTableFields(table)

      if (hasAdvancedFields) {
        // Split into two phases: basic fields and advanced fields
        groups.push({
          name: 'Tables Foundation',
          properties: [
            {
              name: table.name,
              status: table.status,
              visionVersion: table.visionVersion,
              currentVersion: table.currentVersion,
              completionPercent: table.completionPercent,
              complexity: Math.round(table.complexity * 0.4), // Basic fields are simpler
              missingFeatures: table.missingFeatures.filter(
                (f) =>
                  f.includes('text') ||
                  f.includes('number') ||
                  f.includes('date') ||
                  f.includes('checkbox')
              ),
              dependencies: table.dependencies,
              implementationStatus: table.implementationStatus,
            },
          ],
        })

        groups.push({
          name: 'Advanced Fields',
          properties: [
            {
              name: table.name,
              status: table.status,
              visionVersion: table.visionVersion,
              currentVersion: table.currentVersion,
              completionPercent: table.completionPercent,
              complexity: Math.round(table.complexity * 0.6), // Advanced fields more complex
              missingFeatures: table.missingFeatures.filter(
                (f) =>
                  f.includes('select') || f.includes('relationship') || f.includes('attachment')
              ),
              dependencies: table.dependencies,
              implementationStatus: table.implementationStatus,
            },
          ],
        })
      } else {
        groups.push({
          name: 'Tables',
          properties: tableProps,
        })
      }
    }
  }

  // Pages group
  if (pageProps.length > 0) {
    groups.push({
      name: 'Pages System',
      properties: pageProps,
    })
  }

  // Automations group
  if (automationProps.length > 0) {
    groups.push({
      name: 'Automations',
      properties: automationProps,
    })
  }

  // Connections group
  if (connectionProps.length > 0) {
    groups.push({
      name: 'Connections',
      properties: connectionProps,
    })
  }

  // UI Metadata group (icon, color, etc.)
  if (metadataProps.length > 0) {
    groups.push({
      name: 'UI Metadata',
      properties: metadataProps,
    })
  }

  // Any remaining properties
  const handledNames = new Set([
    'tables',
    'pages',
    'automations',
    'connections',
    'icon',
    'color',
    'appVersion',
    'schemaVersion',
  ])
  const remaining = properties.filter((p) => !handledNames.has(p.name))

  if (remaining.length > 0) {
    groups.push({
      name: 'Additional Features',
      properties: remaining,
    })
  }

  return groups
}

/**
 * Check if tables have advanced field types (relationships, attachments)
 */
function hasAdvancedTableFields(tableProperty: PropertyStatus): boolean {
  const schema = tableProperty.visionVersion

  // Check for anyOf in items.properties.fields.items
  if (schema.items && typeof schema.items === 'object' && !Array.isArray(schema.items)) {
    const itemProps = schema.items.properties
    if (itemProps?.fields) {
      const fieldsItems = (itemProps.fields as Record<string, unknown>).items
      if (
        fieldsItems &&
        typeof fieldsItems === 'object' &&
        'anyOf' in fieldsItems &&
        Array.isArray(fieldsItems.anyOf)
      ) {
        // Check if there are relationship or attachment field types
        const hasAdvanced = fieldsItems.anyOf.some((variant: unknown) => {
          if (typeof variant === 'object' && variant !== null && 'title' in variant) {
            const title = typeof variant.title === 'string' ? variant.title.toLowerCase() : ''
            return (
              title.includes('relationship') ||
              title.includes('attachment') ||
              title.includes('select')
            )
          }
          return false
        })
        return hasAdvanced && fieldsItems.anyOf.length > 5
      }
    }
  }

  return false
}

/**
 * Extract phase dependencies
 */
function extractPhaseDependencies(properties: PropertyStatus[], previousPhases: Phase[]): string[] {
  const deps = new Set<string>()

  // Get all property dependencies
  for (const prop of properties) {
    for (const dep of prop.dependencies) {
      // Find which phase contains this dependency
      const depPhase = previousPhases.find((phase) => phase.properties.some((p) => p.name === dep))
      if (depPhase) {
        deps.add(`Phase ${depPhase.number} (${depPhase.name})`)
      }
    }
  }

  return Array.from(deps)
}

/**
 * Calculate version number for a phase
 */
function calculateVersion(phaseNumber: number): string {
  if (phaseNumber === 0) {
    return 'v0.0.1'
  }

  // Minor version bumps: v0.1.0, v0.2.0, v0.3.0, etc.
  return `v0.${phaseNumber}.0`
}

/**
 * Estimate duration based on complexity score
 */
function estimateDuration(complexity: number): string {
  if (complexity < 50) {
    return '1-2 weeks'
  }
  if (complexity < 150) {
    return '2-3 weeks'
  }
  if (complexity < 300) {
    return '3-4 weeks'
  }
  if (complexity < 500) {
    return '4-6 weeks'
  }
  if (complexity < 800) {
    return '6-8 weeks'
  }

  return '8+ weeks'
}
