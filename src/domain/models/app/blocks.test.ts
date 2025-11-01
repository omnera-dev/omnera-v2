/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { BlocksSchema } from './blocks'

describe('BlocksSchema', () => {
  test('should accept empty blocks array', () => {
    // GIVEN: Empty blocks array
    const blocks: unknown[] = []

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlocksSchema)(blocks)

    // THEN: Empty array should be accepted
    expect(result).toEqual([])
  })

  test('should accept array with single block', () => {
    // GIVEN: Array with one block
    const blocks = [
      {
        name: 'simple-block',
        type: 'div',
      },
    ]

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlocksSchema)(blocks)

    // THEN: Array should be accepted
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('simple-block')
  })

  test('should accept array with multiple blocks', () => {
    // GIVEN: Array with multiple blocks
    const blocks = [
      {
        name: 'icon-badge',
        type: 'badge',
      },
      {
        name: 'section-header',
        type: 'container',
      },
      {
        name: 'feature-card',
        type: 'card',
      },
    ]

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlocksSchema)(blocks)

    // THEN: All blocks should be accepted
    expect(result).toHaveLength(3)
    expect(result[0]?.name).toBe('icon-badge')
    expect(result[1]?.name).toBe('section-header')
    expect(result[2]?.name).toBe('feature-card')
  })

  test('should accept blocks with props', () => {
    // GIVEN: Blocks with props containing variables
    const blocks = [
      {
        name: 'cta-button',
        type: 'button',
        props: {
          variant: '$variant',
        },
        content: '$label',
      },
    ]

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlocksSchema)(blocks)

    // THEN: Block with props should be accepted
    expect(result[0]?.props?.variant).toBe('$variant')
    expect(result[0]?.content).toBe('$label')
  })

  test('should accept blocks with children', () => {
    // GIVEN: Blocks with nested children
    const blocks = [
      {
        name: 'card-with-header',
        type: 'card',
        children: [
          {
            type: 'div',
            props: {
              className: 'card-header',
            },
            children: [
              {
                type: 'text',
                props: {
                  level: 'h3',
                },
                content: '$title',
              },
            ],
          },
        ],
      },
    ]

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlocksSchema)(blocks)

    // THEN: Block with children should be accepted
    expect(result[0]?.children).toHaveLength(1)
    expect(result[0]?.children?.[0]?.type).toBe('div')
  })

  test('should accept icon-badge and section-header examples', () => {
    // GIVEN: Example blocks from schema
    const blocks = [
      {
        name: 'icon-badge',
        type: 'badge',
        props: {
          color: '$color',
        },
        children: [
          {
            type: 'icon',
            props: {
              name: '$icon',
              size: 4,
            },
          },
          {
            type: 'text',
            props: {
              level: 'span',
            },
            content: '$text',
          },
        ],
      },
      {
        name: 'section-header',
        type: 'container',
        props: {
          className: 'text-center mb-12',
        },
        children: [
          {
            type: 'text',
            props: {
              level: 'h2',
              className: 'text-$titleColor text-4xl mb-4',
            },
            content: '$title',
          },
          {
            type: 'text',
            props: {
              level: 'p',
            },
            content: '$subtitle',
          },
        ],
      },
    ]

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlocksSchema)(blocks)

    // THEN: Both example blocks should be accepted
    expect(result).toHaveLength(2)
    expect(result[0]?.name).toBe('icon-badge')
    expect(result[1]?.name).toBe('section-header')
  })

  test('should accept blocks with various component types', () => {
    // GIVEN: Blocks with different component types
    const blocks = [
      { name: 'layout', type: 'container' },
      { name: 'row', type: 'flex' },
      { name: 'columns', type: 'grid' },
      { name: 'panel', type: 'card' },
      { name: 'heading', type: 'text' },
      { name: 'cta', type: 'button' },
    ]

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlocksSchema)(blocks)

    // THEN: All component types should be accepted
    expect(result).toHaveLength(6)
    expect(result.map((b) => b.type)).toEqual([
      'container',
      'flex',
      'grid',
      'card',
      'text',
      'button',
    ])
  })

  test('should accept blocks for DRY principle', () => {
    // GIVEN: Block definition that can be reused
    const blocks = [
      {
        name: 'cta-button',
        type: 'button',
        props: {
          variant: '$variant',
        },
        content: '$label',
      },
    ]

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlocksSchema)(blocks)

    // THEN: Reusable block should be accepted
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('cta-button')
    expect(result[0]?.props?.variant).toBe('$variant')
  })

  test('should accept blocks as component library', () => {
    // GIVEN: Multiple blocks defining UI patterns
    const blocks = [
      {
        name: 'cta-button',
        type: 'button',
        content: '$label',
      },
      {
        name: 'icon-badge',
        type: 'badge',
        props: {
          color: '$color',
        },
      },
      {
        name: 'feature-card',
        type: 'card',
        children: [],
      },
    ]

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlocksSchema)(blocks)

    // THEN: Component library should be accepted
    expect(result).toHaveLength(3)
    expect(result.map((b) => b.name)).toEqual(['cta-button', 'icon-badge', 'feature-card'])
  })

  test('should accept blocks with complex nested structures', () => {
    // GIVEN: Block with deeply nested children
    const blocks = [
      {
        name: 'card-with-header',
        type: 'card',
        children: [
          {
            type: 'div',
            props: {
              className: 'card-header',
            },
            children: [
              {
                type: 'text',
                props: {
                  level: 'h3',
                },
                content: '$title',
              },
              {
                type: 'text',
                props: {
                  level: 'p',
                },
                content: '$subtitle',
              },
            ],
          },
          {
            type: 'div',
            props: {
              className: 'card-body',
            },
            content: '$bodyText',
          },
        ],
      },
    ]

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlocksSchema)(blocks)

    // THEN: Complex nested structure should be accepted
    expect(result[0]?.children).toHaveLength(2)
    expect(result[0]?.children?.[0]?.children).toHaveLength(2)
  })

  test('should reject blocks with duplicate names', () => {
    // GIVEN: Blocks array with duplicate block names
    const blocks = [
      {
        name: 'duplicate-name',
        type: 'div',
      },
      {
        name: 'duplicate-name',
        type: 'span',
      },
    ]

    // WHEN: Schema validation is performed
    // THEN: Validation should fail with uniqueness error
    expect(() => {
      Schema.decodeUnknownSync(BlocksSchema)(blocks)
    }).toThrow(/unique/i)
  })

  test('should accept blocks with unique names', () => {
    // GIVEN: Blocks array with unique names
    const blocks = [
      {
        name: 'block-1',
        type: 'div',
      },
      {
        name: 'block-2',
        type: 'span',
      },
    ]

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlocksSchema)(blocks)

    // THEN: All blocks should be accepted
    expect(result).toHaveLength(2)
    expect(result[0]?.name).toBe('block-1')
    expect(result[1]?.name).toBe('block-2')
  })
})
