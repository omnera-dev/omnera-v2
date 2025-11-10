/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { hexToRgb, toRgbColor } from '@/presentation/styling/color-utils'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Build heading color styles
 */
function buildHeadingStyles(colors: Theme['colors']): readonly string[] {
  if (!colors) return []
  if (colors.text) {
    return [`h1, h2, h3, h4, h5, h6, p { color: ${toRgbColor(colors.text)}; }`]
  }
  if (colors['gray-900']) {
    return [`h1, h2, h3, h4, h5, h6 { color: ${toRgbColor(colors['gray-900'])}; }`]
  }
  return []
}

/**
 * Build paragraph color styles
 */
function buildParagraphStyles(colors: Theme['colors']): readonly string[] {
  if (!colors || colors.text || !colors['gray-500']) {
    return []
  }
  return [`p { color: ${toRgbColor(colors['gray-500'])}; }`]
}

/**
 * Build button color styles
 */
function buildButtonStyles(colors: Theme['colors']): readonly string[] {
  if (!colors || !colors.primary) {
    return []
  }
  const baseStyle = `button { background-color: ${toRgbColor(colors.primary)}; color: #ffffff; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer; }`
  const hoverStyle = colors['primary-hover']
    ? `button:hover { background-color: ${toRgbColor(colors['primary-hover'])}; }`
    : undefined
  return [baseStyle, hoverStyle].filter(Boolean) as string[]
}

/**
 * Generate CSS custom properties for theme colors
 * Creates both --color-{name} and --{name} variables for compatibility
 * Converts hex colors to space-separated RGB for Tailwind v4
 *
 * @param colors - Color configuration from theme
 * @returns CSS string with color custom properties and element styles
 */
export function generateColorStyles(colors?: Theme['colors']): string {
  if (!colors) {
    return ''
  }

  const colorVariables = Object.entries(colors).flatMap(([name, value]) => {
    const rgbValue = hexToRgb(value)
    return [`  --color-${name}: ${rgbValue};`, `  --${name}: ${rgbValue};`]
  })

  const cssVariablesBlock =
    colorVariables.length > 0 ? [':root {', ...colorVariables, '}'].join('\n') : ''

  const elementStyles = [
    ...buildHeadingStyles(colors),
    ...buildParagraphStyles(colors),
    ...buildButtonStyles(colors),
  ]

  const elementStylesBlock = elementStyles.join('\n')

  return [cssVariablesBlock, elementStylesBlock].filter(Boolean).join('\n')
}
