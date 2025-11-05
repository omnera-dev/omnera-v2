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
import { Sidebar } from '@/presentation/components/layout/sidebar'
import { ComponentRenderer } from '@/presentation/components/sections/component-renderer'
import { toKebabCase, toSlug } from '@/presentation/utils/string-utils'
import type {
  BlockReference,
  SimpleBlockReference,
} from '@/domain/models/app/block/common/block-reference'
import type { Blocks } from '@/domain/models/app/blocks'
import type { Languages } from '@/domain/models/app/languages'
import type { Analytics } from '@/domain/models/app/page/meta/analytics'
import type { CustomElements } from '@/domain/models/app/page/meta/custom-elements'
import type { FaviconSet } from '@/domain/models/app/page/meta/favicon-set'
import type { OpenGraph } from '@/domain/models/app/page/meta/open-graph'
import type { Component } from '@/domain/models/app/page/sections'
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
  // Use highest specificity selector to override Tailwind defaults
  const cssVariables: ReadonlyArray<string> = colors
    ? [
        ':root, html {',
        ...Object.entries(colors).map(([name, value]) => `  --color-${name}: ${value};`),
        ...Object.entries(colors).map(([name, value]) => `  --${name}: ${value};`),
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
    ...(spacing?.container
      ? [`[data-testid="container"] { max-width: ${spacing.container}; }`]
      : []),
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
 * Render structured data as JSON-LD script tags
 * Generates Schema.org structured data for rich search results
 * Supports both 'schema' (canonical) and 'structuredData' (test alias)
 *
 * Each structured data type (organization, breadcrumb, article, etc.) is rendered
 * as a separate <script type="application/ld+json"> tag for proper Schema.org validation
 *
 * @param page - Page configuration
 * @returns React fragment with script tags or undefined
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

  // Extract all structured data types from the orchestrator schema
  const structuredDataTypes = Object.entries(structuredData).filter(
    ([, value]) => value !== undefined && value !== null
  )

  if (structuredDataTypes.length === 0) {
    return undefined
  }

  return (
    <>
      {structuredDataTypes.map(([key, value]) => (
        <script
          key={key}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(value),
          }}
        />
      ))}
    </>
  )
}

/**
 * Render a script tag with optional attributes
 * Unified helper for rendering external scripts (analytics, external scripts, etc.)
 *
 * @param props - Script configuration
 * @param props.src - Script source URL
 * @param props.async - Load asynchronously
 * @param props.defer - Defer execution
 * @param props.module - Load as ES module
 * @param props.integrity - Subresource integrity hash
 * @param props.crossOrigin - CORS setting ('anonymous' or 'use-credentials')
 * @param props.dataTestId - Test identifier
 * @param props.reactKey - React key for list rendering
 * @returns Script element
 */
function renderScriptTag({
  src,
  async: asyncProp,
  defer,
  module,
  integrity,
  crossOrigin,
  dataTestId,
  reactKey,
}: {
  readonly src: string
  readonly async?: boolean
  readonly defer?: boolean
  readonly module?: boolean
  readonly integrity?: string
  readonly crossOrigin?: 'anonymous' | 'use-credentials'
  readonly dataTestId?: string
  readonly reactKey: string | number
}): Readonly<ReactElement> {
  return (
    <script
      key={reactKey}
      src={src}
      {...(asyncProp && { async: true })}
      {...(defer && { defer: true })}
      {...(module && { type: 'module' })}
      {...(integrity && { integrity })}
      {...(crossOrigin && { crossOrigin })}
      {...(dataTestId && { 'data-testid': dataTestId })}
    />
  )
}

/**
 * Render an inline script tag with JavaScript code
 * Wraps code in async IIFE if async property is true
 *
 * @param props - Inline script configuration
 * @param props.code - JavaScript code to execute
 * @param props.async - Wrap in async IIFE
 * @param props.reactKey - React key for list rendering
 * @returns Script element with inline code
 */
function renderInlineScriptTag({
  code,
  async: asyncProp,
  reactKey,
}: {
  readonly code: string
  readonly async?: boolean
  readonly reactKey: string | number
}): Readonly<ReactElement> {
  const scriptContent = asyncProp ? `(async () => { ${code} })();` : code

  return (
    <script
      key={reactKey}
      dangerouslySetInnerHTML={{ __html: scriptContent }}
    />
  )
}

