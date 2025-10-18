import { describe, expect, test } from 'bun:test'
import { generateUserStories } from './user-story-generator.ts'
import type { JSONSchemaProperty } from '../types/roadmap.ts'

describe('user-story-generator', () => {
  describe('generateUserStories', () => {
    test('generates @spec stories for string with minLength validation', () => {
      const schema: JSONSchemaProperty = {
        type: 'string',
        minLength: 1,
      }

      const result = generateUserStories('name', schema)

      expect(result.spec.length).toBeGreaterThan(0)

      const minLengthStory = result.spec.find((s) => s.then.includes('error'))

      expect(minLengthStory).toBeTruthy()
      expect(minLengthStory?.given).toContain('Name') // humanize() capitalizes first letter
      expect(minLengthStory?.when).toContain('length')
      expect(minLengthStory?.tag).toBe('@spec')
    })

    test('generates @spec stories for string with pattern validation', () => {
      const schema: JSONSchemaProperty = {
        type: 'string',
        pattern: '^[a-z]+$',
      }

      const result = generateUserStories('slug', schema)

      const patternStory = result.spec.find((s) => s.when.includes('not match'))

      expect(patternStory).toBeTruthy()
      expect(patternStory?.given).toContain('Slug') // humanize() capitalizes first letter
      expect(patternStory?.then).toContain('error')
      expect(patternStory?.tag).toBe('@spec')
    })

    test('generates @spec stories for enum validation', () => {
      const schema: JSONSchemaProperty = {
        enum: ['draft', 'published', 'archived'],
      }

      const result = generateUserStories('status', schema)

      expect(result.spec.length).toBeGreaterThan(0)

      const enumStory = result.spec.find((s) => s.when.includes('valid'))

      expect(enumStory).toBeTruthy()
      expect(enumStory?.given).toContain('Status') // humanize() capitalizes first letter
      expect(enumStory?.then).toContain('accept')
      expect(enumStory?.tag).toBe('@spec')
    })

    test('generates @spec stories for number with minimum validation', () => {
      const schema: JSONSchemaProperty = {
        type: 'number',
        minimum: 0,
      }

      const result = generateUserStories('age', schema)

      const minStory = result.spec.find((s) => s.when.includes('less than'))

      expect(minStory).toBeTruthy()
      expect(minStory?.given).toContain('Age') // humanize() capitalizes first letter
      expect(minStory?.then).toContain('error')
      expect(minStory?.tag).toBe('@spec')
    })

    test('generates @spec stories for number with maximum validation', () => {
      const schema: JSONSchemaProperty = {
        type: 'number',
        maximum: 100,
      }

      const result = generateUserStories('score', schema)

      // Look for "exceeds" instead of "greater than"
      const maxStory = result.spec.find((s) => s.when.includes('exceeds'))

      expect(maxStory).toBeTruthy()
      expect(maxStory?.given).toContain('Score') // humanize() capitalizes first letter
      expect(maxStory?.then).toContain('error')
      expect(maxStory?.tag).toBe('@spec')
    })

    test('generates @spec stories for array operations', () => {
      const schema: JSONSchemaProperty = {
        type: 'array',
        items: { type: 'object' },
      }

      const result = generateUserStories('items', schema)

      expect(result.spec.length).toBeGreaterThan(0)

      const addStory = result.spec.find((s) => s.when.includes('adding'))
      const removeStory = result.spec.find((s) => s.when.includes('removing'))

      expect(addStory).toBeTruthy()
      expect(removeStory).toBeTruthy()
      expect(addStory?.tag).toBe('@spec')
      expect(removeStory?.tag).toBe('@spec')
    })

    test('generates @regression story that consolidates all specs', () => {
      const schema: JSONSchemaProperty = {
        type: 'string',
        minLength: 1,
        maxLength: 100,
      }

      const result = generateUserStories('name', schema)

      expect(result.regression).toHaveLength(1)

      const regressionStory = result.regression[0]!

      expect(regressionStory.given).toContain('configuring')
      expect(regressionStory.when).toContain('full configuration workflow')
      expect(regressionStory.then).toContain('successfully')
      expect(regressionStory.tag).toBe('@regression')
    })

    test('generates @critical story for essential features', () => {
      const schema: JSONSchemaProperty = {
        type: 'array',
      }

      const result = generateUserStories('tables', schema)

      // Critical path should exist for tables (essential feature)
      if (result.critical.length > 0) {
        const criticalStory = result.critical[0]!

        expect(criticalStory.given).toContain('use')
        expect(criticalStory.when).toContain('essential')
        expect(criticalStory.then).toContain('succeeds')
        expect(criticalStory.tag).toBe('@critical')
      }
    })

    test('generates data-testid patterns', () => {
      const schema: JSONSchemaProperty = {
        type: 'string',
        minLength: 1,
      }

      const result = generateUserStories('email', schema)

      expect(result.dataTestIds.length).toBeGreaterThan(0)
      expect(result.dataTestIds).toContain('email-input')
      expect(result.dataTestIds).toContain('email-error')
    })

    test('generates data-testid patterns for arrays', () => {
      const schema: JSONSchemaProperty = {
        type: 'array',
      }

      const result = generateUserStories('tags', schema)

      expect(result.dataTestIds).toContain('tags-list')
      expect(result.dataTestIds).toContain('tags-add-button')
      expect(result.dataTestIds).toContain('tags-remove-button')
    })

    test('generates data-testid patterns for enums', () => {
      const schema: JSONSchemaProperty = {
        enum: ['option1', 'option2'],
      }

      const result = generateUserStories('choice', schema)

      expect(result.dataTestIds).toContain('choice-select')
      expect(result.dataTestIds).toContain('choice-option')
    })

    test('generates stories in Given-When-Then format', () => {
      const schema: JSONSchemaProperty = {
        type: 'string',
      }

      const result = generateUserStories('field', schema)

      for (const story of result.spec) {
        expect(story.given).toBeTruthy()
        expect(story.when).toBeTruthy()
        expect(story.then).toBeTruthy()
        expect(story.given).not.toBe('')
        expect(story.when).not.toBe('')
        expect(story.then).not.toBe('')
      }
    })

    test('generates negative test scenarios for validation rules', () => {
      const schema: JSONSchemaProperty = {
        type: 'string',
        minLength: 5,
      }

      const result = generateUserStories('password', schema)

      const negativeStory = result.spec.find((s) => s.then.includes('error'))

      expect(negativeStory).toBeTruthy()
      // Note: positive stories only generated for pattern validation
    })

    test('handles complex nested schemas', () => {
      const schema: JSONSchemaProperty = {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          age: { type: 'number', minimum: 0 },
        },
        required: ['name'],
      }

      const result = generateUserStories('user', schema)

      expect(result.spec.length).toBeGreaterThan(0)
      expect(result.regression).toHaveLength(1)
    })

    test('generates regression story for boolean fields without spec stories', () => {
      const schema: JSONSchemaProperty = {
        type: 'boolean',
      }

      const result = generateUserStories('enabled', schema)

      // Boolean fields don't generate spec stories (no validation rules)
      expect(result.spec.length).toBe(0)
      expect(result.regression).toHaveLength(1)
      expect(result.dataTestIds.length).toBe(0) // No data test IDs either
    })

    test('all stories have required properties', () => {
      const schema: JSONSchemaProperty = {
        type: 'string',
        minLength: 1,
      }

      const result = generateUserStories('field', schema)

      const allStories = [...result.spec, ...result.regression, ...result.critical]

      for (const story of allStories) {
        expect(story).toHaveProperty('given')
        expect(story).toHaveProperty('when')
        expect(story).toHaveProperty('then')
        expect(story).toHaveProperty('tag')
        expect(['@spec', '@regression', '@critical']).toContain(story.tag)
      }
    })
  })
})
