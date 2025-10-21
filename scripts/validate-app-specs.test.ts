/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, expect, it } from 'bun:test'
import { validateSpecsStructure } from './validate-app-specs'

describe('validate-specs-structure', () => {
  it('should validate specs/app/ structure without fatal errors', async () => {
    const result = await validateSpecsStructure()

    // Should find schemas
    expect(result.totalSchemas).toBeGreaterThan(0)

    // Should find specs
    expect(result.totalSpecs).toBeGreaterThan(0)

    // Results should be defined
    expect(result.errors).toBeDefined()
    expect(result.warnings).toBeDefined()
  })

  it('should return validation result with expected structure', async () => {
    const result = await validateSpecsStructure()

    expect(result).toHaveProperty('errors')
    expect(result).toHaveProperty('warnings')
    expect(result).toHaveProperty('totalSchemas')
    expect(result).toHaveProperty('totalSpecs')

    expect(Array.isArray(result.errors)).toBe(true)
    expect(Array.isArray(result.warnings)).toBe(true)
    expect(typeof result.totalSchemas).toBe('number')
    expect(typeof result.totalSpecs).toBe('number')
  })

  it('should report errors with proper structure', async () => {
    const result = await validateSpecsStructure()

    if (result.errors.length > 0) {
      const firstError = result.errors[0]

      expect(firstError).toHaveProperty('file')
      expect(firstError).toHaveProperty('type')
      expect(firstError).toHaveProperty('message')
      expect(firstError.type).toBe('error')
      expect(typeof firstError.file).toBe('string')
      expect(typeof firstError.message).toBe('string')
    }
  })

  it('should report warnings with proper structure', async () => {
    const result = await validateSpecsStructure()

    if (result.warnings.length > 0) {
      const firstWarning = result.warnings[0]

      expect(firstWarning).toHaveProperty('file')
      expect(firstWarning).toHaveProperty('type')
      expect(firstWarning).toHaveProperty('message')
      expect(firstWarning.type).toBe('warning')
      expect(typeof firstWarning.file).toBe('string')
      expect(typeof firstWarning.message).toBe('string')
    }
  })
})
