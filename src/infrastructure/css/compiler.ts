/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import tailwindcss from '@tailwindcss/postcss'
import { Effect, Ref } from 'effect'
import postcss from 'postcss'
import { CSSCompilationError } from '@/infrastructure/errors/css-compilation-error'
import type { App } from '@/domain/models/app'
import type { Theme } from '@/domain/models/app/theme'
import type { AnimationsConfig, AnimationConfigObject } from '@/domain/models/app/theme/animations'
import type { BorderRadiusConfig } from '@/domain/models/app/theme/border-radius'
import type { BreakpointsConfig } from '@/domain/models/app/theme/breakpoints'
import type { ColorsConfig } from '@/domain/models/app/theme/colors'
import type { FontsConfig } from '@/domain/models/app/theme/fonts'
import type { ShadowsConfig } from '@/domain/models/app/theme/shadows'
import type { SpacingConfig } from '@/domain/models/app/theme/spacing'

/**
 * Compiled CSS result with metadata
 */
export interface CompiledCSS {
  readonly css: string
  readonly timestamp: number
}

/**
 * In-memory cache for compiled CSS using Effect.Ref
 * Stores multiple themes keyed by theme hash
 * Avoids recompiling on every request for better performance
 * Uses functional state management to avoid mutations
 */
const cssCache = Ref.unsafeMake<Map<string, CompiledCSS>>(new Map())

/**
 * Generate Tailwind @theme colors from domain color config
 * Uses hex format directly - Tailwind v4 handles color format conversion
 */
function generateThemeColors(colors?: ColorsConfig): string {
  if (!colors || Object.keys(colors).length === 0) return ''

  const colorEntries = Object.entries(colors).map(([name, value]) => {
    return `    --color-${name}: ${value};`
  })

  return colorEntries.join('\n')
}

/**
 * Generate Tailwind @theme font families from domain font config
 */
function generateThemeFonts(fonts?: FontsConfig): string {
  if (!fonts || Object.keys(fonts).length === 0) return ''

  const fontEntries = Object.entries(fonts).flatMap(([category, config]) => {
    // Type assertion needed because Record values are unknown in TypeScript
    const fontConfig = config as {
      family: string
      fallback?: string
      style?: string
      transform?: string
      letterSpacing?: string
    }
    const fontStack = fontConfig.fallback
      ? `${fontConfig.family}, ${fontConfig.fallback}`
      : fontConfig.family

    const entries = [`    --font-${category}: ${fontStack};`]

    // Add font-style CSS variable if specified
    if (fontConfig.style && fontConfig.style !== 'normal') {
      entries.push(`    --font-${category}-style: ${fontConfig.style};`)
    }

    // Add text-transform CSS variable if specified
    if (fontConfig.transform && fontConfig.transform !== 'none') {
      entries.push(`    --font-${category}-transform: ${fontConfig.transform};`)
    }

    // Add letter-spacing CSS variable if specified
    if (fontConfig.letterSpacing) {
      entries.push(`    --font-${category}-letter-spacing: ${fontConfig.letterSpacing};`)
    }

    return entries
  })

  return fontEntries.join('\n')
}

/**
 * Generate Tailwind @theme spacing from domain spacing config
 * Only includes raw CSS values (rem, px, em), not Tailwind classes
 */
function generateThemeSpacing(spacing?: SpacingConfig): string {
  if (!spacing || Object.keys(spacing).length === 0) return ''

  const spacingEntries = Object.entries(spacing)
    .filter(([_, value]) => {
      // Only include raw CSS values (not Tailwind classes)
      return /^[0-9.]+(?:rem|px|em|%)$/.test(value as string)
    })
    .map(([name, value]) => `    --spacing-${name}: ${value};`)

  return spacingEntries.join('\n')
}

/**
 * Generate Tailwind @theme shadows from domain shadow config
 */
function generateThemeShadows(shadows?: ShadowsConfig): string {
  if (!shadows || Object.keys(shadows).length === 0) return ''

  const shadowEntries = Object.entries(shadows).map(([name, value]) => {
    // Preserve original shadow values as-is
    // The .shadow-none utility class override handles the actual rendering
    return `    --shadow-${name}: ${value};`
  })

  return shadowEntries.join('\n')
}

/**
 * Generate Tailwind @theme border radius from domain border radius config
 */
