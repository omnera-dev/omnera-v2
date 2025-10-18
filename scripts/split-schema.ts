#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Schema Splitting Tool
 *
 * Splits the monolithic specs.schema.json into modular files using JSON Schema $ref.
 * Preserves the Triple-Documentation Pattern (x-business-rules, x-user-stories) in all files.
 *
 * Usage:
 *   bun run scripts/split-schema.ts --help
 *   bun run scripts/split-schema.ts --prepare
 *   bun run scripts/split-schema.ts --extract-common
 *   bun run scripts/split-schema.ts --split tables
 *   bun run scripts/split-schema.ts --split-all
 *   bun run scripts/split-schema.ts --dry-run
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'

// ========================================
// Types
// ========================================

interface JSONSchema {
  $schema?: string
  title?: string
  version?: string
  type?: string
  description?: string
  examples?: unknown[]
  'x-business-rules'?: string[]
  'x-user-stories'?: Array<{
    story: string
    acceptance_criteria: string[]
  }>
  properties?: Record<string, JSONSchema>
  definitions?: Record<string, JSONSchema>
  items?: JSONSchema
  oneOf?: JSONSchema[]
  anyOf?: JSONSchema[]
  allOf?: JSONSchema[]
  $ref?: string
  [key: string]: unknown
}

interface SplitConfig {
  feature: string
  sourceProperty: string
  targetDir: string
  subSplits?: Array<{
    property: string
    targetSubDir: string
  }>
}

// ========================================
// Constants
// ========================================

const SCHEMA_PATH = join(__dirname, '..', 'docs', 'specifications', 'specs.schema.json')
const BACKUP_PATH = join(__dirname, '..', 'docs', 'specifications', 'specs.schema.json.backup')
const SCHEMAS_DIR = join(__dirname, '..', 'docs', 'specifications', 'schemas')

const COMMON_DEFINITIONS = ['id', 'name', 'path']

const SPLIT_CONFIGS: SplitConfig[] = [
  {
    feature: 'tables',
    sourceProperty: 'tables',
    targetDir: 'tables',
    subSplits: [
      {
        property: 'fields',
        targetSubDir: 'field-types',
      },
    ],
  },
  {
    feature: 'automations',
    sourceProperty: 'automations',
    targetDir: 'automations',
    subSplits: [
      {
        property: 'trigger',
        targetSubDir: 'triggers',
      },
      {
        property: 'actions',
        targetSubDir: 'actions',
      },
    ],
  },
  {
    feature: 'pages',
    sourceProperty: 'pages',
    targetDir: 'pages',
    subSplits: [
      {
        property: 'type',
        targetSubDir: 'page-types',
      },
    ],
  },
  {
    feature: 'connections',
    sourceProperty: 'connections',
    targetDir: 'connections',
  },
]

// ========================================
// Utilities
// ========================================

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function ensureDir(dirPath: string) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
    log(`  Created directory: ${dirPath}`, colors.gray)
  }
}

function writeSchemaFile(filePath: string, schema: JSONSchema, description?: string) {
  ensureDir(dirname(filePath))
  writeFileSync(filePath, JSON.stringify(schema, null, 2) + '\n', 'utf-8')
  log(`  ✓ Written: ${filePath}${description ? ` (${description})` : ''}`, colors.green)
}

function createBackup() {
  if (!existsSync(BACKUP_PATH)) {
    const content = readFileSync(SCHEMA_PATH, 'utf-8')
    writeFileSync(BACKUP_PATH, content, 'utf-8')
    log(`✓ Created backup: ${BACKUP_PATH}`, colors.green)
  } else {
    log(`Backup already exists: ${BACKUP_PATH}`, colors.gray)
  }
}

// ========================================
// Schema Manipulation
// ========================================

function extractCommonDefinitions(schema: JSONSchema): {
  common: JSONSchema
  remaining: JSONSchema
} {
  const commonDefs: Record<string, JSONSchema> = {}
  const remainingDefs: Record<string, JSONSchema> = {}

  if (schema.definitions) {
    for (const [key, value] of Object.entries(schema.definitions)) {
      if (COMMON_DEFINITIONS.includes(key)) {
        commonDefs[key] = value
      } else {
        remainingDefs[key] = value
      }
    }
  }

  const common: JSONSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Common Definitions',
    description: 'Shared type definitions used across all schemas',
    definitions: commonDefs,
  }

  const remaining: JSONSchema = {
    ...schema,
    definitions: Object.keys(remainingDefs).length > 0 ? remainingDefs : undefined,
  }

  return { common, remaining }
}

function updateRefsToCommon(schema: JSONSchema): JSONSchema {
  const updated = { ...schema }

  // Update $ref in definitions (recursively process each definition)
  if (updated.definitions) {
    for (const [key, value] of Object.entries(updated.definitions)) {
      updated.definitions[key] = updateRefsInProperty(value)
    }
  }

  // Update $ref in properties
  if (updated.properties) {
    for (const [key, value] of Object.entries(updated.properties)) {
      updated.properties[key] = updateRefsInProperty(value)
    }
  }

  return updated
}

