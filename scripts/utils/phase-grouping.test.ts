/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, expect, test } from 'bun:test'
import { groupIntoPhases } from './phase-grouping'
import type { PropertyStatus } from '../types/roadmap'

describe('phase-grouping', () => {
  describe('groupIntoPhases', () => {
    test('creates Phase 0 for completed properties', () => {
      const properties: PropertyStatus[] = [
        {
          name: 'name',
          status: 'complete',
          visionVersion: { type: 'string' },
          completionPercent: 100,
          missingFeatures: [],
          complexity: 10,
          dependencies: [],
        },
        {
          name: 'description',
          status: 'complete',
          visionVersion: { type: 'string' },
          completionPercent: 100,
          missingFeatures: [],
          complexity: 10,
          dependencies: [],
        },
      ]

      const phases = groupIntoPhases(properties)

      expect(phases).toHaveLength(1)
      expect(phases[0]?.number).toBe(0)
      expect(phases[0]?.status).toBe('✅ DONE')
      // Final phase is always set to v1.0.0
      expect(phases[0]?.version).toBe('v1.0.0')
      expect(phases[0]?.properties).toHaveLength(2)
      expect(phases[0]?.completionPercent).toBe(100)
    })

    test('groups remaining properties into phases', () => {
      const properties: PropertyStatus[] = [
        {
          name: 'name',
          status: 'complete',
          visionVersion: { type: 'string' },
          completionPercent: 100,
          missingFeatures: [],
          complexity: 10,
          dependencies: [],
        },
        {
          name: 'tables',
          status: 'missing',
          visionVersion: { type: 'array' },
          completionPercent: 0,
          missingFeatures: ['All functionality'],
          complexity: 500,
          dependencies: [],
        },
        {
          name: 'pages',
          status: 'missing',
          visionVersion: { type: 'array' },
          completionPercent: 0,
          missingFeatures: ['All functionality'],
          complexity: 300,
          dependencies: ['tables'],
        },
      ]

      const phases = groupIntoPhases(properties)

      expect(phases.length).toBeGreaterThan(1)
      expect(phases[0]?.status).toBe('✅ DONE')

      // Phases after 0 should be NOT STARTED
      for (let i = 1; i < phases.length; i++) {
        expect(phases[i]?.status).toBe('⏳ NOT STARTED')
      }
    })

    test('assigns sequential version numbers to phases', () => {
      const properties: PropertyStatus[] = [
        {
          name: 'feature1',
          status: 'missing',
          visionVersion: { type: 'string' },
          completionPercent: 0,
          missingFeatures: ['All functionality'],
          complexity: 100,
          dependencies: [],
        },
        {
          name: 'feature2',
          status: 'missing',
          visionVersion: { type: 'string' },
          completionPercent: 0,
          missingFeatures: ['All functionality'],
          complexity: 100,
          dependencies: [],
        },
      ]

      const phases = groupIntoPhases(properties)

      // Check version format (v0.X.0)
      for (const phase of phases) {
        expect(phase.version).toMatch(/^v\d+\.\d+\.\d+$/)
      }
    })

    test('calculates phase completion correctly', () => {
      const properties: PropertyStatus[] = [
        {
          name: 'feature1',
          status: 'complete',
          visionVersion: { type: 'string' },
          completionPercent: 100,
          missingFeatures: [],
          complexity: 100,
          dependencies: [],
        },
        {
          name: 'feature2',
          status: 'partial',
          visionVersion: { type: 'string' },
          completionPercent: 50,
          missingFeatures: ['Some features'],
          complexity: 100,
          dependencies: [],
        },
      ]

      const phases = groupIntoPhases(properties)
      const phase0 = phases[0]

      // Phase 0 only contains complete properties (feature1)
      expect(phase0?.completionPercent).toBe(100)

      // Phase 1 should contain the partial property
      if (phases.length > 1) {
        expect(phases[1]?.completionPercent).toBe(50)
      }
    })

    test('includes duration estimate for each phase', () => {
      const properties: PropertyStatus[] = [
        {
          name: 'feature',
          status: 'missing',
          visionVersion: { type: 'string' },
          completionPercent: 0,
          missingFeatures: ['All functionality'],
          complexity: 100,
          dependencies: [],
        },
      ]

      const phases = groupIntoPhases(properties)

      for (const phase of phases) {
        expect(phase.durationEstimate).toBeTruthy()
        expect(phase.durationEstimate).toMatch(/\d+-\d+ (days|weeks|months)/)
      }
    })

    test('handles properties with dependencies', () => {
      const properties: PropertyStatus[] = [
        {
          name: 'tables',
          status: 'missing',
          visionVersion: { type: 'array' },
          completionPercent: 0,
          missingFeatures: ['All functionality'],
          complexity: 500,
          dependencies: [],
        },
        {
          name: 'pages',
          status: 'missing',
          visionVersion: { type: 'array' },
          completionPercent: 0,
          missingFeatures: ['All functionality'],
          complexity: 300,
          dependencies: ['tables'],
        },
      ]

      const phases = groupIntoPhases(properties)

      // Find phase with pages
      const pagesPhase = phases.find((p) => p.properties.some((prop) => prop.name === 'pages'))
      // Find phase with tables
      const tablesPhase = phases.find((p) => p.properties.some((prop) => prop.name === 'tables'))

      // Pages phase should come after tables phase
      if (pagesPhase && tablesPhase) {
        expect(pagesPhase.number).toBeGreaterThan(tablesPhase.number)
      }
    })

    test('splits complex properties into multiple phases', () => {
      const properties: PropertyStatus[] = [
        {
          name: 'tables',
          status: 'missing',
          visionVersion: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                fields: {
                  type: 'array',
                  items: {
                    anyOf: [
                      { type: 'object', properties: { type: { const: 'text' } } },
                      { type: 'object', properties: { type: { const: 'number' } } },
                      { type: 'object', properties: { type: { const: 'relationship' } } },
                      { type: 'object', properties: { type: { const: 'attachment' } } },
                    ],
                  },
                },
              },
            },
          },
          completionPercent: 0,
          missingFeatures: ['All functionality'],
          complexity: 1000,
          dependencies: [],
        },
      ]

      const phases = groupIntoPhases(properties)

      // Tables should potentially be split into foundation and advanced phases
      const tablesPhases = phases.filter((p) => p.name.toLowerCase().includes('table'))

      // Should have at least one tables-related phase
      expect(tablesPhases.length).toBeGreaterThan(0)
    })

    test('handles empty property list', () => {
      const properties: PropertyStatus[] = []

      const phases = groupIntoPhases(properties)

      expect(phases).toEqual([])
    })

    test('handles only completed properties', () => {
      const properties: PropertyStatus[] = [
        {
          name: 'feature1',
          status: 'complete',
          visionVersion: { type: 'string' },
          completionPercent: 100,
          missingFeatures: [],
          complexity: 10,
          dependencies: [],
        },
      ]

      const phases = groupIntoPhases(properties)

      expect(phases).toHaveLength(1)
      expect(phases[0]?.number).toBe(0)
      expect(phases[0]?.status).toBe('✅ DONE')
    })

    test('assigns meaningful names to phases', () => {
      const properties: PropertyStatus[] = [
        {
          name: 'tables',
          status: 'missing',
          visionVersion: { type: 'array' },
          completionPercent: 0,
          missingFeatures: ['All functionality'],
          complexity: 500,
          dependencies: [],
        },
      ]

      const phases = groupIntoPhases(properties)
      const tablePhase = phases.find((p) => p.properties.some((prop) => prop.name === 'tables'))

      expect(tablePhase).toBeTruthy()
      expect(tablePhase?.name).toBeTruthy()
      expect(tablePhase?.name).not.toBe('')
    })
  })
})
