/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { toKebabCase } from '@/presentation/utils/string-utils'
import { isCssValue } from '@/presentation/utils/style-utils'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Generate CSS keyframes for theme animations
 * Creates @keyframes rules for animations defined in theme
 *
 * @param animations - Animation configuration from theme
 * @returns Array of CSS keyframe strings
 */
function generateAnimationKeyframes(animations?: Theme['animations']): ReadonlyArray<string> {
  if (!animations) {
    return []
  }

  return Object.entries(animations).flatMap<string>(([name, config]) => {
    // Skip disabled animations
    if (typeof config === 'object' && 'enabled' in config && config.enabled === false) {
      return []
    }

    const kebabName = toKebabCase(name)

    // Generate default keyframes for common animations
    const defaultKeyframes: Record<string, string> = {
      'fade-in': `
        @keyframes ${kebabName} {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `,
      'slide-in': `
        @keyframes ${kebabName} {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `,
      pulse: `
        @keyframes ${kebabName} {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `,
    }

    // Use default keyframes if available
    const defaultKeyframe = defaultKeyframes[kebabName]
    if (defaultKeyframe) {
      return [defaultKeyframe]
    }

    // If config has custom keyframes, generate them
    if (typeof config === 'object' && config.keyframes) {
      const frames = Object.entries(config.keyframes)
        .map(([percent, styles]) => {
          const cssProps = Object.entries(styles as Record<string, unknown>)
            .map(([prop, value]) => `${toKebabCase(prop)}: ${value};`)
            .join(' ')
          return `${percent} { ${cssProps} }`
        })
        .join('\n          ')

      return [
        `
        @keyframes ${kebabName} {
          ${frames}
        }
      `,
      ]
    }

    return []
  })
}

/**
 * Convert hex color to RGB values for Tailwind CSS custom properties
 * Tailwind v4 expects colors as space-separated RGB values (r g b) for opacity support
 *
 * @param hex - Hex color string (#RRGGBB or #RGB)
 * @returns Space-separated RGB values (e.g., "255 0 0") or original value if not hex
 */
function hexToRgb(hex: string): string {
  // Return original value if not a hex color
  if (!hex.startsWith('#')) {
    return hex
  }

  // Remove # and handle 3-digit hex
  const cleanHex = hex.slice(1)
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((char) => char + char)
          .join('')
      : cleanHex

  // Parse RGB values
  const r = parseInt(fullHex.slice(0, 2), 16)
  const g = parseInt(fullHex.slice(2, 4), 16)
  const b = parseInt(fullHex.slice(4, 6), 16)

  // Return space-separated RGB for Tailwind
  return `${r} ${g} ${b}`
}

/**
 * Convert space-separated RGB to rgb() format for CSS color properties
 *
 * @param color - Color value (hex or already converted RGB)
 * @returns rgb() wrapped color or original value
 */
