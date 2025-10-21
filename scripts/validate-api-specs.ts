/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { join, dirname, relative } from 'node:path'

/**
 * Validation script for specs/api/ directory structure
 *
 * This script validates that the specs/api/ directory follows all patterns
 * documented in specs/api/README.md:
 *
 * 1. Co-location Pattern: Each .json has a .spec.ts
 * 2. URL-Based Organization: Directory structure mirrors URL paths
 * 3. HTTP Method Files: Each method is a separate file (get.json, post.json, etc.)
 * 4. Shared Components: All $ref paths are valid
 * 5. Specs Array: Each endpoint .json has a specs array
 * 6. Test Organization: All tests use @spec tag and Given-When-Then
 */

interface ValidationResult {
  passed: boolean
  errors: string[]
  warnings: string[]
  stats: {
    totalEndpoints: number
    totalTests: number
    totalSpecs: number
    missingTests: number
    missingSpecs: number
    invalidRefs: number
  }
}

const result: ValidationResult = {
  passed: true,
  errors: [],
  warnings: [],
  stats: {
    totalEndpoints: 0,
    totalTests: 0,
    totalSpecs: 0,
    missingTests: 0,
    missingSpecs: 0,
    invalidRefs: 0,
  },
}

/**
 * Check if a file exists
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

/**
 * Find all .json files in paths/ directory
 */
async function findEndpointJsonFiles(dir: string): Promise<string[]> {
  const files: string[] = []

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.name.endsWith('.json')) {
        // Exclude main api.openapi.json and component files
        if (!fullPath.includes('/components/') && !fullPath.endsWith('api.openapi.json')) {
          files.push(fullPath)
        }
      }
    }
  }

  await walk(dir)
  return files
}

/**
 * Validate co-location pattern: .json should have matching .spec.ts
 */
async function validateCoLocation(jsonPath: string): Promise<void> {
  const specPath = jsonPath.replace('.json', '.spec.ts')
  const exists = await fileExists(specPath)

  if (!exists) {
    result.errors.push(`Missing test file: ${specPath} (for ${jsonPath})`)
    result.stats.missingTests++
    result.passed = false
  } else {
    result.stats.totalTests++
  }
}

/**
 * Validate HTTP method naming: filename should be valid HTTP method
 */
function validateHttpMethodNaming(jsonPath: string): void {
  const filename = jsonPath.split('/').pop()?.replace('.json', '')
  const validMethods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head']

  if (filename && !validMethods.includes(filename)) {
    result.warnings.push(
      `Non-standard HTTP method filename: ${filename} in ${jsonPath}. Expected one of: ${validMethods.join(', ')}`
    )
  }
}

/**
 * Validate $ref paths in JSON file
 */
async function validateRefs(jsonPath: string): Promise<void> {
  const content = await readFile(jsonPath, 'utf-8')
  const json = JSON.parse(content)

  const refs = extractRefs(json)
  const baseDir = dirname(jsonPath)

  for (const ref of refs) {
    // Skip external URLs
    if (ref.startsWith('http://') || ref.startsWith('https://')) {
      continue
    }

    // Resolve relative path
    const resolvedPath = join(baseDir, ref)
    const exists = await fileExists(resolvedPath)

    if (!exists) {
      result.errors.push(`Invalid $ref in ${jsonPath}: ${ref} (resolved to ${resolvedPath})`)
      result.stats.invalidRefs++
      result.passed = false
    }
  }
}

/**
 * Extract all $ref values from a JSON object
 */
function extractRefs(obj: any, refs: string[] = []): string[] {
  if (typeof obj !== 'object' || obj === null) {
    return refs
  }

  if (Array.isArray(obj)) {
    for (const item of obj) {
      extractRefs(item, refs)
    }
  } else {
    for (const [key, value] of Object.entries(obj)) {
      if (key === '$ref' && typeof value === 'string') {
        refs.push(value)
      } else {
        extractRefs(value, refs)
      }
    }
  }

  return refs
}

