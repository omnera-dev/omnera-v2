/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { HoverInteraction } from '@/domain/models/app/page/common/interactions/hover-interaction'

/**
 * Generate CSS rule for hover interaction
 *
 * Creates a CSS rule with :hover pseudo-class for the given selector.
 * This allows Playwright's .hover() to trigger the CSS hover state correctly.
 *
 * @param selector - CSS selector (e.g., '[data-hover-id="hover-123"]')
 * @param hover - Hover interaction configuration
 * @returns CSS rule string or undefined if no hover config
 *
 * @example
 * ```typescript
 * const css = generateHoverCSS('[data-hover-id="hover-1"]', {
 *   transform: 'scale(1.05)',
 *   duration: '200ms',
 *   easing: 'ease-out'
 * })
 * // Returns:
 * // [data-hover-id="hover-1"] {
 * //   transition: transform 200ms ease-out;
 * // }
 * // [data-hover-id="hover-1"]:hover {
 * //   transform: scale(1.05);
 * // }
 * ```
 */
export function generateHoverCSS(
  selector: string,
  hover: HoverInteraction | undefined
): string | undefined {
  if (!hover) return undefined

  const transitionProperties: string[] = []
  const hoverRules: string[] = []
  const duration = hover.duration ?? '200ms'
  const easing = hover.easing ?? 'ease-out'

  // Build transition and hover rules
  if (hover.transform) {
    transitionProperties.push(`transform ${duration} ${easing}`)
    hoverRules.push(`  transform: ${hover.transform};`)
  }
  if (hover.opacity !== undefined) {
    transitionProperties.push(`opacity ${duration} ${easing}`)
    hoverRules.push(`  opacity: ${hover.opacity};`)
  }
  if (hover.backgroundColor) {
    transitionProperties.push(`background-color ${duration} ${easing}`)
    hoverRules.push(`  background-color: ${hover.backgroundColor};`)
  }
  if (hover.color) {
    transitionProperties.push(`color ${duration} ${easing}`)
    hoverRules.push(`  color: ${hover.color};`)
  }
  if (hover.borderColor) {
    transitionProperties.push(`border-color ${duration} ${easing}`)
    hoverRules.push(`  border-color: ${hover.borderColor};`)
  }
  if (hover.shadow) {
    transitionProperties.push(`box-shadow ${duration} ${easing}`)
    hoverRules.push(`  box-shadow: ${hover.shadow};`)
  }

  if (transitionProperties.length === 0) return undefined

  // Generate CSS rules
  const baseRule = `${selector} {\n  transition: ${transitionProperties.join(', ')};\n}`
  const hoverRule = `${selector}:hover {\n${hoverRules.join('\n')}\n}`

  return `${baseRule}\n${hoverRule}`
}

/**
 * Generate unique hover ID for a component
 *
 * @param type - Component type
 * @param index - Component index
 * @returns Unique hover ID string
 */
export function generateHoverId(type: string, index?: number): string {
  const indexPart = index !== undefined ? `-${index}` : ''
  return `hover-${type}${indexPart}-${Math.random().toString(36).substring(2, 9)}`
}
