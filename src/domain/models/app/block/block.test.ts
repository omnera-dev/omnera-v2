/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { BlockNameSchema, BlockSchema } from './block'

describe('BlockNameSchema', () => {
  test('should accept kebab-case names', () => {
    // GIVEN: Valid kebab-case block names
    const names = ['icon-badge', 'section-header', 'feature-card', 'cta-button-2']

    // WHEN: Schema validation is performed on each
    const results = names.map((name) => Schema.decodeUnknownSync(BlockNameSchema)(name))

    // THEN: All names should be accepted
    expect(results).toEqual(names)
  })

  test('should accept names starting with lowercase letter', () => {
    // GIVEN: Name starting with lowercase
    const name = 'button'

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockNameSchema)(name)

    // THEN: Name should be accepted
    expect(result).toBe('button')
  })

  test('should accept names with numbers', () => {
    // GIVEN: Names with numbers
    const names = ['block1', 'section-2', 'card-3']

    // WHEN: Schema validation is performed on each
    const results = names.map((name) => Schema.decodeUnknownSync(BlockNameSchema)(name))

    // THEN: All names should be accepted
    expect(results).toEqual(names)
  })

  test('should reject names starting with uppercase', () => {
    // GIVEN: Name starting with uppercase
    const name = 'IconBadge'

    // WHEN: Schema validation is performed
    // THEN: Name should be rejected
    expect(() => Schema.decodeUnknownSync(BlockNameSchema)(name)).toThrow()
  })

  test('should reject names with underscores', () => {
    // GIVEN: Name with underscores
    const name = 'icon_badge'

    // WHEN: Schema validation is performed
    // THEN: Name should be rejected (only hyphens allowed)
    expect(() => Schema.decodeUnknownSync(BlockNameSchema)(name)).toThrow()
  })

  test('should reject names starting with number', () => {
    // GIVEN: Name starting with number
    const name = '2-columns'

    // WHEN: Schema validation is performed
    // THEN: Name should be rejected
    expect(() => Schema.decodeUnknownSync(BlockNameSchema)(name)).toThrow()
  })

  test('should reject names with spaces', () => {
    // GIVEN: Name with spaces
    const name = 'section header'

    // WHEN: Schema validation is performed
    // THEN: Name should be rejected
    expect(() => Schema.decodeUnknownSync(BlockNameSchema)(name)).toThrow()
  })

  test('should reject empty string', () => {
    // GIVEN: Empty name
    const name = ''

    // WHEN: Schema validation is performed
    // THEN: Empty name should be rejected
    expect(() => Schema.decodeUnknownSync(BlockNameSchema)(name)).toThrow()
  })
})

