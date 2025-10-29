/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'

/**
 * Language code (ISO 639-1 with optional country code)
 *
 * Supports two formats:
 * - ISO 639-1 language-only: 'en', 'fr', 'ar' (2 lowercase letters)
 * - ISO 639-1 + country: 'en-US', 'fr-FR', 'ar-SA' (lowercase-UPPERCASE)
 *
 * @example
 * ```typescript
 * const code1 = 'en-US'  // English (United States)
 * const code2 = 'fr-FR'  // French (France)
 * const code3 = 'ar'     // Arabic (generic)
 * ```
 *
 * @see specs/app/languages/language-config.schema.json#/properties/code
 */
export const LanguageCodeSchema = Schema.String.pipe(
  Schema.pattern(/^[a-z]{2}(-[A-Z]{2})?$/, {
    message: () =>
      'Language code must be ISO 639-1 format: 2 lowercase letters (e.g., "en") or 2 lowercase letters followed by hyphen and 2 uppercase letters (e.g., "en-US")',
  }),
  Schema.annotations({
    title: 'Language Code',
    description: 'Language code (ISO 639-1 with optional country)',
    examples: ['en-US', 'fr-FR', 'es-ES', 'ar-SA'],
  })
)

/**
 * Human-readable language name
 *
 * Should use the language's native name for better UX
 * (e.g., "Français" instead of "French", "العربية" instead of "Arabic")
 *
 * @example
 * ```typescript
 * const label1 = 'English'
 * const label2 = 'Français'  // French in French
 * const label3 = 'العربية'    // Arabic in Arabic
 * ```
 *
 * @see specs/app/languages/language-config.schema.json#/properties/label
 */
export const LanguageLabelSchema = Schema.String.pipe(
  Schema.annotations({
    title: 'Language Label',
    description: 'Human-readable language name',
    examples: ['English', 'Français', 'Español', 'العربية'],
  })
)

/**
 * Text direction (left-to-right or right-to-left)
 *
 * Controls the base text flow direction:
 * - 'ltr': Left-to-right (default for most languages)
 * - 'rtl': Right-to-left (for Arabic, Hebrew, etc.)
 *
 * @example
 * ```typescript
 * const ltr = 'ltr'  // English, French, Spanish
 * const rtl = 'rtl'  // Arabic, Hebrew, Persian
 * ```
 *
 * @see specs/app/languages/language-config.schema.json#/properties/direction
 */
export const LanguageDirectionSchema = Schema.Literal('ltr', 'rtl').pipe(
  Schema.annotations({
    title: 'Text Direction',
    description: 'Text direction (left-to-right or right-to-left)',
  })
)

/**
 * Flag emoji or icon path
 *
 * Can be either:
 * - Unicode emoji: '🇺🇸', '🇫🇷', '🇪🇸' (instant, no loading)
 * - File path: '/flags/us.svg' (custom design, consistent styling)
 *
 * @example
 * ```typescript
 * const emoji = '🇺🇸'          // Unicode flag emoji
 * const path = '/flags/us.svg'  // Custom SVG flag
 * ```
 *
 * @see specs/app/languages/language-config.schema.json#/properties/flag
 */
export const LanguageFlagSchema = Schema.String.pipe(
  Schema.annotations({
    title: 'Language Flag',
    description: 'Flag emoji or icon path',
    examples: ['🇺🇸', '🇫🇷', '🇪🇸', '/flags/us.svg'],
  })
)

/**
 * Configuration for a single supported language
 *
 * Defines a language option in the language switcher with:
 * - ISO 639-1 language code (with optional country)
 * - Native language name for better UX
 * - Text direction for RTL language support
 * - Optional flag emoji or icon
 *
 * Key behaviors:
 * - Code and label are required properties
 * - Direction defaults to 'ltr' when omitted
 * - Flag is optional for minimal configuration
 * - Supports both emoji flags and custom icon paths
 *
 * @example
 * ```typescript
 * // English (US) with all properties
 * const enUS = {
 *   code: 'en-US',
 *   label: 'English',
 *   direction: 'ltr',
 *   flag: '🇺🇸'
 * }
 *
 * // Arabic with RTL support
 * const arSA = {
 *   code: 'ar-SA',
 *   label: 'العربية',
 *   direction: 'rtl',
 *   flag: '🇸🇦'
 * }
 *
 * // Minimal configuration
 * const deDE = {
 *   code: 'de-DE',
 *   label: 'Deutsch'
 *   // direction defaults to 'ltr'
 *   // flag omitted
 * }
 * ```
 *
 * @see specs/app/languages/language-config.schema.json
 */
export const LanguageConfigSchema = Schema.Struct({
  code: LanguageCodeSchema,
  label: LanguageLabelSchema,
  direction: Schema.optional(LanguageDirectionSchema),
  flag: Schema.optional(LanguageFlagSchema),
}).pipe(
  Schema.annotations({
    title: 'Language Configuration',
    description: 'Configuration for a single supported language',
  })
)

export type LanguageCode = Schema.Schema.Type<typeof LanguageCodeSchema>
export type LanguageLabel = Schema.Schema.Type<typeof LanguageLabelSchema>
export type LanguageDirection = Schema.Schema.Type<typeof LanguageDirectionSchema>
export type LanguageFlag = Schema.Schema.Type<typeof LanguageFlagSchema>
export type LanguageConfig = Schema.Schema.Type<typeof LanguageConfigSchema>
