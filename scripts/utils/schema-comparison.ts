/**
 * Schema comparison utilities to detect implementation status
 */

import type {
  JSONSchema,
  JSONSchemaProperty,
  PropertyStatus,
  PropertyStatusType,
} from '../types/roadmap.ts'

/**
 * Compare current and vision schemas to determine property status
 */
export function compareSchemas(
  currentSchema: JSONSchema,
  visionSchema: JSONSchema
): PropertyStatus[] {
  const statuses: PropertyStatus[] = []
  const visionProperties = visionSchema.properties || {}
  const currentProperties = currentSchema.properties || {}

  for (const [name, visionProp] of Object.entries(visionProperties)) {
    const currentProp = currentProperties[name]
    const status = determinePropertyStatus(currentProp, visionProp)
    const completion = calculateCompletionPercent(currentProp, visionProp)
    const missing = identifyMissingFeatures(currentProp, visionProp)
    const complexity = calculateComplexity(visionProp)
    const deps = extractDependencies(name, visionProp, visionProperties)

    statuses.push({
      name,
      status,
      currentVersion: currentProp,
      visionVersion: visionProp,
      completionPercent: completion,
      missingFeatures: missing,
      complexity,
      dependencies: deps,
    })
  }

  return statuses
}

/**
 * Extract service/event or service/action combinations from automation definitions
 */
function extractServiceEventCombinations(
  currentDef: JSONSchemaProperty | undefined,
  visionDef: JSONSchemaProperty,
  eventOrActionKey: 'event' | 'action'
): PropertyStatus[] {
  const results: PropertyStatus[] = []
  const defType = eventOrActionKey === 'event' ? 'automation_trigger' : 'automation_action'

  function extractFromVariants(variants: JSONSchemaProperty[], _parentTitle?: string) {
    for (const variant of variants) {
      // Check if this variant has nested anyOf/oneOf
      if (variant.anyOf || variant.oneOf) {
        const nestedVariants = variant.anyOf || variant.oneOf || []
        extractFromVariants(nestedVariants, variant.title)
      } else if (variant.properties) {
        // Extract service and event/action const values
        const serviceConst = variant.properties.service?.const
        const eventActionConst = variant.properties[eventOrActionKey]?.const

        if (serviceConst && eventActionConst) {
          const service = String(serviceConst)
          const eventAction = String(eventActionConst)
          const name = `${defType}.${service}.${eventAction}`

          const status = determinePropertyStatus(undefined, variant)
          const completion = calculateCompletionPercent(undefined, variant)
          const missing = identifyMissingFeatures(undefined, variant)
          const complexity = calculateComplexity(variant)

          results.push({
            name,
            status,
            currentVersion: undefined,
            visionVersion: variant,
            completionPercent: completion,
            missingFeatures: missing,
            complexity,
            dependencies: [],
          })
        }
      }
    }
  }

  // Start extraction from top-level anyOf/oneOf
  const variants = visionDef.anyOf || visionDef.oneOf || []
  extractFromVariants(variants)

  return results
}

/**
 * Recursively extract all properties from schema (including nested ones and definitions)
 */
