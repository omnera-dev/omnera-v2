/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Browser Language Detection Utility
 *
 * Provides shared logic for detecting browser language preferences
 * across React components and vanilla JavaScript client scripts.
 *
 * Detection Strategy:
 * 1. Try exact match first (e.g., 'fr-FR' === 'fr-FR')
 * 2. Try base language match (e.g., 'fr' from 'fr-FR' matches 'fr-CA')
 * 3. Return null if no match found (caller handles fallback)
 *
 * @example
 * ```ts
 * const detected = detectBrowserLanguage('fr-FR', [
 *   { code: 'en-US', label: 'English' },
 *   { code: 'fr-FR', label: 'Français' }
 * ])
 * // Returns: 'fr-FR'
 * ```
 */

export interface LanguageConfig {
  readonly code: string
  // Other fields (label, direction, flag) not needed for detection
}

/**
 * Detect browser's preferred language from supported languages list
 *
 * @param browserLang - Browser language code from navigator.language (e.g., 'fr-FR', 'en-US')
 * @param supportedLanguages - Array of supported language configurations
 * @returns Detected language code if match found, undefined otherwise
 */
export function detectBrowserLanguage(
  browserLang: string,
  supportedLanguages: ReadonlyArray<LanguageConfig>
): string | undefined {
  // Try exact match first (e.g., 'fr-FR' === 'fr-FR')
  const exactMatch = supportedLanguages.find((lang) => lang.code === browserLang)
  if (exactMatch) {
    return exactMatch.code
  }

  // Try base language match (e.g., 'fr' from 'fr-FR')
  const baseLang = browserLang.split('-')[0]
  const baseMatch = supportedLanguages.find((lang) => lang.code.split('-')[0] === baseLang)
  if (baseMatch) {
    return baseMatch.code
  }

  // No match found - caller should use default language
  return undefined
}
