/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * E2E User Story Generator (Given-When-Then format)
 */

import type { JSONSchemaProperty, PropertyUserStories, UserStory } from '../types/roadmap'

/**
 * Generate E2E user stories from JSON Schema
 */
export function generateUserStories(
  propertyName: string,
  schema: JSONSchemaProperty
): PropertyUserStories {
  const spec: UserStory[] = []
  const regression: UserStory[] = []
  const critical: UserStory[] = []
  const dataTestIds: string[] = []

  // Generate @spec user stories from validation rules
  generateValidationStories(propertyName, schema, spec, dataTestIds)

  // Generate @regression story (consolidates all spec stories)
  generateRegressionStory(propertyName, schema, spec, regression)

  // Generate @spec story (only for essential features)
  if (isCriticalFeature(propertyName)) {
    generateCriticalStory(propertyName, schema, critical)
  }

  return {
    propertyName,
    spec,
    regression,
    critical,
    dataTestIds: [...new Set(dataTestIds)],
  }
}

/**
 * Generate granular validation user stories
 */
function generateValidationStories(
  propertyName: string,
  schema: JSONSchemaProperty,
  stories: UserStory[],
  dataTestIds: string[]
): void {
  const fieldName = humanize(propertyName)

  // Required field validation
  if (schema.required && schema.required.length > 0) {
    for (const reqField of schema.required) {
      stories.push({
        given: `user is configuring ${fieldName}`,
        when: `${reqField} field is empty`,
        then: `display error "${humanize(reqField)} is required"`,
        tag: '@spec',
      })
      dataTestIds.push(`${propertyName}-${reqField}-input`)
      dataTestIds.push(`${propertyName}-${reqField}-error`)
    }
  }

  // String validation
  if (schema.type === 'string') {
    generateStringValidationStories(propertyName, schema, stories, dataTestIds)
  }

  // Number validation
  if (schema.type === 'number' || schema.type === 'integer') {
    generateNumberValidationStories(propertyName, schema, stories, dataTestIds)
  }

  // Enum validation
  if (schema.enum) {
    generateEnumValidationStories(propertyName, schema, stories, dataTestIds)
  }

  // Array validation
  if (schema.type === 'array') {
    generateArrayValidationStories(propertyName, schema, stories, dataTestIds)
  }

  // Object validation
  if (schema.type === 'object' && schema.properties) {
    generateObjectValidationStories(propertyName, schema, stories, dataTestIds)
  }

  // anyOf/oneOf validation
  if (schema.anyOf || schema.oneOf) {
    generateUnionValidationStories(propertyName, schema, stories, dataTestIds)
  }
}

/**
 * Generate string validation stories
 */
function generateStringValidationStories(
  propertyName: string,
  schema: JSONSchemaProperty,
  stories: UserStory[],
  dataTestIds: string[]
): void {
  const fieldName = humanize(propertyName)

  if (schema.minLength !== undefined) {
    stories.push({
      given: `user enters ${fieldName}`,
      when: `input length is less than ${schema.minLength} characters`,
      then: `display error "Minimum length is ${schema.minLength} characters"`,
      tag: '@spec',
    })
  }

  if (schema.maxLength !== undefined) {
    stories.push({
      given: `user enters ${fieldName}`,
      when: `input length exceeds ${schema.maxLength} characters`,
      then: `display error "Maximum length is ${schema.maxLength} characters"`,
      tag: '@spec',
    })
  }

  if (schema.pattern) {
    stories.push({
      given: `user enters ${fieldName}`,
      when: `input does not match required pattern`,
      then: `display error "${schema.description || 'Invalid format'}"`,
      tag: '@spec',
    })

    // Valid pattern test
    stories.push({
      given: `user enters valid ${fieldName}`,
      when: `input matches required pattern`,
      then: `accept input without error`,
      tag: '@spec',
    })
  }

  dataTestIds.push(`${propertyName}-input`)
  dataTestIds.push(`${propertyName}-error`)
}

/**
 * Generate number validation stories
 */
function generateNumberValidationStories(
  propertyName: string,
  schema: JSONSchemaProperty,
  stories: UserStory[],
  dataTestIds: string[]
): void {
  const fieldName = humanize(propertyName)

  if (schema.minimum !== undefined) {
    stories.push({
      given: `user enters ${fieldName}`,
      when: `value is less than ${schema.minimum}`,
      then: `display error "Minimum value is ${schema.minimum}"`,
      tag: '@spec',
    })
  }

  if (schema.maximum !== undefined) {
    stories.push({
      given: `user enters ${fieldName}`,
      when: `value exceeds ${schema.maximum}`,
      then: `display error "Maximum value is ${schema.maximum}"`,
      tag: '@spec',
    })
  }

  if (schema.type === 'integer') {
    stories.push({
      given: `user enters ${fieldName}`,
      when: `value is a decimal number`,
      then: `display error "Value must be an integer"`,
      tag: '@spec',
    })
  }

  dataTestIds.push(`${propertyName}-input`)
  dataTestIds.push(`${propertyName}-error`)
}

