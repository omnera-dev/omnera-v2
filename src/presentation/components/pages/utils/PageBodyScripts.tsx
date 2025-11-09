/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { renderInlineScriptTag, renderScriptTag } from '@/presentation/utils/script-renderers'
import type { GroupedScripts } from './PageScripts'
import type { Languages } from '@/domain/models/app/languages'
import type { Page } from '@/domain/models/app/pages'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Props for PageBodyScripts component
 */
type PageBodyScriptsProps = {
  readonly page: Page
  readonly theme: Theme | undefined
  readonly languages: Languages | undefined
  readonly scripts: GroupedScripts
  readonly position: 'start' | 'end'
}

/**
 * Renders scripts for body start or end position
 *
 * For 'start' position:
 * - External and inline scripts positioned at body-start
 *
 * For 'end' position:
 * - External and inline scripts positioned at body-end
 * - Banner dismiss script (if banner is dismissible)
 * - Scroll animation script (if theme has scaleUp animation)
 * - Language switcher script (if languages configured)
 * - Feature flags script (if features configured)
 *
 * @param props - Component props
 * @returns Script elements for the specified position
 */
export function PageBodyScripts({
  page,
  theme,
  languages,
  scripts,
  position,
}: PageBodyScriptsProps): Readonly<ReactElement> {
  if (position === 'start') {
    return (
      <>
        {scripts.external.bodyStart.map((script, index) =>
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
        {scripts.inline.bodyStart.map((script, index) =>
          renderInlineScriptTag({
            code: script.code,
            async: script.async,
            reactKey: `inline-body-start-${index}`,
          })
        )}
      </>
    )
  }

  // position === 'end'
  return (
    <>
      {scripts.external.bodyEnd.map((script, index) =>
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
      {scripts.inline.bodyEnd.map((script, index) =>
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
    </>
  )
}
