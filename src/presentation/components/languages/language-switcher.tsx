/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import type { Languages } from '@/domain/models/app/languages'

/**
 * Helper to check if flag is an image path (starts with /)
 */
const isImageFlag = (flag: string | undefined): boolean => Boolean(flag?.startsWith('/'))

/**
 * Helper to determine if flag should be shown (emoji flags only, not image paths)
 */
const shouldShowFlag = (flag: string | undefined): boolean => Boolean(flag && !isImageFlag(flag))

/**
 * Language switcher button component
 */
function LanguageSwitcherButton({
  defaultLanguage,
  defaultCode,
}: {
  readonly defaultLanguage: Languages['supported'][number] | undefined
  readonly defaultCode: string
}): ReactElement {
  return (
    <button
      data-testid="language-switcher"
      type="button"
    >
      <span
        data-testid="language-flag"
        className={shouldShowFlag(defaultLanguage?.flag) ? '' : 'hidden'}
      >
        {shouldShowFlag(defaultLanguage?.flag) && `${defaultLanguage!.flag} `}
      </span>
      <span
        data-testid="language-code"
        className="hidden"
      >
        {defaultCode}
      </span>
      <span
        data-testid="current-language"
        data-code={defaultCode}
      >
        {defaultLanguage?.label || defaultCode}
      </span>
    </button>
  )
}

/**
 * Language option button component
 */
function LanguageOption({
  lang,
  showFlags,
}: {
  readonly lang: Languages['supported'][number]
  readonly showFlags: boolean
}): ReactElement {
  return (
    <button
      key={lang.code}
      data-testid={`language-option-${lang.code}`}
      data-language-option
      data-language-code={lang.code}
      type="button"
    >
      <span data-testid="language-option">
        {showFlags && isImageFlag(lang.flag) && (
          <img
            src={lang.flag}
            alt={`${lang.label} flag`}
            data-testid="language-flag-img"
          />
        )}
        {showFlags && shouldShowFlag(lang.flag) && `${lang.flag} `}
        {lang.label}
      </span>
    </button>
  )
}

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
 * @param props.variant - Display variant (dropdown, inline, tabs) - defaults to dropdown
 * @param props.showFlags - Whether to show flag emojis - defaults to false
 * @returns React element with language switcher HTML structure
 */
export function LanguageSwitcher({
  languages,
  variant = 'dropdown',
  showFlags = false,
}: {
  readonly languages: Languages
  readonly variant?: string
  readonly showFlags?: boolean
}): Readonly<ReactElement> {
  const defaultLanguage = languages.supported.find((lang) => lang.code === languages.default)

  return (
    <div
      className="relative"
      data-variant={variant}
    >
      <LanguageSwitcherButton
        defaultLanguage={defaultLanguage}
        defaultCode={languages.default}
      />

      {/* Dropdown menu - vanilla JS will handle show/hide */}
      <div
        data-language-dropdown
        className="absolute top-full left-0 z-10 hidden"
      >
        {languages.supported.map((lang) => (
          <LanguageOption
            key={lang.code}
            lang={lang}
            showFlags={showFlags}
          />
        ))}
      </div>
    </div>
  )
}