function generateThemeBorderRadius(borderRadius?: BorderRadiusConfig): string {
  if (!borderRadius || Object.keys(borderRadius).length === 0) return ''

  const radiusEntries = Object.entries(borderRadius).map(([name, value]) => {
    const key = name === 'DEFAULT' ? 'radius' : `radius-${name}`
    return `    --${key}: ${value};`
  })

  return radiusEntries.join('\n')
}

/**
 * Generate Tailwind @theme breakpoints from domain breakpoints config
 */
function generateThemeBreakpoints(breakpoints?: BreakpointsConfig): string {
  if (!breakpoints || Object.keys(breakpoints).length === 0) return ''

  const breakpointEntries = Object.entries(breakpoints).map(
    ([name, value]) => `    --breakpoint-${name}: ${value};`
  )

  return breakpointEntries.join('\n')
}

/**
 * Generate @keyframes CSS for a single animation
 */
function generateKeyframes(name: string, keyframes: Record<string, unknown>): string {
  const keyframeSteps = Object.entries(keyframes)
    .map(([step, props]) => {
      const propsStr =
        typeof props === 'object' && props !== null
          ? Object.entries(props as Record<string, unknown>)
              .map(([prop, val]) => `${prop}: ${val};`)
              .join(' ')
          : ''
      return `  ${step} { ${propsStr} }`
    })
    .join('\n')

  return `@keyframes ${name} {\n${keyframeSteps}\n}`
}

/**
 * Generate animation shorthand CSS
 */
function generateAnimationClass(
  name: string,
  duration?: string,
  easing?: string,
  delay?: string
): string {
  const dur = duration || '300ms'
  const ease = easing || 'ease'
  const del = delay || '0ms'
  return `.animate-${name} { animation: ${name} ${dur} ${ease} ${del}; }`
}

/**
 * Generate @keyframes and animation CSS from domain animations config
 */
function generateAnimationStyles(animations?: AnimationsConfig): string {
  if (!animations || Object.keys(animations).length === 0) return ''

  const animationCSS = Object.entries(animations).flatMap(([name, config]) => {
    if (typeof config === 'boolean' && !config) return []
    if (typeof config === 'string') return []

    if (typeof config === 'object' && config !== null) {
      const animConfig = config as AnimationConfigObject
      if (!animConfig.keyframes) return []

      const keyframesCSS = generateKeyframes(name, animConfig.keyframes)

      if (animConfig.enabled === false) {
        return [keyframesCSS]
      }

      const animationClass = generateAnimationClass(
        name,
        animConfig.duration,
        animConfig.easing,
        animConfig.delay
      )

      return [keyframesCSS, animationClass]
    }

    return []
  })

  return animationCSS.join('\n')
}

/**
 * Generate complete Tailwind @theme CSS from app theme
 */
function generateThemeCSS(theme?: Theme): string {
  if (!theme) return ''

  const themeTokens = [
    generateThemeColors(theme.colors),
    generateThemeFonts(theme.fonts),
    generateThemeSpacing(theme.spacing),
    generateThemeShadows(theme.shadows),
    generateThemeBorderRadius(theme.borderRadius),
    generateThemeBreakpoints(theme.breakpoints),
  ].filter(Boolean)

  if (themeTokens.length === 0) return ''

  return `@theme {\n${themeTokens.join('\n')}\n  }`
}

/**
 * Create theme cache key from app theme
 * Returns consistent hash for same theme content
 */
function getThemeCacheKey(theme?: Theme): string {
  return JSON.stringify(theme || {})
}

/**
 * Static CSS imports and custom variants
 */
const STATIC_IMPORTS = `@import 'tailwindcss';
    @import 'tw-animate-css';
    /*---break---
     */
    @custom-variant dark (&:is(.dark *));`

/**
 * Build body classes with optional text color and font
 */
function buildBodyClasses(hasTextColor: boolean, hasBodyFont: boolean): readonly string[] {
  const fontClass = hasBodyFont ? 'font-body' : 'font-sans'
  return hasTextColor ? [fontClass, 'antialiased', 'text-text'] : [fontClass, 'antialiased']
}

/**
 * Build heading classes with optional text color and font
 */
function buildHeadingClasses(hasTextColor: boolean, hasTitleFont: boolean): readonly string[] {
  const fontClass = hasTitleFont ? 'font-title' : 'font-sans'
  const baseClasses = hasTextColor
    ? [fontClass, 'font-semibold', 'tracking-tight', 'text-text']
    : [fontClass, 'font-semibold', 'tracking-tight']
  return baseClasses
}

