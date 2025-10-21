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

import { join } from 'node:path'
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

// Get project root (assuming script is in scripts/ subdirectory)
const PROJECT_ROOT = join(import.meta.dir, '..')

// Paths (converted to absolute paths for $ref resolution)
const GOAL_APP_SCHEMA_PATH = join(PROJECT_ROOT, 'specs/app/app.schema.json')
const CURRENT_APP_SCHEMA_PATH = join(PROJECT_ROOT, 'schemas/0.0.1/app.schema.json')
const GOAL_API_SCHEMA_PATH = join(PROJECT_ROOT, 'specs/api/app.openapi.json')
const CURRENT_API_SCHEMA_PATH = join(PROJECT_ROOT, 'schemas/0.0.1/app.openapi.json')
const SPECS_DIR = join(PROJECT_ROOT, 'specs')
const ROADMAP_OUTPUT_PATH = join(PROJECT_ROOT, 'ROADMAP.md')
const APP_ROADMAP_OUTPUT_PATH = join(PROJECT_ROOT, 'specs/app/ROADMAP.md')
const API_ROADMAP_OUTPUT_PATH = join(PROJECT_ROOT, 'specs/api/ROADMAP.md')
const ADMIN_ROADMAP_OUTPUT_PATH = join(PROJECT_ROOT, 'specs/admin/ROADMAP.md')

/**
 * Run prerequisite commands to ensure schemas and specs are valid
 */
async function runPrerequisiteChecks(): Promise<boolean> {
  console.log('🔍 Running prerequisite checks...\n')

  const checks = [
    {
      name: 'Validate Admin Specs',
      command: ['bun', 'run', 'validate:admin-specs'],
    },
    {
      name: 'Validate API Specs',
      command: ['bun', 'run', 'validate:api-specs'],
    },
    {
      name: 'Validate App Specs',
      command: ['bun', 'run', 'validate:app-specs'],
    },
    {
      name: 'Export App Schema',
      command: ['bun', 'run', 'export:schema'],
    },
    {
      name: 'Export OpenAPI Schema',
      command: ['bun', 'run', 'export:openapi'],
    },
  ]

  let allPassed = true

  for (const check of checks) {
    console.log(`   🔄 ${check.name}...`)

    try {
      const proc = Bun.spawn(check.command, {
        stdout: 'pipe',
        stderr: 'pipe',
      })

      const exitCode = await proc.exited

      if (exitCode !== 0) {
        const stderr = await new Response(proc.stderr).text()
        console.error(`   ❌ ${check.name} failed`)
        console.error(`      ${stderr.split('\n').slice(0, 5).join('\n      ')}`)
        console.error(`      Run command manually to see full error: ${check.command.join(' ')}\n`)
        allPassed = false
      } else {
        console.log(`   ✅ ${check.name} passed`)
      }
    } catch (error) {
      console.error(`   ❌ ${check.name} failed: ${error}`)
      allPassed = false
    }
  }

  console.log('')

  if (!allPassed) {
    console.error(
      '❌ Prerequisite checks failed. Please fix the errors before generating the roadmap.\n'
    )
    return false
  }

  console.log('✅ All prerequisite checks passed\n')
  return true
}

/**
 * Main execution
 */
async function main() {
  console.log('📊 Generating Roadmap...\n')

  // 0. Run prerequisite checks
  const checksPass = await runPrerequisiteChecks()
  if (!checksPass) {
    console.error('❌ Roadmap generation aborted due to failing prerequisite checks')
    process.exit(1)
  }

  // 1. Analyze App Schema
  console.log('1️⃣  Analyzing App Schema...')
  const appSchemaProgress = await compareAppSchemas(GOAL_APP_SCHEMA_PATH, CURRENT_APP_SCHEMA_PATH)
  console.log(`   Goal: ${GOAL_APP_SCHEMA_PATH} (${appSchemaProgress.totalProperties} properties)`)
  console.log(
    `   Current: ${CURRENT_APP_SCHEMA_PATH} (${appSchemaProgress.currentTotalProperties} properties)`
  )
  console.log(
    `   Implemented: ${appSchemaProgress.implementedProperties}/${appSchemaProgress.totalProperties} properties matching goal (${appSchemaProgress.completionPercent}%)\n`
  )

  // 2. Analyze API Schema
  console.log('2️⃣  Analyzing API Schema...')
  const apiSchemaProgress = await compareApiSchemas(GOAL_API_SCHEMA_PATH, CURRENT_API_SCHEMA_PATH)
  console.log(`   Goal: ${GOAL_API_SCHEMA_PATH} (${apiSchemaProgress.totalEndpoints} endpoints)`)
  console.log(
    `   Current: ${CURRENT_API_SCHEMA_PATH} (${apiSchemaProgress.currentTotalEndpoints} endpoints)`
  )
  console.log(
    `   Implemented: ${apiSchemaProgress.implementedEndpoints}/${apiSchemaProgress.totalEndpoints} endpoints matching goal (${apiSchemaProgress.completionPercent}%)\n`
  )

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
