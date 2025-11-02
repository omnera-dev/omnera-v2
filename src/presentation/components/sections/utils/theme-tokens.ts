/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Theme } from '@/domain/models/app/theme'

/**
 * Substitutes theme tokens in a value
 *
 * Replaces `$theme.category.key` patterns with actual theme values.
 * Example: `$theme.colors.primary` → `#007bff`
 *
 * @param value - Value that may contain theme tokens
 * @param theme - Theme configuration
 * @returns Value with theme tokens replaced
 *
 * @example
 * ```typescript
 * const theme = { colors: { primary: '#007bff' } }
 * substituteThemeTokens('$theme.colors.primary', theme) // '#007bff'
 * substituteThemeTokens('static', theme)                // 'static'
 * substituteThemeTokens(123, theme)                      // 123
 * ```
 */
export function substituteThemeTokens(value: unknown, theme?: Theme): unknown {
  if (typeof value !== 'string') {
    return value
  }

  if (!theme || !value.startsWith('$theme.')) {
    return value
  }

  // Extract the path: $theme.colors.primary → ['colors', 'primary']
  const path = value.slice(7).split('.')

  // Navigate through the theme object using functional reduce
  const result = path.reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    // Return a sentinel to indicate path not found
    return undefined
  }, theme as unknown)

  // If path navigation failed, return original value
  return result !== undefined ? result : value
}

/**
 * Substitutes theme tokens in props recursively
 *
 * Walks through props object and replaces all theme token strings with actual theme values.
 * Handles nested objects (e.g., style props) recursively.
 *
 * @param props - Component props that may contain theme tokens
 * @param theme - Theme configuration
 * @returns Props with theme tokens replaced
 *
 * @example
 * ```typescript
 * const theme = { colors: { primary: '#007bff', secondary: '#6c757d' } }
 * const props = {
 *   color: '$theme.colors.primary',
 *   style: { backgroundColor: '$theme.colors.secondary' }
 * }
 * substitutePropsThemeTokens(props, theme)
 * // {
 * //   color: '#007bff',
 * //   style: { backgroundColor: '#6c757d' }
 * // }
 * ```
 */
export function substitutePropsThemeTokens(
  props: Record<string, unknown> | undefined,
  theme?: Theme
): Record<string, unknown> | undefined {
  if (!props || !theme) {
    return props
  }

  // Use functional Object.entries + reduce for immutable transformation
  return Object.entries(props).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (typeof value === 'string') {
      return { ...acc, [key]: substituteThemeTokens(value, theme) }
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recursively handle nested objects (like style props)
      return { ...acc, [key]: substitutePropsThemeTokens(value as Record<string, unknown>, theme) }
    } else {
      return { ...acc, [key]: value }
    }
  }, {})
}
