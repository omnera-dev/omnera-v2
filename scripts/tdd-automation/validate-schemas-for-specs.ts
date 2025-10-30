#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Schema Validation for TDD Queue Specs
 *
 * Validates JSON Schema files for specs scanned by queue-manager
 * before they enter the TDD automation pipeline.
 *
 * This prevents bad specs from causing failed implementations.
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import {
  CommandServiceLive,
  LoggerServicePretty,
  logInfo,
  logError,
  logWarn,
  success,
} from '../lib/effect'

interface SpecScanResult {
  specId: string
  testFile: string
  feature: string
  lineNumber: number
}

interface QueueScanData {
  totalSpecs: number
  specs: SpecScanResult[]
  scannedAt: string
}

interface SchemaValidationError {
  file: string
  specId: string
  error: string
  severity: 'ERROR' | 'WARNING'
}

/**
 * Determine schema file path from test file path
 * Tests: specs/app/name/name.spec.ts
 * Schema: specs/app/name/name.schema.json (co-located)
 */
const getSchemaPath = (testFilePath: string): string => {
  const dir = path.dirname(testFilePath)
  const baseName = path.basename(testFilePath, '.spec.ts')
  return path.join(dir, `${baseName}.schema.json`)
}

interface JSONSchema {
  $id?: string
  title?: string
  type?: string
  description?: string
  examples?: unknown[]
  'x-specs'?: Array<{
    id?: string
    given?: string
    when?: string
    then?: string
  }>
  $ref?: string
  [key: string]: unknown
}

/**
 * Validate a single JSON Schema file
 */
const validateSchema = (
  schemaPath: string,
  specId: string
): Effect.Effect<SchemaValidationError | null> => {
  // Check if schema file exists
  if (!fs.existsSync(schemaPath)) {
    return Effect.succeed({
      file: schemaPath,
      specId,
      error: `Schema file not found (expected co-located with test)`,
      severity: 'ERROR' as const,
    })
  }

  // Read and parse schema
  let schema: JSONSchema
  try {
    const content = fs.readFileSync(schemaPath, 'utf-8')
    schema = JSON.parse(content) as JSONSchema
  } catch (e) {
    return Effect.succeed({
      file: schemaPath,
      specId,
      error: `Invalid JSON: ${e instanceof Error ? e.message : String(e)}`,
      severity: 'ERROR' as const,
    })
  }

  // Validate schema structure
  const errors: string[] = []
  const warnings: string[] = []

  // Check metadata
  if (!schema.$id) {
    errors.push('Missing $id field')
  }
  if (!schema.title) {
    errors.push('Missing title field')
  }
  if (!schema.type) {
    warnings.push('Missing type field (recommended)')
  }

  // Check Triple-Documentation Pattern
  if (!schema.description || schema.description.length < 10) {
    errors.push('Missing or insufficient description (Triple-Documentation Pattern)')
  }
  if (!schema.examples || !Array.isArray(schema.examples) || schema.examples.length === 0) {
    warnings.push('No examples provided (Triple-Documentation Pattern)')
  }

  // Check x-specs array (if present)
  if (schema['x-specs']) {
    if (!Array.isArray(schema['x-specs'])) {
      errors.push('x-specs must be an array')
    } else {
      const specIds = new Set<string>()
      schema['x-specs'].forEach((spec, index: number) => {
        // Required fields
        if (!spec.id) errors.push(`Spec at index ${index}: missing id`)
        if (!spec.given) errors.push(`Spec at index ${index}: missing given`)
        if (!spec.when) errors.push(`Spec at index ${index}: missing when`)
        if (!spec.then) errors.push(`Spec at index ${index}: missing then`)

        // Validate spec ID format (PREFIX-ENTITY-NNN)
        if (spec.id) {
          const prefix = schemaPath.includes('/app/')
            ? 'APP'
            : schemaPath.includes('/admin/')
              ? 'ADMIN'
              : schemaPath.includes('/api/')
                ? 'API'
                : 'UNKNOWN'

          const pattern = new RegExp(`^${prefix}-[A-Z][A-Z0-9-]*-\\d{3,}$`)
          if (!pattern.test(spec.id)) {
            errors.push(
              `Spec ID '${spec.id}' doesn't match format ${prefix}-ENTITY-NNN (needs uppercase prefix, entity, and 3+ digits)`
            )
          }

          // Check uniqueness within file
          if (specIds.has(spec.id)) {
            errors.push(`Duplicate spec ID: ${spec.id}`)
          }
          specIds.add(spec.id)
        }
      })
    }
  }

  // Check $ref resolution (basic - just check internal refs exist)
  const findRefs = (obj: unknown, refs: string[] = []): string[] => {
    if (typeof obj !== 'object' || obj === null) return refs
    const objRecord = obj as Record<string, unknown>
    if (objRecord.$ref && typeof objRecord.$ref === 'string') {
      refs.push(objRecord.$ref)
    }
    Object.values(objRecord).forEach((value) => findRefs(value, refs))
    return refs
  }

  const refs = findRefs(schema)
  refs.forEach((ref) => {
    if (ref.startsWith('#/')) {
      // Internal reference - check it resolves
      const parts = ref.slice(2).split('/')
      let current: unknown = schema
      for (const part of parts) {
        if (current && typeof current === 'object' && part in (current as object)) {
          current = (current as Record<string, unknown>)[part]
        } else {
          errors.push(`Cannot resolve internal $ref: ${ref}`)
          break
        }
      }
    }
    // External refs would need file system checks - skip for now
  })

  // Return error if any issues found
  if (errors.length > 0) {
    return Effect.succeed({
      file: schemaPath,
      specId,
      error: errors.join('; '),
      severity: 'ERROR' as const,
    })
  }

  if (warnings.length > 0) {
    return Effect.succeed({
      file: schemaPath,
      specId,
      error: warnings.join('; '),
      severity: 'WARNING' as const,
    })
  }

  return Effect.succeed(null)
}

