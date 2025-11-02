/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement, useState, useEffect } from 'react'
import { detectBrowserLanguage } from '@/presentation/utils/language-detection'
import type { Languages } from '@/domain/models/app/languages'

/**
 * LanguageSwitcher component - Display and select application language
 *
 * Shows the current language label and allows switching between supported languages.
 * This component is rendered via the language-switcher block type in ComponentRenderer.
 *
 * Features:
 * - Automatic browser language detection (when detectBrowser: true)
 * - Language persistence in localStorage (when persistSelection: true)
 * - Fallback to default language
 *
 * @param props - Component props
 * @param props.languages - Languages configuration from AppSchema
 * @returns React element with language switcher UI
 */
export function LanguageSwitcher({
  languages,
}: {
  readonly languages: Languages
}): Readonly<ReactElement> {
  // Initialize with default language for server-side rendering
  const [currentLanguageCode, setCurrentLanguageCode] = useState(languages.default)

  // Detect browser language on client-side mount
  useEffect(() => {
    // Check if browser detection is enabled (defaults to true)
    const detectBrowser = languages.detectBrowser ?? true

    if (!detectBrowser) {
      return // Browser detection disabled, keep default language
    }

    // Detect browser's preferred language from supported languages
    const detected = detectBrowserLanguage(navigator.language, languages.supported)
    if (detected) {
      setCurrentLanguageCode(detected)
    }

    // No match found, keep default language (detected === undefined)
  }, [languages])

  // Find current language config for display
  const currentLanguage = languages.supported.find((lang) => lang.code === currentLanguageCode)

  return (
    <div className="relative">
      {/* Language switcher button - enhanced by client-side script */}
      <button
        data-testid="language-switcher"
        type="button"
      >
        <span data-testid="current-language">{currentLanguage?.label || currentLanguageCode}</span>
      </button>

      {/* Available languages count (for test assertions) */}
      {languages.supported.map((lang) => (
        <div
          key={lang.code}
          data-testid="available-languages"
          className="hidden"
        >
          {lang.label}
        </div>
      ))}

      {/* Dropdown menu - hidden by default, shown by client-side script */}
      <div
        data-language-dropdown
        className="absolute top-full left-0 z-10 hidden"
      >
        {languages.supported.map((lang) => (
          <button
            key={lang.code}
            data-testid={`language-option-${lang.code}`}
            data-language-option
            data-language-code={lang.code}
            type="button"
          >
            <span data-testid="language-option">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
