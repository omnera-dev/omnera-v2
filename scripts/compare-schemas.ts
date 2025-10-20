#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Schema Comparison Tool
 *
 * Compares specification schema (specs/app.schema.json) with implementation schema
 * (schemas/0.0.1/app.schema.json) to generate a detailed diff for roadmap generation.
 *
 * This tool:
 * 1. Loads both spec and implementation schemas
 * 2. Resolves $ref pointers in both schemas
 * 3. Performs deep structural comparison
 * 4. Identifies missing, mismatched, and extra properties
 * 5. Calculates coverage and accuracy metrics
 * 6. Outputs structured diff data for roadmap generation
 *
 * Usage: bun run scripts/compare-schemas.ts
 */

import { join } from 'node:path'

/**
 * Property difference descriptor
 */
interface PropertyDiff {
  readonly path: string // JSONPath (e.g., "infrastructure.auth.signUp.endpoint")
  readonly specValue: unknown // Value in specification schema
  readonly implValue: unknown // Value in implementation schema
  readonly reason: string // Human-readable reason for difference
}

/**
 * Schema diff result
 */
interface SchemaDiff {
  readonly missing: readonly PropertyDiff[] // In spec, not in impl
  readonly mismatched: readonly PropertyDiff[] // Different between spec and impl
  readonly extra: readonly PropertyDiff[] // In impl, not in spec
}

/**
 * Comparison metrics
 */
interface ComparisonMetrics {
  readonly totalProperties: {
    readonly spec: number
    readonly impl: number
  }
  readonly coverage: {
    readonly percent: number
    readonly implemented: number
    readonly missing: number
  }
  readonly accuracy: {
    readonly percent: number
    readonly correct: number
    readonly mismatched: number
  }
}

/**
 * Complete comparison result
 */
export interface ComparisonResult {
  readonly diff: SchemaDiff
  readonly metrics: ComparisonMetrics
  readonly timestamp: string
}

/**
 * Count total properties in a schema (recursive)
 */
function countProperties(obj: unknown, path = ''): number {
  if (obj === null || obj === undefined) {
    return 0
  }

  if (typeof obj !== 'object') {
    return 1
  }

  if (Array.isArray(obj)) {
    return obj.reduce((sum, item, index) => sum + countProperties(item, `${path}[${index}]`), 0)
  }

  return Object.entries(obj).reduce((sum, [key, value]) => {
    // Skip metadata properties
    if (key.startsWith('$') || key.startsWith('x-')) {
      return sum
    }
    return sum + 1 + countProperties(value, path ? `${path}.${key}` : key)
  }, 0)
}

/**
 * Deep comparison of two objects
 */
function compareObjects(
  spec: unknown,
  impl: unknown,
  path = '',
  diffs: {
    missing: PropertyDiff[]
    mismatched: PropertyDiff[]
    extra: PropertyDiff[]
  }
): void {
  // Handle null/undefined
  if (spec === null || spec === undefined) {
    if (impl !== null && impl !== undefined) {
      diffs.extra.push({
        path,
        specValue: spec,
        implValue: impl,
        reason: 'Property exists in implementation but not in specification',
      })
    }
    return
  }

  if (impl === null || impl === undefined) {
    diffs.missing.push({
      path,
      specValue: spec,
      implValue: impl,
      reason: 'Property defined in specification but missing in implementation',
    })
    return
  }

  // Handle primitive types
  if (typeof spec !== 'object' || typeof impl !== 'object') {
    if (spec !== impl) {
      diffs.mismatched.push({
        path,
        specValue: spec,
        implValue: impl,
        reason: `Value mismatch: spec="${spec}", impl="${impl}"`,
      })
    }
    return
  }

  // Handle arrays
  if (Array.isArray(spec) && Array.isArray(impl)) {
    const maxLength = Math.max(spec.length, impl.length)
    for (let i = 0; i < maxLength; i++) {
      const itemPath = `${path}[${i}]`
      if (i >= spec.length) {
        diffs.extra.push({
          path: itemPath,
          specValue: undefined,
          implValue: impl[i],
          reason: 'Array item exists in implementation but not in specification',
        })
      } else if (i >= impl.length) {
        diffs.missing.push({
          path: itemPath,
          specValue: spec[i],
          implValue: undefined,
          reason: 'Array item defined in specification but missing in implementation',
        })
      } else {
        compareObjects(spec[i], impl[i], itemPath, diffs)
      }
    }
    return
  }

  if (Array.isArray(spec) !== Array.isArray(impl)) {
    diffs.mismatched.push({
      path,
      specValue: spec,
      implValue: impl,
      reason: `Type mismatch: spec is ${Array.isArray(spec) ? 'array' : 'object'}, impl is ${Array.isArray(impl) ? 'array' : 'object'}`,
    })
    return
  }

  // Handle objects
  const specObj = spec as Record<string, unknown>
  const implObj = impl as Record<string, unknown>

  // Check for missing properties (in spec, not in impl)
  for (const key of Object.keys(specObj)) {
    // Skip metadata properties
    if (key.startsWith('$') || key.startsWith('x-')) {
      continue
    }

    const propPath = path ? `${path}.${key}` : key

    if (!(key in implObj)) {
      diffs.missing.push({
        path: propPath,
        specValue: specObj[key],
        implValue: undefined,
        reason: 'Property defined in specification but not present in implementation',
      })
    } else {
      // Recursively compare nested properties
      compareObjects(specObj[key], implObj[key], propPath, diffs)
    }
  }

  // Check for extra properties (in impl, not in spec)
  for (const key of Object.keys(implObj)) {
    // Skip metadata properties
    if (key.startsWith('$') || key.startsWith('x-')) {
      continue
    }

    if (!(key in specObj)) {
      const propPath = path ? `${path}.${key}` : key
      diffs.extra.push({
        path: propPath,
        specValue: undefined,
        implValue: implObj[key],
        reason: 'Property exists in implementation but not defined in specification',
      })
    }
  }
}

