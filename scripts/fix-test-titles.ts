/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Fix test titles to include spec ID prefix
 *
 * This script:
 * 1. Finds all .spec.ts files
 * 2. Looks for spec ID comments (// SPEC-ID: description)
 * 3. Finds the corresponding test() declaration
 * 4. Adds spec ID prefix to test title if missing
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

async function findTestFiles(dir: string): Promise<string[]> {
  const files: string[] = []

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.name.endsWith('.spec.ts')) {
        files.push(fullPath)
      }
    }
  }

  await walk(dir)
  return files
}

async function fixTestTitles(filePath: string): Promise<boolean> {
  const content = await readFile(filePath, 'utf-8')
  const lines = content.split('\n')
  let modified = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue

    // Look for spec ID comment lines: // SPEC-ID: description
    const commentMatch = line.match(/\/\/\s*([A-Z]+(?:-[A-Z]+)*-\d{3,}):/)
    if (!commentMatch) continue

    const specId = commentMatch[1]

    // Find the next test() declaration after this comment
    for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
      const testLine = lines[j]
      if (!testLine) continue

      // Match test declarations: test('title', ...) or test.skip('title', ...)
      const testMatch = testLine.match(/test(?:\.skip|\.fixme)?\s*\(/)
      if (testMatch) {
        // Found test( declaration, now find and fix the title
        let titleLineIndex = -1
        let titleMatch: RegExpMatchArray | null = null

        // Check if title is on the same line
        const inlineTitleMatch = testLine.match(/test(?:\.skip|\.fixme)?\s*\(\s*['"]([^'"]+)['"]/)
        if (inlineTitleMatch) {
          titleLineIndex = j
          titleMatch = inlineTitleMatch
        } else {
          // Title might be on next lines (multi-line format)
          for (let k = j + 1; k < Math.min(j + 5, lines.length); k++) {
            const titleLine = lines[k]
            if (!titleLine) continue

            const multiLineTitleMatch = titleLine.match(/^\s*['"]([^'"]+)['"]/)
            if (multiLineTitleMatch) {
              titleLineIndex = k
              titleMatch = multiLineTitleMatch
              break
            }

            // Stop if we hit opening brace or another test
            if (titleLine.includes('{') || titleLine.match(/test\s*\(/)) {
              break
            }
          }
        }

        if (titleLineIndex >= 0 && titleMatch) {
          const currentTitle = titleMatch[1]
          if (!currentTitle) continue

          // Check if title already starts with spec ID
          if (!currentTitle.startsWith(`${specId}:`)) {
            const newTitle = `${specId}: ${currentTitle}`

            // Replace the title in the line
            const oldLine = lines[titleLineIndex]
            if (!oldLine) continue
            const newLine = oldLine.replace(
              new RegExp(`['"]${currentTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`),
              `'${newTitle}'`
            )

            if (oldLine !== newLine) {
              lines[titleLineIndex] = newLine
              modified = true
              console.log(`  ✓ ${specId}: "${currentTitle}" → "${newTitle}"`)
            }
          }
        }

        // Found the test for this spec ID, stop searching
        break
      }

      // If we hit another spec ID comment, stop searching
      if (testLine.match(/\/\/\s*[A-Z]+(?:-[A-Z]+)*-\d{3,}:/)) {
        break
      }
    }
  }

  if (modified) {
    const newContent = lines.join('\n')
    await writeFile(filePath, newContent, 'utf-8')
  }

  return modified
}

async function main() {
  const dirs = [join(process.cwd(), 'specs', 'api', 'paths'), join(process.cwd(), 'specs', 'admin')]

  console.log('🔍 Fixing test titles to include spec ID prefix...\n')

  let totalFiles = 0

  for (const dir of dirs) {
    const files = await findTestFiles(dir)

    for (const file of files) {
      const relativePath = file.replace(process.cwd() + '/', '')
      const modified = await fixTestTitles(file)

      if (modified) {
        console.log(`\n📝 ${relativePath}`)
        totalFiles++
      }
    }
  }

  console.log(`\n✅ Fixed test titles in ${totalFiles} files`)
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