export function extractAllPropertiesRecursively(
  currentSchema: JSONSchema,
  visionSchema: JSONSchema
): PropertyStatus[] {
  const allProperties: PropertyStatus[] = []

  function traverse(
    currentProp: JSONSchemaProperty | undefined,
    visionProp: JSONSchemaProperty,
    path: string[],
    _parentPath: string = ''
  ) {
    const name = path[path.length - 1] || ''
    const fullPath = path.join('.')
    const status = determinePropertyStatus(currentProp, visionProp)
    const completion = calculateCompletionPercent(currentProp, visionProp)
    const missing = identifyMissingFeatures(currentProp, visionProp)
    const complexity = calculateComplexity(visionProp)
    const deps = extractDependencies(name, visionProp, {})

    // Add this property
    allProperties.push({
      name: fullPath,
      status,
      currentVersion: currentProp,
      visionVersion: visionProp,
      completionPercent: completion,
      missingFeatures: missing,
      complexity,
      dependencies: deps,
    })

    // Recurse into object properties
    if (visionProp.properties) {
      for (const [propName, propSchema] of Object.entries(visionProp.properties)) {
        const currentNested = currentProp?.properties?.[propName]
        traverse(currentNested, propSchema, [...path, propName], fullPath)
      }
    }

    // Recurse into array items
    if (visionProp.items) {
      const items = Array.isArray(visionProp.items) ? visionProp.items : [visionProp.items]
      for (const item of items) {
        // Handle object items with properties
        if (item.properties) {
          const currentItems = currentProp?.items
          const currentItem = Array.isArray(currentItems) ? currentItems[0] : currentItems
          for (const [propName, propSchema] of Object.entries(item.properties)) {
            const currentNested =
              currentItem && typeof currentItem === 'object' && 'properties' in currentItem
                ? currentItem.properties?.[propName]
                : undefined
            traverse(currentNested, propSchema, [...path, propName], fullPath)
          }
        }

        // Handle variants (anyOf/oneOf)
        const variants = item.anyOf || item.oneOf
        if (variants) {
          for (const variant of variants) {
            if (variant.title && variant.properties) {
              const variantName = kebabCase(variant.title)
              const currentItems = currentProp?.items
              const currentItem = Array.isArray(currentItems) ? currentItems[0] : currentItems
              const currentVariant =
                currentItem &&
                typeof currentItem === 'object' &&
                'anyOf' in currentItem &&
                Array.isArray(currentItem.anyOf)
                  ? currentItem.anyOf.find(
                      (v: JSONSchemaProperty) => kebabCase(v.title || '') === variantName
                    )
                  : undefined

              for (const [propName, propSchema] of Object.entries(variant.properties)) {
                const currentNested =
                  currentVariant &&
                  typeof currentVariant === 'object' &&
                  'properties' in currentVariant
                    ? currentVariant.properties?.[propName]
                    : undefined
                traverse(currentNested, propSchema, [...path, variantName, propName], fullPath)
              }
            }
          }
        }
      }
    }

    // Recurse into anyOf/oneOf at the property level
    const propVariants = visionProp.anyOf || visionProp.oneOf
    if (propVariants) {
      for (const variant of propVariants) {
        if (variant.title && variant.properties) {
          const variantName = kebabCase(variant.title)
          const currentVariants =
            currentProp && ('anyOf' in currentProp || 'oneOf' in currentProp)
              ? currentProp.anyOf || currentProp.oneOf || []
              : []
          const currentVariant = currentVariants.find(
            (v: JSONSchemaProperty) => kebabCase(v.title || '') === variantName
          )

          for (const [propName, propSchema] of Object.entries(variant.properties)) {
            const currentNested =
              currentVariant && typeof currentVariant === 'object' && 'properties' in currentVariant
                ? currentVariant.properties?.[propName]
                : undefined
            traverse(currentNested, propSchema, [...path, variantName, propName], fullPath)
          }
        }
      }
    }
  }

  // Start traversal from top-level properties
  const visionProperties = visionSchema.properties || {}
  const currentProperties = currentSchema.properties || {}

  for (const [name, visionProp] of Object.entries(visionProperties)) {
    const currentProp = currentProperties[name]
    traverse(currentProp, visionProp, [name])
  }

  // Also traverse definitions (like automation_trigger, automation_action)
  const visionDefinitions = visionSchema.definitions || {}
  const currentDefinitions = currentSchema.definitions || {}

  // Handle automation_trigger specially - extract service/event combinations
  const triggerDef = visionDefinitions['automation_trigger']
  if (triggerDef) {
    const currentTriggerDef = currentDefinitions['automation_trigger']
    const triggers = extractServiceEventCombinations(currentTriggerDef, triggerDef, 'event')
    for (const trigger of triggers) {
      allProperties.push(trigger)
    }
  }

  // Handle automation_action specially - extract service/action combinations
  const actionDef = visionDefinitions['automation_action']
  if (actionDef) {
    const currentActionDef = currentDefinitions['automation_action']
    const actions = extractServiceEventCombinations(currentActionDef, actionDef, 'action')
    for (const action of actions) {
      allProperties.push(action)
    }
  }

  // Handle other definitions normally
  const otherDefinitions = ['filter_condition', 'json_schema']

  for (const defName of otherDefinitions) {
    const visionDef = visionDefinitions[defName]
    if (visionDef) {
      const currentDef = currentDefinitions[defName]
      traverse(currentDef, visionDef, [defName])
    }
  }

  return allProperties
}

