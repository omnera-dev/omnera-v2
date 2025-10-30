/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import * as Array from 'effect/Array'
import * as Context from 'effect/Context'
import * as Data from 'effect/Data'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Schema from 'effect/Schema'

/**
 * Validation Error Types
 */
export class ValidationFailedError extends Data.TaggedError('ValidationFailedError')<{
  readonly errors: readonly ValidationIssue[]
  readonly file?: string
}> {}

export class SchemaValidationError extends Data.TaggedError('SchemaValidationError')<{
  readonly message: string
  readonly file: string
  readonly cause?: unknown
}> {}

/**
 * Validation issue types
 */
export type ValidationSeverity = 'error' | 'warning' | 'info'

export interface ValidationIssue {
  readonly file: string
  readonly severity: ValidationSeverity
  readonly message: string
  readonly line?: number
  readonly column?: number
  readonly code?: string
}

/**
 * Validation result
 */
export interface ValidationResult {
  readonly passed: boolean
  readonly errors: readonly ValidationIssue[]
  readonly warnings: readonly ValidationIssue[]
  readonly infos: readonly ValidationIssue[]
  readonly totalSchemas: number
  readonly totalSpecs: number
  readonly duration: number
}

/**
 * Empty validation result
 */
export const emptyValidationResult: ValidationResult = {
  passed: true,
  errors: [],
  warnings: [],
  infos: [],
  totalSchemas: 0,
  totalSpecs: 0,
  duration: 0,
}

/**
 * Validation Service Interface
 */
export interface ValidationService {
  /**
   * Validate with Effect Schema
   * @param schema - Effect Schema to validate against
   * @param data - Data to validate
   * @param file - File path (for error reporting)
   * @returns Effect that resolves to validated data
   */
  readonly validateSchema: <A, I>(
    schema: Schema.Schema<A, I>,
    data: I,
    file: string
  ) => Effect.Effect<A, SchemaValidationError>

  /**
   * Validate multiple items in parallel with error accumulation
   * @param items - Array of items to validate
   * @param validator - Validation function for each item
   * @returns Effect that resolves to ValidationResult with accumulated errors
   */
  readonly validateAll: <A, E>(
    items: readonly A[],
    validator: (item: A, index: number) => Effect.Effect<ValidationIssue[], E>
  ) => Effect.Effect<ValidationResult>

  /**
   * Create validation issue
   * @param issue - Issue properties
   * @returns ValidationIssue
   */
  readonly createIssue: (issue: {
    file: string
    severity: ValidationSeverity
    message: string
    line?: number
    column?: number
    code?: string
  }) => ValidationIssue

  /**
   * Combine multiple validation results
   * @param results - Array of validation results
   * @returns Combined ValidationResult
   */
  readonly combineResults: (results: readonly ValidationResult[]) => ValidationResult

  /**
   * Format validation result as human-readable string
   * @param result - Validation result to format
   * @param title - Optional title for the report
   * @returns Formatted string
   */
  readonly formatResult: (result: ValidationResult, title?: string) => string

  /**
   * Check if validation result has errors
   * @param result - Validation result
   * @returns Effect that fails if validation failed
   */
  readonly assertPassed: (result: ValidationResult) => Effect.Effect<void, ValidationFailedError>
}

/**
 * Validation Service Tag (for dependency injection)
 */
export const ValidationService = Context.GenericTag<ValidationService>('ValidationService')

/**
 * Live Validation Service Implementation
 */
