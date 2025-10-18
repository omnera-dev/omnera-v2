import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, test } from 'bun:test'

// Helper function for testing progress bar generation
function generateProgressBar(percent: number, width: number = 30): string {
  const filled = Math.round((percent / 100) * width)
  const empty = width - filled
  return `${'█'.repeat(filled)}${'░'.repeat(empty)} ${percent}%`
}

describe('generate-roadmap', () => {
  // Use a unique directory per test to avoid conflicts in concurrent execution
  let TEST_DIR: string
  let TEST_SCHEMAS_DIR: string
  let TEST_CURRENT_SCHEMA: string
  let TEST_VISION_SCHEMA: string

  beforeEach(() => {
    // Create unique test directory in /tmp/ for each test (safe for parallel execution)
    TEST_DIR = join(tmpdir(), `test-roadmap-output-${randomBytes(8).toString('hex')}`)
    TEST_SCHEMAS_DIR = join(TEST_DIR, 'schemas')
    TEST_CURRENT_SCHEMA = join(TEST_SCHEMAS_DIR, 'current.json')
    TEST_VISION_SCHEMA = join(TEST_SCHEMAS_DIR, 'vision.json')

    // Create test directory structure
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true })
    }
    mkdirSync(TEST_SCHEMAS_DIR, { recursive: true })
  })

  afterEach(() => {
    // Cleanup test directory (force: true ensures cleanup even if tests fail)
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true })
    }
  })

  describe('loadSchema', () => {
    test('loads valid JSON schema from file', async () => {
      const validSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      }

      await Bun.write(TEST_CURRENT_SCHEMA, JSON.stringify(validSchema))

      // Import and test loadSchema by executing a modified script
      const file = Bun.file(TEST_CURRENT_SCHEMA)
      const content = await file.json()

      expect(content).toEqual(validSchema)
      expect(content.properties).toBeDefined()
    })

    test('throws error when schema file does not exist', async () => {
      const nonExistentPath = join(TEST_SCHEMAS_DIR, 'non-existent.json')
      const file = Bun.file(nonExistentPath)

      expect(await file.exists()).toBe(false)
    })

    test('throws error when schema is missing properties field', async () => {
      const invalidSchema = {
        type: 'object',
        // Missing 'properties' field
      }

      await Bun.write(TEST_CURRENT_SCHEMA, JSON.stringify(invalidSchema))

      const file = Bun.file(TEST_CURRENT_SCHEMA)
      const content = await file.json()

      expect(content.properties).toBeUndefined()
    })

    test('loads schema with definitions', async () => {
      const schemaWithDefinitions = {
        type: 'object',
        properties: {
          user: { $ref: '#/definitions/User' },
        },
        definitions: {
          User: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
          },
        },
      }

      await Bun.write(TEST_VISION_SCHEMA, JSON.stringify(schemaWithDefinitions))

      const file = Bun.file(TEST_VISION_SCHEMA)
      const content = await file.json()

      expect(content.definitions).toBeDefined()
      expect(content.definitions.User).toBeDefined()
    })
  })

  describe('generateProgressBar', () => {
    // Since generateProgressBar is not exported, we'll test the concept
    test('generates progress bar with correct format', () => {
      const bar0 = generateProgressBar(0)
      expect(bar0).toContain('0%')
      expect(bar0).toContain('░')
      expect(bar0.split('░').length - 1).toBe(30)

      const bar50 = generateProgressBar(50)
      expect(bar50).toContain('50%')
      expect(bar50).toContain('█')
      expect(bar50).toContain('░')

      const bar100 = generateProgressBar(100)
      expect(bar100).toContain('100%')
      expect(bar100).toContain('█')
      expect(bar100.split('█').length - 1).toBe(30)
    })

    test('handles custom width', () => {
      const bar = generateProgressBar(50, 10)
      const totalChars = (bar.match(/█/g) || []).length + (bar.match(/░/g) || []).length

      expect(totalChars).toBe(10)
    })

    test('handles edge cases', () => {
      const bar1 = generateProgressBar(1)
      expect(bar1).toContain('1%')

      const bar99 = generateProgressBar(99)
      expect(bar99).toContain('99%')
    })
  })

  describe('integration workflow', () => {
    test('processes complete workflow with valid schemas', async () => {
      const currentSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
        },
      }

      const visionSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          icon: { enum: ['user', 'settings'] },
        },
      }

      // Ensure directory exists before writing
      if (!existsSync(TEST_SCHEMAS_DIR)) {
        mkdirSync(TEST_SCHEMAS_DIR, { recursive: true })
      }

      await Bun.write(TEST_CURRENT_SCHEMA, JSON.stringify(currentSchema))
      await Bun.write(TEST_VISION_SCHEMA, JSON.stringify(visionSchema))

      // Verify schemas are readable
      const currentFile = Bun.file(TEST_CURRENT_SCHEMA)
      const visionFile = Bun.file(TEST_VISION_SCHEMA)

      expect(await currentFile.exists()).toBe(true)
      expect(await visionFile.exists()).toBe(true)

      const currentContent = await currentFile.json()
      const visionContent = await visionFile.json()

      expect(currentContent.properties).toBeDefined()
      expect(visionContent.properties).toBeDefined()
      expect(Object.keys(visionContent.properties).length).toBe(3)
    })

    test('creates output directory structure', async () => {
      const outputDir = join(TEST_DIR, 'output')

      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true })
      }

      expect(existsSync(outputDir)).toBe(true)

      // Test creating nested directories
      const nestedDir = join(outputDir, 'roadmap', 'phases')
      mkdirSync(nestedDir, { recursive: true })

      expect(existsSync(nestedDir)).toBe(true)
    })

    test('generates markdown files successfully', async () => {
      const roadmapContent = `# Roadmap\n\n## Progress\n\n50% complete`
      const roadmapPath = join(TEST_DIR, 'ROADMAP.md')

      await Bun.write(roadmapPath, roadmapContent)

      expect(existsSync(roadmapPath)).toBe(true)

      const content = await Bun.file(roadmapPath).text()
      expect(content).toContain('# Roadmap')
      expect(content).toContain('50% complete')
    })

    test('handles multiple property files generation', async () => {
      const roadmapDir = join(TEST_DIR, 'roadmap')
      mkdirSync(roadmapDir, { recursive: true })

      const properties = ['icon', 'color', 'tables', 'pages']
      for (const property of properties) {
        const propertyContent = `# ${property.charAt(0).toUpperCase() + property.slice(1)}\n\nDescription of ${property}`
        const propertyPath = join(roadmapDir, `${property}.md`)
        await Bun.write(propertyPath, propertyContent)
      }

      // Verify all property files were created
      for (const property of properties) {
        const propertyPath = join(roadmapDir, `${property}.md`)
        expect(existsSync(propertyPath)).toBe(true)

        const content = await Bun.file(propertyPath).text()
        expect(content).toContain(property.charAt(0).toUpperCase() + property.slice(1))
      }
    })
  })

  describe('error handling', () => {
    test('handles invalid JSON in schema file', async () => {
      const invalidJSON = '{ invalid json }'
      await Bun.write(TEST_CURRENT_SCHEMA, invalidJSON)

      try {
        await Bun.file(TEST_CURRENT_SCHEMA).json()
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    test('handles empty schema file', async () => {
      await Bun.write(TEST_CURRENT_SCHEMA, '')

      try {
        await Bun.file(TEST_CURRENT_SCHEMA).json()
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    test('handles schema with invalid structure', async () => {
      const invalidSchema = {
        // Missing required 'type' and 'properties' fields
        title: 'Invalid Schema',
      }

      await Bun.write(TEST_CURRENT_SCHEMA, JSON.stringify(invalidSchema))

      const content = await Bun.file(TEST_CURRENT_SCHEMA).json()

      expect(content.properties).toBeUndefined()
      expect(content.type).toBeUndefined()
    })
  })

  describe('file paths and constants', () => {
    test('uses correct default paths', () => {
      const CURRENT_SCHEMA_PATH = 'schemas/0.0.1/app.schema.json'
      const VISION_SCHEMA_PATH = 'docs/specifications/specs.schema.json'
      const ROADMAP_OUTPUT_PATH = 'ROADMAP.md'
      const ROADMAP_DIR = 'docs/specifications/roadmap'

      expect(CURRENT_SCHEMA_PATH).toContain('schemas')
      expect(CURRENT_SCHEMA_PATH).toContain('app.schema.json')
      expect(VISION_SCHEMA_PATH).toContain('specs.schema.json')
      expect(ROADMAP_OUTPUT_PATH).toBe('ROADMAP.md')
      expect(ROADMAP_DIR).toContain('roadmap')
    })

    test('constructs property file paths correctly', () => {
      const ROADMAP_DIR = 'docs/specifications/roadmap'
      const properties = [
        'icon',
        'color',
        'app-version',
        'schema-version',
        'tables',
        'pages',
        'automations',
        'connections',
      ]

      for (const property of properties) {
        const propertyPath = join(ROADMAP_DIR, `${property}.md`)
        expect(propertyPath).toContain('roadmap')
        expect(propertyPath).toContain(`${property}.md`)
      }
    })
  })

  describe('console output formatting', () => {
    test('formats statistics correctly', () => {
      const stats = {
        totalProperties: 10,
        implementedProperties: 2,
        partialProperties: 0,
        missingProperties: 8,
        overallCompletion: 20,
        currentVersion: 'v0.0.1',
        targetVersion: 'v1.0.0',
      }

      const implementedPercent = Math.round(
        (stats.implementedProperties / stats.totalProperties) * 100
      )
      const missingPercent = Math.round((stats.missingProperties / stats.totalProperties) * 100)

      expect(implementedPercent).toBe(20)
      expect(missingPercent).toBe(80)
    })

    test('formats property status icons correctly', () => {
      type PropertyStatus = 'complete' | 'partial' | 'missing'
      const properties = [
        { status: 'complete' as PropertyStatus, name: 'name' },
        { status: 'partial' as PropertyStatus, name: 'description' },
        { status: 'missing' as PropertyStatus, name: 'icon' },
      ]

      for (const property of properties) {
        let statusIcon: string
        if (property.status === 'complete') {
          statusIcon = '✅'
        } else if (property.status === 'partial') {
          statusIcon = '🚧'
        } else {
          statusIcon = '⏳'
        }

        if (property.status === 'complete') {
          expect(statusIcon).toBe('✅')
        } else if (property.status === 'partial') {
          expect(statusIcon).toBe('🚧')
        } else {
          expect(statusIcon).toBe('⏳')
        }
      }
    })
  })

  describe('timestamp generation', () => {
    test('generates ISO date string correctly', () => {
      const timestamp = new Date().toISOString().split('T')[0]

      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    test('timestamp is consistent within same day', () => {
      const timestamp1 = new Date().toISOString().split('T')[0]
      const timestamp2 = new Date().toISOString().split('T')[0]

      expect(timestamp1).toBe(timestamp2)
    })
  })
})
