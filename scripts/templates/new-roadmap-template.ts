/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { NewRoadmapData } from '../types/roadmap'

/**
 * Generate lightweight summary roadmap for project root
 */
export function generateSummaryRoadmap(data: NewRoadmapData): string {
  const sections: string[] = []

  // Header
  sections.push(`# Omnera Development Roadmap

> **Last Generated**: ${data.timestamp}

`)

  // Overall Progress
  sections.push(generateOverallProgress(data))

  // 1. App Schema Progress (Summary)
  sections.push(generateAppSchemaSummary(data.appSchema))

  // 2. API Schema Progress (Summary)
  sections.push(generateApiSchemaSummary(data.apiSchema))

  // 3. Test Implementation Status (Summary)
  sections.push(generateTestStatusSummary(data.testStatus))

  // Links to detailed roadmaps
  sections.push(generateDetailedRoadmapLinks(data.testStatus))

  return sections.join('\n')
}

/**
 * Generate detailed app roadmap for specs/app/
 */
export function generateAppRoadmap(data: NewRoadmapData): string {
  const sections: string[] = []

  // Header
  sections.push(`# App Schema Roadmap

> **Last Generated**: ${data.timestamp}
> **Back to**: [Main Roadmap](../../ROADMAP.md)

`)

  // App Schema Progress
  sections.push(generateAppSchemaSection(data.appSchema))

  // App Specifications
  const appSpecs = data.testStatus.allSpecs.filter((s) => s.sourceFile.startsWith('specs/app/'))
  sections.push(generateSpecsTable('App Specifications', appSpecs))

  return sections.join('\n')
}

/**
 * Generate detailed API roadmap for specs/api/
 */
export function generateApiRoadmap(data: NewRoadmapData): string {
  const sections: string[] = []

  // Header
  sections.push(`# API Schema Roadmap

> **Last Generated**: ${data.timestamp}
> **Back to**: [Main Roadmap](../../ROADMAP.md)

`)

  // API Schema Progress
  sections.push(generateApiSchemaSection(data.apiSchema))

  // API Specifications
  const apiSpecs = data.testStatus.allSpecs.filter((s) => s.sourceFile.startsWith('specs/api/'))
  sections.push(generateSpecsTable('API Specifications', apiSpecs))

  return sections.join('\n')
}

/**
 * Generate detailed Admin roadmap for specs/admin/
 */
export function generateAdminRoadmap(data: NewRoadmapData): string {
  const sections: string[] = []

  // Header
  sections.push(`# Admin UI Roadmap

> **Last Generated**: ${data.timestamp}
> **Back to**: [Main Roadmap](../../ROADMAP.md)

`)

  // Admin Specifications
  const adminSpecs = data.testStatus.allSpecs.filter((s) => s.sourceFile.startsWith('specs/admin/'))
  sections.push(generateSpecsTable('Admin UI Specifications', adminSpecs))

  return sections.join('\n')
}

/**
 * Generate overall progress section
 */
function generateOverallProgress(data: NewRoadmapData): string {
  const overallPercent = data.overall.completionPercent
  const overallBar = generateProgressBar(overallPercent, 30)

  const appPercent = data.appSchema.completionPercent
  const appBar = generateProgressBar(appPercent, 30)

  const apiPercent = data.apiSchema.completionPercent
  const apiBar = generateProgressBar(apiPercent, 30)

  const testPercent = data.testStatus.donePercent
  const testBar = generateProgressBar(testPercent, 30)

  return `## Overall Progress

${overallBar}

**Combined Progress**: ${overallPercent}% Complete

### Individual Metrics

**📋 App Schema Progress**: ${appPercent}% (${data.appSchema.implementedProperties}/${data.appSchema.totalProperties} properties, ${data.appSchema.currentTotalProperties} current)
${appBar}

**🌐 API Schema Progress**: ${apiPercent}% (${data.apiSchema.implementedEndpoints}/${data.apiSchema.totalEndpoints} endpoints, ${data.apiSchema.currentTotalEndpoints} current)
${apiBar}

**🧪 Test Implementation**: ${testPercent}% (${data.testStatus.doneSpecs}/${data.testStatus.totalSpecs} specs passing)
${testBar}

---

`
}

/**
 * Generate App Schema section
 */
function generateAppSchemaSection(appSchema: NewRoadmapData['appSchema']): string {
  const {
    totalProperties,
    currentTotalProperties,
    implementedProperties,
    missingProperties,
    completionPercent,
  } = appSchema

  let section = `## 1. App Schema Progress

📋 **Goal**: \`specs/app/app.schema.json\` (${totalProperties} properties)
📦 **Current**: \`schemas/0.0.1/app.schema.json\` (${currentTotalProperties} properties)
📊 **Completion**: ${completionPercent}% (${implementedProperties}/${totalProperties} implemented)

`

  if (missingProperties > 0) {
    section += `### Missing Properties (${missingProperties})

| Property Path |
|---------------|
`
    for (const path of appSchema.missingPropertyPaths.slice(0, 50)) {
      section += `| \`${path}\` |\n`
    }

    if (appSchema.missingPropertyPaths.length > 50) {
      section += `\n*...and ${appSchema.missingPropertyPaths.length - 50} more properties*\n`
    }
  }

  section += '\n---\n\n'
  return section
}

/**
 * Generate API Schema section
 */
