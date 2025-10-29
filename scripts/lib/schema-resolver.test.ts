/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { join } from 'node:path'
import { describe, test, expect } from 'bun:test'
import { resolveJsonSchema, resolveOpenApiSchema } from './schema-resolver'

const PROJECT_ROOT = join(import.meta.dir, '..', '..')
const SPECS_APP_DIR = join(PROJECT_ROOT, 'specs', 'app')
const SPECS_API_DIR = join(PROJECT_ROOT, 'specs', 'api')

describe('schema-resolver', () => {
  describe('resolveJsonSchema', () => {
    test.skip('should resolve simple $ref to common definitions', async () => {
      const schemaPath = join(SPECS_APP_DIR, 'tables', 'id', 'id.schema.json')
      const resolved = await resolveJsonSchema(schemaPath)

      // Should have resolved the $ref to common/definitions.schema.json#/definitions/id
      expect(resolved.type).toBe('integer')
      expect(resolved.minimum).toBe(1)
      expect(resolved.maximum).toBe(9_007_199_254_740_991)
      expect(resolved.readOnly).toBe(true)

      // Should preserve local properties
      expect(resolved.title).toBe('Table ID')
      expect(resolved.description).toBe('Unique identifier for the table')
    })

    test.skip('should resolve nested $ref chains (2 levels)', async () => {
      const schemaPath = join(SPECS_APP_DIR, 'tables', 'tables.schema.json')
      const resolved = await resolveJsonSchema(schemaPath)

      // Navigate to table.id property (nested 2 levels deep)
      const tableItemSchema = resolved.items as Record<string, unknown>
      const idProperty = (tableItemSchema.properties as Record<string, unknown>)?.id as Record<
        string,
        unknown
      >

      // Should have fully resolved the nested $ref chain
      expect(idProperty.$ref).toBeUndefined()
      expect(idProperty.type).toBe('integer')
      expect(idProperty.minimum).toBe(1)
      expect(idProperty.readOnly).toBe(true)
    })

    test('should strip x-specs array during resolution', async () => {
      const schemaPath = join(SPECS_APP_DIR, 'tables', 'id', 'id.schema.json')
      const resolved = await resolveJsonSchema(schemaPath)

      // x-specs should be stripped to avoid resolving documentation examples
      expect(resolved['x-specs']).toBeUndefined()

      // But other schema properties should be preserved
      expect(resolved.title).toBe('Table ID')
      expect(resolved.description).toBe('Unique identifier for the table')
    })

    test.skip('should resolve schema with multiple $ref properties', async () => {
      const schemaPath = join(SPECS_APP_DIR, 'tables', 'tables.schema.json')
      const resolved = await resolveJsonSchema(schemaPath)

      const tableItemSchema = resolved.items as Record<string, unknown>
      const properties = tableItemSchema.properties as Record<string, unknown>

      // All $ref should be resolved
      expect(properties.id).toBeDefined()
      expect(properties.name).toBeDefined()
      expect(properties.fields).toBeDefined()
      expect(properties.primaryKey).toBeDefined()

      // Check that each property is fully resolved (no $ref)
      const idProp = properties.id as Record<string, unknown>
      const nameProp = properties.name as Record<string, unknown>

      expect(idProp.$ref).toBeUndefined()
      expect(nameProp.$ref).toBeUndefined()
      expect(idProp.type).toBeDefined()
      expect(nameProp.type).toBeDefined()
    })

    test('should throw error for non-existent schema file', async () => {
      const invalidPath = join(SPECS_APP_DIR, 'non-existent-schema.json')

      await expect(resolveJsonSchema(invalidPath)).rejects.toThrow(/Failed to resolve JSON Schema/)
    })
  })

  describe('resolveOpenApiSchema', () => {
    test('should resolve OpenAPI schema with $ref', async () => {
      const schemaPath = join(SPECS_API_DIR, 'app.openapi.json')
      const resolved = await resolveOpenApiSchema(schemaPath)

      // Should have OpenAPI structure
      expect(resolved.openapi).toBeDefined()
      expect(resolved.info).toBeDefined()
      expect(resolved.paths).toBeDefined()

      // Should resolve any $ref pointers in paths/components
      expect(typeof resolved.paths).toBe('object')
    })

    test('should preserve OpenAPI metadata after resolution', async () => {
      const schemaPath = join(SPECS_API_DIR, 'app.openapi.json')
      const resolved = await resolveOpenApiSchema(schemaPath)

      expect(resolved.info.title).toBeDefined()
      expect(resolved.info.version).toBeDefined()
      expect(typeof resolved.info.title).toBe('string')
      expect(typeof resolved.info.version).toBe('string')
    })

    test('should throw error for non-existent OpenAPI file', async () => {
      const invalidPath = join(SPECS_API_DIR, 'non-existent-openapi.json')

      await expect(resolveOpenApiSchema(invalidPath)).rejects.toThrow(
        /Failed to resolve OpenAPI schema/
      )
    })
  })
})
