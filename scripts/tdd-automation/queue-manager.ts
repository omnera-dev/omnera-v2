#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * TDD Queue Manager
 *
 * Manages the TDD automation queue:
 * - Scans for test.fixme() patterns and extracts spec IDs
 * - Creates minimal spec issues (one per spec)
 * - Tracks queue status (queued, in-progress, completed)
 * - Provides queue operations (get next, mark in-progress, mark completed)
 */

import { Array as EffectArray, pipe } from 'effect'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import {
  FileSystemService,
  FileSystemServiceLive,
  CommandService,
  CommandServiceLive,
  LoggerServicePretty,
  success,
  progress,
  logInfo,
  skip,
  logError,
} from '../lib/effect'
import type { LoggerService } from '../lib/effect'

/**
 * Represents a single spec with fixme
 */
export interface SpecItem {
  specId: string
  file: string
  line: number
  description: string
  feature: string
  priority: number
}

/**
 * Represents a GitHub issue for a spec
 */
export interface SpecIssue {
  number: number
  specId: string
  state: 'queued' | 'in-progress' | 'completed' | 'failed'
  url: string
  createdAt: string
  updatedAt: string
}

/**
 * Scan result containing all specs with fixme
 */
export interface QueueScanResult {
  timestamp: string
  totalSpecs: number
  specs: SpecItem[]
}

/**
 * Extract spec ID from test title
 * Format: "APP-VERSION-001: description"
 * Returns: "APP-VERSION-001" or undefined
 */
