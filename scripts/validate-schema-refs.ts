#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * JSON Schema $ref Validator
 *
 * Validates that all $ref paths in schema files point to existing files and properties.
 * Useful for ensuring schema integrity after splitting into multiple files.
 *
 * Usage:
 *   bun run scripts/validate-schema-refs.ts <schema-file>
 *   bun run scripts/validate-schema-refs.ts docs/specifications/specs.schema.json
 *   bun run scripts/validate-schema-refs.ts docs/specifications/schemas/
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, resolve, extname } from 'node:path'

// ========================================
// Types
// ========================================

interface JSONSchema {
  $ref?: string
  properties?: Record<string, JSONSchema>
  definitions?: Record<string, JSONSchema>
  items?: JSONSchema
  oneOf?: JSONSchema[]
  anyOf?: JSONSchema[]
  allOf?: JSONSchema[]
  [key: string]: unknown
}

interface RefValidationResult {
  ref: string
  sourcePath: string
  targetPath?: string
  valid: boolean
  error?: string
}

interface ValidationSummary {
  totalRefs: number
  validRefs: number
  invalidRefs: number
  results: RefValidationResult[]
}

// ========================================
// Constants
// ========================================

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

// ========================================
// Utilities
// ========================================

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function getAllSchemaFiles(dirPath: string): string[] {
  const files: string[] = []

  function traverse(currentPath: string) {
    const entries = readdirSync(currentPath)

    for (const entry of entries) {
      const fullPath = join(currentPath, entry)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        traverse(fullPath)
      } else if (extname(entry) === '.json' && entry.endsWith('.schema.json')) {
        files.push(fullPath)
      }
    }
  }

  if (statSync(dirPath).isDirectory()) {
    traverse(dirPath)
  } else if (extname(dirPath) === '.json') {
    files.push(dirPath)
  }

  return files
}

function extractRefs(schema: JSONSchema, refs: string[] = []): string[] {
  if (schema.$ref) {
    refs.push(schema.$ref)
  }

  if (schema.properties) {
    for (const value of Object.values(schema.properties)) {
      extractRefs(value, refs)
    }
  }

  if (schema.definitions) {
    for (const value of Object.values(schema.definitions)) {
      extractRefs(value, refs)
    }
  }

  if (schema.items) {
    extractRefs(schema.items, refs)
  }

  if (schema.oneOf) {
    for (const subSchema of schema.oneOf) {
      extractRefs(subSchema, refs)
    }
  }

  if (schema.anyOf) {
    for (const subSchema of schema.anyOf) {
      extractRefs(subSchema, refs)
    }
  }

  if (schema.allOf) {
    for (const subSchema of schema.allOf) {
      extractRefs(subSchema, refs)
    }
  }

  return refs
}

function validateRef(ref: string, sourceFilePath: string): RefValidationResult {
  const result: RefValidationResult = {
    ref,
    sourcePath: sourceFilePath,
    valid: false,
  }

  // Handle internal refs (#/definitions/..., #/properties/...)
  if (ref.startsWith('#/')) {
    const schema = JSON.parse(readFileSync(sourceFilePath, 'utf-8'))
    const path = ref.substring(2).split('/')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = schema

    for (const segment of path) {
      if (current && typeof current === 'object' && segment in current) {
        current = current[segment]
      } else {
        result.error = `Path not found: ${ref}`
        return result
      }
    }

    result.valid = true
    result.targetPath = sourceFilePath
    return result
  }

  // Handle external refs (./path/to/file.schema.json#/definitions/...)
  const [filePath, jsonPath] = ref.split('#')

  if (!filePath) {
    result.error = 'Invalid $ref format (missing file path)'
    return result
  }

  // Resolve relative path
  const sourceDir = dirname(sourceFilePath)
  const targetFilePath = resolve(sourceDir, filePath)

  // Check if file exists
  if (!existsSync(targetFilePath)) {
    result.error = `File not found: ${targetFilePath}`
    return result
  }

  result.targetPath = targetFilePath

  // If there's a JSON path, validate it exists in the target file
  if (jsonPath) {
    try {
      const targetSchema = JSON.parse(readFileSync(targetFilePath, 'utf-8'))
      const path = jsonPath.substring(1).split('/') // Remove leading '/'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = targetSchema

      for (const segment of path) {
        if (current && typeof current === 'object' && segment in current) {
          current = current[segment]
        } else {
          result.error = `Path not found in ${targetFilePath}: #${jsonPath}`
          return result
        }
      }
    } catch {
      result.error = `Failed to parse target file: ${targetFilePath}`
      return result
    }
  }

  result.valid = true
  return result
}

