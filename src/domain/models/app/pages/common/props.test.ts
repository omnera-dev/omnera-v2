/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { PropsSchema } from './props'

describe('PropsSchema', () => {
  test('should accept props with string value', () => {
    // GIVEN: Props with string property
    const props = {
      className: 'text-center mb-4',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PropsSchema)(props)

    // THEN: String property should be accepted
    expect(result.className).toBe('text-center mb-4')
  })

  test('should accept props with number value', () => {
    // GIVEN: Props with numeric property
    const props = {
      size: 16,
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PropsSchema)(props)

    // THEN: Number property should be accepted
    expect(result.size).toBe(16)
  })

  test('should accept props with boolean value', () => {
    // GIVEN: Props with boolean property
    const props = {
      enabled: true,
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PropsSchema)(props)

    // THEN: Boolean property should be accepted
    expect(result.enabled).toBe(true)
  })

  test('should accept props with object value', () => {
    // GIVEN: Props with nested object
    const props = {
      style: { padding: '1rem', margin: '2rem' },
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PropsSchema)(props)

    // THEN: Object property should be accepted
    expect(result.style).toEqual({ padding: '1rem', margin: '2rem' })
  })

  test('should accept props with array value', () => {
    // GIVEN: Props with array
    const props = {
      items: ['one', 'two', 'three'],
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PropsSchema)(props)

    // THEN: Array property should be accepted
    expect(result.items).toEqual(['one', 'two', 'three'])
  })

  test('should accept props with variable reference', () => {
    // GIVEN: Props with $variable syntax
    const props = {
      text: 'Welcome to $siteName',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PropsSchema)(props)

    // THEN: Variable reference should be accepted
    expect(result.text).toBe('Welcome to $siteName')
  })

  test('should accept props with multiple properties of different types', () => {
    // GIVEN: Props with mixed types
    const props = {
      className: 'text-center mb-4',
      size: 16,
      enabled: true,
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PropsSchema)(props)

    // THEN: All property types should be accepted
    expect(result.className).toBe('text-center mb-4')
    expect(result.size).toBe(16)
    expect(result.enabled).toBe(true)
  })

  test('should accept props with camelCase property names', () => {
    // GIVEN: Props with camelCase keys
    const props = {
      maxWidth: 'max-w-7xl',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PropsSchema)(props)

    // THEN: All camelCase keys should be accepted
    expect(result.maxWidth).toBe('max-w-7xl')
    expect(result.minHeight).toBe('100vh')
    expect(result.backgroundColor).toBe('#ffffff')
  })

  test('should accept props referencing theme tokens', () => {
    // GIVEN: Props with multiple variable references
    const props = {
      color: '$primaryColor',
      text: 'Hello $userName',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PropsSchema)(props)

    // THEN: Multiple variable references should be accepted
    expect(result.color).toBe('$primaryColor')
    expect(result.text).toBe('Hello $userName')
  })

  test('should accept empty props object', () => {
    // GIVEN: Empty props
    const props = {}

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PropsSchema)(props)

    // THEN: Empty object should be accepted
    expect(result).toEqual({})
  })
})
