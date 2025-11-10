/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { PageBodyScripts } from '@/presentation/components/pages/PageBodyScripts'
import { PageHead } from '@/presentation/components/pages/PageHead'
import { resolvePageLanguage } from '@/presentation/components/pages/PageLangResolver'
import { PageLayout } from '@/presentation/components/pages/PageLayout'
import { PageMain } from '@/presentation/components/pages/PageMain'
import { extractPageMetadata } from '@/presentation/components/pages/PageMetadata'
import { groupScriptsByPosition } from '@/presentation/components/pages/PageScripts'
import type { Blocks } from '@/domain/models/app/blocks'
import type { Languages } from '@/domain/models/app/languages'
import type { Page } from '@/domain/models/app/pages'
import type { Theme } from '@/domain/models/app/theme'

type DynamicPageProps = {
  readonly page: Page
  readonly blocks?: Blocks
  readonly theme?: Theme
  readonly languages?: Languages
  readonly detectedLanguage?: string
}

/**
 * Renders a page from configuration as a complete HTML document
 * Theme CSS is compiled globally at server startup via /assets/output.css
 * Theme is still passed for font URLs, animation flags, and debugging
 */
export function DynamicPage({
  page,
  blocks,
  theme,
  languages,
  detectedLanguage,
}: DynamicPageProps): Readonly<ReactElement> {
  const metadata = extractPageMetadata(page, theme, languages, detectedLanguage)
  const langConfig = resolvePageLanguage(page, languages, detectedLanguage)
  const scripts = groupScriptsByPosition(page)

  return (
    <html
      lang={langConfig.lang}
      dir={langConfig.direction}
    >
      <head>
        <PageHead
          page={page}
          theme={theme}
          directionStyles={langConfig.directionStyles}
          title={metadata.title}
          description={metadata.description}
          scripts={scripts}
        />
      </head>
      <body {...(metadata.bodyStyle && { style: metadata.bodyStyle })}>
        <PageBodyScripts
          page={page}
          theme={theme}
          languages={languages}
          direction={langConfig.direction}
          scripts={scripts}
          position="start"
        />
        <PageLayout page={page}>
          <PageMain
            page={page}
            sections={page.sections}
            theme={theme}
            blocks={blocks}
            languages={languages}
            currentLang={langConfig.lang}
          />
        </PageLayout>
        <PageBodyScripts
          page={page}
          theme={theme}
          languages={languages}
          direction={langConfig.direction}
          scripts={scripts}
          position="end"
        />
      </body>
    </html>
  )
}