function toRgbColor(color: string): string {
  const rgb = hexToRgb(color)
  return rgb.includes(' ') ? `rgb(${rgb})` : color
}

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
  // Apply colors to semantic HTML elements using immutable array patterns
  const colors = theme?.colors
  const spacing = theme?.spacing
  const animations = theme?.animations
  const fonts = theme?.fonts
  const shadows = theme?.shadows
  const borderRadius = theme?.borderRadius

  if (!colors && !spacing && !animations && !fonts && !shadows && !borderRadius) {
    return ''
  }

  // Build CSS custom properties for theme colors and shadows
  // Use highest specificity selector to override Tailwind defaults
  // Generate both --color-{name} and --{name} for maximum compatibility
  // Convert hex colors to space-separated RGB for Tailwind v4 compatibility
  const colorVariables: ReadonlyArray<string> = colors
    ? Object.entries(colors).flatMap(([name, value]) => {
        const rgbValue = hexToRgb(value)
        return [`  --color-${name}: ${rgbValue};`, `  --${name}: ${rgbValue};`]
      })
    : []

  const shadowVariables: ReadonlyArray<string> = shadows
    ? Object.entries(shadows).map(([name, value]) => `  --shadow-${name}: ${value};`)
    : []

  // Build CSS custom properties for theme fonts
  // Generate --font-{category}-family variables for font families
  const fontVariables: ReadonlyArray<string> = fonts
    ? Object.entries(fonts).flatMap(([category, fontConfig]) => {
        if (!fontConfig || !fontConfig.family) {
          return []
        }
        return [`  --font-${category}-family: ${fontConfig.family};`]
      })
    : []

  // Build CSS custom properties for theme spacing
  // Convert rem units to px for CSS custom properties (1rem = 16px)
  const spacingVariables: ReadonlyArray<string> = spacing
    ? Object.entries(spacing).flatMap(([name, value]) => {
        if (!value) {
          return []
        }
        // Convert rem to px: 4rem → 64px, 80rem → 1280px
        const pxValue = value.replace(/([0-9.]+)rem/, (_, num) => `${parseFloat(num) * 16}px`)
        return [`  --spacing-${name}: ${pxValue};`]
      })
    : []

  // Build CSS custom properties for theme border radius
  // Generate --radius-{name} variables
  const borderRadiusVariables: ReadonlyArray<string> = borderRadius
    ? Object.entries(borderRadius).map(([name, value]) => `  --radius-${name}: ${value};`)
    : []

  const cssVariables: ReadonlyArray<string> =
    colorVariables.length > 0 ||
    shadowVariables.length > 0 ||
    fontVariables.length > 0 ||
    spacingVariables.length > 0 ||
    borderRadiusVariables.length > 0
      ? [
          ':root {',
          ...colorVariables,
          ...shadowVariables,
          ...fontVariables,
          ...spacingVariables,
          ...borderRadiusVariables,
          '}',
        ]
      : []

  // Build color styles array
  // Use rgb() wrapper for direct CSS color properties
  const gray900 = colors?.['gray-900']
  const gray500 = colors?.['gray-500']
  const text = colors?.text
  const primary = colors?.primary
  const primaryHover = colors?.['primary-hover']
  const colorStyles: ReadonlyArray<string> = [
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

  // Build spacing styles array
  // Only apply spacing as CSS if it's a raw CSS value (contains units like rem, px, em, %)
  // Tailwind classes (py-16, sm:py-20, etc.) should be applied as className attributes
  const spacingStyles: ReadonlyArray<string> = [
    ...(spacing?.section && isCssValue(spacing.section)
      ? [`[data-testid="section"] { padding: ${spacing.section}; }`]
      : []),
  ]

  // Build font styles for heading fonts (h1-h6)
  // Support both 'title' and 'heading' keys for heading fonts
  const headingFont = fonts?.heading || fonts?.title
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
  const monoFont = fonts?.mono
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

  const fontStyles: ReadonlyArray<string> = [...headingFontStyles, ...monoFontStyles]

  // Build animation keyframes
  const animationStyles = generateAnimationKeyframes(animations)

  // Build transition styles for interactive elements
  const transitionConfig = animations?.transition
  const transitionStyles: ReadonlyArray<string> =
    transitionConfig && typeof transitionConfig === 'object'
      ? [
          [
            'button {',
            `  transition: all ${transitionConfig.duration || '200ms'} ${transitionConfig.easing || 'ease-in-out'};`,
            '}',
          ].join('\n'),
        ]
      : []

  // Build parallax styles for hero sections with parallax animation
  const parallaxConfig = animations?.parallax
  const parallaxStyles: ReadonlyArray<string> = parallaxConfig
    ? [
        [
          '[data-testid="hero-background"] {',
          '  display: block;',
          '  min-height: 200px;',
          '  min-width: 100%;',
          '}',
        ].join('\n'),
      ]
    : []

  // Build typewriter styles for heading elements with typewriter animation
  const typewriterConfig = animations?.typewriter
  const typewriterStyles: ReadonlyArray<string> =
    typewriterConfig && typeof typewriterConfig === 'object'
      ? [
          [
            '[data-testid="hero-heading"] {',
            `  animation: typewriter ${typewriterConfig.duration || '4s'} ${typewriterConfig.easing || 'steps(40, end)'};`,
            '  overflow: hidden;',
            '  white-space: nowrap;',
            '  border-right: 2px solid;',
            '}',
          ].join('\n'),
        ]
      : []

  // Combine all styles
  const styles: ReadonlyArray<string> = [
    ...cssVariables,
    ...colorStyles,
    ...spacingStyles,
    ...fontStyles,
    ...animationStyles,
    ...transitionStyles,
    ...parallaxStyles,
    ...typewriterStyles,
  ]

  return styles.join('\n')
}
