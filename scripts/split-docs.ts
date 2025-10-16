#!/usr/bin/env bun

/**
 * Documentation File Splitter
 *
 * Splits large markdown documentation files into smaller files based on ## (level 2) sections.
 * Each ## section (with all its subsections) becomes a separate file.
 *
 * How it works:
 * - Creates one file per ## section
 * - Each file includes the main # title (with note) + one ## section + its subsections
 * - Files are named: {number}-{section-name}.md (e.g., "01-overview.md", "02-installation.md")
 * - Section names are slugified (lowercase, hyphens, no special chars)
 * - Navigation links are added at the bottom of each file
 *
 * Usage:
 *   bun run scripts/split-docs.ts <file-path>
 *   bun run scripts/split-docs.ts docs/infrastructure/database/drizzle.md
 *
 * Or process all large files:
 *   bun run scripts/split-docs.ts --all
 *
 * Output:
 *   docs/infrastructure/database/drizzle/01-start.md
 *   docs/infrastructure/database/drizzle/02-overview.md
 *   docs/infrastructure/database/drizzle/03-installation.md
 *   ...
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, dirname, basename, extname } from 'node:path'

interface Section {
  heading: string
  level: number
  content: string
  startLine: number
  endLine: number
}

interface FilePart {
  sections: Section[]
  charCount: number
  partNumber: number
  sectionName: string // Slugified section heading for filename
}

/**
 * Convert section heading to URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Parse markdown content and extract sections based on heading hierarchy
 */
function parseSections(content: string): Section[] {
  const lines = content.split('\n')
  const sections: Section[] = []

  let currentSection: Section | null = null
  let currentContent: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)

    if (headingMatch && headingMatch[1] && headingMatch[2]) {
      // Save previous section
      if (currentSection) {
        currentSection.content = currentContent.join('\n')
        currentSection.endLine = i - 1
        sections.push(currentSection)
      }

      // Start new section
      const level = headingMatch[1].length
      const heading = headingMatch[2]

      currentSection = {
        heading,
        level,
        content: '',
        startLine: i,
        endLine: i,
      }
      currentContent = [line]
    } else if (currentSection) {
      currentContent.push(line)
    }
  }

  // Save last section
  if (currentSection) {
    currentSection.content = currentContent.join('\n')
    currentSection.endLine = lines.length - 1
    sections.push(currentSection)
  }

  return sections
}

/**
 * Group sections into parts - one file per ## (level 2) section
 * Each part contains a ## section and all its subsections (###, ####, etc.)
 */
function groupSectionsIntoParts(sections: Section[]): FilePart[] {
  const parts: FilePart[] = []

  // Find the main title (# heading, level 1)
  const mainTitle = sections.find((s) => s.level === 1)

  let currentPart: FilePart | null = null

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    if (!section) continue // Skip if section is undefined

    const sectionChars = section.content.length

    // Main title (# heading) - include in first part only
    if (section.level === 1) {
      if (!currentPart) {
        currentPart = {
          sections: [section],
          charCount: sectionChars,
          partNumber: 1,
          sectionName: 'start', // Default name for first part with main title
        }
      }
      continue
    }

    // Start new part at each ## (level 2) section
    if (section.level === 2) {
      // Save previous part if exists
      if (currentPart) {
        parts.push(currentPart)
      }

      // Start new part with main title reference + this level 2 section
      const partNumber = parts.length + 1
      currentPart = {
        sections: [],
        charCount: 0,
        partNumber,
        sectionName: slugify(section.heading), // Use slugified section heading
      }

      // Add main title reference
      if (mainTitle && partNumber > 1) {
        const titleSection = {
          ...mainTitle,
          content: `# ${mainTitle.heading}\n\n> **Note**: This is part ${partNumber} of the split documentation. See navigation links below.\n`,
        }
        currentPart.sections.push(titleSection)
        currentPart.charCount += titleSection.content.length
      }

      // Add the level 2 section
      currentPart.sections.push(section)
      currentPart.charCount += sectionChars
      continue
    }

    // Add subsections (###, ####, etc.) to current part
    if (currentPart && section.level > 2) {
      currentPart.sections.push(section)
      currentPart.charCount += sectionChars
    }
  }

  // Add final part
  if (currentPart) {
    parts.push(currentPart)
  }

  return parts
}

/**
 * Generate navigation links between file parts
 */
