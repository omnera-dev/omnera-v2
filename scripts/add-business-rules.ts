#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Script to add contextually-relevant x-business-rules to all properties in specs.schema.json
 *
 * This script analyzes existing property metadata (description, validation rules, defaults)
 * and generates pertinent business rules that explain WHY constraints exist and HOW
 * properties behave in the business context.
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

const SPECS_PATH = path.join(process.cwd(), 'docs/specifications/specs.schema.json')

interface SchemaProperty {
  type?: string | string[]
  description?: string
  title?: string
  pattern?: string
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enum?: any[]
  format?: string
  readOnly?: boolean
  writeOnly?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const?: any
  'x-business-rules'?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

/**
 * Extract key insights from description to guide business rule generation
 */
function analyzeDescription(desc: string): {
  mentions: string[]
  behaviors: string[]
} {
  const mentions: string[] = []
  const behaviors: string[] = []

  if (!desc) return { mentions, behaviors }

  // Look for key behavioral indicators
  if (desc.match(/auto-?generat/i)) behaviors.push('auto-generated')
  if (desc.match(/immutable|read-?only|cannot be (changed|modified)/i)) behaviors.push('immutable')
  if (desc.match(/unique/i)) behaviors.push('unique')
  if (desc.match(/optional/i)) behaviors.push('optional')
  if (desc.match(/required/i)) behaviors.push('required')
  if (desc.match(/default/i)) behaviors.push('has-default')

  // Look for domain mentions
  if (desc.match(/database|PostgreSQL|SQL/i)) mentions.push('database')
  if (desc.match(/API|endpoint|URL|route/i)) mentions.push('api')
  if (desc.match(/webhook/i)) mentions.push('webhook')
  if (desc.match(/OAuth|authentication|credential/i)) mentions.push('auth')
  if (desc.match(/trigger|automation|workflow/i)) mentions.push('automation')
  if (desc.match(/validation|validate/i)) mentions.push('validation')

  return { mentions, behaviors }
}

/**
 * Generate 2-4 contextually relevant business rules for a property
 */
function generateBusinessRules(
  propertyName: string,
  property: SchemaProperty,
  parentContext: string
): string[] {
  // Skip if already has business rules
  if (property['x-business-rules'] && property['x-business-rules'].length > 0) {
    return property['x-business-rules']
  }

  const rules: string[] = []
  const desc = property.description || ''
  const title = property.title || propertyName
  const analysis = analyzeDescription(desc)

  // 1. Behavioral rules (auto-generation, immutability, uniqueness)
  if (property.readOnly || analysis.behaviors.includes('immutable')) {
    rules.push(
      `${title} is ${property.readOnly ? 'read-only and ' : ''}immutable after creation to ensure data integrity and prevent accidental corruption`
    )
  }

  if (analysis.behaviors.includes('auto-generated')) {
    rules.push(
      `System automatically generates ${title.toLowerCase()} to ensure consistency and prevent duplicate or invalid values`
    )
  }

  if (analysis.behaviors.includes('unique')) {
    rules.push(
      `Uniqueness constraint prevents conflicts and ensures each ${title.toLowerCase()} can be unambiguously referenced`
    )
  }

  // 2. Validation constraint rules
  if (property.pattern) {
    let patternPurpose = 'data format consistency and error prevention'
    if (analysis.mentions.includes('database')) {
      patternPurpose = 'database compatibility and SQL syntax correctness'
    } else if (analysis.mentions.includes('api')) {
      patternPurpose = 'valid URL routing and HTTP compatibility'
    }

    rules.push(
      `Pattern constraint enforces ${patternPurpose}, rejecting invalid formats before they cause system errors`
    )
  }

  if (property.minLength || property.maxLength) {
    if (property.maxLength === 63 && analysis.mentions.includes('database')) {
      rules.push(
        `63-character limit enforced by PostgreSQL system catalogs - exceeding this causes database errors`
      )
    } else if (property.maxLength) {
      rules.push(
        `Length limits ensure ${title.toLowerCase()} fits within storage constraints and UI display areas without truncation`
      )
    }

    if (property.minLength && property.minLength > 1) {
      rules.push(
        `Minimum ${property.minLength} characters ensures ${title.toLowerCase()} is sufficiently descriptive for user identification and debugging`
      )
    }
  }

  if (property.minimum !== undefined || property.maximum !== undefined) {
    if (property.maximum === 9_007_199_254_740_991) {
      rules.push(
        `Maximum enforced at JavaScript MAX_SAFE_INTEGER to prevent number precision loss in client applications`
      )
    } else if (property.minimum !== undefined && property.maximum !== undefined) {
      rules.push(
        `Numeric range (${property.minimum}-${property.maximum}) prevents overflow errors and ensures values stay within valid business bounds`
      )
    }
  }

  if (property.enum && property.enum.length > 0 && property.enum.length <= 10) {
    rules.push(
      `Restricted to ${property.enum.length} allowed values (${property.enum.slice(0, 3).join(', ')}${property.enum.length > 3 ? ', ...' : ''}) to maintain type safety and enable clear validation error messages`
    )
  }

  // 3. Format and integration rules
  if (property.format === 'uri') {
    rules.push(
      `Must be a valid URI to ensure ${analysis.mentions.includes('webhook') ? 'webhook delivery' : 'external links'} function correctly without broken references`
    )
  }

  if (property.format === 'email') {
    rules.push(
      `Email format validation prevents delivery failures and ensures communication channels are properly configured`
    )
  }

  // 4. Default value rules
  if (property.default !== undefined && !rules.some((r) => r.includes('default'))) {
    const defaultStr = JSON.stringify(property.default)
    rules.push(
      `Defaults to ${defaultStr} when not specified, providing sensible fallback behavior without requiring explicit configuration`
    )
  }

  // 5. Const value rules
  if (property.const !== undefined) {
    rules.push(
      `Fixed value (${property.const}) identifies this specific ${parentContext} type in discriminated unions and routing logic`
    )
  }

  // 6. Context-specific rules based on parent/property name
  if (parentContext.includes('trigger') && propertyName === 'account') {
    rules.push(
      `References connection ID configured in connections section - must have valid credentials and required permissions`
    )
  }

  if (propertyName.toLowerCase().includes('timezone') || propertyName === 'timeZone') {
    rules.push(
      `Must be valid IANA timezone identifier to ensure scheduled operations execute at correct local times across DST transitions`
    )
  }

  if (propertyName.toLowerCase().includes('expression') && parentContext.includes('cron')) {
    rules.push(
      `Valid cron expression required (e.g., '0 9 * * 1' for Mondays at 9 AM) - invalid syntax causes scheduling failures`
    )
  }

  // 7. Generic context rules if we don't have enough yet
  if (rules.length === 0) {
    switch (property.type) {
      case 'array': {
        rules.push(
          `Array enables multiple ${title.toLowerCase()} to be configured, supporting flexible workflows and batch operations`
        )

        break
      }
      case 'object': {
        rules.push(
          `Object structure groups related ${title.toLowerCase()} properties for better organization and type-safe access`
        )

        break
      }
      case 'boolean': {
        rules.push(
          `Boolean flag enables/disables ${title.toLowerCase()} functionality through simple true/false configuration`
        )

        break
      }
      // No default
    }
  }

  // Fallback if still no rules
  if (rules.length === 0 && desc) {
    // Extract first sentence as a business rule
    const firstSentence = desc.split(/[.!?]/)[0]?.trim()
    if (firstSentence && firstSentence.length > 20 && firstSentence.length < 150) {
      rules.push(firstSentence)
    }
  }

  // Limit to 3-4 most relevant rules
  return rules.slice(0, 4)
}

/**
 * Recursively traverse schema and add business rules to properties
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function processSchema(obj: any, context: string = 'root'): number {
  if (!obj || typeof obj !== 'object') {
    return 0
  }

  let count = 0

  // Process if this looks like a property definition
  if (obj.type && typeof obj.type === 'string' && !obj['x-business-rules']) {
    const propertyName = context.split('.').pop() || 'property'
    const rules = generateBusinessRules(propertyName, obj, context)

    if (rules.length > 0) {
      obj['x-business-rules'] = rules
      count++
    }
  }

  // Recurse into nested structures
  for (const key of Object.keys(obj)) {
    if (key === 'x-business-rules' || key === 'examples' || key === 'x-user-stories') {
      continue // Skip these to avoid modifying
    }

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count += processSchema(obj[key], `${context}.${key}`)
    }
  }

  return count
}

async function main() {
  console.log('📖 Reading specs.schema.json...')
  const schemaContent = fs.readFileSync(SPECS_PATH, 'utf8')
  const schema = JSON.parse(schemaContent)

  const beforeCount = (schemaContent.match(/"x-business-rules"/g) || []).length
  console.log(`📊 Properties with x-business-rules before: ${beforeCount}`)

  console.log('🔄 Processing schema and adding business rules...')
  const addedCount = processSchema(schema)

  console.log('💾 Writing updated schema...')
  fs.writeFileSync(SPECS_PATH, JSON.stringify(schema, null, 2) + '\n', 'utf8')

  const afterContent = fs.readFileSync(SPECS_PATH, 'utf8')
  const afterCount = (afterContent.match(/"x-business-rules"/g) || []).length

  console.log(`\n✅ Successfully added x-business-rules`)
  console.log(`   Before: ${beforeCount} properties`)
  console.log(`   After:  ${afterCount} properties`)
  console.log(`   Added:  ${addedCount} properties`)

  // Validate JSON syntax
  console.log('\n🔍 Validating JSON syntax...')
  try {
    JSON.parse(afterContent)
    console.log('✅ JSON syntax is valid')
  } catch (error) {
    console.error('❌ JSON syntax error:', error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
