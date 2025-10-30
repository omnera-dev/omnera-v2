#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * TDD Pipeline Metrics Collection
 *
 * Collects and aggregates metrics from the TDD automation pipeline:
 * - Queue status (total, queued, in-progress, completed, failed)
 * - Performance metrics (avg processing time, success rate, retry rate)
 * - Failure breakdown by type (spec test, regression, quality, security)
 * - Trends over time (7-day rolling window)
 *
 * Metrics are stored in .github/tdd-metrics.json for historical tracking.
 */

import * as fs from 'node:fs'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import {
  CommandService,
  CommandServiceLive,
  LoggerServicePretty,
  logInfo,
  success,
} from '../lib/effect'

interface QueueMetrics {
  total: number
  queued: number
  inProgress: number
  completed: number
  failed: number
}

interface PerformanceMetrics {
  avgProcessingTimeMinutes: number
  successRateFirstAttempt: number
  retryRate: number
  failureRate: number
}

interface FailureBreakdown {
  specTest: number
  regression: number
  quality: number
  security: number
}

interface MetricsSnapshot {
  timestamp: string
  queue: QueueMetrics
  performance: PerformanceMetrics
  failures: FailureBreakdown
}

interface MetricsHistory {
  snapshots: MetricsSnapshot[]
  lastUpdated: string
}

/**
 * Get queue status from GitHub issues
 */
const getQueueMetrics = (cmd: CommandService): Effect.Effect<QueueMetrics> =>
  Effect.gen(function* () {
    // Get all TDD automation issues
    const allIssuesJson = yield* cmd
      .exec('gh issue list --label "tdd-automation" --json number,labels,state --limit 1000', {
        throwOnError: false,
      })
      .pipe(Effect.catchAll(() => Effect.succeed('[]')))

    const allIssues = JSON.parse(allIssuesJson)

    // Count by status
    const queued = allIssues.filter((issue: { labels: { name: string }[] }) =>
      issue.labels.some((label: { name: string }) => label.name === 'tdd-spec:queued')
    ).length

    const inProgress = allIssues.filter((issue: { labels: { name: string }[] }) =>
      issue.labels.some((label: { name: string }) => label.name === 'tdd-spec:in-progress')
    ).length

    const completed = allIssues.filter((issue: { labels: { name: string }[] }) =>
      issue.labels.some((label: { name: string }) => label.name === 'tdd-spec:completed')
    ).length

    const failed = allIssues.filter((issue: { labels: { name: string }[] }) =>
      issue.labels.some((label: { name: string }) => label.name === 'tdd-spec:failed')
    ).length

    return {
      total: allIssues.length,
      queued,
      inProgress,
      completed,
      failed,
    }
  })

/**
 * Calculate performance metrics from issue history
 */
const getPerformanceMetrics = (cmd: CommandService): Effect.Effect<PerformanceMetrics> =>
  Effect.gen(function* () {
    // Get completed issues with timestamps
    const completedIssuesJson = yield* cmd
      .exec(
        'gh issue list --label "tdd-spec:completed" --json number,createdAt,closedAt,labels --limit 100 --state closed',
        {
          throwOnError: false,
        }
      )
      .pipe(Effect.catchAll(() => Effect.succeed('[]')))

    const completedIssues = JSON.parse(completedIssuesJson)

    if (completedIssues.length === 0) {
      return {
        avgProcessingTimeMinutes: 0,
        successRateFirstAttempt: 0,
        retryRate: 0,
        failureRate: 0,
      }
    }

    // Calculate processing times
    const processingTimes = completedIssues
      .map((issue: { createdAt: string; closedAt: string }) => {
        const created = new Date(issue.createdAt).getTime()
        const closed = new Date(issue.closedAt).getTime()
        return (closed - created) / (1000 * 60) // Convert to minutes
      })
      .filter((time: number) => time > 0)

    const avgProcessingTimeMinutes =
      processingTimes.reduce((sum: number, time: number) => sum + time, 0) / processingTimes.length

    // Count retries
    const withRetries = completedIssues.filter((issue: { labels: { name: string }[] }) =>
      issue.labels.some((label: { name: string }) => label.name.startsWith('retry:'))
    ).length

    const successRateFirstAttempt = (completedIssues.length - withRetries) / completedIssues.length

    const retryRate = withRetries / completedIssues.length

    // Get failed issues
    const failedIssuesJson = yield* cmd
      .exec('gh issue list --label "tdd-spec:failed" --json number --limit 100', {
        throwOnError: false,
      })
      .pipe(Effect.catchAll(() => Effect.succeed('[]')))

    const failedIssues = JSON.parse(failedIssuesJson)
    const totalProcessed = completedIssues.length + failedIssues.length
    const failureRate = totalProcessed > 0 ? failedIssues.length / totalProcessed : 0

    return {
      avgProcessingTimeMinutes,
      successRateFirstAttempt,
      retryRate,
      failureRate,
    }
  })

