/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

interface Violation {
  file: string
  testName: string
  line: number
  missingComments: string[]
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface ValidationResult {
  filesChecked: number
  testsChecked: number
  violations: Violation[]
  compliantFiles: string[]
  violatingFiles: string[]
}

/**
 * Recursively find all .spec.ts files
 */
async function findSpecFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await findSpecFiles(fullPath)))
    } else if (entry.isFile() && entry.name.endsWith('.spec.ts')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Check if a test has GIVEN-WHEN-THEN structure
 */
function checkTestStructure(
  fileContent: string,
  filePath: string
): { violations: Violation[]; testsCount: number } {
  const violations: Violation[] = []
  let testsCount = 0

  // Match test blocks with @spec tag
  const testRegex = /test(?:\.fixme)?\(\s*['"`]([^'"`]+)['"`]\s*,\s*\{[^}]*tag:\s*['"`]@spec['"`][^}]*\}\s*,\s*async\s*\([^)]*\)\s*=>\s*\{([^]*?)\n\s*\}\s*\)/g

  let match: RegExpExecArray | null

  while ((match = testRegex.exec(fileContent)) !== null) {
    testsCount++
    const testName = match[1]
    const testBody = match[2]
    const testStartIndex = match.index
    const linesBeforeTest = fileContent.substring(0, testStartIndex).split('\n').length

    // Check for GIVEN-WHEN-THEN comments
    const hasGiven = /\/\/\s*GIVEN:/i.test(testBody)
    const hasWhen = /\/\/\s*WHEN:/i.test(testBody)
    const hasThen = /\/\/\s*THEN:/i.test(testBody)

    const missingComments: string[] = []
    if (!hasGiven) missingComments.push('GIVEN')
    if (!hasWhen) missingComments.push('WHEN')
    if (!hasThen) missingComments.push('THEN')

    if (missingComments.length > 0) {
      violations.push({
        file: filePath,
        testName,
        line: linesBeforeTest,
        missingComments,
        severity: 'HIGH',
      })
    }
  }

  return { violations, testsCount }
}

/**
 * Main validation function
 */
async function validateSpecFiles(): Promise<ValidationResult> {
  const specsDir = join(process.cwd(), 'specs')
  const specFiles = await findSpecFiles(specsDir)

  const result: ValidationResult = {
    filesChecked: specFiles.length,
    testsChecked: 0,
    violations: [],
    compliantFiles: [],
    violatingFiles: [],
  }

  for (const filePath of specFiles) {
    const content = await readFile(filePath, 'utf-8')
    const { violations, testsCount } = checkTestStructure(content, filePath)

    result.testsChecked += testsCount

    if (violations.length > 0) {
      result.violations.push(...violations)
      result.violatingFiles.push(filePath)
    } else if (testsCount > 0) {
      result.compliantFiles.push(filePath)
    }
  }

  return result
}

/**
 * Generate report
 */
function generateReport(result: ValidationResult): string {
  const { filesChecked, testsChecked, violations, compliantFiles, violatingFiles } = result

  const uniqueViolatingFiles = [...new Set(violatingFiles)]
  const status = violations.length === 0 ? '✅ COMPLIANT' : '❌ VIOLATIONS FOUND'

  let report = `
# E2E Test Structure Compliance Report

**Timestamp**: ${new Date().toISOString()}
**Scope**: specs/ (${filesChecked} files checked)
**Status**: ${status}

## Summary

**Files Checked**: ${filesChecked}
**Tests Checked**: ${testsChecked}
**Violations**: ${violations.length}
**Compliant Files**: ${compliantFiles.length}
**Violating Files**: ${uniqueViolatingFiles.length}

## Best Practice Reference

According to e2e-test-generator skill documentation, all @spec tests MUST include GIVEN-WHEN-THEN comment structure:

\`\`\`typescript
test(
  'SPEC-ID: should do something',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: context description
    await startServerWithSchema({ ... })

    // WHEN: action description
    await page.goto('/')

    // THEN: expected outcome
    await expect(...).toBeVisible()
  }
)
\`\`\`

**Reference**: @.claude/skills/e2e-test-generator/SKILL.md (lines 215-233)

## Violations by File

`

  if (violations.length === 0) {
    report += '\n🎉 No violations found! All tests follow GIVEN-WHEN-THEN structure.\n'
  } else {
    // Group violations by file
    const violationsByFile = new Map<string, Violation[]>()

    for (const violation of violations) {
      const fileViolations = violationsByFile.get(violation.file) || []
      fileViolations.push(violation)
      violationsByFile.set(violation.file, fileViolations)
    }

    let fileIndex = 1
    for (const [file, fileViolations] of violationsByFile) {
      const relativeFile = file.replace(process.cwd() + '/', '')

      report += `\n### ${fileIndex}. ${relativeFile}\n\n`
      report += `**Tests with violations**: ${fileViolations.length}\n\n`

      for (const violation of fileViolations) {
        report += `#### Test: "${violation.testName}"\n`
        report += `- **Line**: ${violation.line}\n`
        report += `- **Severity**: 🔴 ${violation.severity}\n`
        report += `- **Missing Comments**: ${violation.missingComments.join(', ')}\n`
        report += `- **Required**: Add GIVEN-WHEN-THEN comment structure\n\n`
      }

      fileIndex++
    }

    report += `\n## Recommendations\n\n`
    report += `### High Priority (Fix Immediately)\n\n`
    report += `Fix all ${violations.length} tests missing GIVEN-WHEN-THEN structure across ${uniqueViolatingFiles.length} files.\n\n`
    report += `**Why This Matters**:\n`
    report += `- Tests serve as executable documentation\n`
    report += `- GIVEN-WHEN-THEN clarifies test intent\n`
    report += `- Follows BDD (Behavior-Driven Development) best practices\n`
    report += `- Required by e2e-test-generator skill for consistency\n\n`

    report += `**How to Fix**:\n\n`
    report += `Add three comment lines to each @spec test:\n\n`
    report += `\`\`\`typescript\n`
    report += `// GIVEN: [describe the preconditions/context]\n`
    report += `// WHEN: [describe the action being tested]\n`
    report += `// THEN: [describe the expected outcome]\n`
    report += `\`\`\`\n\n`
  }

  report += `\n## Compliant Files (${compliantFiles.length})\n\n`

  if (compliantFiles.length > 0) {
    for (const file of compliantFiles) {
      const relativeFile = file.replace(process.cwd() + '/', '')
      report += `- ✅ ${relativeFile}\n`
    }
  } else {
    report += 'None\n'
  }

  return report
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Validating E2E test structure...\n')

  const result = await validateSpecFiles()
  const report = generateReport(result)

  console.log(report)

  // Exit with error code if violations found
  if (result.violations.length > 0) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('❌ Validation failed:', error)
  process.exit(1)
})
