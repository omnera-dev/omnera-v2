/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Validates specs/app/ folder structure against documented patterns
 *
 * Checks:
 * 1. Valid JSON: All .schema.json files must be valid JSON
 * 2. JSON Schema Draft 7: All schemas must have $schema: "http://json-schema.org/draft-07/schema#"
 * 3. Co-located pattern: Each property/entity has {name}/{name}.schema.json + optional .spec.ts
 * 4. Schema structure: $id, $schema, title, description, specs array
 * 5. Spec format: id (APP- prefix), given, when, then fields
 * 6. Spec ID conventions: Proper format (APP-*-NNN) and global uniqueness
 * 7. Test file validation: Copyright headers, @spec/@regression tags, spec-to-test mapping
 * 8. $ref paths: Relative paths exist and are valid
 * 9. Type discriminators: const vs enum usage
 * 10. Required arrays: Explicit required fields for objects
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { join, relative, dirname, resolve } from 'node:path'
import {
  validateSpecsArray,
  validateTestFile,
  createValidationResult,
  printValidationResults,
  type ValidationResult,
  type Spec,
} from './lib/validation-common'

// ============================================================================
// Types
// ============================================================================

interface SchemaFile {
  path: string
  relativePath: string
  content: unknown
}

// ============================================================================
// Configuration
// ============================================================================

const SPECS_APP_DIR = join(process.cwd(), 'specs', 'app')
const VALID_SCHEMA_DRAFT = 'http://json-schema.org/draft-07/schema#'

// ============================================================================
// Main Validation Logic
// ============================================================================

async function validateSpecsStructure(): Promise<ValidationResult> {
  const result = createValidationResult()

  console.log('🔍 Validating specs/app/ folder structure...\n')

  try {
    // Find all .schema.json files
    const schemaFiles = await findSchemaFiles(SPECS_APP_DIR, result)
    result.totalSchemas = schemaFiles.length

    console.log(`📄 Found ${schemaFiles.length} schema files\n`)

    // Track spec IDs for global uniqueness check
    const globalSpecIds = new Set<string>()

    // Validate each schema file
    for (const schemaFile of schemaFiles) {
      await validateSchemaFile(schemaFile, result, globalSpecIds)
    }

    result.totalSpecs = globalSpecIds.size

    // Print results
    printValidationResults(result, 'APP SPECS VALIDATION')

    return result
  } catch (error) {
    console.error('❌ Fatal error during validation:', error)
    throw error
  }
}

// ============================================================================
// Schema File Discovery
// ============================================================================

