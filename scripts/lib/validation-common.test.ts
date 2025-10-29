/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, test, expect, beforeEach } from 'bun:test'
import {
  validateSpecsArray,
  validateSpec,
  validateSpecIdFormat,
  validateSpecIdUniqueness,
  validateTestFile,
  validateCopyrightHeader,
  validateTestTags,
  validateRegressionTest,
  validateSpecToTestMapping,
  validateTestTitlesStartWithSpecIds,
  createValidationResult,
  type ValidationResult,
  type Spec,
} from './validation-common'

// ============================================================================
// Test Helpers
// ============================================================================

function createTestResult(): ValidationResult {
  return {
    errors: [],
    warnings: [],
    totalSchemas: 0,
    totalSpecs: 0,
    passed: true,
  }
}

const TEST_SPEC: Spec = {
  id: 'APP-TEST-001',
  given: 'a test scenario',
  when: 'something happens',
  then: 'expected outcome',
}

// ============================================================================
// Spec ID Format Validation
// ============================================================================

describe('validateSpecIdFormat', () => {
  test('accepts valid APP spec ID', () => {
    const result = createTestResult()
    validateSpecIdFormat('APP-NAME-001', 'test.json', 'APP', result)
    expect(result.errors).toHaveLength(0)
  })

  test('accepts valid ADMIN spec ID', () => {
    const result = createTestResult()
    validateSpecIdFormat('ADMIN-USER-001', 'test.json', 'ADMIN', result)
    expect(result.errors).toHaveLength(0)
  })

  test('accepts valid API spec ID', () => {
    const result = createTestResult()
    validateSpecIdFormat('API-ENDPOINT-001', 'test.json', 'API', result)
    expect(result.errors).toHaveLength(0)
  })

  test('accepts multi-digit numbers', () => {
    const result = createTestResult()
    validateSpecIdFormat('APP-NAME-123', 'test.json', 'APP', result)
    expect(result.errors).toHaveLength(0)
  })

  test('accepts hyphens in entity name', () => {
    const result = createTestResult()
    validateSpecIdFormat('APP-FIELD-TYPE-001', 'test.json', 'APP', result)
    expect(result.errors).toHaveLength(0)
  })

  test('rejects wrong prefix', () => {
    const result = createTestResult()
    validateSpecIdFormat('ADMIN-NAME-001', 'test.json', 'APP', result)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]?.message).toContain('Invalid spec ID format')
    expect(result.passed).toBe(false)
  })

  test('rejects lowercase prefix', () => {
    const result = createTestResult()
    validateSpecIdFormat('app-name-001', 'test.json', 'APP', result)
    expect(result.errors).toHaveLength(1)
  })

  test('rejects missing number suffix', () => {
    const result = createTestResult()
    validateSpecIdFormat('APP-NAME', 'test.json', 'APP', result)
    expect(result.errors).toHaveLength(1)
  })

  test('rejects number suffix too short', () => {
    const result = createTestResult()
    validateSpecIdFormat('APP-NAME-01', 'test.json', 'APP', result)
    expect(result.errors).toHaveLength(1)
  })
})

// ============================================================================
// Spec ID Uniqueness Validation
// ============================================================================

describe('validateSpecIdUniqueness', () => {
  test('accepts first occurrence of spec ID', () => {
    const result = createTestResult()
    const globalIds = new Set<string>()
    validateSpecIdUniqueness('APP-NAME-001', 'test.json', globalIds, result)
    expect(result.errors).toHaveLength(0)
    expect(globalIds.has('APP-NAME-001')).toBe(true)
  })

  test('rejects duplicate spec ID', () => {
    const result = createTestResult()
    const globalIds = new Set<string>(['APP-NAME-001'])
    validateSpecIdUniqueness('APP-NAME-001', 'test.json', globalIds, result)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]?.message).toContain('Duplicate spec ID')
    expect(result.passed).toBe(false)
  })
})

// ============================================================================
// Spec Object Validation
// ============================================================================

