/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Phase detail file template generator
 */

import type { PhaseDocumentation } from '../types/roadmap'

/**
 * Generate phase detail markdown file
 */
export function generatePhaseDetailMarkdown(doc: PhaseDocumentation): string {
  const { phase, effectSchemas, userStories, successCriteria } = doc

  let md = ''

  // Header
  md += `# Phase ${phase.number}: ${phase.name}\n\n`
  md += `> **Status**: ${phase.status}\n`
  md += `> **Target Version**: ${phase.version}\n`
  md += `> **Completion**: ${phase.completionPercent}%\n`
  md += `> **Duration Estimate**: ${phase.durationEstimate}\n\n`

  // Status section
  md += `## What's Done ✅\n\n`
  const completedProps = phase.properties.filter((p) => p.status === 'complete')
  if (completedProps.length === 0) {
    md += `- *No features completed yet*\n\n`
  } else {
    for (const prop of completedProps) {
      md += `- **${prop.name}**: ${prop.visionVersion.title || prop.name} (${prop.completionPercent}%)\n`
    }
    md += `\n`
  }

  md += `## What Remains ⏳\n\n`
  const incompleteProps = phase.properties.filter((p) => p.status !== 'complete')
  if (incompleteProps.length === 0) {
    md += `- *All features complete!*\n\n`
  } else {
    for (const prop of incompleteProps) {
      md += `- **${prop.name}**: ${prop.visionVersion.title || prop.name}\n`
      for (const missing of prop.missingFeatures) {
        md += `  - ${missing}\n`
      }
    }
    md += `\n`
  }

  // Dependencies
  if (phase.dependencies.length > 0) {
    md += `## Dependencies\n\n`
    for (const dep of phase.dependencies) {
      md += `- Requires ${dep} to be complete\n`
    }
    md += `\n`
  }

  md += `---\n\n`

  // Effect Schema Blueprints section
  md += `## Effect Schema Blueprints\n\n`
  md += `> **For**: \`schema-architect\` agent\n\n`
  md += `The following Effect Schema definitions should be implemented in \`src/domain/models/app/\`.\n\n`

  for (const blueprint of effectSchemas) {
    md += `### ${capitalize(blueprint.propertyName)} Schema\n\n`
    md += `**Location**: \`src/domain/models/app/${blueprint.propertyName}.ts\`\n\n`

    // Imports
    if (blueprint.imports.length > 0) {
      md += `**Imports**:\n`
      md += `\`\`\`typescript\n`
      md += `import { ${blueprint.imports.join(', ')} } from 'effect'\n`
      md += `\`\`\`\n\n`
    }

    // Code
    md += `**Implementation**:\n`
    md += `\`\`\`typescript\n`
    md += blueprint.code
    md += `\`\`\`\n\n`
  }

  md += `---\n\n`

  // E2E User Stories section
  md += `## E2E Test Scenarios\n\n`
  md += `> **For**: \`e2e-red-test-writer\` agent\n\n`
  md += `The following user stories should be implemented as Playwright tests in \`tests/app/\`.\n\n`

  for (const stories of userStories) {
    md += `### ${capitalize(stories.propertyName)} - Test Scenarios\n\n`
    md += `**Test File**: \`tests/app/${kebabCase(stories.propertyName)}.spec.ts\`\n\n`

    // @spec stories
    if (stories.spec.length > 0) {
      md += `#### @spec User Stories (Granular Behaviors)\n\n`
      md += `These tests define specific acceptance criteria. Each test validates ONE behavior.\n\n`

      for (const [index, story] of stories.spec.entries()) {
        md += `**Scenario ${index + 1}**: Validation Test\n`
        md += `- **GIVEN**: ${story.given}\n`
        md += `- **WHEN**: ${story.when}\n`
        md += `- **THEN**: ${story.then}\n`
        md += `- **Tag**: \`${story.tag}\`\n\n`
      }
    }

    // @regression story
    if (stories.regression.length > 0) {
      md += `#### @regression User Story (Complete Workflow)\n\n`
      md += `This test consolidates ALL @spec tests into ONE comprehensive workflow.\n\n`

      for (const story of stories.regression) {
        md += `**Complete Configuration Workflow**:\n`
        md += `- **GIVEN**: ${story.given}\n`
        md += `- **WHEN**: ${story.when}\n`
        md += `- **THEN**: ${story.then}\n`
        md += `- **Tag**: \`${story.tag}\`\n\n`
      }
    }

    // @critical story
    if (stories.critical.length > 0) {
      md += `#### @critical User Story (Essential Path)\n\n`
      md += `This test validates the MINIMAL essential path for this feature.\n\n`

      for (const story of stories.critical) {
        md += `**Essential Feature Validation**:\n`
        md += `- **GIVEN**: ${story.given}\n`
        md += `- **WHEN**: ${story.when}\n`
        md += `- **THEN**: ${story.then}\n`
        md += `- **Tag**: \`${story.tag}\`\n\n`
      }
    }

    // data-testid patterns
    if (stories.dataTestIds.length > 0) {
      md += `#### data-testid Patterns\n\n`
      md += `Use these standardized test IDs for reliable selectors:\n\n`

      for (const testId of stories.dataTestIds) {
        md += `- \`[data-testid="${testId}"]\`\n`
      }
      md += `\n`
    }
  }

  md += `---\n\n`

  // Success criteria
  md += `## Definition of Done\n\n`
  md += `This phase is complete when:\n\n`

  for (const criterion of successCriteria) {
    md += `- [ ] ${criterion}\n`
  }

  md += `\n`

  // Blockers
  if (phase.status !== '✅ DONE') {
    md += `**Current Blockers**:\n`
    if (phase.dependencies.length > 0) {
      md += `- ${phase.dependencies.join('\n- ')}\n`
    } else {
      md += `- None (ready to start)\n`
    }
  }

  md += `\n`

  md += `---\n\n`

  // Related documentation
  md += `## Related Documentation\n\n`
  md += `- **Vision Schema**: [\`docs/specifications/specs.schema.json\`](../specs.schema.json)\n`
  md += `- **Current Schema**: [\`schemas/${phase.version.replace('v', '')}/app.schema.json\`](../../schemas/${phase.version.replace('v', '')}/app.schema.json)\n`
  md += `- **Testing Strategy**: [\`docs/architecture/testing-strategy.md\`](../../architecture/testing-strategy.md)\n`
  md += `- **Main Roadmap**: [\`ROADMAP.md\`](../../../ROADMAP.md)\n`

  return md
}

