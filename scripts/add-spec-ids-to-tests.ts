#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Add Spec IDs to Test Titles
 *
 * Problem:
 * Many tests exist but don't have spec IDs in their titles, causing validation
 * warnings like "Missing test for spec APP-TABLES-PRIMARYKEY-FIELD-001".
 *
 * Solution:
 * Map test descriptions to their corresponding spec IDs and update titles.
 *
 * Strategy:
 * 1. Read schema to get all specs
 * 2. Read test file to find tests matching spec descriptions
 * 3. Add spec IDs to test titles that are missing them
 */

import { join } from 'node:path'

const PROJECT_ROOT = join(import.meta.dir, '..')

interface Spec {
  id: string
  given: string
  when: string
  then: string
}

interface TestMapping {
  schemaPath: string
  testPath: string
  mappings: Array<{
    specId: string
    searchPattern: RegExp
    replacement: string
  }>
}

// Manual mappings for primary-key tests
const PRIMARY_KEY_MAPPINGS: TestMapping = {
  schemaPath: 'specs/app/tables/primary-key/primary-key.schema.json',
  testPath: 'specs/app/tables/primary-key/primary-key.spec.ts',
  mappings: [
    {
      specId: 'APP-TABLES-PRIMARYKEY-TYPE-003',
      searchPattern: /'should retrieve entity by primaryKey type when ID is valid'/,
      replacement: "'APP-TABLES-PRIMARYKEY-TYPE-003: should retrieve entity by primaryKey type when ID is valid'",
    },
    {
      specId: 'APP-TABLES-PRIMARYKEY-FIELD-001',
      searchPattern: /'should return primaryKey field via API'/,
      replacement: "'APP-TABLES-PRIMARYKEY-FIELD-001: should return primaryKey field via API'",
    },
    {
      specId: 'APP-TABLES-PRIMARYKEY-FIELD-002',
      searchPattern: /'should reject primaryKey field not matching pattern'/,
      replacement: "'APP-TABLES-PRIMARYKEY-FIELD-002: should reject primaryKey field not matching pattern'",
    },
    {
      specId: 'APP-TABLES-PRIMARYKEY-FIELD-003',
      searchPattern: /'should preserve primaryKey field original format when retrieved'/,
      replacement: "'APP-TABLES-PRIMARYKEY-FIELD-003: should preserve primaryKey field original format when retrieved'",
    },
    {
      specId: 'APP-TABLES-PRIMARYKEY-FIELDS-001',
      searchPattern: /'should return composite primaryKey fields via API'/,
      replacement: "'APP-TABLES-PRIMARYKEY-FIELDS-001: should return composite primaryKey fields via API'",
    },
    {
      specId: 'APP-TABLES-PRIMARYKEY-FIELDS-002',
      searchPattern: /'should reject primaryKey fields array with fewer than 2 items'/,
      replacement: "'APP-TABLES-PRIMARYKEY-FIELDS-002: should reject primaryKey fields array with fewer than 2 items'",
    },
  ],
}

// Manual mappings for unique-constraints tests
const UNIQUE_CONSTRAINTS_MAPPINGS: TestMapping = {
  schemaPath: 'specs/app/tables/unique-constraints/unique-constraints.schema.json',
  testPath: 'specs/app/tables/unique-constraints/unique-constraints.spec.ts',
  mappings: [
    {
      specId: 'APP-TABLES-UNIQUECONSTRAINTS-NAME-001',
      searchPattern: /'should return uniqueConstraints name via API'/,
      replacement: "'APP-TABLES-UNIQUECONSTRAINTS-NAME-001: should return uniqueConstraints name via API'",
    },
    {
      specId: 'APP-TABLES-UNIQUECONSTRAINTS-NAME-002',
      searchPattern: /'should reject uniqueConstraints name not matching pattern'/,
      replacement: "'APP-TABLES-UNIQUECONSTRAINTS-NAME-002: should reject uniqueConstraints name not matching pattern'",
    },
    {
      specId: 'APP-TABLES-UNIQUECONSTRAINTS-NAME-003',
      searchPattern: /'should preserve uniqueConstraints name original format when retrieved'/,
      replacement: "'APP-TABLES-UNIQUECONSTRAINTS-NAME-003: should preserve uniqueConstraints name original format when retrieved'",
    },
    {
      specId: 'APP-TABLES-UNIQUECONSTRAINTS-FIELDS-001',
      searchPattern: /'should return uniqueConstraints fields via API'/,
      replacement: "'APP-TABLES-UNIQUECONSTRAINTS-FIELDS-001: should return uniqueConstraints fields via API'",
    },
    {
      specId: 'APP-TABLES-UNIQUECONSTRAINTS-FIELDS-002',
      searchPattern: /'should reject uniqueConstraints fields array with fewer than 2 items'/,
      replacement: "'APP-TABLES-UNIQUECONSTRAINTS-FIELDS-002: should reject uniqueConstraints fields array with fewer than 2 items'",
    },
  ],
}