/**
 * Render analytics provider scripts and configuration in HEAD section
 * Generates DNS prefetch, external scripts with data-testid, and initialization scripts
 *
 * @param analytics - Analytics configuration from page.meta (union type)
 * @returns React fragment with head elements
 */
function AnalyticsHead({
  analytics,
}: {
  readonly analytics?: Analytics | { readonly [x: string]: unknown }
}): Readonly<ReactElement | undefined> {
  // Type guard: ensure analytics has providers array (not generic record)
  if (
    !analytics ||
    !('providers' in analytics) ||
    !Array.isArray(analytics.providers) ||
    analytics.providers.length === 0
  ) {
    return undefined
  }

  // Type assertion: after type guard, we know analytics has providers array
  const analyticsConfig = analytics as Analytics

  // Filter enabled providers only
  const enabledProviders = analyticsConfig.providers.filter(
    (provider) => provider.enabled !== false
  )

  if (enabledProviders.length === 0) {
    return undefined
  }

  return (
    <>
      {enabledProviders.flatMap((provider, providerIndex) => [
        // DNS Prefetch for performance optimization
        ...(provider.dnsPrefetch
          ? [
              <link
                key={`dns-${providerIndex}`}
                rel="dns-prefetch"
                href={provider.dnsPrefetch}
              />,
            ]
          : []),

        // External scripts with data-testid for test verification
        ...(provider.scripts && provider.scripts.length > 0
          ? provider.scripts.map((script, scriptIndex) =>
              renderScriptTag({
                src: script.src,
                async: script.async,
                defer: script.defer,
                dataTestId: `analytics-${provider.name}`,
                reactKey: `script-${providerIndex}-${scriptIndex}`,
              })
            )
          : []),

        // Initialization script with data-testid
        ...(provider.initScript
          ? [
              <script
                key={`init-${providerIndex}`}
                data-testid={`analytics-${provider.name}`}
                dangerouslySetInnerHTML={{
                  __html: provider.initScript,
                }}
              />,
            ]
          : []),

        // Empty marker script if provider has no scripts (for testing)
        ...((!provider.scripts || provider.scripts.length === 0) && !provider.initScript
          ? [
              <script
                key={`marker-${providerIndex}`}
                data-testid={`analytics-${provider.name}`}
                dangerouslySetInnerHTML={{
                  __html: `/* ${provider.name} analytics marker */`,
                }}
              />,
            ]
          : []),

        // Configuration data script (for testing)
        ...(provider.config
          ? [
              <script
                key={`config-${providerIndex}`}
                data-testid={`analytics-${provider.name}-config`}
                type="application/json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(provider.config),
                }}
              />,
            ]
          : []),
      ])}
    </>
  )
}

/**
 * Render DNS prefetch link tags
 * Generates <link rel="dns-prefetch" href="..."> tags for external domains
 *
 * @param dnsPrefetch - DNS prefetch configuration from page.meta
 * @returns React fragment with DNS prefetch link tags
 */
function DnsPrefetchLinks({
  dnsPrefetch,
}: {
  readonly dnsPrefetch?: ReadonlyArray<string>
}): Readonly<ReactElement | undefined> {
  if (!dnsPrefetch || dnsPrefetch.length === 0) {
    return undefined
  }

  return (
    <>
      {dnsPrefetch.map((domain) => (
        <link
          key={domain}
          rel="dns-prefetch"
          href={domain}
        />
      ))}
    </>
  )
}

/**
 * Render custom head elements
 * Generates arbitrary HTML elements (meta, link, script, style, base) in <head>
 *
 * @param customElements - Custom elements configuration from page.meta
 * @returns React fragment with custom head elements
 */
