/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { HoverInteraction } from '@/domain/models/app/page/common/interactions/hover-interaction'

/**
 * Build CSS transition styles for base element state
 *
 * Generates transition property for smooth hover animations.
 * Applied to the base element to define which properties should animate.
 *
 * @param hover - Hover interaction configuration
 * @returns Transition style object or undefined
 */
export function buildHoverTransitionStyles(
  hover: HoverInteraction | undefined
): Record<string, string> | undefined {
  if (!hover) return undefined

  const duration = hover.duration ?? '200ms'
  const easing = hover.easing ?? 'ease-out'

  // Build transition property list for all animatable properties
  const transitionProps: string[] = []
  if (hover.transform) transitionProps.push('transform')
  if (hover.opacity !== undefined) transitionProps.push('opacity')
  if (hover.backgroundColor) transitionProps.push('background-color')
  if (hover.color) transitionProps.push('color')
  if (hover.borderColor) transitionProps.push('border-color')
  if (hover.shadow) transitionProps.push('box-shadow')

  if (transitionProps.length === 0) return undefined

  return {
    transition: transitionProps.map((prop) => `${prop} ${duration} ${easing}`).join(', '),
  }
}

/**
 * Build hover effect data for component
 *
 * Returns data attributes and style tag content for hover interactions.
 * Uses a unique identifier to scope hover styles to specific elements.
 *
 * @param hover - Hover interaction configuration
 * @param uniqueId - Unique identifier for the element
 * @returns Hover data object with attributes and styles
 */
export function buildHoverData(
  hover: HoverInteraction | undefined,
  uniqueId: string
): {
  readonly attributes: Record<string, string>
  readonly styleContent: string
} | undefined {
  if (!hover) return undefined

  const hoverRules: string[] = []

  if (hover.transform) hoverRules.push(`transform: ${hover.transform}`)
  if (hover.opacity !== undefined) hoverRules.push(`opacity: ${hover.opacity}`)
  if (hover.backgroundColor) hoverRules.push(`background-color: ${hover.backgroundColor}`)
  if (hover.color) hoverRules.push(`color: ${hover.color}`)
  if (hover.borderColor) hoverRules.push(`border-color: ${hover.borderColor}`)
  if (hover.shadow) hoverRules.push(`box-shadow: ${hover.shadow}`)

  if (hoverRules.length === 0) return undefined

  return {
    attributes: { 'data-hover-id': uniqueId },
    styleContent: `[data-hover-id="${uniqueId}"]:hover { ${hoverRules.join('; ')} }`,
  }
}
