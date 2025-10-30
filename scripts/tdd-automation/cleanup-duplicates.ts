#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * TDD Duplicate Issue Cleanup Script
 *
 * Automatically closes older duplicate spec issues, keeping the newest one
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
  progress,
} from '../lib/effect'

interface DuplicateGroup {
  specId: string
  issues: Array<{ number: number; state: string }>
}

/**
 * Find all duplicate spec issues
 */
const findDuplicates = Effect.gen(function* () {
  const cmd = yield* CommandService

  yield* progress('Fetching open spec issues...')

  const output = yield* cmd
    .exec(
      'gh issue list --label "tdd-automation" --state open --json number,title,state --limit 2000',
      {
        throwOnError: false,
      }
    )
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

    yield* logInfo(`  Fetched ${issues.length} issues`)

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
    const duplicates: DuplicateGroup[] = []

    for (const [specId, issueList] of specIdToIssues.entries()) {
      if (issueList.length > 1) {
        // Sort by issue number (higher = newer)
        issueList.sort((a, b) => b.number - a.number)
        duplicates.push({ specId, issues: issueList })
      }
    }

    return duplicates
  } catch (error) {
    yield* logError(`Failed to parse GitHub response: ${error}`)
    return []
  }
})

/**
 * Close older duplicate issues
 */
const closeDuplicates = (duplicates: DuplicateGroup[], dryRun: boolean) =>
  Effect.gen(function* () {
    const cmd = yield* CommandService

    yield* logInfo('')
    yield* logInfo(`Found ${duplicates.length} specs with duplicates`, '📊')

    // Count how many issues need closing (all issues should be OPEN since we only fetch open issues)
    let totalToClose = 0
    let alreadyClosed = 0
    for (const dup of duplicates) {
      for (let i = 1; i < dup.issues.length; i++) {
        if (dup.issues[i]?.state === 'OPEN') {
          totalToClose++
        } else {
          alreadyClosed++
        }
      }
    }

    yield* logInfo(`Total open issues to close: ${totalToClose}`)
    if (alreadyClosed > 0) {
      yield* logInfo(`Already closed issues (skipped): ${alreadyClosed}`)
    }
    yield* logInfo('')

    if (dryRun) {
      yield* logInfo('🔍 DRY RUN MODE - No issues will be closed', '⚠️')
      yield* logInfo('Remove --dry-run flag to actually close issues')
      yield* logInfo('')
    }

    let closed = 0
    let skipped = 0
    let failed = 0

    for (const dup of duplicates) {
      const [newestIssue, ...olderIssues] = dup.issues

      if (!newestIssue) continue

      for (const oldIssue of olderIssues) {
        // Skip if already closed
        if (oldIssue.state !== 'OPEN') {
          if (dryRun) {
            console.log(
              `  Skipping #${oldIssue.number} (${dup.specId}) - already ${oldIssue.state}`
            )
          }
          skipped++
          continue
        }

        if (dryRun) {
          console.log(
            `  Would close #${oldIssue.number} (${dup.specId}) - keeping #${newestIssue.number}`
          )
        } else {
          yield* progress(`Closing #${oldIssue.number} (${dup.specId})...`)

          const result = yield* cmd
            .exec(
              `gh issue close ${oldIssue.number} --reason "not planned" --comment "🤖 **Duplicate Issue**\n\nThis is a duplicate of issue #${newestIssue.number} (keeping the newer one).\n\nThis duplicate was created due to a bug in the TDD queue populate workflow (now fixed). Closing as 'not planned' since the work will be tracked in the newer issue."`,
              { throwOnError: false }
            )
            .pipe(
              Effect.catchAll(() => {
                return Effect.gen(function* () {
                  yield* logError(`Failed to close #${oldIssue.number}`)
                  return ''
                })
              })
            )

          if (result.includes('Closed')) {
            closed++
          } else {
            failed++
          }
        }
      }
    }

    yield* logInfo('')
    if (dryRun) {
      yield* success(`Dry run completed - ${totalToClose} issues would be closed`)
      if (skipped > 0) {
        yield* logInfo(`${skipped} issues already closed (skipped)`)
      }
    } else {
      yield* success(`Closed ${closed} duplicate issues`)
      if (skipped > 0) {
        yield* logInfo(`Skipped ${skipped} already closed issues`)
      }
      if (failed > 0) {
        yield* logError(`Failed to close ${failed} issues`)
      }
    }
  })

/**
 * Main CLI
 */
const main = Effect.gen(function* () {
  const dryRun = process.argv.includes('--dry-run')

  yield* logInfo('TDD Duplicate Issue Cleanup', '🧹')
  yield* logInfo('')

  const duplicates = yield* findDuplicates

  if (duplicates.length === 0) {
    yield* success('No duplicates found!')
    return
  }

  yield* closeDuplicates(duplicates, dryRun)
})

// Main layer
const MainLayer = Layer.mergeAll(CommandServiceLive, LoggerServicePretty())

// Run
const program = main.pipe(
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
