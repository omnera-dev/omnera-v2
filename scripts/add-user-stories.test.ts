import { describe, test, expect } from 'bun:test'
import { generateUserStories, addUserStoriesToProperties } from './add-user-stories.ts'

describe('generateUserStories', () => {
  describe('root properties with test-extracted stories', () => {
    test('should return NAME_STORIES for root name property', () => {
      const schema = {
        type: 'string',
        title: 'App Name',
        description: 'The name of the application',
      }

      const stories = generateUserStories('name', schema, 'root')

      expect(stories.length).toBe(21)
      expect(stories[0]).toContain('GIVEN a server configured with a specific app name')
    })

    test('should return VERSION_STORIES for root version property', () => {
      const schema = {
        type: 'string',
        title: 'Version',
        description: 'The version of the application',
      }

      const stories = generateUserStories('version', schema, 'root')

      expect(stories.length).toBe(7)
      expect(stories[0]).toContain('GIVEN an app with name and simple SemVer version')
    })

    test('should return DESCRIPTION_STORIES for root description property', () => {
      const schema = {
        type: 'string',
        title: 'Description',
        description: 'The description of the application',
      }

      const stories = generateUserStories('description', schema, 'root')

      expect(stories.length).toBe(15)
      expect(stories[0]).toContain('GIVEN an app with name and description')
    })
  })

  describe('ID properties', () => {
    test('should generate ID stories for property named "id"', () => {
      const schema = {
        type: 'integer',
        minimum: 1,
        title: 'ID',
        description: 'Unique identifier',
      }

      const stories = generateUserStories('id', schema)

      expect(stories.length).toBeGreaterThan(0)
      expect(stories[0]).toContain('unique within the parent collection')
      expect(stories[1]).toContain('read-only constraint')
      expect(stories[2]).toContain('retrieved successfully')
    })

    test('should generate ID stories for property with "ID" in title', () => {
      const schema = {
        type: 'integer',
        title: 'User ID',
        description: 'The user identifier',
      }

      const stories = generateUserStories('userId', schema)

      expect(stories.length).toBeGreaterThan(0)
      expect(stories[0]).toContain('unique within the parent collection')
    })

    test('should generate ID stories for property with "identifier" in description', () => {
      const schema = {
        type: 'string',
        title: 'Reference',
        description: 'A unique identifier for the resource',
      }

      const stories = generateUserStories('ref', schema)

      expect(stories.length).toBeGreaterThan(0)
      expect(stories[0]).toContain('unique within the parent collection')
    })
  })

  describe('OAuth credentials', () => {
    test('should generate OAuth client ID stories', () => {
      const schema = {
        type: 'string',
        title: 'Client ID',
        description: 'OAuth client identifier',
      }

      const stories = generateUserStories('clientId', schema)

      expect(stories.length).toBeGreaterThan(0)
      expect(stories[0]).toContain('OAuth client ID')
      expect(stories[0]).toContain('authentication should succeed')
      expect(stories[1]).toContain('clear error message')
    })

    test('should generate OAuth client secret stories', () => {
      const schema = {
        type: 'string',
        title: 'Client Secret',
        description: 'OAuth client secret',
      }

      const stories = generateUserStories('clientSecret', schema)

      expect(stories.length).toBeGreaterThan(0)
      expect(stories[0]).toContain('OAuth client secret')
      expect(stories[2]).toContain('securely without exposure')
    })
  })

  describe('webhook paths', () => {
    test('should generate webhook stories for path property in webhook context', () => {
      const schema = {
        type: 'string',
        pattern: '^/webhooks/[a-z0-9-]+$',
        title: 'Path',
        description: 'Webhook path',
      }

      const stories = generateUserStories('path', schema, 'webhook')

      expect(stories.length).toBeGreaterThan(0)
      expect(stories[0]).toContain('automation should execute successfully')
      expect(stories[1]).toContain('path conflicts should be detected')
      expect(stories[2]).toContain('correct automation should be triggered')
    })
  })

  describe('URL/URI properties', () => {
    test('should generate URL stories for string with uri format', () => {
      const schema = {
        type: 'string',
        format: 'uri',
        title: 'Website URL',
        description: 'The URL of the website',
      }

      const stories = generateUserStories('url', schema)

      expect(stories.length).toBeGreaterThan(0)
      expect(stories[0]).toContain('valid URLs should be accepted')
      expect(stories[1]).toContain('invalid URL')
      expect(stories[2]).toContain('navigate to correct destination')
    })
  })

  describe('boolean flags', () => {
    test('should generate boolean stories with default value', () => {
      const schema = {
        type: 'boolean',
        default: false,
        title: 'Is Active',
        description: 'Whether the entity is active',
      }

      const stories = generateUserStories('isActive', schema)

      expect(stories.length).toBe(3)
      expect(stories[0]).toContain('isActive is true')
      expect(stories[0]).toContain('behavior should be enforced')
      expect(stories[1]).toContain('default: false')
      expect(stories[2]).toContain('boolean value should be accepted')
    })

    test('should generate boolean stories with true as default', () => {
      const schema = {
        type: 'boolean',
        default: true,
        title: 'Enabled',
        description: 'Whether the feature is enabled',
      }

      const stories = generateUserStories('enabled', schema)

      expect(stories[1]).toContain('default: true')
    })
  })

  describe('enum properties', () => {
    test('should generate enum stories with valid options', () => {
      const schema = {
        type: 'string',
        enum: ['draft', 'published', 'archived'],
        title: 'Status',
        description: 'The status of the document',
      }

      const stories = generateUserStories('status', schema)

      expect(stories.length).toBeGreaterThan(0)
      expect(stories[0]).toContain('valid options')
      expect(stories[1]).toContain('list valid options: draft, published, archived')
      expect(stories[2]).toContain('any valid enum value')
    })

    test('should limit enum options display to first 3', () => {
      const schema = {
        type: 'string',
        enum: ['option1', 'option2', 'option3', 'option4', 'option5'],
        title: 'Choice',
        description: 'User choice',
      }

      const stories = generateUserStories('choice', schema)

      expect(stories[1]).toContain('option1, option2, option3')
      expect(stories[1]).not.toContain('option4')
    })
  })

  describe('const properties', () => {
    test('should generate const stories', () => {
      const schema = {
        type: 'string',
        const: 'webhook',
        title: 'Trigger Type',
        description: 'The type of trigger',
      }

      const stories = generateUserStories('type', schema)

      expect(stories.length).toBeGreaterThan(0)
      expect(stories[0]).toContain("type='webhook'")
      expect(stories[0]).toContain('correct handler should be selected')
    })
  })

  describe('string properties with constraints', () => {
    test('should generate stories for string with min and max length', () => {
      const schema = {
        type: 'string',
        minLength: 3,
        maxLength: 100,
        title: 'Name',
        description: 'Entity name',
      }

      const stories = generateUserStories('name', schema)

      expect(stories.length).toBe(3)
      expect(stories[0]).toContain('3-100 characters')
      expect(stories[1]).toContain('shorter than 3 chars')
      expect(stories[2]).toContain('longer than 100 chars')
    })

    test('should generate stories for string with only minLength', () => {
      const schema = {
        type: 'string',
        minLength: 10,
        title: 'Description',
        description: 'Entity description',
      }

      const stories = generateUserStories('description', schema)

      expect(stories.length).toBe(2)
      expect(stories[0]).toContain('at least 10 characters')
      expect(stories[1]).toContain('shorter than 10 chars')
    })

    test('should generate stories for string with pattern', () => {
      const schema = {
        type: 'string',
        pattern: '^[a-z0-9-]+$',
        title: 'Slug',
        description: 'URL-friendly identifier',
      }

      const stories = generateUserStories('slug', schema)

      expect(stories.length).toBeGreaterThan(0)
      expect(stories[0]).toContain('matching pattern')
      expect(stories[1]).toContain('not matching pattern')
      expect(stories[2]).toContain('original format should be preserved')
    })

    test('should generate generic stories for string without constraints', () => {
      const schema = {
        type: 'string',
        title: 'Comment',
        description: 'User comment',
      }

      const stories = generateUserStories('comment', schema)

      expect(stories.length).toBe(2)
      expect(stories[0]).toContain('string value should be accepted')
      expect(stories[1]).toContain('optional/required rules')
    })
  })

  describe('number and integer properties', () => {
    test('should generate stories for number with min and max', () => {
      const schema = {
        type: 'integer',
        minimum: 0,
        maximum: 100,
        title: 'Progress',
        description: 'Completion percentage',
      }

      const stories = generateUserStories('progress', schema)

      expect(stories.length).toBe(3)
      expect(stories[0]).toContain('between 0 and 100')
      expect(stories[1]).toContain('below 0')
      expect(stories[2]).toContain('above 100')
    })

    test('should generate stories for number with only minimum', () => {
      const schema = {
        type: 'number',
        minimum: 0,
        title: 'Amount',
        description: 'Amount value',
      }

      const stories = generateUserStories('amount', schema)

      expect(stories.length).toBe(2)
      expect(stories[0]).toContain('amount >= 0')
      expect(stories[1]).toContain('amount < 0')
    })

    test('should generate generic stories for number without constraints', () => {
      const schema = {
        type: 'number',
        title: 'Value',
        description: 'Numeric value',
      }

      const stories = generateUserStories('value', schema)

      expect(stories.length).toBe(2)
      expect(stories[0]).toContain('numeric value should be accepted')
      expect(stories[1]).toContain('non-numeric')
    })
  })

  describe('array properties', () => {
    test('should generate stories for array with minItems', () => {
      const schema = {
        type: 'array',
        minItems: 1,
        title: 'Tags',
        description: 'List of tags',
      }

      const stories = generateUserStories('tags', schema)

      expect(stories.length).toBe(2)
      expect(stories[0]).toContain('at least 1 items')
      expect(stories[1]).toContain('fewer than 1 items')
    })

    test('should generate generic stories for array without constraints', () => {
      const schema = {
        type: 'array',
        title: 'Items',
        description: 'List of items',
      }

      const stories = generateUserStories('items', schema)

      expect(stories.length).toBe(2)
      expect(stories[0]).toContain('processed in order')
      expect(stories[1]).toContain('optional/required rules')
    })
  })

  describe('special domain properties', () => {
    test('should generate table stories', () => {
      const schema = {
        type: 'string',
        title: 'Table',
        description: 'The table name to operate on',
      }

      const stories = generateUserStories('table', schema)

      expect(stories[0]).toContain('records should be created/updated in specified table')
    })

    test('should generate field name stories in field context', () => {
      const schema = {
        type: 'string',
        title: 'Name',
        description: 'Field name',
      }

      const stories = generateUserStories('name', schema, 'field')

      expect(stories[0]).toContain('database naming conventions')
      expect(stories[1]).toContain('duplicate name')
    })

    test('should generate template stories', () => {
      const schema = {
        type: 'string',
        title: 'Template',
        description: 'Message template',
      }

      const stories = generateUserStories('template', schema)

      expect(stories[0]).toContain('variables should be substituted')
      expect(stories[1]).toContain('invalid template syntax')
    })

    test('should generate filter stories in filter context', () => {
      const schema = {
        type: 'string',
        title: 'Condition',
        description: 'Filter condition',
      }

      const stories = generateUserStories('condition', schema, 'filter')

      expect(stories[0]).toContain('evaluates to true')
      expect(stories[1]).toContain('evaluates to false')
    })

    test('should generate cron expression stories', () => {
      const schema = {
        type: 'string',
        title: 'Expression',
        description: 'Cron expression for scheduling',
      }

      const stories = generateUserStories('expression', schema)

      expect(stories[0]).toContain('cron expression')
      expect(stories[0]).toContain('automation should execute automatically')
      expect(stories[1]).toContain('invalid cron expression')
    })

    test('should generate timezone stories', () => {
      const schema = {
        type: 'string',
        title: 'Time Zone',
        description: 'IANA timezone identifier',
      }

      const stories = generateUserStories('timeZone', schema)

      expect(stories[0]).toContain('correct local time')
      expect(stories[1]).toContain('valid IANA timezones')
      expect(stories[2]).toContain('DST')
    })
  })

  describe('existing user stories preservation', () => {
    test('should preserve existing x-user-stories', () => {
      const existingStories = [
        'GIVEN existing story 1 WHEN something happens THEN result 1',
        'GIVEN existing story 2 WHEN something else THEN result 2',
      ]
      const schema = {
        type: 'string',
        title: 'Test',
        description: 'Test property',
        'x-user-stories': existingStories,
      }

      const stories = generateUserStories('test', schema)

      expect(stories).toEqual(existingStories)
    })

    test('should generate stories if x-user-stories is empty array', () => {
      const schema = {
        type: 'string',
        title: 'Test',
        description: 'Test property',
        'x-user-stories': [] as string[],
      }

      // generateUserStories will generate new stories for empty array
      // addUserStoriesToProperties checks for length > 0 before adding
      const stories = generateUserStories('test', schema)

      // Should generate new stories since existing array is empty
      expect(stories.length).toBe(2)
      expect(stories[0]).toContain('string value should be accepted')
    })
  })

  describe('fallback stories', () => {
    test('should generate fallback stories for unknown types', () => {
      const schema = {
        type: 'null',
        title: 'Unknown',
        description: 'Unknown property',
      }

      const stories = generateUserStories('unknown', schema)

      expect(stories.length).toBe(2)
      expect(stories[0]).toContain('meet schema requirements')
      expect(stories[1]).toContain('value should be used correctly')
    })
  })

  describe('story count limits', () => {
    test('should limit stories to 4', () => {
      const schema = {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        title: 'Test',
        description: 'Test property',
      }

      const stories = generateUserStories('test', schema)

      expect(stories.length).toBeLessThanOrEqual(4)
    })
  })

  describe('array type handling', () => {
    test('should handle array types correctly', () => {
      const schema = {
        type: ['string', 'null'],
        title: 'Optional String',
        description: 'A string that can be null',
      }

      const stories = generateUserStories('optionalString', schema)

      expect(stories.length).toBeGreaterThan(0)
      expect(stories[0]).toContain('string value should be accepted')
    })
  })
})

