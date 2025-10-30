#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * TDD Duplicate Issue Detector
 *
 * Scans GitHub issues with tdd-spec label and reports any duplicate spec IDs
 * Run periodically to monitor duplicate prevention effectiveness
 */

import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import {
  CommandService,
  CommandServiceLive,
  LoggerServicePretty,
  logInfo,
  logError,
  success,
} from '../lib/effect'

/**
 * Detect duplicate spec issues in GitHub
 */
const detectDuplicates = Effect.gen(function* () {
  const cmd = yield* CommandService

  yield* logInfo('Scanning for duplicate spec issues...', '🔍')

  // Fetch ALL spec issues (open + closed)
  const output = yield* cmd
    .exec('gh issue list --label "tdd-spec" --state all --json number,title,state --limit 2000', {
      throwOnError: false,
    })
    .pipe(
      Effect.catchAll(() => {
        return Effect.gen(function* () {
          yield* logError('Failed to fetch spec issues')
          return '[]'
        })
      })
    )

  try {
    const issues = JSON.parse(output) as Array<{
      number: number
      title: string
      state: string
    }>

    yield* logInfo(`  Fetched ${issues.length} issues with tdd-spec label`, '📊')

    // Group issues by spec ID
    const specIdToIssues = new Map<string, Array<{ number: number; state: string }>>()

    for (const issue of issues) {
      const specIdMatch = issue.title.match(/🤖\s+([A-Z]+-[A-Z-]+-\d{3}):/)
      const specId = specIdMatch?.[1]

      if (specId) {
        const existing = specIdToIssues.get(specId) || []
        existing.push({ number: issue.number, state: issue.state })
        specIdToIssues.set(specId, existing)
      }
    }

    // Find duplicates
    const duplicates: Array<{
      specId: string
      issues: Array<{ number: number; state: string }>
    }> = []

    for (const [specId, issueList] of specIdToIssues.entries()) {
      if (issueList.length > 1) {
        duplicates.push({ specId, issues: issueList })
      }
    }

    // Report results
    yield* logInfo('')
    if (duplicates.length === 0) {
      yield* success('✅ No duplicate issues found!')
      yield* logInfo(`  Total unique specs: ${specIdToIssues.size}`)
    } else {
      yield* logError(`❌ Found ${duplicates.length} spec(s) with duplicate issues:`)
      yield* logInfo('')

      for (const dup of duplicates) {
        console.log(`  Spec ID: ${dup.specId}`)
        for (const issue of dup.issues) {
          console.log(`    - Issue #${issue.number} (${issue.state})`)
        }
        console.log('')
      }

      yield* logInfo('Recommended action:')
      yield* logInfo('  1. Manually close duplicate issues (keep the oldest or most active one)')
      yield* logInfo('  2. Investigate what caused the duplicates')
      yield* logInfo('  3. Review populate workflow logs around duplicate creation time')
    }

    // Warning if approaching limit
    if (issues.length >= 1900) {
      yield* logError('')
      yield* logError(`⚠️  WARNING: Approaching GitHub API limit (${issues.length}/2000)`)
      yield* logError('   Older issues may not be visible, increasing duplicate risk')
    }
  } catch (error) {
    yield* logError(`Failed to parse GitHub response: ${error}`)
  }
})

// Main layer
const MainLayer = Layer.mergeAll(CommandServiceLive, LoggerServicePretty())

// Run
const program = detectDuplicates.pipe(
  Effect.provide(MainLayer),
  Effect.catchAll((error) =>
    Effect.gen(function* () {
      console.error('❌ Error:', error)
      yield* Effect.fail(error)
    })
  )
)

Effect.runPromise(program).catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
