#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Remove Spec IDs from Closed Duplicate Issues
 *
 * Updates closed duplicate issues by removing spec IDs from their titles.
 * This prevents them from being matched in future duplicate detection checks.
 *
 * Example:
 * BEFORE: 🤖 APP-VERSION-001: should display version badge
 * AFTER:  🤖 [Duplicate] should display version badge
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

interface Issue {
  number: number
  title: string
  state: string
}

/**
 * Fetch all closed tdd-automation issues
 */
const fetchClosedIssues = Effect.gen(function* () {
  const cmd = yield* CommandService

  yield* progress('Fetching closed tdd-automation issues...')

  const output = yield* cmd
    .exec(
      'gh issue list --label "tdd-automation" --state closed --json number,title,state --limit 2000',
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
 * Check if title contains spec ID pattern
 */
const hasSpecId = (title: string): boolean => {
  const specIdPattern = /🤖\s+([A-Z]+-[A-Z-]+-\d{3}):/
  return specIdPattern.test(title)
}

/**
 * Remove spec ID from title
 */
const removeSpecId = (title: string): string => {
  // Pattern: 🤖 SPEC-ID: description
  // Result:  🤖 [Duplicate] description
  const specIdPattern = /🤖\s+[A-Z]+-[A-Z-]+-\d{3}:\s*/
  return title.replace(specIdPattern, '🤖 [Duplicate] ')
}

/**
 * Update issue title
 */
const updateIssueTitle = (issueNumber: number, newTitle: string, dryRun: boolean) =>
  Effect.gen(function* () {
    const cmd = yield* CommandService

    if (dryRun) {
      return 'DRY_RUN'
    }

    const result = yield* cmd
      .exec(`gh issue edit ${issueNumber} --title "${newTitle.replace(/"/g, '\\"')}"`, {
        throwOnError: false,
      })
      .pipe(
        Effect.catchAll(() => {
          return Effect.gen(function* () {
            yield* logError(`Failed to update #${issueNumber}`)
            return 'ERROR'
          })
        })
      )

    const hasError =
      result === 'ERROR' ||
      result.toLowerCase().includes('error') ||
      result.toLowerCase().includes('failed')

    return hasError ? 'ERROR' : 'SUCCESS'
  })

/**
 * Process all closed issues
 */
const processIssues = (issues: Issue[], dryRun: boolean) =>
  Effect.gen(function* () {
    yield* logInfo('')

    // Filter issues with spec IDs
    const issuesWithSpecId = issues.filter((issue) => hasSpecId(issue.title))

    yield* logInfo(`Found ${issuesWithSpecId.length} closed issues with spec IDs`, '📊')
    yield* logInfo('')

    if (issuesWithSpecId.length === 0) {
      yield* success('No closed issues with spec IDs found')
      return
    }

    if (dryRun) {
      yield* logInfo('🔍 DRY RUN MODE - No issues will be updated', '⚠️')
      yield* logInfo('Remove --dry-run flag to actually update issues')
      yield* logInfo('')
    }

    let updated = 0
    let failed = 0

    for (const issue of issuesWithSpecId) {
      const newTitle = removeSpecId(issue.title)

      if (dryRun) {
        console.log(`  #${issue.number}:`)
        console.log(`    BEFORE: ${issue.title}`)
        console.log(`    AFTER:  ${newTitle}`)
        console.log('')
        updated++
      } else {
        yield* progress(`Updating #${issue.number}...`)

        const result = yield* updateIssueTitle(issue.number, newTitle, dryRun)

        if (result === 'SUCCESS') {
          updated++
        } else {
          failed++
        }
      }
    }

    yield* logInfo('')
    if (dryRun) {
      yield* success(`Dry run completed - ${updated} issues would be updated`)
    } else {
      yield* success(`Updated ${updated} issue titles`)
      if (failed > 0) {
        yield* logError(`Failed to update ${failed} issues`)
      }
    }
  })

/**
 * Main CLI
 */
const main = Effect.gen(function* () {
  const dryRun = process.argv.includes('--dry-run')

  yield* logInfo('Remove Spec IDs from Closed Duplicate Issues', '🧹')
  yield* logInfo('')

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
