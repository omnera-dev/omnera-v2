#!/usr/bin/env bun

/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { join, basename } from 'node:path'

const FIELD_TYPES_DIR = 'specs/app/tables/field-types'
const COMMON_PROPERTIES = ['required', 'unique', 'indexed']
const SKIP_PROPERTIES = new Set(['id', 'name', 'type', ...COMMON_PROPERTIES])

interface UserStory {
  id: string
  given: string
  when: string
  then: string
}

interface PropertySchema {
  type?: string
  const?: string
  description?: string
  default?: any
  examples?: any[]
  'x-user-stories'?: string[]
  'x-business-rules'?: string[]
  $ref?: string
  [key: string]: any
}

interface FieldTypeSchema {
  $schema?: string
  $id?: string
  title: string
  description?: string
  type: string
  properties: Record<string, PropertySchema>
  required?: string[]
  additionalProperties?: boolean
  'x-user-stories'?: string[]
  'x-business-rules'?: string[]
}

function convertUserStoriesToSpecs(
  userStories: string[] | undefined,
  fieldType: string,
  propertyName: string
): UserStory[] {
  if (!userStories || userStories.length === 0) return []

  const fieldTypeUpper = fieldType.toUpperCase().replace(/-/g, '-')
  const propertyUpper = propertyName.toUpperCase().replace(/-/g, '-')

  return userStories.map((story, index) => {
    const specId = `FIELD-${fieldTypeUpper}-${propertyUpper}-${String(index + 1).padStart(3, '0')}`

    // Parse GIVEN-WHEN-THEN format
    const givenMatch = story.match(/GIVEN\s+(.+?)\s+WHEN/i)
    const whenMatch = story.match(/WHEN\s+(.+?)\s+THEN/i)
    const thenMatch = story.match(/THEN\s+(.+)$/i)

    return {
      id: specId,
      given: givenMatch ? givenMatch[1].trim() : story,
      when: whenMatch ? whenMatch[1].trim() : 'processing',
      then: thenMatch ? thenMatch[1].trim() : 'should work correctly',
    }
  })
}

function generatePropertySchema(
  propertyName: string,
  propertyDef: PropertySchema,
  fieldType: string
): any {
  const schema: any = {
    $id: `${propertyName}.schema.json`,
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: `${propertyDef.description || propertyName}`,
  }

  // Copy over basic JSON Schema properties
  if (propertyDef.description) schema.description = propertyDef.description
  if (propertyDef.type) schema.type = propertyDef.type
  if (propertyDef.default !== undefined) schema.default = propertyDef.default
  if (propertyDef.examples) schema.examples = propertyDef.examples
  if (propertyDef.pattern) schema.pattern = propertyDef.pattern
  if (propertyDef.minLength !== undefined) schema.minLength = propertyDef.minLength
  if (propertyDef.maxLength !== undefined) schema.maxLength = propertyDef.maxLength
  if (propertyDef.minimum !== undefined) schema.minimum = propertyDef.minimum
  if (propertyDef.maximum !== undefined) schema.maximum = propertyDef.maximum
  if (propertyDef.enum) schema.enum = propertyDef.enum
  if (propertyDef.items) schema.items = propertyDef.items

  // Convert x-user-stories to specs array
  const specs = convertUserStoriesToSpecs(propertyDef['x-user-stories'], fieldType, propertyName)
  if (specs.length > 0) {
    schema.specs = specs
  }

  return schema
}

async function refactorFieldType(schemaPath: string): Promise<void> {
  const fileName = basename(schemaPath)
  const fieldTypeName = fileName.replace('.schema.json', '')

  console.log(`\n📦 Refactoring ${fieldTypeName}...`)

  // Read existing schema
  const content = await readFile(schemaPath, 'utf-8')
  const schema: FieldTypeSchema = JSON.parse(content)

  // Create field type directory
  const fieldTypeDir = join(FIELD_TYPES_DIR, fieldTypeName)
  await mkdir(fieldTypeDir, { recursive: true })

  // Extract and create property schemas
  const orchestratorProperties: Record<string, any> = {}

  for (const [propName, propDef] of Object.entries(schema.properties)) {
    if (SKIP_PROPERTIES.has(propName)) {
      // Keep special properties as-is
      switch (propName) {
        case 'id': {
          orchestratorProperties[propName] = {
            $ref: '../../common/definitions.schema.json#/definitions/id',
          }

          break
        }
        case 'name': {
          orchestratorProperties[propName] = {
            $ref: '../../common/definitions.schema.json#/definitions/name',
          }

          break
        }
        case 'type': {
          orchestratorProperties[propName] = propDef

          break
        }
        default:
          if (COMMON_PROPERTIES.includes(propName)) {
            // Reference common property schemas
            orchestratorProperties[propName] = {
              $ref: `../common/${propName}/${propName}.schema.json`,
            }
          }
      }
      continue
    }

    // Create property directory and schema
    const propDir = join(fieldTypeDir, propName)
    await mkdir(propDir, { recursive: true })

    const propSchema = generatePropertySchema(propName, propDef, fieldTypeName)
    const propSchemaPath = join(propDir, `${propName}.schema.json`)
    await writeFile(propSchemaPath, JSON.stringify(propSchema, null, 2) + '\n', 'utf-8')

    console.log(`  ✓ Created ${propName}/${propName}.schema.json`)

    // Add $ref to orchestrator
    orchestratorProperties[propName] = {
      $ref: `./${propName}/${propName}.schema.json`,
    }
  }

  // Create orchestrator schema
  const orchestrator: any = {
    $id: `${fieldTypeName}.schema.json`,
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: schema.title,
    type: 'object',
    properties: orchestratorProperties,
  }

  if (schema.description) {
    orchestrator.description = schema.description
  }

  if (schema.required) {
    orchestrator.required = schema.required
  }

  if (schema.additionalProperties !== undefined) {
    orchestrator.additionalProperties = schema.additionalProperties
  }

  // Convert root-level x-user-stories to specs array
  if (schema['x-user-stories']) {
    const rootSpecs = convertUserStoriesToSpecs(
      schema['x-user-stories'],
      fieldTypeName,
      fieldTypeName.replace(/-field$/, '')
    )
    if (rootSpecs.length > 0) {
      orchestrator.specs = rootSpecs
    }
  }

  // Write orchestrator schema
  const orchestratorPath = join(fieldTypeDir, `${fieldTypeName}.schema.json`)
  await writeFile(orchestratorPath, JSON.stringify(orchestrator, null, 2) + '\n', 'utf-8')

  console.log(`  ✓ Created ${fieldTypeName}.schema.json (orchestrator)`)

  // Remove old schema file
  await rm(schemaPath)
  console.log(`  ✓ Removed old ${fileName}`)
}

async function main() {
  console.log('🚀 Starting field type schema refactoring...\n')

  // Find all schema files in field-types directory
  const entries = await readdir(FIELD_TYPES_DIR)
  const schemaFiles = entries
    .filter((entry) => entry.endsWith('.schema.json'))
    .map((file) => join(FIELD_TYPES_DIR, file))

  console.log(`Found ${schemaFiles.length} field type schemas to refactor\n`)

  let successCount = 0
  let errorCount = 0

  for (const schemaPath of schemaFiles) {
    try {
      await refactorFieldType(schemaPath)
      successCount++
    } catch (error) {
      console.error(`❌ Error refactoring ${basename(schemaPath)}:`, error)
      errorCount++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`✅ Successfully refactored: ${successCount} field types`)
  if (errorCount > 0) {
    console.log(`❌ Failed: ${errorCount} field types`)
  }
  console.log('='.repeat(60))
}

main().catch(console.error)
