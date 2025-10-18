/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Blueprint Validator
 *
 * Validates generated Effect Schema blueprints against source JSON Schema
 * to ensure they are complete, correct, and ready for agent consumption.
 */

import type { EffectSchemaBlueprint, JSONSchemaProperty } from '../types/roadmap'

export interface ValidationError {
  severity: 'error' | 'warning'
  message: string
  location?: string
  expected?: string
  actual?: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

/**
 * Validate an Effect Schema blueprint against its source JSON Schema
 *
 * Checks:
 * 1. TypeScript identifier validity (PascalCase, no special chars)
 * 2. Required exports (schema constant and type)
 * 3. Annotations presence (title, description, examples)
 * 4. Validation rules match source schema
 * 5. Error messages are present and meaningful
 */
export function validateBlueprint(
  blueprint: EffectSchemaBlueprint,
  sourceSchema: JSONSchemaProperty
): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // 1. Validate TypeScript identifier
  validateIdentifier(blueprint, errors)

  // 2. Validate exports
  validateExports(blueprint, errors)

  // 3. Validate annotations
  validateAnnotations(blueprint, sourceSchema, warnings)

  // 4. Validate validation rules
  validateValidationRules(blueprint, sourceSchema, errors, warnings)

  // 5. Validate error messages
  validateErrorMessages(blueprint, sourceSchema, warnings)

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate TypeScript identifier format
 */
function validateIdentifier(blueprint: EffectSchemaBlueprint, errors: ValidationError[]): void {
  const identifierRegex = /^[A-Z][a-zA-Z0-9]*$/

  if (!identifierRegex.test(blueprint.sanitizedName)) {
    errors.push({
      severity: 'error',
      message: `Invalid TypeScript identifier: "${blueprint.sanitizedName}"`,
      location: 'sanitizedName',
      expected: 'PascalCase identifier (e.g., PagesFormPageInputsTextInput)',
      actual: blueprint.sanitizedName,
    })
  }
}

/**
 * Validate required exports are present
 */
function validateExports(blueprint: EffectSchemaBlueprint, errors: ValidationError[]): void {
  const schemaExportName = `${blueprint.sanitizedName}Schema`
  const typeExportName = blueprint.sanitizedName

  // Check for schema constant export
  if (!blueprint.code.includes(`export const ${schemaExportName}`)) {
    errors.push({
      severity: 'error',
      message: `Missing schema constant export`,
      location: 'code',
      expected: `export const ${schemaExportName} = ...`,
    })
  }

  // Check for type export
  if (!blueprint.code.includes(`export type ${typeExportName}`)) {
    errors.push({
      severity: 'error',
      message: `Missing type export`,
      location: 'code',
      expected: `export type ${typeExportName} = Schema.Schema.Type<typeof ${schemaExportName}>`,
    })
  }

  // Verify exports array
  if (!blueprint.exports.includes(schemaExportName)) {
    errors.push({
      severity: 'error',
      message: `Schema constant not in exports array`,
      location: 'exports',
      expected: schemaExportName,
    })
  }

  if (!blueprint.exports.includes(typeExportName)) {
    errors.push({
      severity: 'error',
      message: `Type not in exports array`,
      location: 'exports',
      expected: typeExportName,
    })
  }
}

/**
 * Validate annotations are present for discoverability
 */
function validateAnnotations(
  blueprint: EffectSchemaBlueprint,
  sourceSchema: JSONSchemaProperty,
  warnings: ValidationError[]
): void {
  // Check for title annotation
  if (sourceSchema.title && !blueprint.code.includes('title:')) {
    warnings.push({
      severity: 'warning',
      message: `Missing title annotation`,
      location: 'code',
      expected: `title: "${sourceSchema.title}"`,
    })
  }

  // Check for description annotation
  if (sourceSchema.description && !blueprint.code.includes('description:')) {
    warnings.push({
      severity: 'warning',
      message: `Missing description annotation`,
      location: 'code',
      expected: `description: "${sourceSchema.description}"`,
    })
  }

  // Check for examples annotation
  if (
    sourceSchema.examples &&
    sourceSchema.examples.length > 0 &&
    !blueprint.code.includes('examples:')
  ) {
    warnings.push({
      severity: 'warning',
      message: `Missing examples annotation`,
      location: 'code',
      expected: `examples: [...]`,
    })
  }
}

/**
 * Validate validation rules match source schema
 */
function validateValidationRules(
  blueprint: EffectSchemaBlueprint,
  sourceSchema: JSONSchemaProperty,
  errors: ValidationError[],
  warnings: ValidationError[]
): void {
  // String validations
  if (sourceSchema.type === 'string') {
    if (sourceSchema.minLength !== undefined && !blueprint.code.includes('minLength')) {
      errors.push({
        severity: 'error',
        message: `Missing minLength validation`,
        location: 'code',
        expected: `Schema.minLength(${sourceSchema.minLength}, ...)`,
      })
    }

    if (sourceSchema.maxLength !== undefined && !blueprint.code.includes('maxLength')) {
      errors.push({
        severity: 'error',
        message: `Missing maxLength validation`,
        location: 'code',
        expected: `Schema.maxLength(${sourceSchema.maxLength}, ...)`,
      })
    }

    if (sourceSchema.pattern && !blueprint.code.includes('pattern')) {
      errors.push({
        severity: 'error',
        message: `Missing pattern validation`,
        location: 'code',
        expected: `Schema.pattern(/${sourceSchema.pattern}/, ...)`,
      })
    }
  }

  // Number validations
  if (sourceSchema.type === 'number' || sourceSchema.type === 'integer') {
    if (sourceSchema.minimum !== undefined && !blueprint.code.includes('greaterThanOrEqualTo')) {
      warnings.push({
        severity: 'warning',
        message: `Missing minimum validation`,
        location: 'code',
        expected: `Schema.greaterThanOrEqualTo(${sourceSchema.minimum})`,
      })
    }

    if (sourceSchema.maximum !== undefined && !blueprint.code.includes('lessThanOrEqualTo')) {
      warnings.push({
        severity: 'warning',
        message: `Missing maximum validation`,
        location: 'code',
        expected: `Schema.lessThanOrEqualTo(${sourceSchema.maximum})`,
      })
    }
  }

  // Array validations
  if (sourceSchema.type === 'array') {
    if (sourceSchema.minItems !== undefined && !blueprint.code.includes('minItems')) {
      warnings.push({
        severity: 'warning',
        message: `Missing minItems validation`,
        location: 'code',
        expected: `Schema.minItems(${sourceSchema.minItems})`,
      })
    }

    if (sourceSchema.maxItems !== undefined && !blueprint.code.includes('maxItems')) {
      warnings.push({
        severity: 'warning',
        message: `Missing maxItems validation`,
        location: 'code',
        expected: `Schema.maxItems(${sourceSchema.maxItems})`,
      })
    }
  }
}

/**
 * Validate error messages are present and meaningful
 */
function validateErrorMessages(
  blueprint: EffectSchemaBlueprint,
  sourceSchema: JSONSchemaProperty,
  warnings: ValidationError[]
): void {
  // Check that validation rules have error messages
  if (sourceSchema.type === 'string') {
    if (sourceSchema.minLength !== undefined && !blueprint.code.includes('message:')) {
      warnings.push({
        severity: 'warning',
        message: `Validation rules should include custom error messages`,
        location: 'code',
        expected: `{ message: () => '...' }`,
      })
    }
  }
}

/**
 * Format validation results as human-readable text
 */
export function formatValidationResults(result: ValidationResult, propertyName: string): string {
  const lines: string[] = []

  lines.push(`\n🔍 Validation Results: ${propertyName}`)
  lines.push(`${'='.repeat(60)}`)

  if (result.valid) {
    lines.push('✅ Blueprint is valid and ready for agent consumption')
  } else {
    lines.push('❌ Blueprint has validation errors')
  }

  if (result.errors.length > 0) {
    lines.push('\n🚨 Errors:')
    for (const error of result.errors) {
      lines.push(`  • ${error.message}`)
      if (error.location) {
        lines.push(`    Location: ${error.location}`)
      }
      if (error.expected) {
        lines.push(`    Expected: ${error.expected}`)
      }
      if (error.actual) {
        lines.push(`    Actual: ${error.actual}`)
      }
    }
  }

  if (result.warnings.length > 0) {
    lines.push('\n⚠️  Warnings:')
    for (const warning of result.warnings) {
      lines.push(`  • ${warning.message}`)
      if (warning.expected) {
        lines.push(`    Expected: ${warning.expected}`)
      }
    }
  }

  lines.push('')

  return lines.join('\n')
}
