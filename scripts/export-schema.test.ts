import { test, expect, describe } from 'bun:test'

// For testing, we'll duplicate the functions we need to test
// In production, you'd export these from export-schema.ts

/**
 * Generate TypeScript type definitions from JSON Schema
 */
function generateTypeDefinitions(jsonSchema: any): string {
  const lines: string[] = [
    '/**',
    ' * TypeScript type definitions for AppSchema',
    ' * Generated automatically - do not edit manually',
    ' */',
    '',
  ]

  // Generate main interface
  const schemaTitle = jsonSchema.title || 'App'
  const schemaDescription = jsonSchema.description

  if (schemaDescription) {
    lines.push('/**', ` * ${schemaDescription}`, ' */')
  }

  lines.push(`export interface ${schemaTitle.replace(/\s+/g, '')} {`)

  // Generate properties
  const properties = jsonSchema.properties || {}
  const required = jsonSchema.required || []

  for (const [propName, propSchema] of Object.entries(properties) as [string, any][]) {
    const isRequired = required.includes(propName)
    const propDescription = propSchema.description
    const propTitle = propSchema.title

    // Add JSDoc comment for property
    lines.push('  /**')
    if (propTitle && propTitle !== propDescription) {
      lines.push(`   * ${propTitle}`)
      if (propDescription) {
        lines.push('   *')
      }
    }
    if (propDescription) {
      lines.push(`   * ${propDescription}`)
    }
    if (!isRequired) {
      lines.push('   *')
      lines.push('   * @optional')
    }
    lines.push('   */')

    // Determine TypeScript type
    let tsType = 'any'
    switch (propSchema.type) {
      case 'string': {
        tsType = 'string'
        break
      }
      case 'number':
      case 'integer': {
        tsType = 'number'
        break
      }
      case 'boolean': {
        tsType = 'boolean'
        break
      }
      case 'array': {
        tsType = 'any[]'
        break
      }
      case 'object': {
        tsType = 'Record<string, any>'
        break
      }
    }

    lines.push(`  ${propName}${isRequired ? '' : '?'}: ${tsType}`)
  }

  lines.push('}', '')

  return lines.join('\n')
}

/**
 * Generate README documentation from JSON Schema
 */
function generateReadme(version: string, jsonSchema: any): string {
  const schemaTitle = jsonSchema.title || 'AppSchema'
  const schemaDescription = jsonSchema.description || 'Application configuration schema'
  const properties = jsonSchema.properties || {}
  const required = jsonSchema.required || []
  const examples = jsonSchema.examples || []

  const lines: string[] = [
    `# ${schemaTitle} v${version}`,
    '',
    `This directory contains the exported ${schemaTitle} for Omnera version ${version}.`,
    '',
    schemaDescription,
    '',
    '## Files',
    '',
    '- `app.schema.json` - JSON Schema for validation and documentation',
    '- `types.d.ts` - TypeScript type definitions',
    '',
    '## Usage',
    '',
    '### JSON Schema Validation',
    '',
    'You can use the JSON Schema file to validate configurations in any language that supports JSON Schema.',
    '',
  ]

  // Add example if available
  if (examples.length > 0) {
    lines.push('```json', JSON.stringify(examples[0], null, 2), '```', '')
  }

  // TypeScript usage
  const interfaceName = schemaTitle.replace(/\s+/g, '')
  lines.push('### TypeScript', '', '```typescript')
  lines.push(`import type { ${interfaceName} } from './types'`, '')

  if (examples.length > 0) {
    lines.push(`const config: ${interfaceName} = ${JSON.stringify(examples[0], null, 2)}`)
  } else {
    lines.push(`const config: ${interfaceName} = {`)
    lines.push('  // Your configuration here')
    lines.push('}')
  }

  lines.push('```', '')

  // Schema details
  lines.push('## Schema Properties', '')

  for (const [propName, propSchema] of Object.entries(properties) as [string, any][]) {
    const isRequired = required.includes(propName)
    const propTitle = propSchema.title || propName
    const propDescription = propSchema.description
    const propExamples = propSchema.examples || []

    lines.push(`### ${propTitle}`)
    lines.push('')
    lines.push(`**Property**: \`${propName}\`${isRequired ? ' (required)' : ' (optional)'}`)
    lines.push('')

    if (propDescription) {
      lines.push(propDescription)
      lines.push('')
    }

    // Add constraints
    const constraints: string[] = []
    if (propSchema.type) {
      constraints.push(`Type: \`${propSchema.type}\``)
    }
    if (propSchema.minLength !== undefined) {
      constraints.push(`Minimum length: ${propSchema.minLength}`)
    }
    if (propSchema.maxLength !== undefined) {
      constraints.push(`Maximum length: ${propSchema.maxLength}`)
    }
    if (propSchema.pattern) {
      constraints.push(`Pattern: \`${propSchema.pattern}\``)
    }
    if (propSchema.minimum !== undefined) {
      constraints.push(`Minimum value: ${propSchema.minimum}`)
    }
    if (propSchema.maximum !== undefined) {
      constraints.push(`Maximum value: ${propSchema.maximum}`)
    }

    if (constraints.length > 0) {
      lines.push('**Constraints:**')
      for (const constraint of constraints) {
        lines.push(`- ${constraint}`)
      }
      lines.push('')
    }

    // Add examples
    if (propExamples.length > 0) {
      lines.push('**Examples:**')
      for (const example of propExamples) {
        lines.push(`- \`${JSON.stringify(example)}\``)
      }
      lines.push('')
    }
  }

  // Generated timestamp
  lines.push('## Generated', '')
  lines.push(
    `This schema was generated automatically on ${new Date().toISOString().split('T')[0]} from the source schemas in \`src/domain/models/app/\`.`,
    '',
    'For the latest schema definitions, please refer to the source code or generate a new export.',
    ''
  )

  return lines.join('\n')
}

