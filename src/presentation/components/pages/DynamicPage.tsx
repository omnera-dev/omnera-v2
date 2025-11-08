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
import {
  AnalyticsHead,
  CustomElementsHead,
  DnsPrefetchLinks,
  FaviconSetLinks,
  OpenGraphMeta,
  StructuredDataScript,
  TwitterCardMeta,
} from '@/presentation/components/metadata'
import { SectionRenderer } from '@/presentation/components/pages/utils/SectionRenderer'
import { renderInlineScriptTag, renderScriptTag } from '@/presentation/utils/script-renderers'
import { toSlug } from '@/presentation/utils/string-utils'
import { generateThemeStyles } from '@/presentation/utils/theme-generator'
import type { Blocks } from '@/domain/models/app/blocks'
import type { Languages } from '@/domain/models/app/languages'
import type { Page } from '@/domain/models/app/pages'
import type { Theme } from '@/domain/models/app/theme'

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
  const bodyStyle:
    | {
        readonly fontFamily?: string
        readonly fontSize?: string
        readonly lineHeight?: string
        readonly fontStyle?: 'normal' | 'italic' | 'oblique'
        readonly letterSpacing?: string
        readonly textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
      }
    | undefined = theme?.fonts?.body
    ? {
        ...(theme.fonts.body.family && {
          fontFamily: theme.fonts.body.fallback
            ? `${theme.fonts.body.family}, ${theme.fonts.body.fallback}`
            : theme.fonts.body.family,
        }),
        ...(theme.fonts.body.size && { fontSize: theme.fonts.body.size }),
        ...(theme.fonts.body.lineHeight && { lineHeight: theme.fonts.body.lineHeight }),
        ...(theme.fonts.body.style && {
          fontStyle: theme.fonts.body.style as 'normal' | 'italic' | 'oblique',
        }),
        ...(theme.fonts.body.letterSpacing && { letterSpacing: theme.fonts.body.letterSpacing }),
        ...(theme.fonts.body.transform && {
          textTransform: theme.fonts.body.transform as
            | 'none'
            | 'uppercase'
            | 'lowercase'
            | 'capitalize',
        }),
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
          <SectionRenderer
            sections={page.sections}
            theme={theme}
            blocks={blocks}
            languages={languages}
            currentLang={lang}
          />
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
        {/* Client-side banner dismiss functionality - inject when banner is dismissible */}
        {page.layout?.banner?.dismissible && (
          <script
            src="/assets/banner-dismiss.js"
            defer={true}
          />
        )}
        {/* Client-side scroll animation functionality - inject when scroll animations configured */}
        {theme?.animations?.scaleUp && (
          <script
            src="/assets/scroll-animation.js"
            defer={true}
          />
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
