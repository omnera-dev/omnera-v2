import { describe, expect, test } from 'bun:test'
import { calculateComplexity, calculateStats, compareSchemas } from './schema-comparison.ts'
import type { JSONSchema } from '../types/roadmap.ts'

describe('schema-comparison', () => {
  describe('compareSchemas', () => {
    test('detects complete property when schemas match exactly', () => {
      const current: JSONSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      }

      const vision: JSONSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      }

      const result = compareSchemas(current, vision)

      expect(result).toHaveLength(1)
      expect(result[0]?.name).toBe('name')
      expect(result[0]?.status).toBe('complete')
      expect(result[0]?.completionPercent).toBe(100)
    })

    test('detects missing property when not in current schema', () => {
      const current: JSONSchema = {
        type: 'object',
        properties: {},
      }

      const vision: JSONSchema = {
        type: 'object',
        properties: {
          newFeature: { type: 'string' },
        },
      }

      const result = compareSchemas(current, vision)

      expect(result).toHaveLength(1)
      expect(result[0]?.name).toBe('newFeature')
      expect(result[0]?.status).toBe('missing')
      expect(result[0]?.completionPercent).toBe(0)
    })

    test('detects partial property when types differ', () => {
      const current: JSONSchema = {
        type: 'object',
        properties: {
          value: { type: 'string' },
        },
      }

      const vision: JSONSchema = {
        type: 'object',
        properties: {
          value: { type: 'number' },
        },
      }

      const result = compareSchemas(current, vision)

      expect(result).toHaveLength(1)
      expect(result[0]?.name).toBe('value')
      // Status is 'partial' because current.type exists (line 88: return current.type ? 'partial' : 'missing')
      expect(result[0]?.status).toBe('partial')
      expect(result[0]?.completionPercent).toBe(0) // Type doesn't match, so 0% completion
    })

    test('detects partial property when nested properties are incomplete', () => {
      const current: JSONSchema = {
        type: 'object',
        properties: {
          config: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
          },
        },
      }

      const vision: JSONSchema = {
        type: 'object',
        properties: {
          config: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
      }

      const result = compareSchemas(current, vision)

      expect(result).toHaveLength(1)
      expect(result[0]?.name).toBe('config')
      expect(result[0]?.status).toBe('partial')
      // Completion calculation: type match (1/1) + properties (1/2) = 2/3 = 67%
      expect(result[0]?.completionPercent).toBe(67)
    })

    test('extracts dependencies for pages referencing tables', () => {
      const current: JSONSchema = {
        type: 'object',
        properties: {},
      }

      const vision: JSONSchema = {
        type: 'object',
        properties: {
          pages: {
            type: 'array',
            items: {
              anyOf: [
                {
                  type: 'object',
                  properties: {
                    table: { type: 'string' },
                  },
                },
              ],
            },
          },
        },
      }

      const result = compareSchemas(current, vision)

      expect(result).toHaveLength(1)
      expect(result[0]?.name).toBe('pages')
      expect(result[0]?.dependencies).toContain('tables')
    })
  })

  describe('calculateComplexity', () => {
    test('returns low complexity for simple string property', () => {
      const schema = { type: 'string' }
      const complexity = calculateComplexity(schema)

      expect(complexity).toBeLessThan(50)
    })

    test('returns higher complexity for object with multiple properties', () => {
      const schema = {
        type: 'object',
        properties: {
          field1: { type: 'string' },
          field2: { type: 'number' },
          field3: { type: 'boolean' },
        },
      }
      const complexity = calculateComplexity(schema)

      // Base object (10) + 3 properties (30) = 40
      expect(complexity).toBe(40)
    })

    test('returns moderate complexity for deeply nested objects', () => {
      const schema = {
        type: 'object',
        properties: {
          level1: {
            type: 'object',
            properties: {
              level2: {
                type: 'object',
                properties: {
                  level3: {
                    type: 'object',
                    properties: {
                      field: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      }
      const complexity = calculateComplexity(schema)

      // Nested complexity is multiplied by 0.5 at each level
      expect(complexity).toBeGreaterThan(20)
      expect(complexity).toBeLessThan(50)
    })

    test('returns moderate complexity for union types (anyOf)', () => {
      const schema = {
        anyOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }, { type: 'object' }],
      }
      const complexity = calculateComplexity(schema)

      // 4 variants * 15 = 60 + nested complexity * 0.3
      expect(complexity).toBeGreaterThan(50)
      expect(complexity).toBeLessThan(100)
    })

    test('returns low complexity for array (items complexity not included)', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field1: { type: 'string' },
            field2: { type: 'number' },
          },
        },
      }
      const complexity = calculateComplexity(schema)

      // Array base is 5 points (items complexity not recursively added)
      expect(complexity).toBe(5)
    })

    test('adds complexity for validation rules', () => {
      const simpleSchema = { type: 'string' }
      const complexSchema = {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        pattern: '^[a-z]+$',
      }

      const simpleComplexity = calculateComplexity(simpleSchema)
      const complexComplexity = calculateComplexity(complexSchema)

      expect(complexComplexity).toBeGreaterThan(simpleComplexity)
    })
  })

  describe('calculateStats', () => {
    test('calculates correct statistics for mixed property statuses', () => {
      const properties = [
        {
          name: 'prop1',
          status: 'complete' as const,
          visionVersion: { type: 'string' },
          completionPercent: 100,
          missingFeatures: [],
          complexity: 10,
          dependencies: [],
        },
        {
          name: 'prop2',
          status: 'missing' as const,
          visionVersion: { type: 'string' },
          completionPercent: 0,
          missingFeatures: ['All functionality'],
          complexity: 20,
          dependencies: [],
        },
        {
          name: 'prop3',
          status: 'partial' as const,
          visionVersion: { type: 'string' },
          completionPercent: 50,
          missingFeatures: ['Some features'],
          complexity: 15,
          dependencies: [],
        },
      ]

      const stats = calculateStats(properties, 'v0.0.1', 'v1.0.0')

      expect(stats.currentVersion).toBe('v0.0.1')
      expect(stats.targetVersion).toBe('v1.0.0')
      expect(stats.totalProperties).toBe(3)
      expect(stats.implementedProperties).toBe(1)
      expect(stats.partialProperties).toBe(1)
      expect(stats.missingProperties).toBe(1)
      expect(stats.overallCompletion).toBe(50) // (100 + 0 + 50) / 3 = 50
    })

    test('handles all complete properties', () => {
      const properties = [
        {
          name: 'prop1',
          status: 'complete' as const,
          visionVersion: { type: 'string' },
          completionPercent: 100,
          missingFeatures: [],
          complexity: 10,
          dependencies: [],
        },
        {
          name: 'prop2',
          status: 'complete' as const,
          visionVersion: { type: 'string' },
          completionPercent: 100,
          missingFeatures: [],
          complexity: 20,
          dependencies: [],
        },
      ]

      const stats = calculateStats(properties, 'v1.0.0', 'v1.0.0')

      expect(stats.implementedProperties).toBe(2)
      expect(stats.partialProperties).toBe(0)
      expect(stats.missingProperties).toBe(0)
      expect(stats.overallCompletion).toBe(100)
    })

    test('handles all missing properties', () => {
      const properties = [
        {
          name: 'prop1',
          status: 'missing' as const,
          visionVersion: { type: 'string' },
          completionPercent: 0,
          missingFeatures: ['All functionality'],
          complexity: 10,
          dependencies: [],
        },
      ]

      const stats = calculateStats(properties, 'v0.0.1', 'v1.0.0')

      expect(stats.implementedProperties).toBe(0)
      expect(stats.partialProperties).toBe(0)
      expect(stats.missingProperties).toBe(1)
      expect(stats.overallCompletion).toBe(0)
    })
  })
})