describe('validateSpec', () => {
  test('accepts valid spec with all required fields', () => {
    const result = createTestResult()
    const globalIds = new Set<string>()
    validateSpec(TEST_SPEC, 0, 'test.json', 'APP', result, globalIds)
    expect(result.errors).toHaveLength(0)
  })

  test('rejects spec missing id field', () => {
    const result = createTestResult()
    const globalIds = new Set<string>()
    const spec = { ...TEST_SPEC, id: '' }
    validateSpec(spec, 0, 'test.json', 'APP', result, globalIds)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.passed).toBe(false)
  })

  test('rejects spec missing given field', () => {
    const result = createTestResult()
    const globalIds = new Set<string>()
    const spec = { ...TEST_SPEC, given: '' }
    validateSpec(spec, 0, 'test.json', 'APP', result, globalIds)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.passed).toBe(false)
  })

  test('warns about overly long given clause', () => {
    const result = createTestResult()
    const globalIds = new Set<string>()
    const spec = {
      ...TEST_SPEC,
      given: 'a'.repeat(201),
    }
    validateSpec(spec, 0, 'test.json', 'APP', result, globalIds)
    expect(result.warnings.length).toBeGreaterThan(0)
  })

  test('warns about overly long when clause', () => {
    const result = createTestResult()
    const globalIds = new Set<string>()
    const spec = {
      ...TEST_SPEC,
      when: 'a'.repeat(201),
    }
    validateSpec(spec, 0, 'test.json', 'APP', result, globalIds)
    expect(result.warnings.length).toBeGreaterThan(0)
  })

  test('warns about overly long then clause', () => {
    const result = createTestResult()
    const globalIds = new Set<string>()
    const spec = {
      ...TEST_SPEC,
      then: 'a'.repeat(201),
    }
    validateSpec(spec, 0, 'test.json', 'APP', result, globalIds)
    expect(result.warnings.length).toBeGreaterThan(0)
  })
})

// ============================================================================
// Specs Array Validation
// ============================================================================

describe('validateSpecsArray', () => {
  test('accepts valid specs array', () => {
    const result = createTestResult()
    const globalIds = new Set<string>()
    const content = {
      specs: [TEST_SPEC],
    }
    validateSpecsArray(content, 'test.json', 'APP', result, globalIds)
    expect(result.errors).toHaveLength(0)
  })

  test('rejects missing specs array', () => {
    const result = createTestResult()
    const globalIds = new Set<string>()
    const content = {}
    validateSpecsArray(content, 'test.json', 'APP', result, globalIds)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]?.message).toContain('Missing required "x-specs" or "specs" array')
    expect(result.passed).toBe(false)
  })

  test('rejects non-array specs', () => {
    const result = createTestResult()
    const globalIds = new Set<string>()
    const content = {
      specs: 'not an array',
    }
    validateSpecsArray(content, 'test.json', 'APP', result, globalIds)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]?.message).toContain('"specs" must be an array')
    expect(result.passed).toBe(false)
  })

  test('warns about empty specs array', () => {
    const result = createTestResult()
    const globalIds = new Set<string>()
    const content = {
      specs: [],
    }
    validateSpecsArray(content, 'test.json', 'APP', result, globalIds)
    expect(result.warnings).toHaveLength(1)
    expect(result.warnings[0]?.message).toContain(
      'specs array is empty - no specifications defined'
    )
  })

  test('validates multiple specs', () => {
    const result = createTestResult()
    const globalIds = new Set<string>()
    const content = {
      specs: [
        { ...TEST_SPEC, id: 'APP-TEST-001' },
        { ...TEST_SPEC, id: 'APP-TEST-002' },
      ],
    }
    validateSpecsArray(content, 'test.json', 'APP', result, globalIds)
    expect(result.errors).toHaveLength(0)
    expect(globalIds.size).toBe(2)
  })
})

// ============================================================================
// Copyright Header Validation
// ============================================================================

describe('validateCopyrightHeader', () => {
  const validHeader = `/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */`

  test('accepts valid copyright header', () => {
    const result = createTestResult()
    validateCopyrightHeader(validHeader, 'test.ts', result)
    expect(result.errors).toHaveLength(0)
  })

  test('rejects missing copyright', () => {
    const result = createTestResult()
    const content = 'some code without copyright'
    validateCopyrightHeader(content, 'test.ts', result)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.passed).toBe(false)
  })

  test('rejects missing license reference', () => {
    const result = createTestResult()
    const content = 'Copyright (c) 2025 ESSENTIAL SERVICES'
    validateCopyrightHeader(content, 'test.ts', result)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.passed).toBe(false)
  })
})

// ============================================================================
// Test Tags Validation
// ============================================================================

describe('validateTestTags', () => {
  test('accepts file with correct number of @spec tags', () => {
    const result = createTestResult()
    const content = `
      test('APP-TEST-001: test 1', { tag: '@spec' }, async () => {})
      test('APP-TEST-002: test 2', { tag: '@spec' }, async () => {})
    `
    validateTestTags(content, 'test.spec.ts', 2, result)
    const specWarnings = result.warnings.filter((w) => w.message.includes('@spec'))
    expect(specWarnings).toHaveLength(0)
  })

  test('warns about missing @spec tags', () => {
    const result = createTestResult()
    const content = 'test("test 1", async () => {})'
    validateTestTags(content, 'test.spec.ts', 1, result)
    expect(result.warnings.length).toBeGreaterThan(0)
  })

  test('warns about incorrect number of @spec tags', () => {
    const result = createTestResult()
    const content = `test('APP-TEST-001: test 1', { tag: '@spec' }, async () => {})`
    validateTestTags(content, 'test.spec.ts', 2, result)
    expect(result.warnings.length).toBeGreaterThan(0)
  })

  test('warns about missing @regression tag', () => {
    const result = createTestResult()
    const content = `test('APP-TEST-001: test 1', { tag: '@spec' }, async () => {})`
    validateTestTags(content, 'test.spec.ts', 1, result)
    const regressionWarnings = result.warnings.filter((w) => w.message.includes('@regression'))
    expect(regressionWarnings.length).toBeGreaterThan(0)
  })
})

