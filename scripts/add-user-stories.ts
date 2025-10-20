#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Add x-user-stories to all properties in app.schema.json
 *
 * This script processes the schema and adds relevant user stories to every property
 * based on its type, validation rules, and context.
 *
 * Usage:
 *   bun run scripts/add-user-stories.ts
 */

import { join } from 'node:path'

// Type definitions
export interface JSONSchema {
  type?: string | string[]
  title?: string
  description?: string
  properties?: Record<string, JSONSchema>
  items?: JSONSchema
  anyOf?: JSONSchema[]
  oneOf?: JSONSchema[]
  allOf?: JSONSchema[]
  definitions?: Record<string, JSONSchema>
  pattern?: string
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  enum?: (string | number | boolean)[]
  const?: string | number | boolean
  default?: unknown
  format?: string
  examples?: unknown[]
  'x-business-rules'?: string[]
  'x-user-stories'?: string[]
  [key: string]: unknown
}

// User stories extracted from test files
const NAME_STORIES: readonly string[] = [
  'GIVEN a server configured with a specific app name WHEN user navigates to the homepage THEN the app name should be displayed as the main h1 heading',
  "GIVEN an app with name 'my-dashboard' WHEN user navigates to the homepage THEN browser title should be '{name} - Powered by Omnera'",
  "GIVEN an app with single-character name 'a' WHEN user navigates to the homepage THEN single character should be displayed as heading",
  'GIVEN an app with 214-character name (npm package max length) WHEN user navigates to the homepage THEN full name should be displayed without truncation',
  "GIVEN an app with scoped package name '@myorg/dashboard' WHEN user navigates to the homepage THEN full scoped name including @ and / should be displayed",
  "GIVEN an app with hyphenated name 'user-management-system' WHEN user navigates to the homepage THEN name with hyphens should be displayed exactly",
  "GIVEN an app with underscored name 'user_dashboard_app' WHEN user navigates to the homepage THEN name with underscores should be displayed exactly",
  "GIVEN an app with dotted name 'app.dashboard.v2' WHEN user navigates to the homepage THEN name with dots should be displayed exactly",
  "GIVEN an app with complex name '@scope/my-app_v2.beta-test' WHEN user navigates to the homepage THEN all special characters should be preserved",
  "GIVEN an app with name 'accessibility-test' WHEN user navigates to the homepage THEN page should have exactly one h1 element (primary heading)",
  "GIVEN an app with name 'semantic-html-test' WHEN user navigates to the homepage THEN h1 should be the first heading level on the page",
  "GIVEN an app with name 'layout-test' WHEN user navigates to the homepage THEN h1 heading should be centered horizontally",
  "GIVEN an app with name 'visibility-test' WHEN user navigates to the homepage THEN h1 heading should be visible and not hidden",
  "GIVEN an app with name 'my-app-2024' WHEN user navigates to the homepage THEN text content should exactly match input (no sanitization beyond React defaults)",
  "GIVEN an app with single-character name 'x' WHEN user navigates to the homepage THEN page title should be 'x - Powered by Omnera'",
  "GIVEN an app with scoped name '@company/product' WHEN user navigates to the homepage THEN page title should preserve @ symbol and forward slash",
  "GIVEN an app with name 'typography-test' WHEN user navigates to the homepage THEN h1 should use TypographyH1 component styling (large font size)",
  'GIVEN two different test runs with different app names WHEN user navigates to each homepage THEN each should display its respective app name',
  "GIVEN an app with name containing tilde 'app~test' WHEN user navigates to the homepage THEN tilde should be displayed in heading",
  "GIVEN an app with complex scoped name '@my-org.team/product-v2' WHEN user navigates to the homepage THEN full scoped name with dots and hyphens should be displayed",
  'GIVEN an app with complex scoped package name containing all valid characters WHEN user navigates to the homepage THEN all name display requirements should be met (display, metadata, special characters, accessibility, styling)',
] as const

const VERSION_STORIES: readonly string[] = [
  "GIVEN an app with name and simple SemVer version '1.0.0' WHEN user navigates to the homepage THEN version badge should be visible with correct version text",
  'GIVEN an app with only name (no version property) WHEN user navigates to the homepage THEN version badge should NOT be rendered',
  "GIVEN an app with pre-release version '2.0.0-beta.1' WHEN user navigates to the homepage THEN badge should display pre-release version exactly as specified",
  "GIVEN an app with build metadata in version '1.0.0+build.123' WHEN user navigates to the homepage THEN badge should display version with build metadata intact",
  "GIVEN an app with both pre-release and build metadata '1.0.0-alpha+001' WHEN user navigates to the homepage THEN badge should display complete version string",
  'GIVEN an app with name and version WHEN user navigates to the homepage THEN badge should appear before (above) the app name heading',
  'GIVEN an app with version WHEN user navigates to the homepage THEN badge should have proper accessibility attributes (data-testid, data-slot)',
] as const

