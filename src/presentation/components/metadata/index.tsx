/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { buildProviderElements } from './utils/analytics-builders'
import { buildCustomElement } from './utils/custom-elements-builders'
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

  // Render all providers using builder pattern
  return <>{analyticsConfig.providers.flatMap(buildProviderElements)}</>
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

  return <>{customElements.map(buildCustomElement)}</>
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
