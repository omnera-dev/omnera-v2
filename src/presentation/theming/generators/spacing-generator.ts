/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { isCssValue } from '@/presentation/styling/style-utils'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Generate CSS custom properties and styles for theme spacing
 * Converts rem units to px for CSS custom properties (1rem = 16px)
 * Only applies spacing as CSS if it's a raw CSS value (contains units)
 *
 * @param spacing - Spacing configuration from theme
 * @returns CSS string with spacing custom properties and element styles
 */
export function generateSpacingStyles(spacing?: Theme['spacing']): string {
  if (!spacing) {
    return ''
  }

  // Build CSS custom properties for theme spacing
  const spacingVariables: ReadonlyArray<string> = Object.entries(spacing).flatMap(
    ([name, value]) => {
      if (!value) {
        return []
      }
      // Convert rem to px: 4rem → 64px, 80rem → 1280px
      const pxValue = value.replace(/([0-9.]+)rem/, (_, num) => `${parseFloat(num) * 16}px`)
      return [`  --spacing-${name}: ${pxValue};`]
    }
  )

  const cssVariablesBlock =
    spacingVariables.length > 0 ? [':root {', ...spacingVariables, '}'].join('\n') : ''

  // Build spacing styles for section elements
  // Only apply spacing as CSS if it's a raw CSS value (contains units like rem, px, em, %)
  // Tailwind classes (py-16, sm:py-20, etc.) should be applied as className attributes
  const elementStyles: ReadonlyArray<string> = [
    ...(spacing.section && isCssValue(spacing.section)
      ? [`[data-testid="section"] { padding: ${spacing.section}; }`]
      : []),
  ]

  const elementStylesBlock = elementStyles.join('\n')

  return [cssVariablesBlock, elementStylesBlock].filter(Boolean).join('\n')
}
