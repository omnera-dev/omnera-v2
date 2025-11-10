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
import { ComponentRenderer } from '@/presentation/components/sections/component-renderer'
import { renderInlineScriptTag, renderScriptTag } from '@/presentation/utils/script-renderers'
import { toSlug } from '@/presentation/utils/string-utils'
import { isCssValue, isTailwindClass } from '@/presentation/utils/style-utils'
import { generateThemeStyles } from '@/presentation/utils/theme-generators/theme-generator'
import type {
  BlockReference,
  SimpleBlockReference,
} from '@/domain/models/app/block/common/block-reference'
import type { Blocks } from '@/domain/models/app/blocks'
import type { Languages } from '@/domain/models/app/languages'
import type { Component } from '@/domain/models/app/page/sections'
import type { Page } from '@/domain/models/app/pages'
import type { Theme } from '@/domain/models/app/theme'

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

  // Generate CSS for body direction to ensure RTL/LTR is applied as CSS property
  // The CSS must be more specific than Tailwind's base styles
  // Using [lang] attribute selector for higher specificity
  const directionStyles = `
    html[lang="${lang}"] { direction: ${direction}; }
    html[lang="${lang}"] body { direction: ${direction}; }
  `

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
        <style dangerouslySetInnerHTML={{ __html: directionStyles }} />
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
          {/* Only create wrapper section if there are no section components in the page */}
          {theme?.spacing?.section || theme?.spacing?.container ? (
            <>
              {!page.sections.some((s) => 'type' in s && s.type === 'section') &&
              theme?.spacing?.section ? (
                <section
                  data-testid="section"
                  {...(theme?.spacing?.section &&
                    !isCssValue(theme.spacing.section) && { className: theme.spacing.section })}
                  {...(theme?.spacing?.section &&
                    isCssValue(theme.spacing.section) && {
                      style: { padding: theme.spacing.section },
                    })}
                >
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
              ) : (
                <>
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
                </>
              )}
              {theme?.spacing?.container &&
                !page.sections.some((s) => 'type' in s && s.type === 'container') && (
                  <div
                    data-testid="container"
                    {...(isTailwindClass(theme.spacing.container)
                      ? { className: theme.spacing.container }
                      : { style: { maxWidth: theme.spacing.container } })}
                  />
                )}
              {(() => {
                const containerSmall = (theme?.spacing as Record<string, unknown>)?.[
                  'container-small'
                ]
                if (typeof containerSmall === 'string') {
                  return (
                    <div
                      data-testid="container-small"
                      {...(isTailwindClass(containerSmall)
                        ? { className: containerSmall }
                        : { style: { maxWidth: containerSmall } })}
                    />
                  )
                }
                return undefined
              })()}
              {(() => {
                const containerXSmall = (theme?.spacing as Record<string, unknown>)?.[
                  'container-xsmall'
                ]
                if (typeof containerXSmall === 'string') {
                  return (
                    <div
                      data-testid="container-xsmall"
                      {...(isTailwindClass(containerXSmall)
                        ? { className: containerXSmall }
                        : { style: { maxWidth: containerXSmall } })}
                    />
                  )
                }
                return undefined
              })()}
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
            {/* Expose theme config with RTL-aware direction to window for testing/debugging */}
            <script
              dangerouslySetInnerHTML={{
                __html: `window.APP_THEME = ${JSON.stringify({
                  ...(theme || {}),
                  direction: direction,
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