const DESCRIPTION_STORIES: readonly string[] = [
  'GIVEN an app with name and description WHEN user navigates to the homepage THEN description should be visible below the app name',
  'GIVEN an app with only name (no description property) WHEN user navigates to the homepage THEN description element should NOT be rendered',
  'GIVEN an app with name and description WHEN user navigates to the homepage THEN description MUST appear AFTER the h1 title in DOM order',
  'GIVEN an app with description containing special characters WHEN user navigates to the homepage THEN special characters should be displayed correctly',
  'GIVEN an app with description containing Unicode and emojis WHEN user navigates to the homepage THEN Unicode characters and emojis should be displayed correctly',
  'GIVEN an app with very long description (500+ characters) WHEN user navigates to the homepage THEN description should wrap properly and remain visible',
  'GIVEN an app with empty string description (not undefined) WHEN user navigates to the homepage THEN description element should NOT be rendered',
  'GIVEN an app with description WHEN user navigates to the homepage THEN description should be rendered as a paragraph (<p>) element',
  'GIVEN an app with description WHEN user navigates to the homepage THEN description should be centered horizontally',
  'GIVEN an app with description WHEN user navigates to the homepage THEN description should be visible and in viewport',
  'GIVEN an app with description containing mixed case, special chars, and whitespace WHEN user navigates to the homepage THEN text content should exactly match input (no transformation)',
  'GIVEN an app with version, name, and description WHEN user navigates to the homepage THEN all elements should appear in correct order: version → title → description',
  'GIVEN an app with very long description (1000+ characters) WHEN user navigates to the homepage THEN full description should be displayed without truncation',
  'GIVEN an app with description containing HTML-like tags WHEN user navigates to the homepage THEN HTML tags should be escaped and displayed as text (not rendered as HTML)',
  'GIVEN an app with name and description WHEN user navigates to the homepage THEN there should be appropriate spacing between title and description',
] as const

/**
 * Generate context-aware user stories for a property based on its schema definition
 */
