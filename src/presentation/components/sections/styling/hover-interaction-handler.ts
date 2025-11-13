/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { HoverInteraction } from '@/domain/models/app/page/common/interactions/hover-interaction'

/**
 * Maps hover interaction properties to CSS property names
 *
 * @param hover - Hover interaction configuration
 * @returns Array of CSS property names
 */
function getAnimatableProperties(hover: HoverInteraction): ReadonlyArray<string> {
  return [
    hover.transform && 'transform',
    hover.opacity !== undefined && 'opacity',
    hover.backgroundColor && 'background-color',
    hover.color && 'color',
    hover.borderColor && 'border-color',
    hover.shadow && 'box-shadow',
  ].filter((prop): prop is string => Boolean(prop))
}

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
  const transitionProps = getAnimatableProperties(hover)

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

  // Build hover rules list (immutable)
  const hoverRules = [
    hover.transform && `transform: ${hover.transform}`,
    hover.opacity !== undefined && `opacity: ${hover.opacity}`,
    hover.backgroundColor && `background-color: ${hover.backgroundColor}`,
    hover.color && `color: ${hover.color}`,
    hover.borderColor && `border-color: ${hover.borderColor}`,
    hover.shadow && `box-shadow: ${hover.shadow}`,
  ].filter((rule): rule is string => Boolean(rule))

  if (hoverRules.length === 0) return undefined

  return {
    attributes: { 'data-hover-id': uniqueId },
    styleContent: `[data-hover-id="${uniqueId}"]:hover { ${hoverRules.join('; ')} }`,
  }
}
