/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Fix missing title properties in schema files
 *
 * This script adds appropriate titles to schema files that are missing them.
 * Titles are generated from the file path structure.
 */

import { readFile, writeFile } from 'node:fs/promises'

const FILES_NEEDING_TITLES: Record<string, string> = {
  'specs/app/connections/google-sheets-connection/id/id.schema.json': 'Google Sheets Connection ID',
  'specs/app/connections/qonto-connection/id/id.schema.json': 'Qonto Connection ID',
  'specs/app/connections/airtable-connection/id/id.schema.json': 'Airtable Connection ID',
  'specs/app/connections/calendly-connection/id/id.schema.json': 'Calendly Connection ID',
  'specs/app/connections/linkedin-ads-connection/id/id.schema.json': 'LinkedIn Ads Connection ID',
  'specs/app/connections/google-gmail-connection/id/id.schema.json': 'Google Gmail Connection ID',
  'specs/app/connections/facebook-ads-connection/id/id.schema.json': 'Facebook Ads Connection ID',
  'specs/app/connections/notion-connection/id/id.schema.json': 'Notion Connection ID',
  'specs/app/automations/common/filter-condition.schema.json': 'Filter Condition',
  'specs/app/automations/common/json-schema.schema.json': 'JSON Schema',
  'specs/app/automations/description/description.schema.json': 'Automation Description',
  'specs/app/automations/name/name.schema.json': 'Automation Name',
}

async function addTitle(filePath: string, title: string): Promise<void> {
  const content = await readFile(filePath, 'utf-8')
  const json = JSON.parse(content)

  // Add title property after $schema
  const ordered: Record<string, unknown> = {}

  if ('$id' in json) ordered.$id = json.$id
  if ('$schema' in json) ordered.$schema = json.$schema
  ordered.title = title

  // Add remaining properties
  for (const [key, value] of Object.entries(json)) {
    if (key !== '$id' && key !== '$schema' && key !== 'title') {
      ordered[key] = value
    }
  }

  // Write back with pretty formatting
  const newContent = JSON.stringify(ordered, null, 2) + '\n'
  await writeFile(filePath, newContent, 'utf-8')
}

async function main() {
  console.log('🔧 Adding missing title properties...\n')

  let fixedCount = 0

  for (const [filePath, title] of Object.entries(FILES_NEEDING_TITLES)) {
    try {
      await addTitle(filePath, title)
      console.log(`✓ ${filePath}`)
      console.log(`  → Added title: "${title}"`)
      fixedCount++
    } catch (error) {
      console.error(`✗ Failed to fix ${filePath}:`, error)
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} schema files (added title properties)`)
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