export function generateUserStories(
  propName: string,
  propSchema: JSONSchema,
  context: string = ''
): readonly string[] {
  // Special cases: root properties with test-extracted stories
  if (context === 'root' && propName === 'name') {
    return NAME_STORIES
  }
  if (context === 'root' && propName === 'version') {
    return VERSION_STORIES
  }
  if (context === 'root' && propName === 'description') {
    return DESCRIPTION_STORIES
  }

  // If property already has user stories, keep them
  if (propSchema['x-user-stories'] && propSchema['x-user-stories'].length > 0) {
    return propSchema['x-user-stories']
  }

  const stories: string[] = []
  const propType = Array.isArray(propSchema.type)
    ? propSchema.type[0]
    : (propSchema.type ?? 'unknown')
  const title = propSchema.title ?? propName
  const description = propSchema.description ?? ''

  // OAuth/Connection credentials (clientId, clientSecret, etc.) - CHECK BEFORE ID
  if (propName.toLowerCase().includes('client') || description.toLowerCase().includes('oauth')) {
    if (propName.toLowerCase().includes('secret')) {
      stories.push(
        'GIVEN a user connects external service WHEN providing OAuth client secret THEN authentication should succeed with valid credentials',
        'GIVEN invalid OAuth client secret WHEN attempting authentication THEN system should return clear error message',
        'GIVEN stored client secret WHEN automation executes THEN credentials should be used securely without exposure'
      )
    } else {
      stories.push(
        'GIVEN a user connects external service WHEN providing OAuth client ID THEN authentication should succeed with valid credentials',
        'GIVEN invalid OAuth client ID WHEN attempting authentication THEN system should return clear error message',
        'GIVEN automation needs external API access WHEN executing action THEN stored OAuth tokens should be used for authentication'
      )
    }
  }
  // Webhook/HTTP paths
  else if (
    propName === 'path' &&
    (context.toLowerCase().includes('webhook') || context.toLowerCase().includes('http'))
  ) {
    stories.push(
      'GIVEN automation with webhook trigger WHEN external service sends request to path THEN automation should execute successfully',
      'GIVEN webhook configured with unique path WHEN validating configuration THEN path conflicts should be detected',
      'GIVEN webhook with specific path WHEN request received THEN correct automation should be triggered'
    )
  }
  // URL/URI properties
  else if (propType === 'string' && propSchema.format === 'uri') {
    stories.push(
      'GIVEN user provides URL WHEN validating input THEN valid URLs should be accepted',
      'GIVEN user provides invalid URL WHEN validating input THEN clear error message should be displayed',
      'GIVEN URL is stored WHEN user accesses it THEN link should navigate to correct destination'
    )
  }
  // Boolean flags
  else if (propType === 'boolean') {
    const defaultVal = propSchema.default ?? false
    stories.push(
      `GIVEN ${propName} is true WHEN processing entity THEN corresponding behavior should be enforced`,
      `GIVEN ${propName} is false (default: ${defaultVal}) WHEN processing entity THEN corresponding behavior should not be enforced`,
      `GIVEN configuration with ${propName} WHEN validating settings THEN boolean value should be accepted`
    )
  }
  // Enum/const properties
  else if ('const' in propSchema) {
    const constValue = propSchema.const
    stories.push(
      `GIVEN entity with ${propName}='${constValue}' WHEN processing configuration THEN correct handler should be selected`,
      `GIVEN invalid ${propName} value WHEN validating configuration THEN clear error message should identify the issue`
    )
  } else if ('enum' in propSchema && propSchema.enum) {
    const enumValues = propSchema.enum
    stories.push(
      `GIVEN user selects ${propName} from valid options WHEN validating input THEN selection should be accepted`,
      `GIVEN user provides invalid ${propName} value WHEN validating input THEN error should list valid options: ${enumValues.slice(0, 3).join(', ')}`,
      `GIVEN ${propName} is set to any valid enum value WHEN processing entity THEN appropriate behavior should execute`
    )
  }
  // Table/database properties
  else if (propName === 'table' && description.toLowerCase().includes('table name')) {
    stories.push(
      'GIVEN automation references table WHEN action executes THEN records should be created/updated in specified table',
      'GIVEN invalid table name WHEN validating automation THEN system should provide clear error identifying invalid table reference',
      'GIVEN automation targets table WHEN trigger fires THEN correct table context should be available to actions'
    )
  }
  // Field properties (for database fields)
  else if (context.toLowerCase().includes('field') && propName === 'name') {
    stories.push(
      'GIVEN new field is created WHEN saving configuration THEN field name should follow database naming conventions',
      'GIVEN field with duplicate name WHEN validating table schema THEN error should prevent conflicts',
      'GIVEN field name is set WHEN querying data THEN field should be accessible by its name'
    )
  }
  // Cron expression - CHECK BEFORE template/expression
  else if (propName === 'expression' && description.toLowerCase().includes('cron')) {
    stories.push(
      'GIVEN automation with cron expression WHEN schedule time arrives THEN automation should execute automatically',
      'GIVEN invalid cron expression WHEN validating automation THEN error should explain correct cron syntax',
      'GIVEN cron expression with timezone WHEN schedule evaluates THEN execution should occur at correct local time'
    )
  }
  // Timezone - CHECK BEFORE ID (since description may contain 'identifier')
  else if (propName === 'timeZone' || description.toLowerCase().includes('timezone')) {
    stories.push(
      'GIVEN automation with timezone WHEN cron expression evaluates THEN execution should occur at correct local time',
      'GIVEN invalid timezone identifier WHEN validating configuration THEN error should list valid IANA timezones',
      'GIVEN timezone handles DST transitions WHEN schedule crosses DST boundary THEN execution should occur at correct wall-clock time'
    )
  }
  // Template/expression properties
  else if (
    propName.toLowerCase().includes('template') ||
    propName.toLowerCase().includes('expression')
  ) {
    stories.push(
      'GIVEN template with variables WHEN action executes THEN variables should be substituted with trigger context data',
      'GIVEN invalid template syntax WHEN validating automation THEN error should identify syntax issues',
      'GIVEN template variables reference trigger data WHEN automation runs THEN correct values should be interpolated'
    )
  }
  // Filter/condition properties
  else if (
    context.toLowerCase().includes('filter') ||
    context.toLowerCase().includes('condition')
  ) {
    stories.push(
      'GIVEN automation with filter condition WHEN condition evaluates to true THEN subsequent actions should execute',
      'GIVEN automation with filter condition WHEN condition evaluates to false THEN subsequent actions should be skipped',
      'GIVEN filter uses template variables WHEN evaluating condition THEN variables should resolve from trigger context'
    )
  }
  // Generic string with pattern - CHECK BEFORE ID (slug might have 'identifier' in description)
  else if (propType === 'string' && 'pattern' in propSchema) {
    stories.push(
      `GIVEN user provides ${propName} matching pattern WHEN validating input THEN value should be accepted`,
      `GIVEN user provides ${propName} not matching pattern WHEN validating input THEN clear error message should explain format requirement`,
      `GIVEN ${propName} is stored WHEN retrieved later THEN original format should be preserved`
    )
  }
  // ID properties (read-only, auto-generated) - CHECK AFTER pattern/specific cases
  else if (
    propName === 'id' ||
    title.includes('ID') ||
    description.toLowerCase().includes('identifier')
  ) {
    stories.push(
      'GIVEN a new entity is created WHEN the system assigns an ID THEN it should be unique within the parent collection',
      'GIVEN an entity exists WHEN attempting to modify its ID THEN the system should prevent changes (read-only constraint)',
      'GIVEN a client requests an entity by ID WHEN the ID is valid THEN the entity should be retrieved successfully'
    )
  }
  // Generic string with length constraints
  else
    switch (propType) {
      case 'string': {
        const minLen = propSchema.minLength
        const maxLen = propSchema.maxLength
        if (minLen !== undefined && maxLen !== undefined) {
          stories.push(
            `GIVEN user provides ${propName} with ${minLen}-${maxLen} characters WHEN validating input THEN value should be accepted`,
            `GIVEN user provides ${propName} shorter than ${minLen} chars WHEN validating input THEN error should require minimum length`,
            `GIVEN user provides ${propName} longer than ${maxLen} chars WHEN validating input THEN error should enforce maximum length`
          )
        } else if (minLen !== undefined) {
          stories.push(
            `GIVEN user provides ${propName} with at least ${minLen} characters WHEN validating input THEN value should be accepted`,
            `GIVEN user provides ${propName} shorter than ${minLen} chars WHEN validating input THEN error should require minimum length`
          )
        } else {
          stories.push(
            `GIVEN user provides ${propName} WHEN validating input THEN string value should be accepted`,
            `GIVEN ${propName} is empty string WHEN validating input THEN behavior should follow optional/required rules`
          )
        }

        break
      }
      case 'number':
      case 'integer': {
        const minVal = propSchema.minimum
        const maxVal = propSchema.maximum
        if (minVal !== undefined && maxVal !== undefined) {
          stories.push(
            `GIVEN user provides ${propName} between ${minVal} and ${maxVal} WHEN validating input THEN value should be accepted`,
            `GIVEN user provides ${propName} below ${minVal} WHEN validating input THEN error should enforce minimum value`,
            `GIVEN user provides ${propName} above ${maxVal} WHEN validating input THEN error should enforce maximum value`
          )
        } else if (minVal !== undefined) {
          stories.push(
            `GIVEN user provides ${propName} >= ${minVal} WHEN validating input THEN value should be accepted`,
            `GIVEN user provides ${propName} < ${minVal} WHEN validating input THEN error should enforce minimum value`
          )
        } else {
          stories.push(
            `GIVEN user provides ${propName} WHEN validating input THEN numeric value should be accepted`,
            `GIVEN user provides non-numeric ${propName} WHEN validating input THEN error should require number`
          )
        }

        break
      }
      case 'array': {
        const { minItems } = propSchema
        if (minItems !== undefined) {
          stories.push(
            `GIVEN user provides ${propName} with at least ${minItems} items WHEN validating input THEN array should be accepted`,
            `GIVEN user provides ${propName} with fewer than ${minItems} items WHEN validating input THEN error should enforce minimum items`
          )
        } else {
          stories.push(
            `GIVEN user provides ${propName} array WHEN validating input THEN items should be processed in order`,
            `GIVEN ${propName} array is empty WHEN validating input THEN behavior should follow optional/required rules`
          )
        }

        break
      }
      // No default
    }

  // Fallback: generic stories
  if (stories.length === 0) {
    stories.push(
      `GIVEN user configures ${propName} WHEN validating input THEN value should meet schema requirements`,
      `GIVEN ${propName} is set WHEN processing configuration THEN value should be used correctly`
    )
  }

  return stories.slice(0, 4) // Limit to 2-4 stories per property
}

