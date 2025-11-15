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
 * Type for i18n metadata translations
 */
type MetadataI18nTranslations = Record<
  string,
  { title?: string; description?: string; keywords?: string; 'og:site_name'?: string }
>

/**
 * Generate translations for a single language
 */
function generateLanguageTranslations(
  meta: Meta,
  langCode: string,
  languages: Languages
): { title?: string; description?: string; keywords?: string; 'og:site_name'?: string } {
  const metaRecord = meta as Record<string, unknown>
  const ogSiteName = metaRecord['og:site_name']

  return {
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
        'og:site_name': resolveTranslationPattern(meta.openGraph.siteName, langCode, languages),
      }),
  }
}

/**
 * Build i18n structure for all supported languages
 */
function buildI18nStructure(meta: Meta, languages: Languages): MetadataI18nTranslations {
  return languages.supported.reduce<MetadataI18nTranslations>((acc, lang) => {
    return {
      ...acc,
      [lang.code]: generateLanguageTranslations(meta, lang.code, languages),
    }
  }, {})
}

/**
 * Merge existing i18n with generated i18n (existing takes precedence)
 */
function mergeI18nTranslations(
  generatedI18n: MetadataI18nTranslations,
  existingI18n: MetadataI18nTranslations | undefined
): MetadataI18nTranslations {
  if (!existingI18n) return generatedI18n

  return Object.keys(generatedI18n).reduce<MetadataI18nTranslations>(
    (acc, langCode) => ({
      ...acc,
      [langCode]: {
        ...generatedI18n[langCode],
        ...(existingI18n[langCode] || {}),
      },
    }),
    {}
  )
}

/**
 * Resolve translation tokens in base meta fields
 */
function resolveBaseMetaFields(meta: Meta, currentLang: string, languages: Languages): Meta {
  return {
    ...meta,
    ...(meta.title && { title: resolveTranslationPattern(meta.title, currentLang, languages) }),
    ...(meta.description && {
      description: resolveTranslationPattern(meta.description, currentLang, languages),
    }),
    ...(meta.keywords && {
      keywords: resolveTranslationPattern(meta.keywords, currentLang, languages),
    }),
  }
}

/**
 * Resolve og:site_name if present (either as direct property or in openGraph object)
 */
function resolveOgSiteName(meta: Meta, currentLang: string, languages: Languages): Meta {
  const metaRecord = meta as Record<string, unknown>
  const ogSiteName = metaRecord['og:site_name']

  if (typeof ogSiteName === 'string') {
    return {
      ...meta,
      'og:site_name': resolveTranslationPattern(ogSiteName, currentLang, languages),
    } as Meta
  }

  if (meta.openGraph?.siteName) {
    return {
      ...meta,
      openGraph: {
        ...meta.openGraph,
        siteName: resolveTranslationPattern(meta.openGraph.siteName, currentLang, languages),
      },
    }
  }

  return meta
}

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

  const { meta } = page
  const currentLang = meta.lang || languages.default

  // Build i18n structure for all supported languages
  const generatedI18n = buildI18nStructure(meta, languages)

  // Merge existing meta.i18n with generated i18n (existing takes precedence)
  const existingI18n = (meta as Record<string, unknown>).i18n as
    | MetadataI18nTranslations
    | undefined
  const i18n = mergeI18nTranslations(generatedI18n, existingI18n)

  // Resolve all $t: tokens in base meta fields for current language
  const resolvedMeta = resolveBaseMetaFields(meta, currentLang, languages)
  const resolvedMetaWithOg = resolveOgSiteName(resolvedMeta, currentLang, languages)

  // Return resolved meta with i18n structure
  return {
    ...resolvedMetaWithOg,
    i18n,
  }
}
