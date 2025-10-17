/**
 * ROADMAP.md template generator
 */

import type { PropertyStatus, RoadmapData } from '../types/roadmap.ts'

/**
 * Generate ROADMAP.md content
 */
export function generateRoadmapMarkdown(data: RoadmapData): string {
  const { stats, properties, timestamp } = data

  let md = ''

  // Header
  md += `# Omnera Development Roadmap\n\n`
  md += `> **Flexible Development**: Work on any feature whenever you want. Each property has its own detailed implementation guide in \`docs/specifications/roadmap/\`.\n`
  md += `> \n`
  md += `> **Last Generated**: ${timestamp}\n\n`

  // Overview section
  md += `## Overview\n\n`

  // Current state
  const completedProperties = properties.filter((p) => p.status === 'complete')
  if (completedProperties.length > 0) {
    md += `### Current State (v0.0.1)\n\n`
    md += `- **Schema**: \`schemas/0.0.1/app.schema.json\`\n`
    md += `- **Implemented Properties**: ${completedProperties.length} (${completedProperties.map((p) => p.name).join(', ')})\n`
    md += `- **Status**: ✅ **${completedProperties.length}/${stats.totalProperties} Properties Complete**\n\n`
  }

  // Vision state
  md += `### Vision State (v1.0.0)\n\n`
  md += `- **Schema**: \`docs/specifications/specs.schema.json\`\n`
  md += `- **Total Properties**: ${stats.totalProperties} (${properties.map((p) => p.name).join(', ')})\n`
  md += `- **Gap**: **~${100 - stats.overallCompletion}%** of features not yet implemented\n\n`

  md += `---\n\n`

  // Overall progress
  md += `## Overall Progress\n\n`
  md += generateProgressBar(stats.overallCompletion)
  md += `\n\n`

  md += `### Status Summary\n\n`
  md += `| Metric | Count | Percentage |\n`
  md += `|--------|-------|------------|\n`
  md += `| **Total Properties** | ${stats.totalProperties} | 100% |\n`
  md += `| **Implemented** | ${stats.implementedProperties} | ${Math.round((stats.implementedProperties / stats.totalProperties) * 100)}% |\n`
  md += `| **Partial** | ${stats.partialProperties} | ${Math.round((stats.partialProperties / stats.totalProperties) * 100)}% |\n`
  md += `| **Missing** | ${stats.missingProperties} | ${Math.round((stats.missingProperties / stats.totalProperties) * 100)}% |\n\n`

  md += `---\n\n`

  // Property overview table
  md += `## Property Overview\n\n`
  md += `| Property | Status | Completion | Complexity | Implementation Guide |\n`
  md += `|----------|--------|------------|------------|----------------------|\n`

  for (const property of properties) {
    const status = getStatusIcon(property.status)
    const fileName = property.name
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')
    const detailLink =
      property.status !== 'complete'
        ? `[📋 Guide](docs/specifications/roadmap/${fileName}.md)`
        : '-'

    md += `| **${property.name}** | ${status} | ${property.completionPercent}% | ${property.complexity} pts | ${detailLink} |\n`
  }

  md += `\n**Legend**: ✅ Done | 🚧 In Progress | ⏳ Not Started\n\n`

  md += `---\n\n`

  // Feature status by category
  md += `## Feature Status by Category\n\n`
  md += generateFeatureStatusTable(properties)
  md += `\n`

  md += `---\n\n`

  // Dependencies
  md += `## Dependencies\n\n`

  const withDependencies = properties.filter((p) => p.dependencies.length > 0)
  if (withDependencies.length > 0) {
    md += `The following properties have dependencies:\n\n`
    for (const prop of withDependencies) {
      md += `- **${prop.name}** depends on: ${prop.dependencies.join(', ')}\n`
    }
    md += `\n`
  } else {
    md += `No dependencies between properties. Work on any feature in any order!\n\n`
  }

  md += `---\n\n`

  // For implementers
  md += `## For Implementers\n\n`
  md += `### Developers\n\n`
  md += `- See individual property files in \`docs/specifications/roadmap/\` for detailed technical approach\n`
  md += `- Each property includes success criteria and implementation guide\n`
  md += `- Work on any property in any order (unless it has dependencies)\n\n`

  md += `### Schema-Architect Agent\n\n`
  md += `- Each property file contains **Effect Schema Blueprints** with copy-pasteable code\n`
  md += `- Validation rules include exact error messages\n`
  md += `- All annotations (title, description, examples) are specified\n\n`

  md += `### E2E-Red-Test-Writer Agent\n\n`
  md += `- Each property file contains **Playwright Test Blueprints**\n`
  md += `- data-testid patterns are standardized\n`
  md += `- Test scenarios use GIVEN-WHEN-THEN structure\n`
  md += `- @spec, @regression, and @critical tests are clearly separated\n\n`

  md += `---\n\n`

  // Footer
  const nextProperty = properties.find((p) => p.status === 'missing')
  if (nextProperty) {
    const fileName = nextProperty.name
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')
    md += `**Suggested Next Step**: Work on **${nextProperty.name}**\n`
    md += `**Implementation Guide**: [📋 ${nextProperty.name}](docs/specifications/roadmap/${fileName}.md)\n`
    md += `**Complexity**: ${nextProperty.complexity} points\n`
  }

  return md
}

