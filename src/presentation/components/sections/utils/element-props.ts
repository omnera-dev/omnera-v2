/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { CONTAINER_TYPES } from '../component-renderer.types'
import { buildFlexClasses, buildGridClasses } from './component-styling'
import type { Component } from '@/domain/models/app/page/sections'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Build data-testid based on blockName and instanceIndex
 */
export function buildTestId(
  blockName?: string,
  blockInstanceIndex?: number,
  type?: string,
  substitutedProps?: Record<string, unknown>
): string | undefined {
  if (blockName) {
    return blockInstanceIndex !== undefined
      ? `block-${blockName}-${blockInstanceIndex}`
      : `block-${blockName}`
  }

  const dataTestId = substitutedProps?.['data-testid']
  if (typeof dataTestId === 'string') {
    return dataTestId
  }

  return type === 'container' ? 'container' : type === 'flex' ? 'flex' : undefined
}

/**
 * Build final className based on component type and theme
 */
export function buildClassName(
  type: string,
  substitutedProps?: Record<string, unknown>,
  theme?: Theme
): string | undefined {
  if (type === 'flex') {
    return [buildFlexClasses(substitutedProps), substitutedProps?.className]
      .filter(Boolean)
      .join(' ')
  }

  if (type === 'grid') {
    return [buildGridClasses(theme), substitutedProps?.className].filter(Boolean).join(' ')
  }

  return substitutedProps?.className as string | undefined
}

/**
 * Build element props including data attributes, ARIA, and styling
 */
export function buildElementProps({
  component,
  substitutedProps,
  finalClassName,
  styleWithShadow,
  testId,
  blockName,
  firstTranslationKey,
  translationData,
  hasScrollAnimation,
  hasContent,
  children,
}: {
  readonly component: Component
  readonly substitutedProps?: Record<string, unknown>
  readonly finalClassName?: string
  readonly styleWithShadow?: Record<string, unknown>
  readonly testId?: string
  readonly blockName?: string
  readonly firstTranslationKey?: string
  readonly translationData?: Record<string, unknown>
  readonly hasScrollAnimation?: boolean
  readonly hasContent?: boolean
  readonly children?: readonly (Component | string)[]
}): Record<string, unknown> {
  const { type } = component
  const hasChildren = Boolean(children?.length)

  return {
    ...substitutedProps,
    className: finalClassName,
    ...(styleWithShadow && { style: styleWithShadow }),
    ...(testId && { 'data-testid': testId }),
    ...(blockName && {
      'data-block': blockName,
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
}

/**
 * Convert custom props to data-* attributes for badge components
 * Standard HTML attributes (className, style, id, etc.) pass through unchanged
 */
export function convertBadgeProps(elementProps: Record<string, unknown>): Record<string, unknown> {
  const standardHtmlAttrs = new Set([
    'className',
    'style',
    'id',
    'role',
    'data-testid',
    'data-block',
    'data-type',
    'data-translation-key',
    'data-translations',
  ])

  return Object.entries(elementProps).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (standardHtmlAttrs.has(key) || key.startsWith('data-') || key.startsWith('aria-')) {
      // Keep standard HTML attrs, data-*, and aria-* unchanged
      return { ...acc, [key]: value }
    }
    // Convert custom props to data-* attributes
    return { ...acc, [`data-${key}`]: value }
  }, {})
}