function updateRefsInProperty(property: JSONSchema): JSONSchema {
  const updated = { ...property }

  if (updated.$ref && COMMON_DEFINITIONS.some((def) => updated.$ref === `#/definitions/${def}`)) {
    const defName = updated.$ref.split('/').pop()
    updated.$ref = `./schemas/common/definitions.schema.json#/definitions/${defName}`
  }

  if (updated.properties) {
    for (const [key, value] of Object.entries(updated.properties)) {
      updated.properties[key] = updateRefsInProperty(value)
    }
  }

  if (updated.items) {
    updated.items = updateRefsInProperty(updated.items)
  }

  if (updated.oneOf) {
    updated.oneOf = updated.oneOf.map(updateRefsInProperty)
  }

  if (updated.anyOf) {
    updated.anyOf = updated.anyOf.map(updateRefsInProperty)
  }

  if (updated.allOf) {
    updated.allOf = updated.allOf.map(updateRefsInProperty)
  }

  return updated
}

function adjustRefsForNesting(schema: JSONSchema): JSONSchema {
  const adjusted = { ...schema }

  // Adjust $ref from root perspective to nested perspective
  // ./schemas/common/... becomes ../common/...
  if (adjusted.$ref && adjusted.$ref.startsWith('./schemas/')) {
    adjusted.$ref = adjusted.$ref.replace('./schemas/', '../')
  }

  if (adjusted.properties) {
    for (const [key, value] of Object.entries(adjusted.properties)) {
      adjusted.properties[key] = adjustRefsForNesting(value)
    }
  }

  if (adjusted.definitions) {
    for (const [key, value] of Object.entries(adjusted.definitions)) {
      adjusted.definitions[key] = adjustRefsForNesting(value)
    }
  }

  if (adjusted.items) {
    adjusted.items = adjustRefsForNesting(adjusted.items)
  }

  if (adjusted.oneOf) {
    adjusted.oneOf = adjusted.oneOf.map(adjustRefsForNesting)
  }

  if (adjusted.anyOf) {
    adjusted.anyOf = adjusted.anyOf.map(adjustRefsForNesting)
  }

  if (adjusted.allOf) {
    adjusted.allOf = adjusted.allOf.map(adjustRefsForNesting)
  }

  return adjusted
}

function splitFeature(
  schema: JSONSchema,
  config: SplitConfig
): { featureSchema: JSONSchema; updatedRoot: JSONSchema } {
  const featureProperty = schema.properties?.[config.sourceProperty]

  if (!featureProperty) {
    throw new Error(`Property '${config.sourceProperty}' not found in schema`)
  }

  // Create feature schema and adjust $refs for nesting
  let featureSchema: JSONSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: `${config.feature.charAt(0).toUpperCase() + config.feature.slice(1)} Schema`,
    ...featureProperty,
  }

  // Adjust $refs to be relative to the nested location
  featureSchema = adjustRefsForNesting(featureSchema)

  // Update root schema to use $ref
  const updatedRoot = { ...schema }
  if (updatedRoot.properties) {
    updatedRoot.properties = {
      ...updatedRoot.properties,
      [config.sourceProperty]: {
        $ref: `./schemas/${config.targetDir}/${config.feature}.schema.json`,
      },
    }
  }

  return { featureSchema, updatedRoot }
}

// ========================================
// Commands
// ========================================

function prepare() {
  log('\n📁 Preparing directory structure...', colors.cyan)

  ensureDir(SCHEMAS_DIR)
  ensureDir(join(SCHEMAS_DIR, 'common'))

  for (const config of SPLIT_CONFIGS) {
    ensureDir(join(SCHEMAS_DIR, config.targetDir))
    if (config.subSplits) {
      for (const subSplit of config.subSplits) {
        ensureDir(join(SCHEMAS_DIR, config.targetDir, subSplit.targetSubDir))
      }
    }
  }

  log('\n✅ Directory structure created!', colors.green)
}

function extractCommon() {
  log('\n🔧 Extracting common definitions...', colors.cyan)

  createBackup()

  const schemaContent = readFileSync(SCHEMA_PATH, 'utf-8')
  const schema: JSONSchema = JSON.parse(schemaContent)

  const { common, remaining } = extractCommonDefinitions(schema)

  // Write common definitions
  const commonPath = join(SCHEMAS_DIR, 'common', 'definitions.schema.json')
  writeSchemaFile(commonPath, common, 'Common definitions (id, name, path)')

  // Update remaining schema to reference common definitions
  const updated = updateRefsToCommon(remaining)
  writeSchemaFile(SCHEMA_PATH, updated, 'Updated root schema with $ref to common')

  log('\n✅ Common definitions extracted!', colors.green)
  log(`\n📊 Summary:`, colors.cyan)
  log(`  Common definitions: ${Object.keys(common.definitions || {}).length}`, colors.gray)
  log(`  Remaining definitions: ${Object.keys(updated.definitions || {}).length}`, colors.gray)
}

