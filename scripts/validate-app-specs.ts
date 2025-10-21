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
 * 1. Co-located pattern: Each property/entity has {name}/{name}.schema.json
 * 2. Schema structure: $id, $schema, title, description, specs array
 * 3. Spec format: id, given, when, then fields
 * 4. Spec ID conventions: Proper format and uniqueness
 * 5. $ref paths: Relative paths exist and are valid
 * 6. Type discriminators: const vs enum usage
 * 7. Required arrays: Explicit required fields for objects
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { join, relative, dirname, resolve } from 'node:path'

// ============================================================================
// Types
// ============================================================================

interface ValidationError {
  file: string
  type: 'error' | 'warning'
  message: string
  line?: number
}

interface SchemaFile {
  path: string
  relativePath: string
  content: any
}

interface ValidationResult {
  errors: ValidationError[]
  warnings: ValidationError[]
  totalSchemas: number
  totalSpecs: number
}

// ============================================================================
// Configuration
// ============================================================================

const SPECS_APP_DIR = join(process.cwd(), 'specs', 'app')
const VALID_SPEC_ID_PATTERN = /^[A-Z][A-Z0-9-]*-[A-Z0-9-]*-\d{3,}$|^[A-Z][A-Z0-9-]*-[A-Z0-9-]*-WORKFLOW$/
const VALID_SCHEMA_DRAFT = 'http://json-schema.org/draft-07/schema#'

// ============================================================================
// Main Validation Logic
// ============================================================================

async function validateSpecsStructure(): Promise<ValidationResult> {
  const result: ValidationResult = {
    errors: [],
    warnings: [],
    totalSchemas: 0,
    totalSpecs: 0,
  }

  console.log('🔍 Validating specs/app/ folder structure...\n')

  try {
    // Find all .schema.json files
    const schemaFiles = await findSchemaFiles(SPECS_APP_DIR)
    result.totalSchemas = schemaFiles.length

    console.log(`📄 Found ${schemaFiles.length} schema files\n`)

    // Track spec IDs for uniqueness check
    const specIds = new Set<string>()

    // Validate each schema file
    for (const schemaFile of schemaFiles) {
      await validateSchemaFile(schemaFile, result, specIds)
    }

    result.totalSpecs = specIds.size

    // Print results
    printResults(result)

    return result
  } catch (error) {
    console.error('❌ Fatal error during validation:', error)
    throw error
  }
}

// ============================================================================
// Schema File Discovery
// ============================================================================