/**
 * Convert string to kebab-case
 */
function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Determine if a property is complete, partial, or missing
 */
function determinePropertyStatus(
  current: JSONSchemaProperty | undefined,
  vision: JSONSchemaProperty
): PropertyStatusType {
  if (!current) {
    return 'missing'
  }

  // Check if current matches vision structure
  const hasMatchingType = current.type === vision.type
  const hasMatchingRequired =
    !vision.required || JSON.stringify(current.required) === JSON.stringify(vision.required)

  if (hasMatchingType && hasMatchingRequired) {
    // Deep check for nested properties
    if (vision.properties) {
      const visionProps = Object.keys(vision.properties)
      const currentProps = Object.keys(current.properties || {})

      if (visionProps.every((p) => currentProps.includes(p))) {
        return 'complete'
      }
      if (visionProps.some((p) => currentProps.includes(p))) {
        return 'partial'
      }
      return 'missing'
    }

    // Deep check for array items
    if (vision.items && current.items) {
      if (JSON.stringify(current.items) === JSON.stringify(vision.items)) {
        return 'complete'
      }
      return 'partial'
    }

    return 'complete'
  }

  return current.type ? 'partial' : 'missing'
}

/**
 * Calculate completion percentage (0-100)
 */
function calculateCompletionPercent(
  current: JSONSchemaProperty | undefined,
  vision: JSONSchemaProperty
): number {
  if (!current) {
    return 0
  }

  let score = 0
  let total = 0

  // Type match
  total++
  if (current.type === vision.type) {
    score++
  }

  // Validation rules
  const validationKeys = [
    'pattern',
    'minLength',
    'maxLength',
    'minimum',
    'maximum',
    'minItems',
    'maxItems',
    'enum',
  ]
  for (const key of validationKeys) {
    if (vision[key] !== undefined) {
      total++
      if (current[key] === vision[key]) {
        score++
      }
    }
  }

  // Nested properties
  if (vision.properties) {
    const visionProps = Object.keys(vision.properties)
    const currentProps = Object.keys(current.properties || {})
    total += visionProps.length
    score += visionProps.filter((p) => currentProps.includes(p)).length
  }

  // anyOf/oneOf/allOf variants
  if (vision.anyOf) {
    total += vision.anyOf.length
    if (current.anyOf) {
      score += Math.min(current.anyOf.length, vision.anyOf.length)
    }
  }

  if (total === 0) {
    return 100 // Simple property with no special requirements
  }

  return Math.round((score / total) * 100)
}

/**
 * Identify specific missing features
 */
