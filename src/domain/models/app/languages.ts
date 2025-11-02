/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'
import { LanguageConfigSchema } from './language/language-config'

/**
 * ISO 639-1 language code with optional region
 *
 * Format: ll or ll-RR where:
 * - ll: two lowercase letters (language code)
 * - RR: two uppercase letters (region code, optional)
 *
 * @example
 * ```typescript
 * const codes = ['en', 'en-US', 'fr-FR', 'es-ES', 'ar-SA']
 * ```
 *
 * @see specs/app/languages/languages.schema.json
 */
export const LanguageCodeSchema = Schema.String.pipe(
  Schema.pattern(/^[a-z]{2}(-[A-Z]{2})?$/, {
    message: () =>
      'Language code must follow ISO 639-1 format: ll or ll-RR (e.g., en, en-US, fr-FR)',
  }),
  Schema.annotations({
    title: 'Language Code',
    description: 'ISO 639-1 language code with optional region',
    examples: ['en-US', 'fr-FR', 'es-ES', 'ar-SA'],
  })
)

/**
 * Translation key for centralized translations dictionary
 *
 * Format: Alphanumeric with dots, hyphens, and underscores
 * Convention: Use namespaces for organization (e.g., common.save, nav.home, homepage.hero.title)
 *
 * @example
 * ```typescript
 * const keys = ['common.save', 'nav.home', 'homepage.hero.title', 'errors.404']
 * ```
 */
export const TranslationKeySchema = Schema.String.pipe(
  Schema.pattern(/^[a-zA-Z0-9._-]+$/, {
    message: () =>
      'Translation key must contain only alphanumeric characters, dots, hyphens, and underscores',
  }),
  Schema.annotations({
    title: 'Translation Key',
    description: 'Key for centralized translations dictionary',
    examples: ['common.save', 'nav.home', 'homepage.hero.title', 'errors.404'],
  })
)

/**
 * Translation dictionary for a single language
 *
 * Maps translation keys to localized strings.
 * Use semantic keys that describe meaning, not location.
 * Organize by feature/page for better maintainability.
 *
 * @example
 * ```typescript
 * const translations = {
 *   'common.save': 'Save',
 *   'common.cancel': 'Cancel',
 *   'nav.home': 'Home',
 *   'homepage.hero.title': 'Welcome to Omnera'
 * }
 * ```
 */
export const TranslationDictionarySchema = Schema.Record({
  key: TranslationKeySchema,
  value: Schema.String,
}).pipe(
  Schema.annotations({
    title: 'Translation Dictionary',
    description: 'Maps translation keys to localized strings for a single language',
  })
)

/**
 * Centralized translations for all supported languages
 *
 * Outer Record key: Language code (ISO 639-1)
 * Outer Record value: Translation dictionary for that language
 *
 * This is the PRIMARY i18n pattern. Use $t:key syntax in ANY string property
 * to reference translations: children arrays, component props, meta properties, etc.
 *
 * @example
 * ```typescript
 * const translations = {
 *   'en-US': {
 *     'common.save': 'Save',
 *     'nav.home': 'Home'
 *   },
 *   'fr-FR': {
 *     'common.save': 'Enregistrer',
 *     'nav.home': 'Accueil'
 *   }
 * }
 * ```
 */
export const TranslationsSchema = Schema.Record({
  key: LanguageCodeSchema,
  value: TranslationDictionarySchema,
}).pipe(
  Schema.annotations({
    title: 'Centralized Translations',
    description:
      'Translation dictionaries for all supported languages. Use $t:key syntax to reference translations.',
  })
)

/**
 * Multi-language support configuration for the entire application
 *
 * Provides:
 * - default: Default language (required)
 * - supported: Array of supported languages with metadata (required)
 * - fallback: Language to use when translation is missing (optional, defaults to default language)
 * - detectBrowser: Auto-detect language from browser (optional, defaults to true)
 * - persistSelection: Remember user's language choice in localStorage (optional, defaults to true)
 * - translations: Centralized translation dictionaries (optional)
 *
 * @example
 * ```typescript
 * const languages = {
 *   default: 'en-US',
 *   supported: [
 *     { code: 'en-US', label: 'English', direction: 'ltr' },
 *     { code: 'fr-FR', label: 'Français', direction: 'ltr' }
 *   ],
 *   detectBrowser: true,
 *   persistSelection: true,
 *   translations: {
 *     'en-US': { 'common.save': 'Save' },
 *     'fr-FR': { 'common.save': 'Enregistrer' }
 *   }
 * }
 * ```
 *
 * @see specs/app/languages/languages.schema.json
 */
export const LanguagesSchema = Schema.Struct({
  default: LanguageCodeSchema,
  supported: Schema.Array(LanguageConfigSchema).pipe(
    Schema.minItems(1),
    Schema.annotations({
      description: 'List of supported languages',
    })
  ),
  fallback: Schema.optional(LanguageCodeSchema),
  detectBrowser: Schema.optional(Schema.Boolean),
  persistSelection: Schema.optional(Schema.Boolean),
  translations: Schema.optional(TranslationsSchema),
}).pipe(
  Schema.filter((input) => {
    const supportedCodes = new Set(input.supported.map((lang) => lang.code))
    if (!supportedCodes.has(input.default)) {
      return 'default language must be in supported array'
    }
    if (input.fallback && !supportedCodes.has(input.fallback)) {
      return 'fallback language must be in supported array'
    }
    return undefined
  }),
  Schema.annotations({
    title: 'Languages Configuration',
    description: 'Multi-language support configuration for the entire application',
  })
)

export type LanguageCode = Schema.Schema.Type<typeof LanguageCodeSchema>
export type TranslationKey = Schema.Schema.Type<typeof TranslationKeySchema>
export type TranslationDictionary = Schema.Schema.Type<typeof TranslationDictionarySchema>
export type Translations = Schema.Schema.Type<typeof TranslationsSchema>
export type Languages = Schema.Schema.Type<typeof LanguagesSchema>
