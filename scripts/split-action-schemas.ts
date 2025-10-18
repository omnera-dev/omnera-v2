#!/usr/bin/env bun

/**
 * Script to split automation action types into dedicated schema files
 *
 * This script:
 * 1. Loads the automations schema
 * 2. Extracts each action definition from automation_action.anyOf
 * 3. Creates individual schema files in actions/ directory
 * 4. Updates automations.schema.json to use $ref instead of inline definitions
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

interface ActionDefinition {
  title: string
  service: string
  action: string
  path: string
  fullDefinition: any
  fileName: string
}

function extractActionsWithDefinitions(
  schema: any,
  path: string = 'root',
  parentAnyOf: any[] = []
): ActionDefinition[] {
  const actions: ActionDefinition[] = []

  if (schema.anyOf && Array.isArray(schema.anyOf)) {
    schema.anyOf.forEach((item: any, index: number) => {
      const itemPath = `${path}.anyOf.${index}`

      // Check if this is a leaf action definition (has service and action)
      if (item.properties?.service?.const && item.properties?.action?.const) {
        const service = item.properties.service.const
        const action = item.properties.action.const
        const fileName = `${service}-${action}-action.schema.json`

        actions.push({
          title: item.title || 'Untitled Action',
          service,
          action,
          path: itemPath,
          fullDefinition: item,
          fileName,
        })
      }

      // Recursively process nested anyOf
      actions.push(...extractActionsWithDefinitions(item, itemPath, schema.anyOf))
    })
  }

  return actions
}

function createActionSchemaFile(action: ActionDefinition, outputDir: string) {
  const schemaContent = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: `https://omnera.io/schemas/automations/actions/${action.fileName}`,
    ...action.fullDefinition,
  }

  const filePath = join(outputDir, action.fileName)
  writeFileSync(filePath, JSON.stringify(schemaContent, null, 2), 'utf-8')

  console.log(`   ✅ Created: ${action.fileName}`)
}

function updateAutomationSchema(actions: ActionDefinition[], schemaPath: string) {
  const schemaContent = readFileSync(schemaPath, 'utf-8')
  const schema = JSON.parse(schemaContent)

  // Create the new anyOf array with $ref entries
  const newAnyOf = actions.map((action) => ({
    $ref: `./actions/${action.fileName}`,
  }))

  // Update the automation_action definition
  if (schema.definitions?.automation_action) {
    schema.definitions.automation_action.anyOf = newAnyOf
  }

  writeFileSync(schemaPath, JSON.stringify(schema, null, 2), 'utf-8')
  console.log(`\n✅ Updated automations.schema.json with ${actions.length} $ref entries`)
}

function main() {
  const schemaDir = join(process.cwd(), 'docs/specifications/schemas/automations')
  const schemaPath = join(schemaDir, 'automations.schema.json')
  const actionsDir = join(schemaDir, 'actions')

  console.log('📖 Reading schema file...')
  const schemaContent = readFileSync(schemaPath, 'utf-8')
  const schema = JSON.parse(schemaContent)

  // Create actions directory
  if (!existsSync(actionsDir)) {
    mkdirSync(actionsDir, { recursive: true })
    console.log(`📁 Created directory: ${actionsDir}`)
  }

  console.log('🔍 Extracting action definitions...\n')

  // Find the automation_action definition
  const automationAction = schema.definitions?.automation_action

  if (!automationAction) {
    console.error('❌ Could not find definitions.automation_action in schema')
    process.exit(1)
  }

  const actions = extractActionsWithDefinitions(automationAction)

  console.log(`📝 Creating ${actions.length} action schema files...\n`)

  // Group by service for organized output
  const byService = actions.reduce(
    (acc, action) => {
      if (!acc[action.service]) {
        acc[action.service] = []
      }
      acc[action.service].push(action)
      return acc
    },
    {} as Record<string, ActionDefinition[]>
  )

  // Create individual files
  Object.keys(byService)
    .sort()
    .forEach((service) => {
      console.log(`\n📦 Service: ${service}`)
      byService[service].forEach((action) => {
        createActionSchemaFile(action, actionsDir)
      })
    })

  console.log(`\n📝 Updating automations.schema.json...`)
  updateAutomationSchema(actions, schemaPath)

  console.log(`\n✅ Split complete!`)
  console.log(`\n📊 Summary:`)
  console.log(`   Total action files created: ${actions.length}`)
  console.log(`   Services: ${Object.keys(byService).length}`)
  console.log(`   Output directory: ${actionsDir}`)
}

main()