// ============================================================================
// Regression Test Validation
// ============================================================================

describe('validateRegressionTest', () => {
  test('accepts file with exactly one @regression tag', () => {
    const result = createTestResult()
    const content = `
      test('APP-TEST-001: spec test', { tag: '@spec' }, async () => {})
      test('regression test', { tag: '@regression' }, async () => {})
    `
    validateRegressionTest(content, 'test.spec.ts', result)
    expect(result.errors).toHaveLength(0)
  })

  test('rejects file with no @regression tag', () => {
    const result = createTestResult()
    const content = `test('APP-TEST-001: spec test', { tag: '@spec' }, async () => {})`
    validateRegressionTest(content, 'test.spec.ts', result)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]?.message).toContain('Missing @regression test')
    expect(result.passed).toBe(false)
  })

  test('rejects file with multiple @regression tags', () => {
    const result = createTestResult()
    const content = `
      test('regression 1', { tag: '@regression' }, async () => {})
      test('regression 2', { tag: '@regression' }, async () => {})
    `
    validateRegressionTest(content, 'test.spec.ts', result)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]?.message).toContain('Found 2 @regression tests')
    expect(result.passed).toBe(false)
  })
})

// ============================================================================
// Spec-to-Test Mapping Validation
// ============================================================================

describe('validateSpecToTestMapping', () => {
  const specs: Spec[] = [
    { id: 'APP-TEST-001', given: 'a', when: 'b', then: 'c' },
    { id: 'APP-TEST-002', given: 'a', when: 'b', then: 'c' },
  ]

  test('accepts file with all spec IDs mapped', () => {
    const result = createTestResult()
    const content = `
      // APP-TEST-001: test description
      test('APP-TEST-001: test 1', { tag: '@spec' }, async () => {})

      // APP-TEST-002: test description
      test('APP-TEST-002: test 2', { tag: '@spec' }, async () => {})
    `
    validateSpecToTestMapping(content, specs, 'test.spec.ts', result)
    expect(result.errors).toHaveLength(0)
  })

  test('rejects file missing spec ID comment', () => {
    const result = createTestResult()
    const content = `
      // APP-TEST-001: test description
      test('APP-TEST-001: test 1', { tag: '@spec' }, async () => {})
    `
    validateSpecToTestMapping(content, specs, 'test.spec.ts', result)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]?.message).toContain('Missing test for spec APP-TEST-002')
    expect(result.passed).toBe(false)
  })

  test('warns about unmapped spec IDs in test titles', () => {
    const result = createTestResult()
    const content = `
      // APP-TEST-001: test description
      test('APP-TEST-001: test 1', { tag: '@spec' }, async () => {})

      // APP-TEST-999: unknown spec
      test('APP-TEST-999: test 2', { tag: '@spec' }, async () => {})
    `
    const firstSpec = specs[0]
    if (!firstSpec) throw new Error('Expected first spec to exist')
    validateSpecToTestMapping(content, [firstSpec], 'test.spec.ts', result)
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.warnings[0]?.message).toContain(
      'Test title references unknown spec ID: APP-TEST-999'
    )
  })
})

// ============================================================================
// Test File Validation (Integration)
// ============================================================================