/**
 * Validate schemas for all scanned specs
 */
const validateSchemasForSpecs = Effect.gen(function* () {
  yield* logInfo('Validating schemas for scanned specs...', '🔍')

  // Read scan results
  const scanFilePath = '.github/tdd-queue-scan.json'
  if (!fs.existsSync(scanFilePath)) {
    yield* logError(`Scan file not found: ${scanFilePath}`)
    yield* logInfo('  Run queue-manager.ts scan first')
    return Effect.fail(new Error('No scan results found'))
  }

  const scanData: QueueScanData = JSON.parse(fs.readFileSync(scanFilePath, 'utf-8'))
  yield* logInfo(`  Found ${scanData.totalSpecs} specs to validate`, '📊')
  yield* logInfo('')

  if (scanData.totalSpecs === 0) {
    yield* success('No specs to validate')
    return Effect.succeed(void 0)
  }

  // Validate each spec's schema
  const validationErrors: SchemaValidationError[] = []
  const validationWarnings: SchemaValidationError[] = []

  for (const spec of scanData.specs) {
    const schemaPath = getSchemaPath(spec.testFile)
    const result = yield* validateSchema(schemaPath, spec.specId)

    if (result) {
      if (result.severity === 'ERROR') {
        validationErrors.push(result)
        yield* logError(`❌ ${spec.specId}: ${result.error}`)
        yield* logInfo(`   Schema: ${schemaPath}`)
      } else {
        validationWarnings.push(result)
        yield* logWarn(`⚠️  ${spec.specId}: ${result.error}`)
        yield* logInfo(`   Schema: ${schemaPath}`)
      }
    } else {
      yield* logInfo(`✅ ${spec.specId}: Schema valid`)
    }
  }

  yield* logInfo('')
  yield* logInfo('─'.repeat(80))
  yield* logInfo('')

  // Summary
  const totalValidated = scanData.totalSpecs
  const totalErrors = validationErrors.length
  const totalWarnings = validationWarnings.length
  const totalValid = totalValidated - totalErrors - totalWarnings

  yield* logInfo(`📊 Validation Summary:`, '')
  yield* logInfo(`   Total specs validated: ${totalValidated}`)
  yield* logInfo(`   ✅ Valid: ${totalValid}`)
  if (totalWarnings > 0) {
    yield* logWarn(`   ⚠️  Warnings: ${totalWarnings}`)
  }
  if (totalErrors > 0) {
    yield* logError(`   ❌ Errors: ${totalErrors}`)
  }
  yield* logInfo('')

  // Fail if errors found
  if (totalErrors > 0) {
    yield* logError('Schema validation failed!')
    yield* logInfo('')
    yield* logInfo('Fix the errors above before populating the queue.')
    yield* logInfo('Run: bun run scripts/tdd-automation/validate-schemas-for-specs.ts')
    return Effect.fail(new Error(`${totalErrors} schema validation errors found`))
  }

  if (totalWarnings > 0) {
    yield* logWarn('Schema validation passed with warnings')
    yield* logInfo('Consider addressing warnings for better documentation quality')
  } else {
    yield* success('All schemas valid!')
  }

  return Effect.succeed(void 0)
})

// Run validation
const program = validateSchemasForSpecs

const runnable = program.pipe(Effect.provide(Layer.merge(CommandServiceLive, LoggerServicePretty())))

Effect.runPromise(runnable)
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Validation failed:', error)
    process.exit(1)
  })
