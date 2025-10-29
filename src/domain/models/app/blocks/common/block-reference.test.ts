/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import {
  BlockReferenceNameSchema,
  BlockVarsSchema,
  BlockReferenceSchema,
} from './block-reference'

describe('BlockReferenceNameSchema', () => {
  test('should accept kebab-case names', () => {
    // GIVEN: Valid kebab-case block names
    const names = ['icon-badge', 'section-header', 'call-to-action'] as const

    // WHEN: Schema validation is performed on each
    const results = names.map((name) => Schema.decodeUnknownSync(BlockReferenceNameSchema)(name))

    // THEN: All names should be accepted
    expect(results).toEqual([...names])
  })

  test('should accept names starting with lowercase letter', () => {
    // GIVEN: Name starting with lowercase
    const name = 'button'

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockReferenceNameSchema)(name)

    // THEN: Name should be accepted
    expect(result).toBe('button')
  })

  test('should accept names with numbers', () => {
    // GIVEN: Names with numbers
    const names = ['block1', 'section-2', 'card-3']

    // WHEN: Schema validation is performed on each
    const results = names.map((name) => Schema.decodeUnknownSync(BlockReferenceNameSchema)(name))

    // THEN: All names should be accepted
    expect(results).toEqual(names)
  })

  test('should reject names starting with uppercase', () => {
    // GIVEN: Name starting with uppercase
    const name = 'IconBadge'

    // WHEN: Schema validation is performed
    // THEN: Name should be rejected
    expect(() => Schema.decodeUnknownSync(BlockReferenceNameSchema)(name)).toThrow()
  })

  test('should reject names with underscores', () => {
    // GIVEN: Name with underscores
    const name = 'icon_badge'

    // WHEN: Schema validation is performed
    // THEN: Name should be rejected (only hyphens allowed)
    expect(() => Schema.decodeUnknownSync(BlockReferenceNameSchema)(name)).toThrow()
  })
})

describe('BlockVarsSchema', () => {
  test('should accept string variables', () => {
    // GIVEN: Variables with string values
    const vars = {
      color: 'orange',
      icon: 'users',
      text: '6 à 15 personnes',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockVarsSchema)(vars)

    // THEN: All string variables should be accepted
    expect(result).toEqual(vars)
  })

  test('should accept number variables', () => {
    // GIVEN: Variables with number values
    const vars = {
      count: 10,
      size: 24,
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockVarsSchema)(vars)

    // THEN: Number variables should be accepted
    expect(result).toEqual(vars)
  })

  test('should accept boolean variables', () => {
    // GIVEN: Variables with boolean values
    const vars = {
      enabled: true,
      visible: false,
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockVarsSchema)(vars)

    // THEN: Boolean variables should be accepted
    expect(result).toEqual(vars)
  })

  test('should accept mixed variable types', () => {
    // GIVEN: Variables with mixed value types
    const vars = {
      color: 'red',
      count: 5,
      enabled: true,
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockVarsSchema)(vars)

    // THEN: All variable types should be accepted
    expect(result).toEqual(vars)
  })

  test('should accept empty vars object', () => {
    // GIVEN: Empty variables
    const vars = {}

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockVarsSchema)(vars)

    // THEN: Empty object should be accepted
    expect(result).toEqual({})
  })
})

describe('BlockReferenceSchema', () => {
  test('should accept valid block reference', () => {
    // GIVEN: Valid block reference with $ref and vars
    const reference = {
      $ref: 'icon-badge',
      vars: {
        color: 'orange',
        icon: 'users',
        text: '6 à 15 personnes',
      },
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockReferenceSchema)(reference)

    // THEN: Reference should be accepted
    expect(result.$ref).toBe('icon-badge')
    expect(result.vars).toEqual({
      color: 'orange',
      icon: 'users',
      text: '6 à 15 personnes',
    })
  })

  test('should accept reference with mixed variable types', () => {
    // GIVEN: Reference with different variable types
    const reference = {
      $ref: 'section-header',
      vars: {
        titleColor: 'purple',
        count: 10,
        visible: true,
      },
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockReferenceSchema)(reference)

    // THEN: All variable types should be accepted
    expect(result.vars.titleColor).toBe('purple')
    expect(result.vars.count).toBe(10)
    expect(result.vars.visible).toBe(true)
  })

  test('should accept reference with empty vars', () => {
    // GIVEN: Reference with empty vars object
    const reference = {
      $ref: 'simple-block',
      vars: {},
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockReferenceSchema)(reference)

    // THEN: Reference with empty vars should be accepted
    expect(result.$ref).toBe('simple-block')
    expect(result.vars).toEqual({})
  })

  test('should reject reference missing $ref', () => {
    // GIVEN: Reference without $ref property
    const reference = {
      vars: {
        color: 'red',
      },
    }

    // WHEN: Schema validation is performed
    // THEN: Reference should be rejected
    expect(() => Schema.decodeUnknownSync(BlockReferenceSchema)(reference)).toThrow()
  })

  test('should reject reference missing vars', () => {
    // GIVEN: Reference without vars property
    const reference = {
      $ref: 'icon-badge',
    }

    // WHEN: Schema validation is performed
    // THEN: Reference should be rejected
    expect(() => Schema.decodeUnknownSync(BlockReferenceSchema)(reference)).toThrow()
  })
})
