/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Theme } from '@/domain/models/app/theme'

type FontConfig = NonNullable<Theme['fonts']>[keyof NonNullable<Theme['fonts']>]

/**
 * Build font-family string with fallback
 */
function buildFontFamily(family?: string, fallback?: string): string | undefined {
  if (!family) {
    return undefined
  }
  return fallback ? `${family}, ${fallback}` : family
}

/**
 * Build font style properties for a font config
 */
function buildFontProperties(font: FontConfig): readonly (string | false | undefined)[] {
  const family = buildFontFamily(font.family, font.fallback)
  return [
    family && `  font-family: ${family};`,
    font.style && `  font-style: ${font.style};`,
    font.size && `  font-size: ${font.size};`,
    font.lineHeight && `  line-height: ${font.lineHeight};`,
    font.letterSpacing && `  letter-spacing: ${font.letterSpacing};`,
    font.transform && `  text-transform: ${font.transform};`,
  ]
}

/**
 * Build CSS block for element font styles
 */
function buildElementFontStyles(selector: string, font: FontConfig | undefined): string {
  if (!font) {
    return ''
  }
  const properties = buildFontProperties(font).filter(Boolean)
  if (properties.length === 0) {
    return ''
  }
  return [selector + ' {', ...properties, '}'].join('\n')
}

/**
 * Generate CSS custom properties and styles for theme fonts
 * Creates font-family custom properties and applies fonts to semantic elements
 *
 * @param fonts - Font configuration from theme
 * @returns CSS string with font custom properties and element styles
 */
export function generateTypographyStyles(fonts?: Theme['fonts']): string {
  if (!fonts) {
    return ''
  }

  const fontVariables = Object.entries(fonts).flatMap(([category, fontConfig]) => {
    if (!fontConfig?.family) {
      return []
    }
    return [`  --font-${category}-family: ${fontConfig.family};`]
  })

  const cssVariablesBlock =
    fontVariables.length > 0 ? [':root {', ...fontVariables, '}'].join('\n') : ''

  const headingFont = fonts.heading || fonts.title
  const headingStyles = buildElementFontStyles('h1, h2, h3, h4, h5, h6', headingFont)
  const monoStyles = buildElementFontStyles('code, pre', fonts.mono)

  const elementStylesBlock = [headingStyles, monoStyles].filter(Boolean).join('\n')

  return [cssVariablesBlock, elementStylesBlock].filter(Boolean).join('\n')
}