// Manual mappings for indexes tests
const INDEXES_MAPPINGS: TestMapping = {
  schemaPath: 'specs/app/tables/indexes/indexes.schema.json',
  testPath: 'specs/app/tables/indexes/indexes.spec.ts',
  mappings: [
    {
      specId: 'APP-TABLES-INDEXES-NAME-001',
      searchPattern: /'should return indexes name via API'/,
      replacement: "'APP-TABLES-INDEXES-NAME-001: should return indexes name via API'",
    },
    {
      specId: 'APP-TABLES-INDEXES-NAME-002',
      searchPattern: /'should reject indexes name not matching pattern'/,
      replacement: "'APP-TABLES-INDEXES-NAME-002: should reject indexes name not matching pattern'",
    },
    {
      specId: 'APP-TABLES-INDEXES-NAME-003',
      searchPattern: /'should preserve indexes name original format when retrieved'/,
      replacement: "'APP-TABLES-INDEXES-NAME-003: should preserve indexes name original format when retrieved'",
    },
    {
      specId: 'APP-TABLES-INDEXES-FIELDS-001',
      searchPattern: /'should return indexes fields via API'/,
      replacement: "'APP-TABLES-INDEXES-FIELDS-001: should return indexes fields via API'",
    },
    {
      specId: 'APP-TABLES-INDEXES-FIELDS-002',
      searchPattern: /'should reject indexes fields array with fewer than 1 item'/,
      replacement: "'APP-TABLES-INDEXES-FIELDS-002: should reject indexes fields array with fewer than 1 item'",
    },
    {
      specId: 'APP-TABLES-INDEXES-UNIQUE-001',
      searchPattern: /'should enforce behavior when indexes unique is true'/,
      replacement: "'APP-TABLES-INDEXES-UNIQUE-001: should enforce behavior when indexes unique is true'",
    },
    {
      specId: 'APP-TABLES-INDEXES-UNIQUE-002',
      searchPattern: /'should not enforce unique behavior when indexes unique is false'/,
      replacement: "'APP-TABLES-INDEXES-UNIQUE-002: should not enforce unique behavior when indexes unique is false'",
    },
    {
      specId: 'APP-TABLES-INDEXES-UNIQUE-003',
      searchPattern: /'should accept boolean value for indexes unique'/,
      replacement: "'APP-TABLES-INDEXES-UNIQUE-003: should accept boolean value for indexes unique'",
    },
  ],
}

/**
 * Apply mappings to a test file
 */
async function applyMappings(mapping: TestMapping): Promise<number> {
  const fullPath = join(PROJECT_ROOT, mapping.testPath)
  let content = await Bun.file(fullPath).text()
  let changesCount = 0

  for (const m of mapping.mappings) {
    if (content.match(m.searchPattern)) {
      content = content.replace(m.searchPattern, m.replacement)
      changesCount++
    }
  }

  if (changesCount > 0) {
    await Bun.write(fullPath, content)
  }

  return changesCount
}

/**
 * Main execution
 */
async function main() {
  console.log('🔧 Adding spec IDs to test titles...\n')

  const allMappings = [PRIMARY_KEY_MAPPINGS, UNIQUE_CONSTRAINTS_MAPPINGS, INDEXES_MAPPINGS]

  let totalChanges = 0

  for (const mapping of allMappings) {
    console.log(`📄 Processing ${mapping.testPath}...`)
    const changes = await applyMappings(mapping)

    if (changes > 0) {
      console.log(`   ✅ Added ${changes} spec IDs\n`)
      totalChanges += changes
    } else {
      console.log(`   ⏭️  No changes needed\n`)
    }
  }

  console.log(`🎉 Done! Added ${totalChanges} spec IDs to test titles`)
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