/**
 * Recursively add x-user-stories to all properties in the schema
 */
export function addUserStoriesToProperties(
  obj: JSONSchema,
  context: string = '',
  path: string = 'root'
): number {
  let count = 0

  // Process properties
  if (obj.properties && typeof obj.properties === 'object') {
    for (const [propName, propSchema] of Object.entries(obj.properties)) {
      if (typeof propSchema === 'object' && propSchema !== null) {
        // Generate and add user stories if not already present
        const existingStories = propSchema['x-user-stories'] ?? []
        if (existingStories.length === 0) {
          const newContext = context || propName
          const userStories = generateUserStories(propName, propSchema, newContext)
          if (userStories.length > 0) {
            propSchema['x-user-stories'] = [...userStories]
            count++
            console.log(`Added ${userStories.length} stories to: ${path}.${propName}`)
          }
        }

        // Recursively process nested properties
        count += addUserStoriesToProperties(
          propSchema,
          context ? `${context}/${propName}` : propName,
          `${path}.properties.${propName}`
        )
      }
    }
  }

  // Process items in arrays
  if (obj.items && typeof obj.items === 'object') {
    count += addUserStoriesToProperties(obj.items, `${context}/items`, `${path}.items`)
  }

  // Process anyOf/oneOf/allOf
  for (const unionKey of ['anyOf', 'oneOf', 'allOf'] as const) {
    const unionArray = obj[unionKey]
    if (Array.isArray(unionArray)) {
      for (const [i, item] of unionArray.entries()) {
        if (typeof item === 'object' && item !== null) {
          count += addUserStoriesToProperties(
            item,
            `${context}/${unionKey}[${i}]`,
            `${path}.${unionKey}[${i}]`
          )
        }
      }
    }
  }

  // Process definitions (add stories directly to each definition schema)
  if (obj.definitions && typeof obj.definitions === 'object') {
    for (const [defName, defSchema] of Object.entries(obj.definitions)) {
      if (typeof defSchema === 'object' && defSchema !== null) {
        // Add stories directly to the definition schema
        const existingStories = defSchema['x-user-stories'] ?? []
        if (existingStories.length === 0) {
          const userStories = generateUserStories(defName, defSchema, `definitions/${defName}`)
          if (userStories.length > 0) {
            defSchema['x-user-stories'] = [...userStories]
            count++
            console.log(`Added ${userStories.length} stories to: root.definitions.${defName}`)
          }
        }

        // Also recursively process any nested properties within the definition
        count += addUserStoriesToProperties(
          defSchema,
          `definitions/${defName}`,
          `root.definitions.${defName}`
        )
      }
    }
  }

  return count
}

