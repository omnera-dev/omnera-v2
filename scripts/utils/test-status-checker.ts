/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Test Status Checker
 *
 * Analyzes E2E test files to determine implementation status.
 * Maps tests to user stories and tracks RED (fixme) vs GREEN (passing) status.
 */

import { existsSync } from 'node:fs'
import { join } from 'node:path'

export interface TestInfo {
  description: string
  tag: '@spec' | '@regression' | '@spec' | 'unknown'
  status: 'passing' | 'fixme' | 'skipped'
  lineNumber: number
}

export interface TestStatus {
  propertyName: string
  testFileExists: boolean
  testFilePath: string
  tests: TestInfo[]
  summary: {
    total: number
    passing: number
    fixme: number
    skipped: number
    specTests: number
    regressionTests: number
    criticalTests: number
  }
  coveragePercent: number
}

/**
 * Check test status for a given property
 *
 * @param propertyPath - Property path (e.g., "name", "tables.fields.text-field")
 * @returns TestStatus object with detailed test information
 */
export async function checkTestStatus(propertyPath: string): Promise<TestStatus> {
  // Convert property path to test file path
  // E.g., "name" → "tests/app/name.spec.ts"
  // E.g., "tables.fields.text-field" → "tests/app/tables/fields/text-field.spec.ts"
  const testFilePath = propertyPathToTestFilePath(propertyPath)

  // Check if test file exists
  if (!existsSync(testFilePath)) {
    return {
      propertyName: propertyPath,
      testFileExists: false,
      testFilePath,
      tests: [],
      summary: {
        total: 0,
        passing: 0,
        fixme: 0,
        skipped: 0,
        specTests: 0,
        regressionTests: 0,
        criticalTests: 0,
      },
      coveragePercent: 0,
    }
  }

  // Read and parse test file
  const tests = await parseTestFile(testFilePath)

  // Calculate summary statistics
  const summary = {
    total: tests.length,
    passing: tests.filter((t) => t.status === 'passing').length,
    fixme: tests.filter((t) => t.status === 'fixme').length,
    skipped: tests.filter((t) => t.status === 'skipped').length,
    specTests: tests.filter((t) => t.tag === '@spec').length,
    regressionTests: tests.filter((t) => t.tag === '@regression').length,
    criticalTests: tests.filter((t) => t.tag === '@spec').length,
  }

  // Calculate coverage (percentage of passing tests)
  const coveragePercent =
    summary.total > 0 ? Math.round((summary.passing / summary.total) * 100) : 0

  return {
    propertyName: propertyPath,
    testFileExists: true,
    testFilePath,
    tests,
    summary,
    coveragePercent,
  }
}

/**
 * Convert property path to test file path
 */
function propertyPathToTestFilePath(propertyPath: string): string {
  const parts = propertyPath.split('.')
  const fileName = parts[parts.length - 1]!
  const dirParts = parts.slice(0, -1)

  // Build path: tests/app/{dirParts}/{fileName}.spec.ts
  const pathParts = ['tests', 'app', ...dirParts, `${fileName}.spec.ts`]
  return join(process.cwd(), ...pathParts)
}

/**
 * Parse test file to extract test information
 *
 * Looks for patterns:
 * - test('description', { tag: '@spec' }, ...)
 * - test.fixme('description', { tag: '@spec' }, ...)
 * - test.skip('description', { tag: '@spec' }, ...)
 */
async function parseTestFile(filePath: string): Promise<TestInfo[]> {
  const tests: TestInfo[] = []

  try {
    const file = Bun.file(filePath)
    const content = await file.text()

    // Regex patterns to match different test types
    const testPatterns = [
      {
        // test('description', { tag: '@spec' }, ...)
        regex: /test\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*{\s*tag:\s*['"`](@[^'"`]+)['"`]/g,
        status: 'passing' as const,
      },
      {
        // test.fixme('description', { tag: '@spec' }, ...)
        regex: /test\.fixme\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*{\s*tag:\s*['"`](@[^'"`]+)['"`]/g,
        status: 'fixme' as const,
      },
      {
        // test.skip('description', { tag: '@spec' }, ...)
        regex: /test\.skip\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*{\s*tag:\s*['"`](@[^'"`]+)['"`]/g,
        status: 'skipped' as const,
      },
    ]

    // Search for each pattern type
    for (const pattern of testPatterns) {
      const matches = content.matchAll(pattern.regex)

      for (const match of matches) {
        const description = match[1]!
        const tag = match[2]! as '@spec' | '@regression' | '@spec'

        // Find line number by searching for the match in lines
        const matchIndex = content.indexOf(match[0])
        const lineNumber = content.substring(0, matchIndex).split('\n').length

        tests.push({
          description,
          tag,
          status: pattern.status,
          lineNumber,
        })
      }
    }

    // Sort by line number
    tests.sort((a, b) => a.lineNumber - b.lineNumber)
  } catch (error) {
    console.error(`Error parsing test file ${filePath}:`, error)
  }

  return tests
}

/**
 * Get test status for multiple properties
 */
export async function checkMultipleTestStatuses(
  propertyPaths: string[]
): Promise<Map<string, TestStatus>> {
  const statusMap = new Map<string, TestStatus>()

  for (const propertyPath of propertyPaths) {
    const status = await checkTestStatus(propertyPath)
    statusMap.set(propertyPath, status)
  }

  return statusMap
}

/**
 * Format test status as human-readable string
 */
export function formatTestStatus(status: TestStatus): string {
  if (!status.testFileExists) {
    return '🔴 No tests found'
  }

  const { summary, coveragePercent } = status

  if (summary.total === 0) {
    return '⚪ Test file exists but no tests found'
  }

  if (summary.fixme === summary.total) {
    return `🔴 All tests RED (${summary.total} with .fixme)`
  }

  if (summary.passing === summary.total) {
    return `✅ All tests GREEN (${summary.total} passing)`
  }

  return `🚧 Partial (${summary.passing}/${summary.total} passing, ${summary.fixme} with .fixme) - ${coveragePercent}% coverage`
}