/**
 * Validate specs array exists and has correct format
 */
async function validateSpecsArray(jsonPath: string): Promise<void> {
  const content = await readFile(jsonPath, 'utf-8')
  const json = JSON.parse(content)

  if (!json.specs) {
    result.errors.push(`Missing "specs" array in ${jsonPath}`)
    result.stats.missingSpecs++
    result.passed = false
    return
  }

  if (!Array.isArray(json.specs)) {
    result.errors.push(`"specs" is not an array in ${jsonPath}`)
    result.passed = false
    return
  }

  // Validate each spec object
  for (let i = 0; i < json.specs.length; i++) {
    const spec = json.specs[i]

    if (!spec.id || typeof spec.id !== 'string') {
      result.errors.push(`Invalid spec[${i}].id in ${jsonPath}: must be a non-empty string`)
      result.passed = false
    }

    if (!spec.given || typeof spec.given !== 'string') {
      result.errors.push(
        `Invalid spec[${i}].given in ${jsonPath}: must be a non-empty string`
      )
      result.passed = false
    }

    if (!spec.when || typeof spec.when !== 'string') {
      result.errors.push(`Invalid spec[${i}].when in ${jsonPath}: must be a non-empty string`)
      result.passed = false
    }

    if (!spec.then || typeof spec.then !== 'string') {
      result.errors.push(`Invalid spec[${i}].then in ${jsonPath}: must be a non-empty string`)
      result.passed = false
    }

    result.stats.totalSpecs++
  }
}

/**
 * Validate test file has @spec tags and Given-When-Then comments
 */
async function validateTestFile(specPath: string): Promise<void> {
  const content = await readFile(specPath, 'utf-8')

  // Check for @spec tag
  if (!content.includes("{ tag: '@spec' }")) {
    result.warnings.push(`Test file ${specPath} has no @spec tags`)
  }

  // Check for Given-When-Then comments
  const hasGiven = /\/\/\s*GIVEN:/i.test(content)
  const hasWhen = /\/\/\s*WHEN:/i.test(content)
  const hasThen = /\/\/\s*THEN:/i.test(content)

  if (!hasGiven || !hasWhen || !hasThen) {
    result.warnings.push(
      `Test file ${specPath} missing Given-When-Then comments (has: ${hasGiven ? 'GIVEN' : ''} ${hasWhen ? 'WHEN' : ''} ${hasThen ? 'THEN' : ''})`
    )
  }
}

/**
 * Validate OpenAPI spec structure
 */
async function validateOpenApiStructure(jsonPath: string): Promise<void> {
  const content = await readFile(jsonPath, 'utf-8')
  const json = JSON.parse(content)

  // Check required OpenAPI fields
  const requiredFields = ['summary', 'operationId', 'responses']
  for (const field of requiredFields) {
    if (!(field in json)) {
      result.warnings.push(`Missing recommended field "${field}" in ${jsonPath}`)
    }
  }

  // Check responses has at least one response
  if (json.responses && typeof json.responses === 'object') {
    const responseCodes = Object.keys(json.responses)
    if (responseCodes.length === 0) {
      result.warnings.push(`No response codes defined in ${jsonPath}`)
    }
  }
}

/**
 * Validate main api.openapi.json references all endpoint files
 */
