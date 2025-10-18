/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import {
  readFileSync as _readFileSync,
  writeFileSync as _writeFileSync,
  existsSync as _existsSync,
  mkdirSync as _mkdirSync,
  rmSync as _rmSync,
} from 'node:fs'
import { join } from 'node:path'
import { describe, test, expect } from 'bun:test'

// ========================================
// Test Utilities
// ========================================

interface JSONSchema {
  $schema?: string
  title?: string
  version?: string
  type?: string
  description?: string
  examples?: unknown[]
  'x-business-rules'?: string[]
  'x-user-stories'?: Array<{
    story: string
    acceptance_criteria: string[]
  }>
  properties?: Record<string, JSONSchema>
  definitions?: Record<string, JSONSchema>
  items?: JSONSchema
  oneOf?: JSONSchema[]
  anyOf?: JSONSchema[]
  allOf?: JSONSchema[]
  $ref?: string
  [key: string]: unknown
}

const COMMON_DEFINITIONS = ['id', 'name', 'path']

function extractCommonDefinitions(schema: JSONSchema): {
  common: JSONSchema
  remaining: JSONSchema
} {
  const commonDefs: Record<string, JSONSchema> = {}
  const remainingDefs: Record<string, JSONSchema> = {}

  if (schema.definitions) {
    for (const [key, value] of Object.entries(schema.definitions)) {
      if (COMMON_DEFINITIONS.includes(key)) {
        commonDefs[key] = value
      } else {
        remainingDefs[key] = value
      }
    }
  }

  const common: JSONSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Common Definitions',
    description: 'Shared type definitions used across all schemas',
    definitions: commonDefs,
  }

  const remaining: JSONSchema = {
    ...schema,
    definitions: Object.keys(remainingDefs).length > 0 ? remainingDefs : undefined,
  }

  return { common, remaining }
}

function updateRefsInProperty(property: JSONSchema): JSONSchema {
  const updated = { ...property }

  if (updated.$ref && COMMON_DEFINITIONS.some((def) => updated.$ref === `#/definitions/${def}`)) {
    const defName = updated.$ref.split('/').pop()
    updated.$ref = `./schemas/common/definitions.schema.json#/definitions/${defName}`
  }

  if (updated.properties) {
    for (const [key, value] of Object.entries(updated.properties)) {
      updated.properties[key] = updateRefsInProperty(value)
    }
  }

  if (updated.items) {
    updated.items = updateRefsInProperty(updated.items)
  }

  if (updated.oneOf) {
    updated.oneOf = updated.oneOf.map(updateRefsInProperty)
  }

  if (updated.anyOf) {
    updated.anyOf = updated.anyOf.map(updateRefsInProperty)
  }

  if (updated.allOf) {
    updated.allOf = updated.allOf.map(updateRefsInProperty)
  }

  return updated
}

function updateRefsToCommon(schema: JSONSchema): JSONSchema {
  const updated = { ...schema }

  // Update $ref in definitions (recursively process each definition)
  if (updated.definitions) {
    for (const [key, value] of Object.entries(updated.definitions)) {
      updated.definitions[key] = updateRefsInProperty(value)
    }
  }

  // Update $ref in properties
  if (updated.properties) {
    for (const [key, value] of Object.entries(updated.properties)) {
      updated.properties[key] = updateRefsInProperty(value)
    }
  }

  return updated
}

// ========================================
// Tests
// ========================================

