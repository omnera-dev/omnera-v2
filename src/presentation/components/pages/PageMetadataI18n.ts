/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { resolveTranslationPattern } from '@/presentation/translations/translation-resolver'
import type { Languages } from '@/domain/models/app/languages'
import type { Meta } from '@/domain/models/app/page/meta'
import type { Page } from '@/domain/models/app/pages'

/**
 * Builds i18n metadata structure for client-side language switching
 *
 * Resolves translation patterns ($t:...) for all supported languages
 * and constructs a complete i18n structure that the client can use
 * to update meta tags when switching languages.
 *
 * @param page - Page configuration
 * @param languages - Languages configuration
 * @returns Page meta with i18n structure populated
 */
export function buildPageMetadataI18n(
  page: Page,
  languages: Languages | undefined
): Meta | Record<string, never> {
  if (!page.meta || !languages) {
    return (page.meta || {}) as Meta | Record<string, never>
  }

  // Store reference to meta to avoid undefined access in reduce
  const {meta} = page

  // Build i18n structure for all supported languages using reduce
  const i18n = languages.supported.reduce(
    (acc, lang) => {
      const langCode = lang.code
      const metaRecord = meta as Record<string, unknown>
      const ogSiteName = metaRecord['og:site_name']

      return {
        ...acc,
        [langCode]: {
          ...(meta.title && {
            title: resolveTranslationPattern(meta.title, langCode, languages),
          }),
          ...(meta.description && {
            description: resolveTranslationPattern(meta.description, langCode, languages),
          }),
          ...(meta.keywords && {
            keywords: resolveTranslationPattern(meta.keywords, langCode, languages),
          }),
          ...(typeof ogSiteName === 'string' && {
            'og:site_name': resolveTranslationPattern(ogSiteName, langCode, languages),
          }),
          ...(meta.openGraph?.siteName &&
            typeof ogSiteName !== 'string' && {
              'og:site_name': resolveTranslationPattern(
                meta.openGraph.siteName,
                langCode,
                languages
              ),
            }),
        },
      }
    },
    {} as Record<
      string,
      { title?: string; description?: string; keywords?: string; 'og:site_name'?: string }
    >
  )

  // Return meta with i18n structure
  return {
    ...meta,
    i18n,
  }
}
