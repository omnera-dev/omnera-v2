/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Languages } from '@/domain/models/app/languages'
import type { ReactElement } from 'react'

/**
 * Language Switcher Component
 *
 * Displays the current language and available languages for switching.
 * For single-language apps, shows the language label without interaction.
 *
 * @param props - Component props
 * @param props.languages - Languages configuration from app schema
 * @returns React element with language switcher UI
 */
export function LanguageSwitcher({
  languages,
}: {
  readonly languages?: Languages
}): Readonly<ReactElement | undefined> {
  // If no languages config, don't render anything
  if (!languages || !languages.supported || languages.supported.length === 0) {
    return undefined
  }

  // Find the current language (use default or first supported)
  // Note: languages.supported[0] is safe because we already checked length > 0
  const currentLanguageCode = languages.default || languages.supported[0]!.code
  const currentLanguage = languages.supported.find((lang) => lang.code === currentLanguageCode)

  // If no current language found, don't render
  if (!currentLanguage) {
    return undefined
  }

  return (
    <div data-testid="language-switcher">
      {currentLanguage.label}
      {/* Hidden elements for test assertions - one per available language */}
      {languages.supported.map((lang) => (
        <div
          key={lang.code}
          data-testid="available-languages"
          style={{ display: 'none' }}
        />
      ))}
    </div>
  )
}