describe('addUserStoriesToProperties', () => {
  describe('properties processing', () => {
    test('should add user stories to properties', () => {
      const schema = {
        properties: {
          name: {
            type: 'string',
            minLength: 3,
            title: 'Name',
            description: 'Entity name',
          },
          age: {
            type: 'integer',
            minimum: 0,
            title: 'Age',
            description: 'User age',
          },
        },
      }

      const count = addUserStoriesToProperties(schema)

      expect(count).toBe(2)
      expect(schema.properties.name['x-user-stories']).toBeDefined()
      expect(schema.properties.age['x-user-stories']).toBeDefined()
      expect(Array.isArray(schema.properties.name['x-user-stories'])).toBe(true)
    })

    test('should not add stories to properties that already have them', () => {
      const schema = {
        properties: {
          name: {
            type: 'string',
            title: 'Name',
            description: 'Entity name',
            'x-user-stories': ['Existing story'],
          },
        },
      }

      const count = addUserStoriesToProperties(schema)

      expect(count).toBe(0)
      expect(schema.properties.name['x-user-stories']).toEqual(['Existing story'])
    })
  })

  describe('nested properties', () => {
    test('should recursively process nested properties', () => {
      const schema = {
        properties: {
          user: {
            type: 'object',
            properties: {
              profile: {
                type: 'object',
                properties: {
                  bio: {
                    type: 'string',
                    minLength: 10,
                    title: 'Bio',
                    description: 'User biography',
                  },
                },
              },
            },
          },
        },
      }

      const count = addUserStoriesToProperties(schema)

      expect(count).toBeGreaterThan(0)
      const bioSchema = schema.properties.user.properties?.profile.properties?.bio
      expect(bioSchema).toBeDefined()
      if (bioSchema && typeof bioSchema === 'object') {
        expect(bioSchema['x-user-stories']).toBeDefined()
      }
    })
  })

  describe('array items', () => {
    test('should process array items', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              minimum: 1,
              title: 'ID',
              description: 'Item ID',
            },
          },
        },
      }

      const count = addUserStoriesToProperties(schema)

      expect(count).toBe(1)
      const idSchema = schema.items.properties?.id
      expect(idSchema).toBeDefined()
      if (idSchema && typeof idSchema === 'object') {
        expect(idSchema['x-user-stories']).toBeDefined()
      }
    })
  })

  describe('union types', () => {
    test('should process anyOf schemas', () => {
      const schema = {
        anyOf: [
          {
            type: 'object',
            properties: {
              text: {
                type: 'string',
                title: 'Text',
                description: 'Text content',
              },
            },
          },
          {
            type: 'object',
            properties: {
              number: {
                type: 'integer',
                title: 'Number',
                description: 'Numeric content',
              },
            },
          },
        ],
      }

      const count = addUserStoriesToProperties(schema)

      expect(count).toBe(2)
    })

    test('should process oneOf schemas', () => {
      const schema = {
        oneOf: [
          {
            type: 'object',
            properties: {
              option1: {
                type: 'string',
                title: 'Option 1',
                description: 'First option',
              },
            },
          },
        ],
      }

      const count = addUserStoriesToProperties(schema)

      expect(count).toBe(1)
    })

    test('should process allOf schemas', () => {
      const schema = {
        allOf: [
          {
            properties: {
              base: {
                type: 'string',
                title: 'Base',
                description: 'Base property',
              },
            },
          },
        ],
      }

      const count = addUserStoriesToProperties(schema)

      expect(count).toBe(1)
    })
  })

  describe('definitions', () => {
    test('should process definitions', () => {
      const schema = {
        definitions: {
          id: {
            type: 'integer',
            minimum: 1,
            title: 'ID',
            description: 'Unique identifier',
          },
          name: {
            type: 'string',
            minLength: 1,
            title: 'Name',
            description: 'Entity name',
          },
        },
      }

      const count = addUserStoriesToProperties(schema)

      expect(count).toBe(2)
      expect(schema.definitions.id['x-user-stories']).toBeDefined()
      expect(schema.definitions.name['x-user-stories']).toBeDefined()
    })
  })

  describe('edge cases', () => {
    test('should handle empty schema', () => {
      const schema = {}

      const count = addUserStoriesToProperties(schema)

      expect(count).toBe(0)
    })

    test('should handle schema with no properties', () => {
      const schema = {
        type: 'object',
        title: 'Empty Object',
        description: 'An empty object schema',
      }

      const count = addUserStoriesToProperties(schema)

      expect(count).toBe(0)
    })

    test('should handle non-object values gracefully', () => {
      const schema = {
        properties: {
          invalid: 'not an object' as any,
          valid: {
            type: 'string',
            title: 'Valid',
            description: 'Valid property',
          },
        },
      }

      const count = addUserStoriesToProperties(schema)

      expect(count).toBe(1)
      expect(schema.properties.valid['x-user-stories']).toBeDefined()
    })

    test('should handle null items', () => {
      const schema = {
        type: 'array',
        items: null as any,
      }

      const count = addUserStoriesToProperties(schema)

      expect(count).toBe(0)
    })

    test('should handle null union items', () => {
      const schema = {
        anyOf: [null as any, { type: 'string' }],
      }

      const count = addUserStoriesToProperties(schema)

      expect(count).toBe(0)
    })
  })

  describe('context propagation', () => {
    test('should propagate context through nested structures', () => {
      const schema = {
        properties: {
          webhook: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                pattern: '^/webhooks/',
                title: 'Path',
                description: 'Webhook path',
              },
            },
          },
        },
      }

      const count = addUserStoriesToProperties(schema)

      // Should add stories to both 'webhook' (parent object) and 'webhook.path'
      expect(count).toBe(2)
      const pathSchema = schema.properties.webhook.properties?.path
      expect(pathSchema).toBeDefined()
      if (pathSchema && typeof pathSchema === 'object') {
        const stories = pathSchema['x-user-stories'] ?? []
        expect(stories[0]).toContain('automation should execute successfully')
      }
    })
  })

  describe('complex schema traversal', () => {
    test('should handle complex nested schema with all features', () => {
      const schema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                minimum: 1,
                title: 'User ID',
                description: 'Unique user identifier',
              },
            },
          },
        },
        definitions: {
          timestamp: {
            type: 'string',
            format: 'date-time',
            title: 'Timestamp',
            description: 'ISO 8601 timestamp',
          },
        },
        anyOf: [
          {
            properties: {
              status: {
                type: 'string',
                enum: ['active', 'inactive'],
                title: 'Status',
                description: 'User status',
              },
            },
          },
        ],
      }

      const count = addUserStoriesToProperties(schema)

      // Should process: user (object), user.id, timestamp (definition), status (anyOf)
      expect(count).toBe(4)
    })
  })
})
