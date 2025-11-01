/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import DOMPurify from 'dompurify'
import { type ReactElement } from 'react'
import type {
  BlockReference,
  SimpleBlockReference,
} from '@/domain/models/app/block/common/block-reference'
import type { Blocks } from '@/domain/models/app/blocks'
import type { Component } from '@/domain/models/app/page/sections'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Substitutes theme tokens in a value
 *
 * Replaces `$theme.category.key` patterns with actual theme values.
 * Example: `$theme.colors.primary` → `#007bff`
 *
 * @param value - Value that may contain theme tokens
 * @param theme - Theme configuration
 * @returns Value with theme tokens replaced
 */
function substituteThemeTokens(value: unknown, theme?: Theme): unknown {
  if (typeof value !== 'string') {
    return value
  }

  if (!theme || !value.startsWith('$theme.')) {
    return value
  }

  // Extract the path: $theme.colors.primary → ['colors', 'primary']
  const path = value.slice(7).split('.')

  // Navigate through the theme object
  let result: unknown = theme
  for (const key of path) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      // Token not found in theme, return original value
      return value
    }
  }

  return result
}

/**
 * Substitutes theme tokens in props recursively
 *
 * @param props - Component props that may contain theme tokens
 * @param theme - Theme configuration
 * @returns Props with theme tokens replaced
 */
function substitutePropsThemeTokens(
  props: Record<string, unknown> | undefined,
  theme?: Theme
): Record<string, unknown> | undefined {
  if (!props || !theme) {
    return props
  }

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'string') {
      result[key] = substituteThemeTokens(value, theme)
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recursively handle nested objects (like style props)
      result[key] = substitutePropsThemeTokens(value as Record<string, unknown>, theme)
    } else {
      result[key] = value
    }
  }
  return result
}

/**
 * Resolves a block reference to a component
 *
 * Pure function that finds a block by name and converts it to a Component.
 *
 * @param blockName - Name of the block to resolve
 * @param blocks - Array of available blocks
 * @returns Resolved component and block name, or undefined if not found
 */
function resolveBlock(
  blockName: string,
  blocks?: Blocks
): { readonly component: Component; readonly name: string } | undefined {
  const block = blocks?.find((b) => b.name === blockName)
  if (!block) {
    console.warn(`Block not found: ${blockName}`)
    return undefined
  }

  const component: Component = {
    type: block.type,
    props: block.props,
    children: block.children,
    content: block.content,
  }

  return { component, name: block.name }
}

/**
 * ComponentRenderer - Renders a dynamic component based on its type
 *
 * This component handles the recursive rendering of sections, converting
 * the declarative component configuration into React elements.
 * Supports block references for reusable components and theme token substitution.
 *
 * @param props - Component props
 * @param props.component - Component configuration from sections schema (can be a direct component or block reference)
 * @param props.blockName - Optional block name for data-block attribute
 * @param props.blocks - Optional blocks array for resolving block references
 * @param props.theme - Optional theme configuration for token substitution
 * @returns React element matching the component type
 */
