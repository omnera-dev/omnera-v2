#!/usr/bin/env bun

/**
 * Export Schema Script
 *
 * This script exports the AppSchema to a versioned schema folder at the root of the project.
 * It generates:
 * - JSON Schema files for validation and documentation
 * - TypeScript type definition files
 * - README with schema documentation
 *
 * Usage: bun run scripts/export-schema.ts
 */

import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { JSONSchema } from 'effect'
// Import schema
import { AppSchema } from '../src/domain/models/app'
import type { Schema } from 'effect'

/**
 * JSON Schema property definition
 */
interface JsonSchemaProperty {
  type?: string
  title?: string
  description?: string
  minLength?: number
  maxLength?: number
  pattern?: string
  minimum?: number
  maximum?: number
  examples?: unknown[]
}

/**
 * JSON Schema definition
 */
interface JsonSchemaDefinition {
  title?: string
  description?: string
  properties?: Record<string, JsonSchemaProperty>
  required?: string[]
  examples?: unknown[]
}

/**
 * Get package version from package.json
 */
async function getPackageVersion(): Promise<string> {
  const packageJson = await Bun.file('package.json').json()
  return packageJson.version
}

/**
 * Generate JSON Schema from Effect Schema
 */
function generateJsonSchema(schema: Schema.Schema.Any): unknown {
  return JSONSchema.make(schema)
}

/**
 * Generate TypeScript type definitions from JSON Schema
 */
function generateTypeDefinitions(jsonSchema: JsonSchemaDefinition): string {
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

  for (const [propName, propSchema] of Object.entries(properties) as [
    string,
    JsonSchemaProperty,
  ][]) {
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
function generateReadme(version: string, jsonSchema: JsonSchemaDefinition): string {
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

  for (const [propName, propSchema] of Object.entries(properties) as [
    string,
    JsonSchemaProperty,
  ][]) {
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

/**
 * Main export function
 */
async function exportSchema(): Promise<void> {
  console.log('🚀 Starting schema export...\n')

  // Get package version
  const version = await getPackageVersion()
  console.log(`📦 Package version: ${version}`)

  // Create output directory
  const outputDir = join(process.cwd(), 'schemas', version)
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true })
    console.log(`✅ Created directory: schemas/${version}/`)
  } else {
    console.log(`📁 Directory already exists: schemas/${version}/`)
  }

  // Generate and write JSON Schema
  console.log('\n📝 Generating JSON Schema...')

  const jsonSchema = generateJsonSchema(AppSchema)
  const schemaPath = join(outputDir, 'app.schema.json')
  await writeFile(schemaPath, JSON.stringify(jsonSchema, null, 2))
  console.log('   ✓ app.schema.json')

  // Generate and write TypeScript definitions
  console.log('\n📝 Generating TypeScript definitions...')
  const typeDefinitions = generateTypeDefinitions(jsonSchema as JsonSchemaDefinition)
  const typesPath = join(outputDir, 'types.d.ts')
  await writeFile(typesPath, typeDefinitions)
  console.log('   ✓ types.d.ts')

  // Generate and write README
  console.log('\n📝 Generating documentation...')
  const readme = generateReadme(version, jsonSchema as JsonSchemaDefinition)
  const readmePath = join(outputDir, 'README.md')
  await writeFile(readmePath, readme)
  console.log('   ✓ README.md')

  console.log(`\n✨ Schema export completed successfully!`)
  console.log(`📂 Output location: schemas/${version}/\n`)
}

// Run the export
exportSchema().catch((error) => {
  console.error('❌ Error exporting schema:', error)
  process.exit(1)
})
