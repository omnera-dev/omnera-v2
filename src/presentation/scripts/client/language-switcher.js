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
   * Respects browser language detection setting and localStorage persistence
   */
  function getInitialLanguage() {
    // Check if persistence is enabled (defaults to true)
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

    // Check if browser detection is enabled (defaults to true)
    const detectBrowser = languagesConfig.detectBrowser ?? true

    if (detectBrowser) {
      // Use local detection function
      const detected = detectBrowserLanguage(navigator.language, languagesConfig.supported)
      if (detected) {
        return detected
      }
    }

    // Fallback to default language (no match found or detection disabled)
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
   * Updates the language switcher UI to reflect current language
   * Finds the label for currentLanguage and updates DOM element
   * Also updates the HTML dir attribute for RTL/LTR text direction
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
   * @param {string} code - ISO 639-1 language code (e.g., 'en-US', 'fr-FR')
   */
  function selectLanguage(code) {
    currentLanguage = code

    // Save to localStorage if persistence is enabled (defaults to true)
    const persistSelection = languagesConfig.persistSelection ?? true
    if (persistSelection) {
      localStorage.setItem('language', code)
    }

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