async function validateMainOpenApiFile(apiDir: string, endpointFiles: string[]): Promise<void> {
  const mainFile = join(apiDir, 'api.openapi.json')
  const exists = await fileExists(mainFile)

  if (!exists) {
    result.errors.push(`Missing main OpenAPI file: ${mainFile}`)
    result.passed = false
    return
  }

  const content = await readFile(mainFile, 'utf-8')
  const json = JSON.parse(content)

  // Extract all path refs from main file
  const pathRefs = new Set<string>()
  if (json.paths) {
    for (const [, methods] of Object.entries(json.paths)) {
      if (typeof methods === 'object' && methods !== null) {
        for (const [, operation] of Object.entries(methods)) {
          if (
            typeof operation === 'object' &&
            operation !== null &&
            '$ref' in operation &&
            typeof operation.$ref === 'string'
          ) {
            pathRefs.add(operation.$ref)
          }
        }
      }
    }
  }

  // Check if all endpoint files are referenced
  for (const endpointFile of endpointFiles) {
    const relativePath = './' + relative(apiDir, endpointFile)
    if (!pathRefs.has(relativePath)) {
      result.warnings.push(
        `Endpoint ${endpointFile} is not referenced in ${mainFile} (expected ref: ${relativePath})`
      )
    }
  }
}

/**
 * Main validation function
 */
async function main() {
  console.log('🔍 Validating specs/api/ directory structure...\n')

  const apiDir = join(process.cwd(), 'specs/api')
  const pathsDir = join(apiDir, 'paths')

  // Check if directories exist
  if (!(await fileExists(apiDir))) {
    console.error('❌ specs/api/ directory not found')
    process.exit(1)
  }

  if (!(await fileExists(pathsDir))) {
    console.error('❌ specs/api/paths/ directory not found')
    process.exit(1)
  }

  // Find all endpoint JSON files
  const endpointFiles = await findEndpointJsonFiles(pathsDir)
  result.stats.totalEndpoints = endpointFiles.length

  console.log(`📊 Found ${endpointFiles.length} endpoint files\n`)

  // Validate each endpoint file
  for (const jsonPath of endpointFiles) {
    const relativePath = relative(process.cwd(), jsonPath)
    console.log(`  Validating ${relativePath}...`)

    // 1. Co-location: Check for matching .spec.ts
    await validateCoLocation(jsonPath)

    // 2. HTTP method naming
    validateHttpMethodNaming(jsonPath)

    // 3. $ref validation
    await validateRefs(jsonPath)

    // 4. Specs array validation
    await validateSpecsArray(jsonPath)

    // 5. OpenAPI structure validation
    await validateOpenApiStructure(jsonPath)

    // 6. Test file validation (if exists)
    const specPath = jsonPath.replace('.json', '.spec.ts')
    if (await fileExists(specPath)) {
      await validateTestFile(specPath)
    }
  }

  // Validate main api.openapi.json
  console.log('\n  Validating main api.openapi.json...')
  await validateMainOpenApiFile(apiDir, endpointFiles)

  // Print results
  console.log('\n' + '='.repeat(80))
  console.log('📈 VALIDATION RESULTS')
  console.log('='.repeat(80))

  console.log('\n📊 Statistics:')
  console.log(`  Total endpoints:     ${result.stats.totalEndpoints}`)
  console.log(`  Total tests:         ${result.stats.totalTests}`)
  console.log(`  Total specs:         ${result.stats.totalSpecs}`)
  console.log(`  Missing tests:       ${result.stats.missingTests}`)
  console.log(`  Missing specs:       ${result.stats.missingSpecs}`)
  console.log(`  Invalid $refs:       ${result.stats.invalidRefs}`)

  if (result.errors.length > 0) {
    console.log('\n❌ ERRORS:')
    for (const error of result.errors) {
      console.log(`  - ${error}`)
    }
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:')
    for (const warning of result.warnings) {
      console.log(`  - ${warning}`)
    }
  }

  console.log('\n' + '='.repeat(80))

  if (result.passed && result.warnings.length === 0) {
    console.log('✅ All validations passed! specs/api/ follows all documented patterns.')
    process.exit(0)
  } else if (result.passed && result.warnings.length > 0) {
    console.log('⚠️  Validation passed with warnings. Consider addressing them.')
    process.exit(0)
  } else {
    console.log('❌ Validation failed. Please fix the errors above.')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Fatal error during validation:', error)
  process.exit(1)
})