function validateSchemaFile(filePath: string): ValidationSummary {
  const summary: ValidationSummary = {
    totalRefs: 0,
    validRefs: 0,
    invalidRefs: 0,
    results: [],
  }

  try {
    const schema = JSON.parse(readFileSync(filePath, 'utf-8'))
    const refs = extractRefs(schema)

    summary.totalRefs = refs.length

    for (const ref of refs) {
      const result = validateRef(ref, filePath)
      summary.results.push(result)

      if (result.valid) {
        summary.validRefs++
      } else {
        summary.invalidRefs++
      }
    }
  } catch (e) {
    const error = e as Error
    log(`❌ Failed to read or parse ${filePath}: ${error.message}`, colors.red)
  }

  return summary
}

// ========================================
// Main
// ========================================

function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    log('❌ Missing schema file or directory path', colors.red)
    log('\nUsage:', colors.cyan)
    log('  bun run scripts/validate-schema-refs.ts <schema-file-or-directory>', colors.gray)
    log('\nExamples:', colors.cyan)
    log(
      '  bun run scripts/validate-schema-refs.ts docs/specifications/specs.schema.json',
      colors.gray
    )
    log('  bun run scripts/validate-schema-refs.ts docs/specifications/schemas/', colors.gray)
    process.exit(1)
  }

  const inputPath = args[0]!

  if (!existsSync(inputPath)) {
    log(`❌ Path not found: ${inputPath}`, colors.red)
    process.exit(1)
  }

  log('\n🔍 Validating JSON Schema $ref paths...', colors.cyan)
  console.log()

  const schemaFiles = getAllSchemaFiles(inputPath)

  if (schemaFiles.length === 0) {
    log('❌ No schema files found', colors.red)
    process.exit(1)
  }

  log(`📁 Found ${schemaFiles.length} schema file(s)`, colors.blue)
  console.log()

  const allResults: RefValidationResult[] = []
  let totalRefs = 0
  let validRefs = 0
  let invalidRefs = 0

  for (const schemaFile of schemaFiles) {
    log(`📄 Validating: ${schemaFile}`, colors.blue)
    const summary = validateSchemaFile(schemaFile)

    totalRefs += summary.totalRefs
    validRefs += summary.validRefs
    invalidRefs += summary.invalidRefs
    allResults.push(...summary.results)

    if (summary.totalRefs === 0) {
      log('  No $ref found', colors.gray)
    } else if (summary.invalidRefs === 0) {
      log(`  ✓ All ${summary.totalRefs} $ref(s) valid`, colors.green)
    } else {
      log(`  ✗ ${summary.invalidRefs}/${summary.totalRefs} $ref(s) invalid`, colors.red)
    }

    console.log()
  }

  // Display invalid refs
  if (invalidRefs > 0) {
    log('❌ Invalid $ref paths:', colors.red)
    console.log()

    for (const result of allResults) {
      if (!result.valid) {
        log(`  Source: ${result.sourcePath}`, colors.gray)
        log(`  $ref: ${result.ref}`, colors.yellow)
        log(`  Error: ${result.error}`, colors.red)
        console.log()
      }
    }
  }

  // Summary
  log('📊 Validation Summary:', colors.cyan)
  console.log(`  ${colors.gray}Total $ref: ${totalRefs}${colors.reset}`)
  console.log(
    `  ${colors.green}Valid: ${validRefs}${colors.reset} ${colors.gray}(${totalRefs > 0 ? ((validRefs / totalRefs) * 100).toFixed(1) : 0}%)${colors.reset}`
  )
  console.log(
    `  ${colors.red}Invalid: ${invalidRefs}${colors.reset} ${colors.gray}(${totalRefs > 0 ? ((invalidRefs / totalRefs) * 100).toFixed(1) : 0}%)${colors.reset}`
  )
  console.log()

  if (invalidRefs > 0) {
    log('❌ Validation failed! Fix the invalid $ref paths above.', colors.red)
    process.exit(1)
  } else {
    log('✅ All $ref paths are valid!', colors.green)
  }
}

main()
