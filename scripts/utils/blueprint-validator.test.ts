/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, expect, test } from 'bun:test'
import {
  formatValidationResults,
  validateBlueprint,
  type ValidationResult,
} from './blueprint-validator'
import type { EffectSchemaBlueprint, JSONSchemaProperty } from '../types/roadmap'

describe('blueprint-validator', () => {
  describe('validateBlueprint', () => {
    test('validates a correct blueprint', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'user-name',
        sanitizedName: 'UserName',
        fileName: 'user-name',
        code: `import * as Schema from 'effect/Schema'

export const UserNameSchema = Schema.String.pipe(
  Schema.minLength(1, { message: () => 'Name must not be empty' }),
  Schema.maxLength(100, { message: () => 'Name must not exceed 100 characters' }),
  Schema.annotations({
    title: 'User Name',
    description: 'The name of the user',
  })
)

export type UserName = Schema.Schema.Type<typeof UserNameSchema>
`,
        exports: ['UserNameSchema', 'UserName'],
        imports: ["import * as Schema from 'effect/Schema'"],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
        title: 'User Name',
        description: 'The name of the user',
        minLength: 1,
        maxLength: 100,
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('detects invalid TypeScript identifier', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'user-name',
        sanitizedName: 'user-name', // Invalid: contains hyphen
        fileName: 'user-name',
        code: '',
        exports: [],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.message.includes('Invalid TypeScript identifier'))).toBe(
        true
      )
      expect(
        result.errors.find((e) => e.message.includes('Invalid TypeScript identifier'))?.expected
      ).toContain('PascalCase')
    })

    test('detects identifier that does not start with uppercase', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'user-name',
        sanitizedName: 'userName', // Invalid: starts with lowercase
        fileName: 'user-name',
        code: '',
        exports: [],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.valid).toBe(false)
      expect(result.errors[0]?.message).toContain('Invalid TypeScript identifier')
    })

    test('detects missing schema constant export', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'user-name',
        sanitizedName: 'UserName',
        fileName: 'user-name',
        code: 'export type UserName = string',
        exports: ['UserName'],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.message.includes('Missing schema constant export'))).toBe(
        true
      )
    })

    test('detects missing type export', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'user-name',
        sanitizedName: 'UserName',
        fileName: 'user-name',
        code: 'export const UserNameSchema = Schema.String',
        exports: ['UserNameSchema'],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.message.includes('Missing type export'))).toBe(true)
    })

    test('detects schema constant not in exports array', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'user-name',
        sanitizedName: 'UserName',
        fileName: 'user-name',
        code: `export const UserNameSchema = Schema.String
export type UserName = Schema.Schema.Type<typeof UserNameSchema>`,
        exports: ['UserName'], // Missing UserNameSchema
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.valid).toBe(false)
      expect(
        result.errors.some((e) => e.message.includes('Schema constant not in exports array'))
      ).toBe(true)
    })

    test('detects type not in exports array', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'user-name',
        sanitizedName: 'UserName',
        fileName: 'user-name',
        code: `export const UserNameSchema = Schema.String
export type UserName = Schema.Schema.Type<typeof UserNameSchema>`,
        exports: ['UserNameSchema'], // Missing UserName
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.message.includes('Type not in exports array'))).toBe(true)
    })

    test('warns about missing title annotation', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'user-name',
        sanitizedName: 'UserName',
        fileName: 'user-name',
        code: `export const UserNameSchema = Schema.String
export type UserName = Schema.Schema.Type<typeof UserNameSchema>`,
        exports: ['UserNameSchema', 'UserName'],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
        title: 'User Name',
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.warnings.some((w) => w.message.includes('Missing title annotation'))).toBe(true)
    })

    test('warns about missing description annotation', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'user-name',
        sanitizedName: 'UserName',
        fileName: 'user-name',
        code: `export const UserNameSchema = Schema.String
export type UserName = Schema.Schema.Type<typeof UserNameSchema>`,
        exports: ['UserNameSchema', 'UserName'],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
        description: 'The user name',
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(
        result.warnings.some((w) => w.message.includes('Missing description annotation'))
      ).toBe(true)
    })

    test('warns about missing examples annotation', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'user-name',
        sanitizedName: 'UserName',
        fileName: 'user-name',
        code: `export const UserNameSchema = Schema.String
export type UserName = Schema.Schema.Type<typeof UserNameSchema>`,
        exports: ['UserNameSchema', 'UserName'],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
        examples: ['John Doe', 'Jane Smith'],
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.warnings.some((w) => w.message.includes('Missing examples annotation'))).toBe(
        true
      )
    })
  })

  describe('string validation rules', () => {
    test('detects missing minLength validation', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'user-name',
        sanitizedName: 'UserName',
        fileName: 'user-name',
        code: `export const UserNameSchema = Schema.String
export type UserName = Schema.Schema.Type<typeof UserNameSchema>`,
        exports: ['UserNameSchema', 'UserName'],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
        minLength: 1,
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.message.includes('Missing minLength validation'))).toBe(
        true
      )
    })

    test('detects missing maxLength validation', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'user-name',
        sanitizedName: 'UserName',
        fileName: 'user-name',
        code: `export const UserNameSchema = Schema.String
export type UserName = Schema.Schema.Type<typeof UserNameSchema>`,
        exports: ['UserNameSchema', 'UserName'],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
        maxLength: 100,
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.message.includes('Missing maxLength validation'))).toBe(
        true
      )
    })

    test('detects missing pattern validation', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'email',
        sanitizedName: 'Email',
        fileName: 'email',
        code: `export const EmailSchema = Schema.String
export type Email = Schema.Schema.Type<typeof EmailSchema>`,
        exports: ['EmailSchema', 'Email'],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.message.includes('Missing pattern validation'))).toBe(true)
    })

    test('warns about missing error messages for string validations', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'user-name',
        sanitizedName: 'UserName',
        fileName: 'user-name',
        code: `export const UserNameSchema = Schema.String.pipe(Schema.minLength(1))
export type UserName = Schema.Schema.Type<typeof UserNameSchema>`,
        exports: ['UserNameSchema', 'UserName'],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
        minLength: 1,
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.warnings.some((w) => w.message.includes('custom error messages'))).toBe(true)
    })
  })

  describe('number validation rules', () => {
    test('warns about missing minimum validation', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'age',
        sanitizedName: 'Age',
        fileName: 'age',
        code: `export const AgeSchema = Schema.Number
export type Age = Schema.Schema.Type<typeof AgeSchema>`,
        exports: ['AgeSchema', 'Age'],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'number',
        minimum: 0,
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.warnings.some((w) => w.message.includes('Missing minimum validation'))).toBe(
        true
      )
    })

    test('warns about missing maximum validation', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'age',
        sanitizedName: 'Age',
        fileName: 'age',
        code: `export const AgeSchema = Schema.Number
export type Age = Schema.Schema.Type<typeof AgeSchema>`,
        exports: ['AgeSchema', 'Age'],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'number',
        maximum: 150,
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.warnings.some((w) => w.message.includes('Missing maximum validation'))).toBe(
        true
      )
    })

    test('handles integer type for min/max validation', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'count',
        sanitizedName: 'Count',
        fileName: 'count',
        code: `export const CountSchema = Schema.Number
export type Count = Schema.Schema.Type<typeof CountSchema>`,
        exports: ['CountSchema', 'Count'],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'integer',
        minimum: 1,
        maximum: 100,
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.warnings.some((w) => w.message.includes('minimum validation'))).toBe(true)
      expect(result.warnings.some((w) => w.message.includes('maximum validation'))).toBe(true)
    })
  })

  describe('array validation rules', () => {
    test('warns about missing minItems validation', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'tags',
        sanitizedName: 'Tags',
        fileName: 'tags',
        code: `export const TagsSchema = Schema.Array(Schema.String)
export type Tags = Schema.Schema.Type<typeof TagsSchema>`,
        exports: ['TagsSchema', 'Tags'],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'array',
        minItems: 1,
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.warnings.some((w) => w.message.includes('Missing minItems validation'))).toBe(
        true
      )
    })

    test('warns about missing maxItems validation', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'tags',
        sanitizedName: 'Tags',
        fileName: 'tags',
        code: `export const TagsSchema = Schema.Array(Schema.String)
export type Tags = Schema.Schema.Type<typeof TagsSchema>`,
        exports: ['TagsSchema', 'Tags'],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'array',
        maxItems: 10,
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.warnings.some((w) => w.message.includes('Missing maxItems validation'))).toBe(
        true
      )
    })
  })

  describe('formatValidationResults', () => {
    test('formats valid blueprint results', () => {
      const result: ValidationResult = {
        valid: true,
        errors: [],
        warnings: [],
      }

      const output = formatValidationResults(result, 'UserName')

      expect(output).toContain('UserName')
      expect(output).toContain('✅')
      expect(output).toContain('valid and ready')
    })

    test('formats results with errors', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [
          {
            severity: 'error',
            message: 'Invalid TypeScript identifier',
            location: 'sanitizedName',
            expected: 'PascalCase',
            actual: 'user-name',
          },
        ],
        warnings: [],
      }

      const output = formatValidationResults(result, 'UserName')

      expect(output).toContain('❌')
      expect(output).toContain('🚨 Errors:')
      expect(output).toContain('Invalid TypeScript identifier')
      expect(output).toContain('Location: sanitizedName')
      expect(output).toContain('Expected: PascalCase')
      expect(output).toContain('Actual: user-name')
    })

    test('formats results with warnings', () => {
      const result: ValidationResult = {
        valid: true,
        errors: [],
        warnings: [
          {
            severity: 'warning',
            message: 'Missing title annotation',
            expected: 'title: "User Name"',
          },
        ],
      }

      const output = formatValidationResults(result, 'UserName')

      expect(output).toContain('⚠️')
      expect(output).toContain('Warnings:')
      expect(output).toContain('Missing title annotation')
      expect(output).toContain('Expected: title: "User Name"')
    })

    test('formats results with both errors and warnings', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [
          {
            severity: 'error',
            message: 'Missing schema constant export',
          },
        ],
        warnings: [
          {
            severity: 'warning',
            message: 'Missing description annotation',
          },
        ],
      }

      const output = formatValidationResults(result, 'UserName')

      expect(output).toContain('🚨 Errors:')
      expect(output).toContain('Missing schema constant export')
      expect(output).toContain('⚠️')
      expect(output).toContain('Warnings:')
      expect(output).toContain('Missing description annotation')
    })

    test('includes separator line', () => {
      const result: ValidationResult = {
        valid: true,
        errors: [],
        warnings: [],
      }

      const output = formatValidationResults(result, 'UserName')

      expect(output).toContain('='.repeat(60))
    })
  })

  describe('edge cases', () => {
    test('handles blueprint with no code', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'user-name',
        sanitizedName: 'UserName',
        fileName: 'user-name',
        code: '',
        exports: [],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    test('handles schema with no validations', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'user-name',
        sanitizedName: 'UserName',
        fileName: 'user-name',
        code: `export const UserNameSchema = Schema.String
export type UserName = Schema.Schema.Type<typeof UserNameSchema>`,
        exports: ['UserNameSchema', 'UserName'],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.valid).toBe(true)
    })

    test('handles schema with undefined optional fields', () => {
      const blueprint: EffectSchemaBlueprint = {
        propertyName: 'user-name',
        sanitizedName: 'UserName',
        fileName: 'user-name',
        code: `export const UserNameSchema = Schema.String
export type UserName = Schema.Schema.Type<typeof UserNameSchema>`,
        exports: ['UserNameSchema', 'UserName'],
        imports: [],
      }

      const sourceSchema: JSONSchemaProperty = {
        type: 'string',
        minLength: undefined,
        maxLength: undefined,
        pattern: undefined,
        title: undefined,
        description: undefined,
        examples: undefined,
      }

      const result = validateBlueprint(blueprint, sourceSchema)

      expect(result.valid).toBe(true)
      expect(result.warnings.length).toBe(0)
    })
  })
})
