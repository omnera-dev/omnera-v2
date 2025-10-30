#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import {
  FileSystemService,
  FileSystemServiceLive,
  CommandService,
  CommandServiceLive,
  LoggerService,
  LoggerServicePretty,
  success,
  progress,
  logInfo,
} from '../lib/effect'

/**
 * Tracks TDD automation pipeline progress and generates metrics
 */

interface TestMetrics {
  totalTests: number
  passingTests: number
  fixmeTests: number
  todoTests: number
  progressPercentage: number
}

interface FeatureProgress {
  feature: string
  metrics: TestMetrics
  lastUpdated: string
  status: 'not-started' | 'in-progress' | 'completed'
}

interface ProgressReport {
  timestamp: string
  overall: TestMetrics
  byFeature: FeatureProgress[]
  recentActivity: ActivityEntry[]
  nextUp: string[]
  queueStatus: QueueStatus
}

interface ActivityEntry {
  date: string
  action: string
  feature: string
  testsFixed: number
  prNumber?: number
}

interface QueueStatus {
  queued: number
  inProgress: number
  completed: number
  failed: number
  total: number
}

// Count tests in a file
const countTestsInFile = (content: string): TestMetrics => {
  // Count different test types
  const fixmeTests = (content.match(/test\.fixme\(|it\.fixme\(/g) || []).length
  const todoTests = (content.match(/test\.todo\(|it\.todo\(/g) || []).length
  const regularTests = (content.match(/test\(|it\(/g) || []).length
  const totalTests = fixmeTests + todoTests + regularTests

  const passingTests = regularTests // Assuming regular tests are passing
  const progressPercentage = totalTests > 0 ? (passingTests / totalTests) * 100 : 0

  return {
    totalTests,
    passingTests,
    fixmeTests,
    todoTests,
    progressPercentage,
  }
}

// Load existing metrics file
const loadMetricsHistory = Effect.gen(function* () {
  const fs = yield* FileSystemService
  const metricsPath = '.github/tdd-metrics.json'

  const fileExists = yield* fs.exists(metricsPath)
  if (!fileExists) {
    return []
  }

  const content = yield* fs.readFile(metricsPath).pipe(Effect.catchAll(() => Effect.succeed('{}')))

  try {
    const data = JSON.parse(content)
    return (data.recentActivity || []) as ActivityEntry[]
  } catch {
    return []
  }
})

// Fetch queue status from GitHub issues
const fetchQueueStatus = Effect.gen(function* () {
  const cmd = yield* CommandService
  const logger = yield* LoggerService

  const fetchCount = (label: string) =>
    cmd
      .exec(`gh issue list --label "${label}" --json number --limit 1000`, {
        throwOnError: false,
      })
      .pipe(
        Effect.map((output) => {
          try {
            return JSON.parse(output).length
          } catch {
            return 0
          }
        }),
        Effect.catchAll(() => Effect.succeed(0))
      )

  // Try to fetch counts, but don't fail if gh CLI is unavailable
  const result = yield* Effect.all(
    {
      queued: fetchCount('tdd-spec:queued'),
      inProgress: fetchCount('tdd-spec:in-progress'),
      completed: fetchCount('tdd-spec:completed'),
      failed: fetchCount('tdd-spec:failed'),
    },
    { concurrency: 4 }
  ).pipe(
    Effect.catchAll(() =>
      Effect.gen(function* () {
        yield* logger.warn(
          'Failed to fetch queue status from GitHub (gh CLI may not be available)',
          '⚠️'
        )
        return {
          queued: 0,
          inProgress: 0,
          completed: 0,
          failed: 0,
        }
      })
    )
  )

  return {
    ...result,
    total: result.queued + result.inProgress + result.completed + result.failed,
  }
})

// Main progress tracking logic
const trackProgress = Effect.gen(function* () {
  const fs = yield* FileSystemService

  yield* progress('Tracking TDD Pipeline Progress...')

  // Find all spec files
  const specFiles = yield* fs.glob('specs/**/*.spec.ts')

  // Group by feature area
  const featureMap = new Map<string, string[]>()

  specFiles.forEach((file) => {
    const parts = file.split('/')
    const specsIndex = parts.indexOf('specs')
    const feature = parts.slice(specsIndex + 1, -1).join('/')
    if (!featureMap.has(feature)) {
      featureMap.set(feature, [])
    }
    featureMap.get(feature)!.push(file)
  })

  // Calculate metrics for each feature
  const byFeature: FeatureProgress[] = []
  const overallMetrics = {
    totalTests: 0,
    passingTests: 0,
    fixmeTests: 0,
    todoTests: 0,
    progressPercentage: 0,
  }

  // Read all files in parallel for better performance
  const fileContents = yield* Effect.all(
    specFiles.map((file) =>
      fs.readFile(file).pipe(
        Effect.map((content) => ({ file, content })),
        Effect.catchAll(() => Effect.succeed({ file, content: '' }))
      )
    ),
    { concurrency: 'unbounded' }
  )

  // Create a map for quick lookup
  const contentMap = new Map(fileContents.map((fc) => [fc.file, fc.content]))

  for (const [feature, files] of featureMap) {
    const featureMetrics = files.reduce(
      (acc, file) => {
        const content = contentMap.get(file) || ''
        const metrics = countTestsInFile(content)
        return {
          totalTests: acc.totalTests + metrics.totalTests,
          passingTests: acc.passingTests + metrics.passingTests,
          fixmeTests: acc.fixmeTests + metrics.fixmeTests,
          todoTests: acc.todoTests + metrics.todoTests,
          progressPercentage: 0, // Will calculate after
        }
      },
      {
        totalTests: 0,
        passingTests: 0,
        fixmeTests: 0,
        todoTests: 0,
        progressPercentage: 0,
      }
    )

    featureMetrics.progressPercentage =
      featureMetrics.totalTests > 0
        ? (featureMetrics.passingTests / featureMetrics.totalTests) * 100
        : 0

    // Determine status
    let status: FeatureProgress['status'] = 'not-started'
    if (featureMetrics.progressPercentage === 100) {
      status = 'completed'
    } else if (featureMetrics.progressPercentage > 0) {
      status = 'in-progress'
    }

    byFeature.push({
      feature,
      metrics: featureMetrics,
      lastUpdated: new Date().toISOString(),
      status,
    })

    // Add to overall
    overallMetrics.totalTests += featureMetrics.totalTests
    overallMetrics.passingTests += featureMetrics.passingTests
    overallMetrics.fixmeTests += featureMetrics.fixmeTests
    overallMetrics.todoTests += featureMetrics.todoTests
  }

  // Calculate overall progress
  overallMetrics.progressPercentage =
    overallMetrics.totalTests > 0
      ? (overallMetrics.passingTests / overallMetrics.totalTests) * 100
      : 0

  // Sort features by progress priority
  byFeature.sort((a, b) => {
    // Prioritize in-progress features
    if (a.status === 'in-progress' && b.status !== 'in-progress') return -1
    if (b.status === 'in-progress' && a.status !== 'in-progress') return 1

    // Then by number of fixme tests
    return b.metrics.fixmeTests - a.metrics.fixmeTests
  })

  // Load recent activity
  const recentActivity = yield* loadMetricsHistory

  // Fetch queue status from GitHub
  const queueStatus = yield* fetchQueueStatus

  // Determine next features to work on
  const nextUp = byFeature
    .filter((f) => f.status !== 'completed' && f.metrics.fixmeTests > 0)
    .slice(0, 5)
    .map((f) => f.feature)

  const report: ProgressReport = {
    timestamp: new Date().toISOString(),
    overall: overallMetrics,
    byFeature,
    recentActivity: recentActivity.slice(0, 10), // Keep last 10 entries
    nextUp,
    queueStatus,
  }

  // Output summary
  yield* logInfo('')
  yield* logInfo('Overall Progress:', '📈')
  yield* logInfo(`  Total tests: ${overallMetrics.totalTests}`)
  yield* logInfo(`  Passing tests: ${overallMetrics.passingTests}`)
  yield* logInfo(`  Tests with fixme: ${overallMetrics.fixmeTests}`)
  yield* logInfo(`  Tests todo: ${overallMetrics.todoTests}`)
  yield* logInfo(`  Progress: ${overallMetrics.progressPercentage.toFixed(1)}%`)

  yield* logInfo('')
  yield* logInfo('Queue Status:', '📊')
  yield* logInfo(`  Queued: ${queueStatus.queued}`)
  yield* logInfo(`  In Progress: ${queueStatus.inProgress}`)
  yield* logInfo(`  Completed: ${queueStatus.completed}`)
  yield* logInfo(`  Failed: ${queueStatus.failed}`)
  yield* logInfo(`  Total: ${queueStatus.total}`)

  yield* logInfo('')
  yield* logInfo('Top Features to Fix:', '🎯')
  nextUp.forEach((feature, index) => {
    const data = byFeature.find((f) => f.feature === feature)
    if (data) {
      console.log(`  ${index + 1}. ${feature} (${data.metrics.fixmeTests} fixme tests)`)
    }
  })

  // Save metrics
  const metricsPath = '.github/tdd-metrics.json'
  yield* fs.writeFile(metricsPath, JSON.stringify(report, null, 2))
  yield* logInfo('')
  yield* logInfo(`Metrics saved to ${metricsPath}`, '💾')

  // Generate progress dashboard
  yield* generateDashboard(report)

  return report
})

// Helper function to generate progress bar
const progressBar = (percentage: number) => {
  const filled = Math.round(percentage / 5)
  const empty = 20 - filled
  return '█'.repeat(filled) + '░'.repeat(empty)
}

// Generate markdown dashboard
const generateDashboard = (report: ProgressReport) =>
  Effect.gen(function* () {
    const fs = yield* FileSystemService

    const markdown = `# 🤖 TDD Automation Progress

**Last Updated**: ${new Date(report.timestamp).toLocaleString()}
**Status**: ${report.overall.fixmeTests > 0 ? '✅ Active' : '🎉 Complete'}

## 📊 Overall Progress

**Progress**: ${progressBar(report.overall.progressPercentage)} ${report.overall.progressPercentage.toFixed(1)}% (${report.overall.passingTests}/${report.overall.totalTests} tests)

| Metric | Count | Percentage |
|--------|-------|------------|
| ✅ Passing Tests | ${report.overall.passingTests} | ${((report.overall.passingTests / report.overall.totalTests) * 100).toFixed(1)}% |
| 🔴 Tests with .fixme | ${report.overall.fixmeTests} | ${((report.overall.fixmeTests / report.overall.totalTests) * 100).toFixed(1)}% |
| 📝 Tests todo | ${report.overall.todoTests} | ${((report.overall.todoTests / report.overall.totalTests) * 100).toFixed(1)}% |

## 📈 Progress by Feature Area

| Feature | Progress | Tests Fixed | Remaining | Status |
|---------|----------|-------------|-----------|---------|
${report.byFeature
  .slice(0, 10)
  .map(
    (f) =>
      `| ${f.feature} | ${progressBar(f.metrics.progressPercentage)} ${f.metrics.progressPercentage.toFixed(0)}% | ${f.metrics.passingTests}/${f.metrics.totalTests} | ${f.metrics.fixmeTests} | ${
        f.status === 'completed' ? '✅' : f.status === 'in-progress' ? '🔄' : '⏳'
      } |`
  )
  .join('\n')}

## 📅 Recent Activity

${
  report.recentActivity.length > 0
    ? report.recentActivity
        .map(
          (a) =>
            `- **${a.date}**: ${a.action} for ${a.feature} (${a.testsFixed} tests)${
              a.prNumber ? ` - PR #${a.prNumber}` : ''
            }`
        )
        .join('\n')
    : '- No recent activity recorded'
}

## 🎯 Next Up

The following features are prioritized for automation:

${report.nextUp.map((f, i) => `${i + 1}. **${f}**`).join('\n')}

## 📊 Queue Status

| Status | Count | Description |
|--------|-------|-------------|
| 🟡 Queued | ${report.queueStatus.queued} | Specs waiting to be processed |
| 🔵 In Progress | ${report.queueStatus.inProgress} | Specs currently being implemented |
| ✅ Completed | ${report.queueStatus.completed} | Specs successfully implemented |
| ❌ Failed | ${report.queueStatus.failed} | Specs that failed validation |
| **Total** | **${report.queueStatus.total}** | **Total specs in queue** |

## 🤖 Automation Status

- **Queue System**: ${report.queueStatus.total > 0 ? '🟢 Active' : '🔴 Empty'}
- **Processing Mode**: ${report.queueStatus.inProgress > 0 ? '🔄 Processing' : '⏸️  Idle'}
- **Processing Interval**: Every 15 minutes
- **Max Concurrent**: 1 spec at a time (strict serial)

---

*This dashboard is automatically generated by the TDD automation pipeline.*
*Last generated: ${new Date().toISOString()}*
`

    const dashboardPath = 'TDD-PROGRESS.md'
    yield* fs.writeFile(dashboardPath, markdown)
    yield* success(`Dashboard generated at ${dashboardPath}`)
  })

// Main layer combining all services
const MainLayer = Layer.mergeAll(FileSystemServiceLive, CommandServiceLive, LoggerServicePretty())

// Run the tracker
const program = trackProgress.pipe(
  Effect.provide(MainLayer),
  Effect.catchAll((error) =>
    Effect.gen(function* () {
      console.error('❌ Error tracking progress:', error)
      yield* Effect.fail(error)
    })
  )
)

Effect.runPromise(program).catch((error) => {
  console.error('❌ Error tracking progress:', error)
  process.exit(1)
})
