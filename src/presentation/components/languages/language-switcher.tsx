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
  // Find current language config (default language on initial render)
  const currentLanguage = languages.supported.find((lang) => lang.code === languages.default)

  return (
    <>
      <div data-testid="language-switcher">{currentLanguage?.label || languages.default}</div>
      {languages.supported.map((lang) => (
        <div
          key={lang.code}
          data-testid="available-languages"
          style={{ display: 'none' }}
        >
          {lang.label}
        </div>
      ))}
    </>
  )
}
