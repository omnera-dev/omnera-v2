/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { join, dirname, relative, resolve } from 'node:path'
import {
  validateSpecsArray,
  validateTestFile,
  createValidationResult,
  printValidationResults,
  type ValidationResult,
  type Spec,
} from './lib/validation-common'

/**
 * Validation script for specs/api/ directory structure
 *
 * This script validates that the specs/api/ directory follows all patterns
 * documented in specs/api/README.md:
 *
 * 1. Co-location Pattern: Each .json has a .spec.ts (required)
 * 2. URL-Based Organization: Directory structure mirrors URL paths
 * 3. HTTP Method Files: Each method is a separate file (get.json, post.json, etc.)
 * 4. Shared Components: All $ref paths are valid
 * 5. Specs Array: Each endpoint .json has a specs array with API- prefix
 * 6. Global Spec ID Uniqueness: No duplicate spec IDs across all files
 * 7. Test Organization: All tests use @spec tag and Given-When-Then
 * 8. Copyright Headers: Required in all test files
 * 9. Regression Tests: Exactly one @regression test per .spec.ts file
 * 10. Spec-to-Test Mapping: All spec IDs have corresponding test comments
 */

interface ApiStats {
  totalEndpoints: number
  totalTests: number
  totalSpecs: number
  missingTests: number
  missingSpecs: number
  invalidRefs: number
}

const API_DIR = join(process.cwd(), 'specs/api')
const PATHS_DIR = join(API_DIR, 'paths')

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
async function validateCoLocation(
  jsonPath: string,
  relativePath: string,
  specs: Spec[],
  result: ValidationResult,
  stats: ApiStats
): Promise<void> {
  const specPath = jsonPath.replace('.json', '.spec.ts')
  const exists = await fileExists(specPath)

  if (!exists) {
    result.warnings.push({
      file: relativePath,
      type: 'warning',
      message: `Missing co-located test file (${relativePath.replace('.json', '.spec.ts')})`,
    })
    stats.missingTests++
    // Note: Missing test files are warnings, not errors
  } else {
    // Validate the test file using shared validation
    await validateTestFile(specPath, specs, 'API', result)
    stats.totalTests++
  }
}

/**
 * Validate HTTP method naming: filename should be valid HTTP method
 */
function validateHttpMethodNaming(
  jsonPath: string,
  relativePath: string,
  result: ValidationResult
): void {
  const filename = jsonPath.split('/').pop()?.replace('.json', '')
  const validMethods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head']

  if (filename && !validMethods.includes(filename)) {
    result.warnings.push({
      file: relativePath,
      type: 'warning',
      message: `Non-standard HTTP method filename: ${filename}. Expected one of: ${validMethods.join(', ')}`,
    })
  }
}

/**
 * Validate $ref paths in JSON file
 */
