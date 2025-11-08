/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { hexToRgb, toRgbColor } from '@/presentation/utils/color-utils'
import type { Theme } from '@/domain/models/app/theme'

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

  // Build CSS custom properties for theme colors
  // Generate both --color-{name} and --{name} for maximum compatibility
  const colorVariables: ReadonlyArray<string> = Object.entries(colors).flatMap(([name, value]) => {
    const rgbValue = hexToRgb(value)
    return [`  --color-${name}: ${rgbValue};`, `  --${name}: ${rgbValue};`]
  })

  const cssVariablesBlock =
    colorVariables.length > 0 ? [':root {', ...colorVariables, '}'].join('\n') : ''

  // Build color styles for semantic HTML elements
  const gray900 = colors['gray-900']
  const gray500 = colors['gray-500']
  const {text} = colors
  const {primary} = colors
  const primaryHover = colors['primary-hover']

  const elementStyles: ReadonlyArray<string> = [
    ...(text ? [`h1, h2, h3, h4, h5, h6, p { color: ${toRgbColor(text)}; }`] : []),
    ...(gray900 && !text ? [`h1, h2, h3, h4, h5, h6 { color: ${toRgbColor(gray900)}; }`] : []),
    ...(gray500 && !text ? [`p { color: ${toRgbColor(gray500)}; }`] : []),
    ...(primary
      ? [
          `button { background-color: ${toRgbColor(primary)}; color: #ffffff; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer; }`,
        ]
      : []),
    ...(primary && primaryHover
      ? [`button:hover { background-color: ${toRgbColor(primaryHover)}; }`]
      : []),
  ]

  const elementStylesBlock = elementStyles.join('\n')

  return [cssVariablesBlock, elementStylesBlock].filter(Boolean).join('\n')
}