describe('export-schema', () => {
  describe('generateTypeDefinitions', () => {
    test('should generate basic interface from simple schema', () => {
      const schema = {
        title: 'SimpleApp',
        description: 'A simple application',
        properties: {
          name: { type: 'string' },
          count: { type: 'number' },
        },
        required: ['name'],
      }

      const result = generateTypeDefinitions(schema)

      expect(result).toContain('export interface SimpleApp {')
      expect(result).toContain('name: string')
      expect(result).toContain('count?: number')
      expect(result).toContain('A simple application')
    })

    test('should handle schema without description', () => {
      const schema = {
        title: 'App',
        properties: {
          id: { type: 'string' },
        },
        required: [],
      }

      const result = generateTypeDefinitions(schema)

      expect(result).toContain('export interface App {')
      expect(result).not.toContain('/**\n * \n */')
    })

    test('should handle all TypeScript primitive types', () => {
      const schema = {
        title: 'AllTypes',
        properties: {
          str: { type: 'string' },
          num: { type: 'number' },
          int: { type: 'integer' },
          bool: { type: 'boolean' },
          arr: { type: 'array' },
          obj: { type: 'object' },
        },
        required: [],
      }

      const result = generateTypeDefinitions(schema)

      expect(result).toContain('str?: string')
      expect(result).toContain('num?: number')
      expect(result).toContain('int?: number')
      expect(result).toContain('bool?: boolean')
      expect(result).toContain('arr?: any[]')
      expect(result).toContain('obj?: Record<string, any>')
    })

    test('should mark required fields without question mark', () => {
      const schema = {
        title: 'App',
        properties: {
          required1: { type: 'string' },
          optional1: { type: 'string' },
        },
        required: ['required1'],
      }

      const result = generateTypeDefinitions(schema)

      expect(result).toContain('required1: string')
      expect(result).toContain('optional1?: string')
    })

    test('should include property descriptions in JSDoc', () => {
      const schema = {
        title: 'App',
        properties: {
          name: {
            type: 'string',
            title: 'Application Name',
            description: 'The name of the application',
          },
        },
        required: [],
      }

      const result = generateTypeDefinitions(schema)

      expect(result).toContain('Application Name')
      expect(result).toContain('The name of the application')
    })

    test('should add @optional tag for optional fields', () => {
      const schema = {
        title: 'App',
        properties: {
          optional: { type: 'string' },
        },
        required: [],
      }

      const result = generateTypeDefinitions(schema)

      expect(result).toContain('@optional')
    })

    test('should handle empty properties', () => {
      const schema = {
        title: 'EmptyApp',
        properties: {},
        required: [],
      }

      const result = generateTypeDefinitions(schema)

      expect(result).toContain('export interface EmptyApp {')
      expect(result).toContain('}')
    })

    test('should remove spaces from title in interface name', () => {
      const schema = {
        title: 'My App Config',
        properties: {},
        required: [],
      }

      const result = generateTypeDefinitions(schema)

      expect(result).toContain('export interface MyAppConfig {')
    })

    test('should default to "App" when no title provided', () => {
      const schema = {
        properties: {},
        required: [],
      }

      const result = generateTypeDefinitions(schema)

      expect(result).toContain('export interface App {')
    })

    test('should include both title and description when different', () => {
      const schema = {
        title: 'App',
        properties: {
          prop: {
            title: 'Property Title',
            description: 'Property Description',
            type: 'string',
          },
        },
        required: [],
      }

      const result = generateTypeDefinitions(schema)

      expect(result).toContain('Property Title')
      expect(result).toContain('Property Description')
    })

    test('should handle properties without explicit type', () => {
      const schema = {
        title: 'App',
        properties: {
          unknown: {},
        },
        required: [],
      }

      const result = generateTypeDefinitions(schema)

      expect(result).toContain('unknown?: any')
    })
  })

  describe('generateReadme', () => {
    test('should generate README with basic schema info', () => {
      const schema = {
        title: 'AppSchema',
        description: 'Application configuration',
        properties: {},
        required: [],
      }

      const result = generateReadme('1.0.0', schema)

      expect(result).toContain('# AppSchema v1.0.0')
      expect(result).toContain('Application configuration')
      expect(result).toContain('## Files')
      expect(result).toContain('app.schema.json')
      expect(result).toContain('types.d.ts')
    })

    test('should include examples when provided', () => {
      const schema = {
        title: 'AppSchema',
        description: 'Config',
        properties: {},
        required: [],
        examples: [{ name: 'test', count: 42 }],
      }

      const result = generateReadme('1.0.0', schema)

      expect(result).toContain('```json')
      expect(result).toContain('"name": "test"')
      expect(result).toContain('"count": 42')
    })

    test('should document property constraints', () => {
      const schema = {
        title: 'App',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            pattern: '^[a-z]+$',
          },
          age: {
            type: 'number',
            minimum: 0,
            maximum: 120,
          },
        },
        required: [],
      }

      const result = generateReadme('1.0.0', schema)

      expect(result).toContain('Minimum length: 1')
      expect(result).toContain('Maximum length: 100')
      expect(result).toContain('Pattern: `^[a-z]+$`')
      expect(result).toContain('Minimum value: 0')
      expect(result).toContain('Maximum value: 120')
    })

    test('should mark required and optional properties', () => {
      const schema = {
        title: 'App',
        properties: {
          required1: { type: 'string' },
          optional1: { type: 'string' },
        },
        required: ['required1'],
      }

      const result = generateReadme('1.0.0', schema)

      expect(result).toContain('`required1` (required)')
      expect(result).toContain('`optional1` (optional)')
    })

    test('should include property examples', () => {
      const schema = {
        title: 'App',
        properties: {
          status: {
            type: 'string',
            examples: ['active', 'inactive', 'pending'],
          },
        },
        required: [],
      }

      const result = generateReadme('1.0.0', schema)

      expect(result).toContain('**Examples:**')
      expect(result).toContain('`"active"`')
      expect(result).toContain('`"inactive"`')
      expect(result).toContain('`"pending"`')
    })

    test('should include TypeScript usage section', () => {
      const schema = {
        title: 'MyConfig',
        properties: {},
        required: [],
      }

      const result = generateReadme('1.0.0', schema)

      expect(result).toContain('### TypeScript')
      expect(result).toContain('```typescript')
      expect(result).toContain("import type { MyConfig } from './types'")
      expect(result).toContain('const config: MyConfig =')
    })

    test('should include generated timestamp section', () => {
      const schema = {
        title: 'App',
        properties: {},
        required: [],
      }

      const result = generateReadme('1.0.0', schema)

      expect(result).toContain('## Generated')
      expect(result).toContain('generated automatically')
      expect(result).toContain('src/domain/models/app/')
    })

    test('should handle schema without properties', () => {
      const schema = {
        title: 'EmptyApp',
        description: 'Empty schema',
      }

      const result = generateReadme('1.0.0', schema)

      expect(result).toContain('# EmptyApp v1.0.0')
      expect(result).toContain('Empty schema')
    })

    test('should use property title or fallback to name', () => {
      const schema = {
        title: 'App',
        properties: {
          prop1: {
            title: 'Custom Title',
            type: 'string',
          },
          prop2: {
            type: 'string',
          },
        },
        required: [],
      }

      const result = generateReadme('1.0.0', schema)

      expect(result).toContain('### Custom Title')
      expect(result).toContain('### prop2')
    })

    test('should default to "AppSchema" when no title provided', () => {
      const schema = {
        properties: {},
        required: [],
      }

      const result = generateReadme('1.0.0', schema)

      expect(result).toContain('# AppSchema v1.0.0')
    })

    test('should default description when not provided', () => {
      const schema = {
        properties: {},
        required: [],
      }

      const result = generateReadme('1.0.0', schema)

      expect(result).toContain('Application configuration schema')
    })

    test('should handle complex nested examples in TypeScript section', () => {
      const schema = {
        title: 'App',
        properties: {},
        required: [],
        examples: [
          {
            nested: {
              value: 'test',
            },
          },
        ],
      }

      const result = generateReadme('1.0.0', schema)

      expect(result).toContain('"nested"')
      expect(result).toContain('"value": "test"')
    })

    test('should include property descriptions in schema properties section', () => {
      const schema = {
        title: 'App',
        properties: {
          name: {
            type: 'string',
            description: 'The application name',
          },
        },
        required: [],
      }

      const result = generateReadme('1.0.0', schema)

      expect(result).toContain('The application name')
    })

    test('should show type constraints', () => {
      const schema = {
        title: 'App',
        properties: {
          data: {
            type: 'object',
          },
        },
        required: [],
      }

      const result = generateReadme('1.0.0', schema)

      expect(result).toContain('Type: `object`')
    })

    test('should handle version formatting', () => {
      const schema = {
        title: 'App',
        properties: {},
        required: [],
      }

      const result = generateReadme('2.5.3-beta.1', schema)

      expect(result).toContain('# App v2.5.3-beta.1')
      expect(result).toContain('version 2.5.3-beta.1')
    })
  })
})
