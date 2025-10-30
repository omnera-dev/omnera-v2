#!/usr/bin/env bun
/**
 * TDD Queue Manager
 *
 * Manages the TDD automation queue:
 * - Scans for test.fixme() patterns and extracts spec IDs
 * - Creates minimal spec issues (one per spec)
 * - Tracks queue status (queued, in-progress, completed)
 * - Provides queue operations (get next, mark in-progress, mark completed)
 */

import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { Effect, Console, Array as EffectArray, pipe } from 'effect'
import { glob } from 'glob'

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
 */
const parseTestFileForSpecs = (filePath: string): Effect.Effect<SpecItem[]> =>
  // eslint-disable-next-line require-yield
  Effect.gen(function* () {
    const content = readFileSync(filePath, 'utf-8')
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

    // Find all test.fixme() or test.only() patterns and extract spec IDs
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Check if line contains test.fixme or it.fixme
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
 */
export const scanForFixmeSpecs = Effect.gen(function* () {
  yield* Console.log('🔍 Scanning for test.fixme() patterns and extracting spec IDs...')

  // Find all spec files
  const specFiles = yield* Effect.promise(() => glob('specs/**/*.spec.ts'))
  yield* Console.log(`Found ${specFiles.length} spec files`)

  // Parse each file in parallel
  const allSpecs = yield* Effect.all(specFiles.map(parseTestFileForSpecs), {
    concurrency: 10,
  })

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
  yield* Console.log('')
  yield* Console.log('📊 Scan Results:')
  yield* Console.log(`  Total specs with fixme: ${result.totalSpecs}`)
  yield* Console.log('')

  if (sortedSpecs.length > 0) {
    yield* Console.log('📋 First 10 specs:')
    sortedSpecs.slice(0, 10).forEach((spec, index) => {
      console.log(`  ${index + 1}. ${spec.specId}: ${spec.description}`)
      console.log(`     ${spec.file}:${spec.line}`)
    })
  }

  return result
})

/**
 * Get all queued spec issues from GitHub
 */
export const getQueuedSpecs = Effect.gen(function* () {
  yield* Console.log('📋 Fetching queued specs from GitHub...')

  try {
    const output = execSync(
      'gh issue list --label "tdd-spec:queued" --json number,title,url,createdAt,updatedAt --limit 1000',
      { encoding: 'utf-8' }
    )

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

    yield* Console.log(`  Found ${specIssues.length} queued specs`)
    return specIssues
  } catch (error) {
    yield* Console.error('❌ Failed to fetch queued specs:', error)
    return []
  }
})

/**
 * Get all in-progress spec issues from GitHub
 */
export const getInProgressSpecs = Effect.gen(function* () {
  try {
    const output = execSync(
      'gh issue list --label "tdd-spec:in-progress" --json number,title,url,createdAt,updatedAt --limit 100',
      { encoding: 'utf-8' }
    )

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
  } catch (error) {
    yield* Console.error('❌ Failed to fetch in-progress specs:', error)
    return []
  }
})

/**
 * Check if a spec already has an open issue
 */
export const specHasOpenIssue = (specId: string): Effect.Effect<boolean> =>
  // eslint-disable-next-line require-yield
  Effect.gen(function* () {
    try {
      const output = execSync(
        `gh issue list --label "tdd-spec" --search "${specId}" --json number,state --limit 10`,
        { encoding: 'utf-8' }
      )

      const issues = JSON.parse(output) as Array<{ number: number; state: string }>
      return issues.some((issue) => issue.state === 'OPEN')
    } catch {
      return false
    }
  })

/**
 * Create a minimal spec issue on GitHub
 */
export const createSpecIssue = (spec: SpecItem): Effect.Effect<number> =>
  Effect.gen(function* () {
    yield* Console.log(`📝 Creating issue for ${spec.specId}...`)

    // Check if issue already exists
    const hasIssue = yield* specHasOpenIssue(spec.specId)
    if (hasIssue) {
      yield* Console.log(`  ⏭️  Issue already exists for ${spec.specId}, skipping`)
      return -1
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

    try {
      const output = execSync(
        `gh issue create --title ${JSON.stringify(title)} --body ${JSON.stringify(bodyText)} --label "tdd-spec:queued,tdd-automation"`,
        { encoding: 'utf-8' }
      )

      // Extract issue number from URL (gh outputs the URL)
      const issueMatch = output.match(/\/issues\/(\d+)/)
      const issueNumber = issueMatch?.[1] ? parseInt(issueMatch[1], 10) : -1

      yield* Console.log(`  ✅ Created issue #${issueNumber}`)
      return issueNumber
    } catch (error) {
      yield* Console.error(`  ❌ Failed to create issue for ${spec.specId}:`, error)
      return -1
    }
  })

/**
 * Get the next spec to process (oldest queued spec if no specs in-progress)
 */
export const getNextSpec = Effect.gen(function* () {
  yield* Console.log('🔍 Looking for next spec to process...')

  // Check if any specs are in-progress
  const inProgressSpecs = yield* getInProgressSpecs
  if (inProgressSpecs.length > 0) {
    yield* Console.log(`  ⏸️  ${inProgressSpecs.length} spec(s) already in-progress:`)
    inProgressSpecs.forEach((spec) => {
      console.log(`     - ${spec.specId} (#${spec.number})`)
    })
    return null
  }

  // Get queued specs (oldest first)
  const queuedSpecs = yield* getQueuedSpecs
  if (queuedSpecs.length === 0) {
    yield* Console.log('  📭 Queue is empty')
    return null
  }

  // Return oldest queued spec
  const nextSpec = queuedSpecs[0]
  if (!nextSpec) {
    yield* Console.log('  📭 No queued specs found')
    return null
  }

  yield* Console.log(`  ✅ Next spec: ${nextSpec.specId} (#${nextSpec.number})`)
  return nextSpec
})

/**
 * Mark a spec as in-progress
 */
export const markInProgress = (issueNumber: number): Effect.Effect<void> =>
  Effect.gen(function* () {
    yield* Console.log(`🏃 Marking issue #${issueNumber} as in-progress...`)

    try {
      execSync(`gh issue edit ${issueNumber} --remove-label "tdd-spec:queued"`, {
        encoding: 'utf-8',
      })
      execSync(`gh issue edit ${issueNumber} --add-label "tdd-spec:in-progress"`, {
        encoding: 'utf-8',
      })
      yield* Console.log(`  ✅ Updated labels`)
    } catch (error) {
      yield* Console.error(`  ❌ Failed to update labels:`, error)
    }
  })

/**
 * Mark a spec as completed
 */
export const markCompleted = (issueNumber: number): Effect.Effect<void> =>
  Effect.gen(function* () {
    yield* Console.log(`✅ Marking issue #${issueNumber} as completed...`)

    try {
      execSync(`gh issue edit ${issueNumber} --remove-label "tdd-spec:in-progress"`, {
        encoding: 'utf-8',
      })
      execSync(`gh issue edit ${issueNumber} --add-label "tdd-spec:completed"`, {
        encoding: 'utf-8',
      })
      execSync(`gh issue close ${issueNumber} --reason completed`, {
        encoding: 'utf-8',
      })
      yield* Console.log(`  ✅ Issue closed and marked as completed`)
    } catch (error) {
      yield* Console.error(`  ❌ Failed to close issue:`, error)
    }
  })

/**
 * Mark a spec as failed
 */
export const markFailed = (issueNumber: number, reason: string): Effect.Effect<void> =>
  Effect.gen(function* () {
    yield* Console.log(`❌ Marking issue #${issueNumber} as failed...`)

    try {
      execSync(`gh issue edit ${issueNumber} --remove-label "tdd-spec:in-progress"`, {
        encoding: 'utf-8',
      })
      execSync(`gh issue edit ${issueNumber} --add-label "tdd-spec:failed"`, {
        encoding: 'utf-8',
      })
      execSync(
        `gh issue comment ${issueNumber} --body "❌ Validation failed:\n\n${reason}\n\nPlease review the implementation and push fixes to retry."`,
        { encoding: 'utf-8' }
      )
      yield* Console.log(`  ✅ Issue marked as failed with comment`)
    } catch (error) {
      yield* Console.error(`  ❌ Failed to mark as failed:`, error)
    }
  })

/**
 * CLI: Scan and display results
 */
const commandScan = Effect.gen(function* () {
  const result = yield* scanForFixmeSpecs

  // Save to file
  const outputPath = '.github/tdd-queue-scan.json'
  writeFileSync(outputPath, JSON.stringify(result, null, 2))
  yield* Console.log('')
  yield* Console.log(`💾 Results saved to ${outputPath}`)

  // Output for GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    const output = `total_specs=${result.totalSpecs}\n`
    writeFileSync(process.env.GITHUB_OUTPUT, output, { flag: 'a' })
  }
})

/**
 * CLI: Create issues for all specs (skip duplicates)
 */
const commandPopulate = Effect.gen(function* () {
  const result = yield* scanForFixmeSpecs

  if (result.totalSpecs === 0) {
    yield* Console.log('📭 No specs with fixme found')
    return
  }

  yield* Console.log('')
  yield* Console.log(`📝 Creating issues for ${result.totalSpecs} specs...`)

  // Create issues in sequence (avoid rate limiting)
  let created = 0
  let skipped = 0

  for (const spec of result.specs) {
    const issueNumber = yield* createSpecIssue(spec)
    if (issueNumber > 0) {
      created++
    } else {
      skipped++
    }
  }

  yield* Console.log('')
  yield* Console.log(`✅ Created ${created} issues, skipped ${skipped} (already exist)`)
})

/**
 * CLI: Get next spec from queue
 */
const commandNext = Effect.gen(function* () {
  const nextSpec = yield* getNextSpec

  if (!nextSpec) {
    if (process.env.GITHUB_OUTPUT) {
      writeFileSync(process.env.GITHUB_OUTPUT, 'has_next=false\n', { flag: 'a' })
    }
    return
  }

  // Output for GitHub Actions
  if (process.env.GITHUB_OUTPUT && nextSpec) {
    const output = `has_next=true
issue_number=${nextSpec.number}
spec_id=${nextSpec.specId}
issue_url=${nextSpec.url}
`
    writeFileSync(process.env.GITHUB_OUTPUT, output, { flag: 'a' })
  }
})

/**
 * CLI: List queue status
 */
const commandStatus = Effect.gen(function* () {
  yield* Console.log('📊 Queue Status')
  yield* Console.log('')

  const queued = yield* getQueuedSpecs
  const inProgress = yield* getInProgressSpecs

  yield* Console.log(`🟡 Queued: ${queued.length}`)
  queued.slice(0, 5).forEach((spec) => {
    console.log(`   - ${spec.specId} (#${spec.number})`)
  })
  if (queued.length > 5) {
    console.log(`   ... and ${queued.length - 5} more`)
  }

  yield* Console.log('')
  yield* Console.log(`🔵 In Progress: ${inProgress.length}`)
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
      yield* Console.log('TDD Queue Manager')
      yield* Console.log('')
      yield* Console.log('Usage:')
      yield* Console.log('  bun run scripts/tdd-automation/queue-manager.ts <command>')
      yield* Console.log('')
      yield* Console.log('Commands:')
      yield* Console.log('  scan      - Scan for fixme specs and display results')
      yield* Console.log('  populate  - Create issues for all fixme specs (skip duplicates)')
      yield* Console.log('  next      - Get next spec from queue (for GitHub Actions)')
      yield* Console.log('  status    - Display queue status')
  }
})

// Run CLI
Effect.runPromise(main).catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