function generateNavigation(parts: FilePart[], currentPartNumber: number): string {
  if (parts.length === 1) return ''

  const nav: string[] = ['\n---\n', '\n## Navigation\n']

  // Determine number padding
  const numPadding = parts.length >= 100 ? 3 : 2

  // Previous link
  const prevPart = currentPartNumber > 1 ? parts[currentPartNumber - 2] : undefined
  if (prevPart) {
    const prevNumber = String(prevPart.partNumber).padStart(numPadding, '0')
    const prevLink = `[← Part ${prevPart.partNumber}](./${prevNumber}-${prevPart.sectionName}.md)`
    nav.push(prevLink)
  }

  // Next link
  const nextPart = currentPartNumber < parts.length ? parts[currentPartNumber] : undefined
  if (nextPart) {
    const nextNumber = String(nextPart.partNumber).padStart(numPadding, '0')
    const nextLink = `[Part ${nextPart.partNumber} →](./${nextNumber}-${nextPart.sectionName}.md)`

    if (currentPartNumber > 1) {
      nav[nav.length - 1] += ` | ${nextLink}`
    } else {
      nav.push(nextLink)
    }
  }

  // All parts list
  const partsList = parts
    .map((part) => {
      const number = String(part.partNumber).padStart(numPadding, '0')
      const filename = `${number}-${part.sectionName}.md`

      if (part.partNumber === currentPartNumber) {
        return `**Part ${part.partNumber}**`
      }
      return `[Part ${part.partNumber}](./${filename})`
    })
    .join(' | ')

  nav.push(`\n\n**Parts**: ${partsList}`)

  return nav.join('\n')
}

/**
 * Write split documentation parts to output directory
 */
async function writeParts(parts: FilePart[], originalPath: string): Promise<void> {
  const dir = dirname(originalPath)
  const filename = basename(originalPath, extname(originalPath))

  // Create output directory if needed
  const outputDir = join(dir, filename)
  await mkdir(outputDir, { recursive: true })

  console.log(`\n✓ Splitting into ${parts.length} parts:\n`)

  // Determine number padding (2 digits for <100 parts, 3 for >=100)
  const numPadding = parts.length >= 100 ? 3 : 2

  for (const part of parts) {
    // Format: {number}-{section-name}.md (e.g., "01-overview.md", "02-installation.md")
    const paddedNumber = String(part.partNumber).padStart(numPadding, '0')
    const outputFilename = `${paddedNumber}-${part.sectionName}.md`
    const outputPath = join(outputDir, outputFilename)

    // Combine section content
    let content = part.sections.map((s) => s.content).join('\n\n')

    // Add navigation
    const navigation = generateNavigation(parts, part.partNumber)
    content += navigation

    await writeFile(outputPath, content, 'utf-8')

    console.log(
      `  Part ${part.partNumber}: ${outputFilename} (${part.charCount.toLocaleString()} chars, ${part.sections.length} sections)`
    )
  }

  console.log(`\n✓ Output directory: ${outputDir}`)
}

/**
 * Main function to split a documentation file
 */
async function splitDocFile(filePath: string): Promise<void> {
  console.log(`\nProcessing: ${filePath}`)

  // Read original file
  const content = await readFile(filePath, 'utf-8')
  const originalChars = content.length

  console.log(`Original size: ${originalChars.toLocaleString()} characters`)

  // Parse sections to check if file has ## headings to split on
  const sections = parseSections(content)
  const level2Sections = sections.filter((s) => s.level === 2)

  if (level2Sections.length === 0) {
    console.log('✓ No ## (level 2) sections found, no splitting needed.')
    return
  }

  console.log(
    `Found ${sections.length} total sections, ${level2Sections.length} level 2 sections (##) to split on`
  )

  // Group into parts
  const parts = groupSectionsIntoParts(sections)

  // Write output files
  await writeParts(parts, filePath)

  console.log(`\n✓ Successfully split ${filePath}`)
}

/**
 * Process all large documentation files
 */
async function splitAllLargeFiles(): Promise<void> {
  const largeFiles = [
    'docs/infrastructure/database/drizzle.md',
    'docs/infrastructure/ui/tanstack-query.md',
    'docs/infrastructure/ui/tanstack-table.md',
    'docs/architecture/layer-based-architecture.md',
  ]

  console.log('Processing all large documentation files...\n')

  for (const filePath of largeFiles) {
    try {
      await splitDocFile(filePath)
    } catch (error) {
      console.error(`\n✗ Error processing ${filePath}:`, error)
    }
  }

  console.log('\n✓ All files processed.')
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error('Usage: bun run scripts/split-docs.ts <file-path>')
    console.error('   or: bun run scripts/split-docs.ts --all')
    console.error('\nExamples:')
    console.error('  bun run scripts/split-docs.ts docs/infrastructure/database/drizzle.md')
    console.error('  bun run scripts/split-docs.ts --all')
    process.exit(1)
  }

  const filePath = args[0]

  if (!filePath) {
    console.error('Error: File path is required')
    process.exit(1)
  }

  if (filePath === '--all') {
    await splitAllLargeFiles()
  } else {
    await splitDocFile(filePath)
  }
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
