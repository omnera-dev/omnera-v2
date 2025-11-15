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
 * CRITICAL: All $t: tokens in base meta fields are resolved to ensure
 * no translation tokens appear in the serialized HTML output.
 *
 * @param page - Page configuration
 * @param languages - Languages configuration
 * @returns Page meta with i18n structure populated and all $t: tokens resolved
 */
export function buildPageMetadataI18n(
  page: Page,
  languages: Languages | undefined
): Meta | Record<string, never> {
  if (!page.meta || !languages) {
    return (page.meta || {}) as Meta | Record<string, never>
  }

  // Store reference to meta to avoid undefined access in reduce
  const { meta } = page
  const currentLang = meta.lang || languages.default

  // Build i18n structure for all supported languages using reduce
  const generatedI18n = languages.supported.reduce(
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

  // Merge existing meta.i18n with generated i18n (existing takes precedence)
  const existingI18n = (meta as Record<string, unknown>).i18n as
    | Record<
        string,
        { title?: string; description?: string; keywords?: string; 'og:site_name'?: string }
      >
    | undefined

  const i18n = existingI18n
    ? Object.keys(generatedI18n).reduce(
        (acc, langCode) => ({
          ...acc,
          [langCode]: {
            ...generatedI18n[langCode],
            ...(existingI18n[langCode] || {}),
          },
        }),
        {} as typeof generatedI18n
      )
    : generatedI18n

  // Resolve all $t: tokens in base meta fields for current language
  // This ensures no translation tokens remain in the HTML output
  const resolvedMeta = {
    ...meta,
    ...(meta.title && { title: resolveTranslationPattern(meta.title, currentLang, languages) }),
    ...(meta.description && {
      description: resolveTranslationPattern(meta.description, currentLang, languages),
    }),
    ...(meta.keywords && {
      keywords: resolveTranslationPattern(meta.keywords, currentLang, languages),
    }),
  }

  // Resolve og:site_name if present (either as direct property or in openGraph object)
  const metaRecord = meta as Record<string, unknown>
  const ogSiteName = metaRecord['og:site_name']
  if (typeof ogSiteName === 'string') {
    ;(resolvedMeta as Record<string, unknown>)['og:site_name'] = resolveTranslationPattern(
      ogSiteName,
      currentLang,
      languages
    )
  } else if (meta.openGraph?.siteName) {
    resolvedMeta.openGraph = {
      ...meta.openGraph,
      siteName: resolveTranslationPattern(meta.openGraph.siteName, currentLang, languages),
    }
  }

  // Return resolved meta with i18n structure
  return {
    ...resolvedMeta,
    i18n,
  }
}
