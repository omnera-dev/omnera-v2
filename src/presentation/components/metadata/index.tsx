/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { renderScriptTag } from '@/presentation/utils/script-renderers'
import type { Analytics } from '@/domain/models/app/page/meta/analytics'
import type { CustomElements } from '@/domain/models/app/page/meta/custom-elements'
import type { FaviconSet } from '@/domain/models/app/page/meta/favicon-set'
import type { OpenGraph } from '@/domain/models/app/page/meta/open-graph'
import type { Page } from '@/domain/models/app/pages'

/**
 * Render Open Graph metadata tags
 * Generates <meta property="og:*"> tags for Facebook/LinkedIn sharing
 *
 * @param openGraph - Open Graph configuration from page.meta
 * @returns React fragment with OG meta tags
 */
export function OpenGraphMeta({
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
export function TwitterCardMeta({
  page,
}: {
  readonly page: Page
}): Readonly<ReactElement | undefined> {
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
export function StructuredDataScript({
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
 * Render analytics provider scripts and configuration in HEAD section
 * Generates DNS prefetch, external scripts with data-testid, and initialization scripts
 *
 * @param analytics - Analytics configuration from page.meta (union type)
 * @returns React fragment with head elements
 */
export function AnalyticsHead({
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

  // Render all providers (enabled and disabled)
  // Disabled providers are hidden with display: none
  return (
    <>
      {analyticsConfig.providers.flatMap((provider, providerIndex) => {
        const isEnabled = provider.enabled !== false
        const hidden = !isEnabled
        const styleAttr = hidden ? { style: { display: 'none' } } : {}

        return [
          // DNS Prefetch for performance optimization
          ...(provider.dnsPrefetch
            ? [
                <link
                  key={`dns-${providerIndex}`}
                  rel="dns-prefetch"
                  href={provider.dnsPrefetch}
                  {...styleAttr}
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
                  hidden,
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
                  {...styleAttr}
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
                  {...styleAttr}
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
                  {...styleAttr}
                />,
              ]
            : []),
        ]
      })}
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
export function DnsPrefetchLinks({
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
export function CustomElementsHead({
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
export function FaviconSetLinks({
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
