/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Shared validation logic for specs/ directory structure
 *
 * This module provides common validation functions used across:
 * - scripts/validate-app-specs.ts
 * - scripts/validate-admin-specs.ts
 * - scripts/validate-api-specs.ts
 *
 * Enforces consistent rules for:
 * - Spec ID format and uniqueness
 * - Specs array structure
 * - Test file validation (copyright, tags, mapping)
 * - Regression test requirements
 */

import { readFile } from 'node:fs/promises'

// ============================================================================
// Types
// ============================================================================

export interface ValidationError {
  file: string
  type: 'error' | 'warning'
  message: string
  line?: number
}

export interface ValidationResult {
  errors: ValidationError[]
  warnings: ValidationError[]
  totalSchemas: number
  totalSpecs: number
  passed: boolean
}

export interface Spec {
  id: string
  given: string
  when: string
  then: string
  title?: string
}

export type SpecPrefix = 'APP' | 'ADMIN' | 'API'

// ============================================================================
// Constants
// ============================================================================

const EXPECTED_COPYRIGHT = 'Copyright (c) 2025 ESSENTIAL SERVICES'
const EXPECTED_LICENSE = 'Business Source License 1.1'

// Spec ID patterns for each directory
const SPEC_ID_PATTERNS: Record<SpecPrefix, RegExp> = {
  APP: /^APP-[A-Z][A-Z0-9-]*-\d{3,}$/,
  ADMIN: /^ADMIN-[A-Z][A-Z0-9-]*-\d{3,}$/,
  API: /^API-[A-Z][A-Z0-9-]*-\d{3,}$/,
}

// ============================================================================
// Specs Array Validation
// ============================================================================

/**
 * Validates that a schema has a valid specs array
 */
export function validateSpecsArray(
  content: any,
  filePath: string,
  prefix: SpecPrefix,
  result: ValidationResult,
  globalSpecIds: Set<string>
): void {
  // Check specs array exists
  if (!content.specs) {
    result.errors.push({
      file: filePath,
      type: 'error',
      message: 'Missing required "specs" array',
    })
    result.passed = false
    return
  }

  if (!Array.isArray(content.specs)) {
    result.errors.push({
      file: filePath,
      type: 'error',
      message: '"specs" must be an array',
    })
    result.passed = false
    return
  }

  if (content.specs.length === 0) {
    result.warnings.push({
      file: filePath,
      type: 'warning',
      message: 'Specs array is empty - no specifications defined',
    })
  }

  // Validate each spec
  content.specs.forEach((spec: any, index: number) => {
    validateSpec(spec, index, filePath, prefix, result, globalSpecIds)
  })
}

/**
 * Validates a single spec object
 */
export function validateSpec(
  spec: any,
  index: number,
  filePath: string,
  prefix: SpecPrefix,
  result: ValidationResult,
  globalSpecIds: Set<string>
): void {
  const requiredFields: (keyof Spec)[] = ['id', 'given', 'when', 'then']

  // Check required fields
  for (const field of requiredFields) {
    if (!spec[field] || typeof spec[field] !== 'string') {
      result.errors.push({
        file: filePath,
        type: 'error',
        message: `Spec at index ${index} missing or invalid field: ${field}`,
      })
      result.passed = false
    }
  }

  // Validate spec ID format
  if (spec.id) {
    validateSpecIdFormat(spec.id, filePath, prefix, result)
    validateSpecIdUniqueness(spec.id, filePath, globalSpecIds, result)
  }

  // Check string lengths (should be concise)
  const maxLength = 200
  if (spec.given && spec.given.length > maxLength) {
    result.warnings.push({
      file: filePath,
      type: 'warning',
      message: `Spec ${spec.id} has overly long "given" clause (${spec.given.length} chars)`,
    })
  }

  if (spec.when && spec.when.length > maxLength) {
    result.warnings.push({
      file: filePath,
      type: 'warning',
      message: `Spec ${spec.id} has overly long "when" clause (${spec.when.length} chars)`,
    })
  }

  if (spec.then && spec.then.length > maxLength) {
    result.warnings.push({
      file: filePath,
      type: 'warning',
      message: `Spec ${spec.id} has overly long "then" clause (${spec.then.length} chars)`,
    })
  }
}

// ============================================================================
// Spec ID Validation
// ============================================================================

/**
 * Validates spec ID format matches expected pattern
 */
export function validateSpecIdFormat(
  specId: string,
  filePath: string,
  prefix: SpecPrefix,
  result: ValidationResult
): void {
  const pattern = SPEC_ID_PATTERNS[prefix]

  if (!pattern.test(specId)) {
    result.errors.push({
      file: filePath,
      type: 'error',
      message: `Invalid spec ID format: ${specId}. Expected format: ${prefix}-{ENTITY}-{NNN} (e.g., ${prefix}-NAME-001)`,
    })
    result.passed = false
  }
}

/**
 * Validates spec ID is globally unique
 */
export function validateSpecIdUniqueness(
  specId: string,
  filePath: string,
  globalSpecIds: Set<string>,
  result: ValidationResult
): void {
  if (globalSpecIds.has(specId)) {
    result.errors.push({
      file: filePath,
      type: 'error',
      message: `Duplicate spec ID: ${specId} (spec IDs must be globally unique)`,
    })
    result.passed = false
  } else {
    globalSpecIds.add(specId)
  }
}

// ============================================================================
// Test File Validation
// ============================================================================

/**
 * Validates a .spec.ts test file
 */
