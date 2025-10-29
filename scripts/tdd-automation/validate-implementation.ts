#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { execSync } from 'node:child_process'
import { readFileSync, appendFileSync } from 'node:fs'
import { Effect, Console } from 'effect'

/**
 * Validates the implementation from the TDD automation pipeline
 * Runs tests and code quality checks
 */

interface ValidationResult {
  testFile: string
  testsPass: boolean
  regressionPass: boolean
  lintPass: boolean
  typecheckPass: boolean
  licensePass: boolean
  overallSuccess: boolean
  fixedCount: number
  remainingFixme: number
  errors: string[]
}

// Run a command and return success/failure
const runCommand = (command: string, description: string): Effect.Effect<boolean> =>
  Effect.gen(function* () {
    yield* Console.log(`  Running: ${description}...`)
    try {
      execSync(command, { stdio: 'inherit' })
      yield* Console.log(`  ✅ ${description} passed`)
      return true
    } catch {
      yield* Console.log(`  ❌ ${description} failed`)
      return false
    }
  })

// Count fixme tests in a file
const countFixmeTests = (filePath: string): number => {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const matches = content.match(/test\.fixme\(|it\.fixme\(/g)
    return matches ? matches.length : 0
  } catch {
    return 0
  }
}

// Main validation logic
const validateImplementation = (testFile: string) =>
  Effect.gen(function* () {
    yield* Console.log('✅ Validating TDD Implementation...')
    yield* Console.log(`📁 Test file: ${testFile}`)
    yield* Console.log('')

    const errors: string[] = []

    // Count initial fixme tests
    const initialFixme = Number(process.env.INITIAL_FIXME_COUNT || '0')
    const currentFixme = countFixmeTests(testFile)
    const fixedCount = initialFixme - currentFixme

    yield* Console.log(`📊 Test Progress:`)
    yield* Console.log(`  Initial fixme tests: ${initialFixme}`)
    yield* Console.log(`  Current fixme tests: ${currentFixme}`)
    yield* Console.log(`  Tests fixed: ${fixedCount}`)
    yield* Console.log('')

    // Run validation checks
    yield* Console.log('🧪 Running Validation Checks:')

    // 1. Run the specific test file
    const testsPass = yield* runCommand(
      `CLAUDECODE=1 bun test:e2e ${testFile}`,
      'E2E tests for modified file'
    )
    if (!testsPass) errors.push('E2E tests failed')

    // 2. Run regression tests
    const regressionPass = yield* runCommand('bun test:e2e:regression', 'Regression tests')
    if (!regressionPass) errors.push('Regression tests failed')

    // 3. Run ESLint
    const lintPass = yield* runCommand('bun run lint', 'ESLint')
    if (!lintPass) errors.push('ESLint failed')

    // 4. Run TypeScript compiler
    const typecheckPass = yield* runCommand('bun run typecheck', 'TypeScript')
    if (!typecheckPass) errors.push('TypeScript compilation failed')

    // 5. Check copyright headers
    const licensePass = yield* runCommand('bun run license', 'Copyright headers')
    if (!licensePass) errors.push('Missing copyright headers')

    // Determine overall success
    const overallSuccess = testsPass && regressionPass && lintPass && typecheckPass && licensePass

    const result: ValidationResult = {
      testFile,
      testsPass,
      regressionPass,
      lintPass,
      typecheckPass,
      licensePass,
      overallSuccess,
      fixedCount,
      remainingFixme: currentFixme,
      errors,
    }

    // Output summary
    yield* Console.log('')
    yield* Console.log('📋 Validation Summary:')
    yield* Console.log(`  Test file: ${testsPass ? '✅' : '❌'}`)
    yield* Console.log(`  Regression: ${regressionPass ? '✅' : '❌'}`)
    yield* Console.log(`  ESLint: ${lintPass ? '✅' : '❌'}`)
    yield* Console.log(`  TypeScript: ${typecheckPass ? '✅' : '❌'}`)
    yield* Console.log(`  License: ${licensePass ? '✅' : '❌'}`)
    yield* Console.log('')

    if (overallSuccess) {
      yield* Console.log('✅ All validation checks passed!')
      yield* Console.log(`🎉 Successfully fixed ${fixedCount} tests`)
    } else {
      yield* Console.log('❌ Validation failed!')
      yield* Console.log('Errors:')
      errors.forEach((error) => console.log(`  - ${error}`))
    }

    // Output for GitHub Actions
    if (process.env.GITHUB_OUTPUT) {
      const output = `success=${overallSuccess}
fixed_count=${fixedCount}
remaining_fixme=${currentFixme}`

      appendFileSync(process.env.GITHUB_OUTPUT, output)
      yield* Console.log('')
      yield* Console.log('✅ GitHub Actions output set')
    }

    return result
  })

// Main entry point
const main = Effect.gen(function* () {
  const testFile = process.argv[2]

  if (!testFile) {
    yield* Console.log('❌ Error: Please provide a test file path')
    yield* Console.log('Usage: bun run validate-implementation.ts <test-file>')
    process.exit(1)
  }

  const result = yield* validateImplementation(testFile)

  if (!result.overallSuccess) {
    process.exit(1)
  }
})

// Run validation
Effect.runPromise(main).catch((error) => {
  console.error('❌ Error during validation:', error)
  process.exit(1)
})
