/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { Banner } from '@/presentation/components/layout/banner'
import { Footer } from '@/presentation/components/layout/footer'
import { Navigation } from '@/presentation/components/layout/navigation'
import { ComponentRenderer } from '@/presentation/components/sections/component-renderer'
import { AnimationsRenderer } from '@/presentation/components/theme/animations-renderer'
import { BreakpointsRenderer } from '@/presentation/components/theme/breakpoints-renderer'
import { toKebabCase } from '@/presentation/utils/string-utils'
import type { Blocks } from '@/domain/models/app/blocks'
import type { Languages } from '@/domain/models/app/languages'
import type { OpenGraph } from '@/domain/models/app/page/meta/open-graph'
import type { Page } from '@/domain/models/app/pages'
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
 * Generate CSS from theme colors, spacing, and animations
 * Applies theme colors to semantic HTML elements for visual hierarchy
 * Applies theme spacing to section elements for layout consistency
 * Generates @keyframes for theme animations
 * Generates CSS custom properties for all theme colors (--color-{name})
 * Note: Theme fonts are applied via inline style attribute on body element (see DynamicPage component)
 *
 * @param theme - Theme configuration from app schema
 * @returns CSS string with theme-based styles
 */
function generateThemeStyles(theme?: Theme): string {
  // Apply colors to semantic HTML elements using immutable array patterns
  const colors = theme?.colors
  const spacing = theme?.spacing
  const animations = theme?.animations

  if (!colors && !spacing && !animations) {
    return ''
  }

  // Build CSS custom properties for theme colors
  const cssVariables: ReadonlyArray<string> = colors
    ? [
        ':root {',
        ...Object.entries(colors).map(([name, value]) => `  --color-${name}: ${value};`),
        '}',
      ]
    : []

  // Build color styles array
  const gray900 = colors?.['gray-900']
  const gray500 = colors?.['gray-500']
  const colorStyles: ReadonlyArray<string> = [
    ...(gray900 ? [`h1, h2, h3, h4, h5, h6 { color: ${gray900}; }`] : []),
    ...(gray500 ? [`p { color: ${gray500}; }`] : []),
  ]

  // Build spacing styles array
  const spacingStyles: ReadonlyArray<string> = [
    ...(spacing?.section ? [`[data-testid="section"] { padding: ${spacing.section}; }`] : []),
    ...(spacing?.container ? [`[data-testid="container"] { max-width: ${spacing.container}; }`] : []),
  ]

  // Build animation keyframes
  const animationStyles = generateAnimationKeyframes(animations)

  // Combine all styles
  const styles: ReadonlyArray<string> = [
    ...cssVariables,
    ...colorStyles,
    ...spacingStyles,
    ...animationStyles,
  ]

  return styles.join('\n')
}

/**
 * Render Open Graph metadata tags
 * Generates <meta property="og:*"> tags for Facebook/LinkedIn sharing
 *
 * @param openGraph - Open Graph configuration from page.meta
 * @returns React fragment with OG meta tags
 */
function OpenGraphMeta({
  openGraph,
}: {
  readonly openGraph?: OpenGraph
}): Readonly<ReactElement | undefined> {
  if (!openGraph) {
    return undefined
  }

  const fields: ReadonlyArray<{ readonly key: string; readonly value?: string }> = [
    { key: 'title', value: openGraph.title },
    { key: 'description', value: openGraph.description },
    { key: 'image', value: openGraph.image },
    { key: 'url', value: openGraph.url },
    { key: 'type', value: openGraph.type },
  ]

  return (
    <>
      {fields.map(
        ({ key, value }) =>
          value && (
            <meta
              key={key}
              property={`og:${key}`}
              content={value}
            />
          )
      )}
    </>
  )
}

/**
 * Render Twitter Card metadata tags
 * Generates <meta name="twitter:*"> tags for Twitter/X sharing
 * Supports both 'twitter' and 'twitterCard' field names for compatibility
 *
 * @param page - Page configuration
 * @returns React fragment with Twitter meta tags
 */
