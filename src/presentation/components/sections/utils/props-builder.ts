/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Component } from '@/domain/models/app/page/sections'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Component types that should receive role="group" when used as blocks with children
 */
const CONTAINER_TYPES = ['div', 'container', 'flex', 'grid', 'card', 'badge'] as const

/**
 * Build test ID for component
 */
function buildTestId(
  type: Component['type'],
  blockName?: string,
  blockInstanceIndex?: number,
  substitutedProps?: Record<string, unknown>,
  childIndex?: number
): string | undefined {
  if (blockName) {
    return blockInstanceIndex !== undefined
      ? `block-${blockName}-${blockInstanceIndex}`
      : `block-${blockName}`
  }

  if (substitutedProps?.['data-testid']) {
    return substitutedProps['data-testid'] as string
  }

  if (childIndex !== undefined) {
    return `child-${childIndex}`
  }

  if (type === 'container') {
    return 'container'
  }

  if (type === 'flex') {
    return 'flex'
  }

  return undefined
}

/**
 * Build element props with all attributes
 */
export function buildElementProps(
  type: Component['type'],
  substitutedProps: Record<string, unknown> | undefined,
  finalClassName: string | undefined,
  styleWithShadow: Record<string, unknown> | undefined,
  blockName: string | undefined,
  blockInstanceIndex: number | undefined,
  firstTranslationKey: string | undefined,
  translationData: Record<string, string> | undefined,
  hasContent: boolean,
  hasChildren: boolean,
  theme: Theme | undefined,
  childIndex?: number
): Record<string, unknown> {
  const hasScrollAnimation = type === 'card' && theme?.animations?.scaleUp
  const testId = buildTestId(type, blockName, blockInstanceIndex, substitutedProps, childIndex)

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
    ...((blockName || childIndex !== undefined) &&
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