function splitSingle(feature: string) {
  log(`\n🔧 Splitting '${feature}' schema...`, colors.cyan)

  const config = SPLIT_CONFIGS.find((c) => c.feature === feature)
  if (!config) {
    log(`❌ Unknown feature: ${feature}`, colors.red)
    log(`Available features: ${SPLIT_CONFIGS.map((c) => c.feature).join(', ')}`, colors.gray)
    process.exit(1)
  }

  const schemaContent = readFileSync(SCHEMA_PATH, 'utf-8')
  const schema: JSONSchema = JSON.parse(schemaContent)

  const { featureSchema, updatedRoot } = splitFeature(schema, config)

  // Write feature schema
  const featurePath = join(SCHEMAS_DIR, config.targetDir, `${config.feature}.schema.json`)
  writeSchemaFile(featurePath, featureSchema, `${config.feature} schema`)

  // Update root schema
  writeSchemaFile(SCHEMA_PATH, updatedRoot, 'Updated root with $ref')

  log(`\n✅ '${feature}' schema split successfully!`, colors.green)
}

function splitAll() {
  log('\n🔧 Splitting all schemas...', colors.cyan)

  createBackup()

  let schema: JSONSchema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf-8'))

  // First extract common definitions
  log('\nStep 1: Extracting common definitions...', colors.blue)
  const { common, remaining } = extractCommonDefinitions(schema)
  const commonPath = join(SCHEMAS_DIR, 'common', 'definitions.schema.json')
  writeSchemaFile(commonPath, common)
  schema = updateRefsToCommon(remaining)

  // Then split each feature
  for (const config of SPLIT_CONFIGS) {
    log(
      `\nStep 2.${SPLIT_CONFIGS.indexOf(config) + 1}: Splitting ${config.feature}...`,
      colors.blue
    )
    const { featureSchema, updatedRoot } = splitFeature(schema, config)
    const featurePath = join(SCHEMAS_DIR, config.targetDir, `${config.feature}.schema.json`)
    writeSchemaFile(featurePath, featureSchema)
    schema = updatedRoot
  }

  // Write final root schema
  writeSchemaFile(SCHEMA_PATH, schema, 'Final root schema with all $ref')

  log('\n✅ All schemas split successfully!', colors.green)
  log('\n📊 Summary:', colors.cyan)
  log(`  Features split: ${SPLIT_CONFIGS.length}`, colors.gray)
  log(`  Common definitions: ${Object.keys(common.definitions || {}).length}`, colors.gray)
  log(`  Root properties: ${Object.keys(schema.properties || {}).length}`, colors.gray)
}

function showHelp() {
  console.log(`
${colors.cyan}Schema Splitting Tool${colors.reset}

${colors.yellow}Usage:${colors.reset}
  bun run scripts/split-schema.ts [command]

${colors.yellow}Commands:${colors.reset}
  --help              Show this help message
  --prepare           Create directory structure for split schemas
  --extract-common    Extract common definitions (id, name, path)
  --split <feature>   Split a specific feature (tables, automations, pages, connections)
  --split-all         Split all features in one go

${colors.yellow}Examples:${colors.reset}
  bun run scripts/split-schema.ts --prepare
  bun run scripts/split-schema.ts --extract-common
  bun run scripts/split-schema.ts --split tables
  bun run scripts/split-schema.ts --split-all

${colors.yellow}Available Features:${colors.reset}
  ${SPLIT_CONFIGS.map((c) => c.feature).join(', ')}

${colors.yellow}Notes:${colors.reset}
  - A backup will be created automatically at specs.schema.json.backup
  - Triple-Documentation Pattern (x-business-rules, x-user-stories) is preserved
  - All $ref paths are updated automatically
`)
}

// ========================================
// Main
// ========================================

function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help')) {
    showHelp()
    process.exit(0)
  }

  if (args.includes('--prepare')) {
    prepare()
  } else if (args.includes('--extract-common')) {
    extractCommon()
  } else if (args.includes('--split')) {
    const featureIndex = args.indexOf('--split') + 1
    const feature = args[featureIndex]
    if (!feature) {
      log('❌ Missing feature name after --split', colors.red)
      log('Run with --help for usage information', colors.gray)
      process.exit(1)
    }
    splitSingle(feature)
  } else if (args.includes('--split-all')) {
    splitAll()
  } else {
    log('❌ Unknown command', colors.red)
    log('Run with --help for usage information', colors.gray)
    process.exit(1)
  }
}

main()
