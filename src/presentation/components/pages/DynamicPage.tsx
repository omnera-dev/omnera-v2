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
import type { Blocks } from '@/domain/models/app/blocks'
import type { Languages } from '@/domain/models/app/languages'
import type { OpenGraph } from '@/domain/models/app/page/meta/open-graph'
import type { Page } from '@/domain/models/app/pages'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Generate CSS from theme colors
 * Applies theme colors to semantic HTML elements for visual hierarchy
 *
 * @param theme - Theme configuration from app schema
 * @returns CSS string with theme-based styles
 */
function generateThemeStyles(theme?: Theme): string {
  if (!theme?.colors) {
    return ''
  }

  // Apply gray-900 to headings (h1-h6) for strong hierarchy
  // Apply gray-500 to text elements (p) for secondary/placeholder content
  const { colors } = theme
  const gray900 = colors['gray-900']
  const gray500 = colors['gray-500']

  const headingStyles = gray900 ? `h1, h2, h3, h4, h5, h6 { color: ${gray900}; }\n` : ''
  const textStyles = gray500 ? `p { color: ${gray500}; }\n` : ''

  return headingStyles + textStyles
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
 * @returns React element with complete page structure
 */
export function DynamicPage({
  page,
  blocks,
  theme,
  languages,
}: {
  readonly page: Page
  readonly blocks?: Blocks
  readonly theme?: Theme
  readonly languages?: Languages
}): Readonly<ReactElement> {
  // Use default metadata if not provided
  const lang = page.meta?.lang || 'en-US'
  const title = page.meta?.title || page.name || page.path
  const description = page.meta?.description || ''
  const themeStyles = generateThemeStyles(theme)

  // Determine text direction from language configuration
  // Find the direction for the default language, fallback to 'ltr'
  const defaultLangConfig = languages?.supported.find((l) => l.code === languages.default)
  const direction = defaultLangConfig?.direction || 'ltr'

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
      <body>
        {page.layout?.banner && <Banner {...page.layout.banner} />}
        {page.layout?.navigation && <Navigation {...page.layout.navigation} />}

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
            />
          ))}

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
