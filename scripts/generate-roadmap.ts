#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Roadmap Generation Script (Rewritten with Effect)
 *
 * Generates ROADMAP.md based on three progress metrics:
 * 1. App Schema Progress - Diff between goal and current schemas
 * 2. API Schema Progress - Diff between goal and current OpenAPI specs
 * 3. Test Implementation Status - Categorize specs as TODO/WIP/DONE
 *
 * Usage: bun run scripts/generate-roadmap.ts
 */

import { join } from 'node:path'
import * as Data from 'effect/Data'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import {
  FileSystemService,
  FileSystemServiceLive,
  CommandService,
  CommandServiceLive,
  LoggerServiceLive,
  progress,
  success,
  logError,
  section,
} from './lib/effect'
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

/**
 * Roadmap generation failed error
 */
class RoadmapGenerationFailedError extends Data.TaggedError('RoadmapGenerationFailedError')<{
  readonly reason: string
}> {}

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
 * Prerequisite check definition
 */
interface PrerequisiteCheck {
  readonly name: string
  readonly command: readonly string[]
}

/**
 * Run a single prerequisite check
 */
const runPrerequisiteCheck = (check: PrerequisiteCheck) =>
  Effect.gen(function* () {
    const cmd = yield* CommandService

    yield* progress(`${check.name}...`)

    const result = yield* cmd.spawn(check.command, { timeout: 120_000, throwOnError: false })

    if (result.exitCode !== 0) {
      const errorPreview = result.stderr.split('\n').slice(0, 5).join('\n      ')
      yield* logError(`${check.name} failed`)
      yield* Effect.log(`      ${errorPreview}`)
      yield* Effect.log(`      Run command manually: ${check.command.join(' ')}`)
      return false
    }

    yield* success(`${check.name} passed`)
    return true
  })

/**
 * Run all prerequisite checks sequentially
 */
