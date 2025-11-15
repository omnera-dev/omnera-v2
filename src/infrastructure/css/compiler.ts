/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import tailwindcss from '@tailwindcss/postcss'
import { Effect, Ref } from 'effect'
import postcss from 'postcss'
import { generateClickAnimationCSS } from '@/infrastructure/css/click-animations'
import {
  generateThemeBorderRadius,
  generateThemeBreakpoints,
  generateThemeColors,
  generateThemeFonts,
  generateThemeShadows,
  generateThemeSpacing,
} from '@/infrastructure/css/theme-generators'
import { CSSCompilationError } from '@/infrastructure/errors/css-compilation-error'
import type { App } from '@/domain/models/app'
import type { Theme } from '@/domain/models/app/theme'
import type { AnimationsConfig, AnimationConfigObject } from '@/domain/models/app/theme/animations'

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
 * Resolve color token reference
 */
function resolveColorToken(tokenName: string, theme?: Theme): string | undefined {
  if (!theme?.colors || !(tokenName in theme.colors)) return undefined
  const colorValue = theme.colors[tokenName]
  return colorValue ? String(colorValue) : undefined
}

/**
 * Resolve easing token reference
 */
function resolveEasingToken(tokenName: string, theme?: Theme): string | undefined {
  if (!theme?.animations) return undefined
  const animations = theme.animations as Record<string, unknown>
  const easingTokens = animations.easing as Record<string, unknown> | undefined
  if (!easingTokens || typeof easingTokens !== 'object' || !(tokenName in easingTokens))
    return undefined
  const easingValue = easingTokens[tokenName]
  return easingValue ? String(easingValue) : undefined
}

/**
 * Resolve token references in a value
 * Supports: $colors.primary, $easing.smooth, etc.
 */
function resolveTokenReference(value: unknown, theme?: Theme): string {
  if (typeof value !== 'string') return String(value)

  const tokenMatch = value.match(/^\$(\w+)\.(\w+)$/)
  if (!tokenMatch) return value

  const [, category, tokenName] = tokenMatch
  if (!category || !tokenName) return value

  return (
    (category === 'colors' ? resolveColorToken(tokenName, theme) : undefined) ??
    (category === 'easing' ? resolveEasingToken(tokenName, theme) : undefined) ??
    value
  )
}

/**
 * Generate @keyframes CSS for a single animation
 * Supports token references like $colors.primary
 */
