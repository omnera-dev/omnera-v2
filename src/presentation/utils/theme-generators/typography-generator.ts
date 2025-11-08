/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Theme } from '@/domain/models/app/theme'

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

  // Build CSS custom properties for theme fonts
  const fontVariables: ReadonlyArray<string> = Object.entries(fonts).flatMap(
    ([category, fontConfig]) => {
      if (!fontConfig || !fontConfig.family) {
        return []
      }
      return [`  --font-${category}-family: ${fontConfig.family};`]
    }
  )

  const cssVariablesBlock =
    fontVariables.length > 0 ? [':root {', ...fontVariables, '}'].join('\n') : ''

  // Build font styles for heading fonts (h1-h6)
  // Support both 'title' and 'heading' keys for heading fonts
  const headingFont = fonts.heading || fonts.title
  const headingFontStyles: ReadonlyArray<string> = headingFont
    ? [
        [
          'h1, h2, h3, h4, h5, h6 {',
          headingFont.family &&
            `  font-family: ${headingFont.fallback ? `${headingFont.family}, ${headingFont.fallback}` : headingFont.family};`,
          headingFont.style && `  font-style: ${headingFont.style};`,
          headingFont.letterSpacing && `  letter-spacing: ${headingFont.letterSpacing};`,
          headingFont.transform && `  text-transform: ${headingFont.transform};`,
          '}',
        ]
          .filter(Boolean)
          .join('\n'),
      ]
    : []

  // Build font styles for mono font (code, pre)
  const monoFont = fonts.mono
  const monoFontStyles: ReadonlyArray<string> = monoFont
    ? [
        [
          'code, pre {',
          monoFont.family &&
            `  font-family: ${monoFont.fallback ? `${monoFont.family}, ${monoFont.fallback}` : monoFont.family};`,
          monoFont.style && `  font-style: ${monoFont.style};`,
          monoFont.size && `  font-size: ${monoFont.size};`,
          monoFont.lineHeight && `  line-height: ${monoFont.lineHeight};`,
          monoFont.letterSpacing && `  letter-spacing: ${monoFont.letterSpacing};`,
          monoFont.transform && `  text-transform: ${monoFont.transform};`,
          '}',
        ]
          .filter(Boolean)
          .join('\n'),
      ]
    : []

  const elementStylesBlock = [...headingFontStyles, ...monoFontStyles].join('\n')

  return [cssVariablesBlock, elementStylesBlock].filter(Boolean).join('\n')
}