const runPrerequisiteChecks = Effect.gen(function* () {
  yield* section('Running prerequisite checks')

  const checks: readonly PrerequisiteCheck[] = [
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

  // Run checks sequentially and collect results
  const results: boolean[] = []
  for (const check of checks) {
    const result = yield* runPrerequisiteCheck(check)
    results.push(result)
  }

  const allPassed = results.every((r) => r)

  yield* Effect.log('')

  if (!allPassed) {
    yield* logError('Prerequisite checks failed. Please fix the errors before generating roadmap.')
    return yield* Effect.fail(
      new RoadmapGenerationFailedError({ reason: 'Prerequisite checks failed' })
    )
  }

  yield* success('All prerequisite checks passed')
  yield* Effect.log('')

  return true
})

/**
 * Analyze app schema progress
 */
const analyzeAppSchema = Effect.gen(function* () {
  yield* Effect.log('1️⃣  Analyzing App Schema...')

  const appSchemaProgress = yield* Effect.promise(() =>
    compareAppSchemas(GOAL_APP_SCHEMA_PATH, CURRENT_APP_SCHEMA_PATH)
  )

  yield* Effect.log(
    `   Goal: ${GOAL_APP_SCHEMA_PATH} (${appSchemaProgress.totalProperties} properties)`
  )
  yield* Effect.log(
    `   Current: ${CURRENT_APP_SCHEMA_PATH} (${appSchemaProgress.currentTotalProperties} properties)`
  )
  yield* Effect.log(
    `   Implemented: ${appSchemaProgress.implementedProperties}/${appSchemaProgress.totalProperties} properties matching goal (${appSchemaProgress.completionPercent}%)`
  )
  yield* Effect.log('')

  return appSchemaProgress
})

/**
 * Analyze API schema progress
 */
const analyzeApiSchema = Effect.gen(function* () {
  yield* Effect.log('2️⃣  Analyzing API Schema...')

  const apiSchemaProgress = yield* Effect.promise(() =>
    compareApiSchemas(GOAL_API_SCHEMA_PATH, CURRENT_API_SCHEMA_PATH)
  )

  yield* Effect.log(
    `   Goal: ${GOAL_API_SCHEMA_PATH} (${apiSchemaProgress.totalEndpoints} endpoints)`
  )
  yield* Effect.log(
    `   Current: ${CURRENT_API_SCHEMA_PATH} (${apiSchemaProgress.currentTotalEndpoints} endpoints)`
  )
  yield* Effect.log(
    `   Implemented: ${apiSchemaProgress.implementedEndpoints}/${apiSchemaProgress.totalEndpoints} endpoints matching goal (${apiSchemaProgress.completionPercent}%)`
  )
  yield* Effect.log('')

  return apiSchemaProgress
})

/**
 * Analyze test implementation status
 */
const analyzeTestStatus = Effect.gen(function* () {
  yield* Effect.log('3️⃣  Analyzing Test Implementation...')

  const testStatus = yield* Effect.promise(() => analyzeTestImplementation(SPECS_DIR))

  yield* Effect.log(`   Found ${testStatus.totalSpecs} specs across all files`)
  yield* Effect.log(`   Categorizing specs...`)
  yield* Effect.log(`   ✅ DONE: ${testStatus.doneSpecs} specs (${testStatus.donePercent}%)`)
  yield* Effect.log(`   🚧 WIP: ${testStatus.wipSpecs} specs (${testStatus.wipPercent}%)`)
  yield* Effect.log(`   ⏳ TODO: ${testStatus.todoSpecs} specs (${testStatus.todoPercent}%)`)
  yield* Effect.log('')

  return testStatus
})

/**
 * Calculate overall progress from all three metrics
 */
const calculateOverallProgress = (
  appSchema: { completionPercent: number },
  apiSchema: { completionPercent: number },
  testStatus: { donePercent: number }
): { completionPercent: number } => {
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
const generateProgressBar = (percent: number, width: number = 30): string => {
  const filled = Math.round((percent / 100) * width)
  const empty = width - filled
  return `${'█'.repeat(filled)}${'░'.repeat(empty)} ${percent}%`
}

/**
 * Write roadmap file with formatting
 */
const writeRoadmap = (path: string, content: string) =>
  Effect.gen(function* () {
    const fs = yield* FileSystemService
    yield* fs.writeFormatted(path, content, { parser: 'markdown' })
    yield* success(path)
  })

/**
 * Main roadmap generation program
 */
const main = Effect.gen(function* () {
  yield* section('Generating Roadmap')

  // 0. Run prerequisite checks
  yield* runPrerequisiteChecks

  // 1-3. Run schema and test analysis in parallel
  const [appSchemaProgress, apiSchemaProgress, testStatus] = yield* Effect.all(
    [analyzeAppSchema, analyzeApiSchema, analyzeTestStatus],
    { concurrency: 'unbounded' }
  )

  // 4. Calculate Overall Progress
  const overallProgress = calculateOverallProgress(appSchemaProgress, apiSchemaProgress, testStatus)
  yield* Effect.log(`📈 Overall Progress: ${overallProgress.completionPercent}%`)
  yield* Effect.log('')

  // 5. Generate Roadmap Data
  const roadmapData: NewRoadmapData = {
    appSchema: appSchemaProgress,
    apiSchema: apiSchemaProgress,
    testStatus,
    overall: overallProgress,
    timestamp: new Date().toISOString().split('T')[0]!,
  }

  // 6. Generate All Roadmap Files
  yield* Effect.log('📝 Generating roadmap files...')

  // Generate all roadmap content
  const summaryRoadmap = generateSummaryRoadmap(roadmapData)
  const appRoadmap = generateAppRoadmap(roadmapData)
  const apiRoadmap = generateApiRoadmap(roadmapData)
  const adminRoadmap = generateAdminRoadmap(roadmapData)

  // Write all roadmap files in parallel
  yield* Effect.all(
    [
      writeRoadmap(ROADMAP_OUTPUT_PATH, summaryRoadmap),
      writeRoadmap(APP_ROADMAP_OUTPUT_PATH, appRoadmap),
      writeRoadmap(API_ROADMAP_OUTPUT_PATH, apiRoadmap),
      writeRoadmap(ADMIN_ROADMAP_OUTPUT_PATH, adminRoadmap),
    ],
    { concurrency: 'unbounded' }
  )

  yield* Effect.log('')

  // 7. Display progress bar
  const progressBar = generateProgressBar(overallProgress.completionPercent)
  yield* Effect.log(`Overall Progress: ${progressBar}`)
  yield* Effect.log('')

  // 8. Summary
  yield* Effect.log('📋 Summary:')
  yield* Effect.log(`   - App Schema: ${appSchemaProgress.completionPercent}%`)
  yield* Effect.log(`   - API Schema: ${apiSchemaProgress.completionPercent}%`)
  yield* Effect.log(`   - Test Implementation: ${testStatus.donePercent}%`)
  yield* Effect.log(`   - Overall: ${overallProgress.completionPercent}%`)
  yield* Effect.log('')

  yield* success('All roadmaps generated successfully!')
})

// Main layer combining all services
const MainLayer = Layer.mergeAll(FileSystemServiceLive, CommandServiceLive, LoggerServiceLive())

// Run the script
const program = main.pipe(Effect.provide(MainLayer))

Effect.runPromise(program)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error generating roadmap:', error)
    process.exit(1)
  })
