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

  let currentLanguage = languagesConfig.default
  let isOpen = false

  // Cache DOM elements to avoid repeated queries
  let currentLanguageEl, dropdown, switcherButton

  /**
   * Updates the language switcher UI to reflect current language
   * Finds the label for currentLanguage and updates DOM element
   */
  function updateUI() {
    const currentLang = languagesConfig.supported.find((lang) => lang.code === currentLanguage)
    const label = currentLang?.label || currentLanguage

    if (currentLanguageEl) {
      currentLanguageEl.textContent = label
    }
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
   * @param {string} code - ISO 639-1 language code (e.g., 'en-US', 'fr-FR')
   */
  function selectLanguage(code) {
    currentLanguage = code
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
