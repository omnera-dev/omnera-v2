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
  logWarn,
} from '../lib/effect'
import { createSchemaPriorityCalculator } from './schema-priority-calculator'
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
 * Parse a test file and extract all specs with fixme
 *
 * IMPORTANT: This function ONLY extracts tests marked with test.fixme() or it.fixme()
 * - Passing tests (test() without fixme) are EXCLUDED
 * - Skipped tests (test.skip()) are EXCLUDED
 * - Only RED tests with .fixme are included for automation
 */
const parseTestFileForSpecs = (
  filePath: string,
  calculatePriority: (feature: string) => number
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
          // Calculate priority based on the spec ID (not the feature path)
          const priority = calculatePriority(specId)

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

  // Create schema-based priority calculator
  yield* logInfo('Loading schema hierarchy for priority calculation...', '🔗')
  const calculatePriority = createSchemaPriorityCalculator('specs/app/app.schema.json')
  yield* logInfo('Schema hierarchy loaded - specs will be prioritized by dependencies')

  // Find all spec files
  const specFiles = yield* fs.glob('specs/**/*.spec.ts')
  yield* logInfo(`Found ${specFiles.length} spec files to scan`)
  yield* logInfo('Note: Only tests with .fixme() will be queued (GREEN and SKIP tests excluded)')

  // Parse each file in parallel (pass priority calculator to each)
  const allSpecs = yield* Effect.all(
    specFiles.map((file) => parseTestFileForSpecs(file, calculatePriority)),
    { concurrency: 10 }
  )

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
 *
 * IMPROVED DEDUPLICATION:
 * - Filters by bot emoji (🤖) in title to ensure only spec issues are fetched
 * - Checks both open and closed issues
 * - Returns both spec IDs and issue metadata for duplicate detection
 */
export const getAllExistingSpecs = Effect.gen(function* () {
  const cmd = yield* CommandService

  yield* logInfo('Fetching all existing spec issues (bulk deduplication)...', '🔍')

  // Fetch ALL spec issues (open + closed) in one query
  // Using limit 2000 (3x current 647 specs) for growth headroom
  // Filter by bot emoji in search to ensure we only get spec issues
  const output = yield* cmd
    .exec(
      'gh issue list --label "tdd-automation" --search "🤖 in:title" --state all --json number,title,state,createdAt --limit 2000',
      {
        throwOnError: false,
      }
    )
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
      createdAt: string
    }>

    // Extract spec IDs from issue titles and build metadata map
    const existingSpecIds = new Set<string>()
    const specMetadata = new Map<
      string,
      Array<{ number: number; state: string; createdAt: string }>
    >()

    for (const issue of issues) {
      const specIdMatch = issue.title.match(/🤖\s+([A-Z]+-[A-Z-]+-\d{3}):/)
      const specId = specIdMatch?.[1]
      if (specId) {
        existingSpecIds.add(specId)

        // Track all issues for this spec ID (for duplicate detection)
        if (!specMetadata.has(specId)) {
          specMetadata.set(specId, [])
        }
        specMetadata.get(specId)?.push({
          number: issue.number,
          state: issue.state,
          createdAt: issue.createdAt,
        })
      }
    }

    // Detect existing duplicates (multiple issues for same spec ID)
    const duplicates: string[] = []
    for (const [specId, issueList] of specMetadata.entries()) {
      if (issueList.length > 1) {
        duplicates.push(specId)
      }
    }

    yield* logInfo(`  Found ${existingSpecIds.size} unique spec IDs`)
    yield* logInfo(`  Total issues: ${issues.length}`)

    if (duplicates.length > 0) {
      yield* logWarn(
        `  ⚠️  Found ${duplicates.length} specs with multiple issues (duplicates exist)`
      )
      yield* logInfo(`  First 5 duplicates: ${duplicates.slice(0, 5).join(', ')}`)
    }

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
 * Check if a spec already has an issue (open or closed)
 * IMPORTANT: Uses "tdd-automation" label (the actual label used by the pipeline)
 * IMPORTANT: Checks ALL states (open + closed) to prevent duplicates
 */
export const specHasIssue = (specId: string): Effect.Effect<boolean, never, CommandService> =>
  Effect.gen(function* () {
    const cmd = yield* CommandService

    const output = yield* cmd
      .exec(
        `gh issue list --label "tdd-automation" --search "${specId}" --state all --json number,state --limit 10`,
        { throwOnError: false }
      )
      .pipe(Effect.catchAll(() => Effect.succeed('[]')))

    try {
      const issues = JSON.parse(output) as Array<{ number: number; state: string }>
      return issues.length > 0 // Returns true if ANY issue exists (open or closed)
    } catch {
      return false
    }
  })

/**
 * @deprecated Use specHasIssue() instead - this function only checks OPEN issues
 * Kept for backwards compatibility
 */
export const specHasOpenIssue = specHasIssue

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
    // Checks ALL states (open + closed) to prevent duplicates
    if (!skipExistenceCheck) {
      const hasIssue = yield* specHasIssue(spec.specId)
      if (hasIssue) {
        yield* skip(`Issue already exists for ${spec.specId}, skipping`)
        return -1
      }
    }

    const title = `🤖 ${spec.specId}: ${spec.description}`
    const bodyText = `## 🤖 ${spec.specId}: ${spec.description}

**File**: \`${spec.file}:${spec.line}\`
**Feature**: ${spec.feature}

### Implementation Instructions

This spec will be automatically picked up by the TDD queue processor and implemented by Claude Code.

**What happens automatically**:
1. Queue processor marks issue as in-progress
2. Queue processor posts @claude comment to trigger Claude Code workflow
3. Claude Code automatically creates branch with pattern \`claude/issue-{ISSUE_NUMBER}-{timestamp}\`
4. Removes \`.fixme()\` from test ${spec.specId}
5. Implements minimal code to pass test
6. Runs validation before pushing
7. Commits: \`fix: implement ${spec.specId}\`
8. Auto-merge to main if validation passes

**Validation runs automatically**: Spec test → Regression tests → Quality checks`

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
 * Get the next spec to process (highest priority, then lowest spec ID number)
 * Prioritization:
 * 1. Schema-based priority (root before nested, required before optional)
 * 2. Spec ID numerical order (001, 002, 003, etc.)
 * 3. Dependency graph (ready specs before blocked specs)
 */
export const getNextSpec = Effect.gen(function* () {
  const fs = yield* FileSystemService
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

  // Get queued specs
  const queuedSpecs = yield* getQueuedSpecs
  if (queuedSpecs.length === 0) {
    yield* logInfo('Queue is empty', '📭')
    return null
  }

  // Load schema-based priority calculator
  yield* logInfo('Loading schema hierarchy for priority calculation...', '🔗')
  const calculatePriority = createSchemaPriorityCalculator('specs/app/app.schema.json')

  // Calculate priority for each spec based on spec ID
  interface SpecWithPriority extends SpecIssue {
    priority: number
  }

  const specsWithPriority: SpecWithPriority[] = queuedSpecs.map((spec) => {
    // Calculate priority based on spec ID (e.g., APP-BLOCKS-001, APP-BLOCKS-REGRESSION)
    // This ensures tests from same schema are processed together with regression tests last
    const priority = calculatePriority(spec.specId)

    return {
      ...spec,
      priority,
    }
  })

  // Load dependency graph if it exists
  const dependencyGraphPath = '.github/tdd-queue-dependencies.json'
  let dependencyGraph: Record<
    string,
    { canImplement: boolean; missingDependencies: string[] }
  > | null = null

  const dependencyGraphExists = yield* fs
    .exists(dependencyGraphPath)
    .pipe(Effect.catchAll(() => Effect.succeed(false)))

  if (dependencyGraphExists) {
    const graphBuffer = yield* fs
      .readFile(dependencyGraphPath)
      .pipe(Effect.catchAll(() => Effect.succeed(Buffer.from('{}'))))

    try {
      const graphContent = graphBuffer.toString('utf-8')
      dependencyGraph = JSON.parse(graphContent)
      yield* logInfo('Using dependency graph for blocking detection', '🔗')
    } catch {
      yield* logWarn('Failed to parse dependency graph')
    }
  }

  // Separate ready specs from blocked specs based on dependency graph
  let readySpecs: SpecWithPriority[] = []
  const blockedSpecs: SpecWithPriority[] = []

  if (dependencyGraph) {
    for (const spec of specsWithPriority) {
      const depInfo = dependencyGraph[spec.specId]
      if (depInfo && depInfo.canImplement) {
        readySpecs.push(spec)
      } else if (depInfo && !depInfo.canImplement) {
        blockedSpecs.push(spec)
      } else {
        // If not in dependency graph, treat as ready (backward compatibility)
        readySpecs.push(spec)
      }
    }

    if (blockedSpecs.length > 0) {
      yield* logWarn(`⚠️  ${blockedSpecs.length} spec(s) blocked by missing dependencies`)
      for (const spec of blockedSpecs.slice(0, 3)) {
        const depInfo = dependencyGraph[spec.specId]
        if (depInfo) {
          yield* logInfo(`   ${spec.specId}: ${depInfo.missingDependencies.length} missing file(s)`)
        }
      }
      if (blockedSpecs.length > 3) {
        yield* logInfo(`   ... and ${blockedSpecs.length - 3} more blocked specs`)
      }
    }

    if (readySpecs.length > 0) {
      yield* logInfo(`✅ ${readySpecs.length} spec(s) ready to implement`)
    }
  } else {
    // No dependency graph, all specs are ready
    readySpecs = specsWithPriority
  }

  // Sort ready specs by priority, then by spec ID (ensures 001, 002, 003 order)
  const sortedReadySpecs = pipe(
    readySpecs,
    EffectArray.sortBy(
      (a, b) => (a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0),
      (a, b) => (a.specId < b.specId ? -1 : a.specId > b.specId ? 1 : 0)
    )
  )

  // If no ready specs, try blocked specs (sorted by priority)
  const nextSpec =
    sortedReadySpecs.length > 0
      ? sortedReadySpecs[0]
      : pipe(
          blockedSpecs,
          EffectArray.sortBy(
            (a, b) => (a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0),
            (a, b) => (a.specId < b.specId ? -1 : a.specId > b.specId ? 1 : 0)
          )
        )[0]

  if (!nextSpec) {
    yield* logInfo('No queued specs found', '📭')
    return null
  }

  yield* success(
    `Next spec: ${nextSpec.specId} (#${nextSpec.number}) [Priority: ${nextSpec.priority}]`
  )

  if (dependencyGraph && dependencyGraph[nextSpec.specId]) {
    const depInfo = dependencyGraph[nextSpec.specId]
    if (depInfo && !depInfo.canImplement) {
      yield* logWarn(
        `⚠️  Warning: This spec has ${depInfo.missingDependencies.length} missing dependencies`
      )
      yield* logInfo('Implementation may fail. Consider implementing dependencies first.')
    }
  }

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
 * Check idempotency lock to prevent concurrent populate runs
 * Returns true if safe to proceed, false if another populate is in progress
 */
const checkIdempotencyLock = Effect.gen(function* () {
  const fs = yield* FileSystemService
  const cmd = yield* CommandService
  const lockFilePath = '.github/tdd-queue-populate.lock'

  // Check if lock file exists
  const lockExists = yield* fs
    .exists(lockFilePath)
    .pipe(Effect.catchAll(() => Effect.succeed(false)))

  if (!lockExists) {
    return true // No lock, safe to proceed
  }

  // Read lock file to check timestamp
  const lockContent = yield* fs
    .readFile(lockFilePath)
    .pipe(Effect.catchAll(() => Effect.succeed('')))

  if (!lockContent) {
    return true // Empty lock, safe to proceed
  }

  try {
    const lockData = JSON.parse(lockContent) as { timestamp: string; pid?: string }
    const lockTime = new Date(lockData.timestamp)
    const now = new Date()
    const ageMinutes = (now.getTime() - lockTime.getTime()) / 1000 / 60

    // If lock is older than 30 minutes, consider it stale
    if (ageMinutes > 30) {
      yield* logWarn(`⚠️  Stale lock file detected (${Math.round(ageMinutes)} minutes old)`)
      yield* logInfo('Removing stale lock and proceeding')
      yield* cmd.exec(`rm -f ${lockFilePath}`).pipe(Effect.catchAll(() => Effect.void))
      return true
    }

    // Lock is recent, another populate is likely in progress
    yield* logError('❌ Another populate operation is in progress')
    yield* logError(`   Started: ${lockData.timestamp} (${Math.round(ageMinutes)} minutes ago)`)
    yield* logError('   Please wait for it to complete or remove .github/tdd-queue-populate.lock')
    return false
  } catch {
    // Corrupted lock file, remove it
    yield* logWarn('⚠️  Corrupted lock file detected, removing')
    yield* cmd.exec(`rm -f ${lockFilePath}`).pipe(Effect.catchAll(() => Effect.void))
    return true
  }
})

/**
 * Create idempotency lock file
 */
const createIdempotencyLock = Effect.gen(function* () {
  const fs = yield* FileSystemService
  const lockFilePath = '.github/tdd-queue-populate.lock'

  const lockData = {
    timestamp: new Date().toISOString(),
    pid: process.pid.toString(),
  }

  yield* fs.writeFile(lockFilePath, JSON.stringify(lockData, null, 2))
  yield* logInfo(`🔒 Created idempotency lock: ${lockFilePath}`)
})

/**
 * Remove idempotency lock file
 */
const removeIdempotencyLock = Effect.gen(function* () {
  const cmd = yield* CommandService
  const lockFilePath = '.github/tdd-queue-populate.lock'

  yield* cmd.exec(`rm -f ${lockFilePath}`).pipe(Effect.catchAll(() => Effect.void))
  yield* logInfo(`🔓 Removed idempotency lock`)
})

/**
 * CLI: Create issues for all specs (skip duplicates)
 *
 * PERFORMANCE OPTIMIZATION:
 * - Bulk deduplication: Fetch all existing issues once (1 API call vs N calls)
 * - Parallel batching: Create issues in batches of 10 concurrently
 * - Expected: 15 minutes → 30-60 seconds (~15-30x faster for 647 specs)
 *
 * IDEMPOTENCY PROTECTION:
 * - Lock file prevents concurrent populate runs
 * - Stale locks (>30 min) are automatically removed
 * - Lock removed on success or failure
 */
const commandPopulate = Effect.gen(function* () {
  // Check idempotency lock
  const canProceed = yield* checkIdempotencyLock
  if (!canProceed) {
    yield* logError('Aborting populate to prevent duplicates')
    return
  }

  // Create lock file
  yield* createIdempotencyLock

  try {
    const result = yield* scanForFixmeSpecs

    if (result.totalSpecs === 0) {
      yield* logInfo('No specs with fixme found', '📭')
      yield* removeIdempotencyLock
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
      yield* removeIdempotencyLock
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

    // Remove lock on success
    yield* removeIdempotencyLock
  } catch (error) {
    // Remove lock on failure
    yield* removeIdempotencyLock
    throw error
  }
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
  Effect.catchAll((error) => {
    console.error('❌ Error:', error)
    return Effect.fail(error)
  })
)

Effect.runPromise(program).catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
