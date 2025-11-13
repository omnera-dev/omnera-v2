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
import type { CustomElement } from '@/domain/models/app/page/meta/custom-elements'
import type { Page } from '@/domain/models/app/pages'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Props for PageHead component
 */
type PageHeadProps = {
  readonly page: Page
  readonly theme: Theme | undefined
  readonly directionStyles: string
  readonly title: string
  readonly description: string
  readonly scripts: GroupedScripts
}

/**
 * Checks if custom elements include a viewport meta tag
 */
function hasCustomViewportMeta(customElements: readonly CustomElement[] | undefined): boolean {
  if (!customElements) return false
  return customElements.some(
    (element) => element.type === 'meta' && element.attrs?.name === 'viewport'
  )
}

/**
 * Renders basic meta tags (charset, viewport, title, description)
 */
function BasicMetaTags({
  title,
  description,
  hasCustomViewport,
}: {
  readonly title: string
  readonly description: string
  readonly hasCustomViewport: boolean
}): ReactElement {
  return (
    <>
      <meta charSet="UTF-8" />
      {!hasCustomViewport && (
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
      )}
      <title>{title}</title>
      {description && (
        <meta
          name="description"
          content={description}
        />
      )}
    </>
  )
}

/**
 * Renders font stylesheets from theme configuration
 */
function ThemeFonts({ theme }: { readonly theme: Theme | undefined }): ReactElement | undefined {
  if (!theme?.fonts) return undefined

  return (
    <>
      {Object.values(theme.fonts).map((font, index) =>
        font.url ? (
          <link
            key={`font-${index}`}
            rel="stylesheet"
            href={font.url}
          />
        ) : undefined
      )}
    </>
  )
}

/**
 * Renders global CSS and direction styles
 * Theme CSS is compiled globally at /assets/output.css
 */
function GlobalStyles({ directionStyles }: { readonly directionStyles: string }): ReactElement {
  return (
    <>
      <link
        rel="stylesheet"
        href="/assets/output.css"
      />
      <style dangerouslySetInnerHTML={{ __html: directionStyles }} />
    </>
  )
}

/**
 * Renders external and inline scripts for head section
 */
function HeadScripts({ scripts }: { readonly scripts: GroupedScripts }): ReactElement {
  return (
    <>
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
 * - Font stylesheets from theme
 * - Global CSS with compiled theme tokens
 * - Direction styles for RTL support
 * - External and inline scripts positioned in head
 *
 * @param props - Component props
 * @returns Head section elements
 */
export function PageHead({
  page,
  theme,
  directionStyles,
  title,
  description,
  scripts,
}: PageHeadProps): Readonly<ReactElement> {
  const hasCustomViewport = hasCustomViewportMeta(page.meta?.customElements)

  return (
    <>
      <BasicMetaTags
        title={title}
        description={description}
        hasCustomViewport={hasCustomViewport}
      />
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
      <ThemeFonts theme={theme} />
      <GlobalStyles directionStyles={directionStyles} />
      <HeadScripts scripts={scripts} />
    </>
  )
}