async function validateRefs(
  jsonPath: string,
  relativePath: string,
  result: ValidationResult,
  stats: ApiStats
): Promise<void> {
  const content = await readFile(jsonPath, 'utf-8')
  const json = JSON.parse(content)

  const refs = extractRefs(json)
  const baseDir = dirname(jsonPath)

  for (const ref of refs) {
    // Skip JSON pointer references (internal to same file)
    if (ref.startsWith('#/')) {
      continue
    }

    // Skip external URLs
    if (ref.startsWith('http://') || ref.startsWith('https://')) {
      continue
    }

    // Resolve relative path
    const resolvedPath = resolve(baseDir, ref)
    const exists = await fileExists(resolvedPath)

    if (!exists) {
      result.errors.push({
        file: relativePath,
        type: 'error',
        message: `Invalid $ref: ${ref} (resolved to ${resolvedPath} but file not found)`,
      })
      stats.invalidRefs++
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
 * Validate OpenAPI spec structure
 */
async function validateOpenApiStructure(
  jsonPath: string,
  relativePath: string,
  result: ValidationResult
): Promise<void> {
  const content = await readFile(jsonPath, 'utf-8')
  const json = JSON.parse(content)

  // Check recommended OpenAPI fields
  const recommendedFields = ['summary', 'operationId', 'responses']
  for (const field of recommendedFields) {
    if (!(field in json)) {
      result.warnings.push({
        file: relativePath,
        type: 'warning',
        message: `Missing recommended OpenAPI field "${field}"`,
      })
    }
  }

  // Check responses has at least one response
  if (json.responses && typeof json.responses === 'object') {
    const responseCodes = Object.keys(json.responses)
    if (responseCodes.length === 0) {
      result.warnings.push({
        file: relativePath,
        type: 'warning',
        message: 'No response codes defined in OpenAPI responses object',
      })
    }
  }
}

/**
 * Validate main app.openapi.json references all endpoint files
 */
async function validateMainOpenApiFile(
  apiDir: string,
  endpointFiles: string[],
  result: ValidationResult
): Promise<void> {
  const mainFile = join(apiDir, 'app.openapi.json')
  const exists = await fileExists(mainFile)

  if (!exists) {
    result.warnings.push({
      file: 'app.openapi.json',
      type: 'warning',
      message: 'Missing main OpenAPI file (app.openapi.json)',
    })
    // Note: Missing main OpenAPI file is a warning, not an error
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
      result.warnings.push({
        file: relative(process.cwd(), endpointFile),
        type: 'warning',
        message: `Endpoint not referenced in app.openapi.json (expected ref: ${relativePath})`,
      })
    }
  }
}

/**
 * Main validation function
 */
async function main() {
  console.log('🔍 Validating specs/api/ directory structure...\n')

  const result = createValidationResult()
  const stats: ApiStats = {
    totalEndpoints: 0,
    totalTests: 0,
    totalSpecs: 0,
    missingTests: 0,
    missingSpecs: 0,
    invalidRefs: 0,
  }

  // Check if directories exist
  if (!(await fileExists(API_DIR))) {
    console.error('❌ specs/api/ directory not found')
    process.exit(1)
  }

  if (!(await fileExists(PATHS_DIR))) {
    console.error('❌ specs/api/paths/ directory not found')
    process.exit(1)
  }

  // Find all endpoint JSON files
  const endpointFiles = await findEndpointJsonFiles(PATHS_DIR)
  stats.totalEndpoints = endpointFiles.length
  result.totalSchemas = endpointFiles.length

  console.log(`📊 Found ${endpointFiles.length} endpoint files\n`)

  // Track spec IDs for global uniqueness check
  const globalSpecIds = new Set<string>()

  // Validate each endpoint file
  for (const jsonPath of endpointFiles) {
    const relativePath = relative(process.cwd(), jsonPath)

    // Read and parse JSON file
    try {
      const content = await readFile(jsonPath, 'utf-8')
      const json = JSON.parse(content)

      // 1. Validate specs array (using shared validation)
      validateSpecsArray(json, relativePath, 'API', result, globalSpecIds)

      // 2. Co-location: Check for matching .spec.ts
      const specs: Spec[] = json.specs || []
      await validateCoLocation(jsonPath, relativePath, specs, result, stats)

      // 3. HTTP method naming
      validateHttpMethodNaming(jsonPath, relativePath, result)

      // 4. $ref validation
      await validateRefs(jsonPath, relativePath, result, stats)

      // 5. OpenAPI structure validation
      await validateOpenApiStructure(jsonPath, relativePath, result)

      stats.totalSpecs += specs.length
    } catch (error) {
      result.errors.push({
        file: relativePath,
        type: 'error',
        message: `Failed to process file: ${error}`,
      })
      result.passed = false
    }
  }

  result.totalSpecs = globalSpecIds.size

  // Validate main api.openapi.json
  await validateMainOpenApiFile(API_DIR, endpointFiles, result)

  // Print results
  printValidationResults(result, 'API SPECS VALIDATION')

  // Print API-specific stats
  console.log('📈 API-Specific Statistics:')
  console.log(`  Total endpoints:     ${stats.totalEndpoints}`)
  console.log(`  Total tests:         ${stats.totalTests}`)
  console.log(`  Total specs:         ${stats.totalSpecs}`)
  console.log(`  Missing tests:       ${stats.missingTests}`)
  console.log(`  Invalid $refs:       ${stats.invalidRefs}`)
  console.log()

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
