/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

export interface ImplementedTest {
  filePath: string
  testName: string
  tag: string
  lineNumber: number
  gwtPattern?: {
    given: string
    when: string
    then: string
  }
}

export interface TestScanResult {
  totalTests: number
  testsByTag: Map<string, number>
  testsByFile: Map<string, number>
  tests: ImplementedTest[]
}

export function scanAllTests(testsDir: string): TestScanResult {
  const tests: ImplementedTest[] = []

  function scanDirectory(dirPath: string) {
    const entries = readdirSync(dirPath)

    for (const entry of entries) {
      const fullPath = join(dirPath, entry)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        scanDirectory(fullPath)
      } else if (stat.isFile() && entry.endsWith('.spec.ts')) {
        const fileTests = extractTestsFromFile(fullPath)
        tests.push(...fileTests)
      }
    }
  }

  scanDirectory(testsDir)

  const testsByTag = new Map<string, number>()
  const testsByFile = new Map<string, number>()

  for (const test of tests) {
    testsByTag.set(test.tag, (testsByTag.get(test.tag) || 0) + 1)
    testsByFile.set(test.filePath, (testsByFile.get(test.filePath) || 0) + 1)
  }

  return {
    totalTests: tests.length,
    testsByTag,
    testsByFile,
    tests,
  }
}

function extractTestsFromFile(filePath: string): ImplementedTest[] {
  const tests: ImplementedTest[] = []
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!

    // Match test( but NOT test.fixme(, test.skip(, or test.only(
    // We only want actual implemented tests (test.only is ok, it's just focused)
    if (/^\s*test\s*\(/.test(line) && !/^\s*test\.(fixme|skip)\s*\(/.test(line)) {
      let testName = ''
      let tag = ''
      const testLineNumber = i + 1

      const testBlock = []
      for (let j = i; j < Math.min(i + 10, lines.length); j++) {
        testBlock.push(lines[j])
      }
      const combinedLines = testBlock.join(' ')

      const nameMatch = combinedLines.match(/test(?:\.only)?\s*\(\s*['"`]([^'"`]+)['"`]/)
      if (nameMatch) {
        testName = nameMatch[1]!
      }

      const tagMatch = combinedLines.match(/\{\s*tag:\s*['"`](@[a-z]+)['"`]/)
      if (tagMatch) {
        tag = tagMatch[1]!
      }

      if (testName && tag) {
        const gwtPattern = extractGWTPattern(lines, i)

        tests.push({
          filePath,
          testName,
          tag,
          lineNumber: testLineNumber,
          gwtPattern,
        })
      }
    }
  }

  return tests
}

function extractGWTPattern(
  lines: string[],
  testLineIndex: number
): { given: string; when: string; then: string } | undefined {
  const startLine = Math.max(0, testLineIndex - 20)
  const endLine = Math.min(lines.length, testLineIndex + 50)

  let given = ''
  let when = ''
  let then = ''

  for (let i = startLine; i < endLine; i++) {
    const line = lines[i]!

    const givenMatch = line.match(/\/\/\s*GIVEN:\s*(.+)/i) || line.match(/\*\s*GIVEN:\s*(.+)/i)
    if (givenMatch) {
      given = givenMatch[1]!.trim()
    }

    const whenMatch = line.match(/\/\/\s*WHEN:\s*(.+)/i) || line.match(/\*\s*WHEN:\s*(.+)/i)
    if (whenMatch) {
      when = whenMatch[1]!.trim()
    }

    const thenMatch = line.match(/\/\/\s*THEN:\s*(.+)/i) || line.match(/\*\s*THEN:\s*(.+)/i)
    if (thenMatch) {
      then = thenMatch[1]!.trim()
    }
  }

  if (given && when && then) {
    return { given, when, then }
  }

  return undefined
}

export function matchUserStoryToTest(
  userStory: string,
  test: ImplementedTest
): { matched: boolean; confidence: number } {
  if (!test.gwtPattern) {
    return { matched: false, confidence: 0 }
  }

  const storyGWT = parseUserStoryGWT(userStory)
  if (!storyGWT) {
    return { matched: false, confidence: 0 }
  }

  const givenSimilarity = calculateSimilarity(storyGWT.given, test.gwtPattern.given)
  const whenSimilarity = calculateSimilarity(storyGWT.when, test.gwtPattern.when)
  const thenSimilarity = calculateSimilarity(storyGWT.then, test.gwtPattern.then)

  const confidence = (givenSimilarity + whenSimilarity + thenSimilarity) / 3

  return {
    matched: confidence >= 0.7,
    confidence: Math.round(confidence * 100) / 100,
  }
}

function parseUserStoryGWT(
  story: string
): { given: string; when: string; then: string } | undefined {
  const givenMatch = story.match(/GIVEN\s+(.+?)\s+WHEN/i)
  const whenMatch = story.match(/WHEN\s+(.+?)\s+THEN/i)
  const thenMatch = story.match(/THEN\s+(.+)/i)

  if (givenMatch && whenMatch && thenMatch) {
    return {
      given: givenMatch[1]!.trim(),
      when: whenMatch[1]!.trim(),
      then: thenMatch[1]!.trim(),
    }
  }

  return undefined
}

function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/)
  const words2 = text2.toLowerCase().split(/\s+/)

  const set1 = new Set(words1)
  const set2 = new Set(words2)

  const intersection = new Set([...set1].filter((word) => set2.has(word)))
  const union = new Set([...set1, ...set2])

  if (union.size === 0) {
    return 0
  }

  return intersection.size / union.size
}

export function groupTestsByProperty(tests: ImplementedTest[]): Map<string, ImplementedTest[]> {
  const groups = new Map<string, ImplementedTest[]>()

  for (const test of tests) {
    const propertyPath = inferPropertyPathFromFilePath(test.filePath)
    const existing = groups.get(propertyPath) || []
    existing.push(test)
    groups.set(propertyPath, existing)
  }

  return groups
}

function inferPropertyPathFromFilePath(filePath: string): string {
  const normalized = filePath
    .replace(/^.*tests\//, '')
    .replace(/\.spec\.ts$/, '')
    .replace(/\\/g, '/')

  return normalized.replace(/\//g, '.')
}
