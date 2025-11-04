/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { normalizeStyleAnimations, parseStyle } from '@/presentation/utils/parse-style'
import {
  collectTranslationsForKey,
  resolveTranslationPattern,
} from '@/presentation/utils/translation-resolver'
import * as Renderers from './renderers/element-renderers'
import { resolveBlock } from './utils/block-resolution'
import { substitutePropsThemeTokens } from './utils/theme-tokens'
import type {
  BlockReference,
  SimpleBlockReference,
} from '@/domain/models/app/block/common/block-reference'
import type { Blocks } from '@/domain/models/app/blocks'
import type { Languages } from '@/domain/models/app/languages'
import type { Component } from '@/domain/models/app/page/sections'
import type { Theme } from '@/domain/models/app/theme'

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
 * @param props.blockInstanceIndex - Optional instance index for blocks used multiple times (for unique data-testid)
 * @param props.blocks - Optional blocks array for resolving block references
 * @param props.theme - Optional theme configuration for token substitution
 * @param props.languages - Optional languages configuration for language-switcher blocks
 * @param props.currentLang - Current page language (defaults to languages.default)
 * @returns React element matching the component type
 */
export function ComponentRenderer({
  component,
  blockName,
  blockInstanceIndex,
  blocks,
  theme,
  languages,
  currentLang,
}: {
  readonly component: Component | SimpleBlockReference | BlockReference
  readonly blockName?: string
  readonly blockInstanceIndex?: number
  readonly blocks?: Blocks
  readonly theme?: Theme
  readonly languages?: Languages
  readonly currentLang?: string
}): Readonly<ReactElement | null> {
  // Handle block references - supports both { block: 'name' } and { $ref: 'name' } syntaxes
  if ('block' in component || '$ref' in component) {
    // Extract reference name and vars based on syntax used
    const refName = 'block' in component ? component.block : component.$ref
    const vars = 'vars' in component ? component.vars : undefined

    const resolved = resolveBlock(refName, blocks, vars)
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
          Block not found: &quot;{refName}&quot;
          <br />
          <small>Available blocks: {blocks?.map((b) => b.name).join(', ') || 'none'}</small>
        </div>
      )
    }
    return (
      <ComponentRenderer
        component={resolved.component}
        blockName={resolved.name}
        blockInstanceIndex={blockInstanceIndex}
        blocks={blocks}
        theme={theme}
        languages={languages}
        currentLang={currentLang}
      />
    )
  }

  // Direct component rendering
  const { type, props, children, content } = component as Component

  // Apply theme token substitution to props
  const substitutedProps = substitutePropsThemeTokens(props, theme)

  // Find first translation key (if any) for data-translation-key attribute
  const firstTranslationKey = children
    ?.find(
      (child: Component | string): child is string =>
        typeof child === 'string' && child.startsWith('$t:')
    )
    ?.slice(3) // Remove '$t:' prefix

  // Render children recursively - children can be Component objects or strings
  const renderedChildren = children?.map((child: Component | string, index: number) => {
    if (typeof child === 'string') {
      // Resolve translation patterns ($t:key) using current page language
      // Falls back to fallback/default language if translation is missing
      const lang = currentLang || languages?.default || 'en-US'
      return resolveTranslationPattern(child, lang, languages)
    }
    return (
      <ComponentRenderer
        key={index}
        component={child}
        blocks={blocks}
        theme={theme}
        languages={languages}
        currentLang={currentLang}
      />
    )
  })

  // Collect all translations for the key if present (eliminates client-side duplication)
  const translationData = firstTranslationKey
    ? collectTranslationsForKey(firstTranslationKey, languages)
    : undefined

  // Parse style if it's a string (convert CSS string to React style object)
  // React requires style to be an object, but our schema allows CSS strings for convenience
  // Normalize animation names to kebab-case for consistency with generated keyframes
  const styleValue = substitutedProps?.style
  const parsedStyle = normalizeStyleAnimations(
    typeof styleValue === 'string'
      ? parseStyle(styleValue)
      : (styleValue as Record<string, unknown> | undefined)
  )

  // Build flex-specific classes based on props
  const buildFlexClasses = (props?: Record<string, unknown>): string => {
    const baseClasses = ['flex']
    const alignmentClass =
      props?.align === 'start'
        ? 'items-start'
        : props?.align === 'center'
          ? 'items-center'
          : props?.align === 'end'
            ? 'items-end'
            : undefined
    const gapClass = typeof props?.gap === 'number' ? `gap-${props.gap}` : undefined

    return [...baseClasses, alignmentClass, gapClass].filter(Boolean).join(' ')
  }

  // For flex type, prepend flex classes to className
  const finalClassName =
    type === 'flex'
      ? [buildFlexClasses(substitutedProps), substitutedProps?.className].filter(Boolean).join(' ')
      : (substitutedProps?.className as string | undefined)

  // Merge className with other props and add data-block attribute if blockName is provided
  // For blocks without content, add min-height and display to ensure visibility
  // Add translation key data attribute if children contain $t: patterns
  // Include pre-resolved translations to eliminate client-side resolution logic duplication
  // Add role="group" for blocks with children to establish proper ARIA tree nesting
  const hasContent = Boolean(content || children?.length)
  const hasChildren = Boolean(children?.length)
  const testId = blockName
    ? blockInstanceIndex !== undefined
      ? `block-${blockName}-${blockInstanceIndex}`
      : `block-${blockName}`
    : undefined
  const elementProps = {
    ...substitutedProps,
    className: finalClassName,
    ...(parsedStyle && { style: parsedStyle }),
    ...(blockName && {
      'data-block': blockName,
      'data-testid': testId,
      'data-type': type,
    }),
    ...(blockName &&
      hasChildren &&
      (type === 'div' ||
        type === 'container' ||
        type === 'flex' ||
        type === 'grid' ||
        type === 'card') && {
        role: 'group',
      }),
    ...(firstTranslationKey &&
      translationData && {
        'data-translation-key': firstTranslationKey,
        'data-translations': JSON.stringify(translationData),
      }),
    ...(blockName &&
      !hasContent && {
        style: {
          ...parsedStyle,
          minHeight: '1px',
          minWidth: '1px',
          display: 'inline-block',
        },
      }),
  }

  // Render based on component type using specialized renderers
  switch (type) {
    // HTML structural elements
    case 'section':
      return Renderers.renderHTMLElement('section', elementProps, content, renderedChildren)

    case 'div':
    case 'container':
    case 'flex':
    case 'grid':
    case 'card':
    case 'timeline':
    case 'accordion':
      return Renderers.renderHTMLElement('div', elementProps, content, renderedChildren)

    case 'span':
    case 'badge':
      return Renderers.renderHTMLElement('span', elementProps, content, renderedChildren)

    case 'icon':
      return Renderers.renderIcon(elementProps, renderedChildren)

    // Heading elements
    case 'h1':
      return Renderers.renderHeading(1, elementProps, content, renderedChildren)

    case 'h2':
      return Renderers.renderHeading(2, elementProps, content, renderedChildren)

    case 'h3':
      return Renderers.renderHeading(3, elementProps, content, renderedChildren)

    case 'h4':
      return Renderers.renderHeading(4, elementProps, content, renderedChildren)

    case 'h5':
      return Renderers.renderHeading(5, elementProps, content, renderedChildren)

    case 'h6':
      return Renderers.renderHeading(6, elementProps, content, renderedChildren)

    case 'heading':
      return Renderers.renderHeading(1, elementProps, content, renderedChildren)

    // Content elements
    case 'text':
      return Renderers.renderTextElement(elementProps, content)

    case 'paragraph':
      return Renderers.renderParagraph(elementProps, content)

    // Media elements
    case 'image':
      return Renderers.renderImage(elementProps)

    case 'video':
      return Renderers.renderVideo(elementProps, renderedChildren)

    case 'audio':
      return Renderers.renderAudio(elementProps, renderedChildren)

    case 'iframe':
      return Renderers.renderIframe(elementProps, renderedChildren)

    // Interactive elements
    case 'button':
      return Renderers.renderButton(elementProps, content, renderedChildren)

    case 'link':
      return Renderers.renderLink(elementProps, content, renderedChildren)

    case 'form':
      return Renderers.renderForm(elementProps, renderedChildren)

    case 'input':
      return Renderers.renderInput(elementProps)

    // Custom blocks
    case 'customHTML':
      return Renderers.renderCustomHTML(elementProps)

    case 'language-switcher':
      return Renderers.renderLanguageSwitcher(elementProps, languages)

    // Fallback for unknown types
    default:
      return Renderers.renderHTMLElement('div', elementProps, content, renderedChildren)
  }
}
