/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * TypeScript types for roadmap generation
 */

/**
 * JSON Schema property definition
 */
export interface JSONSchemaProperty {
  type?: string | string[]
  description?: string
  title?: string
  examples?: unknown[]
  default?: unknown
  pattern?: string
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  exclusiveMinimum?: number | boolean
  exclusiveMaximum?: number | boolean
  minItems?: number
  maxItems?: number
  enum?: unknown[]
  const?: unknown
  properties?: Record<string, JSONSchemaProperty>
  items?: JSONSchemaProperty | JSONSchemaProperty[]
  required?: string[]
  additionalProperties?: boolean | JSONSchemaProperty
  anyOf?: JSONSchemaProperty[]
  oneOf?: JSONSchemaProperty[]
  allOf?: JSONSchemaProperty[]
  $ref?: string
  [key: string]: unknown
}

/**
 * Complete JSON Schema document
 */
export interface JSONSchema {
  $schema?: string
  title?: string
  description?: string
  version?: string
  type: string
  properties: Record<string, JSONSchemaProperty>
  required?: string[]
  definitions?: Record<string, JSONSchemaProperty>
  [key: string]: unknown
}

/**
 * Property implementation status
 */
export type PropertyStatusType = 'complete' | 'partial' | 'missing'

/**
 * Implementation status for Definition of Done checklist
 */
export interface ImplementationStatus {
  // Schema implementation
  schemaFileExists: boolean
  schemaExported: boolean

  // Test implementation
  testFileExists: boolean
  expectedTestCount: number
  implementedTestCount: number

  // Code quality (proxy: check if files exist)
  hasUnitTests: boolean
}

/**
 * Detailed status of a single schema property
 */
export interface PropertyStatus {
  name: string
  status: PropertyStatusType
  currentVersion?: JSONSchemaProperty
  visionVersion: JSONSchemaProperty
  completionPercent: number
  missingFeatures: string[]
  complexity: number
  dependencies: string[]
  implementationStatus?: ImplementationStatus
}

/**
 * Phase status indicator
 */
export type PhaseStatus = '✅ DONE' | '🚧 IN PROGRESS' | '⏳ NOT STARTED'

/**
 * Development phase grouping properties
 */
export interface Phase {
  number: number
  version: string
  status: PhaseStatus
  name: string
  properties: PropertyStatus[]
  completionPercent: number
  durationEstimate: string
  dependencies: string[]
}

/**
 * E2E test scenario in Given-When-Then format
 */
export interface UserStory {
  given: string
  when: string
  then: string
  tag: '@spec' | '@regression' | '@critical'
}

/**
 * Collection of user stories for a property
 */
export interface PropertyUserStories {
  propertyName: string
  spec: UserStory[]
  regression: UserStory[]
  critical: UserStory[]
  dataTestIds: string[]
}

/**
 * Effect Schema code snippet
 */
export interface EffectSchemaBlueprint {
  propertyName: string
  sanitizedName: string
  fileName: string
  code: string
  imports: string[]
  exports: string[]
}

/**
 * Complete phase documentation
 */
export interface PhaseDocumentation {
  phase: Phase
  effectSchemas: EffectSchemaBlueprint[]
  userStories: PropertyUserStories[]
  successCriteria: string[]
}

/**
 * User story with implementation status
 */
export interface TrackedUserStory {
  propertyPath: string
  story: string
  index: number
  implemented: boolean
  matchedTest?: {
    filePath: string
    testName: string
    tag: string
    confidence: number
  }
}

/**
 * Overall roadmap statistics
 */
export interface RoadmapStats {
  totalProperties: number
  implementedProperties: number
  partialProperties: number
  missingProperties: number
  overallCompletion: number
  currentVersion: string
  targetVersion: string
  totalUserStories: number
  implementedUserStories: number
  testCoverage: number // Percentage of user stories with tests
}

/**
 * Complete roadmap data for template rendering
 */
export interface RoadmapData {
  stats: RoadmapStats
  properties: PropertyStatus[]
  allProperties: PropertyStatus[]
  userStories: TrackedUserStory[]
  timestamp: string
}

/**
 * Property documentation (individual roadmap file)
 */
export interface PropertyDocumentation {
  property: PropertyStatus
  effectSchema: EffectSchemaBlueprint
  userStories: PropertyUserStories
  successCriteria: string[]
  testStatus?: {
    testFileExists: boolean
    totalTests: number
    passingTests: number
    fixmeTests: number
    coveragePercent: number
  }
  schemaStatus?: {
    isImplemented: boolean
    schemaFilePath?: string
  }
}
