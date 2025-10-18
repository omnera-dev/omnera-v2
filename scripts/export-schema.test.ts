/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect, describe } from 'bun:test'

/**
 * Add $id field to JSON Schema
 */
function addSchemaId(jsonSchema: unknown, version: string, schemaName: string): unknown {
  const schema = jsonSchema as Record<string, unknown>
  const { $id: _existingId, ...rest } = schema
  return {
    $id: `https://omnera.dev/schemas/${version}/${schemaName}.schema.json`,
    ...rest,
  }
}

describe('export-schema', () => {
  describe('addSchemaId', () => {
    test('should add $id field to JSON schema', () => {
      const schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      }

      const result = addSchemaId(schema, '1.0.0', 'app')

      expect(result).toHaveProperty('$id')
      expect((result as any).$id).toBe('https://omnera.dev/schemas/1.0.0/app.schema.json')
    })

    test('should preserve all existing schema properties', () => {
      const schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        title: 'Test Schema',
        description: 'A test schema',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        },
        required: ['name'],
      }

      const result = addSchemaId(schema, '1.0.0', 'app') as any

      expect(result.$schema).toBe('http://json-schema.org/draft-07/schema#')
      expect(result.type).toBe('object')
      expect(result.title).toBe('Test Schema')
      expect(result.description).toBe('A test schema')
      expect(result.properties).toEqual(schema.properties)
      expect(result.required).toEqual(['name'])
    })

    test('should place $id as first property', () => {
      const schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
      }

      const result = addSchemaId(schema, '1.0.0', 'app')
      const keys = Object.keys(result as object)

      expect(keys[0]).toBe('$id')
    })

    test('should format version correctly in $id', () => {
      const schema = { type: 'object' }

      const result1 = addSchemaId(schema, '0.0.1', 'app') as any
      expect(result1.$id).toBe('https://omnera.dev/schemas/0.0.1/app.schema.json')

      const result2 = addSchemaId(schema, '2.5.3-beta.1', 'app') as any
      expect(result2.$id).toBe('https://omnera.dev/schemas/2.5.3-beta.1/app.schema.json')

      const result3 = addSchemaId(schema, '1.0.0+build.123', 'app') as any
      expect(result3.$id).toBe('https://omnera.dev/schemas/1.0.0+build.123/app.schema.json')
    })

    test('should format schema name correctly in $id', () => {
      const schema = { type: 'object' }

      const result1 = addSchemaId(schema, '1.0.0', 'app') as any
      expect(result1.$id).toBe('https://omnera.dev/schemas/1.0.0/app.schema.json')

      const result2 = addSchemaId(schema, '1.0.0', 'table') as any
      expect(result2.$id).toBe('https://omnera.dev/schemas/1.0.0/table.schema.json')

      const result3 = addSchemaId(schema, '1.0.0', 'field') as any
      expect(result3.$id).toBe('https://omnera.dev/schemas/1.0.0/field.schema.json')
    })

    test('should handle empty schema object', () => {
      const schema = {}

      const result = addSchemaId(schema, '1.0.0', 'app') as any

      expect(result.$id).toBe('https://omnera.dev/schemas/1.0.0/app.schema.json')
      expect(Object.keys(result).length).toBe(1)
    })

    test('should handle schema with nested objects', () => {
      const schema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              address: {
                type: 'object',
                properties: {
                  street: { type: 'string' },
                  city: { type: 'string' },
                },
              },
            },
          },
        },
      }

      const result = addSchemaId(schema, '1.0.0', 'app') as any

      expect(result.$id).toBe('https://omnera.dev/schemas/1.0.0/app.schema.json')
      expect(result.properties.user.properties.address.properties.city).toEqual({ type: 'string' })
    })

    test('should handle schema with $defs', () => {
      const schema = {
        type: 'object',
        $defs: {
          StringType: {
            type: 'string',
          },
          NumberType: {
            type: 'number',
          },
        },
        properties: {
          name: { $ref: '#/$defs/StringType' },
          age: { $ref: '#/$defs/NumberType' },
        },
      }

      const result = addSchemaId(schema, '1.0.0', 'app') as any

      expect(result.$id).toBe('https://omnera.dev/schemas/1.0.0/app.schema.json')
      expect(result.$defs).toEqual(schema.$defs)
      expect(result.properties.name.$ref).toBe('#/$defs/StringType')
    })

    test('should override $id if it already exists', () => {
      const schema = {
        $id: 'https://old.com/schema.json',
        type: 'object',
      }

      const result = addSchemaId(schema, '1.0.0', 'app') as any

      expect(result.$id).toBe('https://omnera.dev/schemas/1.0.0/app.schema.json')
    })

    test('should work with complex real-world schema structure', () => {
      const schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $defs: {
          Int: {
            type: 'integer',
            description: 'an integer',
            title: 'int',
          },
        },
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            $ref: '#/$defs/Int',
            minimum: 1,
          },
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 214,
          },
        },
        title: 'Table',
        description: 'A database table',
      }

      const result = addSchemaId(schema, '1.0.0', 'table') as any

      expect(result.$id).toBe('https://omnera.dev/schemas/1.0.0/table.schema.json')
      expect(result.$schema).toBe('http://json-schema.org/draft-07/schema#')
      expect(result.title).toBe('Table')
      expect(result.description).toBe('A database table')
      expect(result.$defs.Int).toEqual(schema.$defs.Int)
    })
  })
})