/**
 * Build link classes with optional primary colors
 */
function buildLinkClasses(
  hasPrimaryColor: boolean,
  hasPrimaryHoverColor: boolean
): readonly string[] {
  if (hasPrimaryColor && hasPrimaryHoverColor) {
    return ['transition-colors', 'text-primary', 'hover:text-primary-hover']
  }
  if (hasPrimaryColor) {
    return ['transition-colors', 'text-primary']
  }
  return ['transition-colors', 'text-blue-600', 'hover:text-blue-700']
}

/**
 * Generate base layer styles with theme color and font applications
 * Applies theme colors and fonts to base HTML elements if theme defines those tokens
 */
function generateBaseLayer(theme?: Theme): string {
  const hasTextColor = Boolean(theme?.colors?.text)
  const hasPrimaryColor = Boolean(theme?.colors?.primary)
  const hasPrimaryHoverColor = Boolean(theme?.colors?.['primary-hover'])
  const hasTitleFont = Boolean(theme?.fonts?.title)
  const hasBodyFont = Boolean(theme?.fonts?.body)

  const bodyClasses = buildBodyClasses(hasTextColor, hasBodyFont)
  const headingClasses = buildHeadingClasses(hasTextColor, hasTitleFont)
  const linkClasses = buildLinkClasses(hasPrimaryColor, hasPrimaryHoverColor)

  // Extract title font properties for headings
  const titleFont =
    theme?.fonts?.title && typeof theme.fonts.title === 'object'
      ? (theme.fonts.title as {
          style?: string
          transform?: string
          letterSpacing?: string
        })
      : undefined

  // Build additional CSS properties for headings
  const headingStyleProps: string[] = []
  if (titleFont?.style && titleFont.style !== 'normal') {
    headingStyleProps.push(`font-style: var(--font-title-style);`)
  }
  if (titleFont?.transform && titleFont.transform !== 'none') {
    headingStyleProps.push(`text-transform: var(--font-title-transform);`)
  }
  if (titleFont?.letterSpacing) {
    headingStyleProps.push(`letter-spacing: var(--font-title-letter-spacing);`)
  }

  // Build heading styles with optional properties
  const headingStyles =
    headingStyleProps.length > 0
      ? `@apply ${headingClasses.join(' ')};
        ${headingStyleProps.join('\n        ')}`
      : `@apply ${headingClasses.join(' ')};`

  return `@layer base {
      body {
        @apply ${bodyClasses.join(' ')};
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        ${headingStyles}
      }

      a {
        @apply ${linkClasses.join(' ')};
      }
    }`
}

/**
 * Build button classes with optional primary colors
 */
function buildButtonClasses(
  hasPrimaryColor: boolean,
  hasPrimaryHoverColor: boolean
): readonly string[] {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-md',
    'px-4',
    'py-2',
    'font-medium',
    'transition-colors',
  ]

  if (hasPrimaryColor && hasPrimaryHoverColor) {
    return [...baseClasses, 'bg-primary', 'text-white', 'hover:bg-primary-hover']
  }
  if (hasPrimaryColor) {
    return [...baseClasses, 'bg-primary', 'text-white']
  }
  return [...baseClasses, 'bg-blue-600', 'text-white', 'hover:bg-blue-700']
}

/**
 * Build button primary utility classes
 */
function buildButtonPrimaryClasses(
  hasPrimaryColor: boolean,
  hasPrimaryHoverColor: boolean
): string {
  if (hasPrimaryColor && hasPrimaryHoverColor) {
    return 'bg-primary text-white hover:bg-primary-hover'
  }
  if (hasPrimaryColor) {
    return 'bg-primary text-white'
  }
  return 'bg-blue-600 text-white hover:bg-blue-700'
}

/**
 * Generate components layer styles with theme color applications
 * Applies theme colors to component classes and button elements
 */
