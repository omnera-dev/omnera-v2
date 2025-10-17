/**
 * Schema User Stories Extractor
 *
 * Extracts x-user-stories from JSON Schema definitions and converts them
 * to structured format for E2E test generation
 */

import type { JSONSchema, JSONSchemaProperty } from '../types/roadmap.ts'

export interface UserStoryStructured {
  given: string
  when: string
  then: string
  tag: '@spec' | '@regression' | '@critical'
}

export interface UserStoriesFormatted {
  propertyName: string
  spec: UserStoryStructured[]
  regression: UserStoryStructured[]
  critical: UserStoryStructured[]
  dataTestIds: string[]
}

/**
 * Extract and format user stories from schema for a given property path
 *
 * Examples:
 *   - "automations" -> extracts from definitions.automation
 *   - "automation_trigger.http.post" -> navigates to HTTP POST trigger definition
 *   - "automation_action.notion.create-page" -> navigates to Notion Create Page action
 */
export function extractUserStoriesFromSchema(
  propertyPath: string,
  schema: JSONSchema
): UserStoriesFormatted {
  const rawStories = extractRawUserStoriesFromSchema(propertyPath, schema)
  return parseUserStories(propertyPath, rawStories)
}

/**
 * Extract raw user stories strings from schema
 */
function extractRawUserStoriesFromSchema(propertyPath: string, schema: JSONSchema): string[] {
  // Handle top-level array properties (automations, connections, pages, tables)
  const topLevelArrayProperties = ['automations', 'connections', 'pages', 'tables']
  if (topLevelArrayProperties.includes(propertyPath)) {
    const singularMap: Record<string, string> = {
      automations: 'automation',
      connections: 'connection',
      pages: 'page',
      tables: 'table',
    }
    const definitionName = singularMap[propertyPath]
    if (definitionName && schema.definitions?.[definitionName]) {
      const def = schema.definitions[definitionName]
      return extractUserStoriesFromDefinition(def)
    }
  }

  // Handle definition paths (e.g., automation_trigger.http.post)
  const definitionPrefixes = ['automation_trigger', 'automation_action', 'filter_condition']
  const matchingPrefix = definitionPrefixes.find((prefix) => propertyPath.startsWith(prefix))

  if (matchingPrefix) {
    const parts = propertyPath.split('.')

    // Get the base definition
    const baseDefinition = schema.definitions?.[matchingPrefix]
    if (!baseDefinition) {
      return []
    }

    // If it's just the base definition (e.g., "automation_trigger")
    if (parts.length === 1) {
      return extractUserStoriesFromDefinition(baseDefinition)
    }

    // Navigate through the schema structure
    // Format: automation_trigger.{service}.{event}
    // or: automation_action.{service}.{action}
    if (parts.length === 3) {
      const [, service, eventOrAction] = parts
      const userStories = findUserStoriesInAnyOf(baseDefinition, service!, eventOrAction!)
      return userStories
    }
  }

  // Handle nested property paths (e.g., tables.fields.text-field.name)
  // These typically don't have x-user-stories, but we check anyway
  return []
}

/**
 * Extract x-user-stories from a definition object
 */
function extractUserStoriesFromDefinition(definition: JSONSchemaProperty): string[] {
  if (!definition) {
    return []
  }

  // Check for x-user-stories at the current level
  if (Array.isArray(definition['x-user-stories'])) {
    return definition['x-user-stories']
  }

  // Check in items (for array schemas)
  if (definition.items && definition.items['x-user-stories']) {
    return definition.items['x-user-stories']
  }

  return []
}

/**
 * Find user stories by navigating through anyOf/oneOf structures
 *
 * This handles the nested structure like:
 * anyOf[{title: "HTTP Trigger", anyOf: [{title: "POST Request", x-user-stories: [...]}]}]
 */
