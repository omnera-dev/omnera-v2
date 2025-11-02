#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function getAllSpecFiles(dir: string): string[] {
  const files: string[] = []
  const items = readdirSync(dir)

  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...getAllSpecFiles(fullPath))
    } else if (item.endsWith('.spec.ts')) {
      files.push(fullPath)
    }
  }

  return files
}

function fixDuplicateComments(content: string): { fixed: string; count: number } {
  const lines = content.split('\n')
  const newLines: string[] = []
  let fixCount = 0
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Check for GIVEN/WHEN/THEN pattern at async function start
    if (trimmed.startsWith('// GIVEN:')) {
      const givenLine = trimmed
      const nextLine1 = i + 1 < lines.length ? lines[i + 1].trim() : ''
      const nextLine2 = i + 2 < lines.length ? lines[i + 2].trim() : ''

      // Check if this is a complete GIVEN/WHEN/THEN summary block
      if (nextLine1.startsWith('// WHEN:') && nextLine2.startsWith('// THEN:')) {
        // Look ahead to see if there are matching inline comments
        let hasMatchingInline = false
        for (let j = i + 3; j < Math.min(i + 100, lines.length); j++) {
          const futureLine = lines[j].trim()
          if (futureLine === givenLine) {
            hasMatchingInline = true
            break
          }
          // Stop if we reach the next test or end of current test
          if (futureLine.includes('test(') || futureLine.includes('test.fixme(')) {
            break
          }
        }

        if (hasMatchingInline) {
          // Skip these 3 summary lines
          console.log(`  Removing duplicate summary at line ${i + 1}: ${givenLine}`)
          i += 3
          fixCount++
          continue
        }
      }
    }

    newLines.push(line)
    i++
  }

  return { fixed: newLines.join('\n'), count: fixCount }
}

const specFiles = getAllSpecFiles('specs')
let totalFixed = 0
const fixedFiles: string[] = []

for (const file of specFiles) {
  const content = readFileSync(file, 'utf-8')
  const { fixed, count } = fixDuplicateComments(content)

  if (count > 0) {
    writeFileSync(file, fixed)
    totalFixed += count
    fixedFiles.push(file)
    console.log(`✓ Fixed ${count} duplicate(s) in ${file}`)
  }
}

console.log(`\n✅ Fixed ${totalFixed} duplicates across ${fixedFiles.length} files`)