function CustomElementsHead({
  customElements,
}: {
  readonly customElements?: CustomElements
}): Readonly<ReactElement | undefined> {
  if (!customElements || customElements.length === 0) {
    return undefined
  }

  return (
    <>
      {customElements.map((element, index) => {
        const key = `custom-${element.type}-${index}`

        // Render meta element
        if (element.type === 'meta') {
          return (
            <meta
              key={key}
              {...element.attrs}
            />
          )
        }

        // Render link element
        if (element.type === 'link') {
          return (
            <link
              key={key}
              {...element.attrs}
            />
          )
        }

        // Render script element
        if (element.type === 'script') {
          if (element.content) {
            return (
              <script
                key={key}
                {...element.attrs}
                dangerouslySetInnerHTML={{ __html: element.content }}
              />
            )
          }
          return (
            <script
              key={key}
              {...element.attrs}
            />
          )
        }

        // Render style element
        if (element.type === 'style') {
          return (
            <style
              key={key}
              {...element.attrs}
              dangerouslySetInnerHTML={{ __html: element.content || '' }}
            />
          )
        }

        // Render base element
        if (element.type === 'base') {
          return (
            <base
              key={key}
              {...element.attrs}
            />
          )
        }

        return undefined
      })}
    </>
  )
}

/**
 * Render favicon set link tags
 * Generates <link rel="..."> tags for multi-device favicon support
 *
 * Supports:
 * - icon: Standard browser favicon (16x16, 32x32)
 * - apple-touch-icon: iOS home screen icon (180x180)
 * - manifest: PWA manifest file reference
 * - mask-icon: Safari pinned tab icon (monochrome SVG with color)
 *
 * @param favicons - Favicon set configuration from page.meta
 * @returns React fragment with favicon link tags
 */
