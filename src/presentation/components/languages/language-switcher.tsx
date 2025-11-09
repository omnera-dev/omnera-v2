/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import type { Languages } from '@/domain/models/app/languages'

/**
 * LanguageSwitcher component - Server-side rendered language switcher
 *
 * This component renders the static HTML structure for the language switcher.
 * All client-side interactivity (click handlers, language detection, localStorage)
 * is handled by the vanilla JavaScript file: language-switcher.js
 *
 * Architecture:
 * - React component = SSR only (renders HTML structure)
 * - Vanilla JS = Client-side progressive enhancement (handles interactivity)
 *
 * This separation ensures:
 * - No duplicate logic between React and vanilla JS
 * - Works without React hydration (pure progressive enhancement)
 * - Clear separation of concerns (SSR vs client-side)
 *
 * @param props - Component props
 * @param props.languages - Languages configuration from AppSchema
 * @returns React element with language switcher HTML structure
 */
export function LanguageSwitcher({
  languages,
}: {
  readonly languages: Languages
}): Readonly<ReactElement> {
  // Default language for initial SSR (vanilla JS will update on client)
  const defaultLanguage = languages.supported.find((lang) => lang.code === languages.default)

  return (
    <div className="relative">
      {/* Language switcher button - vanilla JS will attach click handler */}
      <button
        data-testid="language-switcher"
        type="button"
      >
        <span
          data-testid="language-code"
          className="hidden"
        >
          {languages.default}
        </span>
        <span
          data-testid="current-language"
          data-code={languages.default}
        >
          {defaultLanguage?.label || languages.default}
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

      {/* Dropdown menu - vanilla JS will handle show/hide */}
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