const extractSpecId = (line: string): string | undefined => {
  const match = line.match(/['"`]([A-Z]+-[A-Z-]+-\d{3}):/)
  return match?.[1]
}

/**
 * Calculate priority based on feature area
 */
const calculatePriority = (feature: string): number => {
  if (feature.startsWith('app/version')) return 1
  if (feature.startsWith('app/name')) return 2
  if (feature.startsWith('app/description')) return 3
  if (feature.startsWith('api/paths/health')) return 4
  if (feature.startsWith('api/paths/auth')) return 5
  if (feature.startsWith('api/paths/tables')) return 6
  if (feature.startsWith('admin/')) return 7
  if (feature.startsWith('app/pages/')) return 8
  if (feature.startsWith('app/blocks/')) return 9
  return 10
}

/**
 * Parse a test file and extract all specs with fixme
 *
 * IMPORTANT: This function ONLY extracts tests marked with test.fixme() or it.fixme()
 * - Passing tests (test() without fixme) are EXCLUDED
 * - Skipped tests (test.skip()) are EXCLUDED
 * - Only RED tests with .fixme are included for automation
 */
const parseTestFileForSpecs = (
  filePath: string
): Effect.Effect<SpecItem[], never, FileSystemService> =>
  Effect.gen(function* () {
    const fs = yield* FileSystemService
    const content = yield* fs.readFile(filePath).pipe(Effect.catchAll(() => Effect.succeed('')))

    const lines = content.split('\n')
    const specs: SpecItem[] = []

    // Extract feature from path
    const pathParts = filePath.split('/')
    const specsIndex = pathParts.indexOf('specs')
    const feature = pathParts
      .slice(specsIndex + 1)
      .join('/')
      .replace('.spec.ts', '')

    const priority = calculatePriority(feature)

    // Find ONLY test.fixme() or it.fixme() patterns (RED tests that need implementation)
    // EXCLUDES: test() without fixme (passing tests), test.skip() (skipped tests)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Check if line contains test.fixme or it.fixme (ONLY RED TESTS)
      if (line?.includes('test.fixme(') || line?.includes('it.fixme(')) {
        // Look for spec ID in current line or next few lines (title might span multiple lines)
        let specId: string | undefined
        let description = ''

        // Check current line and next 3 lines for spec ID
        for (let j = i; j < Math.min(i + 4, lines.length); j++) {
          const testLine = lines[j]
          if (!testLine) continue

          specId = extractSpecId(testLine)
          if (specId) {
            // Extract description (everything after "SPEC-ID: ")
            const descMatch = testLine.match(/[A-Z]+-[A-Z-]+-\d{3}:\s*(.+?)['"`]/)
            description = descMatch?.[1]?.trim() ?? 'No description'
            break
          }
        }

        if (specId) {
          specs.push({
            specId,
            file: filePath,
            line: i + 1,
            description,
            feature,
            priority,
          })
        }
      }
    }

    return specs
  })

/**
 * Scan all spec files for fixme tests and extract spec IDs
 *
 * IMPORTANT: This function scans for RED tests marked with test.fixme() ONLY
 * - GREEN tests (passing tests without .fixme) are NOT included
 * - SKIPPED tests (test.skip()) are NOT included
 * - Only creates issues for tests that need implementation
 */
export const scanForFixmeSpecs = Effect.gen(function* () {
  const fs = yield* FileSystemService

  yield* progress('Scanning for test.fixme() patterns (RED tests only)...')

  // Find all spec files
  const specFiles = yield* fs.glob('specs/**/*.spec.ts')
  yield* logInfo(`Found ${specFiles.length} spec files to scan`)
  yield* logInfo('Note: Only tests with .fixme() will be queued (GREEN and SKIP tests excluded)')

  // Parse each file in parallel
  const allSpecs = yield* Effect.all(specFiles.map(parseTestFileForSpecs), { concurrency: 10 })

  // Flatten array of arrays
  const specs = allSpecs.flat()

  // Sort by priority, then by spec ID
  const sortedSpecs = pipe(
    specs,
    EffectArray.sortBy(
      (a, b) => (a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0),
      (a, b) => (a.specId < b.specId ? -1 : a.specId > b.specId ? 1 : 0)
    )
  )

  const result: QueueScanResult = {
    timestamp: new Date().toISOString(),
    totalSpecs: sortedSpecs.length,
    specs: sortedSpecs,
  }

  // Output results
  yield* logInfo('')
  yield* logInfo('Scan Results:', '📊')
  yield* logInfo(`  Total RED tests with .fixme(): ${result.totalSpecs}`)
  yield* logInfo(`  (Passing tests and test.skip() excluded from queue)`)
  yield* logInfo('')

  if (sortedSpecs.length > 0) {
    yield* logInfo('First 10 RED tests to be queued:', '📋')
    sortedSpecs.slice(0, 10).forEach((spec, index) => {
      console.log(`  ${index + 1}. ${spec.specId}: ${spec.description}`)
      console.log(`     ${spec.file}:${spec.line}`)
    })
  }

  return result
})

/**
 * Check GitHub API rate limit before making calls
 */
export const checkRateLimit = Effect.gen(function* () {
  const cmd = yield* CommandService

  const output = yield* cmd
    .exec('gh api rate_limit --jq ".rate.remaining,.rate.limit,.rate.reset"', {
      throwOnError: false,
    })
    .pipe(Effect.catchAll(() => Effect.succeed('')))

  const lines = output.trim().split('\n')
  if (lines.length >= 3) {
    const remaining = parseInt(lines[0] ?? '0', 10)
    const limit = parseInt(lines[1] ?? '0', 10)
    const resetTimestamp = parseInt(lines[2] ?? '0', 10)
    const resetDate = new Date(resetTimestamp * 1000)

    yield* logInfo(`GitHub API: ${remaining}/${limit} requests remaining`, '⏱️')

    if (remaining < 10) {
      yield* logError(`Rate limit low! Resets at ${resetDate.toISOString()}`)
      return false
    }

    return true
  }

  // If we can't check, assume it's OK
  return true
})

/**
 * Get all queued spec issues from GitHub
 */
export const getQueuedSpecs = Effect.gen(function* () {
  const cmd = yield* CommandService

  // Check rate limit first
  const hasCapacity = yield* checkRateLimit
  if (!hasCapacity) {
    yield* logError('Rate limit too low, skipping API call')
    return []
  }

  yield* logInfo('Fetching queued specs from GitHub (excluding skip-automated)...', '📋')

  const output = yield* cmd
    .exec(
      'gh issue list --label "tdd-spec:queued" --search "-label:skip-automated" --json number,title,url,createdAt,updatedAt --limit 1000',
      { throwOnError: false }
    )
    .pipe(
      Effect.catchAll(() => {
        return Effect.gen(function* () {
          yield* logError('Failed to fetch queued specs')
          return '[]'
        })
      })
    )

  try {
    const issues = JSON.parse(output) as Array<{
      number: number
      title: string
      url: string
      createdAt: string
      updatedAt: string
    }>

    const specIssues: SpecIssue[] = issues
      .map((issue): SpecIssue | null => {
        // Extract spec ID from title: "🤖 APP-VERSION-001: description"
        const specIdMatch = issue.title.match(/🤖\s+([A-Z]+-[A-Z-]+-\d{3}):/)
        const specId = specIdMatch?.[1]

        if (!specId) return null

        return {
          number: issue.number,
          specId,
          state: 'queued',
          url: issue.url,
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
        }
      })
      .filter((issue): issue is SpecIssue => issue !== null)

    yield* logInfo(`  Found ${specIssues.length} queued specs`)
    return specIssues
  } catch {
    yield* logError('Failed to parse GitHub issue response')
    return []
  }
})

/**
 * Get all in-progress spec issues from GitHub
 */
export const getInProgressSpecs = Effect.gen(function* () {
  const cmd = yield* CommandService

  // Check rate limit first
  const hasCapacity = yield* checkRateLimit
  if (!hasCapacity) {
    yield* logError('Rate limit too low, skipping API call')
    return []
  }

  const output = yield* cmd
    .exec(
      'gh issue list --label "tdd-spec:in-progress" --json number,title,url,createdAt,updatedAt --limit 100',
      { throwOnError: false }
    )
    .pipe(
      Effect.catchAll(() => {
        return Effect.gen(function* () {
          yield* logError('Failed to fetch in-progress specs')
          return '[]'
        })
      })
    )

  try {
    const issues = JSON.parse(output) as Array<{
      number: number
      title: string
      url: string
      createdAt: string
      updatedAt: string
    }>

    const specIssues: SpecIssue[] = issues
      .map((issue): SpecIssue | null => {
        const specIdMatch = issue.title.match(/🤖\s+([A-Z]+-[A-Z-]+-\d{3}):/)
        const specId = specIdMatch?.[1]

        if (!specId) return null

        return {
          number: issue.number,
          specId,
          state: 'in-progress',
          url: issue.url,
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
        }
      })
      .filter((issue): issue is SpecIssue => issue !== null)

    return specIssues
  } catch {
    yield* logError('Failed to parse GitHub issue response')
    return []
  }
})

/**
 * Get all existing spec issues from GitHub (all states: open and closed)
 * Used for bulk deduplication before creating new issues
 *
 * IMPORTANT: Uses --limit 2000 to handle project growth
 * WARNING: If total spec issues exceed 2000, duplicates may be created
 */
export const getAllExistingSpecs = Effect.gen(function* () {
  const cmd = yield* CommandService

  yield* logInfo('Fetching all existing spec issues (bulk deduplication)...', '🔍')

  // Fetch ALL spec issues (open + closed) in one query
  // Using limit 2000 (3x current 647 specs) for growth headroom
  const output = yield* cmd
    .exec('gh issue list --label "tdd-spec" --state all --json number,title,state --limit 2000', {
      throwOnError: false,
    })
    .pipe(
      Effect.catchAll(() => {
        return Effect.gen(function* () {
          yield* logError('Failed to fetch existing specs')
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

    // Extract spec IDs from issue titles
    const existingSpecIds = new Set<string>()
    for (const issue of issues) {
      const specIdMatch = issue.title.match(/🤖\s+([A-Z]+-[A-Z-]+-\d{3}):/)
      const specId = specIdMatch?.[1]
      if (specId) {
        existingSpecIds.add(specId)
      }
    }

    yield* logInfo(`  Found ${existingSpecIds.size} existing spec issues`)

    // WARNING: Detect if we're approaching the limit (may miss older issues)
    if (issues.length >= 1900) {
      yield* logError(`⚠️  WARNING: Approaching limit (${issues.length}/2000 issues fetched)`)
      yield* logError('   Risk of duplicate creation for specs with older issues beyond limit')
      yield* logError('   Consider implementing pagination or archiving old issues')
    }

    return existingSpecIds
  } catch {
    yield* logError('Failed to parse GitHub issue response')
    return new Set<string>()
  }
})

/**
 * Check if a spec already has an open issue
 */
export const specHasOpenIssue = (specId: string): Effect.Effect<boolean, never, CommandService> =>
  Effect.gen(function* () {
    const cmd = yield* CommandService

    const output = yield* cmd
      .exec(
        `gh issue list --label "tdd-spec" --search "${specId}" --json number,state --limit 10`,
        { throwOnError: false }
      )
      .pipe(Effect.catchAll(() => Effect.succeed('[]')))

    try {
      const issues = JSON.parse(output) as Array<{ number: number; state: string }>
      return issues.some((issue) => issue.state === 'OPEN')
    } catch {
      return false
    }
  })

/**
 * Create a minimal spec issue on GitHub
 *
 * @param spec - The spec item to create an issue for
 * @param skipExistenceCheck - Skip individual existence check (used when bulk deduplication is done)
 *
 * DUPLICATE PREVENTION:
 * - When skipExistenceCheck=false: Performs individual API check before creation
 * - When skipExistenceCheck=true: Relies on caller's bulk deduplication
 * - Race condition window: ~1-2 seconds between check and creation
 */
export const createSpecIssue = (
  spec: SpecItem,
  skipExistenceCheck = false
): Effect.Effect<number, never, CommandService | LoggerService> =>
  Effect.gen(function* () {
    const cmd = yield* CommandService

    // SAFETY CHECK: Verify issue doesn't exist (unless bulk deduplication was done)
    if (!skipExistenceCheck) {
      const hasIssue = yield* specHasOpenIssue(spec.specId)
      if (hasIssue) {
        yield* skip(`Issue already exists for ${spec.specId}, skipping`)
        return -1
      }
    }

    const title = `🤖 ${spec.specId}: ${spec.description}`
    const bodyText = `## 🤖 ${spec.specId}: ${spec.description}

**File**: \`${spec.file}:${spec.line}\`
**Feature**: ${spec.feature}
**Branch**: \`tdd/spec-${spec.specId}\`

### For Claude Code

1. Checkout branch: \`git checkout tdd/spec-${spec.specId}\`
2. Remove \`.fixme()\` from test ${spec.specId}
3. Implement minimal code to pass test
4. Commit: \`fix: implement ${spec.specId}\`

Validation runs automatically on push.`

    // Use heredoc to avoid shell escaping issues with backticks and special characters
    const output = yield* cmd
      .exec(
        `gh issue create --title ${JSON.stringify(title)} --body-file - --label "tdd-spec:queued,tdd-automation" <<'EOFBODY'
${bodyText}
EOFBODY`,
        { throwOnError: false }
      )
      .pipe(
        Effect.catchAll((error) => {
          return Effect.gen(function* () {
            yield* logError(`Failed to create issue for ${spec.specId}: ${error}`)
            return ''
          })
        })
      )

    // Extract issue number from URL (gh outputs the URL)
    const issueMatch = output.match(/\/issues\/(\d+)/)
    const issueNumber = issueMatch?.[1] ? parseInt(issueMatch[1], 10) : -1

    if (issueNumber > 0) {
      yield* success(`Created issue #${issueNumber} for ${spec.specId}`)
    }

    return issueNumber
  })

/**
 * Get the next spec to process (oldest queued spec if no specs in-progress)
 */
export const getNextSpec = Effect.gen(function* () {
  yield* progress('Looking for next spec to process...')

  // Check if any specs are in-progress
  const inProgressSpecs = yield* getInProgressSpecs
  if (inProgressSpecs.length > 0) {
    yield* logInfo(`${inProgressSpecs.length} spec(s) already in-progress:`, '⏸️')
    inProgressSpecs.forEach((spec) => {
      console.log(`     - ${spec.specId} (#${spec.number})`)
    })
    return null
  }

  // Get queued specs (oldest first)
  const queuedSpecs = yield* getQueuedSpecs
  if (queuedSpecs.length === 0) {
    yield* logInfo('Queue is empty', '📭')
    return null
  }

  // Return oldest queued spec
  const nextSpec = queuedSpecs[0]
  if (!nextSpec) {
    yield* logInfo('No queued specs found', '📭')
    return null
  }

  yield* success(`Next spec: ${nextSpec.specId} (#${nextSpec.number})`)
  return nextSpec
})

/**
 * Mark a spec as in-progress
 */
export const markInProgress = (
  issueNumber: number
): Effect.Effect<void, never, CommandService | LoggerService> =>
  Effect.gen(function* () {
    const cmd = yield* CommandService

    yield* progress(`Marking issue #${issueNumber} as in-progress...`)

    yield* cmd
      .exec(`gh issue edit ${issueNumber} --remove-label "tdd-spec:queued"`, {
        throwOnError: false,
      })
      .pipe(Effect.catchAll(() => Effect.void))

    yield* cmd
      .exec(`gh issue edit ${issueNumber} --add-label "tdd-spec:in-progress"`, {
        throwOnError: false,
      })
      .pipe(Effect.catchAll(() => Effect.void))

    yield* success('Updated labels')
  })

/**
 * Mark a spec as completed
 */
export const markCompleted = (
  issueNumber: number
): Effect.Effect<void, never, CommandService | LoggerService> =>
  Effect.gen(function* () {
    const cmd = yield* CommandService

    yield* progress(`Marking issue #${issueNumber} as completed...`)

    yield* cmd
      .exec(`gh issue edit ${issueNumber} --remove-label "tdd-spec:in-progress"`, {
        throwOnError: false,
      })
      .pipe(Effect.catchAll(() => Effect.void))

    yield* cmd
      .exec(`gh issue edit ${issueNumber} --add-label "tdd-spec:completed"`, {
        throwOnError: false,
      })
      .pipe(Effect.catchAll(() => Effect.void))

    yield* cmd
      .exec(`gh issue close ${issueNumber} --reason completed`, {
        throwOnError: false,
      })
      .pipe(Effect.catchAll(() => Effect.void))

    yield* success('Issue closed and marked as completed')
  })

/**
 * Mark a spec as failed
 */
export const markFailed = (
  issueNumber: number,
  reason: string
): Effect.Effect<void, never, CommandService | LoggerService> =>
  Effect.gen(function* () {
    const cmd = yield* CommandService

    yield* logError(`Marking issue #${issueNumber} as failed...`)

    yield* cmd
      .exec(`gh issue edit ${issueNumber} --remove-label "tdd-spec:in-progress"`, {
        throwOnError: false,
      })
      .pipe(Effect.catchAll(() => Effect.void))

    yield* cmd
      .exec(`gh issue edit ${issueNumber} --add-label "tdd-spec:failed"`, {
        throwOnError: false,
      })
      .pipe(Effect.catchAll(() => Effect.void))

    yield* cmd
      .exec(
        `gh issue comment ${issueNumber} --body "❌ Validation failed:\n\n${reason}\n\nPlease review the implementation and push fixes to retry."`,
        { throwOnError: false }
      )
      .pipe(Effect.catchAll(() => Effect.void))

    yield* success('Issue marked as failed with comment')
  })

/**
 * CLI: Scan and display results
 */
const commandScan = Effect.gen(function* () {
  const fs = yield* FileSystemService
  const result = yield* scanForFixmeSpecs

  // Save to file
  const outputPath = '.github/tdd-queue-scan.json'
  yield* fs.writeFile(outputPath, JSON.stringify(result, null, 2))
  yield* logInfo('')
  yield* success(`Results saved to ${outputPath}`)

  // Output for GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    const output = `total_specs=${result.totalSpecs}\n`
    yield* fs.writeFile(process.env.GITHUB_OUTPUT, output).pipe(Effect.catchAll(() => Effect.void))
  }
})

/**
 * CLI: Create issues for all specs (skip duplicates)
 *
 * PERFORMANCE OPTIMIZATION:
 * - Bulk deduplication: Fetch all existing issues once (1 API call vs N calls)
 * - Parallel batching: Create issues in batches of 10 concurrently
 * - Expected: 15 minutes → 30-60 seconds (~15-30x faster for 647 specs)
 */
const commandPopulate = Effect.gen(function* () {
  const result = yield* scanForFixmeSpecs

  if (result.totalSpecs === 0) {
    yield* logInfo('No specs with fixme found', '📭')
    return
  }

  yield* logInfo('')
  yield* logInfo(`Found ${result.totalSpecs} specs with .fixme()`, '📊')

  // OPTIMIZATION 1: Bulk deduplication (1 API call instead of N)
  const existingSpecIds = yield* getAllExistingSpecs

  // Filter specs that don't have issues yet
  const specsToCreate = result.specs.filter((spec) => !existingSpecIds.has(spec.specId))
  const alreadyExist = result.totalSpecs - specsToCreate.length

  yield* logInfo('')
  yield* logInfo(`Creating issues for ${specsToCreate.length} new specs...`, '📝')
  if (alreadyExist > 0) {
    yield* logInfo(`Skipping ${alreadyExist} specs (already have issues)`, '⏭️')
  }

  if (specsToCreate.length === 0) {
    yield* success('All specs already have issues')
    return
  }

  // OPTIMIZATION 2: Parallel batching (create 10 issues concurrently)
  // This respects GitHub API rate limits while dramatically improving speed
  const createIssueEffect = (spec: SpecItem) =>
    createSpecIssue(spec, true).pipe(
      Effect.catchAll(() => Effect.succeed(-1)) // Continue on individual failures
    )

  yield* progress('Creating issues in parallel batches (concurrency: 10)...')
  const issueNumbers = yield* Effect.all(specsToCreate.map(createIssueEffect), {
    concurrency: 10,
  })

  const created = issueNumbers.filter((num) => num > 0).length
  const failed = issueNumbers.length - created

  yield* logInfo('')
  yield* success(`Created ${created} issues`)
  if (failed > 0) {
    yield* logError(`Failed to create ${failed} issues (see errors above)`)
  }
  yield* logInfo(
    `Total processing time saved: ~${Math.round((specsToCreate.length * 1.5) / 60)} minutes → ~${Math.round(specsToCreate.length / 10 / 60)} minutes`,
    '⚡'
  )
})

/**
 * CLI: Get next spec from queue
 */
const commandNext = Effect.gen(function* () {
  const fs = yield* FileSystemService
  const cmd = yield* CommandService
  const nextSpec = yield* getNextSpec

  if (!nextSpec) {
    if (process.env.GITHUB_OUTPUT) {
      yield* fs
        .writeFile(process.env.GITHUB_OUTPUT, 'has_next=false\n')
        .pipe(Effect.catchAll(() => Effect.void))
    }
    return
  }

  // Find test file for this spec
  const testFileOutput = yield* cmd
    .exec(`grep -rl "${nextSpec.specId}" specs/ | grep "\\.spec\\.ts$" | head -1`, {
      throwOnError: false,
    })
    .pipe(Effect.catchAll(() => Effect.succeed('')))

  const testFile = testFileOutput.trim()

  // Output for GitHub Actions
  if (process.env.GITHUB_OUTPUT && nextSpec) {
    const output = `has_next=true
issue_number=${nextSpec.number}
spec_id=${nextSpec.specId}
issue_url=${nextSpec.url}
test_file=${testFile}
`
    yield* fs.writeFile(process.env.GITHUB_OUTPUT, output).pipe(Effect.catchAll(() => Effect.void))
  }
})

/**
 * CLI: List queue status
 */
const commandStatus = Effect.gen(function* () {
  yield* logInfo('Queue Status', '📊')
  yield* logInfo('')

  const queued = yield* getQueuedSpecs
  const inProgress = yield* getInProgressSpecs

  yield* logInfo(`Queued: ${queued.length}`, '🟡')
  queued.slice(0, 5).forEach((spec) => {
    console.log(`   - ${spec.specId} (#${spec.number})`)
  })
  if (queued.length > 5) {
    console.log(`   ... and ${queued.length - 5} more`)
  }

  yield* logInfo('')
  yield* logInfo(`In Progress: ${inProgress.length}`, '🔵')
  inProgress.forEach((spec) => {
    console.log(`   - ${spec.specId} (#${spec.number})`)
  })
})

/**
 * Main CLI entry point
 */
const main = Effect.gen(function* () {
  const command = process.argv[2]

  switch (command) {
    case 'scan':
      yield* commandScan
      break
    case 'populate':
      yield* commandPopulate
      break
    case 'next':
      yield* commandNext
      break
    case 'status':
      yield* commandStatus
      break
    default:
      yield* logInfo('TDD Queue Manager')
      yield* logInfo('')
      yield* logInfo('Usage:')
      yield* logInfo('  bun run scripts/tdd-automation/queue-manager.ts <command>')
      yield* logInfo('')
      yield* logInfo('Commands:')
      yield* logInfo('  scan      - Scan for fixme specs and display results')
      yield* logInfo('  populate  - Create issues for all fixme specs (skip duplicates)')
      yield* logInfo('  next      - Get next spec from queue (for GitHub Actions)')
      yield* logInfo('  status    - Display queue status')
  }
})

// Main layer combining all services
const MainLayer = Layer.mergeAll(FileSystemServiceLive, CommandServiceLive, LoggerServicePretty())

// Run CLI
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