function identifyMissingFeatures(
  current: JSONSchemaProperty | undefined,
  vision: JSONSchemaProperty
): string[] {
  const missing: string[] = []

  if (!current) {
    return ['All functionality']
  }

  // Check validation rules
  if (vision.pattern && !current.pattern) {
    missing.push('Pattern validation')
  }
  if (vision.minLength && !current.minLength) {
    missing.push('Minimum length validation')
  }
  if (vision.maxLength && !current.maxLength) {
    missing.push('Maximum length validation')
  }
  if (vision.enum && !current.enum) {
    missing.push('Enum values')
  }

  // Check nested properties
  if (vision.properties) {
    const visionProps = Object.keys(vision.properties)
    const currentProps = Object.keys(current.properties || {})
    const missingProps = visionProps.filter((p) => !currentProps.includes(p))

    for (const prop of missingProps) {
      const propDef = vision.properties![prop]
      missing.push(
        `Property: ${prop} (${propDef.title || propDef.description || 'no description'})`
      )
    }
  }

  // Check array items
  if (vision.items && !current.items) {
    missing.push('Array item schema')
  }

  // Check variants
  if (vision.anyOf && !current.anyOf) {
    missing.push(`${vision.anyOf.length} type variants (anyOf)`)
  }
  if (vision.oneOf && !current.oneOf) {
    missing.push(`${vision.oneOf.length} type variants (oneOf)`)
  }

  return missing
}

/**
 * Calculate complexity score (0-1000+)
 */
export function calculateComplexity(schema: JSONSchemaProperty): number {
  let complexity = 0

  // Base complexity by type
  if (schema.type === 'object') {
    complexity += 10
  }
  if (schema.type === 'array') {
    complexity += 5
  }

  // Nested properties
  if (schema.properties) {
    complexity += Object.keys(schema.properties).length * 10
    // Recursively add nested complexity
    for (const prop of Object.values(schema.properties)) {
      complexity += calculateComplexity(prop) * 0.5
    }
  }

  // Validation rules
  const validationRules = [
    'pattern',
    'minLength',
    'maxLength',
    'minimum',
    'maximum',
    'minItems',
    'maxItems',
    'enum',
  ]
  complexity += validationRules.filter((key) => schema[key] !== undefined).length * 5

  // Variants (anyOf, oneOf, allOf)
  if (schema.anyOf) {
    complexity += schema.anyOf.length * 15
    for (const variant of schema.anyOf) {
      complexity += calculateComplexity(variant) * 0.3
    }
  }
  if (schema.oneOf) {
    complexity += schema.oneOf.length * 15
    for (const variant of schema.oneOf) {
      complexity += calculateComplexity(variant) * 0.3
    }
  }

  // References
  if (schema.$ref) {
    complexity += 10
  }

  return Math.round(complexity)
}

/**
 * Extract dependencies from schema references and logical relationships
 */
function extractDependencies(
  propertyName: string,
  schema: JSONSchemaProperty,
  _allProperties: Record<string, JSONSchemaProperty>
): string[] {
  const deps: string[] = []

  // Check for table references in pages
  if (propertyName === 'pages' && schema.items) {
    const items = Array.isArray(schema.items) ? schema.items : [schema.items]
    for (const item of items) {
      if (item.anyOf || item.oneOf) {
        const variants = item.anyOf || item.oneOf || []
        for (const variant of variants) {
          if (variant.properties?.table) {
            deps.push('tables')
          }
        }
      }
    }
  }

  // Check for automation table references
  if (propertyName === 'automations') {
    deps.push('tables') // Automations typically reference tables
  }

  return [...new Set(deps)] // Remove duplicates
}

/**
 * Calculate overall statistics for the roadmap
 */
export function calculateStats(
  statuses: PropertyStatus[],
  currentVersion: string,
  targetVersion: string
) {
  const implemented = statuses.filter((s) => s.status === 'complete').length
  const partial = statuses.filter((s) => s.status === 'partial').length
  const missing = statuses.filter((s) => s.status === 'missing').length
  const total = statuses.length

  const overallCompletion = Math.round(
    statuses.reduce((sum, s) => sum + s.completionPercent, 0) / total
  )

  return {
    totalProperties: total,
    implementedProperties: implemented,
    partialProperties: partial,
    missingProperties: missing,
    overallCompletion,
    currentVersion,
    targetVersion,
  }
}
