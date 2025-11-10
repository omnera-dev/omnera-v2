/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { PageBodyScripts } from '@/presentation/components/pages/utils/PageBodyScripts'
import { PageHead } from '@/presentation/components/pages/utils/PageHead'
import { resolvePageLanguage } from '@/presentation/components/pages/utils/PageLangResolver'
import { PageLayout } from '@/presentation/components/pages/utils/PageLayout'
import { PageMain } from '@/presentation/components/pages/utils/PageMain'
import { extractPageMetadata } from '@/presentation/components/pages/utils/PageMetadata'
import { groupScriptsByPosition } from '@/presentation/components/pages/utils/PageScripts'
import { generateThemeStyles } from '@/presentation/utils/theme-generators/theme-generator'
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
  const themeStyles = generateThemeStyles(theme)

  return (
    <html
      lang={langConfig.lang}
      dir={langConfig.direction}
    >
      <head>
        <PageHead
          page={page}
          theme={theme}
          themeStyles={themeStyles}
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
