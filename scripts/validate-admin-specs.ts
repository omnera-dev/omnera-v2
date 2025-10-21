/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { join, relative, basename } from 'node:path'

/**
 * Validation Script for specs/admin/ Directory
 *
 * Validates that the admin specs directory follows the established patterns:
 * 1. Directory structure ({feature-name}/{feature-name}.{json,spec.ts})
 * 2. Fixture import paths (from '../fixtures')
 * 3. Copyright headers
 * 4. Test tags (@spec, @regression)
 * 5. Given-When-Then format in specs
 * 6. JSON spec structure (title, description, specs array)
 */

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  info: string[]
}

interface SpecJson {
  title: string
  description: string
  specs: Array<{
    id: string
    given: string
    when: string
    then: string
  }>
}

const SPECS_ADMIN_DIR = join(process.cwd(), 'specs/admin')
const EXPECTED_COPYRIGHT = 'Copyright (c) 2025 ESSENTIAL SERVICES'
const EXPECTED_LICENSE = 'Business Source License 1.1'
const EXPECTED_FIXTURE_IMPORT = "from '../fixtures'"

async function validateAdminSpecs(): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: [],
  }

  result.info.push(`Validating specs/admin/ directory structure...`)

  try {
    // Read admin directory
    const entries = await readdir(SPECS_ADMIN_DIR, { withFileTypes: true })
    const directories = entries.filter((e) => e.isDirectory() && !e.name.startsWith('.'))

    if (directories.length === 0) {
      result.errors.push('No feature directories found in specs/admin/')
      result.valid = false
      return result
    }

    result.info.push(`Found ${directories.length} feature directories`)

    // Validate each feature directory
    for (const dir of directories) {
      await validateFeatureDirectory(join(SPECS_ADMIN_DIR, dir.name), dir.name, result)
    }

    // Summary
    if (result.errors.length === 0 && result.warnings.length === 0) {
      result.info.push('✅ All validations passed!')
    } else {
      result.info.push(
        `\n📊 Summary: ${result.errors.length} errors, ${result.warnings.length} warnings`
      )
    }
  } catch (error) {
    result.errors.push(`Failed to read specs/admin/ directory: ${error}`)
    result.valid = false
  }

  return result
}

async function validateFeatureDirectory(
  dirPath: string,
  featureName: string,
  result: ValidationResult
): Promise<void> {
  result.info.push(`\n📁 Validating ${featureName}/`)

  const jsonFile = join(dirPath, `${featureName}.json`)
  const specFile = join(dirPath, `${featureName}.spec.ts`)

  // Check if required files exist
  const [jsonExists, specExists] = await Promise.all([
    fileExists(jsonFile),
    fileExists(specFile),
  ])

  if (!jsonExists) {
    result.errors.push(`  ❌ Missing ${featureName}.json`)
    result.valid = false
  }

  if (!specExists) {
    result.errors.push(`  ❌ Missing ${featureName}.spec.ts`)
    result.valid = false
  }

  // Validate JSON file
  if (jsonExists) {
    await validateJsonSpec(jsonFile, featureName, result)
  }

  // Validate TypeScript spec file
  if (specExists) {
    await validateSpecFile(specFile, featureName, result)
  }

  // Check for extra files
  const files = await readdir(dirPath)
  const expectedFiles = new Set([`${featureName}.json`, `${featureName}.spec.ts`])
  const extraFiles = files.filter((f) => !expectedFiles.has(f) && !f.startsWith('.'))

  if (extraFiles.length > 0) {
    result.warnings.push(`  ⚠️  Extra files found: ${extraFiles.join(', ')}`)
  }
}

