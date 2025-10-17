#!/usr/bin/env bun

/**
 * Roadmap Generation Script
 *
 * Analyzes schema differences between current and vision schemas,
 * generates comprehensive roadmap documentation with:
 * - Main ROADMAP.md with progress tracking
 * - Individual property files with Effect Schema blueprints
 * - E2E user stories in Given-When-Then format
 *
 * Each schema property gets its own roadmap file, allowing flexible
 * development order without phase constraints.
 *
 * Usage: bun run scripts/generate-roadmap.ts
 */

import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import { dirname, join } from 'node:path'
import {
  generatePropertyDetailMarkdown,
  generateSuccessCriteria,
} from './templates/property-detail-template.ts'
import { generateRoadmapMarkdown } from './templates/roadmap-template.ts'
import { generateEffectSchema } from './utils/effect-schema-generator.ts'
import { getImplementationStatus } from './utils/implementation-checker.ts'
import {
  calculateStats,
  compareSchemas,
  extractAllPropertiesRecursively,
} from './utils/schema-comparison.ts'
import { extractUserStoriesFromSchema } from './utils/schema-user-stories-extractor.ts'
import { generateUserStories } from './utils/user-story-generator.ts'
import type { JSONSchema, PropertyDocumentation, RoadmapData } from './types/roadmap.ts'

// Paths
const CURRENT_SCHEMA_PATH = 'schemas/0.0.1/app.schema.json'
const VISION_SCHEMA_PATH = 'docs/specifications/specs.schema.json'
const ROADMAP_OUTPUT_PATH = 'ROADMAP.md'
const PROPERTY_DETAILS_DIR = 'docs/specifications/roadmap'

/**
 * Recursively walk directory and find all .md files
 */
function walkDirectory(dir: string, fileList: string[] = []): string[] {
  if (!existsSync(dir)) {
    return fileList
  }

  const files = readdirSync(dir)

  for (const file of files) {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      walkDirectory(filePath, fileList)
    } else if (file.endsWith('.md')) {
      fileList.push(filePath)
    }
  }

  return fileList
}

/**
 * Check if file content has changed
 */
async function hasContentChanged(filePath: string, newContent: string): Promise<boolean> {
  if (!existsSync(filePath)) {
    return true // File doesn't exist, so content has "changed"
  }

  const file = Bun.file(filePath)
  const existingContent = await file.text()

  return existingContent !== newContent
}

/**
 * Write file only if content has changed
 */
async function writeFileIfChanged(
  filePath: string,
  content: string
): Promise<'created' | 'updated' | 'unchanged'> {
  const changed = await hasContentChanged(filePath, content)

  if (!changed) {
    return 'unchanged'
  }

  const existed = existsSync(filePath)
  await Bun.write(filePath, content)

  return existed ? 'updated' : 'created'
}

/**
 * Main execution
 */