describe('extractCommonDefinitions', () => {
  test('should extract common definitions (id, name, path)', () => {
    const schema: JSONSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      definitions: {
        id: {
          type: 'string',
          pattern: '^[a-z0-9_]+$',
          'x-business-rules': ['Must be unique'],
        },
        name: {
          type: 'string',
          minLength: 1,
        },
        path: {
          type: 'string',
          pattern: '^/',
        },
        custom: {
          type: 'object',
        },
      },
    }

    const { common, remaining } = extractCommonDefinitions(schema)

    // Common should have id, name, path
    expect(common.definitions).toHaveProperty('id')
    expect(common.definitions).toHaveProperty('name')
    expect(common.definitions).toHaveProperty('path')
    expect(common.definitions).not.toHaveProperty('custom')

    // Remaining should only have custom
    expect(remaining.definitions).toHaveProperty('custom')
    expect(remaining.definitions).not.toHaveProperty('id')
    expect(remaining.definitions).not.toHaveProperty('name')
    expect(remaining.definitions).not.toHaveProperty('path')
  })

  test('should preserve Triple-Documentation Pattern in common definitions', () => {
    const schema: JSONSchema = {
      definitions: {
        id: {
          type: 'string',
          'x-business-rules': ['Must be unique', 'Cannot be changed after creation'],
          'x-user-stories': [
            {
              story: 'As a developer, I want unique identifiers',
              acceptance_criteria: ['ID must be unique', 'ID follows naming convention'],
            },
          ],
        },
      },
    }

    const { common } = extractCommonDefinitions(schema)

    expect(common.definitions?.id?.['x-business-rules']).toEqual([
      'Must be unique',
      'Cannot be changed after creation',
    ])
    expect(common.definitions?.id?.['x-user-stories']).toBeDefined()
    expect(common.definitions?.id?.['x-user-stories']?.[0]?.story).toBe(
      'As a developer, I want unique identifiers'
    )
  })

  test('should handle schema with no definitions', () => {
    const schema: JSONSchema = {
      type: 'object',
      properties: {},
    }

    const { common, remaining } = extractCommonDefinitions(schema)

    expect(common.definitions).toEqual({})
    expect(remaining.definitions).toBeUndefined()
  })

  test('should set correct metadata for common schema', () => {
    const schema: JSONSchema = {
      definitions: {
        id: { type: 'string' },
      },
    }

    const { common } = extractCommonDefinitions(schema)

    expect(common.$schema).toBe('http://json-schema.org/draft-07/schema#')
    expect(common.title).toBe('Common Definitions')
    expect(common.description).toBe('Shared type definitions used across all schemas')
  })
})

describe('updateRefsInProperty', () => {
  test('should update direct $ref to common definition', () => {
    const property: JSONSchema = {
      $ref: '#/definitions/id',
    }

    const updated = updateRefsInProperty(property)

    expect(updated.$ref).toBe('./schemas/common/definitions.schema.json#/definitions/id')
  })

  test('should not update $ref to non-common definition', () => {
    const property: JSONSchema = {
      $ref: '#/definitions/custom',
    }

    const updated = updateRefsInProperty(property)

    expect(updated.$ref).toBe('#/definitions/custom')
  })

  test('should update $ref in nested properties', () => {
    const property: JSONSchema = {
      type: 'object',
      properties: {
        tableId: {
          $ref: '#/definitions/id',
        },
        tableName: {
          $ref: '#/definitions/name',
        },
        custom: {
          $ref: '#/definitions/custom',
        },
      },
    }

    const updated = updateRefsInProperty(property)

    expect(updated.properties?.tableId?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/id'
    )
    expect(updated.properties?.tableName?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/name'
    )
    expect(updated.properties?.custom?.$ref).toBe('#/definitions/custom')
  })

  test('should update $ref in array items', () => {
    const property: JSONSchema = {
      type: 'array',
      items: {
        $ref: '#/definitions/id',
      },
    }

    const updated = updateRefsInProperty(property)

    expect(updated.items?.$ref).toBe('./schemas/common/definitions.schema.json#/definitions/id')
  })

  test('should update $ref in oneOf', () => {
    const property: JSONSchema = {
      oneOf: [{ $ref: '#/definitions/id' }, { $ref: '#/definitions/custom' }],
    }

    const updated = updateRefsInProperty(property)

    expect(updated.oneOf?.[0]?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/id'
    )
    expect(updated.oneOf?.[1]?.$ref).toBe('#/definitions/custom')
  })

  test('should update $ref in anyOf', () => {
    const property: JSONSchema = {
      anyOf: [{ $ref: '#/definitions/name' }, { type: 'null' }],
    }

    const updated = updateRefsInProperty(property)

    expect(updated.anyOf?.[0]?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/name'
    )
  })

  test('should update $ref in allOf', () => {
    const property: JSONSchema = {
      allOf: [{ $ref: '#/definitions/path' }, { minLength: 5 }],
    }

    const updated = updateRefsInProperty(property)

    expect(updated.allOf?.[0]?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/path'
    )
  })

  test('should update $ref in deeply nested structures', () => {
    const property: JSONSchema = {
      type: 'object',
      properties: {
        table: {
          type: 'object',
          properties: {
            id: {
              $ref: '#/definitions/id',
            },
            fields: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    $ref: '#/definitions/name',
                  },
                },
              },
            },
          },
        },
      },
    }

    const updated = updateRefsInProperty(property)

    expect(updated.properties?.table?.properties?.id?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/id'
    )
    expect(updated.properties?.table?.properties?.fields?.items?.properties?.name?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/name'
    )
  })

  test('should preserve Triple-Documentation Pattern metadata', () => {
    const property: JSONSchema = {
      $ref: '#/definitions/id',
      'x-business-rules': ['Must be unique'],
      'x-user-stories': [
        {
          story: 'Test story',
          acceptance_criteria: ['Test criteria'],
        },
      ],
    }

    const updated = updateRefsInProperty(property)

    expect(updated['x-business-rules']).toEqual(['Must be unique'])
    expect(updated['x-user-stories']).toBeDefined()
  })
})