describe('BlockSchema', () => {
  test('should accept block with only required properties', () => {
    // GIVEN: Minimal block with name and type
    const block = {
      name: 'simple-block',
      type: 'div',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockSchema)(block)

    // THEN: Block should be accepted
    expect(result.name).toBe('simple-block')
    expect(result.type).toBe('div')
    expect(result.props).toBeUndefined()
    expect(result.children).toBeUndefined()
    expect(result.content).toBeUndefined()
  })

  test('should accept block with type variations', () => {
    // GIVEN: Blocks with different component types
    const types = ['container', 'flex', 'grid', 'card', 'text', 'button']

    // WHEN: Schema validation is performed on each
    const results = types.map((type) =>
      Schema.decodeUnknownSync(BlockSchema)({ name: 'test', type })
    )

    // THEN: All types should be accepted
    expect(results.map((r) => r.type)).toEqual(types)
  })

  test('should accept block with props', () => {
    // GIVEN: Block with props containing variable placeholders
    const block = {
      name: 'styled-box',
      type: 'div',
      props: {
        className: 'box-$variant',
        id: '$boxId',
      },
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockSchema)(block)

    // THEN: Block with props should be accepted
    expect(result.props?.className).toBe('box-$variant')
    expect(result.props?.id).toBe('$boxId')
  })

  test('should accept block with children', () => {
    // GIVEN: Block with nested children
    const block = {
      name: 'card-header',
      type: 'div',
      children: [
        {
          type: 'text',
          props: { level: 'h3' },
          content: '$title',
        },
        {
          type: 'text',
          props: { level: 'p' },
          content: '$subtitle',
        },
      ],
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockSchema)(block)

    // THEN: Block with children should be accepted
    expect(result.children).toHaveLength(2)
    expect(result.children?.[0]?.type).toBe('text')
    expect(result.children?.[1]?.type).toBe('text')
  })

  test('should accept block with content', () => {
    // GIVEN: Block with text content
    const block = {
      name: 'alert-message',
      type: 'div',
      content: '$message',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockSchema)(block)

    // THEN: Block with content should be accepted
    expect(result.content).toBe('$message')
  })

  test('should accept simple text block example', () => {
    // GIVEN: Simple text block with className and content variables
    const block = {
      name: 'simple-text',
      type: 'text',
      props: {
        className: 'text-$color text-lg',
      },
      content: '$message',
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockSchema)(block)

    // THEN: Block should be accepted
    expect(result.name).toBe('simple-text')
    expect(result.type).toBe('text')
    expect(result.props?.className).toBe('text-$color text-lg')
    expect(result.content).toBe('$message')
  })

  test('should accept feature-list-item block example', () => {
    // GIVEN: Feature list item with icon and text children
    const block = {
      name: 'feature-list-item',
      type: 'flex',
      props: {
        align: 'start',
        gap: 3,
      },
      children: [
        {
          type: 'icon',
          props: {
            name: '$icon',
            color: '$iconColor',
          },
        },
        {
          type: 'text',
          content: '$text',
        },
      ],
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockSchema)(block)

    // THEN: Block should be accepted
    expect(result.name).toBe('feature-list-item')
    expect(result.type).toBe('flex')
    expect(result.props?.align).toBe('start')
    expect(result.children).toHaveLength(2)
  })

  test('should accept block with complete composition', () => {
    // GIVEN: Complete block with layout, styling, and content
    const block = {
      name: 'complete-card',
      type: 'card',
      props: {
        className: 'card-$variant p-6 rounded-lg',
      },
      children: [
        {
          type: 'text',
          props: {
            level: 'h3',
            className: 'mb-2',
          },
          content: '$title',
        },
        {
          type: 'text',
          props: {
            level: 'p',
          },
          content: '$description',
        },
      ],
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockSchema)(block)

    // THEN: All aspects should be accepted
    expect(result.name).toBe('complete-card')
    expect(result.type).toBe('card')
    expect(result.props?.className).toBe('card-$variant p-6 rounded-lg')
    expect(result.children).toHaveLength(2)
  })

  test('should accept icon-badge block example', () => {
    // GIVEN: Icon badge block from examples
    const block = {
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
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockSchema)(block)

    // THEN: Block should be accepted
    expect(result.name).toBe('icon-badge')
    expect(result.type).toBe('badge')
    expect(result.props?.color).toBe('$color')
    expect(result.children).toHaveLength(2)
  })

  test('should accept section-header block example', () => {
    // GIVEN: Section header block from examples
    const block = {
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
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(BlockSchema)(block)

    // THEN: Block should be accepted
    expect(result.name).toBe('section-header')
    expect(result.type).toBe('container')
    expect(result.children).toHaveLength(2)
  })

  test('should reject block without name', () => {
    // GIVEN: Block missing required name
    const block = {
      type: 'div',
    }

    // WHEN: Schema validation is performed
    // THEN: Block should be rejected
    expect(() => Schema.decodeUnknownSync(BlockSchema)(block)).toThrow()
  })

  test('should reject block without type', () => {
    // GIVEN: Block missing required type
    const block = {
      name: 'simple-block',
    }

    // WHEN: Schema validation is performed
    // THEN: Block should be rejected
    expect(() => Schema.decodeUnknownSync(BlockSchema)(block)).toThrow()
  })
})
