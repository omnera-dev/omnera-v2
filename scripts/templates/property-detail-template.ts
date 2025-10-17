/**
 * Property detail file template generator
 */

import type { PropertyDocumentation } from '../types/roadmap.ts'

/**
 * Generate property detail markdown file
 */
export function generatePropertyDetailMarkdown(doc: PropertyDocumentation): string {
  const { property, effectSchema, userStories, successCriteria } = doc

  let md = ''

  // Header
  md += `# ${capitalize(property.name)}\n\n`
  md += `> **Status**: ${getStatusLabel(property.status)}\n`
  md += `> **Completion**: ${property.completionPercent}%\n`
  md += `> **Complexity**: ${property.complexity} points\n\n`

  // Description
  if (property.visionVersion.description) {
    md += `${property.visionVersion.description}\n\n`
  }

  // Status section
  md += `## Implementation Status\n\n`
  if (property.status === 'complete') {
    md += `✅ **Fully Implemented**\n\n`
  } else if (property.status === 'partial') {
    md += `🚧 **Partially Implemented** (${property.completionPercent}%)\n\n`
    md += `### What Remains\n\n`
    for (const missing of property.missingFeatures) {
      md += `- ${missing}\n`
    }
    md += `\n`
  } else {
    md += `⏳ **Not Started**\n\n`
    md += `### Required Features\n\n`
    for (const missing of property.missingFeatures) {
      md += `- ${missing}\n`
    }
    md += `\n`
  }

  // Dependencies
  if (property.dependencies.length > 0) {
    md += `## Dependencies\n\n`
    md += `This property depends on:\n\n`
    for (const dep of property.dependencies) {
      md += `- **${dep}**\n`
    }
    md += `\n`
  }

  md += `---\n\n`

  // Effect Schema Blueprints section
  md += `## Effect Schema Blueprint\n\n`
  md += `> **For**: \`schema-architect\` agent\n\n`
  md += `The following Effect Schema definition should be implemented in \`src/domain/models/app/\`.\n\n`

  md += `### ${capitalize(effectSchema.propertyName)} Schema\n\n`
  md += `**Location**: \`src/domain/models/app/${effectSchema.propertyName}.ts\`\n\n`

  // Imports
  if (effectSchema.imports.length > 0) {
    md += `**Imports**:\n\n`
    md += `\`\`\`typescript\n`
    md += `import { ${effectSchema.imports.join(', ')} } from 'effect'\n`
    md += `\`\`\`\n\n`
  }

  // Code
  md += `**Implementation**:\n\n`
  md += `\`\`\`typescript\n`
  md += effectSchema.code
  md += `\`\`\`\n\n`

  md += `---\n\n`

  // E2E User Stories section
  md += `## E2E Test Scenarios\n\n`
  md += `> **For**: \`e2e-red-test-writer\` agent\n\n`
  md += `The following user stories should be implemented as Playwright tests in \`tests/app/\`.\n\n`

  md += `**Test File**: \`tests/app/${kebabCase(userStories.propertyName)}.spec.ts\`\n\n`

  // @spec stories
  if (userStories.spec.length > 0) {
    md += `### @spec User Stories (Granular Behaviors)\n\n`
    md += `These tests define specific acceptance criteria. Each test validates ONE behavior.\n\n`

    for (const [index, story] of userStories.spec.entries()) {
      md += `**Scenario ${index + 1}**: Validation Test\n\n`
      md += `- **GIVEN**: ${story.given}\n`
      md += `- **WHEN**: ${story.when}\n`
      md += `- **THEN**: ${story.then}\n`
      md += `- **Tag**: \`${story.tag}\`\n\n`
    }
  }

  // @regression story
  if (userStories.regression.length > 0) {
    md += `### @regression User Story (Complete Workflow)\n\n`
    md += `This test consolidates ALL @spec tests into ONE comprehensive workflow.\n\n`

    for (const story of userStories.regression) {
      md += `**Complete Configuration Workflow**:\n\n`
      md += `- **GIVEN**: ${story.given}\n`
      md += `- **WHEN**: ${story.when}\n`
      md += `- **THEN**: ${story.then}\n`
      md += `- **Tag**: \`${story.tag}\`\n\n`
    }
  }

  // @critical story
  if (userStories.critical.length > 0) {
    md += `### @critical User Story (Essential Path)\n\n`
    md += `This test validates the MINIMAL essential path for this feature.\n\n`

    for (const story of userStories.critical) {
      md += `**Essential Feature Validation**:\n\n`
      md += `- **GIVEN**: ${story.given}\n`
      md += `- **WHEN**: ${story.when}\n`
      md += `- **THEN**: ${story.then}\n`
      md += `- **Tag**: \`${story.tag}\`\n\n`
    }
  }

  // data-testid patterns
  if (userStories.dataTestIds.length > 0) {
    md += `### data-testid Patterns\n\n`
    md += `Use these standardized test IDs for reliable selectors:\n\n`

    for (const testId of userStories.dataTestIds) {
      md += `- \`[data-testid="${testId}"]\`\n`
    }
    md += `\n`
  }

  md += `---\n\n`

  // Success criteria
  md += `## Definition of Done\n\n`
  md += `This property is complete when:\n\n`

  for (const criterion of successCriteria) {
    md += `- [ ] ${criterion}\n`
  }

  md += `\n`

  // Blockers
  if (property.status !== 'complete') {
    md += `**Current Blockers**:\n\n`
    if (property.dependencies.length > 0) {
      md += `- Requires: ${property.dependencies.join(', ')}\n`
    } else {
      md += `- None (ready to start)\n`
    }
  }

  md += `\n`

  md += `---\n\n`

  // Related documentation
  md += `## Related Documentation\n\n`
  md += `- **Vision Schema**: [\`docs/specifications/specs.schema.json\`](../specs.schema.json)\n`
  md += `- **Current Schema**: [\`schemas/0.0.1/app.schema.json\`](../../schemas/0.0.1/app.schema.json)\n`
  md += `- **Testing Strategy**: [\`docs/architecture/testing-strategy.md\`](../../architecture/testing-strategy.md)\n`
  md += `- **Main Roadmap**: [\`ROADMAP.md\`](../../../ROADMAP.md)\n`

  return md
}

