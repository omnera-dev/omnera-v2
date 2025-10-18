#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const LICENSE_HEADER = ``

const SHEBANG_PATTERN = /^#!\/usr\/bin\/env bun\n/

const ROOT_DIR = join(import.meta.dir, '..')
const INCLUDE_DIRS = ['src', 'scripts', 'tests']
const EXCLUDE_PATTERNS = ['node_modules', '.git', 'dist', 'build', 'coverage', '.next', 'drizzle']

function hasLicenseHeader(content: string): boolean {
  const normalizedContent = content.replace(/\r\n/g, '\n')
  const normalizedHeader = LICENSE_HEADER.replace(/\r\n/g, '\n')

  // Check if content starts with shebang
  if (SHEBANG_PATTERN.test(normalizedContent)) {
    // Check if license header comes after shebang
    const afterShebang = normalizedContent.replace(SHEBANG_PATTERN, '')
    return afterShebang.trim().startsWith(normalizedHeader.trim())
  }

  // Check if content starts with license header
  return normalizedContent.trim().startsWith(normalizedHeader.trim())
}

function addLicenseHeader(filePath: string): boolean {
  try {
    const content = readFileSync(filePath, 'utf-8')

    // Skip if already has license header
    if (hasLicenseHeader(content)) {
      return false
    }

    let newContent: string

    // Preserve shebang if present
    if (SHEBANG_PATTERN.test(content)) {
      const shebang = content.match(SHEBANG_PATTERN)![0]
      const afterShebang = content.replace(SHEBANG_PATTERN, '')
      newContent = shebang + LICENSE_HEADER + afterShebang
    } else {
      newContent = LICENSE_HEADER + content
    }

    writeFileSync(filePath, newContent, 'utf-8')
    return true
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error)
    return false
  }
}

function shouldProcessFile(filePath: string): boolean {
  const ext = filePath.split('.').pop()
  return ext === 'ts' || ext === 'tsx'
}

function shouldSkipDirectory(dirName: string): boolean {
  return EXCLUDE_PATTERNS.some((pattern) => dirName.includes(pattern))
}

function processDirectory(dirPath: string, stats: { processed: number; skipped: number }): void {
  const entries = readdirSync(dirPath)

  for (const entry of entries) {
    const fullPath = join(dirPath, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      if (!shouldSkipDirectory(entry)) {
        processDirectory(fullPath, stats)
      }
    } else if (stat.isFile() && shouldProcessFile(fullPath)) {
      const wasAdded = addLicenseHeader(fullPath)
      if (wasAdded) {
        const relativePath = relative(ROOT_DIR, fullPath)
        console.log(`✓ Added header to: ${relativePath}`)
        stats.processed++
      } else {
        stats.skipped++
      }
    }
  }
}

function main(): void {
  console.log('Adding license headers to source files...\n')

  const stats = { processed: 0, skipped: 0 }

  for (const dir of INCLUDE_DIRS) {
    const dirPath = join(ROOT_DIR, dir)
    try {
      processDirectory(dirPath, stats)
    } catch (error) {
      console.error(`Error processing directory ${dir}:`, error)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`Total files processed: ${stats.processed}`)
  console.log(`Files already with headers: ${stats.skipped}`)
  console.log('='.repeat(50))
  console.log('\n✅ License headers added successfully!')
}

main()
