/**
 * Implementation Status Checker
 *
 * Checks actual implementation status by examining the codebase:
 * - Schema file existence
 * - Test file existence
 * - Test counts
 * - Export status
 */

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ImplementationStatus } from '../types/roadmap.ts'

/**
 * Convert property name to file name
 * Examples:
 *   "name" → "name"
 *   "tables" → "tables"
 *   "automation_trigger" → "automation-trigger" (handled by caller)
 */
function propertyNameToFileName(propertyName: string): string {
  // Handle dot-notation (nested properties)
  const parts = propertyName.split('.')
  const lastName = parts[parts.length - 1]!

  return lastName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_]+/g, '-')
    .toLowerCase()
}

/**
 * Check if schema file exists and is exported
 */
function checkSchemaImplementation(propertyName: string): {
  exists: boolean
  exported: boolean
} {
  const fileName = propertyNameToFileName(propertyName)
  const schemaFilePath = join('src/domain/models/app', `${fileName}.ts`)

  const exists = existsSync(schemaFilePath)

  if (!exists) {
    return { exists: false, exported: false }
  }

  // Check if exported in index.ts
  const indexPath = 'src/domain/models/app/index.ts'
  if (!existsSync(indexPath)) {
    return { exists: true, exported: false }
  }

  const indexContent = readFileSync(indexPath, 'utf-8')
  const schemaName = `${propertyName.charAt(0).toUpperCase()}${propertyName.slice(1)}Schema`
  const exported = indexContent.includes(schemaName)

  return { exists: true, exported }
}

/**
 * Count test implementations in test file
 */
function countTestImplementations(testFilePath: string): number {
  if (!existsSync(testFilePath)) {
    return 0
  }

  const content = readFileSync(testFilePath, 'utf-8')

  // Count non-fixme tests (actually implemented)
  // Match: test('...', ...) or test.only('...', ...)
  // Exclude: test.fixme('...', ...)
  const testMatches = content.match(/test(?:\.only)?\s*\(/g)
  const fixmeMatches = content.match(/test\.fixme\s*\(/g)

  const totalTests = testMatches?.length || 0
  const fixmeTests = fixmeMatches?.length || 0

  return totalTests - fixmeTests
}

/**
 * Extract expected test count from user stories
 */
function extractExpectedTestCount(propertyName: string): number {
  // Read property roadmap file to extract expected test count
  const fileName = propertyNameToFileName(propertyName)
  const roadmapFilePath = join('docs/specifications/roadmap', `${fileName}.md`)

  if (!existsSync(roadmapFilePath)) {
    return 0
  }

  const content = readFileSync(roadmapFilePath, 'utf-8')

  // Count occurrences of "- **Tag**: `@spec`", "@regression", "@critical"
  const specMatches = content.match(/- \*\*Tag\*\*: `@spec`/g)
  const regressionMatches = content.match(/- \*\*Tag\*\*: `@regression`/g)
  const criticalMatches = content.match(/- \*\*Tag\*\*: `@critical`/g)

  const specCount = specMatches?.length || 0
  const regressionCount = regressionMatches?.length || 0
  const criticalCount = criticalMatches?.length || 0

  return specCount + regressionCount + criticalCount
}

/**
 * Check if unit tests exist for schema
 */
function checkUnitTests(propertyName: string): boolean {
  const fileName = propertyNameToFileName(propertyName)
  const unitTestPath = join('src/domain/models/app', `${fileName}.test.ts`)

  return existsSync(unitTestPath)
}

/**
 * Get complete implementation status for a property
 */
export function getImplementationStatus(propertyName: string): ImplementationStatus {
  const fileName = propertyNameToFileName(propertyName)
  const testFilePath = join('tests/app', `${fileName}.spec.ts`)

  // Check schema implementation
  const schema = checkSchemaImplementation(propertyName)

  // Check test implementation
  const testFileExists = existsSync(testFilePath)
  const implementedTestCount = countTestImplementations(testFilePath)
  const expectedTestCount = extractExpectedTestCount(propertyName)

  // Check unit tests
  const hasUnitTests = checkUnitTests(propertyName)

  return {
    schemaFileExists: schema.exists,
    schemaExported: schema.exported,
    testFileExists,
    expectedTestCount,
    implementedTestCount,
    hasUnitTests,
  }
}