/**
 * Generate success criteria for a property
 */
export function generateSuccessCriteria(doc: PropertyDocumentation): string[] {
  const { userStories } = doc

  const criteria: string[] = []

  // Schema implementation criteria
  criteria.push(`Effect Schema implemented and exported`)

  // E2E test criteria
  const totalSpecTests = userStories.spec.length
  const totalRegressionTests = userStories.regression.length
  const totalCriticalTests = userStories.critical.length

  if (totalSpecTests > 0) {
    criteria.push(`All ${totalSpecTests} @spec E2E tests passing`)
  }

  if (totalRegressionTests > 0) {
    criteria.push(`All ${totalRegressionTests} @regression E2E tests passing`)
  }

  if (totalCriticalTests > 0) {
    criteria.push(`All ${totalCriticalTests} @critical E2E tests passing`)
  }

  // Code quality criteria
  criteria.push(`Unit test coverage >80%`)
  criteria.push(`All TypeScript strict mode checks passing`)
  criteria.push(`All ESLint checks passing`)
  criteria.push(`All Prettier formatting checks passing`)

  // Schema export criteria
  criteria.push(`JSON schema export updated via \`bun run export:schema\``)

  return criteria
}

/**
 * Get status label
 */
function getStatusLabel(status: 'complete' | 'partial' | 'missing'): string {
  switch (status) {
    case 'complete':
      return '✅ DONE'
    case 'partial':
      return '🚧 IN PROGRESS'
    case 'missing':
      return '⏳ NOT STARTED'
  }
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert to kebab-case
 */
function kebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}