async function findSchemaFiles(dir: string, result: ValidationResult): Promise<SchemaFile[]> {
  const files: SchemaFile[] = []

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.schema.json')) {
        const relativePath = relative(SPECS_APP_DIR, fullPath)
        try {
          const content = await readFile(fullPath, 'utf-8')
          const parsed = JSON.parse(content)

          files.push({
            path: fullPath,
            relativePath,
            content: parsed,
          })
        } catch (error) {
          // Invalid JSON is an error, not a warning
          result.errors.push({
            file: relativePath,
            type: 'error',
            message: `Invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
          })
          result.passed = false
        }
      }
    }
  }

  await walk(dir)
  return files
}

// ============================================================================
// Schema File Validation
// ============================================================================

async function validateSchemaFile(
  schemaFile: SchemaFile,
  result: ValidationResult,
  globalSpecIds: Set<string>
): Promise<void> {
  const { path, relativePath, content } = schemaFile

  // 1. Check co-located pattern: {name}/{name}.schema.json
  validateColocatedPattern(relativePath, result)

  // 2. Check required root properties
  validateRootProperties(content, relativePath, result)

  // 3. Check $schema is Draft-07
  validateSchemaDraft(content, relativePath, result)

  // 4. Check specs array format (using shared validation)
  validateSpecsArray(content, relativePath, 'APP', result, globalSpecIds)

  // 5. Check for co-located test file (optional - warning only)
  const obj =
    typeof content === 'object' && content !== null ? (content as Record<string, unknown>) : {}
  const specsKey = 'x-specs' in obj ? 'x-specs' : 'specs' in obj ? 'specs' : null
  const specs = specsKey && Array.isArray(obj[specsKey]) ? (obj[specsKey] as Spec[]) : []
  await validateTestFileCoLocation(path, relativePath, specs, result)

  // 6. Check $ref paths exist
  await validateRefs(content, path, relativePath, result)

  // 7. Check type discriminators use const (not enum)
  validateTypeDiscriminators(content, relativePath, result)

  // 8. Check required arrays for objects
  validateRequiredArrays(content, relativePath, result)
}

// ============================================================================
// Pattern Validators
// ============================================================================

function validateColocatedPattern(relativePath: string, result: ValidationResult): void {
  const parts = relativePath.split('/')
  const fileName = parts[parts.length - 1]
  const dirName = parts[parts.length - 2]

  if (!fileName) {
    result.errors.push({
      file: relativePath,
      type: 'error',
      message: 'Invalid file path',
    })
    return
  }

  // Extract base name (remove .schema.json)
  const baseName = fileName.replace('.schema.json', '')

  // Check if directory name matches file base name
  if (dirName !== baseName && dirName !== 'app') {
    result.warnings.push({
      file: relativePath,
      type: 'warning',
      message: `Co-located pattern violation: Expected file in ${baseName}/ directory, found in ${dirName}/`,
    })
  }
}

/**
 * Check if co-located test file exists and validate it (optional - warning only)
 */
async function validateTestFileCoLocation(
  schemaPath: string,
  relativePath: string,
  specs: Spec[],
  result: ValidationResult
): Promise<void> {
  // Convert .schema.json to .spec.ts
  const testPath = schemaPath.replace('.schema.json', '.spec.ts')

  try {
    await stat(testPath)
    // Test file exists - validate it using shared validation
    await validateTestFile(testPath, specs, 'APP', result)
  } catch {
    // Test file doesn't exist - warning only
    if (specs.length > 0) {
      result.warnings.push({
        file: relativePath,
        type: 'warning',
        message: `Missing co-located test file (${relativePath.replace('.schema.json', '.spec.ts')})`,
      })
    }
  }
}

function validateRootProperties(
  content: unknown,
  relativePath: string,
  result: ValidationResult
): void {
  if (typeof content !== 'object' || content === null) {
    result.errors.push({
      file: relativePath,
      type: 'error',
      message: 'Content must be an object',
    })
    return
  }

  const obj = content as Record<string, unknown>
  const requiredProps = ['title']
  const recommendedProps = ['description']

  for (const prop of requiredProps) {
    if (!(prop in obj) || !obj[prop]) {
      result.errors.push({
        file: relativePath,
        type: 'error',
        message: `Missing required property: ${prop}`,
      })
    }
  }

  // Check for specs array (accept both "x-specs" and "specs")
  if (!('x-specs' in obj) && !('specs' in obj)) {
    result.errors.push({
      file: relativePath,
      type: 'error',
      message: 'Missing required property: x-specs or specs',
    })
  }

  for (const prop of recommendedProps) {
    if (!(prop in obj) || !obj[prop]) {
      result.warnings.push({
        file: relativePath,
        type: 'warning',
        message: `Missing recommended property: ${prop}`,
      })
    }
  }

  // Check for $id (should be just filename)
  if ('$id' in obj && typeof obj.$id === 'string') {
    const fileName = relativePath.split('/').pop()
    if (fileName && obj.$id !== fileName) {
      result.warnings.push({
        file: relativePath,
        type: 'warning',
        message: `$id should be just filename (${fileName}), got: ${obj.$id}`,
      })
    }
  }
}

function validateSchemaDraft(
  content: unknown,
  relativePath: string,
  result: ValidationResult
): void {
  if (typeof content !== 'object' || content === null) return

  const obj = content as Record<string, unknown>

  // Check if $schema property exists
  if (!('$schema' in obj)) {
    result.errors.push({
      file: relativePath,
      type: 'error',
      message: `Missing required property: $schema (expected "${VALID_SCHEMA_DRAFT}")`,
    })
    result.passed = false
    return
  }

  // Check if $schema is the correct Draft 7 value
  if (typeof obj.$schema === 'string' && obj.$schema !== VALID_SCHEMA_DRAFT) {
    result.errors.push({
      file: relativePath,
      type: 'error',
      message: `Invalid $schema value. Expected "${VALID_SCHEMA_DRAFT}", got: "${obj.$schema}"`,
    })
    result.passed = false
  } else if (typeof obj.$schema !== 'string') {
    result.errors.push({
      file: relativePath,
      type: 'error',
      message: `Invalid $schema type. Expected string "${VALID_SCHEMA_DRAFT}", got: ${typeof obj.$schema}`,
    })
    result.passed = false
  }
}

async function validateRefs(
  content: unknown,
  filePath: string,
  relativePath: string,
  result: ValidationResult
): Promise<void> {
  const refs = findRefs(content)

  for (const ref of refs) {
    // Skip JSON pointer references (internal to same file)
    if (ref.startsWith('#/')) {
      continue
    }

    // Strip JSON pointer fragment (everything after #)
    const refWithoutFragment = ref.split('#')[0]

    // Skip if only a fragment (already handled above)
    if (!refWithoutFragment) {
      continue
    }

    // Resolve relative path
    const baseDir = dirname(filePath)
    const refPath = resolve(baseDir, refWithoutFragment)

    try {
      await stat(refPath)
    } catch {
      result.errors.push({
        file: relativePath,
        type: 'error',
        message: `$ref path does not exist: ${ref}`,
      })
    }
  }
}

function findRefs(obj: unknown, refs: string[] = [], currentPath: string[] = []): string[] {
  if (typeof obj !== 'object' || obj === null) {
    return refs
  }

  const record = obj as Record<string, unknown>

  // Skip $ref validation inside examples, x-specs, and specs (they're documentation examples)
  const isInExamples = currentPath.includes('examples')
  const isInXSpecs = currentPath.includes('x-specs')
  const isInSpecs = currentPath.includes('specs')

  if ('$ref' in record && typeof record.$ref === 'string') {
    // Only collect $refs that are NOT in examples, x-specs, or specs
    if (!isInExamples && !isInXSpecs && !isInSpecs) {
      refs.push(record.$ref)
    }
  }

  for (const key in record) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      findRefs(record[key], refs, [...currentPath, key])
    }
  }

  return refs
}

function validateTypeDiscriminators(
  content: unknown,
  relativePath: string,
  result: ValidationResult
): void {
  checkForEnumDiscriminators(content, relativePath, result)
}

function checkForEnumDiscriminators(
  obj: unknown,
  relativePath: string,
  result: ValidationResult,
  path: string = ''
): void {
  if (typeof obj !== 'object' || obj === null) {
    return
  }

  const record = obj as Record<string, unknown>

  // Check if this is a type discriminator using enum instead of const
  if (
    'type' in record &&
    record.type === 'string' &&
    'enum' in record &&
    Array.isArray(record.enum) &&
    record.enum.length === 1
  ) {
    result.warnings.push({
      file: relativePath,
      type: 'warning',
      message: `Use "const" instead of single-value "enum" at ${path || 'root'}`,
    })
  }

  // Recursively check nested objects
  for (const key in record) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      checkForEnumDiscriminators(record[key], relativePath, result, path ? `${path}.${key}` : key)
    }
  }
}

function validateRequiredArrays(
  content: unknown,
  relativePath: string,
  result: ValidationResult
): void {
  checkObjectsHaveRequired(content, relativePath, result)
}

function checkObjectsHaveRequired(
  obj: unknown,
  relativePath: string,
  result: ValidationResult,
  path: string = ''
): void {
  if (typeof obj !== 'object' || obj === null) {
    return
  }

  const record = obj as Record<string, unknown>

  // If this is an object schema with properties, it should have a required array
  if (
    'type' in record &&
    record.type === 'object' &&
    'properties' in record &&
    !('required' in record)
  ) {
    result.warnings.push({
      file: relativePath,
      type: 'warning',
      message: `Object schema missing "required" array at ${path || 'root'}`,
    })
  }

  // Recursively check nested objects
  for (const key in record) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      checkObjectsHaveRequired(record[key], relativePath, result, path ? `${path}.${key}` : key)
    }
  }
}

// ============================================================================
// Script Execution
// ============================================================================

async function main() {
  try {
    const result = await validateSpecsStructure()

    // Exit with error code if there are errors
    if (result.errors.length > 0) {
      process.exit(1)
    }

    process.exit(0)
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (import.meta.main) {
  main()
}

export { validateSpecsStructure }
export type { ValidationResult }