function generateComponentsLayer(theme?: Theme): string {
  const hasPrimaryColor = Boolean(theme?.colors?.primary)
  const hasPrimaryHoverColor = Boolean(theme?.colors?.['primary-hover'])

  const btnClasses = buildButtonClasses(hasPrimaryColor, hasPrimaryHoverColor)
  const btnPrimaryClasses = buildButtonPrimaryClasses(hasPrimaryColor, hasPrimaryHoverColor)

  return `@layer components {
      .container-page {
        @apply mx-auto max-w-4xl px-4 py-8;
      }

      .card {
        @apply rounded-lg border border-gray-200 bg-white p-6 shadow-sm;
      }

      .badge {
        @apply rounded-full border border-gray-200 bg-white px-2 py-1 text-xs font-medium;
      }

      button {
        @apply ${btnClasses.join(' ')};
      }

      .btn {
        @apply ${btnClasses.join(' ')};
      }

      .btn-primary {
        @apply ${btnPrimaryClasses};
      }
    }`
}

/**
 * Utilities layer styles
 */
const UTILITIES_LAYER = `@layer utilities {
      .text-balance {
        text-wrap: balance;
      }

      /* Safelist: Ensure critical utility classes are always included */
      .text-center {
        text-align: center;
      }

      /* Override Tailwind v4's multi-layer shadow system for shadow-none */
      .shadow-none {
        box-shadow: none !important;
      }
    }`

/**
 * Final base layer for global resets
 * Note: Removed hardcoded utilities (border-border, bg-background, etc.)
 * These should be defined in the app theme if needed
 */
const FINAL_BASE_LAYER = ''

/**
 * Build dynamic SOURCE_CSS with theme tokens
 * Generates Tailwind CSS with @theme directive based on app theme
 */
function buildSourceCSS(theme?: Theme): string {
  const themeCSS = generateThemeCSS(theme)
  const animationCSS = generateAnimationStyles(theme?.animations)
  const baseLayerCSS = generateBaseLayer(theme)
  const componentsLayerCSS = generateComponentsLayer(theme)

  return [
    STATIC_IMPORTS,
    baseLayerCSS,
    componentsLayerCSS,
    UTILITIES_LAYER,
    '/*---break---\n     */',
    themeCSS,
    '/*---break---\n     */',
    animationCSS,
    '/*---break---\n     */',
    FINAL_BASE_LAYER,
  ]
    .filter(Boolean)
    .join('\n\n    ')
}

/**
 * Compiles Tailwind CSS using PostCSS with @tailwindcss/postcss plugin
 *
 * This function:
 * 1. Extracts theme from app config (if provided)
 * 2. Generates dynamic SOURCE_CSS with @theme tokens
 * 3. Processes through PostCSS with Tailwind CSS v4 plugin
 * 4. Returns the compiled CSS string
 * 5. Caches the result in memory per theme (subsequent requests use cache)
 *
 * @param app - Optional app configuration containing theme
 * @returns Effect that yields compiled CSS string or CSSCompilationError
 *
 * @example
 * ```typescript
 * // Without theme (minimal CSS)
 * const program = Effect.gen(function* () {
 *   const result = yield* compileCSS()
 *   console.log(`Compiled ${result.css.length} bytes of CSS`)
 * })
 *
 * // With app theme
 * const programWithTheme = Effect.gen(function* () {
 *   const result = yield* compileCSS(app)
 *   console.log(`Compiled ${result.css.length} bytes of CSS with theme`)
 * })
 *
 * Effect.runPromise(program)
 * ```
 */
export const compileCSS = (app?: App): Effect.Effect<CompiledCSS, CSSCompilationError> =>
  Effect.gen(function* () {
    const theme = app?.theme
    const cacheKey = getThemeCacheKey(theme)

    // Check cache first
    const cache = yield* Ref.get(cssCache)
    const cached = cache.get(cacheKey)
    if (cached !== undefined) {
      return cached
    }

    // Build SOURCE_CSS with theme
    const sourceCSS = buildSourceCSS(theme)

    // Process CSS through PostCSS with Tailwind plugin
    const result = yield* Effect.tryPromise({
      try: async () => {
        const processor = postcss([tailwindcss()])
        return await processor.process(sourceCSS, {
          from: process.cwd() + '/src/styles/global.css', // Source context for import resolution
          to: undefined, // No output file (in-memory compilation)
        })
      },
      catch: (error) => new CSSCompilationError(error),
    })

    // Create compiled CSS result
    const compiled: CompiledCSS = {
      css: result.css,
      timestamp: Date.now(),
    }

    // Update cache using immutable approach
    yield* Ref.update(cssCache, (currentCache) => new Map([...currentCache, [cacheKey, compiled]]))

    return compiled
  })
