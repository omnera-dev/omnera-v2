/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import {
  validateSpecsArray,
  validateTestFile,
  createValidationResult,
  printValidationResults,
  type ValidationResult,
  type Spec,
} from './lib/validation-common'

/**
 * Validation Script for specs/admin/ Directory
 *
 * Validates that the admin specs directory follows the established patterns:
 * 1. Directory structure ({feature-name}/{feature-name}.{json,spec.ts})
 * 2. JSON spec structure (title, description, specs array)
 * 3. Spec ID format (ADMIN- prefix with strict format)
 * 4. Global spec ID uniqueness
 * 5. Copyright headers in test files
 * 6. Test tags (@spec, @regression)
 * 7. Spec-to-test mapping via ID comments
 * 8. Exactly one @regression test per file
 * 9. Given-When-Then format in specs
 */

const SPECS_ADMIN_DIR = join(process.cwd(), 'specs/admin')
const EXPECTED_FIXTURE_IMPORT = "from '../fixtures'"

async function validateAdminSpecs(): Promise<ValidationResult> {
  const result = createValidationResult()

  console.log('🔍 Validating specs/admin/ directory structure...\n')

  try {
    // Read admin directory
    const entries = await readdir(SPECS_ADMIN_DIR, { withFileTypes: true })
    const directories = entries.filter((e) => e.isDirectory() && !e.name.startsWith('.'))

    if (directories.length === 0) {
      result.errors.push({
        file: 'specs/admin/',
        type: 'error',
        message: 'No feature directories found',
      })
      result.passed = false
      printValidationResults(result, 'ADMIN SPECS VALIDATION')
      return result
    }

    console.log(`📁 Found ${directories.length} feature directories\n`)

    // Track spec IDs for global uniqueness check
    const globalSpecIds = new Set<string>()

    // Validate each feature directory
    for (const dir of directories) {
      await validateFeatureDirectory(
        join(SPECS_ADMIN_DIR, dir.name),
        dir.name,
        result,
        globalSpecIds
      )
    }

    // Print results
    printValidationResults(result, 'ADMIN SPECS VALIDATION')

    return result
  } catch (error) {
    result.errors.push({
      file: 'specs/admin/',
      type: 'error',
      message: `Failed to read directory: ${error}`,
    })
    result.passed = false
    printValidationResults(result, 'ADMIN SPECS VALIDATION')
    return result
  }
}

async function validateFeatureDirectory(
  dirPath: string,
  featureName: string,
  result: ValidationResult,
  globalSpecIds: Set<string>
): Promise<void> {
  const jsonFile = join(dirPath, `${featureName}.json`)
  const specFile = join(dirPath, `${featureName}.spec.ts`)
  const relativePath = `admin/${featureName}/${featureName}`

  // Check if required files exist
  const [jsonExists, specExists] = await Promise.all([fileExists(jsonFile), fileExists(specFile)])

  if (!jsonExists) {
    result.errors.push({
      file: `${relativePath}.json`,
      type: 'error',
      message: 'Required JSON spec file is missing',
    })
    result.passed = false
  }

  if (!specExists) {
    result.errors.push({
      file: `${relativePath}.spec.ts`,
      type: 'error',
      message: 'Required test file is missing',
    })
    result.passed = false
  }

  // Validate JSON file
  let specs: Spec[] = []
  if (jsonExists) {
    specs = await validateJsonSpec(jsonFile, relativePath + '.json', result, globalSpecIds)
    result.totalSchemas++
  }

  // Validate TypeScript spec file
  if (specExists) {
    await validateSpecFileContent(specFile, relativePath + '.spec.ts', specs, result)
  }

  // Check for extra files
  const files = await readdir(dirPath)
  const expectedFiles = new Set([`${featureName}.json`, `${featureName}.spec.ts`])
  const extraFiles = files.filter((f) => !expectedFiles.has(f) && !f.startsWith('.'))

  if (extraFiles.length > 0) {
    result.warnings.push({
      file: `${relativePath}/`,
      type: 'warning',
      message: `Extra files found: ${extraFiles.join(', ')}`,
    })
  }
}

async function validateJsonSpec(
  filePath: string,
  relativePath: string,
  result: ValidationResult,
  globalSpecIds: Set<string>
): Promise<Spec[]> {
  try {
    const content = await readFile(filePath, 'utf-8')
    const json = JSON.parse(content)

    // Validate title and description
    if (!json.title || typeof json.title !== 'string') {
      result.errors.push({
        file: relativePath,
        type: 'error',
        message: 'Missing or invalid "title" field',
      })
      result.passed = false
    }

    if (!json.description || typeof json.description !== 'string') {
      result.errors.push({
        file: relativePath,
        type: 'error',
        message: 'Missing or invalid "description" field',
      })
      result.passed = false
    }

    // Validate specs array using shared validation
    validateSpecsArray(json, relativePath, 'ADMIN', result, globalSpecIds)

    return json.specs || []
  } catch (error) {
    if (error instanceof SyntaxError) {
      result.errors.push({
        file: relativePath,
        type: 'error',
        message: 'Invalid JSON syntax',
      })
    } else {
      result.errors.push({
        file: relativePath,
        type: 'error',
        message: `Failed to validate: ${error}`,
      })
    }
    result.passed = false
    return []
  }
}

async function validateSpecFileContent(
  filePath: string,
  relativePath: string,
  specs: Spec[],
  result: ValidationResult
): Promise<void> {
  try {
    const content = await readFile(filePath, 'utf-8')

    // Use shared test file validation
    await validateTestFile(filePath, specs, 'ADMIN', result)

    // Additional admin-specific validation: fixture import
    if (!content.includes(EXPECTED_FIXTURE_IMPORT)) {
      result.errors.push({
        file: relativePath,
        type: 'error',
        message: `Missing or incorrect fixture import. Expected: import { test, expect } from '../fixtures'`,
      })
      result.passed = false
    }

    // Check for test.describe (recommended but not required)
    if (!content.includes('test.describe(')) {
      result.warnings.push({
        file: relativePath,
        type: 'warning',
        message: 'No test.describe() found - consider organizing tests in describe blocks',
      })
    }
  } catch (error) {
    result.errors.push({
      file: relativePath,
      type: 'error',
      message: `Failed to validate: ${error}`,
    })
    result.passed = false
  }
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

// Run validation
async function main() {
  const result = await validateAdminSpecs()

  // Exit with appropriate code
  if (!result.passed || result.errors.length > 0) {
    process.exit(1)
  }

  process.exit(0)
}

// Run if executed directly
if (import.meta.main) {
  main()
}

export { validateAdminSpecs }
export type { ValidationResult }
