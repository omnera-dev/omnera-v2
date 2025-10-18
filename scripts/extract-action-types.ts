#!/usr/bin/env bun

/**
 * Script to analyze and extract all action types from automations.schema.json
 *
 * This script:
 * 1. Loads the automations schema
 * 2. Traverses the automation_action.anyOf tree
 * 3. Identifies all action types (service + action pairs)
 * 4. Outputs a structured list for review
 */

import { readFileSync } from 'fs'
import { join } from 'path'

interface ActionDefinition {
  title: string
  service?: string
  action?: string
  path: string
  startLine?: number
  properties?: Record<string, unknown>
}

function extractActions(schema: any, path: string = 'root'): ActionDefinition[] {
  const actions: ActionDefinition[] = []

  if (schema.anyOf && Array.isArray(schema.anyOf)) {
    schema.anyOf.forEach((item: any, index: number) => {
      const itemPath = `${path}.anyOf.${index}`

      // Check if this is an action definition with service and action
      if (item.properties?.service?.const && item.properties?.action?.const) {
        actions.push({
          title: item.title || 'Untitled Action',
          service: item.properties.service.const,
          action: item.properties.action.const,
          path: itemPath,
          properties: item.properties,
        })
      }

      // Recursively process nested anyOf
      actions.push(...extractActions(item, itemPath))
    })
  }

  return actions
}

function main() {
  const schemaPath = join(
    process.cwd(),
    'docs/specifications/schemas/automations/automations.schema.json'
  )

  console.log('📖 Reading schema file...')
  const schemaContent = readFileSync(schemaPath, 'utf-8')
  const schema = JSON.parse(schemaContent)

  console.log('🔍 Extracting action types...\n')

  // Find the automation_action definition
  const automationAction = schema.definitions?.automation_action

  if (!automationAction) {
    console.error('❌ Could not find definitions.automation_action in schema')
    process.exit(1)
  }

  const actions = extractActions(automationAction)

  console.log(`✅ Found ${actions.length} action types:\n`)

  // Group by service
  const byService = actions.reduce(
    (acc, action) => {
      if (!action.service) return acc
      if (!acc[action.service]) {
        acc[action.service] = []
      }
      acc[action.service].push(action)
      return acc
    },
    {} as Record<string, ActionDefinition[]>
  )

  // Display grouped actions
  Object.keys(byService)
    .sort()
    .forEach((service) => {
      console.log(`\n📦 Service: ${service}`)
      byService[service].forEach((action) => {
        console.log(`   - ${action.action} (${action.title})`)
        console.log(`     File: ${service}-${action.action}-action.schema.json`)
      })
    })

  console.log(`\n📊 Summary:`)
  console.log(`   Total actions: ${actions.length}`)
  console.log(`   Services: ${Object.keys(byService).length}`)
  console.log(`\n✅ Analysis complete!`)
}

main()