/**
 * Generate progress bar
 */
function generateProgressBar(percent: number, width: number = 30): string {
  const filled = Math.round((percent / 100) * width)
  const empty = width - filled
  return `${'█'.repeat(filled)}${'░'.repeat(empty)} ${percent}% Complete`
}

/**
 * Get status icon
 */
function getStatusIcon(status: 'complete' | 'partial' | 'missing'): string {
  switch (status) {
    case 'complete':
      return '✅'
    case 'partial':
      return '🚧'
    case 'missing':
      return '⏳'
  }
}

/**
 * Generate feature status table
 */
function generateFeatureStatusTable(properties: PropertyStatus[]): string {
  let md = `| Category | Feature | Current | Vision | Status |\n`
  md += `|----------|---------|---------|--------|--------|\n`

  const groupedFeatures = groupFeaturesByCategory(properties)

  for (const [category, features] of Object.entries(groupedFeatures)) {
    md += `| **${category}** | | | | |\n`
    for (const feature of features) {
      const current = feature.completionPercent === 100 ? '✅' : '❌'
      const vision = '✅'
      const status = getStatusIcon(feature.status)

      md += `| | ${feature.name} | ${current} | ${vision} | ${status} ${feature.completionPercent}% |\n`
    }
  }

  return md
}

interface FeatureSummary {
  name: string
  completionPercent: number
  status: PropertyStatus['status']
}

/**
 * Group features by category
 */
function groupFeaturesByCategory(properties: PropertyStatus[]): Record<string, FeatureSummary[]> {
  const groups: Record<string, FeatureSummary[]> = {
    'Application Metadata': [],
    Tables: [],
    Pages: [],
    Automations: [],
    Connections: [],
  }

  for (const prop of properties) {
    const category = categorizeProperty(prop.name)
    if (category && groups[category]) {
      groups[category].push({
        name: prop.name,
        completionPercent: prop.completionPercent,
        status: prop.status,
      })
    }
  }

  // Remove empty categories
  return Object.fromEntries(Object.entries(groups).filter(([_, v]) => v.length > 0))
}

/**
 * Categorize a property
 */
function categorizeProperty(name: string): string | null {
  if (['name', 'description', 'icon', 'color', 'appVersion', 'schemaVersion'].includes(name)) {
    return 'Application Metadata'
  }
  if (name === 'tables') return 'Tables'
  if (name === 'pages') return 'Pages'
  if (name === 'automations') return 'Automations'
  if (name === 'connections') return 'Connections'
  return null
}
