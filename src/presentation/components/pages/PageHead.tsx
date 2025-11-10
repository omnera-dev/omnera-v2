/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import {
  AnalyticsHead,
  CustomElementsHead,
  DnsPrefetchLinks,
  FaviconSetLinks,
  OpenGraphMeta,
  StructuredDataScript,
  TwitterCardMeta,
} from '@/presentation/components/metadata'
import { renderInlineScriptTag, renderScriptTag } from '@/presentation/scripts/script-renderers'
import type { GroupedScripts } from './PageScripts'
import type { Page } from '@/domain/models/app/pages'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Props for PageHead component
 */
type PageHeadProps = {
  readonly page: Page
  readonly theme: Theme | undefined
  readonly themeStyles: string | undefined
  readonly directionStyles: string
  readonly title: string
  readonly description: string
  readonly scripts: GroupedScripts
}

/**
 * Renders the complete <head> section of a dynamic page
 *
 * Includes:
 * - Basic meta tags (charset, viewport, title, description)
 * - OpenGraph and Twitter Card metadata
 * - Structured data (JSON-LD)
 * - DNS prefetch hints
 * - Analytics scripts
 * - Custom elements
 * - Favicon links
 * - Font stylesheets
 * - Theme styles
 * - External and inline scripts positioned in head
 *
 * @param props - Component props
 * @returns Head section elements
 */
export function PageHead({
  page,
  theme,
  themeStyles,
  directionStyles,
  title,
  description,
  scripts,
}: PageHeadProps): Readonly<ReactElement> {
  return (
    <>
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
      {/* Font URL stylesheets - Load remote fonts (Google Fonts, etc.) */}
      {theme?.fonts &&
        Object.values(theme.fonts).map((font, index) =>
          font.url ? (
            <link
              key={`font-${index}`}
              rel="stylesheet"
              href={font.url}
            />
          ) : undefined
        )}
      <link
        rel="stylesheet"
        href="/assets/output.css"
      />
      {themeStyles && <style dangerouslySetInnerHTML={{ __html: themeStyles }} />}
      <style dangerouslySetInnerHTML={{ __html: directionStyles }} />
      {scripts.external.head.map((script, index) =>
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
      {scripts.inline.head.map((script, index) =>
        renderInlineScriptTag({
          code: script.code,
          async: script.async,
          reactKey: `inline-head-${index}`,
        })
      )}
    </>
  )
}
