/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Client-side language switcher interactivity
 *
 * Immediately Invoked Function Expression (IIFE) that:
 * - Reads language configuration from data attribute
 * - Initializes language state
 * - Caches DOM elements for performance
 * - Handles dropdown toggle and language selection
 * - Updates UI when language changes
 *
 * CSP-compliant: No inline event handlers, runs from external file
 */
;(function () {
  'use strict'

  // Read language configuration from data attribute
  const configEl = document.querySelector('[data-language-switcher-config]')
  if (!configEl) {
    console.warn('Language switcher: missing data-language-switcher-config element')
    return
  }

  let languagesConfig
  try {
    languagesConfig = JSON.parse(configEl.dataset.languageSwitcherConfig || '{}')
  } catch (error) {
    console.error('Language switcher: failed to parse configuration', error)
    return
  }

  /**
   * Detect browser language from navigator.language
   * Supports exact match (e.g., 'fr-FR') and base language match (e.g., 'fr' from 'fr-FR')
   *
   * This is a duplicate of the detection logic in language-detection.ts utility.
   * Duplication is necessary because:
   * - This script runs in the browser as a plain JS file (no ES modules)
   * - Browser scripts can't import TypeScript utilities directly
   * - Bundling would add complexity for this simple use case
   *
   * NOTE: If detection algorithm changes, update BOTH files:
   * - src/presentation/utils/language-detection.ts (shared utility)
   * - src/presentation/scripts/client/language-switcher.js (this file)
   */
  function detectBrowserLanguage(browserLang, supportedLanguages) {
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

    // No match found
    return undefined
  }

  /**
   * Detect initial language based on configuration
   * Priority order:
   * 1. Page language from <html lang> IF it differs from default (explicit page.meta.lang - highest priority)
   * 2. localStorage (user's explicit manual choice - persists across reloads)
   * 3. Page language from <html lang> IF it matches default (server-detected or default)
   * 4. Browser detection (user's browser preference, only if no HTML lang set)
   * 5. Default language (final fallback)
   */
  function getInitialLanguage() {
    const pageLang = document.documentElement.getAttribute('lang')
    const defaultLang = languagesConfig.default

    // 1. Check if page has explicit non-default language (page.meta.lang set explicitly)
    // If HTML lang differs from default, it means the page explicitly set a language
    if (pageLang && pageLang !== defaultLang) {
      // Verify page language is in supported languages
      const isSupported = languagesConfig.supported.some((lang) => lang.code === pageLang)
      if (isSupported) {
        return pageLang
      }
    }

    // 2. Check if persistence is enabled (defaults to true)
    const persistSelection = languagesConfig.persistSelection ?? true

    if (persistSelection) {
      // Check localStorage for previously saved language
      const savedLanguage = localStorage.getItem('language')
      if (savedLanguage) {
        // Verify saved language is in supported languages
        const isSupported = languagesConfig.supported.some((lang) => lang.code === savedLanguage)
        if (isSupported) {
          return savedLanguage
        }
      }
    }

    // 3. Use HTML lang attribute if it matches default (server's default or Accept-Language detection)
    if (pageLang) {
      const isSupported = languagesConfig.supported.some((lang) => lang.code === pageLang)
      if (isSupported) {
        return pageLang
      }
    }

    // 4. Check if browser detection is enabled (defaults to true)
    const detectBrowser = languagesConfig.detectBrowser ?? true

    if (detectBrowser) {
      // Use local detection function
      const detected = detectBrowserLanguage(navigator.language, languagesConfig.supported)
      if (detected) {
        return detected
      }
    }

    // 5. Fallback to default language (no match found or detection disabled)
    return languagesConfig.default
  }

  let currentLanguage = getInitialLanguage()
  let isOpen = false

  // Cache DOM elements to avoid repeated queries
  let currentLanguageEl, dropdown, switcherButton

  /**
   * Updates all elements with translation keys
   * Reads pre-resolved translations from data-translations attribute and updates text
   *
   * NOTE: Translation resolution logic has been moved to server-side to eliminate duplication.
   * Server pre-resolves all translations for all languages and injects them via data-translations.
   * Client only needs to lookup the appropriate translation, not re-implement fallback logic.
   */
  function updateTranslations() {
    const translatedElements = document.querySelectorAll('[data-translation-key]')
    translatedElements.forEach((element) => {
      const key = element.getAttribute('data-translation-key')
      const translationsJson = element.getAttribute('data-translations')

      if (key && translationsJson) {
        try {
          const translations = JSON.parse(translationsJson)

          // Try current language first
          let translation = translations[currentLanguage]

          // Try fallback language if missing
          if (!translation && languagesConfig.fallback) {
            translation = translations[languagesConfig.fallback]
          }

          // Try default language if still missing
          if (!translation) {
            translation = translations[languagesConfig.default]
          }

          // Use translation or key as final fallback
          element.textContent = translation || key
        } catch (error) {
          console.error('Failed to parse translations for key:', key, error)
          // Fallback to key if JSON parsing fails
          element.textContent = key
        }
      }
    })
  }

  /**
   * Updates page content with i18n translations
   * Finds all elements with data-i18n-content attribute and updates their text content
   */
  function updateContentI18n() {
    const i18nElements = document.querySelectorAll('[data-i18n-content]')
    i18nElements.forEach((element) => {
      const i18nJson = element.getAttribute('data-i18n-content')
      if (!i18nJson) {
        return
      }

      try {
        const i18nData = JSON.parse(i18nJson)

        // Try current language first
        let content = i18nData[currentLanguage]

        // Try fallback language if missing
        if (!content && languagesConfig.fallback) {
          content = i18nData[languagesConfig.fallback]
        }

        // Try default language if still missing
        if (!content) {
          content = i18nData[languagesConfig.default]
        }

        // Update element text content if translation found
        if (content) {
          element.textContent = content
        }
      } catch (error) {
        console.error('Failed to parse i18n content data:', error)
      }
    })
  }

  /**
   * Updates page metadata (title, HTML lang) for the current language
   * Reads metadata from data-page-meta attribute and applies localized values
   */
  function updatePageMetadata() {
    // Read page metadata configuration
    const pageMetaEl = document.querySelector('[data-page-meta]')
    if (!pageMetaEl) {
      return
    }

    let pageMeta
    try {
      pageMeta = JSON.parse(pageMetaEl.dataset.pageMeta || '{}')
    } catch (error) {
      console.error('Language switcher: failed to parse page metadata', error)
      return
    }

    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', currentLanguage)

    // Update page title if i18n translations are available
    if (pageMeta.i18n && pageMeta.i18n[currentLanguage]) {
      const localizedMeta = pageMeta.i18n[currentLanguage]
      if (localizedMeta.title) {
        document.title = localizedMeta.title
      }
      // Note: We don't update meta description dynamically as it's primarily for SEO
      // and search engines read it from the initial server response
    }
  }

  /**
   * Updates the language switcher UI to reflect current language
   * Finds the label for currentLanguage and updates DOM element
   * Also updates the HTML dir attribute for RTL/LTR text direction
   * Also updates window.APP_THEME.direction for theme integration
   */
  function updateUI() {
    const currentLang = languagesConfig.supported.find((lang) => lang.code === currentLanguage)
    const label = currentLang?.label || currentLanguage

    if (currentLanguageEl) {
      currentLanguageEl.textContent = label
    }

    // Update HTML dir attribute based on language direction
    const direction = currentLang?.direction || 'ltr'
    document.documentElement.setAttribute('dir', direction)

    // Update window.APP_THEME.direction for theme integration
    if (window.APP_THEME) {
      window.APP_THEME.direction = direction
    }

    // Update page metadata (title, HTML lang)
    updatePageMetadata()

    // Update content with i18n translations
    updateContentI18n()

    // Update all translated text when language changes
    updateTranslations()
  }

  /**
   * Toggles the language dropdown visibility
   * Updates isOpen state and dropdown CSS classes
   */
  function toggleDropdown() {
    isOpen = !isOpen
    if (dropdown) {
      dropdown.classList.toggle('hidden', !isOpen)
    }
  }

  /**
   * Selects a new language and updates the UI
   * Saves to localStorage if persistSelection is enabled
   * Handles navigation for language subdirectory URLs (/:lang/*)
   * @param {string} code - ISO 639-1 language code (e.g., 'en-US', 'fr-FR')
   */
  function selectLanguage(code) {
    currentLanguage = code

    // Save to localStorage if persistence is enabled (defaults to true)
    const persistSelection = languagesConfig.persistSelection ?? true
    if (persistSelection) {
      localStorage.setItem('language', code)
    }

    // Check if current URL uses language subdirectory pattern (/:lang/*)
    const currentPath = window.location.pathname
    const supportedCodes = languagesConfig.supported.map((lang) => lang.code)

    // Extract first path segment
    const segments = currentPath.split('/').filter(Boolean)
    const firstSegment = segments[0]

    // If current URL starts with a supported language code, navigate to new language subdirectory
    if (firstSegment && supportedCodes.includes(firstSegment)) {
      // Replace language segment: /fr-FR/about => /en-US/about
      const pathWithoutLang = '/' + segments.slice(1).join('/')
      const newPath = `/${code}${pathWithoutLang}`

      // Navigate to new language URL (preserves query params and hash)
      // Security: Use URL API to safely construct URL and prevent XSS
      const newUrl = new URL(newPath, window.location.origin)
      newUrl.search = window.location.search
      newUrl.hash = window.location.hash
      window.location.href = newUrl.href
      return
    }

    // No language subdirectory - update UI in place (backward compatibility)
    isOpen = false
    updateUI()
    if (dropdown) {
      dropdown.classList.add('hidden')
    }
  }

  /**
   * Initializes the language switcher on page load
   * Caches DOM elements and attaches event listeners
   */
  function init() {
    // Cache DOM elements once
    currentLanguageEl = document.querySelector('[data-testid="current-language"]')
    dropdown = document.querySelector('[data-language-dropdown]')
    switcherButton = document.querySelector('[data-testid="language-switcher"]')

    // Update UI to reflect detected/default language
    updateUI()

    if (switcherButton) {
      switcherButton.addEventListener('click', toggleDropdown)
    }

    const languageOptions = document.querySelectorAll('[data-language-option]')
    languageOptions.forEach((option) => {
      option.addEventListener('click', function () {
        const code = this.getAttribute('data-language-code')
        if (code) {
          selectLanguage(code)
        }
      })
    })
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    // DOM already loaded
    init()
  }
})()