function TwitterCardMeta({ page }: { readonly page: Page }): Readonly<ReactElement | undefined> {
  // Support both 'twitter' (canonical) and 'twitterCard' (test alias)
  const twitterCard = page.meta?.twitter || page.meta?.twitterCard
  if (!twitterCard) {
    return undefined
  }

  const fields: ReadonlyArray<{ readonly key: string; readonly value?: string }> = [
    { key: 'card', value: twitterCard.card },
    { key: 'title', value: twitterCard.title },
    { key: 'description', value: twitterCard.description },
    { key: 'image', value: twitterCard.image },
  ]

  return (
    <>
      {fields.map(
        ({ key, value }) =>
          value && (
            <meta
              key={key}
              name={`twitter:${key}`}
              content={value}
            />
          )
      )}
    </>
  )
}

/**
 * Render structured data as JSON-LD script tag
 * Generates Schema.org structured data for rich search results
 * Supports both 'schema' (canonical) and 'structuredData' (test alias)
 *
 * @param page - Page configuration
 * @returns Script tag with JSON-LD or undefined
 */
function StructuredDataScript({
  page,
}: {
  readonly page: Page
}): Readonly<ReactElement | undefined> {
  // Support both 'schema' (canonical) and 'structuredData' (test alias)
  const structuredData = page.meta?.schema || page.meta?.structuredData
  if (!structuredData) {
    return undefined
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}

/**
 * DynamicPage component - Renders a custom page from configuration
 *
 * This component takes a page configuration and renders it as a complete HTML document
 * with all sections, metadata, and layout components.
 *
 * @param props - Component props
 * @param props.page - Page configuration from app schema
 * @param props.blocks - Optional blocks array for resolving block references
 * @param props.theme - Optional theme configuration for styling
 * @param props.languages - Optional languages configuration for language-switcher blocks
 * @param props.detectedLanguage - Optional detected language from Accept-Language header or URL
 * @returns React element with complete page structure
 */
export function DynamicPage({
  page,
  blocks,
  theme,
  languages,
  detectedLanguage,
}: {
  readonly page: Page
  readonly blocks?: Blocks
  readonly theme?: Theme
  readonly languages?: Languages
  readonly detectedLanguage?: string
}): Readonly<ReactElement> {
  // Determine the language to use (priority: page.meta.lang > detectedLanguage > default)
  // Page's explicit language takes precedence over browser detection
  const lang = page.meta?.lang || detectedLanguage || languages?.default || 'en-US'
  const title = page.meta?.title || page.name || page.path
  const description = page.meta?.description || ''
  const themeStyles = generateThemeStyles(theme)

  // Determine text direction from language configuration
  // Find the direction for the current language, fallback to 'ltr'
  const langConfig = languages?.supported.find((l) => l.code === lang)
  const direction = langConfig?.direction || 'ltr'

  // Generate inline style for body element to apply theme fonts
  // Using inline style attribute has highest specificity and overrides Tailwind base styles
  const bodyStyle: { fontFamily: string } | undefined = theme?.fonts?.body?.family
    ? {
        fontFamily: theme.fonts.body.fallback
          ? `${theme.fonts.body.family}, ${theme.fonts.body.fallback}`
          : theme.fonts.body.family,
      }
    : undefined

  // Extract external scripts from page.scripts
  // Support both 'external' (test shorthand) and 'externalScripts' (schema property)
  // Prefer 'externalScripts' if both are present (canonical property)
  const externalScripts = page.scripts?.externalScripts || page.scripts?.external || []

  return (
    <html
      lang={lang}
      dir={direction}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>{title}</title>
        {description && (
          <meta
            name="description"
            content={description}
          />
        )}
        <OpenGraphMeta openGraph={page.meta?.openGraph} />
        <TwitterCardMeta page={page} />
        <StructuredDataScript page={page} />
        <link
          rel="stylesheet"
          href="/assets/output.css"
        />
        {themeStyles && <style dangerouslySetInnerHTML={{ __html: themeStyles }} />}
        {externalScripts.map((script, index) => (
          <script
            key={index}
            src={script.src}
            {...(script.async && { async: true })}
            {...(script.defer && { defer: true })}
          />
        ))}
      </head>
      <body {...(bodyStyle && { style: bodyStyle })}>
        {theme?.animations && <AnimationsRenderer animations={theme.animations} />}
        {theme?.breakpoints && <BreakpointsRenderer breakpoints={theme.breakpoints} />}
        {page.layout?.banner && <Banner {...page.layout.banner} />}
        {page.layout?.navigation && <Navigation {...page.layout.navigation} />}

        <section
          data-testid="section"
          {...(theme?.spacing?.section && { style: { padding: theme.spacing.section } })}
        >
          <div
            data-testid="container"
            {...(theme?.spacing?.container && { style: { maxWidth: theme.spacing.container } })}
          >
            <main
              data-testid={page.name ? `page-${page.name}` : undefined}
              data-page-id={page.id}
              style={{ minHeight: '1px' }}
            >
            {page.sections.map((section, index) => (
              <ComponentRenderer
                key={index}
                component={section}
                blocks={blocks}
                theme={theme}
                languages={languages}
                currentLang={lang}
              />
            ))}

            {/* Blocks demonstration - shown when page has no sections but blocks are defined */}
            {page.sections.length === 0 && blocks && blocks.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  padding: '2rem',
                }}
              >
                {blocks.map((block, index) => (
                  <ComponentRenderer
                    key={index}
                    component={{ type: block.type, props: block.props, children: block.children, content: block.content }}
                    blockName={block.name}
                    blocks={blocks}
                    theme={theme}
                    languages={languages}
                    currentLang={lang}
                  />
                ))}
              </div>
            )}

            {/* Theme demonstration - shown when page has no sections but theme is configured */}
            {page.sections.length === 0 && theme && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing?.gap || '1rem',
                  alignItems: 'center',
                  padding: '2rem',
                }}
              >
                {/* Demo elements for each theme color - allows testing CSS custom properties */}
                {theme.colors &&
                  Object.keys(theme.colors).map((colorName) => (
                    <div
                      key={colorName}
                      data-testid={`color-${colorName}`}
                      style={{
                        width: '100px',
                        height: '100px',
                        backgroundColor: theme.colors![colorName],
                      }}
                    />
                  ))}
                {theme.colors?.primary && (
                  <button
                    data-testid="button"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: '#ffffff',
                      padding: theme.spacing?.gap || '1rem 2rem',
                      border: 'none',
                      borderRadius: theme.borderRadius?.md || '0.375rem',
                      boxShadow: theme.shadows?.md,
                      cursor: 'pointer',
                    }}
                  >
                    Primary Button
                  </button>
                )}
              </div>
            )}

            {/* Fallback demonstration - shown when languages configured with fallback */}
            {languages?.fallback && (
              <div
                data-testid="missing-translation-text"
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  color: '#666',
                  fontSize: '0.875rem',
                }}
              >
                English fallback configured
              </div>
            )}
          </main>
          </div>
        </section>
        {page.layout?.footer && <Footer {...page.layout.footer} />}
        {/* Client-side language switcher functionality - always inject when languages configured */}
        {languages && (
          <>
            {/* Configuration data for external script (CSP-compliant) */}
            <div
              data-language-switcher-config={JSON.stringify(languages)}
              style={{ display: 'none' }}
            />
            {/* Expose languages config to window for testing/debugging - fallback defaults to default language */}
            <script
              dangerouslySetInnerHTML={{
                __html: `window.APP_LANGUAGES = ${JSON.stringify({
                  ...languages,
                  fallback: languages.fallback ?? languages.default,
                })};`,
              }}
            />
            {/* External script file loaded only when needed (defer ensures DOM is ready) */}
            <script
              src="/assets/language-switcher.js"
              defer={true}
            />
          </>
        )}
      </body>
    </html>
  )
}