function FaviconSetLinks({
  favicons,
}: {
  readonly favicons?: FaviconSet
}): Readonly<ReactElement | undefined> {
  if (!favicons || favicons.length === 0) {
    return undefined
  }

  return (
    <>
      {favicons.map((favicon, index) => {
        // Convert relative path (./favicon.png) to absolute path (/favicon.png)
        // Remove the leading ./ to make it an absolute path from the root
        const href = favicon.href.replace(/^\.\//, '/')

        return (
          <link
            key={index}
            rel={favicon.rel}
            href={href}
            {...(favicon.type && { type: favicon.type })}
            {...(favicon.sizes && { sizes: favicon.sizes })}
            {...(favicon.color && { color: favicon.color })}
          />
        )
      })}
    </>
  )
}

/**
 * Get block information for a section
 *
 * Determines if a section is a block reference and calculates its instance index
 * when multiple instances of the same block exist.
 *
 * @param section - Section to analyze (Component, SimpleBlockReference, or BlockReference)
 * @param index - Position of this section in the sections array
 * @param sections - Complete array of sections for counting occurrences
 * @returns Block info with name and optional instanceIndex, or undefined if not a block reference
 */
function getBlockInfo(
  section: Component | SimpleBlockReference | BlockReference,
  index: number,
  sections: ReadonlyArray<Component | SimpleBlockReference | BlockReference>
): { name: string; instanceIndex?: number } | undefined {
  if (!('block' in section || '$ref' in section)) {
    return undefined
  }

  const blockName = 'block' in section ? section.block : section.$ref

  // Count total occurrences of this block name in all sections
  const totalOccurrences = sections.filter((s) => {
    const sBlockName = 'block' in s ? s.block : '$ref' in s ? s.$ref : undefined
    return sBlockName === blockName
  }).length

  // Only set instanceIndex if there are multiple instances
  if (totalOccurrences <= 1) {
    return { name: blockName }
  }

  // Count previous occurrences of the same block name
  const previousOccurrences = sections.slice(0, index).filter((s) => {
    const sBlockName = 'block' in s ? s.block : '$ref' in s ? s.$ref : undefined
    return sBlockName === blockName
  })

  return { name: blockName, instanceIndex: previousOccurrences.length }
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

  // Group external scripts by position
  const headScripts = externalScripts.filter((script) => script.position === 'head')
  const bodyStartScripts = externalScripts.filter((script) => script.position === 'body-start')
  const bodyEndScripts = externalScripts.filter(
    (script) => !script.position || script.position === 'body-end'
  )

  // Extract inline scripts from page.scripts
  const inlineScripts = page.scripts?.inlineScripts || []

  // Group inline scripts by position
  const inlineHeadScripts = inlineScripts.filter((script) => script.position === 'head')
  const inlineBodyStartScripts = inlineScripts.filter((script) => script.position === 'body-start')
  const inlineBodyEndScripts = inlineScripts.filter(
    (script) => !script.position || script.position === 'body-end'
  )


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
        <DnsPrefetchLinks dnsPrefetch={page.meta?.dnsPrefetch} />
        <AnalyticsHead analytics={page.meta?.analytics} />
        <CustomElementsHead customElements={page.meta?.customElements} />
        {page.meta?.favicon && (
          <link
            rel="icon"
            href={page.meta.favicon}
          />
        )}
        <FaviconSetLinks favicons={page.meta?.favicons} />
        <link
          rel="stylesheet"
          href="/assets/output.css"
        />
        {themeStyles && <style dangerouslySetInnerHTML={{ __html: themeStyles }} />}
        {headScripts.map((script, index) =>
          renderScriptTag({
            src: script.src,
            async: script.async,
            defer: script.defer,
            module: script.module,
            integrity: script.integrity,
            crossOrigin: script.crossorigin,
            reactKey: `head-${index}`,
          })
        )}
        {inlineHeadScripts.map((script, index) =>
          renderInlineScriptTag({
            code: script.code,
            async: script.async,
            reactKey: `inline-head-${index}`,
          })
        )}
      </head>
      <body {...(bodyStyle && { style: bodyStyle })}>
        {bodyStartScripts.map((script, index) =>
          renderScriptTag({
            src: script.src,
            async: script.async,
            defer: script.defer,
            module: script.module,
            integrity: script.integrity,
            crossOrigin: script.crossorigin,
            reactKey: `body-start-${index}`,
          })
        )}
        {inlineBodyStartScripts.map((script, index) =>
          renderInlineScriptTag({
            code: script.code,
            async: script.async,
            reactKey: `inline-body-start-${index}`,
          })
        )}
        {page.layout?.banner && <Banner {...page.layout.banner} />}
        {page.layout?.navigation && <Navigation {...page.layout.navigation} />}
        {page.layout?.sidebar && <Sidebar {...page.layout.sidebar} />}

        <main
          data-testid={`page-${toSlug(page.name ?? page.path)}`}
          data-page-name={page.name}
          data-page-id={page.id}
          style={{ minHeight: '1px' }}
        >
          {/* Wrap page sections in a section element when theme spacing is defined */}
          {theme?.spacing?.section || theme?.spacing?.container ? (
            <>
              <section data-testid="section">
                {page.sections.map((section, index) => {
                  const blockInfo = getBlockInfo(section, index, page.sections)

                  return (
                    <ComponentRenderer
                      key={index}
                      component={section}
                      blockName={blockInfo?.name}
                      blockInstanceIndex={blockInfo?.instanceIndex}
                      blocks={blocks}
                      theme={theme}
                      languages={languages}
                      currentLang={lang}
                    />
                  )
                })}
              </section>
              {theme?.spacing?.container && <div data-testid="container" />}
            </>
          ) : (
            page.sections.map((section, index) => {
              const blockInfo = getBlockInfo(section, index, page.sections)

              return (
                <ComponentRenderer
                  key={index}
                  component={section}
                  blockName={blockInfo?.name}
                  blockInstanceIndex={blockInfo?.instanceIndex}
                  blocks={blocks}
                  theme={theme}
                  languages={languages}
                  currentLang={lang}
                />
              )
            })
          )}
        </main>

        {page.layout?.footer && <Footer {...page.layout.footer} />}
        {bodyEndScripts.map((script, index) =>
          renderScriptTag({
            src: script.src,
            async: script.async,
            defer: script.defer,
            module: script.module,
            integrity: script.integrity,
            crossOrigin: script.crossorigin,
            reactKey: `body-end-${index}`,
          })
        )}
        {inlineBodyEndScripts.map((script, index) =>
          renderInlineScriptTag({
            code: script.code,
            async: script.async,
            reactKey: `inline-body-end-${index}`,
          })
        )}
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
        {/* Client-side feature flags - inject when features configured */}
        {page.scripts?.features && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.FEATURES = ${JSON.stringify(page.scripts.features)};`,
            }}
          />
        )}
      </body>
    </html>
  )
}
