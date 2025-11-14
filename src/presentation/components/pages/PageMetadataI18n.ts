/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { resolveTranslationPattern } from '@/presentation/translations/translation-resolver'
import type { Languages } from '@/domain/models/app/languages'
import type { Page } from '@/domain/models/app/pages'
import type { Meta } from '@/domain/models/app/page/meta'

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
export function buildPageMetadataI18n(page: Page, languages: Languages | undefined): Meta {
  if (!page.meta || !languages) {
    return page.meta || {}
  }

  // Build i18n structure for all supported languages
  const i18n: Record<string, { title?: string; description?: string; keywords?: string; 'og:site_name'?: string }> = {}

  for (const lang of languages.supported) {
    const langCode = lang.code
    i18n[langCode] = {}

    // Resolve title
    if (page.meta.title) {
      i18n[langCode].title = resolveTranslationPattern(page.meta.title, langCode, languages)
    }

    // Resolve description
    if (page.meta.description) {
      i18n[langCode].description = resolveTranslationPattern(
        page.meta.description,
        langCode,
        languages
      )
    }

    // Resolve keywords
    if (page.meta.keywords) {
      i18n[langCode].keywords = resolveTranslationPattern(page.meta.keywords, langCode, languages)
    }

    // Resolve og:site_name (handle both formats)
    const metaRecord = page.meta as Record<string, unknown>
    const ogSiteName = metaRecord['og:site_name']
    if (typeof ogSiteName === 'string') {
      i18n[langCode]['og:site_name'] = resolveTranslationPattern(ogSiteName, langCode, languages)
    } else if (page.meta.openGraph?.siteName) {
      i18n[langCode]['og:site_name'] = resolveTranslationPattern(
        page.meta.openGraph.siteName,
        langCode,
        languages
      )
    }
  }

  // Return meta with i18n structure
  return {
    ...page.meta,
    i18n,
  }
}
