/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { isCssValue } from '@/presentation/utils/style-utils'
import { generateAnimationStyles } from './animation-generator'
import { generateColorStyles } from './color-generator'
import { generateTypographyStyles } from './typography-generator'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Generate CSS custom properties for theme shadows
 * Creates --shadow-{name} variables
 */
function generateShadowVariables(shadows?: Theme['shadows']): ReadonlyArray<string> {
  if (!shadows) {
    return []
  }

  return Object.entries(shadows).map(([name, value]) => `  --shadow-${name}: ${value};`)
}

/**
 * Generate CSS custom properties for theme spacing
 * Converts rem units to px for CSS custom properties (1rem = 16px)
 */
function generateSpacingVariables(spacing?: Theme['spacing']): ReadonlyArray<string> {
  if (!spacing) {
    return []
  }

  return Object.entries(spacing).flatMap(([name, value]) => {
    if (!value) {
      return []
    }
    // Convert rem to px: 4rem → 64px, 80rem → 1280px
    const pxValue = value.replace(/([0-9.]+)rem/, (_, num) => `${parseFloat(num) * 16}px`)
    return [`  --spacing-${name}: ${pxValue};`]
  })
}

/**
 * Generate CSS custom properties for theme border radius
 */
function generateBorderRadiusVariables(
  borderRadius?: Theme['borderRadius']
): ReadonlyArray<string> {
  if (!borderRadius) {
    return []
  }

  return Object.entries(borderRadius).map(([name, value]) => `  --radius-${name}: ${value};`)
}

/**
 * Generate spacing styles for section elements
 */
function generateSpacingStyles(spacing?: Theme['spacing']): ReadonlyArray<string> {
  if (!spacing) {
    return []
  }

  // Only apply spacing as CSS if it's a raw CSS value (contains units like rem, px, em, %)
  // Tailwind classes (py-16, sm:py-20, etc.) should be applied as className attributes
  return spacing.section && isCssValue(spacing.section)
    ? [`[data-testid="section"] { padding: ${spacing.section}; }`]
    : []
}

/**
 * Build CSS variables block from shadow, spacing, and border-radius variables
 */
function buildCssVariablesBlock(
  shadowVariables: readonly string[],
  spacingVariables: readonly string[],
  borderRadiusVariables: readonly string[]
): readonly string[] {
  const hasVariables =
    shadowVariables.length > 0 || spacingVariables.length > 0 || borderRadiusVariables.length > 0

  if (!hasVariables) {
    return []
  }

  return [':root {', ...shadowVariables, ...spacingVariables, ...borderRadiusVariables, '}']
}

/**
 * Check if theme has any style configurations
 */
function hasThemeStyles(theme: Theme): boolean {
  const { colors, spacing, animations, fonts, shadows, borderRadius } = theme
  return Boolean(colors || spacing || animations || fonts || shadows || borderRadius)
}

/**
 * Generate CSS from theme colors, spacing, animations, fonts, and shadows
 * Consolidates all theme-based CSS generation into a single function
 *
 * @param theme - Theme configuration from app schema
 * @returns CSS string with theme-based styles
 */
export function generateThemeStyles(theme?: Theme): string {
  if (!theme || !hasThemeStyles(theme)) {
    return ''
  }

  const { colors, spacing, animations, fonts, shadows, borderRadius } = theme

  const shadowVariables = generateShadowVariables(shadows)
  const spacingVariables = generateSpacingVariables(spacing)
  const borderRadiusVariables = generateBorderRadiusVariables(borderRadius)

  const cssVariables = buildCssVariablesBlock(
    shadowVariables,
    spacingVariables,
    borderRadiusVariables
  )

  const colorStyles = generateColorStyles(colors)
  const typographyStyles = generateTypographyStyles(fonts)
  const animationStyles = generateAnimationStyles(animations)
  const spacingStyles = generateSpacingStyles(spacing)

  const styles = [
    ...cssVariables,
    colorStyles,
    ...spacingStyles,
    typographyStyles,
    animationStyles,
  ].filter(Boolean)

  return styles.join('\n')
}