function findUserStoriesInAnyOf(
  definition: JSONSchemaProperty,
  service: string,
  eventOrAction: string
): string[] {
  if (!definition) {
    return []
  }

  // First, find the service group (e.g., "HTTP Trigger", "Integration Trigger")
  const anyOfItems = definition.anyOf || definition.oneOf || []

  for (const item of anyOfItems) {
    // Check if this item has nested anyOf (service-specific triggers/actions)
    if (item.anyOf || item.oneOf) {
      const nestedItems = item.anyOf || item.oneOf

      // Look for the specific event/action in the nested structure
      for (const nestedItem of nestedItems) {
        if (matchesServiceAndEvent(nestedItem, service, eventOrAction)) {
          const userStories = extractUserStoriesFromDefinition(nestedItem)
          if (userStories.length > 0) {
            return userStories
          }
        }
      }

      // Also check the parent level for x-user-stories
      const parentUserStories = extractUserStoriesFromDefinition(item)
      if (parentUserStories.length > 0) {
        return parentUserStories
      }
    }

    // Direct match (no nested anyOf)
    if (matchesServiceAndEvent(item, service, eventOrAction)) {
      const userStories = extractUserStoriesFromDefinition(item)
      if (userStories.length > 0) {
        return userStories
      }
    }
  }

  return []
}

/**
 * Check if a schema item matches the service and event/action
 */
function matchesServiceAndEvent(
  item: JSONSchemaProperty,
  service: string,
  eventOrAction: string
): boolean {
  if (!item || !item.properties) {
    return false
  }

  // Normalize service name for comparison
  const normalizedService = normalizeServiceName(service)

  // Check if service matches
  const serviceConst = item.properties.service?.const
  if (serviceConst && normalizeServiceName(serviceConst) === normalizedService) {
    // Check if event or action matches
    const eventConst = item.properties.event?.const
    const actionConst = item.properties.action?.const

    const eventOrActionConst = eventConst || actionConst

    if (eventOrActionConst) {
      return normalizeEventOrAction(eventOrActionConst) === normalizeEventOrAction(eventOrAction)
    }
  }

  return false
}

/**
 * Normalize service name for comparison
 * Handles variations like "http", "HTTP", "linkedin-ads", "linked-in-ads"
 */
function normalizeServiceName(name: string): string {
  return name.toLowerCase().replace(/_/g, '-')
}

/**
 * Normalize event/action name for comparison
 * Handles variations like "post", "POST", "create-page", "create_page"
 */
function normalizeEventOrAction(name: string): string {
  return name.toLowerCase().replace(/_/g, '-')
}

/**
 * Parse raw user story strings into structured format
 *
 * Parses strings like:
 * "GIVEN a record is created WHEN I trigger an automation THEN it should succeed"
 *
 * Into structured objects with given, when, then, and tag properties
 */
function parseUserStories(propertyName: string, rawStories: string[]): UserStoriesFormatted {
  const result: UserStoriesFormatted = {
    propertyName,
    spec: [],
    regression: [],
    critical: [],
    dataTestIds: generateDataTestIds(propertyName),
  }

  for (const story of rawStories) {
    const parsed = parseUserStory(story)
    if (parsed) {
      // All stories from x-user-stories are treated as @spec by default
      // They represent actual behavioral requirements from the schema
      result.spec.push(parsed)
    }
  }

  return result
}

/**
 * Generate data-testid patterns for a property
 */
function generateDataTestIds(propertyName: string): string[] {
  // Generate basic test IDs based on property name
  // These can be customized based on the property type
  const baseId = propertyName.replace(/\./g, '-')

  return [`${baseId}-input`, `${baseId}-error`]
}

/**
 * Parse a single user story string into structured format
 *
 * Format: "GIVEN ... WHEN ... THEN ..."
 */
function parseUserStory(story: string): UserStoryStructured | null {
  // Match GIVEN ... WHEN ... THEN ... pattern
  const match = story.match(/GIVEN\s+(.+?)\s+WHEN\s+(.+?)\s+THEN\s+(.+?)$/i)

  if (!match) {
    console.warn(`Failed to parse user story: ${story}`)
    return null
  }

  const [, given, when, then] = match

  return {
    given: given!.trim(),
    when: when!.trim(),
    then: then!.trim(),
    tag: '@spec',
  }
}
