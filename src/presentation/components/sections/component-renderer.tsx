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
import { applyComponentAnimations } from './utils/animation-composer-wrapper'
import { resolveBlock } from './utils/block-resolution'
import { buildFlexClasses, buildGridClasses } from './utils/class-builders'
import { dispatchComponentType } from './utils/component-type-dispatcher'
import { buildElementProps } from './utils/props-builder'
import { getComponentShadow } from './utils/shadow-resolver'
import { applySpacingStyles } from './utils/spacing-resolver'
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
  childIndex,
}: {
  readonly component: Component | SimpleBlockReference | BlockReference
  readonly blockName?: string
  readonly blockInstanceIndex?: number
  readonly blocks?: Blocks
  readonly theme?: Theme
  readonly languages?: Languages
  readonly currentLang?: string
  readonly childIndex?: number
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
        childIndex={index}
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
  const baseStyle = normalizeStyleAnimations(
    typeof styleValue === 'string'
      ? parseStyle(styleValue)
      : (styleValue as Record<string, unknown> | undefined)
  )

  // Apply animations functionally using composition instead of mutation
  const parsedStyle = applyComponentAnimations(type, baseStyle, theme)

  // For flex type, prepend flex classes to className
  // For grid type, prepend grid classes to className
  const finalClassName =
    type === 'flex'
      ? [buildFlexClasses(substitutedProps), substitutedProps?.className].filter(Boolean).join(' ')
      : type === 'grid'
        ? [buildGridClasses(theme), substitutedProps?.className].filter(Boolean).join(' ')
        : (substitutedProps?.className as string | undefined)

  // Apply theme shadows to component types based on conventions
  const componentShadow = getComponentShadow(type, theme)
  const styleWithShadow = componentShadow ? { ...parsedStyle, ...componentShadow } : parsedStyle

  // Build element props with all attributes and data attributes
  const hasContent = Boolean(content || children?.length)
  const hasChildren = Boolean(children?.length)
  const elementProps = buildElementProps(
    type,
    substitutedProps,
    finalClassName,
    styleWithShadow,
    blockName,
    blockInstanceIndex,
    firstTranslationKey,
    translationData,
    hasContent,
    hasChildren,
    theme,
    childIndex
  )

  // Apply theme spacing styles (section → container → flex)
  const elementPropsWithSpacing = applySpacingStyles(type, elementProps, theme)

  // Dispatch component rendering based on type
  return dispatchComponentType(
    type,
    elementProps,
    elementPropsWithSpacing,
    content,
    renderedChildren,
    theme,
    languages
  )
}