async function main() {
  console.log('📊 Analyzing schemas...')
  console.log(`   Current: ${CURRENT_SCHEMA_PATH}`)
  console.log(`   Vision:  ${VISION_SCHEMA_PATH}`)
  console.log()

  // Load schemas
  const currentSchema = await loadSchema(CURRENT_SCHEMA_PATH)
  const visionSchema = await loadSchema(VISION_SCHEMA_PATH)

  // Compare schemas (top-level for main ROADMAP.md)
  const topLevelProperties = compareSchemas(currentSchema, visionSchema)

  // Extract ALL properties recursively (including nested ones)
  const allProperties = extractAllPropertiesRecursively(currentSchema, visionSchema)

  // Calculate statistics (use top-level for main overview)
  const stats = calculateStats(topLevelProperties, 'v0.0.1', 'v1.0.0')

  console.log(
    `✅ Found ${stats.implementedProperties} implemented properties (${Math.round((stats.implementedProperties / stats.totalProperties) * 100)}%)`
  )
  console.log(
    `⏳ Found ${stats.missingProperties} missing properties (${Math.round((stats.missingProperties / stats.totalProperties) * 100)}%)`
  )
  console.log(
    `🚧 Found ${stats.partialProperties} partial properties (${Math.round((stats.partialProperties / stats.totalProperties) * 100)}%)`
  )
  console.log()

  // Check implementation status for ALL properties (including nested)
  console.log(`🔍 Checking implementation status...`)
  for (const property of allProperties) {
    property.implementationStatus = getImplementationStatus(property.name)
  }
  console.log()

  // List properties by status
  console.log(`📋 Generating ROADMAP.md...`)
  for (const prop of topLevelProperties) {
    let statusIcon: string
    if (prop.status === 'complete') {
      statusIcon = '✅'
    } else if (prop.status === 'partial') {
      statusIcon = '🚧'
    } else {
      statusIcon = '⏳'
    }
    console.log(`   ${statusIcon} ${prop.name} (${prop.completionPercent}%)`)
  }
  console.log()

  console.log(`📊 Total properties (including nested): ${allProperties.length}`)
  console.log()

  // Generate main ROADMAP.md
  const roadmapData: RoadmapData = {
    stats,
    properties: topLevelProperties,
    allProperties,
    timestamp: new Date().toISOString().split('T')[0]!,
  }

  const roadmapMarkdown = generateRoadmapMarkdown(roadmapData)
  await Bun.write(ROADMAP_OUTPUT_PATH, roadmapMarkdown)
  console.log(`✅ Created ${ROADMAP_OUTPUT_PATH}`)
  console.log()

  // Generate property detail files (including nested ones)
  console.log(`📁 Generating property detail files (recursive)...`)

  // Ensure roadmap directory exists
  if (!existsSync(PROPERTY_DETAILS_DIR)) {
    mkdirSync(PROPERTY_DETAILS_DIR, { recursive: true })
  }

  // Track expected files for cleanup
  const expectedFiles = new Set<string>()

  for (const property of allProperties) {
    // Convert dot-notation path to file path (e.g., "tables.fields" → "tables/fields.md")
    const filePath = propertyPathToFilePath(property.name, PROPERTY_DETAILS_DIR)
    expectedFiles.add(filePath)

    // Ensure parent directory exists
    const dirPath = dirname(filePath)
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true })
    }

    // Generate Effect Schema blueprint
    const effectSchema = generateEffectSchema(
      property.name,
      property.visionVersion,
      visionSchema.definitions
    )

    // Extract user stories from schema x-user-stories key
    const schemaUserStories = extractUserStoriesFromSchema(property.name, visionSchema)

    // Use schema user stories if available, otherwise generate them
    const userStories =
      schemaUserStories.spec.length > 0
        ? schemaUserStories
        : generateUserStories(property.name, property.visionVersion)

    // Create property documentation
    const propertyDoc: PropertyDocumentation = {
      property,
      effectSchema,
      userStories,
      successCriteria: [],
    }

    // Generate success criteria
    propertyDoc.successCriteria = generateSuccessCriteria(propertyDoc)

    // Generate markdown
    const propertyMarkdown = generatePropertyDetailMarkdown(propertyDoc)

    // Write file only if content has changed
    const result = await writeFileIfChanged(filePath, propertyMarkdown)

    // Status icon for logging
    let statusIcon: string
    if (property.status === 'complete') {
      statusIcon = '✅'
    } else if (property.status === 'partial') {
      statusIcon = '🚧'
    } else {
      statusIcon = '⏳'
    }

    // Action icon for logging
    let actionIcon: string
    if (result === 'created') {
      actionIcon = '➕'
    } else if (result === 'updated') {
      actionIcon = '✏️'
    } else {
      actionIcon = '⏭️'
    }

    console.log(`   ${statusIcon} ${actionIcon} ${filePath}`)
  }

  console.log()

  // Cleanup: Remove obsolete files that are no longer in the schema
  console.log(`🧹 Cleaning up obsolete files...`)
  const existingFiles = walkDirectory(PROPERTY_DETAILS_DIR)
  const filesToRemove = existingFiles.filter((file) => !expectedFiles.has(file))

  if (filesToRemove.length > 0) {
    for (const file of filesToRemove) {
      unlinkSync(file)
      console.log(`   🗑️  Removed ${file}`)
    }
    console.log()
    console.log(`✅ Removed ${filesToRemove.length} obsolete file(s)`)
  } else {
    console.log(`   ✅ No obsolete files found`)
  }

  console.log()
  console.log(`✅ Roadmap generation complete!`)
  console.log()

  // Display progress bar
  const progressBar = generateProgressBar(stats.overallCompletion)
  console.log(`Overall Progress: ${progressBar}`)
  console.log()

  // Summary
  console.log(`📈 Summary:`)
  console.log(`   - Total Properties: ${stats.totalProperties}`)
  console.log(`   - Implemented: ${stats.implementedProperties}`)
  console.log(`   - Missing: ${stats.missingProperties}`)
  console.log(`   - Completion: ${stats.overallCompletion}%`)
  console.log()

  // Next steps
  const nextProperty = topLevelProperties.find((p) => p.status === 'missing')
  if (nextProperty) {
    const fileName = nextProperty.name
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')
    console.log(`📋 Next Steps:`)
    console.log(`   Work on: ${nextProperty.name}`)
    console.log(`   Read: docs/specifications/roadmap/${fileName}.md`)
    console.log(`   Complexity: ${nextProperty.complexity} points`)
  }
}

/**
 * Convert property path to file path
 * Examples:
 *   "tables" → "docs/specifications/roadmap/tables.md"
 *   "tables.fields" → "docs/specifications/roadmap/tables/fields.md"
 *   "tables.text-field.value" → "docs/specifications/roadmap/tables/text-field/value.md"
 *   "automation_trigger" → "docs/specifications/roadmap/definitions/automation_trigger.md"
 *   "automation_trigger.http" → "docs/specifications/roadmap/definitions/automation_trigger/http.md"
 */
function propertyPathToFilePath(propertyPath: string, baseDir: string): string {
  const parts = propertyPath.split('.')
  const fileName = kebabCase(parts[parts.length - 1]!)
  const dirParts = parts.slice(0, -1).map(kebabCase)

  // Check if this is a definition (starts with one of the definition names)
  const definitionNames = [
    'automation_trigger',
    'automation_action',
    'filter_condition',
    'json_schema',
  ]

  const isDefinition = definitionNames.some((defName) => propertyPath.startsWith(defName))

  if (isDefinition) {
    // Put definitions in a separate folder
    const fullPath = ['definitions', ...dirParts, `${fileName}.md`]
    return join(baseDir, ...fullPath)
  }

  const fullPath = [...dirParts, `${fileName}.md`]
  return join(baseDir, ...fullPath)
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
 * Load JSON Schema from file
 */
async function loadSchema(path: string): Promise<JSONSchema> {
  const file = Bun.file(path)

  if (!(await file.exists())) {
    throw new Error(`Schema file not found: ${path}`)
  }

  const content = await file.json()

  // Validate basic structure
  if (!content.properties) {
    throw new Error(`Invalid schema: missing 'properties' field in ${path}`)
  }

  return content as JSONSchema
}

/**
 * Generate progress bar for console output
 */
function generateProgressBar(percent: number, width: number = 30): string {
  const filled = Math.round((percent / 100) * width)
  const empty = width - filled
  return `${'█'.repeat(filled)}${'░'.repeat(empty)} ${percent}%`
}

// Run main function
main().catch((error) => {
  console.error('❌ Error generating roadmap:', error)
  process.exit(1)
})
