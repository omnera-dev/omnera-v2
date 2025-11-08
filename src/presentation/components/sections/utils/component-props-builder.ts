/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Theme } from '@/domain/models/app/theme'

/**
 * Component types that should receive role="group" when used as blocks with children
 */
const CONTAINER_TYPES = ['div', 'container', 'flex', 'grid', 'card', 'badge'] as const

/**
 * Build flex-specific classes based on props
 */
export function buildFlexClasses(props?: Record<string, unknown>): string {
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

  return [baseClasses, alignmentClass, gapClass].filter(Boolean).flat().join(' ')
}

/**
 * Build grid-specific classes based on theme breakpoints
 */
export function buildGridClasses(theme?: Theme): string | undefined {
  if (!theme?.breakpoints?.sm) {
    return undefined
  }
  return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
}

/**
 * Get shadow class for component type based on theme conventions
 */
export function getShadowForType(
  type: string,
  substitutedProps?: Record<string, unknown>
): string | undefined {
  const customShadow = substitutedProps?.shadow as string | undefined
  if (customShadow) {
    return `shadow-${customShadow}`
  }

  const shadowMap: Record<string, string> = {
    card: 'shadow-md',
    modal: 'shadow-xl',
    input: 'shadow-inner',
    button: 'shadow-md',
    'list-item': 'shadow-sm',
    dropdown: 'shadow-lg',
  }

  return shadowMap[type]
}

/**
 * Build component props with all necessary attributes
 */
export function buildComponentProps({
  type: _type,
  substitutedProps,
  parsedStyle,
  blockName,
  blockInstanceIndex,
  contentEmpty,
  gridElementNoContent,
  firstTranslationKey,
  translationData,
  isBlockWithChildren,
  hasScrollAnimation,
  hasHoverAnimation,
  hasClickAnimation,
  hasEntranceAnimation,
  className,
}: {
  readonly type: string
  readonly substitutedProps?: Record<string, unknown>
  readonly parsedStyle?: Record<string, unknown>
  readonly blockName?: string
  readonly blockInstanceIndex?: number
  readonly contentEmpty?: boolean
  readonly gridElementNoContent?: boolean
  readonly firstTranslationKey?: string
  readonly translationData?: Record<string, unknown>
  readonly isBlockWithChildren?: boolean
  readonly hasScrollAnimation?: boolean
  readonly hasHoverAnimation?: boolean
  readonly hasClickAnimation?: boolean
  readonly hasEntranceAnimation?: boolean
  readonly className?: string
}): Record<string, unknown> {
  return {
    ...substitutedProps,
    style: parsedStyle,
    className,
    ...(blockName && {
      'data-block': blockName,
      'data-testid':
        blockInstanceIndex !== undefined ? `${blockName}-${blockInstanceIndex}` : blockName,
    }),
    ...(contentEmpty &&
      !blockName && {
        style: { ...parsedStyle, minHeight: '1px', display: 'block' },
      }),
    ...(gridElementNoContent && {
      style: { ...parsedStyle, minHeight: '1px', minWidth: '1px' },
    }),
    ...(firstTranslationKey && {
      'data-translation-key': firstTranslationKey,
    }),
    ...(translationData && {
      'data-translations': JSON.stringify(translationData),
    }),
    ...(isBlockWithChildren && {
      role: 'group',
    }),
    ...(hasScrollAnimation && {
      'data-scroll-animation': 'scaleUp',
    }),
    ...(hasHoverAnimation && {
      'data-hover-animation': 'true',
    }),
    ...(hasClickAnimation && {
      'data-click-interaction': 'true',
    }),
    ...(hasEntranceAnimation && {
      'data-entrance-animation': 'fadeIn',
    }),
  }
}

/**
 * Check if component type should receive role="group"
 */
export function isContainerType(type: string): boolean {
  return (CONTAINER_TYPES as readonly string[]).includes(type)
}
