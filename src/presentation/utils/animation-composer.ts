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
 * Configuration for composing animations
 */
interface AnimationComposerConfig {
  readonly baseStyle?: Record<string, unknown>
  readonly componentType: string
  readonly animationName: string
  readonly theme?: Theme
  readonly defaultDuration: string
  readonly defaultEasing: string
  readonly options?: AnimationStyleOptions
}

/**
 * Extract animation timing from config
 */
function extractAnimationTiming(
  animationConfig: unknown,
  defaultDuration: string,
  defaultEasing: string
) {
  const duration =
    typeof animationConfig === 'object' && animationConfig !== null && 'duration' in animationConfig
      ? (animationConfig.duration as string)
      : defaultDuration

  const easing =
    typeof animationConfig === 'object' && animationConfig !== null && 'easing' in animationConfig
      ? (animationConfig.easing as string)
      : defaultEasing

  return { duration, easing }
}

/**
 * Convert camelCase to kebab-case for CSS
 */
function toKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * Build animation style object
 */
function buildAnimationStyle(
  baseStyle: Record<string, unknown> | undefined,
  animationValue: string,
  options?: AnimationStyleOptions
): Record<string, unknown> {
  return {
    ...baseStyle,
    animation: animationValue,
    ...(options?.animationPlayState && { animationPlayState: options.animationPlayState }),
    ...(options?.animationFillMode && { animationFillMode: options.animationFillMode }),
    ...(options?.opacity !== undefined && { opacity: options.opacity }),
  }
}

/**
 * Compose animation style for a given component type
 *
 * Extracts animation configuration from theme and composes it with base style.
 * Follows functional programming principles: pure function, immutable operations.
 *
 * @param config - Configuration object for animation composition
 * @returns New style object with animation composed
 *
 * @example
 * ```typescript
 * const style = composeAnimation({
 *   baseStyle,
 *   componentType: 'toast',
 *   animationName: 'fadeOut',
 *   theme,
 *   defaultDuration: '300ms',
 *   defaultEasing: 'ease-out'
 * })
 * // Returns: { ...baseStyle, animation: 'fade-out 300ms ease-out' }
 * ```
 */
export function composeAnimation(config: AnimationComposerConfig): Record<string, unknown>
export function composeAnimation(
  baseStyle: Record<string, unknown> | undefined,
  _componentType: string,
  animationName: string,
  theme: Theme | undefined,
  defaultDuration: string,
  defaultEasing: string,
  options?: AnimationStyleOptions
): Record<string, unknown> | undefined
export function composeAnimation(
  configOrBaseStyle: AnimationComposerConfig | Record<string, unknown> | undefined,
  _componentType?: string,
  animationName?: string,
  theme?: Theme,
  defaultDuration?: string,
  defaultEasing?: string,
  options?: AnimationStyleOptions
): Record<string, unknown> | undefined {
  // Handle new config object signature
  if (
    configOrBaseStyle &&
    typeof configOrBaseStyle === 'object' &&
    'animationName' in configOrBaseStyle
  ) {
    const cfg = configOrBaseStyle as AnimationComposerConfig
    const animationConfig = cfg.theme?.animations?.[cfg.animationName]
    if (!animationConfig) {
      return cfg.baseStyle
    }

    const { duration, easing } = extractAnimationTiming(
      animationConfig,
      cfg.defaultDuration,
      cfg.defaultEasing
    )
    const infiniteSuffix = cfg.options?.infinite ? ' infinite' : ''
    const animationValue = `${toKebabCase(cfg.animationName)} ${duration} ${easing}${infiniteSuffix}`

    return buildAnimationStyle(cfg.baseStyle, animationValue, cfg.options)
  }

  // Handle legacy positional parameters (backwards compatibility)
  const baseStyle = configOrBaseStyle as Record<string, unknown> | undefined
  const animationConfig = theme?.animations?.[animationName!]
  if (!animationConfig) {
    return baseStyle
  }

  const { duration, easing } = extractAnimationTiming(
    animationConfig,
    defaultDuration!,
    defaultEasing!
  )
  const infiniteSuffix = options?.infinite ? ' infinite' : ''
  const animationValue = `${toKebabCase(animationName!)} ${duration} ${easing}${infiniteSuffix}`

  return buildAnimationStyle(baseStyle, animationValue, options)
}