export async function validateTestFile(
  testFilePath: string,
  specs: Spec[],
  prefix: SpecPrefix,
  result: ValidationResult
): Promise<void> {
  try {
    const content = await readFile(testFilePath, 'utf-8')

    // Validate copyright header
    validateCopyrightHeader(content, testFilePath, result)

    // Validate test tags
    validateTestTags(content, testFilePath, specs.length, result)

    // Validate regression test
    validateRegressionTest(content, testFilePath, result)

    // Validate spec-to-test mapping
    validateSpecToTestMapping(content, specs, testFilePath, result)
  } catch (error) {
    result.warnings.push({
      file: testFilePath,
      type: 'warning',
      message: `Could not read test file: ${error}`,
    })
  }
}

/**
 * Validates copyright header is present
 */
export function validateCopyrightHeader(
  content: string,
  filePath: string,
  result: ValidationResult
): void {
  if (!content.includes(EXPECTED_COPYRIGHT)) {
    result.errors.push({
      file: filePath,
      type: 'error',
      message: `Missing copyright header: ${EXPECTED_COPYRIGHT}`,
    })
    result.passed = false
  }

  if (!content.includes(EXPECTED_LICENSE)) {
    result.errors.push({
      file: filePath,
      type: 'error',
      message: `Missing license reference: ${EXPECTED_LICENSE}`,
    })
    result.passed = false
  }
}

/**
 * Validates test tags (@spec and @regression)
 */
export function validateTestTags(
  content: string,
  filePath: string,
  expectedSpecCount: number,
  result: ValidationResult
): void {
  // Count @spec tags
  const specTagMatches = content.match(/tag:\s*['"]@spec['"]/g)
  const specTagCount = specTagMatches ? specTagMatches.length : 0

  if (specTagCount === 0) {
    result.warnings.push({
      file: filePath,
      type: 'warning',
      message: 'No @spec tags found - test file may be incomplete',
    })
  } else if (specTagCount !== expectedSpecCount) {
    result.warnings.push({
      file: filePath,
      type: 'warning',
      message: `Expected ${expectedSpecCount} @spec tests (one per spec), found ${specTagCount}`,
    })
  }

  // Count @regression tags
  const regressionTagMatches = content.match(/tag:\s*['"]@regression['"]/g)
  const regressionTagCount = regressionTagMatches ? regressionTagMatches.length : 0

  if (regressionTagCount === 0) {
    result.warnings.push({
      file: filePath,
      type: 'warning',
      message: 'No @regression tag found - missing integration test',
    })
  }
}

/**
 * Validates exactly ONE @regression test exists
 */
export function validateRegressionTest(
  content: string,
  filePath: string,
  result: ValidationResult
): void {
  const regressionTagMatches = content.match(/tag:\s*['"]@regression['"]/g)
  const regressionTagCount = regressionTagMatches ? regressionTagMatches.length : 0

  if (regressionTagCount === 0) {
    result.errors.push({
      file: filePath,
      type: 'error',
      message: 'Missing @regression test - exactly ONE regression test is required per file',
    })
    result.passed = false
  } else if (regressionTagCount > 1) {
    result.errors.push({
      file: filePath,
      type: 'error',
      message: `Found ${regressionTagCount} @regression tests - exactly ONE is required per file`,
    })
    result.passed = false
  }
}

/**
 * Validates spec-to-test mapping via ID comments
 */
export function validateSpecToTestMapping(
  content: string,
  specs: Spec[],
  filePath: string,
  result: ValidationResult
): void {
  // Extract all spec ID comments from test file
  // Pattern matches: // API-AUTH-SIGN-UP-EMAIL-001: or // APP-NAME-001:
  const specIdCommentPattern = /\/\/\s*([A-Z]+(?:-[A-Z]+)*-\d{3,}):/g
  const foundSpecIds = new Set<string>()
  let match

  while ((match = specIdCommentPattern.exec(content)) !== null) {
    if (match[1]) {
      foundSpecIds.add(match[1])
    }
  }

  // Check that all specs have corresponding test comments
  const expectedSpecIds = new Set(specs.map((s) => s.id))

  for (const specId of expectedSpecIds) {
    if (!foundSpecIds.has(specId)) {
      result.errors.push({
        file: filePath,
        type: 'error',
        message: `Missing test for spec ${specId} - no matching comment found (expected: // ${specId}: ...)`,
      })
      result.passed = false
    }
  }

  // Check for unmapped tests (spec IDs in comments but not in specs array)
  for (const foundId of foundSpecIds) {
    if (!expectedSpecIds.has(foundId)) {
      result.warnings.push({
        file: filePath,
        type: 'warning',
        message: `Test references unknown spec ID: ${foundId} (not found in co-located .json file)`,
      })
    }
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates a new validation result object
 */
export function createValidationResult(): ValidationResult {
  return {
    errors: [],
    warnings: [],
    totalSchemas: 0,
    totalSpecs: 0,
    passed: true,
  }
}

/**
 * Prints validation results to console
 */
export function printValidationResults(result: ValidationResult, title: string): void {
  console.log('\n' + '='.repeat(80))
  console.log(title)
  console.log('='.repeat(80) + '\n')

  console.log(`📊 Total Schemas: ${result.totalSchemas}`)
  console.log(`📋 Total Specs: ${result.totalSpecs}`)
  console.log(`❌ Errors: ${result.errors.length}`)
  console.log(`⚠️  Warnings: ${result.warnings.length}`)
  console.log()

  if (result.errors.length > 0) {
    console.log('❌ ERRORS:\n')
    result.errors.forEach((error) => {
      console.log(`  ${error.file}`)
      console.log(`    → ${error.message}\n`)
    })
  }

  if (result.warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n')
    result.warnings.forEach((warning) => {
      console.log(`  ${warning.file}`)
      console.log(`    → ${warning.message}\n`)
    })
  }

  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log('✅ All validations passed!\n')
  }

  console.log('='.repeat(80) + '\n')
}
