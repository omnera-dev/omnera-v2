#!/usr/bin/env bun

/**
 * Roadmap Generation Script
 *
 * Analyzes schema differences between current and vision schemas,
 * generates ROADMAP.md with progress tracking for all properties.
 *
 * Detailed specifications (What/Why/Who-When) are maintained in
 * docs/specifications/specs.schema.json using the Triple-Documentation Pattern:
 * - description, examples (What)
 * - x-business-rules (Why)
 * - x-user-stories (Who/When)
 *
 * Usage: bun run scripts/generate-roadmap.ts
 */

import { existsSync } from 'node:fs'
import { generateRoadmapMarkdown } from './templates/roadmap-template.ts'
import { getImplementationStatus } from './utils/implementation-checker.ts'
import {
  calculateStats,
  compareSchemas,
  extractAllPropertiesRecursively,
} from './utils/schema-comparison.ts'
import type { JSONSchema, RoadmapData } from './types/roadmap.ts'

// Paths
const CURRENT_SCHEMA_PATH = 'schemas/0.0.1/app.schema.json'
const VISION_SCHEMA_PATH = 'docs/specifications/specs.schema.json'
const ROADMAP_OUTPUT_PATH = 'ROADMAP.md'

/**
 * Main execution
 */
async function main() {
  console.log('📊 Analyzing schemas...')
  console.log(`   Current: ${CURRENT_SCHEMA_PATH}`)
  console.log(`   Vision:  ${VISION_SCHEMA_PATH}`)
  console.log()

  // Load schemas
  const currentSchema = await loadSchema(CURRENT_SCHEMA_PATH)
  const visionSchema = await loadSchema(VISION_SCHEMA_PATH)

  // Compare schemas (top-level for main ROADMAP.md)
  const topLevelProperties = compareSchemas(currentSchema, visionSchema)

  // Extract ALL properties recursively (including nested ones)
  const allProperties = extractAllPropertiesRecursively(currentSchema, visionSchema)

  // Calculate statistics (use all properties including nested for accurate progress)
  const stats = calculateStats(allProperties, 'v0.0.1', 'v1.0.0')

  console.log(
    `✅ Found ${stats.implementedProperties} implemented properties (${Math.round((stats.implementedProperties / stats.totalProperties) * 100)}%)`
  )
  console.log(
    `⏳ Found ${stats.missingProperties} missing properties (${Math.round((stats.missingProperties / stats.totalProperties) * 100)}%)`
  )
  console.log(
    `🚧 Found ${stats.partialProperties} partial properties (${Math.round((stats.partialProperties / stats.totalProperties) * 100)}%)`
  )
  console.log()

  // Check implementation status for ALL properties (including nested)
  console.log(`🔍 Checking implementation status...`)
  for (const property of allProperties) {
    property.implementationStatus = getImplementationStatus(property.name)
  }
  console.log()

  // List properties by status
  console.log(`📋 Generating ROADMAP.md...`)
  for (const prop of topLevelProperties) {
    let statusIcon: string
    if (prop.status === 'complete') {
      statusIcon = '✅'
    } else if (prop.status === 'partial') {
      statusIcon = '🚧'
    } else {
      statusIcon = '⏳'
    }
    console.log(`   ${statusIcon} ${prop.name} (${prop.completionPercent}%)`)
  }
  console.log()

  console.log(`📊 Total properties (including nested): ${allProperties.length}`)
  console.log()

  // Generate main ROADMAP.md
  const roadmapData: RoadmapData = {
    stats,
    properties: topLevelProperties,
    allProperties,
    timestamp: new Date().toISOString().split('T')[0]!,
  }

  const roadmapMarkdown = generateRoadmapMarkdown(roadmapData)
  await Bun.write(ROADMAP_OUTPUT_PATH, roadmapMarkdown)
  console.log(`✅ Created ${ROADMAP_OUTPUT_PATH}`)
  console.log()
  console.log(`✅ Roadmap generation complete!`)
  console.log()

  // Display progress bar
  const progressBar = generateProgressBar(stats.overallCompletion)
  console.log(`Overall Progress: ${progressBar}`)
  console.log()

  // Summary
  console.log(`📈 Summary:`)
  console.log(`   - Total Properties: ${stats.totalProperties}`)
  console.log(`   - Implemented: ${stats.implementedProperties}`)
  console.log(`   - Missing: ${stats.missingProperties}`)
  console.log(`   - Completion: ${stats.overallCompletion}%`)
  console.log()

  // Next steps
  const nextProperty = topLevelProperties.find((p) => p.status === 'missing')
  if (nextProperty) {
    console.log(`📋 Next Steps:`)
    console.log(`   Work on: ${nextProperty.name}`)
    console.log(`   Read: docs/specifications/specs.schema.json (properties.${nextProperty.name})`)
    console.log(`   Complexity: ${nextProperty.complexity} points`)
  }
}

/**
 * Load JSON Schema from file
 */
async function loadSchema(path: string): Promise<JSONSchema> {
  const file = Bun.file(path)

  if (!(await file.exists())) {
    throw new Error(`Schema file not found: ${path}`)
  }

  const content = await file.json()

  // Validate basic structure
  if (!content.properties) {
    throw new Error(`Invalid schema: missing 'properties' field in ${path}`)
  }

  return content as JSONSchema
}

/**
 * Generate progress bar for console output
 */
function generateProgressBar(percent: number, width: number = 30): string {
  const filled = Math.round((percent / 100) * width)
  const empty = width - filled
  return `${'█'.repeat(filled)}${'░'.repeat(empty)} ${percent}%`
}

// Run main function
main().catch((error) => {
  console.error('❌ Error generating roadmap:', error)
  process.exit(1)
})
