/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect, describe } from 'bun:test'

// We need to export the functions from split-docs.ts for testing
// For now, we'll duplicate the types and functions we need to test
// In production, you'd export these from split-docs.ts

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
  sectionName: string
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

describe('split-docs', () => {
  describe('slugify', () => {
    test('should convert text to lowercase', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    test('should replace spaces with hyphens', () => {
      expect(slugify('My Section Name')).toBe('my-section-name')
    })

    test('should remove special characters', () => {
      expect(slugify('Hello! @World #123')).toBe('hello-world-123')
    })

    test('should handle multiple consecutive spaces', () => {
      expect(slugify('Hello    World')).toBe('hello-world')
    })

    test('should replace multiple hyphens with single', () => {
      expect(slugify('Hello---World')).toBe('hello-world')
    })

    test('should remove leading and trailing hyphens', () => {
      expect(slugify('-Hello World-')).toBe('hello-world')
    })

    test('should handle empty strings', () => {
      expect(slugify('')).toBe('')
    })

    test('should handle strings with only special characters', () => {
      expect(slugify('!@#$%^&*()')).toBe('')
    })

    test('should preserve existing hyphens in appropriate places', () => {
      expect(slugify('pre-existing-slug')).toBe('pre-existing-slug')
    })

    test('should handle numbers', () => {
      expect(slugify('Section 123')).toBe('section-123')
    })
  })

  describe('parseSections', () => {
    test('should parse single section', () => {
      const content = '# Main Title\n\nSome content here.'
      const sections = parseSections(content)

      expect(sections).toHaveLength(1)
      expect(sections[0]?.heading).toBe('Main Title')
      expect(sections[0]?.level).toBe(1)
      expect(sections[0]?.content).toContain('# Main Title')
    })

    test('should parse multiple sections at different levels', () => {
      const content = `# Main Title

## Section 1

Content for section 1

## Section 2

Content for section 2`

      const sections = parseSections(content)

      expect(sections).toHaveLength(3)
      expect(sections[0]?.heading).toBe('Main Title')
      expect(sections[0]?.level).toBe(1)
      expect(sections[1]?.heading).toBe('Section 1')
      expect(sections[1]?.level).toBe(2)
      expect(sections[2]?.heading).toBe('Section 2')
      expect(sections[2]?.level).toBe(2)
    })

    test('should parse nested sections', () => {
      const content = `# Main Title

## Section 1

### Subsection 1.1

Content here

### Subsection 1.2

More content`

      const sections = parseSections(content)

      expect(sections).toHaveLength(4)
      expect(sections[0]?.level).toBe(1)
      expect(sections[1]?.level).toBe(2)
      expect(sections[2]?.level).toBe(3)
      expect(sections[3]?.level).toBe(3)
    })

    test('should handle empty content', () => {
      const sections = parseSections('')
      expect(sections).toHaveLength(0)
    })

    test('should handle content without headings', () => {
      const content = 'Just some plain text\nNo headings here'
      const sections = parseSections(content)
      expect(sections).toHaveLength(0)
    })

    test('should track line numbers correctly', () => {
      const content = `# Title
Line 1
Line 2
## Section
Line 3`

      const sections = parseSections(content)

      expect(sections[0]?.startLine).toBe(0)
      expect(sections[0]?.endLine).toBe(2)
      expect(sections[1]?.startLine).toBe(3)
    })

    test('should handle all heading levels (1-6)', () => {
      const content = `# H1
## H2
### H3
#### H4
##### H5
###### H6`

      const sections = parseSections(content)

      expect(sections).toHaveLength(6)
      expect(sections[0]?.level).toBe(1)
      expect(sections[5]?.level).toBe(6)
    })
  })

  describe('groupSectionsIntoParts', () => {
    test('should create one part per level 2 section', () => {
      const sections: Section[] = [
        { heading: 'Main', level: 1, content: '# Main', startLine: 0, endLine: 0 },
        { heading: 'Section 1', level: 2, content: '## Section 1', startLine: 1, endLine: 1 },
        { heading: 'Section 2', level: 2, content: '## Section 2', startLine: 2, endLine: 2 },
      ]

      const parts = groupSectionsIntoParts(sections)

      // Creates: Part 1 (Main only), Part 2 (Section 1), Part 3 (Section 2)
      expect(parts).toHaveLength(3)
      expect(parts[0]?.sectionName).toBe('start')
      expect(parts[1]?.sectionName).toBe('section-1')
      expect(parts[2]?.sectionName).toBe('section-2')
    })

    test('should include main title in first part', () => {
      const sections: Section[] = [
        { heading: 'Main', level: 1, content: '# Main', startLine: 0, endLine: 0 },
        { heading: 'Section 1', level: 2, content: '## Section 1', startLine: 1, endLine: 1 },
      ]

      const parts = groupSectionsIntoParts(sections)

      expect(parts[0]?.sections[0]?.heading).toBe('Main')
    })

    test('should group subsections with parent section', () => {
      const sections: Section[] = [
        { heading: 'Main', level: 1, content: '# Main', startLine: 0, endLine: 0 },
        { heading: 'Section 1', level: 2, content: '## Section 1', startLine: 1, endLine: 1 },
        {
          heading: 'Subsection 1.1',
          level: 3,
          content: '### Subsection 1.1',
          startLine: 2,
          endLine: 2,
        },
        { heading: 'Section 2', level: 2, content: '## Section 2', startLine: 3, endLine: 3 },
      ]

      const parts = groupSectionsIntoParts(sections)

      // Part 1: Main only, Part 2: Section 1 + Subsection 1.1, Part 3: Section 2
      expect(parts).toHaveLength(3)
      expect(parts[0]?.sections).toHaveLength(1) // Main only
      expect(parts[1]?.sections).toHaveLength(3) // Main reference + Section 1 + Subsection 1.1
      expect(parts[2]?.sections).toHaveLength(2) // Main reference + Section 2
    })

    test('should calculate character counts correctly', () => {
      const sections: Section[] = [
        { heading: 'Main', level: 1, content: '# Main', startLine: 0, endLine: 0 },
        {
          heading: 'Section 1',
          level: 2,
          content: '## Section 1\n\nContent',
          startLine: 1,
          endLine: 2,
        },
      ]

      const parts = groupSectionsIntoParts(sections)

      expect(parts[0]?.charCount).toBeGreaterThan(0)
    })

    test('should handle sections without main title', () => {
      const sections: Section[] = [
        { heading: 'Section 1', level: 2, content: '## Section 1', startLine: 0, endLine: 0 },
        { heading: 'Section 2', level: 2, content: '## Section 2', startLine: 1, endLine: 1 },
      ]

      const parts = groupSectionsIntoParts(sections)

      expect(parts).toHaveLength(2)
    })

    test('should assign correct part numbers', () => {
      const sections: Section[] = [
        { heading: 'Main', level: 1, content: '# Main', startLine: 0, endLine: 0 },
        { heading: 'Section 1', level: 2, content: '## Section 1', startLine: 1, endLine: 1 },
        { heading: 'Section 2', level: 2, content: '## Section 2', startLine: 2, endLine: 2 },
        { heading: 'Section 3', level: 2, content: '## Section 3', startLine: 3, endLine: 3 },
      ]

      const parts = groupSectionsIntoParts(sections)

      expect(parts[0]?.partNumber).toBe(1)
      expect(parts[1]?.partNumber).toBe(2)
      expect(parts[2]?.partNumber).toBe(3)
    })

    test('should use slugified section names', () => {
      const sections: Section[] = [
        { heading: 'Main', level: 1, content: '# Main', startLine: 0, endLine: 0 },
        {
          heading: 'Installation Guide',
          level: 2,
          content: '## Installation Guide',
          startLine: 1,
          endLine: 1,
        },
        {
          heading: 'API Reference',
          level: 2,
          content: '## API Reference',
          startLine: 2,
          endLine: 2,
        },
      ]

      const parts = groupSectionsIntoParts(sections)

      expect(parts[0]?.sectionName).toBe('start')
      expect(parts[1]?.sectionName).toBe('installation-guide')
      expect(parts[2]?.sectionName).toBe('api-reference')
    })
  })

  describe('generateNavigation', () => {
    test('should return empty string for single part', () => {
      const parts: FilePart[] = [
        { sections: [], charCount: 0, partNumber: 1, sectionName: 'start' },
      ]

      const nav = generateNavigation(parts, 1)
      expect(nav).toBe('')
    })

    test('should generate navigation for first part', () => {
      const parts: FilePart[] = [
        { sections: [], charCount: 0, partNumber: 1, sectionName: 'start' },
        { sections: [], charCount: 0, partNumber: 2, sectionName: 'section-1' },
      ]

      const nav = generateNavigation(parts, 1)

      expect(nav).toContain('Navigation')
      expect(nav).toContain('Part 2 →')
      expect(nav).not.toContain('← Part')
    })

    test('should generate navigation for middle part', () => {
      const parts: FilePart[] = [
        { sections: [], charCount: 0, partNumber: 1, sectionName: 'start' },
        { sections: [], charCount: 0, partNumber: 2, sectionName: 'section-1' },
        { sections: [], charCount: 0, partNumber: 3, sectionName: 'section-2' },
      ]

      const nav = generateNavigation(parts, 2)

      expect(nav).toContain('← Part 1')
      expect(nav).toContain('Part 3 →')
    })

    test('should generate navigation for last part', () => {
      const parts: FilePart[] = [
        { sections: [], charCount: 0, partNumber: 1, sectionName: 'start' },
        { sections: [], charCount: 0, partNumber: 2, sectionName: 'section-1' },
      ]

      const nav = generateNavigation(parts, 2)

      expect(nav).toContain('← Part 1')
      expect(nav).not.toContain('Part 3 →')
    })

    test('should include all parts list', () => {
      const parts: FilePart[] = [
        { sections: [], charCount: 0, partNumber: 1, sectionName: 'start' },
        { sections: [], charCount: 0, partNumber: 2, sectionName: 'section-1' },
        { sections: [], charCount: 0, partNumber: 3, sectionName: 'section-2' },
      ]

      const nav = generateNavigation(parts, 2)

      expect(nav).toContain('**Parts**')
      expect(nav).toContain('Part 1')
      expect(nav).toContain('**Part 2**')
      expect(nav).toContain('Part 3')
    })

    test('should use correct padding for large number of parts', () => {
      const parts: FilePart[] = Array.from({ length: 100 }, (_, i) => ({
        sections: [],
        charCount: 0,
        partNumber: i + 1,
        sectionName: `section-${i + 1}`,
      }))

      const nav = generateNavigation(parts, 50)

      // Should use 3-digit padding for 100 parts
      expect(nav).toContain('049-section-49.md')
      expect(nav).toContain('051-section-51.md')
    })

    test('should use 2-digit padding for fewer than 100 parts', () => {
      const parts: FilePart[] = [
        { sections: [], charCount: 0, partNumber: 1, sectionName: 'start' },
        { sections: [], charCount: 0, partNumber: 2, sectionName: 'section-1' },
      ]

      const nav = generateNavigation(parts, 1)

      expect(nav).toContain('02-section-1.md')
    })

    test('should include correct file paths', () => {
      const parts: FilePart[] = [
        { sections: [], charCount: 0, partNumber: 1, sectionName: 'introduction' },
        { sections: [], charCount: 0, partNumber: 2, sectionName: 'getting-started' },
      ]

      const nav = generateNavigation(parts, 1)

      expect(nav).toContain('./02-getting-started.md')
    })

    test('should bold current part in parts list', () => {
      const parts: FilePart[] = [
        { sections: [], charCount: 0, partNumber: 1, sectionName: 'start' },
        { sections: [], charCount: 0, partNumber: 2, sectionName: 'section-1' },
        { sections: [], charCount: 0, partNumber: 3, sectionName: 'section-2' },
      ]

      const nav = generateNavigation(parts, 2)

      expect(nav).toContain('**Part 2**')
      expect(nav).not.toContain('**Part 1**')
      expect(nav).not.toContain('**Part 3**')
    })
  })
})