async function validateJsonSpec(
  filePath: string,
  featureName: string,
  result: ValidationResult
): Promise<void> {
  try {
    const content = await readFile(filePath, 'utf-8')
    const spec: SpecJson = JSON.parse(content)

    // Validate structure
    if (!spec.title) {
      result.errors.push(`  ❌ ${featureName}.json: Missing 'title' field`)
      result.valid = false
    }

    if (!spec.description) {
      result.errors.push(`  ❌ ${featureName}.json: Missing 'description' field`)
      result.valid = false
    }

    if (!Array.isArray(spec.specs)) {
      result.errors.push(`  ❌ ${featureName}.json: 'specs' must be an array`)
      result.valid = false
      return
    }

    if (spec.specs.length === 0) {
      result.warnings.push(`  ⚠️  ${featureName}.json: No specs defined`)
    }

    // Validate each spec
    spec.specs.forEach((s, index) => {
      if (!s.id) {
        result.errors.push(`  ❌ ${featureName}.json: Spec ${index} missing 'id'`)
        result.valid = false
      } else if (!s.id.startsWith('ADMIN-')) {
        result.warnings.push(`  ⚠️  ${featureName}.json: Spec ${s.id} should start with 'ADMIN-'`)
      }

      if (!s.given || !s.when || !s.then) {
        result.errors.push(`  ❌ ${featureName}.json: Spec ${s.id} incomplete Given-When-Then`)
        result.valid = false
      }
    })

    result.info.push(`  ✓ ${featureName}.json: ${spec.specs.length} specs defined`)
  } catch (error) {
    if (error instanceof SyntaxError) {
      result.errors.push(`  ❌ ${featureName}.json: Invalid JSON syntax`)
    } else {
      result.errors.push(`  ❌ ${featureName}.json: Failed to validate - ${error}`)
    }
    result.valid = false
  }
}

async function validateSpecFile(
  filePath: string,
  featureName: string,
  result: ValidationResult
): Promise<void> {
  try {
    const content = await readFile(filePath, 'utf-8')

    // Check copyright header
    if (!content.includes(EXPECTED_COPYRIGHT)) {
      result.errors.push(`  ❌ ${featureName}.spec.ts: Missing copyright header`)
      result.valid = false
    }

    if (!content.includes(EXPECTED_LICENSE)) {
      result.errors.push(`  ❌ ${featureName}.spec.ts: Missing BSL 1.1 license reference`)
      result.valid = false
    }

    // Check fixture import
    if (!content.includes(EXPECTED_FIXTURE_IMPORT)) {
      result.errors.push(`  ❌ ${featureName}.spec.ts: Missing or incorrect fixture import`)
      result.errors.push(`     Expected: import { test, expect } from '../fixtures'`)
      result.valid = false
    }

    // Check for test.describe
    if (!content.includes('test.describe(')) {
      result.warnings.push(`  ⚠️  ${featureName}.spec.ts: No test.describe() found`)
    }

    // Check for test tags
    const hasSpecTag = content.includes("tag: '@spec'") || content.includes('tag: "@spec"')
    const hasRegressionTag =
      content.includes("tag: '@regression'") || content.includes('tag: "@regression"')

    if (!hasSpecTag) {
      result.warnings.push(`  ⚠️  ${featureName}.spec.ts: No @spec tag found`)
    }

    if (!hasRegressionTag) {
      result.warnings.push(`  ⚠️  ${featureName}.spec.ts: No @regression tag found`)
    }

    // Check for Given-When-Then comments
    const hasGiven = content.includes('// GIVEN:')
    const hasWhen = content.includes('// WHEN:')
    const hasThen = content.includes('// THEN:')

    if (!hasGiven || !hasWhen || !hasThen) {
      result.warnings.push(
        `  ⚠️  ${featureName}.spec.ts: Missing Given-When-Then comment structure`
      )
    }

    // Count tests
    const testCount = (content.match(/test\.(fixme|skip)?\(/g) || []).length
    result.info.push(`  ✓ ${featureName}.spec.ts: ${testCount} tests defined`)
  } catch (error) {
    result.errors.push(`  ❌ ${featureName}.spec.ts: Failed to validate - ${error}`)
    result.valid = false
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

function formatResults(result: ValidationResult): string {
  const lines: string[] = []

  lines.push('═'.repeat(80))
  lines.push('  ADMIN SPECS VALIDATION REPORT')
  lines.push('═'.repeat(80))
  lines.push('')

  // Info messages
  if (result.info.length > 0) {
    lines.push(...result.info.map((msg) => msg))
    lines.push('')
  }

  // Warnings
  if (result.warnings.length > 0) {
    lines.push('⚠️  WARNINGS:')
    lines.push('─'.repeat(80))
    lines.push(...result.warnings)
    lines.push('')
  }

  // Errors
  if (result.errors.length > 0) {
    lines.push('❌ ERRORS:')
    lines.push('─'.repeat(80))
    lines.push(...result.errors)
    lines.push('')
  }

  lines.push('═'.repeat(80))

  return lines.join('\n')
}

// Run validation
async function main() {
  console.log('Starting admin specs validation...\n')

  const result = await validateAdminSpecs()
  const report = formatResults(result)

  console.log(report)

  // Exit with appropriate code
  if (!result.valid) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Validation script failed:', error)
  process.exit(1)
})
