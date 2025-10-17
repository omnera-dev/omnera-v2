import { describe, expect, test } from 'bun:test'
import { generateEffectSchema } from './effect-schema-generator.ts'
import type { JSONSchemaProperty } from '../types/roadmap.ts'

describe('effect-schema-generator', () => {
  describe('generateEffectSchema', () => {
    test('generates simple string schema', () => {
      const schema: JSONSchemaProperty = {
        type: 'string',
        title: 'Name',
        description: 'User name',
      }

      const result = generateEffectSchema('name', schema)

      expect(result.propertyName).toBe('name')
      expect(result.imports).toContain('Schema')
      expect(result.exports).toContain('NameSchema')
      expect(result.exports).toContain('Name')
      expect(result.code).toContain('export const NameSchema')
      expect(result.code).toContain('Schema.String')
      expect(result.code).toContain('export type Name')
    })

    test('generates string schema with validations', () => {
      const schema: JSONSchemaProperty = {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        pattern: '^[a-z]+$',
      }

      const result = generateEffectSchema('username', schema)

      expect(result.code).toContain('Schema.String.pipe')
      expect(result.code).toContain('Schema.minLength(1')
      expect(result.code).toContain('Schema.maxLength(100')
      expect(result.code).toContain('Schema.pattern(/')
    })

    test('generates number schema with constraints', () => {
      const schema: JSONSchemaProperty = {
        type: 'number',
        minimum: 0,
        maximum: 100,
      }

      const result = generateEffectSchema('score', schema)

      expect(result.code).toContain('Schema.Number')
      expect(result.code).toContain('Schema.greaterThanOrEqualTo(0)')
      expect(result.code).toContain('Schema.lessThanOrEqualTo(100)')
    })

    test('generates integer schema', () => {
      const schema: JSONSchemaProperty = {
        type: 'integer',
        minimum: 1,
      }

      const result = generateEffectSchema('count', schema)

      expect(result.code).toContain('Schema.Int')
      expect(result.code).toContain('Schema.greaterThanOrEqualTo(1)')
    })

    test('generates boolean schema', () => {
      const schema: JSONSchemaProperty = {
        type: 'boolean',
      }

      const result = generateEffectSchema('enabled', schema)

      expect(result.code).toContain('Schema.Boolean')
    })

    test('generates enum schema with Literal', () => {
      const schema: JSONSchemaProperty = {
        enum: ['draft', 'published', 'archived'],
      }

      const result = generateEffectSchema('status', schema)

      expect(result.code).toContain('Schema.Literal')
      expect(result.code).toContain('"draft"')
      expect(result.code).toContain('"published"')
      expect(result.code).toContain('"archived"')
    })

    test('generates object schema with properties', () => {
      const schema: JSONSchemaProperty = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        },
        required: ['name'],
      }

      const result = generateEffectSchema('user', schema)

      expect(result.code).toContain('Schema.Struct({')
      expect(result.code).toContain('name: Schema.String')
      expect(result.code).toContain('age: Schema.optional(Schema.Number)')
    })

    test('generates array schema', () => {
      const schema: JSONSchemaProperty = {
        type: 'array',
        items: {
          type: 'string',
        },
        minItems: 1,
      }

      const result = generateEffectSchema('tags', schema)

      expect(result.code).toContain('Schema.Array(Schema.String)')
      expect(result.code).toContain('Schema.minItems(1)')
    })

    test('generates union schema with anyOf', () => {
      const schema: JSONSchemaProperty = {
        anyOf: [{ type: 'string' }, { type: 'number' }],
      }

      const result = generateEffectSchema('value', schema)

      expect(result.code).toContain('Schema.Union')
      expect(result.code).toContain('Schema.String')
      expect(result.code).toContain('Schema.Number')
    })

    test('generates nested object schema', () => {
      const schema: JSONSchemaProperty = {
        type: 'object',
        properties: {
          address: {
            type: 'object',
            properties: {
              street: { type: 'string' },
              city: { type: 'string' },
            },
            required: ['city'],
          },
        },
      }

      const result = generateEffectSchema('user', schema)

      expect(result.code).toContain('Schema.Struct({')
      expect(result.code).toContain('address: Schema.optional')
      expect(result.code).toContain('street: Schema.optional(Schema.String)')
      expect(result.code).toContain('city: Schema.String')
    })

    test('includes JSDoc comments from schema metadata', () => {
      const schema: JSONSchemaProperty = {
        type: 'string',
        title: 'User Name',
        description: 'The name of the user',
        examples: ['John Doe'],
      }

      const result = generateEffectSchema('name', schema)

      expect(result.code).toContain('/**')
      expect(result.code).toContain('User Name')
      expect(result.code).toContain('The name of the user')
      expect(result.code).toContain('@example')
      expect(result.code).toContain('John Doe')
    })

    test('adds annotations for title and description', () => {
      const schema: JSONSchemaProperty = {
        type: 'string',
        title: 'Email',
        description: 'User email address',
      }

      const result = generateEffectSchema('email', schema)

      expect(result.code).toContain('Schema.annotations({')
      expect(result.code).toContain('title: "Email"')
      expect(result.code).toContain('description: "User email address"')
    })

    test('generates array of complex objects', () => {
      const schema: JSONSchemaProperty = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
          required: ['id'],
        },
      }

      const result = generateEffectSchema('items', schema)

      expect(result.code).toContain('Schema.Array')
      expect(result.code).toContain('Schema.Struct({')
      expect(result.code).toContain('id: Schema.String')
      expect(result.code).toContain('name: Schema.optional(Schema.String)')
    })

    test('handles $ref with definitions', () => {
      const schema: JSONSchemaProperty = {
        $ref: '#/definitions/Address',
      }

      const definitions = {
        Address: {
          type: 'object',
          properties: {
            street: { type: 'string' },
          },
        } as JSONSchemaProperty,
      }

      const result = generateEffectSchema('address', schema, definitions)

      expect(result.code).toContain('Schema.Struct({')
      expect(result.code).toContain('street: Schema.optional(Schema.String)')
    })

    test('generates custom error messages for minLength', () => {
      const schema: JSONSchemaProperty = {
        type: 'string',
        minLength: 1,
      }

      const result = generateEffectSchema('name', schema)

      expect(result.code).toContain('This field is required')
    })

    test('generates custom error messages for pattern', () => {
      const schema: JSONSchemaProperty = {
        type: 'string',
        pattern: '^[a-z]+$',
        description: 'Must be lowercase letters only',
      }

      const result = generateEffectSchema('slug', schema)

      expect(result.code).toContain('Schema.pattern(/')
      expect(result.code).toContain('Must be lowercase letters only')
    })
  })
})
