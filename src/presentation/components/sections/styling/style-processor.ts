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
import type { Interactions } from '@/domain/models/app/page/common/interactions/interactions'
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
 * Component types that have corresponding CSS classes in @layer components
 * These classes are automatically added to the element when rendering
 */
const COMPONENT_TYPE_CLASSES = new Set(['card', 'badge', 'btn'])

/**
 * Build entrance animation class from interactions
 *
 * @param interactions - Component interactions
 * @returns Animation class or undefined
 */
function buildEntranceAnimationClass(interactions: Interactions | undefined): string | undefined {
  if (!interactions?.entrance?.animation) return undefined

  return `animate-${interactions.entrance.animation}`
}

/**
 * Build scroll animation class from interactions
 *
 * @param interactions - Component interactions
 * @returns Animation class or undefined
 */
function buildScrollAnimationClass(interactions: Interactions | undefined): string | undefined {
  if (!interactions?.scroll?.animation) return undefined

  return `animate-${interactions.scroll.animation}`
}

/**
 * Configuration for building final className
 */
type BuildClassNameConfig = {
  readonly type: Component['type']
  readonly className: unknown
  readonly theme: Theme | undefined
  readonly substitutedProps: Record<string, unknown> | undefined
  readonly interactions: Interactions | undefined
}

/**
 * Build final className based on component type
 */
export function buildFinalClassName(config: BuildClassNameConfig): string | undefined {
  const { type, className, theme, substitutedProps, interactions } = config

  // Build classes array immutably
  const typeClass = COMPONENT_TYPE_CLASSES.has(type) ? type : undefined
  const flexClass = type === 'flex' ? buildFlexClasses(substitutedProps) : undefined
  const gridClass = type === 'grid' ? buildGridClasses(theme) : undefined
  const customClass = className as string | undefined
  const entranceClass = buildEntranceAnimationClass(interactions)
  const scrollClass = buildScrollAnimationClass(interactions)

  const classes = [typeClass, flexClass, gridClass, customClass, entranceClass, scrollClass]
    .filter(Boolean)
    .join(' ')
  return classes || undefined
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
