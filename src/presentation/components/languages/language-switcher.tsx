/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import type { Languages } from '@/domain/models/app/languages'

/**
 * LanguageSwitcher component - Display and select application language
 *
 * Shows the current language label and allows switching between supported languages.
 * Uses client-side JavaScript for interactivity (hydrated via script tag in DefaultHomePage).
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
  // Find default language config for initial render
  const currentLanguage = languages.supported.find((lang) => lang.code === languages.default)

  return (
    <div style={{ position: 'relative' }}>
      {/* Language switcher button - enhanced by client-side script */}
      <button
        data-testid="language-switcher"
        type="button"
      >
        <span data-testid="current-language">{currentLanguage?.label || languages.default}</span>
      </button>

      {/* Available languages count (for test assertions) */}
      {languages.supported.map((lang) => (
        <div
          key={lang.code}
          data-testid="available-languages"
          style={{ display: 'none' }}
        >
          {lang.label}
        </div>
      ))}

      {/* Dropdown menu - hidden by default, shown by client-side script */}
      <div
        data-language-dropdown
        style={{ display: 'none', position: 'absolute', top: '100%', left: 0, zIndex: 10 }}
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
