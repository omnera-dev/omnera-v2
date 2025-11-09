/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { PageBodyScripts } from '@/presentation/components/pages/utils/PageBodyScripts'
import { PageHead } from '@/presentation/components/pages/utils/PageHead'
import { PageLayout } from '@/presentation/components/pages/utils/PageLayout'
import { extractPageMetadata } from '@/presentation/components/pages/utils/PageMetadata'
import { groupScriptsByPosition } from '@/presentation/components/pages/utils/PageScripts'
import { SectionRenderer } from '@/presentation/components/pages/utils/SectionRenderer'
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
  const metadata = extractPageMetadata(page, theme, languages, detectedLanguage)
  const themeStyles = generateThemeStyles(theme)
  const scripts = groupScriptsByPosition(page)

  return (
    <html
      lang={metadata.lang}
      dir={metadata.direction}
    >
      <head>
        <PageHead
          page={page}
          theme={theme}
          themeStyles={themeStyles}
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
          scripts={scripts}
          position="start"
        />
        <PageLayout page={page}>
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
              currentLang={metadata.lang}
            />
          </main>
        </PageLayout>
        <PageBodyScripts
          page={page}
          theme={theme}
          languages={languages}
          scripts={scripts}
          position="end"
        />
      </body>
    </html>
  )
}
