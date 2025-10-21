#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Roadmap Generation Script (Rewritten)
 *
 * Generates ROADMAP.md based on three progress metrics:
 * 1. App Schema Progress - Diff between goal and current schemas
 * 2. API Schema Progress - Diff between goal and current OpenAPI specs
 * 3. Test Implementation Status - Categorize specs as TODO/WIP/DONE
 *
 * Usage: bun run scripts/generate-roadmap.ts
 */

import {
  generateSummaryRoadmap,
  generateAppRoadmap,
  generateApiRoadmap,
  generateAdminRoadmap,
} from './templates/new-roadmap-template'
import { compareApiSchemas } from './utils/api-schema-diff'
import { compareAppSchemas } from './utils/app-schema-diff'
import { analyzeTestImplementation } from './utils/spec-analyzer'
import type { NewRoadmapData } from './types/roadmap'

// Paths
const GOAL_APP_SCHEMA_PATH = 'specs/app/app.schema.json'
const CURRENT_APP_SCHEMA_PATH = 'schemas/0.0.1/app.schema.json'
const GOAL_API_SCHEMA_PATH = 'specs/api/app.openapi.json'
const CURRENT_API_SCHEMA_PATH = 'schemas/0.0.1/app.openapi.json'
const SPECS_DIR = 'specs'
const ROADMAP_OUTPUT_PATH = 'ROADMAP.md'
const APP_ROADMAP_OUTPUT_PATH = 'specs/app/ROADMAP.md'
const API_ROADMAP_OUTPUT_PATH = 'specs/api/ROADMAP.md'
const ADMIN_ROADMAP_OUTPUT_PATH = 'specs/admin/ROADMAP.md'

/**
 * Main execution
 */
async function main() {
  console.log('📊 Generating Roadmap...\n')

  // 1. Analyze App Schema
  console.log('1️⃣  Analyzing App Schema...')
  const appSchemaProgress = await compareAppSchemas(GOAL_APP_SCHEMA_PATH, CURRENT_APP_SCHEMA_PATH)
  console.log(`   Goal: ${GOAL_APP_SCHEMA_PATH} (${appSchemaProgress.totalProperties} properties)`)
  console.log(
    `   Current: ${CURRENT_APP_SCHEMA_PATH} (${appSchemaProgress.implementedProperties} properties)`
  )
  console.log(`   Progress: ${appSchemaProgress.completionPercent}% complete\n`)

  // 2. Analyze API Schema
  console.log('2️⃣  Analyzing API Schema...')
  const apiSchemaProgress = await compareApiSchemas(GOAL_API_SCHEMA_PATH, CURRENT_API_SCHEMA_PATH)
  console.log(`   Goal: ${GOAL_API_SCHEMA_PATH} (${apiSchemaProgress.totalEndpoints} endpoints)`)
  console.log(
    `   Current: ${CURRENT_API_SCHEMA_PATH} (${apiSchemaProgress.implementedEndpoints} endpoints)`
  )
  console.log(`   Progress: ${apiSchemaProgress.completionPercent}% complete\n`)

  // 3. Analyze Test Implementation
  console.log('3️⃣  Analyzing Test Implementation...')
  const testStatus = await analyzeTestImplementation(SPECS_DIR)
  console.log(`   Found ${testStatus.totalSpecs} specs across all files`)
  console.log(`   Categorizing specs...`)
  console.log(`   ✅ DONE: ${testStatus.doneSpecs} specs (${testStatus.donePercent}%)`)
  console.log(`   🚧 WIP: ${testStatus.wipSpecs} specs (${testStatus.wipPercent}%)`)
  console.log(`   ⏳ TODO: ${testStatus.todoSpecs} specs (${testStatus.todoPercent}%)\n`)

  // 4. Calculate Overall Progress
  const overallProgress = calculateOverallProgress(appSchemaProgress, apiSchemaProgress, testStatus)
  console.log(`📈 Overall Progress: ${overallProgress.completionPercent}%\n`)

  // 5. Generate Roadmap Data
  const roadmapData: NewRoadmapData = {
    appSchema: appSchemaProgress,
    apiSchema: apiSchemaProgress,
    testStatus,
    overall: overallProgress,
    timestamp: new Date().toISOString().split('T')[0]!,
  }

  // 6. Generate All Roadmap Files
  console.log('📝 Generating roadmap files...')

  // 6a. Main summary roadmap
  const summaryRoadmap = generateSummaryRoadmap(roadmapData)
  await Bun.write(ROADMAP_OUTPUT_PATH, summaryRoadmap)
  console.log(`   ✅ ${ROADMAP_OUTPUT_PATH}`)

  // 6b. Detailed app roadmap
  const appRoadmap = generateAppRoadmap(roadmapData)
  await Bun.write(APP_ROADMAP_OUTPUT_PATH, appRoadmap)
  console.log(`   ✅ ${APP_ROADMAP_OUTPUT_PATH}`)

  // 6c. Detailed API roadmap
  const apiRoadmap = generateApiRoadmap(roadmapData)
  await Bun.write(API_ROADMAP_OUTPUT_PATH, apiRoadmap)
  console.log(`   ✅ ${API_ROADMAP_OUTPUT_PATH}`)

  // 6d. Detailed Admin roadmap
  const adminRoadmap = generateAdminRoadmap(roadmapData)
  await Bun.write(ADMIN_ROADMAP_OUTPUT_PATH, adminRoadmap)
  console.log(`   ✅ ${ADMIN_ROADMAP_OUTPUT_PATH}\n`)

  // 7. Display progress bar
  const progressBar = generateProgressBar(overallProgress.completionPercent)
  console.log(`Overall Progress: ${progressBar}\n`)

  // 8. Summary
  console.log('📋 Summary:')
  console.log(`   - App Schema: ${appSchemaProgress.completionPercent}%`)
  console.log(`   - API Schema: ${apiSchemaProgress.completionPercent}%`)
  console.log(`   - Test Implementation: ${testStatus.donePercent}%`)
  console.log(`   - Overall: ${overallProgress.completionPercent}%\n`)

  console.log('🎉 All roadmaps generated successfully!')
}

/**
 * Calculate overall progress from all three metrics
 */
function calculateOverallProgress(
  appSchema: { completionPercent: number },
  apiSchema: { completionPercent: number },
  testStatus: { donePercent: number }
): { completionPercent: number } {
  // Weight all three metrics equally
  const overall = Math.round(
    (appSchema.completionPercent + apiSchema.completionPercent + testStatus.donePercent) / 3
  )

  return {
    completionPercent: overall,
  }
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
