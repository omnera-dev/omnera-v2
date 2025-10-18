/**
 * ROADMAP.md template generator
 */

import type { PropertyStatus, RoadmapData } from '../types/roadmap.ts'

/**
 * Generate ROADMAP.md content
 */
export function generateRoadmapMarkdown(data: RoadmapData): string {
  const { stats, properties, allProperties, timestamp } = data

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
  md += `| Property | Status | Completion | Complexity | Implementation | Guide |\n`
  md += `|----------|--------|------------|------------|----------------|-------|\n`

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

    const implementationStatus = formatImplementationStatus(property)

    md += `| **${property.name}** | ${status} | ${property.completionPercent}% | ${property.complexity} pts | ${implementationStatus} | ${detailLink} |\n`
  }

  md += `\n**Legend**: ✅ Done | 🚧 In Progress | ⏳ Not Started\n\n`

  md += `---\n\n`

  // All Properties (detailed breakdown)
  md += `## All Properties (${allProperties.length} total)\n\n`
  md += generateAllPropertiesTable(allProperties)
  md += `\n`

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
 * Format implementation status for Definition of Done
 */
function formatImplementationStatus(property: PropertyStatus): string {
  const impl = property.implementationStatus

  if (!impl) {
    return '-'
  }

  // Schema status
  let schemaIcon: string
  if (impl.schemaExported) {
    schemaIcon = '✅'
  } else if (impl.schemaFileExists) {
    schemaIcon = '🚧'
  } else {
    schemaIcon = '⏳'
  }

  // Test status
  const testStatus =
    impl.expectedTestCount > 0 ? `${impl.implementedTestCount}/${impl.expectedTestCount}` : '-'

  // Quality status (unit tests)
  const qualityIcon = impl.hasUnitTests ? '✅' : '⏳'

  return `Schema ${schemaIcon} · Tests ${testStatus} · Quality ${qualityIcon}`
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

// Tree-based rendering removed - using table-based approach instead

/**
 * Generate table showing all properties with hierarchical organization
 */
function generateAllPropertiesTable(allProperties: PropertyStatus[]): string {
  let md = ''

  md +=
    'Properties organized hierarchically: Automations (Triggers > Actions by service), Connections (by service), Pages (by type), Tables (fields by type).\n\n'
  md += '**Legend**: ✅ Complete | 🚧 Partial | ⏳ Not Started\n\n'

  // Group all properties
  const groups = groupPropertiesHierarchically(allProperties)

  // Render Automations section
  if (groups.automations.triggers.length > 0 || groups.automations.actions.length > 0) {
    md += `## Automations\n\n`

    // Group triggers by service
    if (groups.automations.triggers.length > 0) {
      md += `### Triggers\n\n`
      const triggersByService = groupByService(groups.automations.triggers)
      const services = Object.keys(triggersByService).sort()

      services.forEach((serviceName) => {
        const serviceProps = triggersByService[serviceName]!
        if (serviceProps.length > 0) {
          md += `#### ${formatServiceName(serviceName)}\n\n`
          md += renderPropertyTable(serviceProps, 'trigger')
        }
      })
    }

    // Group actions by service
    if (groups.automations.actions.length > 0) {
      md += `### Actions\n\n`
      const actionsByService = groupByService(groups.automations.actions)
      const services = Object.keys(actionsByService).sort()

      services.forEach((serviceName) => {
        const serviceProps = actionsByService[serviceName]!
        if (serviceProps.length > 0) {
          md += `#### ${formatServiceName(serviceName)}\n\n`
          md += renderPropertyTable(serviceProps, 'action')
        }
      })
    }
  }

  // Render Connections section
  if (groups.connections.length > 0) {
    md += `## Connections\n\n`
    const connectionsByService = groupByService(groups.connections)
    const services = Object.keys(connectionsByService).sort()

    services.forEach((serviceName) => {
      const serviceProps = connectionsByService[serviceName]!
      if (serviceProps.length > 0) {
        md += `### ${formatServiceName(serviceName)}\n\n`
        md += renderPropertyTable(serviceProps, 'connection')
      }
    })
  }

  // Render Pages section
  if (groups.pages.length > 0) {
    md += `## Pages\n\n`
    const pagesByType = groupPagesByType(groups.pages)
    const types = Object.keys(pagesByType).sort()

    types.forEach((typeName) => {
      const typeProps = pagesByType[typeName]!
      if (typeProps.length > 0) {
        md += `### ${formatPageType(typeName)}\n\n`

        // Special handling for form-page: group inputs by type
        if (typeName === 'form-page') {
          const formPageGroups = groupFormPageByInputType(typeProps)
          const inputTypes = Object.keys(formPageGroups).sort()

          inputTypes.forEach((inputTypeName) => {
            const inputTypeProps = formPageGroups[inputTypeName]!
            if (inputTypeProps.length > 0) {
              md += `#### ${formatInputType(inputTypeName)}\n\n`
              md += renderPropertyTable(inputTypeProps, 'page')
            }
          })
        } else {
          // Regular page types: render all properties in one table
          md += renderPropertyTable(typeProps, 'page')
        }
      }
    })
  }

  // Render Tables section
  if (groups.tables.length > 0) {
    md += `## Tables\n\n`
    const fieldsByType = groupTableFieldsByType(groups.tables)
    const types = Object.keys(fieldsByType).sort()

    types.forEach((typeName) => {
      const typeProps = fieldsByType[typeName]!
      if (typeProps.length > 0) {
        md += `### ${formatFieldType(typeName)}\n\n`
        md += renderPropertyTable(typeProps, 'table')
      }
    })
  }

  // Render Other properties
  if (groups.other.length > 0) {
    md += `## Other Properties\n\n`
    md += renderPropertyTable(groups.other, 'other')
  }

  return md
}

/**
 * Group properties hierarchically
 */
interface HierarchicalGroups {
  automations: {
    triggers: PropertyStatus[]
    actions: PropertyStatus[]
  }
  connections: PropertyStatus[]
  pages: PropertyStatus[]
  tables: PropertyStatus[]
  other: PropertyStatus[]
}

function groupPropertiesHierarchically(allProperties: PropertyStatus[]): HierarchicalGroups {
  const groups: HierarchicalGroups = {
    automations: {
      triggers: [],
      actions: [],
    },
    connections: [],
    pages: [],
    tables: [],
    other: [],
  }

  for (const prop of allProperties) {
    if (prop.name.startsWith('automation_trigger.')) {
      groups.automations.triggers.push(prop)
    } else if (prop.name.startsWith('automation_action.')) {
      groups.automations.actions.push(prop)
    } else if (prop.name.startsWith('connections.')) {
      groups.connections.push(prop)
    } else if (prop.name.startsWith('pages.')) {
      groups.pages.push(prop)
    } else if (prop.name.startsWith('tables.')) {
      groups.tables.push(prop)
    } else {
      groups.other.push(prop)
    }
  }

  return groups
}

/**
 * Group properties by service (for automations and connections)
 */
function groupByService(properties: PropertyStatus[]): Record<string, PropertyStatus[]> {
  const groups: Record<string, PropertyStatus[]> = {}

  for (const prop of properties) {
    const service = extractServiceName(prop.name)
    if (service) {
      if (!groups[service]) {
        groups[service] = []
      }
      groups[service]!.push(prop)
    }
  }

  return groups
}

/**
 * Group pages by type
 */
function groupPagesByType(pages: PropertyStatus[]): Record<string, PropertyStatus[]> {
  const groups: Record<string, PropertyStatus[]> = {}

  for (const prop of pages) {
    // Extract page type: pages.{type}.{property}
    const parts = prop.name.split('.')
    if (parts.length >= 2) {
      const pageType = parts[1]!
      if (!groups[pageType]) {
        groups[pageType] = []
      }
      groups[pageType]!.push(prop)
    }
  }

  return groups
}

/**
 * Group form page properties by input type
 */
function groupFormPageByInputType(
  formPageProps: PropertyStatus[]
): Record<string, PropertyStatus[]> {
  const groups: Record<string, PropertyStatus[]> = {
    'Form Page Metadata': [],
  }

  for (const prop of formPageProps) {
    // Check if this is an input property: pages.form-page.inputs.{input-type}.{property}
    if (prop.name.startsWith('pages.form-page.inputs.')) {
      const parts = prop.name.split('.')
      if (parts.length >= 4) {
        const inputType = parts[3]!
        if (!groups[inputType]) {
          groups[inputType] = []
        }
        groups[inputType]!.push(prop)
      }
    } else {
      // Form-level properties (id, name, path, title, description, etc.)
      groups['Form Page Metadata']!.push(prop)
    }
  }

  // Remove empty groups
  return Object.fromEntries(Object.entries(groups).filter(([_, v]) => v.length > 0))
}

/**
 * Format input type for display
 */
function formatInputType(inputType: string): string {
  const typeMap: Record<string, string> = {
    'Form Page Metadata': 'Form Page Metadata',
    'text-input': 'Text Input',
    'checkbox-input': 'Checkbox Input',
    'select-input': 'Select Input',
    'attachment-input': 'Attachment Input',
  }

  return typeMap[inputType] || inputType.charAt(0).toUpperCase() + inputType.slice(1)
}

/**
 * Group table fields by type
 */
function groupTableFieldsByType(tables: PropertyStatus[]): Record<string, PropertyStatus[]> {
  const groups: Record<string, PropertyStatus[]> = {
    'Table Metadata': [],
    'Field Types': [],
  }

  for (const prop of tables) {
    // Check if this is a field property: tables.fields.{field-type}.{property}
    if (prop.name.startsWith('tables.fields.')) {
      const parts = prop.name.split('.')
      if (parts.length >= 3) {
        const fieldType = parts[2]!
        if (!groups[fieldType]) {
          groups[fieldType] = []
        }
        groups[fieldType]!.push(prop)
      }
    } else {
      // Table-level properties (id, name, primary-key, etc.)
      groups['Table Metadata']!.push(prop)
    }
  }

  // Remove empty groups
  return Object.fromEntries(Object.entries(groups).filter(([_, v]) => v.length > 0))
}

/**
 * Format page type for display
 */
function formatPageType(pageType: string): string {
  const typeMap: Record<string, string> = {
    'custom-html-page': 'Custom HTML Page',
    'form-page': 'Form Page',
    'table-view-page': 'Table View Page',
    'detail-view-page': 'Detail View Page',
  }

  return typeMap[pageType] || pageType.charAt(0).toUpperCase() + pageType.slice(1)
}

/**
 * Format field type for display
 */
function formatFieldType(fieldType: string): string {
  const typeMap: Record<string, string> = {
    'Table Metadata': 'Table Metadata',
    'text-field': 'Text Field',
    'number-field': 'Number Field',
    'date-field': 'Date Field',
    'checkbox-field': 'Checkbox Field',
    'single-select-field': 'Single Select Field',
    'multi-select-field': 'Multi Select Field',
    'relationship-field': 'Relationship Field',
    'single-attachment-field': 'Single Attachment Field',
    'multiple-attachments-field': 'Multiple Attachments Field',
    'formula-field': 'Formula Field',
    'rollup-field': 'Rollup Field',
    'lookup-field': 'Lookup Field',
    'user-field': 'User Field',
    'created-at-field': 'Created At Field',
    'updated-at-field': 'Updated At Field',
    'created-by-field': 'Created By Field',
    'updated-by-field': 'Updated By Field',
    'rating-field': 'Rating Field',
    'duration-field': 'Duration Field',
    'rich-text-field': 'Rich Text Field',
    'status-field': 'Status Field',
    'button-field': 'Button Field',
    'autonumber-field': 'Autonumber Field',
    'barcode-field': 'Barcode Field',
    'progress-field': 'Progress Field',
    'color-field': 'Color Field',
    'geolocation-field': 'Geolocation Field',
    'json-field': 'JSON Field',
    'array-field': 'Array Field',
  }

  return typeMap[fieldType] || fieldType.charAt(0).toUpperCase() + fieldType.slice(1)
}

/**
 * Render a property table
 */
function renderPropertyTable(
  properties: PropertyStatus[],
  context: 'trigger' | 'action' | 'connection' | 'page' | 'table' | 'other'
): string {
  let md = ''

  md += `| Property Path | Status | Schema | Tests | Quality | Guide |\n`
  md += `|---------------|--------|--------|-------|---------|-------|\n`

  properties.forEach((prop) => {
    const impl = prop.implementationStatus
    let schemaIcon = '⏳'
    if (impl) {
      if (impl.schemaExported) {
        schemaIcon = '✅'
      } else if (impl.schemaFileExists) {
        schemaIcon = '🚧'
      }
    }
    const testStatus =
      impl && impl.expectedTestCount > 0
        ? `${impl.implementedTestCount}/${impl.expectedTestCount}`
        : '-'
    const qualityIcon = impl && impl.hasUnitTests ? '✅' : '⏳'

    const fileName = prop.name.replace(/\./g, '/')
    const guideLink =
      prop.status !== 'complete' ? `[📋 Guide](docs/specifications/roadmap/${fileName}.md)` : '-'

    const path = formatPropertyPathForContext(prop.name, context)

    md += `| **${path}** | ${getStatusIcon(prop.status)} | ${schemaIcon} | ${testStatus} | ${qualityIcon} | ${guideLink} |\n`
  })

  md += '\n'

  return md
}

/**
 * Format property path based on context
 */
function formatPropertyPathForContext(
  propertyName: string,
  context: 'trigger' | 'action' | 'connection' | 'page' | 'table' | 'other'
): string {
  if (context === 'trigger') {
    // automation_trigger.http.post -> post
    const parts = propertyName.split('.')
    return parts.slice(2).join('.')
  }

  if (context === 'action') {
    // automation_action.notion.create-page -> create-page
    const parts = propertyName.split('.')
    return parts.slice(2).join('.')
  }

  if (context === 'connection') {
    // connections.airtable.clientId -> clientId
    const parts = propertyName.split('.')
    if (parts.length === 3) {
      return parts[2]!
    }
  }

  if (context === 'page') {
    // Check if this is a form page input property: pages.form-page.inputs.{input-type}.{property}
    if (propertyName.startsWith('pages.form-page.inputs.')) {
      const parts = propertyName.split('.')
      // pages.form-page.inputs.text-input.name -> name
      // pages.form-page.inputs.select-input.options.label -> options/label
      return parts.slice(4).join('/')
    }
    // pages.form-page.title -> title
    // pages.table-view-page.columns -> columns
    const parts = propertyName.split('.')
    return parts.slice(2).join('/')
  }

  if (context === 'table') {
    // tables.fields.text-field.name -> name
    // tables.primary-key -> primary-key
    const parts = propertyName.split('.')
    if (parts[1] === 'fields' && parts.length >= 4) {
      return parts.slice(3).join('/')
    }
    return parts.slice(1).join('/')
  }

  // For other contexts, use the full path
  return propertyName.replace(/\./g, '/')
}

/**
 * Extract service name from property path
 */
function extractServiceName(propertyName: string): string | null {
  let service: string | null = null

  // connections.{service}.{property}
  if (propertyName.startsWith('connections.')) {
    const parts = propertyName.split('.')
    service = parts[1] || null
  }

  // automation_action.{service}.{action}
  if (propertyName.startsWith('automation_action.')) {
    const parts = propertyName.split('.')
    service = parts[1] || null
  }

  // automation_trigger.{service}.{trigger}
  if (propertyName.startsWith('automation_trigger.')) {
    const parts = propertyName.split('.')
    service = parts[1] || null
  }

  // Normalize service names for consistency
  if (service === 'linked-in-ads') {
    return 'linkedin-ads'
  }

  return service
}

/**
 * Format service name for display
 */
function formatServiceName(service: string): string {
  const nameMap: Record<string, string> = {
    airtable: 'Airtable',
    calendly: 'Calendly',
    'facebook-ads': 'Facebook Ads',
    'linkedin-ads': 'LinkedIn Ads',
    notion: 'Notion',
    qonto: 'Qonto',
    http: 'HTTP',
    database: 'Database',
    code: 'Code',
    filter: 'Filter',
    schedule: 'Schedule',
    'google-gmail': 'Google Gmail',
    'google-sheets': 'Google Sheets',
  }

  return nameMap[service] || service.charAt(0).toUpperCase() + service.slice(1)
}

// Unused tree-flattening utilities removed
