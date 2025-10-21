/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

interface Spec {
  id: string
  given: string
  when: string
  then: string
}

/**
 * Recursively find all .schema.json files in a directory
 */
function findSchemaFiles(dir: string): string[] {
  const files: string[] = []
  const entries = readdirSync(dir)

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...findSchemaFiles(fullPath))
    } else if (entry.endsWith('.schema.json')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Parse a user story string in "GIVEN ... WHEN ... THEN ..." format
 * and return a spec object
 */
function parseUserStory(story: string, index: number, filePath: string): Spec {
  const givenMatch = story.match(/GIVEN\s+(.+?)\s+WHEN/i)
  const whenMatch = story.match(/WHEN\s+(.+?)\s+THEN/i)
  const thenMatch = story.match(/THEN\s+(.+)$/i)

  if (!givenMatch || !whenMatch || !thenMatch) {
    console.warn(`⚠️  Invalid user story format in ${filePath}: "${story}"`)
    return {
      id: `SPEC-${String(index + 1).padStart(3, '0')}`,
      given: givenMatch?.[1] || 'unknown',
      when: whenMatch?.[1] || 'unknown',
      then: thenMatch?.[1] || 'unknown',
    }
  }

  return {
    id: `SPEC-${String(index + 1).padStart(3, '0')}`,
    given: givenMatch[1].trim(),
    when: whenMatch[1].trim(),
    then: thenMatch[1].trim(),
  }
}

/**
 * Extract all x-user-stories from nested properties in a schema object
 */
function extractUserStories(obj: Record<string, unknown>, filePath: string): Spec[] {
  const stories: Spec[] = []
  let storyIndex = 0

  function traverse(current: unknown): void {
    if (typeof current !== 'object' || current === null) {
      return
    }

    const currentObj = current as Record<string, unknown>

    if (Array.isArray(currentObj['x-user-stories'])) {
      for (const story of currentObj['x-user-stories']) {
        stories.push(parseUserStory(story as string, storyIndex++, filePath))
      }
      delete currentObj['x-user-stories']
    }

    for (const key in currentObj) {
      if (key !== 'specs') {
        // Don't traverse existing specs
        traverse(currentObj[key])
      }
    }
  }

  traverse(obj)
  return stories
}

/**
 * Migrate a single schema file
 */
function migrateSchemaFile(filePath: string): boolean {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const schema = JSON.parse(content)

    // Extract user stories from nested properties (even if specs already exist)
    const extractedSpecs = extractUserStories(schema, filePath)

    if (extractedSpecs.length === 0) {
      console.log(`⏭️  Skipping ${filePath} (no x-user-stories found)`)
      return false
    }

    // If schema already has specs, merge them
    if (schema.specs && Array.isArray(schema.specs)) {
      const existingCount = schema.specs.length
      // Re-number the new specs to avoid ID conflicts
      const reNumberedSpecs = extractedSpecs.map((spec, index) => ({
        ...spec,
        id: `SPEC-${String(existingCount + index + 1).padStart(3, '0')}`,
      }))
      schema.specs = [...schema.specs, ...reNumberedSpecs]
      console.log(
        `✅ Merged ${filePath} (${existingCount} existing + ${extractedSpecs.length} new = ${schema.specs.length} total)`
      )
    } else {
      // Add specs to root level
      schema.specs = extractedSpecs
      console.log(`✅ Migrated ${filePath} (${extractedSpecs.length} specs)`)
    }

    // Write back with proper formatting
    writeFileSync(filePath, JSON.stringify(schema, null, 2) + '\n', 'utf-8')

    return true
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error)
    return false
  }
}

/**
 * Main migration function
 */
function main() {
  const specsDir = join(process.cwd(), 'specs', 'app')

  console.log('🔍 Finding schema files...')
  const schemaFiles = findSchemaFiles(specsDir)
  console.log(`📝 Found ${schemaFiles.length} schema files\n`)

  let processed = 0
  let skipped = 0

  for (const file of schemaFiles) {
    const result = migrateSchemaFile(file)
    if (result === true) {
      processed++
    } else if (result === false) {
      skipped++
    }
  }

  console.log('\n📊 Migration Summary:')
  console.log(`   ✅ Processed: ${processed}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
}

main()
