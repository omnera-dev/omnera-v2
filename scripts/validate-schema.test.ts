/**
 * Unit tests for validate-schema.ts
 * Tests JSON Schema Draft 7 validation functionality
 */

import { spawnSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, test, expect, beforeAll } from 'bun:test'

const SCHEMA_PATH = join(__dirname, '..', 'docs', 'specifications', 'specs.schema.json')
const VALIDATOR_PATH = join(__dirname, 'validate-schema.ts')

describe('validate-schema.ts', () => {
  describe('Schema File Tests', () => {
    test('schema file exists', () => {
      expect(existsSync(SCHEMA_PATH)).toBe(true)
    })

    test('validator script exists', () => {
      expect(existsSync(VALIDATOR_PATH)).toBe(true)
    })

    test('schema is valid JSON', () => {
      const content = readFileSync(SCHEMA_PATH, 'utf-8')
      expect(() => JSON.parse(content)).not.toThrow()
    })
  })

  describe('Draft 7 Compliance', () => {
    let schema: Record<string, any>

    beforeAll(() => {
      const content = readFileSync(SCHEMA_PATH, 'utf-8')
      schema = JSON.parse(content)
    })

    test('uses Draft 7 schema URI', () => {
      expect(schema.$schema).toBe('http://json-schema.org/draft-07/schema#')
    })

    test('uses definitions not $defs', () => {
      expect(schema.$defs).toBeUndefined()
      expect(schema.definitions).toBeDefined()
      expect(typeof schema.definitions).toBe('object')
    })

    test('has required top-level properties', () => {
      expect(schema.title).toBeDefined()
      expect(schema.type).toBe('object')
      expect(schema.version).toBeDefined()
      expect(schema.properties).toBeDefined()
      expect(schema.required).toBeInstanceOf(Array)
    })

    test('all required properties are defined', () => {
      const requiredProps = schema.required || []
      requiredProps.forEach((prop: string) => {
        expect(schema.properties[prop]).toBeDefined()
      })
    })
  })

  describe('Schema Structure', () => {
    let schema: Record<string, any>

    beforeAll(() => {
      const content = readFileSync(SCHEMA_PATH, 'utf-8')
      schema = JSON.parse(content)
    })

    test('definitions have correct structure', () => {
      if (schema.definitions) {
        Object.entries(schema.definitions).forEach(([_key, def]) => {
          expect(def).toBeDefined()

          const defTyped = def as Record<string, any>
          // Definitions should have either a type, $ref, or combiners (anyOf/oneOf/allOf)
          const hasType = defTyped.type !== undefined
          const hasRef = defTyped.$ref !== undefined
          const hasAnyOf = defTyped.anyOf !== undefined
          const hasOneOf = defTyped.oneOf !== undefined
          const hasAllOf = defTyped.allOf !== undefined

          expect(hasType || hasRef || hasAnyOf || hasOneOf || hasAllOf).toBe(true)

          // Check that type is valid JSON Schema type if present
          const validTypes = ['string', 'number', 'integer', 'boolean', 'object', 'array', 'null']
          if (typeof defTyped.type === 'string') {
            expect(validTypes).toContain(defTyped.type)
          }
        })
      }
    })

    test('properties have correct structure', () => {
      Object.entries(schema.properties).forEach(([_key, prop]) => {
        expect(prop).toBeDefined()

        // Properties should have either a type or a $ref
        const propTyped = prop as Record<string, any>
        const hasType = propTyped.type !== undefined
        const hasRef = propTyped.$ref !== undefined
        const hasAnyOf = propTyped.anyOf !== undefined
        const hasOneOf = propTyped.oneOf !== undefined
        const hasAllOf = propTyped.allOf !== undefined

        expect(hasType || hasRef || hasAnyOf || hasOneOf || hasAllOf).toBe(true)
      })
    })
  })

  describe('Reference Validation', () => {
    let schema: Record<string, any>

    beforeAll(() => {
      const content = readFileSync(SCHEMA_PATH, 'utf-8')
      schema = JSON.parse(content)
    })

    test('all $ref paths use #/definitions/ format', () => {
      const content = readFileSync(SCHEMA_PATH, 'utf-8')

      // Check for invalid $defs references
      const invalidRefs = content.match(/#\/\$defs\//g)
      expect(invalidRefs).toBeNull()

      // Check that definition references exist and are correct
      const validRefs = content.match(/#\/definitions\//g)
      if (validRefs) {
        expect(validRefs.length).toBeGreaterThan(0)
      }
    })

    test('all references point to existing definitions', () => {
      const findRefs = (obj: Record<string, any>, refs: Set<string> = new Set()): Set<string> => {
        if (obj && typeof obj === 'object') {
          if (obj.$ref && typeof obj.$ref === 'string') {
            const match = obj.$ref.match(/^#\/definitions\/(\w+)$/)
            if (match && match[1]) {
              refs.add(match[1])
            }
          }

          Object.values(obj).forEach((value) => {
            if (value && typeof value === 'object') {
              findRefs(value, refs)
            }
          })
        }
        return refs
      }

      const usedRefs = findRefs(schema)
      const definedRefs = new Set(Object.keys(schema.definitions || {}))

      // All used references should be defined
      usedRefs.forEach((ref) => {
        expect(definedRefs.has(ref)).toBe(true)
      })
    })
  })

  describe('Specific Schema Requirements', () => {
    let schema: Record<string, any>

    beforeAll(() => {
      const content = readFileSync(SCHEMA_PATH, 'utf-8')
      schema = JSON.parse(content)
    })

    test('contains expected application properties', () => {
      const expectedProps = [
        'name',
        'description',
        'version',
        'tables',
        'pages',
        'automations',
        'connections',
      ]

      expectedProps.forEach((prop) => {
        expect(schema.properties[prop]).toBeDefined()
      })
    })

    test('tables property references external schema', () => {
      expect(schema.properties.tables.$ref).toBe('./schemas/tables/tables.schema.json')
    })

    test('pages property references external schema', () => {
      expect(schema.properties.pages.$ref).toBe('./schemas/pages/pages.schema.json')
    })

    test('version follows semantic versioning pattern', () => {
      if (schema.properties.version.pattern) {
        const { pattern } = schema.properties.version
        // Test valid semver strings
        const validVersions = ['1.0.0', '2.1.3', '0.5.0-beta']
        validVersions.forEach((version) => {
          const regex = new RegExp(pattern)
          expect(regex.test(version)).toBe(true)
        })
      }
    })
  })

  describe('Script Execution', () => {
    test('validator script runs without errors when AJV is installed', () => {
      // Check if AJV is installed
      const checkAjv = spawnSync('bun', ['pm', 'ls'], { encoding: 'utf8' })
      const hasAjv = checkAjv.stdout?.includes('ajv')

      if (hasAjv) {
        const result = spawnSync('bun', ['run', VALIDATOR_PATH], { encoding: 'utf8' })

        // Should exit successfully
        expect(result.status).toBe(0)

        // Should contain success messages
        expect(result.stdout).toContain('Schema validation complete!')
        expect(result.stdout).toContain('Schema compiled successfully')
        expect(result.stdout).toContain('Schema conforms to Draft 7 metaschema')
      } else {
        // If AJV is not installed, script should exit with error
        const result = spawnSync('bun', ['run', VALIDATOR_PATH], { encoding: 'utf8' })

        expect(result.status).toBe(1)
        expect(result.stderr || result.stdout).toContain('AJV is required')
      }
    })
  })

  describe('Sample Document Validation', () => {
    let schema: Record<string, any>

    beforeAll(() => {
      const content = readFileSync(SCHEMA_PATH, 'utf-8')
      schema = JSON.parse(content)
    })

    test('minimal valid document structure', () => {
      const minimalDoc = {
        name: 'Test App',
        description: 'Test description',
        version: '1.0.0',
        tables: [],
        pages: [
          {
            type: 'custom-html',
            name: 'home',
            path: '/',
            head: [],
            body: [{ type: 'custom-html', content: 'Test' }],
          },
        ],
        automations: [],
        connections: [],
      }

      // Check all required fields are present
      schema.required.forEach((field: string) => {
        expect(minimalDoc[field as keyof typeof minimalDoc]).toBeDefined()
      })
    })
  })
})
