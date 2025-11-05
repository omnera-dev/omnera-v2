#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Rename Spec IDs Script
 *
 * Renames spec IDs to better reflect their hierarchy:
 * - APP-LANG-CONFIG-* → APP-LANGUAGES-CONFIG-*
 * - APP-RESPONSIVE-* → APP-PAGES-RESPONSIVE-*
 * - APP-INTERACTION-* → APP-PAGES-INTERACTION-*
 */

import { $ } from 'bun'

const renames = [
  {
    from: 'APP-LANG-CONFIG',
    to: 'APP-LANGUAGES-CONFIG',
    description: 'Language configuration specs (nested in languages.supported[])',
  },
  {
    from: 'APP-RESPONSIVE',
    to: 'APP-PAGES-RESPONSIVE',
    description: 'Responsive design specs (component-level in pages)',
  },
  {
    from: 'APP-INTERACTION-CLICK',
    to: 'APP-PAGES-INTERACTION-CLICK',
    description: 'Click interaction specs (component-level in pages)',
  },
  {
    from: 'APP-INTERACTION-ENTRANCE',
    to: 'APP-PAGES-INTERACTION-ENTRANCE',
    description: 'Entrance animation specs (component-level in pages)',
  },
  {
    from: 'APP-INTERACTION-HOVER',
    to: 'APP-PAGES-INTERACTION-HOVER',
    description: 'Hover interaction specs (component-level in pages)',
  },
  {
    from: 'APP-INTERACTION-MAIN',
    to: 'APP-PAGES-INTERACTION-MAIN',
    description: 'Main interaction specs (component-level in pages)',
  },
  {
    from: 'APP-INTERACTION-SCROLL',
    to: 'APP-PAGES-INTERACTION-SCROLL',
    description: 'Scroll interaction specs (component-level in pages)',
  },
]

console.log('🔄 Renaming Spec IDs to reflect hierarchy\n')

for (const { from, to, description } of renames) {
  console.log(`📝 ${from} → ${to}`)
  console.log(`   ${description}`)

  // Find all files containing the old spec ID
  const findResult = await $`find specs -type f -name "*.schema.json" -o -name "*.spec.ts"`.text()
  const allFiles = findResult
    .trim()
    .split('\n')
    .filter((f) => f.length > 0)

  // Check which files contain the pattern
  const files: string[] = []
  for (const file of allFiles) {
    const content = await Bun.file(file).text()
    if (content.includes(from)) {
      files.push(file)
    }
  }

  console.log(`   Found ${files.length} file(s) to update`)

  // Replace in each file
  for (const file of files) {
    const content = await Bun.file(file).text()
    const updated = content.replaceAll(from, to)
    await Bun.write(file, updated)
    console.log(`   ✅ Updated: ${file}`)
  }

  console.log('')
}

console.log('✅ All spec IDs renamed successfully!')
console.log('\n📋 Next steps:')
console.log('   1. Run: bun run license (add headers if needed)')
console.log('   2. Verify: grep -r "APP-LANG-CONFIG\\|APP-RESPONSIVE\\|APP-INTERACTION-" specs/')
console.log('   3. Update GitHub issues with new spec IDs')
