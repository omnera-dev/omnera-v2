/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { LanguageSwitcher } from '@/presentation/components/languages/language-switcher'
import { Badge } from '@/presentation/components/ui/badge'
import { TypographyH1, TypographyLead } from '@/presentation/components/ui/typography'
import type { App } from '@/domain/models/app'

/**
 * DefaultHomePage component - Default home page displaying application information
 *
 * This is the default home page shown when no custom page configuration is provided.
 * It displays the app name, optional version badge, and optional description in a centered layout with gradient background.
 *
 * @param props - Component props
 * @param props.app - Validated application data from AppSchema
 * @returns React element with app information
 */
export function DefaultHomePage({ app }: { readonly app: App }): Readonly<ReactElement> {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>{`${app.name} - Powered by Omnera`}</title>
        <link
          rel="stylesheet"
          href="/assets/output.css"
        />
      </head>
      <body className="h-screen overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
        <div className="container-page h-full">
          <div className="flex h-full flex-col items-center justify-center">
            <div className="w-full max-w-2xl space-y-6 text-center">
              {/* Language Switcher */}
              {app.languages && <LanguageSwitcher languages={app.languages} />}
              {/* Version Badge */}
              {app.version && <Badge data-testid="app-version-badge">{app.version}</Badge>}
              {/* App Name */}
              <TypographyH1
                className="text-center"
                data-testid="app-name-heading"
              >
                {app.name}
              </TypographyH1>
              {/* App Description */}
              {app.description && (
                <TypographyLead
                  data-testid="app-description"
                  className="text-center"
                >
                  {app.description}
                </TypographyLead>
              )}
            </div>
          </div>
        </div>
        {/* Client-side language switcher functionality */}
        {app.languages && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
(function() {
  'use strict';

  const languagesConfig = ${JSON.stringify(app.languages)};
  let currentLanguage = languagesConfig.default;
  let isOpen = false;

  // Cache DOM elements to avoid repeated queries
  let currentLanguageEl, dropdown, switcherButton;

  function updateUI() {
    const currentLang = languagesConfig.supported.find(lang => lang.code === currentLanguage);
    const label = currentLang?.label || currentLanguage;

    if (currentLanguageEl) {
      currentLanguageEl.textContent = label;
    }
  }

  function toggleDropdown() {
    isOpen = !isOpen;
    if (dropdown) {
      dropdown.classList.toggle('hidden', !isOpen);
    }
  }

  function selectLanguage(code) {
    currentLanguage = code;
    isOpen = false;
    updateUI();
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements once
    currentLanguageEl = document.querySelector('[data-testid="current-language"]');
    dropdown = document.querySelector('[data-language-dropdown]');
    switcherButton = document.querySelector('[data-testid="language-switcher"]');

    if (switcherButton) {
      switcherButton.addEventListener('click', toggleDropdown);
    }

    const languageOptions = document.querySelectorAll('[data-language-option]');
    languageOptions.forEach(option => {
      option.addEventListener('click', function() {
        const code = this.getAttribute('data-language-code');
        if (code) {
          selectLanguage(code);
        }
      });
    });
  });
})();
            `,
            }}
          />
        )}
      </body>
    </html>
  )
}