/**
 * Generate success criteria for a phase
 */
export function generateSuccessCriteria(doc: PhaseDocumentation): string[] {
  const { phase, effectSchemas, userStories } = doc

  const criteria: string[] = []

  // Schema implementation criteria
  const totalSchemas = effectSchemas.length
  criteria.push(`All Effect Schema properties implemented (current: 0/${totalSchemas})`)

  // E2E test criteria
  const totalSpecTests = userStories.reduce((sum, s) => sum + s.spec.length, 0)
  const totalRegressionTests = userStories.reduce((sum, s) => sum + s.regression.length, 0)
  const totalCriticalTests = userStories.reduce((sum, s) => sum + s.critical.length, 0)

  criteria.push(`All @spec E2E tests passing (current: 0/${totalSpecTests})`)
  criteria.push(`All @regression E2E tests passing (current: 0/${totalRegressionTests})`)

  if (totalCriticalTests > 0) {
    criteria.push(`All @critical E2E tests passing (current: 0/${totalCriticalTests})`)
  }

  // Code quality criteria
  criteria.push(`Unit test coverage >80% (current: 0%)`)
  criteria.push(`All TypeScript strict mode checks passing`)
  criteria.push(`All ESLint checks passing`)
  criteria.push(`All Prettier formatting checks passing`)

  // Schema export criteria
  criteria.push(`JSON schema export updated via \`bun run export:schema\``)

  // Version bump criteria
  criteria.push(`Version bumped to ${phase.version}`)

  return criteria
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
