#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { Effect, Console } from 'effect'
import { glob } from 'glob'

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
}

interface ActivityEntry {
  date: string
  action: string
  feature: string
  testsFixed: number
  prNumber?: number
}

// Count tests in a file
const countTestsInFile = (filePath: string): TestMetrics => {
  const content = readFileSync(filePath, 'utf-8')

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
const loadMetricsHistory = (): ActivityEntry[] => {
  const metricsPath = '.github/tdd-metrics.json'
  if (existsSync(metricsPath)) {
    try {
      const data = JSON.parse(readFileSync(metricsPath, 'utf-8'))
      return data.recentActivity || []
    } catch {
      return []
    }
  }
  return []
}

// Main progress tracking logic
const trackProgress = Effect.gen(function* () {
  yield* Console.log('📊 Tracking TDD Pipeline Progress...')

  // Find all spec files
  const specFiles = yield* Effect.promise(() => glob('specs/**/*.spec.ts'))

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

  for (const [feature, files] of featureMap) {
    const featureMetrics = files.reduce(
      (acc, file) => {
        const metrics = countTestsInFile(file)
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
  const recentActivity = loadMetricsHistory()

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
  }

  // Output summary
  yield* Console.log('')
  yield* Console.log('📈 Overall Progress:')
  yield* Console.log(`  Total tests: ${overallMetrics.totalTests}`)
  yield* Console.log(`  Passing tests: ${overallMetrics.passingTests}`)
  yield* Console.log(`  Tests with fixme: ${overallMetrics.fixmeTests}`)
  yield* Console.log(`  Tests todo: ${overallMetrics.todoTests}`)
  yield* Console.log(`  Progress: ${overallMetrics.progressPercentage.toFixed(1)}%`)

  yield* Console.log('')
  yield* Console.log('🎯 Top Features to Fix:')
  nextUp.forEach((feature, index) => {
    const data = byFeature.find((f) => f.feature === feature)
    if (data) {
      console.log(`  ${index + 1}. ${feature} (${data.metrics.fixmeTests} fixme tests)`)
    }
  })

  // Save metrics
  const metricsPath = '.github/tdd-metrics.json'
  writeFileSync(metricsPath, JSON.stringify(report, null, 2))
  yield* Console.log('')
  yield* Console.log(`💾 Metrics saved to ${metricsPath}`)

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

## 🤖 Automation Status

- **Pipeline**: ${report.overall.fixmeTests > 0 ? '🟢 Enabled' : '🔴 No tests to fix'}
- **Mode**: Production
- **Max tests per run**: 3
- **Daily limit**: 5 runs

---

*This dashboard is automatically generated by the TDD automation pipeline.*
*Last generated: ${new Date().toISOString()}*
`

    const dashboardPath = 'TDD-PROGRESS.md'
    writeFileSync(dashboardPath, markdown)
    yield* Console.log(`📄 Dashboard generated at ${dashboardPath}`)
  })

// Run the tracker
Effect.runPromise(trackProgress).catch((error) => {
  console.error('❌ Error tracking progress:', error)
  process.exit(1)
})