export function ComponentRenderer({
  component,
  blockName,
  blocks,
  theme,
}: {
  readonly component: Component | SimpleBlockReference | BlockReference
  readonly blockName?: string
  readonly blocks?: Blocks
  readonly theme?: Theme
}): Readonly<ReactElement | null> {
  // Handle block references
  if ('block' in component) {
    // Simple block reference: { block: 'name' }
    const resolved = resolveBlock(component.block, blocks)
    if (!resolved) {
      return (
        <div
          style={{
            padding: '1rem',
            border: '2px dashed red',
            color: 'red',
            fontFamily: 'monospace',
          }}
        >
          Block not found: &quot;{component.block}&quot;
          <br />
          <small>Available blocks: {blocks?.map((b) => b.name).join(', ') || 'none'}</small>
        </div>
      )
    }
    return (
      <ComponentRenderer
        component={resolved.component}
        blockName={resolved.name}
        blocks={blocks}
        theme={theme}
      />
    )
  }

  if ('$ref' in component) {
    // Block reference with vars: { $ref: 'name', vars: {} }
    // Note: Variable substitution not yet implemented
    const resolved = resolveBlock(component.$ref, blocks)
    if (!resolved) {
      return (
        <div
          style={{
            padding: '1rem',
            border: '2px dashed red',
            color: 'red',
            fontFamily: 'monospace',
          }}
        >
          Block not found: &quot;{component.$ref}&quot;
          <br />
          <small>Available blocks: {blocks?.map((b) => b.name).join(', ') || 'none'}</small>
        </div>
      )
    }
    return (
      <ComponentRenderer
        component={resolved.component}
        blockName={resolved.name}
        blocks={blocks}
        theme={theme}
      />
    )
  }

  // Direct component rendering
  const { type, props, children, content } = component as Component

  // Apply theme token substitution to props
  const substitutedProps = substitutePropsThemeTokens(props, theme)

  // Render children recursively
  const renderedChildren = children?.map((child: Component, index: number) => (
    <ComponentRenderer
      key={index}
      component={child}
      blocks={blocks}
      theme={theme}
    />
  ))

  // Merge className with other props and add data-block attribute if blockName is provided
  // For blocks without content, add min-height and display to ensure visibility
  const hasContent = Boolean(content || children?.length)
  const elementProps = {
    ...substitutedProps,
    className: substitutedProps?.className,
    ...(blockName && { 'data-block': blockName }),
    ...(blockName &&
      !hasContent && {
        style: {
          ...substitutedProps?.style,
          minHeight: '1px',
          minWidth: '1px',
          display: 'inline-block',
        },
      }),
  }

  // Render based on component type
  switch (type) {
    case 'section':
      return <section {...elementProps}>{renderedChildren}</section>

    case 'text': {
      // Determine the HTML tag based on the level prop
      const level = substitutedProps?.level
      if (level === 'h1') return <h1 {...elementProps}>{content}</h1>
      if (level === 'h2') return <h2 {...elementProps}>{content}</h2>
      if (level === 'h3') return <h3 {...elementProps}>{content}</h3>
      if (level === 'h4') return <h4 {...elementProps}>{content}</h4>
      if (level === 'h5') return <h5 {...elementProps}>{content}</h5>
      if (level === 'h6') return <h6 {...elementProps}>{content}</h6>
      // Default to paragraph
      return <p {...elementProps}>{content}</p>
    }

    case 'heading':
      return <h1 {...elementProps}>{content}</h1>

    case 'paragraph':
      return <p {...elementProps}>{content}</p>

    case 'image':
      return (
        <img
          {...elementProps}
          alt={substitutedProps?.alt || ''}
        />
      )

    case 'button':
      return <button {...elementProps}>{content || renderedChildren}</button>

    case 'link':
      return <a {...elementProps}>{content || renderedChildren}</a>

    case 'badge':
      return <span {...elementProps}>{content}</span>

    case 'icon':
      return <span {...elementProps}>{renderedChildren}</span>

    case 'customHTML': {
      // SECURITY: Sanitize HTML to prevent XSS attacks
      // DOMPurify removes malicious scripts, event handlers, and dangerous attributes
      // This is critical for user-generated content or external HTML sources
      const sanitizedHTML = DOMPurify.sanitize(substitutedProps?.html || '')
      return (
        <div
          {...elementProps}
          // Safe to use dangerouslySetInnerHTML after DOMPurify sanitization
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      )
    }

    case 'video':
      return <video {...elementProps}>{renderedChildren}</video>

    case 'audio':
      return <audio {...elementProps}>{renderedChildren}</audio>

    case 'iframe':
      return <iframe {...elementProps}>{renderedChildren}</iframe>

    case 'form':
      return <form {...elementProps}>{renderedChildren}</form>

    case 'input':
      return <input {...elementProps} />

    // Layout components - all render as <div> with children
    case 'container':
    case 'flex':
    case 'grid':
    case 'card':
    case 'timeline':
    case 'accordion':
    case 'div':
      return <div {...elementProps}>{content || renderedChildren}</div>

    case 'span':
      return <span {...elementProps}>{content || renderedChildren}</span>

    default:
      // Fallback for unknown types - render as generic div
      return <div {...elementProps}>{content || renderedChildren}</div>
  }
}
