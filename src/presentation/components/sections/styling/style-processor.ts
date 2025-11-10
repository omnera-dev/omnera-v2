/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { normalizeStyleAnimations, parseStyle } from '@/presentation/styling/parse-style'
import { applyComponentAnimations } from './animation-composer-wrapper'
import { buildFlexClasses, buildGridClasses } from './class-builders'
import { getComponentShadow } from './shadow-resolver'
import type { Component } from '@/domain/models/app/page/sections'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Parse and normalize style object
 */
export function parseComponentStyle(styleValue: unknown): Record<string, unknown> | undefined {
  if (!styleValue) return undefined

  return normalizeStyleAnimations(
    typeof styleValue === 'string'
      ? parseStyle(styleValue)
      : (styleValue as Record<string, unknown>)
  )
}

/**
 * Build final className based on component type
 */
export function buildFinalClassName(
  type: Component['type'],
  className: unknown,
  theme: Theme | undefined,
  substitutedProps: Record<string, unknown> | undefined
): string | undefined {
  if (type === 'flex') {
    return [buildFlexClasses(substitutedProps), className].filter(Boolean).join(' ')
  }

  if (type === 'grid') {
    return [buildGridClasses(theme), className].filter(Boolean).join(' ')
  }

  return className as string | undefined
}

/**
 * Apply shadow to style based on component type
 */
export function applyComponentShadow(
  type: Component['type'],
  style: Record<string, unknown> | undefined,
  theme: Theme | undefined
): Record<string, unknown> | undefined {
  const componentShadow = getComponentShadow(type, theme)
  return componentShadow ? { ...style, ...componentShadow } : style
}

/**
 * Process style with animations and shadows
 */
export function processComponentStyle(
  type: Component['type'],
  styleValue: unknown,
  theme: Theme | undefined
): Record<string, unknown> | undefined {
  const baseStyle = parseComponentStyle(styleValue)
  const styleWithAnimations = applyComponentAnimations(type, baseStyle, theme)
  return applyComponentShadow(type, styleWithAnimations, theme)
}
