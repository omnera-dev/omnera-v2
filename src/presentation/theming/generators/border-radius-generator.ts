/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Theme } from '@/domain/models/app/theme'

/**
 * Generate CSS custom properties for theme border radius
 * Creates --radius-{name} variables for border radius values
 *
 * @param borderRadius - Border radius configuration from theme
 * @returns CSS string with border radius custom properties
 */
export function generateBorderRadiusStyles(borderRadius?: Theme['borderRadius']): string {
  if (!borderRadius) {
    return ''
  }

  const borderRadiusVariables: ReadonlyArray<string> = Object.entries(borderRadius).map(
    ([name, value]) => `  --radius-${name}: ${value};`
  )

  return borderRadiusVariables.length > 0
    ? [':root {', ...borderRadiusVariables, '}'].join('\n')
    : ''
}