/**
 * Load and compare schemas
 */
export async function compareSchemas(): Promise<ComparisonResult> {
  const cwd = process.cwd()

  // Load specification schema
  const specPath = join(cwd, 'specs', 'app.schema.json')
  const specFile = Bun.file(specPath)
  if (!(await specFile.exists())) {
    throw new Error(`Specification schema not found at: ${specPath}`)
  }
  const specSchema = await specFile.json()

  // Load implementation schema
  const implPath = join(cwd, 'schemas', '0.0.1', 'app.schema.json')
  const implFile = Bun.file(implPath)
  if (!(await implFile.exists())) {
    throw new Error(`Implementation schema not found at: ${implPath}`)
  }
  const implSchema = await implFile.json()

  // Perform comparison
  const diffs: {
    missing: PropertyDiff[]
    mismatched: PropertyDiff[]
    extra: PropertyDiff[]
  } = {
    missing: [],
    mismatched: [],
    extra: [],
  }

  compareObjects(specSchema.properties, implSchema.properties, '', diffs)

  // Calculate metrics
  const specPropertyCount = countProperties(specSchema.properties)
  const implPropertyCount = countProperties(implSchema.properties)

  const implemented = specPropertyCount - diffs.missing.length
  const coveragePercent =
    specPropertyCount > 0 ? Math.round((implemented / specPropertyCount) * 100) : 0

  const correct = implemented - diffs.mismatched.length
  const accuracyPercent = implemented > 0 ? Math.round((correct / implemented) * 100) : 0

  return {
    diff: {
      missing: diffs.missing,
      mismatched: diffs.mismatched,
      extra: diffs.extra,
    },
    metrics: {
      totalProperties: {
        spec: specPropertyCount,
        impl: implPropertyCount,
      },
      coverage: {
        percent: coveragePercent,
        implemented,
        missing: diffs.missing.length,
      },
      accuracy: {
        percent: accuracyPercent,
        correct,
        mismatched: diffs.mismatched.length,
      },
    },
    timestamp: new Date().toISOString(),
  }
}

/**
 * Format comparison result as human-readable output
 */
export function formatComparisonResult(result: ComparisonResult): string {
  const { diff, metrics } = result
  const lines: string[] = []

  lines.push('='.repeat(80))
  lines.push('SCHEMA COMPARISON REPORT')
  lines.push('='.repeat(80))
  lines.push('')
  lines.push(`Timestamp: ${result.timestamp}`)
  lines.push('')

  // Metrics
  lines.push('METRICS:')
  lines.push(`  Total Properties (Spec): ${metrics.totalProperties.spec}`)
  lines.push(`  Total Properties (Impl): ${metrics.totalProperties.impl}`)
  lines.push('')
  lines.push(
    `  Coverage: ${metrics.coverage.percent}% (${metrics.coverage.implemented}/${metrics.totalProperties.spec} implemented, ${metrics.coverage.missing} missing)`
  )
  lines.push(
    `  Accuracy: ${metrics.accuracy.percent}% (${metrics.accuracy.correct} correct, ${metrics.accuracy.mismatched} mismatched)`
  )
  lines.push('')

  // Missing properties
  if (diff.missing.length > 0) {
    lines.push(`MISSING PROPERTIES (${diff.missing.length}):`)
    lines.push('  Properties defined in specification but not implemented:')
    for (const item of diff.missing) {
      lines.push(`  - ${item.path}`)
      lines.push(`    Reason: ${item.reason}`)
      if (item.specValue !== undefined) {
        lines.push(`    Spec value: ${JSON.stringify(item.specValue)}`)
      }
    }
    lines.push('')
  }

  // Mismatched properties
  if (diff.mismatched.length > 0) {
    lines.push(`MISMATCHED PROPERTIES (${diff.mismatched.length}):`)
    lines.push('  Properties with different values between spec and implementation:')
    for (const item of diff.mismatched) {
      lines.push(`  - ${item.path}`)
      lines.push(`    Reason: ${item.reason}`)
      lines.push(`    Spec: ${JSON.stringify(item.specValue)}`)
      lines.push(`    Impl: ${JSON.stringify(item.implValue)}`)
    }
    lines.push('')
  }

  // Extra properties
  if (diff.extra.length > 0) {
    lines.push(`EXTRA PROPERTIES (${diff.extra.length}):`)
    lines.push('  Properties in implementation but not in specification:')
    for (const item of diff.extra) {
      lines.push(`  - ${item.path}`)
      lines.push(`    Reason: ${item.reason}`)
      if (item.implValue !== undefined) {
        lines.push(`    Impl value: ${JSON.stringify(item.implValue)}`)
      }
    }
    lines.push('')
  }

  lines.push('='.repeat(80))

  return lines.join('\n')
}

/**
 * Main execution
 */
if (import.meta.main) {
  try {
    console.log('🔍 Comparing specification and implementation schemas...\n')

    const result = await compareSchemas()
    const output = formatComparisonResult(result)

    console.log(output)

    // Exit with error code if there are differences
    const hasDifferences =
      result.diff.missing.length > 0 ||
      result.diff.mismatched.length > 0 ||
      result.diff.extra.length > 0

    if (hasDifferences) {
      console.log('\n⚠️  Differences found between specification and implementation')
      process.exit(1)
    } else {
      console.log('\n✅ Specification and implementation are in sync!')
      process.exit(0)
    }
  } catch (error) {
    console.error('❌ Error comparing schemas:', error)
    process.exit(1)
  }
}
