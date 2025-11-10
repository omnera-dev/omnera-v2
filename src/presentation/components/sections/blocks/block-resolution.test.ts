/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, expect, test } from 'bun:test'
import { resolveBlock } from './block-resolution'
import type { Blocks } from '@/domain/models/app/blocks'

describe('Block Resolution', () => {
  describe('resolveBlock', () => {
    test('returns undefined when blocks array is undefined', () => {
      const result = resolveBlock('hero', undefined)
      expect(result).toBeUndefined()
    })

    test('returns undefined when blocks array is empty', () => {
      const result = resolveBlock('hero', [])
      expect(result).toBeUndefined()
    })

    test('returns undefined when block not found', () => {
      const blocks: Blocks = [
        { name: 'card', type: 'div', props: {} },
      ]
      const result = resolveBlock('hero', blocks)
      expect(result).toBeUndefined()
    })

    test('resolves block by name', () => {
      const blocks: Blocks = [
        { name: 'hero', type: 'section', props: { className: 'hero-section' } },
      ]
      const result = resolveBlock('hero', blocks)

      expect(result).toBeDefined()
      expect(result?.name).toBe('hero')
      expect(result?.component).toMatchObject({
        type: 'section',
        props: { className: 'hero-section' },
      })
    })

    test('resolves block with content', () => {
      const blocks: Blocks = [
        { name: 'text', type: 'p', props: {}, content: 'Static text' },
      ]
      const result = resolveBlock('text', blocks)

      expect(result?.component).toMatchObject({
        type: 'p',
        content: 'Static text',
      })
    })

    test('resolves block with children', () => {
      const blocks: Blocks = [
        {
          name: 'container',
          type: 'div',
          props: {},
          children: [
            { type: 'span', props: {}, content: 'Child 1' },
            { type: 'span', props: {}, content: 'Child 2' },
          ],
        },
      ]
      const result = resolveBlock('container', blocks)

      expect(result?.component.children).toHaveLength(2)
      expect(result?.component.children?.[0]).toMatchObject({
        type: 'span',
        content: 'Child 1',
      })
    })

    test('substitutes variables in props', () => {
      const blocks: Blocks = [
        { name: 'card', type: 'div', props: { className: 'card-$variant' } },
      ]
      const result = resolveBlock('card', blocks, { variant: 'primary' })

      expect(result?.component.props).toEqual({ className: 'card-primary' })
    })

    test('substitutes variables in content', () => {
      const blocks: Blocks = [
        { name: 'greeting', type: 'p', props: {}, content: '$message' },
      ]
      const result = resolveBlock('greeting', blocks, { message: 'Hello World' })

      expect(result?.component.content).toBe('Hello World')
    })

    test('substitutes variables in children', () => {
      const blocks: Blocks = [
        {
          name: 'list',
          type: 'ul',
          props: {},
          children: [
            { type: 'li', props: {}, content: '$item1' },
            { type: 'li', props: {}, content: '$item2' },
          ],
        },
      ]
      const result = resolveBlock('list', blocks, { item1: 'First', item2: 'Second' })

      expect(result?.component.children?.[0]).toMatchObject({
        type: 'li',
        content: 'First',
      })
      expect(result?.component.children?.[1]).toMatchObject({
        type: 'li',
        content: 'Second',
      })
    })

    test('substitutes variables in nested structures', () => {
      const blocks: Blocks = [
        {
          name: 'complex',
          type: 'div',
          props: { className: '$containerClass' },
          children: [
            {
              type: 'h1',
              props: { className: '$headingClass' },
              content: '$title',
            },
            {
              type: 'p',
              props: {},
              content: '$description',
            },
          ],
        },
      ]
      const result = resolveBlock('complex', blocks, {
        containerClass: 'container',
        headingClass: 'heading',
        title: 'Welcome',
        description: 'This is a test',
      })

      expect(result?.component.props).toEqual({ className: 'container' })
      expect(result?.component.children?.[0]).toMatchObject({
        type: 'h1',
        props: { className: 'heading' },
        content: 'Welcome',
      })
      expect(result?.component.children?.[1]).toMatchObject({
        type: 'p',
        content: 'This is a test',
      })
    })

    test('resolves block without variables when vars not provided', () => {
      const blocks: Blocks = [
        {
          name: 'static',
          type: 'div',
          props: { className: 'static-class' },
          content: 'Static content',
        },
      ]
      const result = resolveBlock('static', blocks)

      expect(result?.component).toMatchObject({
        type: 'div',
        props: { className: 'static-class' },
        content: 'Static content',
      })
    })

    test('leaves variables unsubstituted when vars empty', () => {
      const blocks: Blocks = [
        { name: 'template', type: 'div', props: {}, content: '$placeholder' },
      ]
      const result = resolveBlock('template', blocks, {})

      expect(result?.component.content).toBe('$placeholder')
    })

    test('handles numeric and boolean variables', () => {
      const blocks: Blocks = [
        {
          name: 'data',
          type: 'div',
          props: { className: 'count-$count', role: '$active' },
          content: 'Count: $count',
        },
      ]
      const result = resolveBlock('data', blocks, { count: 42, active: 'status' })

      expect(result?.component.props).toMatchObject({
        className: 'count-42',
        role: 'status',
      })
      expect(result?.component.content).toBe('Count: 42')
    })

    test('finds correct block from multiple blocks', () => {
      const blocks: Blocks = [
        { name: 'first', type: 'div', props: {} },
        { name: 'second', type: 'section', props: {} },
        { name: 'third', type: 'article', props: {} },
      ]
      const result = resolveBlock('second', blocks)

      expect(result?.name).toBe('second')
      expect(result?.component.type).toBe('section')
    })

    test('handles block with empty props', () => {
      const blocks: Blocks = [
        { name: 'simple', type: 'div', props: {} },
      ]
      const result = resolveBlock('simple', blocks)

      expect(result?.component).toMatchObject({
        type: 'div',
        props: {},
      })
    })

    test('handles block with undefined content', () => {
      const blocks: Blocks = [
        { name: 'empty', type: 'div', props: {}, content: undefined },
      ]
      const result = resolveBlock('empty', blocks)

      expect(result?.component.content).toBeUndefined()
    })

    test('handles block with undefined children', () => {
      const blocks: Blocks = [
        { name: 'leaf', type: 'span', props: {}, children: undefined },
      ]
      const result = resolveBlock('leaf', blocks)

      expect(result?.component.children).toBeUndefined()
    })
  })
})
