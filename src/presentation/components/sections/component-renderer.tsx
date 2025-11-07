/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { Hero } from '@/presentation/components/layout/hero'
import { ResponsiveNavigation } from '@/presentation/components/layout/responsive-navigation'
import { composeAnimation } from '@/presentation/utils/animation-composer'
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
 * Component types that should receive role="group" when used as blocks with children
 */
const CONTAINER_TYPES = ['div', 'container', 'flex', 'grid', 'card'] as const

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
  const baseStyle = normalizeStyleAnimations(
    typeof styleValue === 'string'
      ? parseStyle(styleValue)
      : (styleValue as Record<string, unknown> | undefined)
  )

  // Apply animations functionally using composition instead of mutation
  // Compose fadeOut animation for toast components
  const styleWithFadeOut =
    type === 'toast'
      ? composeAnimation(baseStyle, type, 'fadeOut', theme, '300ms', 'ease-out')
      : baseStyle

  // Compose scaleUp animation for card components with scroll trigger
  const styleWithScaleUp =
    type === 'card'
      ? composeAnimation(
          styleWithFadeOut,
          type,
          'scaleUp',
          theme,
          '500ms',
          'cubic-bezier(0.34, 1.56, 0.64, 1)',
          {
            animationPlayState: 'paused',
            animationFillMode: 'forwards',
            opacity: 0,
          }
        )
      : styleWithFadeOut

  // Compose float animation for fab components (continuous floating effect)
  const parsedStyle =
    type === 'fab'
      ? composeAnimation(styleWithScaleUp, type, 'float', theme, '3s', 'ease-in-out', {
          infinite: true,
        })
      : styleWithScaleUp

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

  // Build grid-specific classes based on theme breakpoints
  const buildGridClasses = (theme?: Theme): string | undefined => {
    const baseClasses = ['grid']
    const breakpointClass = theme?.breakpoints?.md ? 'md:grid-cols-2' : undefined

    return [...baseClasses, breakpointClass].filter(Boolean).join(' ')
  }

  // For flex type, prepend flex classes to className
  // For grid type, prepend grid classes to className
  const finalClassName =
    type === 'flex'
      ? [buildFlexClasses(substitutedProps), substitutedProps?.className].filter(Boolean).join(' ')
      : type === 'grid'
        ? [buildGridClasses(theme), substitutedProps?.className].filter(Boolean).join(' ')
        : (substitutedProps?.className as string | undefined)

  // Apply theme shadows to component types based on conventions
  // Card components use available shadow tokens (md, neumorphic, etc.)
  // Modal components use xl shadow
  // Input components use inner shadow
  // Button components use md shadow (or custom like brand)
  // List-item components use sm shadow (lowest elevation)
  // Dropdown components use lg shadow (higher than card, lower than modal)
  const getComponentShadow = (): Record<string, unknown> | undefined => {
    if (!theme?.shadows) {
      return undefined
    }

    // List-item: Use sm shadow (lowest elevation in hierarchy)
    if (type === 'list-item' && theme.shadows.sm) {
      return { boxShadow: 'var(--shadow-sm)' }
    }

    // Card: Use first available shadow (prioritize custom names like neumorphic, then md)
    if (type === 'card') {
      // Check for custom shadow names first (neumorphic, etc.)
      const customShadow = Object.keys(theme.shadows).find(
        (name) => !['sm', 'md', 'lg', 'xl', '2xl', 'inner', 'none'].includes(name)
      )
      if (customShadow) {
        return { boxShadow: `var(--shadow-${customShadow})` }
      }
      // Fallback to md if available
      if (theme.shadows.md) {
        return { boxShadow: 'var(--shadow-md)' }
      }
    }

    // Dropdown: Use lg shadow (higher elevation than card)
    if (type === 'dropdown' && theme.shadows.lg) {
      return { boxShadow: 'var(--shadow-lg)' }
    }

    // Modal: Use xl shadow
    if (type === 'modal' && theme.shadows.xl) {
      return { boxShadow: 'var(--shadow-xl)' }
    }

    // Input: Use inner shadow
    if (type === 'input' && theme.shadows.inner) {
      return { boxShadow: 'var(--shadow-inner)' }
    }

    // Button: Use brand shadow if available, otherwise md
    if (type === 'button') {
      if (theme.shadows.brand) {
        return { boxShadow: 'var(--shadow-brand)' }
      }
      if (theme.shadows.md) {
        return { boxShadow: 'var(--shadow-md)' }
      }
    }

    return undefined
  }

  const componentShadow = getComponentShadow()
  const styleWithShadow = componentShadow
    ? {
        ...parsedStyle,
        ...componentShadow,
      }
    : parsedStyle

  // Merge className with other props and add data-block attribute if blockName is provided
  // For blocks without content, add min-height and display to ensure visibility
  // For grid elements without content, ensure minimum dimensions for rendering
  // Add translation key data attribute if children contain $t: patterns
  // Include pre-resolved translations to eliminate client-side resolution logic duplication
  // Add role="group" for blocks with children to establish proper ARIA tree nesting
  // Add data-scroll-animation attribute for card elements with scaleUp animation
  const hasContent = Boolean(content || children?.length)
  const hasChildren = Boolean(children?.length)
  const hasScrollAnimation = type === 'card' && theme?.animations?.scaleUp
  const testId = blockName
    ? blockInstanceIndex !== undefined
      ? `block-${blockName}-${blockInstanceIndex}`
      : `block-${blockName}`
    : substitutedProps?.['data-testid'] || undefined
  const elementProps = {
    ...substitutedProps,
    className: finalClassName,
    ...(styleWithShadow && { style: styleWithShadow }),
    ...(blockName && {
      'data-block': blockName,
      'data-testid': testId,
      'data-type': type,
    }),
    ...(blockName &&
      hasChildren &&
      CONTAINER_TYPES.includes(type) && {
        role: 'group',
      }),
    ...(firstTranslationKey &&
      translationData && {
        'data-translation-key': firstTranslationKey,
        'data-translations': JSON.stringify(translationData),
      }),
    ...(hasScrollAnimation && {
      'data-scroll-animation': 'scale-up',
    }),
    ...(blockName &&
      !hasContent && {
        style: {
          ...styleWithShadow,
          minHeight: '1px',
          minWidth: '1px',
          display: 'inline-block',
        },
      }),
    ...(!blockName &&
      type === 'grid' &&
      !hasContent && {
        style: {
          ...styleWithShadow,
          minHeight: '100px',
          minWidth: '100px',
        },
      }),
  }

  // Apply theme spacing to section elements when spacing.section is a CSS value
  // CSS values contain units like rem, px, em, % without spaces
  const isCssValue = (value: string): boolean => {
    return /\d+(rem|px|em|%|vh|vw)/.test(value) && !value.includes(' ')
  }

  const sectionSpacing = type === 'section' && theme?.spacing?.section
  const sectionSpacingStyle =
    sectionSpacing && isCssValue(theme.spacing.section)
      ? { padding: theme.spacing.section }
      : undefined

  const elementPropsWithSectionSpacing = sectionSpacingStyle
    ? {
        ...elementProps,
        style: {
          ...(elementProps.style as Record<string, unknown> | undefined),
          ...sectionSpacingStyle,
        },
      }
    : elementProps

  // Render based on component type using specialized renderers
  switch (type) {
    // HTML structural elements
    case 'section':
      return Renderers.renderHTMLElement(
        'section',
        elementPropsWithSectionSpacing,
        content,
        renderedChildren
      )

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

    case 'alert':
      return Renderers.renderAlert(elementProps, content, renderedChildren, theme)

    case 'form':
      return Renderers.renderForm(elementProps, renderedChildren)

    case 'input':
      return Renderers.renderInput(elementProps)

    // Custom blocks
    case 'customHTML':
      return Renderers.renderCustomHTML(elementProps)

    case 'language-switcher':
      return Renderers.renderLanguageSwitcher(elementProps, languages)

    // Layout components
    case 'modal':
    case 'sidebar':
    case 'toast':
    case 'fab':
    case 'spinner':
    case 'list-item':
    case 'dropdown':
      return Renderers.renderHTMLElement('div', elementProps, content, renderedChildren)

    case 'hero':
      return (
        <Hero
          theme={theme}
          data-testid={elementProps['data-testid'] as string | undefined}
        >
          {renderedChildren}
        </Hero>
      )

    case 'list':
      return Renderers.renderList(elementProps, content, theme)

    case 'navigation':
      return (
        <ResponsiveNavigation
          theme={theme}
          data-testid={elementProps['data-testid'] as string | undefined}
        />
      )

    // Fallback for unknown types
    default:
      return Renderers.renderHTMLElement('div', elementProps, content, renderedChildren)
  }
}
