/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Theme } from '@/domain/models/app/theme'

/**
 * Additional style properties to apply when composing animation
 */
interface AnimationStyleOptions {
  readonly animationPlayState?: string
  readonly animationFillMode?: string
  readonly opacity?: number
  readonly infinite?: boolean
}

/**
 * Compose animation style for a given component type
 *
 * Extracts animation configuration from theme and composes it with base style.
 * Follows functional programming principles: pure function, immutable operations.
 *
 * @param baseStyle - Base style object to extend
 * @param componentType - Component type (e.g., 'toast', 'card', 'fab')
 * @param animationName - Animation name from theme (e.g., 'fadeOut', 'scaleUp', 'float')
 * @param theme - Theme configuration containing animations
 * @param defaultDuration - Default duration if not specified in theme
 * @param defaultEasing - Default easing if not specified in theme
 * @param options - Additional animation style properties
 * @returns New style object with animation composed
 *
 * @example
 * ```typescript
 * const style = composeAnimation(
 *   baseStyle,
 *   'toast',
 *   'fadeOut',
 *   theme,
 *   '300ms',
 *   'ease-out'
 * )
 * // Returns: { ...baseStyle, animation: 'fade-out 300ms ease-out' }
 * ```
 */
export function composeAnimation(
  baseStyle: Record<string, unknown> | undefined,
  _componentType: string,
  animationName: string,
  theme: Theme | undefined,
  defaultDuration: string,
  defaultEasing: string,
  options?: AnimationStyleOptions
): Record<string, unknown> | undefined {
  // Early return if theme or animation config doesn't exist
  const animationConfig = theme?.animations?.[animationName]
  if (!animationConfig) {
    return baseStyle
  }

  // Extract duration and easing from config with fallback to defaults
  const duration =
    typeof animationConfig === 'object' && 'duration' in animationConfig
      ? animationConfig.duration
      : defaultDuration

  const easing =
    typeof animationConfig === 'object' && 'easing' in animationConfig
      ? animationConfig.easing
      : defaultEasing

  // Convert animation name to kebab-case for CSS (e.g., fadeOut → fade-out)
  const kebabAnimationName = animationName.replace(/([A-Z])/g, '-$1').toLowerCase()

  // Build animation value with optional infinite loop
  const infiniteSuffix = options?.infinite ? ' infinite' : ''
  const animationValue = `${kebabAnimationName} ${duration} ${easing}${infiniteSuffix}`

  // Compose new style object immutably
  return {
    ...baseStyle,
    animation: animationValue,
    ...(options?.animationPlayState && { animationPlayState: options.animationPlayState }),
    ...(options?.animationFillMode && { animationFillMode: options.animationFillMode }),
    ...(options?.opacity !== undefined && { opacity: options.opacity }),
  }
}