/**
 * Generate enum validation stories
 */
function generateEnumValidationStories(
  propertyName: string,
  schema: JSONSchemaProperty,
  stories: UserStory[],
  dataTestIds: string[]
): void {
  const fieldName = humanize(propertyName)
  const options = schema.enum!.map((v) => JSON.stringify(v)).join(', ')

  stories.push({
    given: `user selects ${fieldName}`,
    when: `one of the valid options is selected`,
    then: `accept the selection without error`,
    tag: '@spec',
  })

  stories.push({
    given: `user is presented with ${fieldName} options`,
    when: `viewing the dropdown`,
    then: `display options: ${options}`,
    tag: '@spec',
  })

  dataTestIds.push(`${propertyName}-select`)
  dataTestIds.push(`${propertyName}-option`)
}

/**
 * Generate array validation stories
 */
function generateArrayValidationStories(
  propertyName: string,
  schema: JSONSchemaProperty,
  stories: UserStory[],
  dataTestIds: string[]
): void {
  const fieldName = humanize(propertyName)

  if (schema.minItems !== undefined) {
    stories.push({
      given: `user configures ${fieldName}`,
      when: `array has fewer than ${schema.minItems} items`,
      then: `display error "Minimum ${schema.minItems} items required"`,
      tag: '@spec',
    })
  }

  if (schema.maxItems !== undefined) {
    stories.push({
      given: `user adds items to ${fieldName}`,
      when: `attempting to add more than ${schema.maxItems} items`,
      then: `prevent addition and show error "Maximum ${schema.maxItems} items allowed"`,
      tag: '@spec',
    })
  }

  stories.push({
    given: `user manages ${fieldName}`,
    when: `adding a new item`,
    then: `display empty item form`,
    tag: '@spec',
  })

  stories.push({
    given: `user manages ${fieldName}`,
    when: `removing an item`,
    then: `item is removed from the list`,
    tag: '@spec',
  })

  dataTestIds.push(`${propertyName}-list`)
  dataTestIds.push(`${propertyName}-add-button`)
  dataTestIds.push(`${propertyName}-remove-button`)
}

/**
 * Generate object validation stories
 */
function generateObjectValidationStories(
  propertyName: string,
  schema: JSONSchemaProperty,
  stories: UserStory[],
  dataTestIds: string[]
): void {
  const fieldName = humanize(propertyName)
  const properties = schema.properties!

  // Test each property
  for (const [propName, propSchema] of Object.entries(properties)) {
    const propFieldName = humanize(propName)

    stories.push({
      given: `user configures ${fieldName}`,
      when: `entering ${propFieldName}`,
      then: `field is ${propSchema.required ? 'required' : 'optional'}`,
      tag: '@spec',
    })

    dataTestIds.push(`${propertyName}-${propName}-input`)
  }
}

/**
 * Generate union (anyOf/oneOf) validation stories
 */
function generateUnionValidationStories(
  propertyName: string,
  schema: JSONSchemaProperty,
  stories: UserStory[],
  dataTestIds: string[]
): void {
  const fieldName = humanize(propertyName)
  const variants = schema.anyOf || schema.oneOf || []

  stories.push({
    given: `user creates ${fieldName}`,
    when: `selecting type`,
    then: `display ${variants.length} type options`,
    tag: '@spec',
  })

  for (const [index, variant] of variants.entries()) {
    const variantName = variant.title || `Type ${index + 1}`

    stories.push({
      given: `user selects ${variantName} type`,
      when: `filling out the form`,
      then: `display fields specific to ${variantName}`,
      tag: '@spec',
    })
  }

  dataTestIds.push(`${propertyName}-type-select`)
}

/**
 * Generate regression story (consolidates all spec stories)
 */
function generateRegressionStory(
  propertyName: string,
  _schema: JSONSchemaProperty,
  _specStories: UserStory[],
  regressionStories: UserStory[]
): void {
  const fieldName = humanize(propertyName)

  // Create comprehensive workflow story
  regressionStories.push({
    given: `user is configuring ${fieldName} in the application`,
    when: `user completes full configuration workflow including all fields and validations`,
    then: `configuration is saved successfully with all validations passing and data persists correctly`,
    tag: '@regression',
  })
}

/**
 * Generate critical story (only for essential features)
 */
function generateCriticalStory(
  propertyName: string,
  _schema: JSONSchemaProperty,
  criticalStories: UserStory[]
): void {
  const fieldName = humanize(propertyName)

  criticalStories.push({
    given: `user needs to use ${fieldName} feature`,
    when: `performing essential configuration`,
    then: `minimal viable configuration succeeds`,
    tag: '@spec',
  })
}

/**
 * Determine if a feature is critical
 */
function isCriticalFeature(propertyName: string): boolean {
  const criticalFeatures = ['tables', 'pages'] // Essential for app to function
  return criticalFeatures.includes(propertyName)
}

/**
 * Convert camelCase/snake_case to human-readable format
 */
function humanize(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .toLowerCase()
    .trim()
    .replace(/^./, (c) => c.toUpperCase())
}
