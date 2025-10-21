/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'

export type SpecStatus = 'TODO' | 'WIP' | 'DONE'

export interface EnrichedSpec {
  id: string
  given: string
  when: string
  then: string
  sourceFile: string // relative path to .json file
  status: SpecStatus
  testFile?: string // path to .spec.ts if exists
  confidence?: 'high' | 'medium' | 'low' // matching confidence
}

export interface TestImplementationAnalysis {
  totalSpecs: number
  todoSpecs: number
  wipSpecs: number
  doneSpecs: number
  todoPercent: number
  wipPercent: number
  donePercent: number
  allSpecs: EnrichedSpec[]
}

/**
 * Analyze test implementation status for all specs in directory
 */
export async function analyzeTestImplementation(
  specsDir: string
): Promise<TestImplementationAnalysis> {
  // Find all .json files with specs arrays
  const allSpecs = await findAllSpecs(specsDir)

  // Categorize each spec
  const enrichedSpecs: EnrichedSpec[] = []
  for (const spec of allSpecs) {
    const status = await categorizeSpec(spec)
    enrichedSpecs.push(status)
  }

  // Calculate statistics
  const todoSpecs = enrichedSpecs.filter((s) => s.status === 'TODO')
  const wipSpecs = enrichedSpecs.filter((s) => s.status === 'WIP')
  const doneSpecs = enrichedSpecs.filter((s) => s.status === 'DONE')

  const totalSpecs = enrichedSpecs.length

  return {
    totalSpecs,
    todoSpecs: todoSpecs.length,
    wipSpecs: wipSpecs.length,
    doneSpecs: doneSpecs.length,
    todoPercent: totalSpecs > 0 ? Math.round((todoSpecs.length / totalSpecs) * 100) : 0,
    wipPercent: totalSpecs > 0 ? Math.round((wipSpecs.length / totalSpecs) * 100) : 0,
    donePercent: totalSpecs > 0 ? Math.round((doneSpecs.length / totalSpecs) * 100) : 0,
    allSpecs: enrichedSpecs.sort(sortByStatusThenId),
  }
}

/**
 * Find all specs in .json files recursively
 */
async function findAllSpecs(
  dir: string
): Promise<Array<Omit<EnrichedSpec, 'status' | 'testFile' | 'confidence'>>> {
  const specs: Array<Omit<EnrichedSpec, 'status' | 'testFile' | 'confidence'>> = []

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.name.endsWith('.json')) {
        // Read JSON file
        const content = await readFile(fullPath, 'utf-8')
        const json = JSON.parse(content)

        // Check if it has specs array
        if (Array.isArray(json.specs)) {
          for (const spec of json.specs) {
            if (spec.id && spec.given && spec.when && spec.then) {
              specs.push({
                id: spec.id,
                given: spec.given,
                when: spec.when,
                then: spec.then,
                sourceFile: relative(process.cwd(), fullPath),
              })
            }
          }
        }
      }
    }
  }

  await walk(dir)
  return specs
}

/**
 * Categorize a spec as TODO/WIP/DONE based on test implementation
 */
async function categorizeSpec(
  spec: Omit<EnrichedSpec, 'status' | 'testFile' | 'confidence'>
): Promise<EnrichedSpec> {
  // Get potential test file path (co-located .spec.ts)
  // Handle both .json and .schema.json files
  let testFilePath = spec.sourceFile.replace(/\.schema\.json$/, '.spec.ts')
  if (testFilePath === spec.sourceFile) {
    // Didn't match .schema.json, try plain .json
    testFilePath = spec.sourceFile.replace(/\.json$/, '.spec.ts')
  }

  // Check if test file exists
  const testFileExists = await fileExists(testFilePath)

  if (!testFileExists) {
    // No test file = TODO
    return {
      ...spec,
      status: 'TODO',
    }
  }

  // Test file exists - check if this spec is implemented
  const testContent = await readFile(testFilePath, 'utf-8')

  // Try to find test for this spec
  const matchResult = await matchSpecToTest(spec, testContent)

  if (!matchResult.found) {
    // Test file exists but this specific spec has no test = TODO
    return {
      ...spec,
      status: 'TODO',
      testFile: testFilePath,
    }
  }

  // Test found - check if it's .fixme() (WIP) or regular (DONE)
  const isFixme = matchResult.testBlock?.includes('test.fixme(') || false

  return {
    ...spec,
    status: isFixme ? 'WIP' : 'DONE',
    testFile: testFilePath,
    confidence: matchResult.confidence,
  }
}

/**
 * Match spec to test in test file content
 * Strategy: Only match tests with spec ID at the start of the test title
 * Example: test('APP-NAME-001: should validate app name', ...)
 */
async function matchSpecToTest(
  spec: Omit<EnrichedSpec, 'status' | 'testFile' | 'confidence'>,
  testContent: string
): Promise<{ found: boolean; testBlock?: string; confidence?: 'high' | 'medium' | 'low' }> {
  // Find all test blocks with their prefixes preserved
  const testRegex = /test(\.fixme)?\(/g
  const matches: Array<{ prefix: string; content: string; startIndex: number }> = []

  let match
  while ((match = testRegex.exec(testContent)) !== null) {
    const prefix = match[0] // 'test(' or 'test.fixme('
    const startIndex = match.index + match[0].length
    matches.push({ prefix, content: '', startIndex })
  }

  // Extract content for each test block (from one test to the next)
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i]!.startIndex
    const end =
      i < matches.length - 1
        ? matches[i + 1]!.startIndex - matches[i + 1]!.prefix.length
        : testContent.length
    matches[i]!.content = testContent.slice(start, end)
  }

  for (const { prefix, content } of matches) {
    // Check if test has @spec tag
    if (!content.includes("{ tag: '@spec' }")) {
      continue
    }

    // Extract test description/title (first argument to test())
    // Match: 'test title' or "test title" or `test title`
    const titleMatch = content.match(/^\s*['"`]([^'"`]+)['"`]/)
    const testTitle = titleMatch?.[1] || ''

    // ONLY match if spec ID is at the START of the test title
    // Examples:
    //   ✅ "APP-NAME-001: should validate app name"
    //   ✅ "APP-NAME-001 - validates app name"
    //   ❌ "validates app name (APP-NAME-001)" - ID not at start
    if (testTitle.startsWith(spec.id)) {
      return { found: true, testBlock: `${prefix}${content}`, confidence: 'high' }
    }
  }

  return { found: false }
}

/**
 * Check if file exists
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

/**
 * Sort specs by status (DONE → WIP → TODO), then by ID
 */
function sortByStatusThenId(a: EnrichedSpec, b: EnrichedSpec): number {
  // Status priority: DONE (0), WIP (1), TODO (2)
  const statusPriority: Record<SpecStatus, number> = {
    DONE: 0,
    WIP: 1,
    TODO: 2,
  }

  const statusDiff = statusPriority[a.status] - statusPriority[b.status]
  if (statusDiff !== 0) {
    return statusDiff
  }

  // Same status - sort by ID
  return a.id.localeCompare(b.id)
}