async function findSchemaFiles(dir: string): Promise<SchemaFile[]> {
  const files: SchemaFile[] = []

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.schema.json')) {
        try {
          const content = await readFile(fullPath, 'utf-8')
          const parsed = JSON.parse(content)

          files.push({
            path: fullPath,
            relativePath: relative(SPECS_APP_DIR, fullPath),
            content: parsed,
          })
        } catch (error) {
          console.warn(`⚠️  Failed to parse ${fullPath}:`, error)
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
  specIds: Set<string>
): Promise<void> {
  const { path, relativePath, content } = schemaFile

  // 1. Check co-located pattern: {name}/{name}.schema.json
  validateColocatedPattern(relativePath, result)

  // 2. Check required root properties
  validateRootProperties(content, relativePath, result)

  // 3. Check $schema is Draft-07
  validateSchemaDraft(content, relativePath, result)

  // 4. Check specs array format
  validateSpecsArray(content, relativePath, result, specIds)

  // 5. Check $ref paths exist
  await validateRefs(content, path, relativePath, result)

  // 6. Check type discriminators use const (not enum)
  validateTypeDiscriminators(content, relativePath, result)

  // 7. Check required arrays for objects
  validateRequiredArrays(content, relativePath, result)
}

// ============================================================================
// Pattern Validators
// ============================================================================

function validateColocatedPattern(relativePath: string, result: ValidationResult): void {
  const parts = relativePath.split('/')
  const fileName = parts[parts.length - 1]
  const dirName = parts[parts.length - 2]

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

function validateRootProperties(content: any, relativePath: string, result: ValidationResult): void {
  const requiredProps = ['title', 'specs']
  const recommendedProps = ['description']

  for (const prop of requiredProps) {
    if (!content[prop]) {
      result.errors.push({
        file: relativePath,
        type: 'error',
        message: `Missing required property: ${prop}`,
      })
    }
  }

  for (const prop of recommendedProps) {
    if (!content[prop]) {
      result.warnings.push({
        file: relativePath,
        type: 'warning',
        message: `Missing recommended property: ${prop}`,
      })
    }
  }

  // Check for $id (should be just filename)
  if (content.$id) {
    const fileName = relativePath.split('/').pop()
    if (content.$id !== fileName) {
      result.warnings.push({
        file: relativePath,
        type: 'warning',
        message: `$id should be just filename (${fileName}), got: ${content.$id}`,
      })
    }
  }
}

function validateSchemaDraft(content: any, relativePath: string, result: ValidationResult): void {
  if (content.$schema && content.$schema !== VALID_SCHEMA_DRAFT) {
    result.warnings.push({
      file: relativePath,
      type: 'warning',
      message: `Expected $schema "${VALID_SCHEMA_DRAFT}", got: ${content.$schema}`,
    })
  }
}

function validateSpecsArray(
  content: any,
  relativePath: string,
  result: ValidationResult,
  specIds: Set<string>
): void {
  if (!Array.isArray(content.specs)) {
    result.errors.push({
      file: relativePath,
      type: 'error',
      message: 'specs must be an array',
    })
    return
  }

  // Validate each spec
  content.specs.forEach((spec: any, index: number) => {
    validateSpec(spec, index, relativePath, result, specIds)
  })
}

function validateSpec(
  spec: any,
  index: number,
  relativePath: string,
  result: ValidationResult,
  specIds: Set<string>
): void {
  const requiredFields = ['id', 'given', 'when', 'then']

  // Check required fields
  for (const field of requiredFields) {
    if (!spec[field]) {
      result.errors.push({
        file: relativePath,
        type: 'error',
        message: `Spec at index ${index} missing required field: ${field}`,
      })
    }
  }

  // Validate spec ID format
  if (spec.id) {
    if (!VALID_SPEC_ID_PATTERN.test(spec.id)) {
      result.errors.push({
        file: relativePath,
        type: 'error',
        message: `Invalid spec ID format: ${spec.id}. Expected format: ENTITY-PROPERTY-NNN or ENTITY-PROPERTY-WORKFLOW`,
      })
    }

    // Check for duplicate spec IDs
    if (specIds.has(spec.id)) {
      result.errors.push({
        file: relativePath,
        type: 'error',
        message: `Duplicate spec ID: ${spec.id}`,
      })
    } else {
      specIds.add(spec.id)
    }
  }

  // Check string lengths (should be concise)
  if (spec.given && spec.given.length > 200) {
    result.warnings.push({
      file: relativePath,
      type: 'warning',
      message: `Spec ${spec.id} has overly long "given" clause (${spec.given.length} chars)`,
    })
  }

  if (spec.when && spec.when.length > 200) {
    result.warnings.push({
      file: relativePath,
      type: 'warning',
      message: `Spec ${spec.id} has overly long "when" clause (${spec.when.length} chars)`,
    })
  }

  if (spec.then && spec.then.length > 200) {
    result.warnings.push({
      file: relativePath,
      type: 'warning',
      message: `Spec ${spec.id} has overly long "then" clause (${spec.then.length} chars)`,
    })
  }
}

async function validateRefs(
  content: any,
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

    // Resolve relative path
    const baseDir = dirname(filePath)
    const refPath = resolve(baseDir, ref)

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

function findRefs(obj: any, refs: string[] = []): string[] {
  if (typeof obj !== 'object' || obj === null) {
    return refs
  }

  if (obj.$ref && typeof obj.$ref === 'string') {
    refs.push(obj.$ref)
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      findRefs(obj[key], refs)
    }
  }

  return refs
}

function validateTypeDiscriminators(content: any, relativePath: string, result: ValidationResult): void {
  checkForEnumDiscriminators(content, relativePath, result)
}

function checkForEnumDiscriminators(obj: any, relativePath: string, result: ValidationResult, path: string = ''): void {
  if (typeof obj !== 'object' || obj === null) {
    return
  }

  // Check if this is a type discriminator using enum instead of const
  if (obj.type === 'string' && Array.isArray(obj.enum) && obj.enum.length === 1) {
    result.warnings.push({
      file: relativePath,
      type: 'warning',
      message: `Use "const" instead of single-value "enum" at ${path || 'root'}`,
    })
  }

  // Recursively check nested objects
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      checkForEnumDiscriminators(obj[key], relativePath, result, path ? `${path}.${key}` : key)
    }
  }
}

function validateRequiredArrays(content: any, relativePath: string, result: ValidationResult): void {
  checkObjectsHaveRequired(content, relativePath, result)
}

function checkObjectsHaveRequired(
  obj: any,
  relativePath: string,
  result: ValidationResult,
  path: string = ''
): void {
  if (typeof obj !== 'object' || obj === null) {
    return
  }

  // If this is an object schema with properties, it should have a required array
  if (obj.type === 'object' && obj.properties && !obj.required) {
    result.warnings.push({
      file: relativePath,
      type: 'warning',
      message: `Object schema missing "required" array at ${path || 'root'}`,
    })
  }

  // Recursively check nested objects
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      checkObjectsHaveRequired(obj[key], relativePath, result, path ? `${path}.${key}` : key)
    }
  }
}

// ============================================================================
// Results Printing
// ============================================================================

function printResults(result: ValidationResult): void {
  console.log('\n' + '='.repeat(80))
  console.log('VALIDATION RESULTS')
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
    console.log('✅ All schemas pass validation!\n')
  }

  console.log('='.repeat(80) + '\n')
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

export { validateSpecsStructure, ValidationResult }
