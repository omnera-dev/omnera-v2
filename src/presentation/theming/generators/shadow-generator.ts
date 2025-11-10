/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Theme } from '@/domain/models/app/theme'

/**
 * Generate CSS custom properties for theme shadows
 * Creates --shadow-{name} variables for shadow values
 *
 * @param shadows - Shadow configuration from theme
 * @returns CSS string with shadow custom properties
 */
export function generateShadowStyles(shadows?: Theme['shadows']): string {
  if (!shadows) {
    return ''
  }

  const shadowVariables: ReadonlyArray<string> = Object.entries(shadows).map(
    ([name, value]) => `  --shadow-${name}: ${value};`
  )

  return shadowVariables.length > 0 ? [':root {', ...shadowVariables, '}'].join('\n') : ''
}
