import { describe, expect, test } from 'bun:test'
import { extractUserStoriesFromSchema } from './schema-user-stories-extractor.ts'
import type { JSONSchema } from '../types/roadmap.ts'

describe('schema-user-stories-extractor', () => {
  describe('extractUserStoriesFromSchema', () => {
    test('extracts user stories from top-level array properties', () => {
      const schema: JSONSchema = {
        type: 'object',
        definitions: {
          automation: {
            type: 'object',
            'x-user-stories': [
              'GIVEN a user creates an automation WHEN they save it THEN it should be stored in the database',
            ],
          },
        },
        properties: {
          automations: {
            type: 'array',
            items: { $ref: '#/definitions/automation' },
          },
        },
      }

      const result = extractUserStoriesFromSchema('automations', schema)

      expect(result.propertyName).toBe('automations')
      expect(result.spec).toHaveLength(1)
      expect(result.spec[0]?.given).toBe('a user creates an automation')
      expect(result.spec[0]?.when).toBe('they save it')
      expect(result.spec[0]?.then).toBe('it should be stored in the database')
      expect(result.spec[0]?.tag).toBe('@spec')
    })

    test('extracts user stories from pages definition', () => {
      const schema: JSONSchema = {
        type: 'object',
        definitions: {
          page: {
            type: 'object',
            'x-user-stories': [
              'GIVEN a user navigates to a page WHEN the page loads THEN it should render correctly',
            ],
          },
        },
        properties: {
          pages: {
            type: 'array',
            items: { $ref: '#/definitions/page' },
          },
        },
      }

      const result = extractUserStoriesFromSchema('pages', schema)

      expect(result.propertyName).toBe('pages')
      expect(result.spec).toHaveLength(1)
      expect(result.spec[0]?.given).toBe('a user navigates to a page')
      expect(result.spec[0]?.when).toBe('the page loads')
      expect(result.spec[0]?.then).toBe('it should render correctly')
    })

    test('extracts user stories from tables definition', () => {
      const schema: JSONSchema = {
        type: 'object',
        definitions: {
          table: {
            type: 'object',
            'x-user-stories': [
              'GIVEN a user creates a table WHEN they define fields THEN the table should be created in the database',
            ],
          },
        },
        properties: {
          tables: {
            type: 'array',
            items: { $ref: '#/definitions/table' },
          },
        },
      }

      const result = extractUserStoriesFromSchema('tables', schema)

      expect(result.propertyName).toBe('tables')
      expect(result.spec).toHaveLength(1)
      expect(result.spec[0]?.given).toBe('a user creates a table')
    })

    test('extracts user stories from connections definition', () => {
      const schema: JSONSchema = {
        type: 'object',
        definitions: {
          connection: {
            type: 'object',
            'x-user-stories': [
              'GIVEN a user configures a connection WHEN they test it THEN it should validate successfully',
            ],
          },
        },
        properties: {
          connections: {
            type: 'array',
            items: { $ref: '#/definitions/connection' },
          },
        },
      }

      const result = extractUserStoriesFromSchema('connections', schema)

      expect(result.propertyName).toBe('connections')
      expect(result.spec).toHaveLength(1)
      expect(result.spec[0]?.when).toBe('they test it')
    })

    test('extracts user stories from automation trigger definitions', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {},
        definitions: {
          automation_trigger: {
            type: 'object',
            anyOf: [
              {
                title: 'HTTP Trigger',
                anyOf: [
                  {
                    title: 'POST Request',
                    properties: {
                      service: { const: 'http' },
                      event: { const: 'post' },
                    },
                    'x-user-stories': [
                      'GIVEN a webhook is configured WHEN a POST request is received THEN the automation should trigger',
                    ],
                  },
                ],
              },
            ],
          },
        },
      }

      const result = extractUserStoriesFromSchema('automation_trigger.http.post', schema)

      expect(result.spec).toHaveLength(1)
      expect(result.spec[0]?.given).toBe('a webhook is configured')
      expect(result.spec[0]?.when).toBe('a POST request is received')
      expect(result.spec[0]?.then).toBe('the automation should trigger')
    })

    test('extracts user stories from automation action definitions', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {},
        definitions: {
          automation_action: {
            type: 'object',
            anyOf: [
              {
                title: 'Notion Actions',
                anyOf: [
                  {
                    title: 'Create Page',
                    properties: {
                      service: { const: 'notion' },
                      action: { const: 'create-page' },
                    },
                    'x-user-stories': [
                      'GIVEN an automation runs WHEN the Notion create page action executes THEN a new page should be created',
                    ],
                  },
                ],
              },
            ],
          },
        },
      }

      const result = extractUserStoriesFromSchema('automation_action.notion.create-page', schema)

      expect(result.spec).toHaveLength(1)
      expect(result.spec[0]?.given).toBe('an automation runs')
      expect(result.spec[0]?.when).toBe('the Notion create page action executes')
      expect(result.spec[0]?.then).toBe('a new page should be created')
    })

    test('handles service name variations', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {},
        definitions: {
          automation_trigger: {
            type: 'object',
            anyOf: [
              {
                title: 'LinkedIn Ads Trigger',
                anyOf: [
                  {
                    title: 'New Lead',
                    properties: {
                      service: { const: 'linkedin_ads' },
                      event: { const: 'new_lead' },
                    },
                    'x-user-stories': [
                      'GIVEN a LinkedIn ad form is submitted WHEN a new lead is generated THEN the automation should trigger',
                    ],
                  },
                ],
              },
            ],
          },
        },
      }

      // Test with hyphenated format
      const result = extractUserStoriesFromSchema(
        'automation_trigger.linkedin-ads.new-lead',
        schema
      )

      expect(result.spec).toHaveLength(1)
      expect(result.spec[0]?.given).toBe('a LinkedIn ad form is submitted')
    })

    test('handles case-insensitive service matching', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {},
        definitions: {
          automation_trigger: {
            type: 'object',
            anyOf: [
              {
                title: 'HTTP Trigger',
                anyOf: [
                  {
                    title: 'GET Request',
                    properties: {
                      service: { const: 'HTTP' },
                      event: { const: 'GET' },
                    },
                    'x-user-stories': [
                      'GIVEN a webhook endpoint WHEN a GET request is received THEN the automation should trigger',
                    ],
                  },
                ],
              },
            ],
          },
        },
      }

      const result = extractUserStoriesFromSchema('automation_trigger.http.get', schema)

      expect(result.spec).toHaveLength(1)
    })

    test('returns empty arrays when no user stories found', () => {
      const schema: JSONSchema = {
        type: 'object',
        definitions: {},
        properties: {},
      }

      const result = extractUserStoriesFromSchema('nonexistent', schema)

      expect(result.propertyName).toBe('nonexistent')
      expect(result.spec).toHaveLength(0)
      expect(result.regression).toHaveLength(0)
      expect(result.critical).toHaveLength(0)
    })

    test('generates data-testid patterns', () => {
      const schema: JSONSchema = {
        type: 'object',
        definitions: {
          automation: {
            type: 'object',
            'x-user-stories': [
              'GIVEN something WHEN something happens THEN something should occur',
            ],
          },
        },
        properties: {
          automations: {
            type: 'array',
            items: { $ref: '#/definitions/automation' },
          },
        },
      }

      const result = extractUserStoriesFromSchema('automations', schema)

      expect(result.dataTestIds).toContain('automations-input')
      expect(result.dataTestIds).toContain('automations-error')
    })

    test('handles nested property paths in data-testids', () => {
      const schema: JSONSchema = {
        type: 'object',
        definitions: {},
        properties: {},
      }

      const result = extractUserStoriesFromSchema('pages.form-page.inputs.text-input', schema)

      expect(result.dataTestIds).toContain('pages-form-page-inputs-text-input-input')
      expect(result.dataTestIds).toContain('pages-form-page-inputs-text-input-error')
    })

    test('handles user stories with varied whitespace', () => {
      const schema: JSONSchema = {
        type: 'object',
        definitions: {
          automation: {
            type: 'object',
            'x-user-stories': ['  GIVEN   a  user   WHEN    they  act   THEN     it works  '],
          },
        },
        properties: {
          automations: {
            type: 'array',
            items: { $ref: '#/definitions/automation' },
          },
        },
      }

      const result = extractUserStoriesFromSchema('automations', schema)

      expect(result.spec[0]?.given).toBe('a  user')
      expect(result.spec[0]?.when).toBe('they  act')
      expect(result.spec[0]?.then).toBe('it works')
    })

    test('skips malformed user stories', () => {
      const schema: JSONSchema = {
        type: 'object',
        definitions: {
          automation: {
            type: 'object',
            'x-user-stories': [
              'This is not a valid user story format',
              'GIVEN something WHEN something happens THEN something should occur',
            ],
          },
        },
        properties: {
          automations: {
            type: 'array',
            items: { $ref: '#/definitions/automation' },
          },
        },
      }

      const result = extractUserStoriesFromSchema('automations', schema)

      // Only the valid story should be parsed
      expect(result.spec).toHaveLength(1)
      expect(result.spec[0]?.given).toBe('something')
    })

    test('handles multiple user stories', () => {
      const schema: JSONSchema = {
        type: 'object',
        definitions: {
          automation: {
            type: 'object',
            'x-user-stories': [
              'GIVEN a user creates an automation WHEN they save it THEN it should be stored',
              'GIVEN an automation exists WHEN a user deletes it THEN it should be removed',
              'GIVEN an automation is running WHEN an error occurs THEN it should be logged',
            ],
          },
        },
        properties: {
          automations: {
            type: 'array',
            items: { $ref: '#/definitions/automation' },
          },
        },
      }

      const result = extractUserStoriesFromSchema('automations', schema)

      expect(result.spec).toHaveLength(3)
      expect(result.spec[0]?.when).toBe('they save it')
      expect(result.spec[1]?.when).toBe('a user deletes it')
      expect(result.spec[2]?.when).toBe('an error occurs')
    })

    test('extracts user stories from items property', () => {
      const schema: JSONSchema = {
        type: 'object',
        definitions: {
          automation: {
            type: 'array',
            items: {
              type: 'object',
              'x-user-stories': [
                'GIVEN an automation item WHEN it is processed THEN it should complete',
              ],
            },
          },
        },
        properties: {
          automations: {
            type: 'array',
            items: { $ref: '#/definitions/automation' },
          },
        },
      }

      const result = extractUserStoriesFromSchema('automations', schema)

      expect(result.spec).toHaveLength(1)
      expect(result.spec[0]?.when).toBe('it is processed')
    })

    test('handles definition path with only base definition', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {},
        definitions: {
          automation_trigger: {
            type: 'object',
            'x-user-stories': [
              'GIVEN a trigger is configured WHEN an event occurs THEN the automation should start',
            ],
          },
        },
      }

      const result = extractUserStoriesFromSchema('automation_trigger', schema)

      expect(result.spec).toHaveLength(1)
      expect(result.spec[0]?.given).toBe('a trigger is configured')
    })

    test('handles oneOf instead of anyOf', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {},
        definitions: {
          automation_action: {
            type: 'object',
            oneOf: [
              {
                title: 'Database Actions',
                oneOf: [
                  {
                    title: 'Create Record',
                    properties: {
                      service: { const: 'database' },
                      action: { const: 'create-record' },
                    },
                    'x-user-stories': [
                      'GIVEN an automation runs WHEN a create record action executes THEN a record should be created',
                    ],
                  },
                ],
              },
            ],
          },
        },
      }

      const result = extractUserStoriesFromSchema(
        'automation_action.database.create-record',
        schema
      )

      expect(result.spec).toHaveLength(1)
      expect(result.spec[0]?.then).toBe('a record should be created')
    })

    test('handles filter_condition definition prefix', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {},
        definitions: {
          filter_condition: {
            type: 'object',
            'x-user-stories': [
              'GIVEN a filter condition WHEN it is evaluated THEN it should return a boolean',
            ],
          },
        },
      }

      const result = extractUserStoriesFromSchema('filter_condition', schema)

      expect(result.spec).toHaveLength(1)
      expect(result.spec[0]?.then).toBe('it should return a boolean')
    })

    test('handles missing definitions gracefully', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          automations: {
            type: 'array',
          },
        },
      }

      const result = extractUserStoriesFromSchema('automations', schema)

      expect(result.spec).toHaveLength(0)
    })

    test('handles direct match without nested anyOf', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {},
        definitions: {
          automation_trigger: {
            type: 'object',
            anyOf: [
              {
                title: 'Simple Trigger',
                properties: {
                  service: { const: 'simple' },
                  event: { const: 'trigger' },
                },
                'x-user-stories': ['GIVEN a simple trigger WHEN it fires THEN it should execute'],
              },
            ],
          },
        },
      }

      const result = extractUserStoriesFromSchema('automation_trigger.simple.trigger', schema)

      expect(result.spec).toHaveLength(1)
      expect(result.spec[0]?.when).toBe('it fires')
    })

    test('extracts from parent level when nested item has no user stories', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {},
        definitions: {
          automation_trigger: {
            type: 'object',
            anyOf: [
              {
                title: 'HTTP Trigger',
                'x-user-stories': [
                  'GIVEN an HTTP trigger WHEN it is called THEN it should respond',
                ],
                anyOf: [
                  {
                    title: 'POST Request',
                    properties: {
                      service: { const: 'http' },
                      event: { const: 'post' },
                    },
                  },
                ],
              },
            ],
          },
        },
      }

      const result = extractUserStoriesFromSchema('automation_trigger.http.post', schema)

      expect(result.spec).toHaveLength(1)
      expect(result.spec[0]?.given).toBe('an HTTP trigger')
    })

    test('handles case-insensitive GIVEN/WHEN/THEN keywords', () => {
      const schema: JSONSchema = {
        type: 'object',
        definitions: {
          automation: {
            type: 'object',
            'x-user-stories': [
              'given a user creates an automation when they save it then it should be stored',
            ],
          },
        },
        properties: {
          automations: {
            type: 'array',
            items: { $ref: '#/definitions/automation' },
          },
        },
      }

      const result = extractUserStoriesFromSchema('automations', schema)

      expect(result.spec).toHaveLength(1)
      expect(result.spec[0]?.given).toBe('a user creates an automation')
      expect(result.spec[0]?.when).toBe('they save it')
      expect(result.spec[0]?.then).toBe('it should be stored')
    })

    test('deduplicates user stories while preserving order', () => {
      const schema: JSONSchema = {
        type: 'object',
        definitions: {
          automation: {
            type: 'object',
            'x-user-stories': [
              'GIVEN a user creates an automation WHEN they save it THEN it should be stored',
              'GIVEN a user creates an automation WHEN they save it THEN it should be stored', // Duplicate
              'GIVEN an automation exists WHEN a user deletes it THEN it should be removed',
            ],
          },
        },
        properties: {
          automations: {
            type: 'array',
            items: { $ref: '#/definitions/automation' },
          },
        },
      }

      const result = extractUserStoriesFromSchema('automations', schema)

      // Should have only 2 unique stories
      expect(result.spec).toHaveLength(2)
    })
  })
})
