/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { isCssValue } from '@/presentation/styling/style-utils'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Build flex-specific classes based on props
 */
export function buildFlexClasses(props?: Record<string, unknown>): string {
  const baseClasses = ['flex']
  const alignmentClass =
    props?.align === 'start'
      ? 'items-start'
      : props?.align === 'center'
        ? 'items-center'
        : props?.align === 'end'
          ? 'items-end'
          : undefined
  const gapClass = typeof props?.gap === 'number' ? `gap-${props.gap}` : undefined

  return [...baseClasses, alignmentClass, gapClass].filter(Boolean).join(' ')
}

/**
 * Build grid-specific classes based on theme breakpoints
 */
export function buildGridClasses(theme?: Theme): string | undefined {
  const baseClasses = ['grid']
  const breakpointClass = theme?.breakpoints?.md ? 'md:grid-cols-2' : undefined

  return [...baseClasses, breakpointClass].filter(Boolean).join(' ')
}

/**
 * Get shadow token for card components
 * Prioritizes custom shadow names (e.g., neumorphic), then falls back to md
 */
function getCardShadow(shadows: Record<string, unknown>): string | undefined {
  const customShadow = Object.keys(shadows).find(
    (name) => !['sm', 'md', 'lg', 'xl', '2xl', 'inner', 'none'].includes(name)
  )
  return customShadow ?? (shadows.md ? 'md' : undefined)
}

/**
 * Get shadow token for button components
 * Prioritizes brand shadow, then falls back to md
 */
function getButtonShadow(shadows: Record<string, unknown>): string | undefined {
  return shadows.brand ? 'brand' : shadows.md ? 'md' : undefined
}

/**
 * Apply theme shadows to component types based on conventions
 * - Card components use available shadow tokens (md, neumorphic, etc.)
 * - Modal components use xl shadow
 * - Input components use inner shadow
 * - Button components use md shadow (or custom like brand)
 * - List-item components use sm shadow (lowest elevation)
 * - Dropdown components use lg shadow (higher than card, lower than modal)
 */
export function getComponentShadow(
  type: string,
  theme?: Theme
): Record<string, unknown> | undefined {
  if (!theme?.shadows) {
    return undefined
  }

  // Shadow mapping for component types
  const shadowToken: Record<string, string | undefined> = {
    'list-item': theme.shadows.sm ? 'sm' : undefined,
    card: getCardShadow(theme.shadows),
    dropdown: theme.shadows.lg ? 'lg' : undefined,
    modal: theme.shadows.xl ? 'xl' : undefined,
    input: theme.shadows.inner ? 'inner' : undefined,
    button: getButtonShadow(theme.shadows),
  }

  const token = shadowToken[type]
  return token ? { boxShadow: `var(--shadow-${token})` } : undefined
}

/**
 * Apply theme spacing to section elements when spacing.section is a CSS value
 */
export function getSectionSpacing(
  type: string,
  theme?: Theme
): Record<string, unknown> | undefined {
  const sectionSpacing = type === 'section' && theme?.spacing?.section
  return sectionSpacing && isCssValue(sectionSpacing) ? { padding: sectionSpacing } : undefined
}

/**
 * Apply theme spacing to container elements when spacing.container is a CSS value
 */
export function getContainerSpacing(
  type: string,
  theme?: Theme
): Record<string, unknown> | undefined {
  const containerSpacing = type === 'container' && theme?.spacing?.container
  return containerSpacing && isCssValue(containerSpacing)
    ? { maxWidth: containerSpacing, margin: '0 auto' }
    : undefined
}

/**
 * Apply theme spacing to flex elements when spacing.gap is a CSS value
 */
export function getFlexSpacing(type: string, theme?: Theme): Record<string, unknown> | undefined {
  const flexSpacing = type === 'flex' && theme?.spacing?.gap
  return flexSpacing && isCssValue(flexSpacing) ? { display: 'flex', gap: flexSpacing } : undefined
}

/**
 * Merge spacing styles into element props
 */
export function mergeSpacingStyles(
  elementProps: Record<string, unknown>,
  type: string,
  theme?: Theme
): Record<string, unknown> {
  const sectionSpacing = getSectionSpacing(type, theme)
  const containerSpacing = getContainerSpacing(type, theme)
  const flexSpacing = getFlexSpacing(type, theme)

  // If no spacing styles, return original props
  if (!sectionSpacing && !containerSpacing && !flexSpacing) {
    return elementProps
  }

  // Build combined spacing styles
  const spacingStyles = {
    ...sectionSpacing,
    ...containerSpacing,
    ...flexSpacing,
  }

  return {
    ...elementProps,
    style: {
      ...(elementProps.style as Record<string, unknown> | undefined),
      ...spacingStyles,
    },
  }
}
