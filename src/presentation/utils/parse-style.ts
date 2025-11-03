/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { toKebabCase } from '@/presentation/utils/string-utils'

/**
 * Normalize animation names in CSS value to kebab-case
 *
 * Converts animation names (first token) from camelCase to kebab-case
 * while preserving other CSS values (duration, easing, etc.)
 *
 * @param animationValue - CSS animation value (e.g., "fadeIn 1s ease-in-out")
 * @returns Normalized animation value (e.g., "fade-in 1s ease-in-out")
 *
 * @example
 * ```typescript
 * normalizeAnimationValue('fadeIn 1s ease-in-out') // 'fade-in 1s ease-in-out'
 * normalizeAnimationValue('slideInUp 0.5s') // 'slide-in-up 0.5s'
 * ```
 */
function normalizeAnimationValue(animationValue: string): string {
  const parts = animationValue.trim().split(/\s+/)
  if (parts.length === 0) return animationValue

  // First part is the animation name, convert to kebab-case
  const animationName = parts[0]
  if (!animationName) return animationValue
  const normalizedName = toKebabCase(animationName)

  // Rejoin with other parts (duration, easing, etc.)
  return [normalizedName, ...parts.slice(1)].join(' ')
}

/**
 * Parse a CSS string into a React style object
 *
 * Converts kebab-case CSS properties to camelCase React style properties.
 * Handles semicolon-separated CSS declarations.
 * Normalizes animation names to kebab-case for consistency.
 *
 * @param styleString - CSS string (e.g., "background-color: #007bff; padding: 1rem;")
 * @returns React style object (e.g., { backgroundColor: '#007bff', padding: '1rem' })
 *
 * @example
 * ```typescript
 * const style = parseStyle('background-color: #007bff; padding: 1rem;')
 * // { backgroundColor: '#007bff', padding: '1rem' }
 * ```
 */
export function parseStyle(styleString: string): Record<string, string> {
  // Split by semicolon and process each declaration
  const declarations = styleString.split(';').filter((d) => d.trim())

  // Use reduce for immutable accumulation instead of for-of loop with mutations
  return declarations.reduce<Record<string, string>>((acc, declaration) => {
    const [property, value] = declaration.split(':').map((s) => s.trim())
    if (property && value) {
      // Convert kebab-case to camelCase (e.g., background-color → backgroundColor)
      const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())

      // Normalize animation names to kebab-case
      const normalizedValue = camelCaseProperty === 'animation' ? normalizeAnimationValue(value) : value

      return { ...acc, [camelCaseProperty]: normalizedValue }
    }
    return acc
  }, {})
}

/**
 * Normalize animation names in style object to kebab-case
 *
 * Converts animation property values from camelCase to kebab-case.
 * Useful for style objects (not CSS strings).
 *
 * @param style - React style object
 * @returns Style object with normalized animation names
 *
 * @example
 * ```typescript
 * const style = { animation: 'fadeIn 1s ease-in-out' }
 * normalizeStyleAnimations(style) // { animation: 'fade-in 1s ease-in-out' }
 * ```
 */
export function normalizeStyleAnimations(
  style: Record<string, unknown> | undefined
): Record<string, unknown> | undefined {
  if (!style) return style

  const animationValue = style.animation
  if (typeof animationValue === 'string') {
    return {
      ...style,
      animation: normalizeAnimationValue(animationValue),
    }
  }

  return style
}