describe.serial('validateTestFile', () => {
  const baseDir = join(process.cwd(), 'tmp', 'validation-common')

  // Ensure directory exists (will be created on first test run)
  beforeEach(async () => {
    await mkdir(baseDir, { recursive: true })
  })

  test('validates complete valid test file', async () => {
    const uniqueId = `valid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const testFile = join(baseDir, `${uniqueId}.spec.ts`)

    const result = createTestResult()
    const specs: Spec[] = [{ id: 'APP-TEST-001', given: 'a', when: 'b', then: 'c' }]

    const content = `/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test } from '@playwright/test'

// APP-TEST-001: test description
test('APP-TEST-001: spec test', { tag: '@spec' }, async () => {
  // Test implementation
})

test('regression test', { tag: '@regression' }, async () => {
  // Regression test
})`

    await writeFile(testFile, content, 'utf-8')
    await validateTestFile(testFile, specs, 'APP', result)

    expect(result.errors).toHaveLength(0)
  })

  test('detects missing copyright header', async () => {
    const uniqueId = `no-copyright-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const testFile = join(baseDir, `${uniqueId}.spec.ts`)

    const result = createTestResult()
    const specs: Spec[] = [{ id: 'APP-TEST-001', given: 'a', when: 'b', then: 'c' }]

    const content = `
// APP-TEST-001: test description
test('APP-TEST-001: spec test', { tag: '@spec' }, async () => {})
test('regression test', { tag: '@regression' }, async () => {})`

    await writeFile(testFile, content, 'utf-8')
    await validateTestFile(testFile, specs, 'APP', result)

    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.passed).toBe(false)
  })

  test('handles file read errors gracefully', async () => {
    const result = createTestResult()
    const specs: Spec[] = []

    await validateTestFile('/nonexistent/file.spec.ts', specs, 'APP', result)

    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.warnings[0]?.message).toContain('Could not read test file')
  })
})

// ============================================================================
// Helper Functions
// ============================================================================

describe('createValidationResult', () => {
  test('creates result with correct initial values', () => {
    const result = createValidationResult()
    expect(result.errors).toEqual([])
    expect(result.warnings).toEqual([])
    expect(result.totalSchemas).toBe(0)
    expect(result.totalSpecs).toBe(0)
    expect(result.passed).toBe(true)
  })
})

// ============================================================================
// Test Title Validation
// ============================================================================

describe('validateTestTitlesStartWithSpecIds', () => {
  const specs: Spec[] = [
    {
      id: 'APP-NAME-001',
      given: 'app is configured',
      when: 'user provides name',
      then: 'name is validated',
    },
  ]

  test('accepts test title that starts with spec ID', () => {
    const result = createTestResult()
    const content = `
      // APP-NAME-001: description
      test('APP-NAME-001: should validate app name', { tag: '@spec' }, async () => {})
    `
    validateTestTitlesStartWithSpecIds(content, specs, 'test.spec.ts', result)
    expect(result.errors).toHaveLength(0)
  })

  test('accepts test with test.skip that starts with spec ID', () => {
    const result = createTestResult()
    const content = `
      // APP-NAME-001: description
      test.skip('APP-NAME-001: should validate app name', { tag: '@spec' }, async () => {})
    `
    validateTestTitlesStartWithSpecIds(content, specs, 'test.spec.ts', result)
    expect(result.errors).toHaveLength(0)
  })

  test('accepts test with test.fixme that starts with spec ID', () => {
    const result = createTestResult()
    const content = `
      // APP-NAME-001: description
      test.fixme('APP-NAME-001: should validate app name', { tag: '@spec' }, async () => {})
    `
    validateTestTitlesStartWithSpecIds(content, specs, 'test.spec.ts', result)
    expect(result.errors).toHaveLength(0)
  })

  test('rejects test title that does not start with spec ID', () => {
    const result = createTestResult()
    const content = `
      // APP-NAME-001: description
      test('should validate app name', { tag: '@spec' }, async () => {})
    `
    validateTestTitlesStartWithSpecIds(content, specs, 'test.spec.ts', result)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]?.message).toContain('Missing test for spec APP-NAME-001')
    expect(result.errors[0]?.message).toContain('APP-NAME-001:')
    expect(result.passed).toBe(false)
  })

  test('rejects test title with wrong spec ID', () => {
    const result = createTestResult()
    const content = `
      // APP-NAME-001: description
      test('APP-NAME-002: should validate app name', { tag: '@spec' }, async () => {})
    `
    validateTestTitlesStartWithSpecIds(content, specs, 'test.spec.ts', result)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]?.message).toContain('Missing test for spec APP-NAME-001')
    expect(result.errors[0]?.message).toContain('APP-NAME-001:')
  })

  test('handles multi-segment spec IDs', () => {
    const result = createTestResult()
    const multiSegmentSpecs: Spec[] = [
      { id: 'API-AUTH-SIGN-UP-EMAIL-001', given: 'a', when: 'b', then: 'c' },
    ]
    const content = `
      // API-AUTH-SIGN-UP-EMAIL-001: description
      test('API-AUTH-SIGN-UP-EMAIL-001: should sign up with email', async () => {})
    `
    validateTestTitlesStartWithSpecIds(content, multiSegmentSpecs, 'test.spec.ts', result)
    expect(result.errors).toHaveLength(0)
  })

  test('allows tests without spec IDs when no specs are provided', () => {
    const result = createTestResult()
    const content = `
      test('some other test', async () => {})
    `
    validateTestTitlesStartWithSpecIds(content, [], 'test.spec.ts', result)
    expect(result.errors).toHaveLength(0)
  })
})
