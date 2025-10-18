#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

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

import { existsSync as _existsSync } from 'node:fs'
import { dirname } from 'node:path'
import { generateRoadmapMarkdown } from './templates/roadmap-template'
import { getImplementationStatus } from './utils/implementation-checker'
import {
  calculateStats,
  compareSchemas,
  extractAllPropertiesRecursively,
} from './utils/schema-comparison'
import { resolveSchemaRefs, countAllProperties } from './utils/schema-resolver'
import { scanAllTests, matchUserStoryToTest } from './utils/test-scanner'
import { extractAllUserStories, calculateUserStoryStats } from './utils/user-story-extractor'
import type { JSONSchema, RoadmapData, TrackedUserStory } from './types/roadmap'

// Paths
const CURRENT_SCHEMA_PATH = 'schemas/0.0.1/app.schema.json'
const VISION_SCHEMA_PATH = 'docs/specifications/specs.schema.json'
const ROADMAP_OUTPUT_PATH = 'ROADMAP.md'
const TESTS_DIR = 'tests'

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
  let visionSchema = await loadSchema(VISION_SCHEMA_PATH)

  // Resolve $ref in vision schema to load all nested schemas
  console.log(`📚 Resolving $ref in vision schema...`)
  const visionSchemaDir = dirname(VISION_SCHEMA_PATH)
  visionSchema = (await resolveSchemaRefs(visionSchema, visionSchemaDir)) as JSONSchema
  const totalPropertiesInVision = countAllProperties(visionSchema)
  console.log(`   Resolved all $ref, found ~${totalPropertiesInVision} total properties`)
  console.log()

  // Compare schemas (top-level for main ROADMAP.md)
  const topLevelProperties = compareSchemas(currentSchema, visionSchema)

  // Extract ALL properties recursively (including nested ones)
  const allProperties = extractAllPropertiesRecursively(currentSchema, visionSchema)

  // Extract ALL user stories from vision schema
  console.log(`📖 Extracting user stories from schema...`)
  const userStories = extractAllUserStories(visionSchema)
  const userStoryStats = calculateUserStoryStats(userStories)
  console.log(`   Found ${userStoryStats.totalStories} user stories`)
  console.log(`   Across ${userStoryStats.propertiesWithStories} properties`)
  console.log()

  // Scan all test files
  console.log(`🧪 Scanning test files...`)
  const testScanResult = scanAllTests(TESTS_DIR)
  console.log(`   Found ${testScanResult.totalTests} implemented tests`)
  console.log(
    `   @spec: ${testScanResult.testsByTag.get('@spec') || 0}, @regression: ${testScanResult.testsByTag.get('@regression') || 0}, @critical: ${testScanResult.testsByTag.get('@critical') || 0}`
  )
  console.log()

  // Match user stories to tests
  console.log(`🔗 Matching user stories to tests...`)
  const trackedUserStories: TrackedUserStory[] = []
  let matchedCount = 0

  for (const story of userStories) {
    let bestMatch: TrackedUserStory = {
      propertyPath: story.propertyPath,
      story: story.story,
      index: story.index,
      implemented: false,
    }

    // Try to find matching test
    for (const test of testScanResult.tests) {
      const matchResult = matchUserStoryToTest(story.story, test)
      if (matchResult.matched) {
        bestMatch = {
          ...bestMatch,
          implemented: true,
          matchedTest: {
            filePath: test.filePath,
            testName: test.testName,
            tag: test.tag,
            confidence: matchResult.confidence,
          },
        }
        matchedCount++
        break
      }
    }

    trackedUserStories.push(bestMatch)
  }

  console.log(
    `   Matched ${matchedCount} user stories to tests (${Math.round((matchedCount / userStories.length) * 100)}%)`
  )
  console.log()

  // Calculate statistics (use all properties including nested for accurate progress)
  const stats = calculateStats(allProperties, 'v0.0.1', 'v1.0.0', trackedUserStories)

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
    userStories: trackedUserStories,
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
  console.log(`   - Schema Completion: ${stats.overallCompletion}%`)
  console.log()
  console.log(`   - Total User Stories: ${stats.totalUserStories}`)
  console.log(`   - Implemented Stories: ${stats.implementedUserStories}`)
  console.log(`   - Test Coverage: ${stats.testCoverage}%`)
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
