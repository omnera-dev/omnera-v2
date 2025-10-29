#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { Effect, Console, Array, pipe } from 'effect'
import { glob } from 'glob'

/**
 * Scans the specs directory for test files containing test.fixme patterns
 * and outputs a prioritized list for the TDD automation pipeline
 */

interface TestFile {
  path: string
  feature: string
  fixmeCount: number
  totalTests: number
  priority: number
  tags: string[]
}

interface ScanResult {
  timestamp: string
  totalFiles: number
  totalFixmeTests: number
  files: TestFile[]
}

// Parse a test file and extract test information
const parseTestFile = (filePath: string): Effect.Effect<TestFile> =>
  // eslint-disable-next-line require-yield
  Effect.gen(function* () {
    const content = readFileSync(filePath, 'utf-8')

    // Count test.fixme patterns
    const fixmeMatches = content.match(/test\.fixme\(|it\.fixme\(/g)
    const fixmeCount = fixmeMatches ? fixmeMatches.length : 0

    // Count total tests
    const testMatches = content.match(/test\(|it\(|test\.fixme\(|it\.fixme\(/g)
    const totalTests = testMatches ? testMatches.length : 0

    // Extract tags (@spec, @regression, @spec)
    const tagMatches = content.match(/@(spec|regression|spec)/g)
    const tags = tagMatches ? [...new Set(tagMatches)] : []

    // Extract feature from path
    const pathParts = filePath.split('/')
    const specsIndex = pathParts.indexOf('specs')
    const feature = pathParts
      .slice(specsIndex + 1)
      .join('/')
      .replace('.spec.ts', '')

    // Calculate priority (lower number = higher priority)
    let priority = 10 // Default priority

    // Adjust priority based on feature area
    if (feature.startsWith('app/version')) priority = 1
    else if (feature.startsWith('app/name')) priority = 2
    else if (feature.startsWith('app/description')) priority = 3
    else if (feature.startsWith('api/paths/health')) priority = 4
    else if (feature.startsWith('api/paths/auth')) priority = 5
    else if (feature.startsWith('api/paths/tables')) priority = 6
    else if (feature.startsWith('admin/')) priority = 7
    else if (feature.startsWith('app/pages/')) priority = 8
    else if (feature.startsWith('app/blocks/')) priority = 9

    return {
      path: filePath,
      feature,
      fixmeCount,
      totalTests,
      priority,
      tags,
    }
  })

// Main scanning logic
const scanForFixmeTests = Effect.gen(function* () {
  yield* Console.log('🔍 Scanning for test.fixme() patterns...')

  // Find all spec files
  const specFiles = yield* Effect.promise(() => glob('specs/**/*.spec.ts'))

  yield* Console.log(`Found ${specFiles.length} spec files`)

  // Parse each file in parallel
  const testFiles = yield* Effect.all(specFiles.map(parseTestFile), { concurrency: 10 })

  // Filter files with fixme tests
  const filesWithFixme = testFiles.filter((f) => f.fixmeCount > 0)

  // Sort by priority, then by fixme count
  const sortedFiles = pipe(
    filesWithFixme,
    Array.sortBy(
      (a, b) => a.priority - b.priority,
      (a, b) => b.fixmeCount - a.fixmeCount
    )
  )

  // Calculate totals
  const totalFixmeTests = sortedFiles.reduce((sum, f) => sum + f.fixmeCount, 0)

  const result: ScanResult = {
    timestamp: new Date().toISOString(),
    totalFiles: sortedFiles.length,
    totalFixmeTests,
    files: sortedFiles,
  }

  // Output results
  yield* Console.log('')
  yield* Console.log('📊 Scan Results:')
  yield* Console.log(`  Total files with fixme: ${result.totalFiles}`)
  yield* Console.log(`  Total fixme tests: ${result.totalFixmeTests}`)
  yield* Console.log('')
  yield* Console.log('📋 Priority Order:')

  sortedFiles.slice(0, 10).forEach((file, index) => {
    console.log(
      `  ${index + 1}. ${file.feature} (${file.fixmeCount} fixme, priority ${file.priority})`
    )
  })

  // Save results to JSON
  const outputPath = '.github/tdd-scan-results.json'
  writeFileSync(outputPath, JSON.stringify(result, null, 2))
  yield* Console.log('')
  yield* Console.log(`💾 Results saved to ${outputPath}`)

  // Output for GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    const firstFile = sortedFiles[0]
    if (firstFile) {
      const output = `has_tests=true
test_file=${firstFile.path}
test_count=${firstFile.fixmeCount}
feature_name=${firstFile.feature}`

      writeFileSync(process.env.GITHUB_OUTPUT, output, { flag: 'a' })
      yield* Console.log('')
      yield* Console.log('✅ GitHub Actions output set')
    } else {
      writeFileSync(process.env.GITHUB_OUTPUT, 'has_tests=false\n', { flag: 'a' })
    }
  }

  return result
})

// Run the scanner
Effect.runPromise(scanForFixmeTests).catch((error) => {
  console.error('❌ Error scanning for tests:', error)
  process.exit(1)
})
