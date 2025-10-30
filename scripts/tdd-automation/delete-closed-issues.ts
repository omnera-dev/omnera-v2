#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Delete Closed TDD Automation Issues
 *
 * Permanently deletes all closed issues with the tdd-automation label
 * using the GitHub GraphQL API.
 *
 * ⚠️ WARNING: This is a DESTRUCTIVE operation that cannot be undone!
 */

import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import {
  CommandService,
  CommandServiceLive,
  LoggerServicePretty,
  logInfo,
  logError,
  logWarn,
  success,
  progress,
} from '../lib/effect'

interface Issue {
  number: number
  title: string
  state: string
  id: string // GraphQL node ID
}

/**
 * Fetch all closed tdd-automation issues with their GraphQL node IDs
 */
const fetchClosedIssues = Effect.gen(function* () {
  const cmd = yield* CommandService

  yield* progress('Fetching closed tdd-automation issues...')

  const output = yield* cmd
    .exec(
      'gh issue list --label "tdd-automation" --state closed --json number,title,state,id --limit 2000',
      {
        throwOnError: false,
      }
    )
    .pipe(
      Effect.catchAll(() => {
        return Effect.gen(function* () {
          yield* logError('Failed to fetch closed issues')
          return '[]'
        })
      })
    )

  try {
    const issues = JSON.parse(output) as Issue[]
    yield* logInfo(`  Fetched ${issues.length} closed issues`)
    return issues
  } catch (error) {
    yield* logError(`Failed to parse GitHub response: ${error}`)
    return []
  }
})

/**
 * Delete a single issue using GraphQL API
 */
const deleteIssue = (issue: Issue, dryRun: boolean) =>
  Effect.gen(function* () {
    const cmd = yield* CommandService

    if (dryRun) {
      return 'DRY_RUN'
    }

    // GraphQL mutation to delete issue
    const mutation = `
      mutation {
        deleteIssue(input: {
          issueId: "${issue.id}"
        }) {
          repository {
            id
          }
        }
      }
    `

    const result = yield* cmd
      .exec(`gh api graphql -f query='${mutation.replace(/\n/g, ' ').replace(/\s+/g, ' ')}'`, {
        throwOnError: false,
      })
      .pipe(
        Effect.catchAll(() => {
          return Effect.gen(function* () {
            yield* logError(`Failed to delete #${issue.number}`)
            return 'ERROR'
          })
        })
      )

    // Check for errors in GraphQL response
    if (result === 'ERROR' || result.includes('"errors"')) {
      return 'ERROR'
    }

    return 'SUCCESS'
  })

/**
 * Process all closed issues
 */
const processIssues = (issues: Issue[], dryRun: boolean) =>
  Effect.gen(function* () {
    yield* logInfo('')

    if (issues.length === 0) {
      yield* success('No closed issues found')
      return
    }

    yield* logWarn('⚠️  WARNING: This will PERMANENTLY DELETE all closed issues!', '🚨')
    yield* logWarn('⚠️  This operation CANNOT be undone!')
    yield* logInfo('')
    yield* logInfo(`Total issues to delete: ${issues.length}`)
    yield* logInfo('')

    if (dryRun) {
      yield* logInfo('🔍 DRY RUN MODE - No issues will be deleted', '⚠️')
      yield* logInfo('Remove --dry-run flag to actually delete issues')
      yield* logInfo('')

      // Show first 10 issues that would be deleted
      const preview = issues.slice(0, 10)
      for (const issue of preview) {
        console.log(`  Would delete #${issue.number}: ${issue.title}`)
      }
      if (issues.length > 10) {
        console.log(`  ... and ${issues.length - 10} more issues`)
      }

      yield* logInfo('')
      yield* success(`Dry run completed - ${issues.length} issues would be deleted`)
      return
    }

    // Require explicit confirmation for actual deletion
    yield* logWarn('⚠️  Type "DELETE" to confirm deletion:', '🚨')
    yield* logInfo('')

    let deleted = 0
    let failed = 0

    for (const issue of issues) {
      yield* progress(`Deleting #${issue.number}...`)

      const result = yield* deleteIssue(issue, dryRun)

      if (result === 'SUCCESS') {
        deleted++
      } else if (result !== 'DRY_RUN') {
        failed++
      }
    }

    yield* logInfo('')
    yield* success(`Deleted ${deleted} issues`)
    if (failed > 0) {
      yield* logError(`Failed to delete ${failed} issues`)
    }
  })

/**
 * Main CLI
 */
const main = Effect.gen(function* () {
  const dryRun = process.argv.includes('--dry-run')
  const force = process.argv.includes('--force')

  yield* logInfo('Delete Closed TDD Automation Issues', '🗑️')
  yield* logInfo('')

  if (!dryRun && !force) {
    yield* logError('⚠️  SAFETY CHECK REQUIRED')
    yield* logInfo('')
    yield* logInfo('This script will PERMANENTLY DELETE all closed issues.')
    yield* logInfo('This operation CANNOT be undone.')
    yield* logInfo('')
    yield* logInfo('To proceed, you must:')
    yield* logInfo('  1. First run with --dry-run to see what would be deleted')
    yield* logInfo('  2. Then run with --force to actually delete')
    yield* logInfo('')
    yield* logInfo('Example:')
    yield* logInfo('  bun run tdd:delete-closed-issues --dry-run  # Preview')
    yield* logInfo('  bun run tdd:delete-closed-issues --force    # Actually delete')
    yield* logInfo('')
    return
  }

  const issues = yield* fetchClosedIssues

  if (issues.length === 0) {
    yield* success('No closed issues found')
    return
  }

  yield* processIssues(issues, dryRun)
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