export const ValidationServiceLive = Layer.succeed(
  ValidationService,
  ValidationService.of({
    validateSchema: <A, I>(schema: Schema.Schema<A, I>, data: I, file: string) =>
      Schema.decodeUnknown(schema)(data).pipe(
        Effect.mapError(
          (parseError) =>
            new SchemaValidationError({
              message: `Schema validation failed: ${parseError.message}`,
              file,
              cause: parseError,
            })
        )
      ),

    validateAll: <A, E>(
      items: readonly A[],
      validator: (item: A, index: number) => Effect.Effect<ValidationIssue[], E>
    ) =>
      Effect.gen(function* () {
        const startTime = Date.now()

        // Validate all items in parallel, collecting all issues
        const issuesArrays = yield* Effect.all(
          items.map((item, index) =>
            validator(item, index).pipe(
              Effect.catchAll((error) => {
                // Convert errors to validation issues
                const issue: ValidationIssue = {
                  file: 'unknown',
                  severity: 'error',
                  message: String(error),
                }
                return Effect.succeed([issue])
              })
            )
          ),
          { concurrency: 'unbounded' }
        )

        // Flatten all issues
        const allIssues = issuesArrays.flat()

        // Group by severity
        const errors = allIssues.filter((i) => i.severity === 'error')
        const warnings = allIssues.filter((i) => i.severity === 'warning')
        const infos = allIssues.filter((i) => i.severity === 'info')

        const duration = Date.now() - startTime

        return {
          passed: errors.length === 0,
          errors,
          warnings,
          infos,
          totalSchemas: items.length,
          totalSpecs: 0,
          duration,
        }
      }),

    createIssue: (issue) => ({
      file: issue.file,
      severity: issue.severity,
      message: issue.message,
      line: issue.line,
      column: issue.column,
      code: issue.code,
    }),

    combineResults: (results) => {
      const totalDuration = Array.reduce(results, 0, (acc, r) => acc + r.duration)
      const totalSchemas = Array.reduce(results, 0, (acc, r) => acc + r.totalSchemas)
      const totalSpecs = Array.reduce(results, 0, (acc, r) => acc + r.totalSpecs)

      const allErrors = results.flatMap((r) => r.errors)
      const allWarnings = results.flatMap((r) => r.warnings)
      const allInfos = results.flatMap((r) => r.infos)

      return {
        passed: results.every((r) => r.passed),
        errors: allErrors,
        warnings: allWarnings,
        infos: allInfos,
        totalSchemas,
        totalSpecs,
        duration: totalDuration,
      }
    },

    formatResult: (result, title = 'Validation Results') => {
      const lines: string[] = []
      const separator = '='.repeat(80)

      lines.push('')
      lines.push(separator)
      lines.push(title)
      lines.push(separator)
      lines.push('')

      lines.push(`📊 Total Schemas: ${result.totalSchemas}`)
      lines.push(`📋 Total Specs: ${result.totalSpecs}`)
      lines.push(`❌ Errors: ${result.errors.length}`)
      lines.push(`⚠️  Warnings: ${result.warnings.length}`)
      lines.push(`ℹ️  Info: ${result.infos.length}`)
      lines.push(`⏱️  Duration: ${result.duration}ms`)
      lines.push('')

      if (result.errors.length > 0) {
        lines.push('❌ ERRORS:\n')
        result.errors.forEach((error) => {
          lines.push(`  ${error.file}${error.line ? `:${error.line}` : ''}`)
          lines.push(`    → ${error.message}`)
          if (error.code) {
            lines.push(`    Code: ${error.code}`)
          }
          lines.push('')
        })
      }

      if (result.warnings.length > 0) {
        lines.push('⚠️  WARNINGS:\n')
        result.warnings.forEach((warning) => {
          lines.push(`  ${warning.file}${warning.line ? `:${warning.line}` : ''}`)
          lines.push(`    → ${warning.message}`)
          if (warning.code) {
            lines.push(`    Code: ${warning.code}`)
          }
          lines.push('')
        })
      }

      if (result.infos.length > 0) {
        lines.push('ℹ️  INFO:\n')
        result.infos.forEach((info) => {
          lines.push(`  ${info.file}${info.line ? `:${info.line}` : ''}`)
          lines.push(`    → ${info.message}`)
          lines.push('')
        })
      }

      if (result.errors.length === 0 && result.warnings.length === 0 && result.infos.length === 0) {
        lines.push('✅ All validations passed!\n')
      }

      lines.push(separator)
      lines.push('')

      return lines.join('\n')
    },

    assertPassed: (result) =>
      result.passed
        ? Effect.void
        : Effect.fail(new ValidationFailedError({ errors: result.errors })),
  })
)

/**
 * Helper functions for common operations
 */

/**
 * Validate with Effect Schema
 */
export const validateSchema = <A, I>(schema: Schema.Schema<A, I>, data: I, file: string) =>
  ValidationService.pipe(Effect.flatMap((service) => service.validateSchema(schema, data, file)))

/**
 * Validate all items with error accumulation
 */
export const validateAll = <A, E>(
  items: readonly A[],
  validator: (item: A, index: number) => Effect.Effect<ValidationIssue[], E>
) => ValidationService.pipe(Effect.flatMap((service) => service.validateAll(items, validator)))

/**
 * Create validation issue
 */
export const createIssue = (issue: {
  file: string
  severity: ValidationSeverity
  message: string
  line?: number
  column?: number
  code?: string
}) => ValidationService.pipe(Effect.map((service) => service.createIssue(issue)))

/**
 * Combine validation results
 */
export const combineResults = (results: readonly ValidationResult[]) =>
  ValidationService.pipe(Effect.map((service) => service.combineResults(results)))

/**
 * Format validation result
 */
export const formatResult = (result: ValidationResult, title?: string) =>
  ValidationService.pipe(Effect.map((service) => service.formatResult(result, title)))

/**
 * Assert validation passed
 */
export const assertPassed = (result: ValidationResult) =>
  ValidationService.pipe(Effect.flatMap((service) => service.assertPassed(result)))

/**
 * Validation builder utilities
 */

/**
 * Create a validation effect that always succeeds with no issues
 */
export const noIssues = (): Effect.Effect<ValidationIssue[]> => Effect.succeed([])

/**
 * Create a validation effect with a single error
 */
export const error = (
  file: string,
  message: string,
  line?: number
): Effect.Effect<ValidationIssue[]> => Effect.succeed([{ file, severity: 'error', message, line }])

/**
 * Create a validation effect with a single warning
 */
export const warning = (
  file: string,
  message: string,
  line?: number
): Effect.Effect<ValidationIssue[]> =>
  Effect.succeed([{ file, severity: 'warning', message, line }])

/**
 * Create a validation effect with a single info
 */
export const info = (
  file: string,
  message: string,
  line?: number
): Effect.Effect<ValidationIssue[]> => Effect.succeed([{ file, severity: 'info', message, line }])

/**
 * Combine multiple validation issue arrays
 */
export const combineIssues = (issuesArrays: ValidationIssue[][]): ValidationIssue[] =>
  issuesArrays.flat()
