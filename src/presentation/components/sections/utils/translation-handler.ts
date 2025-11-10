/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import {
  collectTranslationsForKey,
  resolveTranslationPattern,
} from '@/presentation/utils/translation-resolver'
import type { Languages } from '@/domain/models/app/languages'
import type { Component } from '@/domain/models/app/page/sections'

/**
 * Find first translation key in children
 */
export function findFirstTranslationKey(
  children: readonly (Component | string)[] | undefined
): string | undefined {
  return children
    ?.find(
      (child: Component | string): child is string =>
        typeof child === 'string' && child.startsWith('$t:')
    )
    ?.slice(3) // Remove '$t:' prefix
}

/**
 * Get current language with fallback
 */
export function getCurrentLanguage(
  currentLang: string | undefined,
  languages: Languages | undefined
): string {
  return currentLang || languages?.default || 'en-US'
}

/**
 * Resolve translation pattern for a child element
 */
export function resolveChildTranslation(
  child: string,
  currentLang: string | undefined,
  languages: Languages | undefined
): string {
  const lang = getCurrentLanguage(currentLang, languages)
  return resolveTranslationPattern(child, lang, languages)
}

/**
 * Collect translation data for a key
 */
export function getTranslationData(
  translationKey: string | undefined,
  languages: Languages | undefined
): Record<string, string> | undefined {
  return translationKey ? collectTranslationsForKey(translationKey, languages) : undefined
}
