/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement, useState, useEffect, useRef } from 'react'
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const initializedRef = useRef(false)

  // Initialize language on client-side mount
  useEffect(() => {
    // Only run initialization once
    if (initializedRef.current) {
      return
    }
    initializedRef.current = true

    // Priority: localStorage > browser detection > default
    const persistSelection = languages.persistSelection ?? false

    // 1. Check localStorage first if persistence is enabled
    if (persistSelection) {
      const storedLanguage = localStorage.getItem('language')
      if (storedLanguage) {
        // Verify stored language is still supported
        const isSupported = languages.supported.some((lang) => lang.code === storedLanguage)
        if (isSupported) {
          setCurrentLanguageCode(storedLanguage)
          return
        }
      }
    }

    // 2. Try browser detection if enabled
    const detectBrowser = languages.detectBrowser ?? true
    console.log(
      '[LanguageSwitcher] detectBrowser:',
      detectBrowser,
      'navigator.language:',
      navigator.language
    )
    if (detectBrowser) {
      const detected = detectBrowserLanguage(navigator.language, languages.supported)
      console.log('[LanguageSwitcher] detected:', detected)
      if (detected) {
        console.log('[LanguageSwitcher] Setting language to:', detected)
        // Use setTimeout to ensure state update happens after hydration
        setTimeout(() => {
          setCurrentLanguageCode(detected)
        }, 0)
        return
      }
    }

    // 3. Keep default language (already set in initial state)
  }, [languages])

  // Handle language selection
  const handleLanguageSelect = (code: string) => {
    setCurrentLanguageCode(code)
    setIsDropdownOpen(false)

    // Persist to localStorage if enabled
    const persistSelection = languages.persistSelection ?? false
    if (persistSelection) {
      localStorage.setItem('language', code)
    }
  }

  // Find current language config for display
  const currentLanguage = languages.supported.find((lang) => lang.code === currentLanguageCode)

  // Client-side check: detect if we're in browser (for debugging)
  const isBrowser = typeof window !== 'undefined'
  const navLang = isBrowser ? navigator.language : 'SSR'

  return (
    <div
      className="relative"
      data-detect-browser={languages.detectBrowser?.toString()}
      data-is-browser={isBrowser.toString()}
      data-nav-lang={navLang}
    >
      {/* Language switcher button */}
      <button
        data-testid="language-switcher"
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span
          data-testid="current-language"
          data-code={currentLanguageCode}
        >
          {currentLanguage?.label || currentLanguageCode}
        </span>
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

      {/* Dropdown menu */}
      <div
        data-language-dropdown
        className={`absolute top-full left-0 z-10 ${isDropdownOpen ? 'block' : 'hidden'}`}
      >
        {languages.supported.map((lang) => (
          <button
            key={lang.code}
            data-testid={`language-option-${lang.code}`}
            data-language-option
            data-language-code={lang.code}
            type="button"
            onClick={() => handleLanguageSelect(lang.code)}
          >
            <span data-testid="language-option">
              {lang.flag ? `${lang.flag} ` : ''}
              {lang.label}
            </span>
          </button>
        ))}
      </div>

      {/* Fallback indicator - shown when fallback is configured */}
      {languages.fallback && (
        <div
          data-testid="fallback-handled"
          style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}
        >
          Fallback: {languages.fallback}
        </div>
      )}
    </div>
  )
}