describe('updateRefsToCommon', () => {
  test('should update $ref in definitions', () => {
    const schema: JSONSchema = {
      definitions: {
        table: {
          type: 'object',
          properties: {
            id: {
              $ref: '#/definitions/id',
            },
          },
        },
      },
    }

    const updated = updateRefsToCommon(schema)

    expect(updated.definitions?.table?.properties?.id?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/id'
    )
  })

  test('should update $ref in properties', () => {
    const schema: JSONSchema = {
      properties: {
        appName: {
          $ref: '#/definitions/name',
        },
      },
    }

    const updated = updateRefsToCommon(schema)

    expect(updated.properties?.appName?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/name'
    )
  })

  test('should handle mixed common and non-common refs', () => {
    const schema: JSONSchema = {
      properties: {
        id: {
          $ref: '#/definitions/id',
        },
        custom: {
          $ref: '#/definitions/custom',
        },
      },
    }

    const updated = updateRefsToCommon(schema)

    expect(updated.properties?.id?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/id'
    )
    expect(updated.properties?.custom?.$ref).toBe('#/definitions/custom')
  })
})

describe('Integration Tests', () => {
  const TEST_DIR = join(__dirname, 'test-output')
  const _TEST_SCHEMA_PATH = join(TEST_DIR, 'test-schema.json')

  test('should split and preserve complete schema structure', () => {
    const originalSchema: JSONSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'Test Schema',
      version: '1.0.0',
      definitions: {
        id: {
          type: 'string',
          pattern: '^[a-z0-9_]+$',
          'x-business-rules': ['Must be unique', 'Lowercase only'],
          'x-user-stories': [
            {
              story: 'As a developer, I want unique IDs',
              acceptance_criteria: ['ID must be unique', 'ID follows pattern'],
            },
          ],
        },
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },
        custom: {
          type: 'object',
        },
      },
      properties: {
        appName: {
          $ref: '#/definitions/name',
          description: 'Application name',
        },
        tables: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                $ref: '#/definitions/id',
              },
              name: {
                $ref: '#/definitions/name',
              },
            },
          },
        },
      },
    }

    // Extract common definitions
    const { common, remaining } = extractCommonDefinitions(originalSchema)

    // Verify common definitions
    expect(Object.keys(common.definitions || {})).toEqual(['id', 'name'])
    expect(common.definitions?.id?.['x-business-rules']).toEqual([
      'Must be unique',
      'Lowercase only',
    ])

    // Update refs
    const updated = updateRefsToCommon(remaining)

    // Verify ref updates
    expect(updated.properties?.appName?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/name'
    )
    expect(updated.properties?.tables?.items?.properties?.id?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/id'
    )
    expect(updated.properties?.tables?.items?.properties?.name?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/name'
    )

    // Verify custom definition remains
    expect(updated.definitions?.custom).toBeDefined()
    expect(updated.definitions?.id).toBeUndefined()
    expect(updated.definitions?.name).toBeUndefined()
  })

  test('should handle schema with all composition keywords', () => {
    const schema: JSONSchema = {
      properties: {
        field: {
          oneOf: [
            { $ref: '#/definitions/id' },
            {
              type: 'object',
              properties: {
                name: { $ref: '#/definitions/name' },
              },
            },
          ],
          anyOf: [{ $ref: '#/definitions/path' }],
          allOf: [
            {
              properties: {
                id: { $ref: '#/definitions/id' },
              },
            },
          ],
        },
      },
    }

    const updated = updateRefsToCommon(schema)

    expect(updated.properties?.field?.oneOf?.[0]?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/id'
    )
    expect(updated.properties?.field?.oneOf?.[1]?.properties?.name?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/name'
    )
    expect(updated.properties?.field?.anyOf?.[0]?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/path'
    )
    expect(updated.properties?.field?.allOf?.[0]?.properties?.id?.$ref).toBe(
      './schemas/common/definitions.schema.json#/definitions/id'
    )
  })
})
