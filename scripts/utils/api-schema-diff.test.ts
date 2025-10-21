/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { join } from 'node:path'
import { compareApiSchemas } from './api-schema-diff'

const PROJECT_ROOT = join(import.meta.dir, '..', '..')
const GOAL_API_SCHEMA = join(PROJECT_ROOT, 'specs', 'api', 'app.openapi.json')
const CURRENT_API_SCHEMA = join(PROJECT_ROOT, 'schemas', '0.0.1', 'app.openapi.json')

describe('api-schema-diff', () => {
  describe('compareApiSchemas', () => {
    test('should compare goal and current OpenAPI schemas', async () => {
      const result = await compareApiSchemas(GOAL_API_SCHEMA, CURRENT_API_SCHEMA)

      // Should return comparison structure
      expect(result.totalEndpoints).toBeGreaterThan(0)
      expect(result.implementedEndpoints).toBeGreaterThanOrEqual(0)
      expect(result.missingEndpoints).toBeGreaterThanOrEqual(0)
      expect(result.completionPercent).toBeGreaterThanOrEqual(0)
      expect(result.completionPercent).toBeLessThanOrEqual(100)
    })

    test('should calculate correct endpoint counts', async () => {
      const result = await compareApiSchemas(GOAL_API_SCHEMA, CURRENT_API_SCHEMA)

      // Total should equal implemented + missing
      expect(result.totalEndpoints).toBe(result.implementedEndpoints + result.missingEndpoints)
    })

    test('should return sorted endpoint paths', async () => {
      const result = await compareApiSchemas(GOAL_API_SCHEMA, CURRENT_API_SCHEMA)

      // Should have arrays of endpoints
      expect(Array.isArray(result.missingEndpointPaths)).toBe(true)
      expect(Array.isArray(result.implementedEndpointPaths)).toBe(true)

      // Each endpoint should have path and method
      if (result.missingEndpointPaths.length > 0) {
        const endpoint = result.missingEndpointPaths[0]
        expect(endpoint.path).toBeDefined()
        expect(endpoint.method).toBeDefined()
        expect(typeof endpoint.path).toBe('string')
        expect(typeof endpoint.method).toBe('string')
      }

      // Arrays should be sorted by path then method
      const isSorted = (arr: Array<{ path: string; method: string }>) => {
        for (let i = 1; i < arr.length; i++) {
          const prev = arr[i - 1]
          const curr = arr[i]
          if (prev.path > curr.path) return false
          if (prev.path === curr.path && prev.method > curr.method) return false
        }
        return true
      }

      expect(isSorted(result.missingEndpointPaths)).toBe(true)
      expect(isSorted(result.implementedEndpointPaths)).toBe(true)
    })

    test('should calculate completion percentage correctly', async () => {
      const result = await compareApiSchemas(GOAL_API_SCHEMA, CURRENT_API_SCHEMA)

      const expectedPercent = Math.round(
        (result.implementedEndpoints / result.totalEndpoints) * 100
      )

      expect(result.completionPercent).toBe(expectedPercent)
    })

    test('should extract valid HTTP methods', async () => {
      const result = await compareApiSchemas(GOAL_API_SCHEMA, CURRENT_API_SCHEMA)

      const allEndpoints = [...result.implementedEndpointPaths, ...result.missingEndpointPaths]

      const validMethods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head']

      // All endpoints should have valid HTTP methods (lowercase)
      allEndpoints.forEach((endpoint) => {
        expect(validMethods.includes(endpoint.method)).toBe(true)
      })
    })

    test('should handle endpoint paths starting with /', async () => {
      const result = await compareApiSchemas(GOAL_API_SCHEMA, CURRENT_API_SCHEMA)

      const allEndpoints = [...result.implementedEndpointPaths, ...result.missingEndpointPaths]

      // All paths should start with /
      allEndpoints.forEach((endpoint) => {
        expect(endpoint.path.startsWith('/')).toBe(true)
      })
    })

    test('should resolve $ref pointers before comparison', async () => {
      const result = await compareApiSchemas(GOAL_API_SCHEMA, CURRENT_API_SCHEMA)

      // If $ref resolution works, we should get valid endpoint extraction
      expect(result.totalEndpoints).toBeGreaterThan(0)
      expect(typeof result.completionPercent).toBe('number')
    })

    test('should identify standard REST endpoints', async () => {
      const result = await compareApiSchemas(GOAL_API_SCHEMA, CURRENT_API_SCHEMA)

      const allEndpoints = [...result.implementedEndpointPaths, ...result.missingEndpointPaths]

      // Should have some standard REST patterns like GET /tables
      const hasStandardEndpoints = allEndpoints.some(
        (endpoint) =>
          endpoint.path.includes('/tables') ||
          endpoint.path.includes('/pages') ||
          endpoint.path.includes('/automations')
      )

      expect(hasStandardEndpoints).toBe(true)
    })
  })
})