function generateKeyframes(
  name: string,
  keyframes: Record<string, unknown>,
  theme?: Theme
): string {
  const keyframeSteps = Object.entries(keyframes)
    .map(([step, props]) => {
      const propsStr =
        typeof props === 'object' && props !== undefined
          ? Object.entries(props as Record<string, unknown>)
              .map(([prop, val]) => {
                const resolvedValue = resolveTokenReference(val, theme)
                return `${prop}: ${resolvedValue};`
              })
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
 * Check if animation name is a reserved design token property
 */
function isReservedAnimationProperty(name: string): boolean {
  return name === 'duration' || name === 'easing' || name === 'keyframes'
}

/**
 * Process animation config object
 * Returns array of CSS strings (keyframes + optional animation class)
 */
function processAnimationConfigObject(
  name: string,
  animConfig: AnimationConfigObject,
  theme?: Theme
): readonly string[] {
  if (!animConfig.keyframes) return []

  const keyframesCSS = generateKeyframes(name, animConfig.keyframes, theme)

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

/**
 * Process a single legacy animation config entry
 * Returns array of CSS strings (keyframes + optional animation class)
 */
function processLegacyAnimationEntry(
  name: string,
  config: unknown,
  theme?: Theme
): readonly string[] {
  if (isReservedAnimationProperty(name)) return []
  if (typeof config === 'boolean' && !config) return []
  if (typeof config === 'string') return []
  if (typeof config === 'object' && config !== undefined) {
    return processAnimationConfigObject(name, config as AnimationConfigObject, theme)
  }
  return []
}

/**
 * Generate @keyframes and animation CSS from domain animations config
 * Supports both nested design tokens and legacy flat animations
 */
function generateAnimationStyles(animations?: AnimationsConfig, theme?: Theme): string {
  if (!animations || Object.keys(animations).length === 0) return ''

  // Extract nested design tokens if present
  const keyframesTokens = animations.keyframes as
    | Record<string, Record<string, unknown>>
    | undefined

  // Generate keyframes from nested design tokens (immutable)
  const nestedKeyframesCSS =
    keyframesTokens && typeof keyframesTokens === 'object'
      ? Object.entries(keyframesTokens).flatMap(([name, keyframes]) =>
          keyframes && typeof keyframes === 'object'
            ? [generateKeyframes(name, keyframes, theme)]
            : []
        )
      : []

  // Process legacy flat animations (backwards compatibility, immutable)
  const legacyAnimationsCSS = Object.entries(animations).flatMap(([name, config]) =>
    processLegacyAnimationEntry(name, config, theme)
  )

  // Combine all CSS (immutable)
  const animationCSS: readonly string[] = [...nestedKeyframesCSS, ...legacyAnimationsCSS]

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
 * Title font configuration type
 */
interface TitleFontConfig {
  readonly style?: string
  readonly transform?: string
  readonly letterSpacing?: string
}

/**
 * Extract title font properties from theme fonts config
 * Returns undefined if no title font is configured
 */
function extractTitleFontProperties(theme?: Theme): TitleFontConfig | undefined {
  if (!theme?.fonts?.title || typeof theme.fonts.title !== 'object') {
    return undefined
  }

  return theme.fonts.title as TitleFontConfig
}

/**
 * Build CSS property strings for heading styles
 * Returns array of CSS properties based on title font configuration
 */
function buildHeadingStyleProperties(titleFont?: TitleFontConfig): readonly string[] {
  if (!titleFont) return []

  const styleProperty =
    titleFont.style && titleFont.style !== 'normal'
      ? `font-style: var(--font-title-style);`
      : undefined

  const transformProperty =
    titleFont.transform && titleFont.transform !== 'none'
      ? `text-transform: var(--font-title-transform);`
      : undefined

  const letterSpacingProperty = titleFont.letterSpacing
    ? `letter-spacing: var(--font-title-letter-spacing);`
    : undefined

  return [styleProperty, transformProperty, letterSpacingProperty].filter(
    (prop): prop is string => prop !== undefined
  )
}

/**
 * Generate heading CSS with base classes and optional style properties
 * Combines heading classes with additional CSS properties
 */
function generateHeadingStyles(
  headingClasses: readonly string[],
  styleProps: readonly string[]
): string {
  const baseStyles = `@apply ${headingClasses.join(' ')};`
  if (styleProps.length === 0) return baseStyles

  return `${baseStyles}
        ${styleProps.join('\n        ')}`
}

/**
 * Theme color flags extracted from theme configuration
 */
interface ThemeColorFlags {
  readonly hasTextColor: boolean
  readonly hasPrimaryColor: boolean
  readonly hasPrimaryHoverColor: boolean
}

/**
 * Extract color availability flags from theme
 * Returns flags indicating which colors are defined in the theme
 */
function extractThemeColorFlags(theme?: Theme): ThemeColorFlags {
  return {
    hasTextColor: Boolean(theme?.colors?.text),
    hasPrimaryColor: Boolean(theme?.colors?.primary),
    hasPrimaryHoverColor: Boolean(theme?.colors?.['primary-hover']),
  }
}

/**
 * Theme font flags extracted from theme configuration
 */
interface ThemeFontFlags {
  readonly hasTitleFont: boolean
  readonly hasBodyFont: boolean
}

/**
 * Extract font availability flags from theme
 * Returns flags indicating which fonts are defined in the theme
 */
function extractThemeFontFlags(theme?: Theme): ThemeFontFlags {
  return {
    hasTitleFont: Boolean(theme?.fonts?.title),
    hasBodyFont: Boolean(theme?.fonts?.body),
  }
}

/**
 * Generate base layer styles with theme color and font applications
 * Applies theme colors and fonts to base HTML elements if theme defines those tokens
 */
function generateBaseLayer(theme?: Theme): string {
  const colorFlags = extractThemeColorFlags(theme)
  const fontFlags = extractThemeFontFlags(theme)

  const bodyClasses = buildBodyClasses(colorFlags.hasTextColor, fontFlags.hasBodyFont)
  const headingClasses = buildHeadingClasses(colorFlags.hasTextColor, fontFlags.hasTitleFont)
  const linkClasses = buildLinkClasses(colorFlags.hasPrimaryColor, colorFlags.hasPrimaryHoverColor)

  const titleFont = extractTitleFontProperties(theme)
  const headingStyleProps = buildHeadingStyleProperties(titleFont)
  const headingStyles = generateHeadingStyles(headingClasses, headingStyleProps)

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
 * Build badge border-radius based on theme configuration
 * Uses theme.borderRadius.full if defined, otherwise falls back to rounded-full
 */
function buildBadgeBorderRadius(theme?: Theme): string {
  const hasFullRadius = Boolean(theme?.borderRadius?.full)
  return hasFullRadius ? 'border-radius: var(--radius-full);' : '@apply rounded-full;'
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
  const badgeBorderRadius = buildBadgeBorderRadius(theme)

  return `@layer components {
      .container-page {
        @apply mx-auto max-w-4xl px-4 py-8;
      }

      .card {
        @apply rounded-lg border border-gray-200 bg-white p-6 shadow-sm;
      }

      .badge {
        @apply border border-gray-200 bg-white px-2 py-1 text-xs font-medium;
        ${badgeBorderRadius}
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
 * Generate utilities layer styles
 * Combines static utilities with click interaction animations
 */
function generateUtilitiesLayer(): string {
  const clickAnimations = generateClickAnimationCSS()

  return `@layer utilities {
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

      ${clickAnimations}
    }`
}

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
  const animationCSS = generateAnimationStyles(theme?.animations, theme)
  const baseLayerCSS = generateBaseLayer(theme)
  const componentsLayerCSS = generateComponentsLayer(theme)
  const utilitiesLayerCSS = generateUtilitiesLayer()

  return [
    STATIC_IMPORTS,
    baseLayerCSS,
    componentsLayerCSS,
    utilitiesLayerCSS,
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