function generateApiSchemaSection(apiSchema: NewRoadmapData['apiSchema']): string {
  const {
    totalEndpoints,
    currentTotalEndpoints,
    implementedEndpoints,
    missingEndpoints,
    completionPercent,
  } = apiSchema

  let section = `## 2. API Schema Progress

📋 **Goal**: \`specs/api/app.openapi.json\` (${totalEndpoints} endpoints)
📦 **Current**: \`schemas/0.0.1/app.openapi.json\` (${currentTotalEndpoints} endpoints)
📊 **Completion**: ${completionPercent}% (${implementedEndpoints}/${totalEndpoints} implemented)

`

  if (missingEndpoints > 0) {
    section += `### Missing Endpoints (${missingEndpoints})

| Method | Path |
|--------|------|
`
    for (const endpoint of apiSchema.missingEndpointPaths) {
      section += `| \`${endpoint.method.toUpperCase()}\` | \`${endpoint.path}\` |\n`
    }
  }

  section += '\n---\n\n'
  return section
}

/**
 * Generate App Schema summary section
 */
function generateAppSchemaSummary(appSchema: NewRoadmapData['appSchema']): string {
  const { totalProperties, currentTotalProperties, implementedProperties, completionPercent } =
    appSchema

  return `## 1. App Schema Progress

📋 **Goal**: ${totalProperties} properties
📦 **Current**: ${currentTotalProperties} properties
📊 **Completion**: ${completionPercent}%

**Next Steps**: Implement missing properties (${totalProperties - implementedProperties} remaining)

👉 **[View Detailed App Roadmap](specs/app/ROADMAP.md)**

---

`
}

/**
 * Generate API Schema summary section
 */
function generateApiSchemaSummary(apiSchema: NewRoadmapData['apiSchema']): string {
  const { totalEndpoints, currentTotalEndpoints, implementedEndpoints, completionPercent } =
    apiSchema

  return `## 2. API Schema Progress

🌐 **Goal**: ${totalEndpoints} endpoints
📦 **Current**: ${currentTotalEndpoints} endpoints
📊 **Completion**: ${completionPercent}%

**Next Steps**: Implement missing endpoints (${totalEndpoints - implementedEndpoints} remaining)

👉 **[View Detailed API Roadmap](specs/api/ROADMAP.md)**

---

`
}

/**
 * Generate Test Status summary section
 */
function generateTestStatusSummary(testStatus: NewRoadmapData['testStatus']): string {
  const { totalSpecs, doneSpecs, wipSpecs, todoSpecs, donePercent, wipPercent, todoPercent } =
    testStatus

  return `## 3. Test Implementation Status

🧪 **Total Specs**: ${totalSpecs}
✅ **DONE**: ${doneSpecs} (${donePercent}%)
🚧 **WIP**: ${wipSpecs} (${wipPercent}%)
⏳ **TODO**: ${todoSpecs} (${todoPercent}%)

**Next Steps**: Convert TODO specs to WIP, then to DONE

---

`
}

/**
 * Generate links to detailed roadmaps
 */
function generateDetailedRoadmapLinks(testStatus: NewRoadmapData['testStatus']): string {
  const appSpecs = testStatus.allSpecs.filter((s) => s.sourceFile.startsWith('specs/app/'))
  const apiSpecs = testStatus.allSpecs.filter((s) => s.sourceFile.startsWith('specs/api/'))
  const adminSpecs = testStatus.allSpecs.filter((s) => s.sourceFile.startsWith('specs/admin/'))

  return `## Detailed Roadmaps

For complete specification listings and implementation details:

- 📋 **[App Schema Roadmap](specs/app/ROADMAP.md)** - All ${appSpecs.length} app specifications
- 🌐 **[API Schema Roadmap](specs/api/ROADMAP.md)** - All ${apiSpecs.length} API specifications
- ⚙️ **[Admin UI Roadmap](specs/admin/ROADMAP.md)** - All ${adminSpecs.length} admin specifications

`
}

/**
 * Generate specs table for detailed roadmaps
 */
function generateSpecsTable(
  title: string,
  specs: NewRoadmapData['testStatus']['allSpecs']
): string {
  let section = `## ${title} (${specs.length} total)

### Status Legend
- ✅ **DONE**: Test implemented and passing
- 🚧 **WIP**: Test exists but marked with .fixme()
- ⏳ **TODO**: No test file exists

### All Specifications

| Status | ID | Specification | Source File | Test File |
|--------|----|--------------  |-------------|-----------|
`

  for (const spec of specs) {
    const statusIcon = getStatusIcon(spec.status)
    const specText = formatSpecText(spec.given, spec.when, spec.then)
    const testFile = spec.testFile || '-'
    section += `| ${statusIcon} | ${spec.id} | ${specText} | \`${spec.sourceFile}\` | ${testFile !== '-' ? '`' + testFile + '`' : testFile} |\n`
  }

  // Summary statistics
  const done = specs.filter((s) => s.status === 'DONE').length
  const wip = specs.filter((s) => s.status === 'WIP').length
  const todo = specs.filter((s) => s.status === 'TODO').length

  section += `

### Summary

| Total | ✅ DONE | 🚧 WIP | ⏳ TODO |
|-------|---------|--------|---------|
| ${specs.length} | ${done} | ${wip} | ${todo} |

`

  return section
}

/**
 * Get status icon
 */
function getStatusIcon(status: 'TODO' | 'WIP' | 'DONE'): string {
  switch (status) {
    case 'DONE':
      return '✅'
    case 'WIP':
      return '🚧'
    case 'TODO':
      return '⏳'
  }
}

/**
 * Format spec text as Given-When-Then
 */
function formatSpecText(given: string, when: string, then: string): string {
  // Truncate if too long
  const maxLength = 100
  const text = `**Given** ${given}, **When** ${when}, **Then** ${then}`

  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + '...'
  }

  return text
}

/**
 * Generate progress bar
 */
function generateProgressBar(percent: number, width: number = 30): string {
  const filled = Math.round((percent / 100) * width)
  const empty = width - filled
  return `${'█'.repeat(filled)}${'░'.repeat(empty)} ${percent}%`
}
