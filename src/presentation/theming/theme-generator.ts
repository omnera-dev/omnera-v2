/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { generateAnimationStyles } from '@/presentation/theming/generators/animation-generator'
import { generateBorderRadiusStyles } from '@/presentation/theming/generators/border-radius-generator'
import { generateColorStyles } from '@/presentation/theming/generators/color-generator'
import { generateShadowStyles } from '@/presentation/theming/generators/shadow-generator'
import { generateSpacingStyles } from '@/presentation/theming/generators/spacing-generator'
import { generateTypographyStyles } from '@/presentation/theming/generators/typography-generator'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Generate CSS from theme colors, spacing, animations, fonts, and shadows
 * Applies theme colors to semantic HTML elements for visual hierarchy
 * Applies theme spacing to section elements for layout consistency
 * Applies theme fonts to heading elements (h1-h6) for typography system
 * Generates @keyframes for theme animations
 * Generates CSS custom properties for all theme colors (--color-{name})
 * Generates CSS custom properties for all theme shadows (--shadow-{name})
 * Note: Theme body font is applied via inline style attribute on body element (see DynamicPage component)
 *
 * @param theme - Theme configuration from app schema
 * @returns CSS string with theme-based styles
 */
export function generateThemeStyles(theme?: Theme): string {
  if (!theme) {
    return ''
  }

  return [
    generateColorStyles(theme.colors),
    generateSpacingStyles(theme.spacing),
    generateTypographyStyles(theme.fonts),
    generateShadowStyles(theme.shadows),
    generateBorderRadiusStyles(theme.borderRadius),
    generateAnimationStyles(theme.animations),
  ]
    .filter(Boolean)
    .join('\n')
}