/**
 * Get failure breakdown (placeholder - would need issue comments analysis)
 */
const getFailureBreakdown = (): FailureBreakdown => {
  // TODO: Parse issue comments to determine failure types
  // For now, return placeholder values
  return {
    specTest: 0,
    regression: 0,
    quality: 0,
    security: 0,
  }
}

/**
 * Load metrics history from file
 */
const loadMetricsHistory = (filePath: string): MetricsHistory => {
  if (!fs.existsSync(filePath)) {
    return {
      snapshots: [],
      lastUpdated: new Date().toISOString(),
    }
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

/**
 * Save metrics history to file
 */
const saveMetricsHistory = (history: MetricsHistory, filePath: string): void => {
  const json = JSON.stringify(history, null, 2)
  fs.writeFileSync(filePath, json, 'utf-8')
}

/**
 * Add new snapshot to history (keep last 30 days)
 */
const addSnapshot = (history: MetricsHistory, snapshot: MetricsSnapshot): MetricsHistory => {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const recentSnapshots = history.snapshots.filter(
    (s) => new Date(s.timestamp).getTime() > thirtyDaysAgo
  )

  return {
    snapshots: [...recentSnapshots, snapshot],
    lastUpdated: snapshot.timestamp,
  }
}

/**
 * Main metrics collection
 */
const collectMetrics = Effect.gen(function* () {
  const cmd = yield* CommandService

  yield* logInfo('Collecting TDD pipeline metrics...', '📊')
  yield* logInfo('')

  // Collect current metrics
  yield* logInfo('Fetching queue status...', '🔍')
  const queueMetrics = yield* getQueueMetrics(cmd)

  yield* logInfo('Calculating performance metrics...', '📈')
  const performanceMetrics = yield* getPerformanceMetrics(cmd)

  yield* logInfo('Analyzing failure breakdown...', '🔍')
  const failureBreakdown = getFailureBreakdown()

  // Create snapshot
  const snapshot: MetricsSnapshot = {
    timestamp: new Date().toISOString(),
    queue: queueMetrics,
    performance: performanceMetrics,
    failures: failureBreakdown,
  }

  // Load history, add snapshot, save
  const metricsFilePath = '.github/tdd-metrics.json'
  const history = loadMetricsHistory(metricsFilePath)
  const updatedHistory = addSnapshot(history, snapshot)
  saveMetricsHistory(updatedHistory, metricsFilePath)

  yield* logInfo('')
  yield* success(`Metrics saved to ${metricsFilePath}`)
  yield* logInfo('')

  // Display current metrics
  yield* logInfo('📊 Current Queue Status:')
  yield* logInfo(`   Total specs: ${queueMetrics.total}`)
  yield* logInfo(`   ✅ Completed: ${queueMetrics.completed}`)
  yield* logInfo(`   🏃 In Progress: ${queueMetrics.inProgress}`)
  yield* logInfo(`   📋 Queued: ${queueMetrics.queued}`)
  yield* logInfo(`   ❌ Failed: ${queueMetrics.failed}`)
  yield* logInfo('')

  yield* logInfo('📈 Performance Metrics:')
  yield* logInfo(
    `   Avg processing time: ${performanceMetrics.avgProcessingTimeMinutes.toFixed(1)} minutes`
  )
  yield* logInfo(
    `   Success rate (first attempt): ${(performanceMetrics.successRateFirstAttempt * 100).toFixed(1)}%`
  )
  yield* logInfo(`   Retry rate: ${(performanceMetrics.retryRate * 100).toFixed(1)}%`)
  yield* logInfo(`   Failure rate: ${(performanceMetrics.failureRate * 100).toFixed(1)}%`)
  yield* logInfo('')

  return Effect.succeed(void 0)
})

// Run collection
const program = collectMetrics

const runnable = program.pipe(
  Effect.provide(Layer.merge(CommandServiceLive, LoggerServicePretty()))
)

Effect.runPromise(runnable)
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Metrics collection failed:', error)
    process.exit(1)
  })
