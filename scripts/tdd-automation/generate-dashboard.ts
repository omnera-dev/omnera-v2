#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * TDD Pipeline Dashboard Generator
 *
 * Generates a markdown dashboard from collected metrics.
 * Displays current status, trends, and performance indicators.
 */

import * as fs from 'node:fs'
import * as Effect from 'effect/Effect'
import { LoggerServicePretty, logInfo, success } from '../lib/effect'

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
 * Load metrics history
 */
const loadMetricsHistory = (filePath: string): MetricsHistory | null => {
  if (!fs.existsSync(filePath)) {
    return null
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

/**
 * Get trend description
 */
const getTrendDescription = (current: number, previous: number, isLowerBetter = false): string => {
  if (previous === 0) return 'N/A'
  const change = ((current - previous) / previous) * 100
  const absChange = Math.abs(change)

  if (absChange < 1) return 'stable'

  const direction = change > 0 ? 'up' : 'down'
  const quality = isLowerBetter
    ? change > 0
      ? 'worse'
      : 'better'
    : change > 0
      ? 'better'
      : 'worse'

  return `${absChange.toFixed(0)}% ${direction} (${quality})`
}

/**
 * Generate markdown dashboard
 */
const generateDashboard = (history: MetricsHistory): string => {
  const latest = history.snapshots[history.snapshots.length - 1]
  if (!latest) {
    return '# TDD Pipeline Metrics\n\nNo metrics data available yet.'
  }

  // Get 7-day old snapshot for trends
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const oldSnapshot = history.snapshots.find(
    (s) => Math.abs(new Date(s.timestamp).getTime() - sevenDaysAgo) < 24 * 60 * 60 * 1000
  )

  const lastUpdated = new Date(latest.timestamp).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  let markdown = `# TDD Pipeline Metrics

**Last Updated**: ${lastUpdated}

## Queue Status

`

  // Queue status table
  const queue = latest.queue
  const queueTotal = queue.total
  const completedPct = queueTotal > 0 ? ((queue.completed / queueTotal) * 100).toFixed(0) : '0'
  const queuedPct = queueTotal > 0 ? ((queue.queued / queueTotal) * 100).toFixed(0) : '0'
  const failedPct = queueTotal > 0 ? ((queue.failed / queueTotal) * 100).toFixed(0) : '0'

  markdown += `- **Total specs**: ${queueTotal}
- ✅ **Completed**: ${queue.completed} (${completedPct}%)
- 🏃 **In Progress**: ${queue.inProgress}
- 📋 **Queued**: ${queue.queued} (${queuedPct}%)
- ❌ **Failed**: ${queue.failed} (${failedPct}%)

`

  // Performance metrics
  const perf = latest.performance
  markdown += `## Performance Metrics

`

  if (oldSnapshot) {
    const oldPerf = oldSnapshot.performance
    const timeTrend = getTrendDescription(
      perf.avgProcessingTimeMinutes,
      oldPerf.avgProcessingTimeMinutes,
      true
    )
    const successTrend = getTrendDescription(
      perf.successRateFirstAttempt,
      oldPerf.successRateFirstAttempt
    )

    markdown += `- **Avg processing time**: ${perf.avgProcessingTimeMinutes.toFixed(1)} minutes
  - 7-day trend: ${timeTrend}
- **Success rate (first attempt)**: ${(perf.successRateFirstAttempt * 100).toFixed(1)}%
  - 7-day trend: ${successTrend}
- **Retry rate**: ${(perf.retryRate * 100).toFixed(1)}%
- **Failure rate**: ${(perf.failureRate * 100).toFixed(1)}%

`
  } else {
    markdown += `- **Avg processing time**: ${perf.avgProcessingTimeMinutes.toFixed(1)} minutes
- **Success rate (first attempt)**: ${(perf.successRateFirstAttempt * 100).toFixed(1)}%
- **Retry rate**: ${(perf.retryRate * 100).toFixed(1)}%
- **Failure rate**: ${(perf.failureRate * 100).toFixed(1)}%

`
  }

  // Failure breakdown (if available)
  const failures = latest.failures
  const totalFailures =
    failures.specTest + failures.regression + failures.quality + failures.security

  if (totalFailures > 0) {
    markdown += `## Failure Breakdown

- **Spec test failures**: ${failures.specTest} (${((failures.specTest / totalFailures) * 100).toFixed(0)}%)
- **Regression failures**: ${failures.regression} (${((failures.regression / totalFailures) * 100).toFixed(0)}%)
- **Quality failures**: ${failures.quality} (${((failures.quality / totalFailures) * 100).toFixed(0)}%)
- **Security failures**: ${failures.security} (${((failures.security / totalFailures) * 100).toFixed(0)}%)

`
  }

  // Historical trends (if we have enough data)
  if (history.snapshots.length >= 7) {
    const last7Days = history.snapshots.slice(-7)
    const queueDepths = last7Days.map((s) => s.queue.queued)
    const avgQueueDepth = queueDepths.reduce((sum, val) => sum + val, 0) / queueDepths.length

    markdown += `## Trends (Last 7 Days)

- **Avg queue depth**: ${avgQueueDepth.toFixed(0)} specs
- **Data points**: ${history.snapshots.length} snapshots

`
  }

  markdown += `---

*Generated by TDD Pipeline metrics collection*
*Metrics stored in: \`.github/tdd-metrics.json\`*
`

  return markdown
}

/**
 * Main dashboard generation
 */
const generateDashboardMain = Effect.gen(function* () {
  yield* logInfo('Generating TDD pipeline dashboard...', '📊')

  const metricsFilePath = '.github/tdd-metrics.json'
  const history = loadMetricsHistory(metricsFilePath)

  if (!history) {
    yield* logInfo('No metrics data found. Run collect-metrics.ts first.', 'ℹ️')
    return Effect.succeed(void 0)
  }

  const dashboard = generateDashboard(history)

  // Write dashboard
  const dashboardPath = 'TDD-METRICS.md'
  fs.writeFileSync(dashboardPath, dashboard, 'utf-8')

  yield* success(`Dashboard generated: ${dashboardPath}`)

  return Effect.succeed(void 0)
})

// Run generation
const program = generateDashboardMain

const runnable = program.pipe(Effect.provide(LoggerServicePretty()))

Effect.runPromise(runnable)
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Dashboard generation failed:', error)
    process.exit(1)
  })