/**
 * Main execution function
 */
async function main(): Promise<number> {
  const schemaPath = join(import.meta.dir, '..', 'docs', 'specifications', 'app', 'app.schema.json')

  console.log(`Reading schema from: ${schemaPath}`)

  // Read schema file
  const schemaFile = Bun.file(schemaPath)
  const schema = (await schemaFile.json()) as JSONSchema

  console.log('\nAdding user stories to properties...')

  // Add stories to root properties first with special context
  let rootPropsCount = 0
  if (schema.properties) {
    for (const propName of ['name', 'version', 'description'] as const) {
      const propSchema = schema.properties[propName]
      if (propSchema && typeof propSchema === 'object') {
        const existingStories = propSchema['x-user-stories'] ?? []
        if (existingStories.length === 0) {
          const userStories = generateUserStories(propName, propSchema, 'root')
          if (userStories.length > 0) {
            propSchema['x-user-stories'] = [...userStories]
            rootPropsCount++
            console.log(`Added ${userStories.length} stories to root property: ${propName}`)
          }
        }
      }
    }
  }

  // Process all other properties
  const totalCount = rootPropsCount + addUserStoriesToProperties(schema)

  console.log(`\n✅ Added x-user-stories to ${totalCount} properties`)

  // Write updated schema
  console.log(`\nWriting updated schema to: ${schemaPath}`)
  await Bun.write(schemaPath, JSON.stringify(schema, null, 2) + '\n')

  console.log('✅ Schema updated successfully!')

  // Report statistics
  const fileSize = (await Bun.file(schemaPath).size) ?? 0
  console.log('\nStatistics:')
  console.log(`  - Properties updated: ${totalCount}`)
  console.log(
    `  - File size: ${fileSize.toLocaleString()} bytes (${(fileSize / 1024).toFixed(1)} KB)`
  )

  return 0
}

// Execute if run directly
if (import.meta.main) {
  const exitCode = await main()
  process.exit(exitCode)
}
