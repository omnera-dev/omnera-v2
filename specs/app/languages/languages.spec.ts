/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Languages Configuration
 *
 * Source: specs/app/languages/languages.schema.json
 * Spec Count: 10
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (10 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Languages Configuration', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test(
    'APP-LANGUAGES-001: should use English as the only available language',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an app with default language en-US and one supported language
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            {
              code: 'en-US',
              label: 'English',
              direction: 'ltr',
            },
          ],
        },
        blocks: [
          {
            name: 'language-switcher',
            type: 'language-switcher',
            props: {
              variant: 'dropdown',
            },
          },
        ],
        pages: [
          {
            path: '/',
            sections: [
              {
                block: 'language-switcher',
              },
            ],
          },
        ],
      })

      // WHEN: app is configured with minimal language setup
      await page.goto('/')

      // THEN: it should use English as the only available language
      await expect(page.locator('[data-testid="language-switcher"]')).toHaveText('English')
      await expect(page.locator('[data-testid="available-languages"]')).toHaveCount(1)
    }
  )

  test(
    'APP-LANGUAGES-002: should be able to switch between all three languages',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an app with default en-US and supported languages [en-US, fr-FR, es-ES]
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English', direction: 'ltr' },
            { code: 'fr-FR', label: 'Français', direction: 'ltr' },
            { code: 'es-ES', label: 'Español', direction: 'ltr' },
          ],
        },
        blocks: [
          {
            name: 'language-switcher',
            type: 'language-switcher',
            props: {
              variant: 'dropdown',
            },
          },
        ],
        pages: [
          {
            path: '/',
            sections: [
              {
                block: 'language-switcher',
              },
            ],
          },
        ],
      })

      // WHEN: app is configured with multiple languages
      await page.goto('/')
      await page.locator('[data-testid="language-switcher"]').click()

      // THEN: users should be able to switch between all three languages
      await expect(page.locator('[data-testid="language-option"]')).toHaveCount(3)
      await page.locator('[data-testid="language-option-fr-FR"]').click()
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('Français')
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-es-ES"]').click()
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('Español')
    }
  )

  test(
    'APP-LANGUAGES-003: should display the English fallback text',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an app with translations where French is missing a key
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English', direction: 'ltr' },
            { code: 'fr-FR', label: 'Français', direction: 'ltr' },
          ],
          fallback: 'en-US',
          translations: {
            'en-US': {
              welcome: 'Welcome',
              goodbye: 'Goodbye',
            },
            'fr-FR': {
              welcome: 'Bienvenue',
              // 'goodbye' is intentionally missing to trigger fallback
            },
          },
        },
        blocks: [
          {
            name: 'language-switcher',
            type: 'language-switcher',
            props: {
              variant: 'dropdown',
            },
          },
        ],
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                block: 'language-switcher',
              },
              {
                type: 'div',
                children: [
                  {
                    type: 'span',
                    props: { 'data-testid': 'welcome-text' },
                    // '$t:welcome' resolves to translations['fr-FR']['welcome'] = 'Bienvenue'
                    children: ['$t:welcome'],
                  },
                  {
                    type: 'span',
                    props: { 'data-testid': 'goodbye-text' },
                    // '$t:goodbye' missing in fr-FR, falls back to translations['en-US']['goodbye'] = 'Goodbye'
                    children: ['$t:goodbye'],
                  },
                ],
              },
            ],
          },
        ],
      })

      // WHEN: a translation is missing for the current language
      await page.goto('/')
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-fr-FR"]').click()

      // THEN: it should display French for existing translation and English fallback for missing
      await expect(page.locator('[data-testid="welcome-text"]')).toHaveText('Bienvenue')
      await expect(page.locator('[data-testid="goodbye-text"]')).toHaveText('Goodbye')
    }
  )

  test(
    "APP-LANGUAGES-004: should automatically detect and set the browser's preferred language",
    { tag: '@spec' },
    async ({ page, startServerWithSchema, context }) => {
      // GIVEN: an app with detectBrowser set to true
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English', direction: 'ltr' },
            { code: 'fr-FR', label: 'Français', direction: 'ltr' },
          ],
          detectBrowser: true,
        },
        blocks: [
          {
            name: 'language-switcher',
            type: 'language-switcher',
            props: {
              variant: 'dropdown',
            },
          },
        ],
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                block: 'language-switcher',
              },
            ],
          },
        ],
      })

      // Set browser language preference
      await context.addInitScript(() => {
        Object.defineProperty(navigator, 'language', { value: 'fr-FR' })
      })

      // WHEN: user visits the site for the first time
      await page.goto('/')

      // THEN: it should automatically detect and set the browser's preferred language
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('Français')
    }
  )

  test(
    'APP-LANGUAGES-005: should use the default language without auto-detection',
    { tag: '@spec' },
    async ({ page, startServerWithSchema, context }) => {
      // GIVEN: an app with detectBrowser set to false
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English', direction: 'ltr' },
            { code: 'fr-FR', label: 'Français', direction: 'ltr' },
          ],
          detectBrowser: false,
        },
        blocks: [
          {
            name: 'language-switcher',
            type: 'language-switcher',
            props: {
              variant: 'dropdown',
            },
          },
        ],
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                block: 'language-switcher',
              },
            ],
          },
        ],
      })

      // Set browser language preference to French
      await context.addInitScript(() => {
        Object.defineProperty(navigator, 'language', { value: 'fr-FR' })
      })

      // WHEN: user visits the site
      await page.goto('/')

      // THEN: it should use the default language without auto-detection
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('English')
    }
  )

  test.fixme(
    'APP-LANGUAGES-006: should remember the choice in localStorage for future visits',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an app with persistSelection set to true
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English', direction: 'ltr' },
            { code: 'fr-FR', label: 'Français', direction: 'ltr' },
          ],
          persistSelection: true,
        },
        blocks: [
          {
            name: 'language-switcher',
            type: 'language-switcher',
            props: {
              variant: 'dropdown',
            },
          },
        ],
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                block: 'language-switcher',
              },
            ],
          },
        ],
      })

      // WHEN: user manually selects a language
      await page.goto('/')
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-fr-FR"]').click()

      // THEN: it should remember the choice in localStorage for future visits
      const storedLanguage = await page.evaluate(() => localStorage.getItem('language'))
      expect(storedLanguage).toBe('fr-FR')

      // Reload and verify persistence
      await page.reload()
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('Français')
    }
  )

  test.fixme(
    'APP-LANGUAGES-007: should not persist the choice and reset to default on next visit',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an app with persistSelection set to false
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English', direction: 'ltr' },
            { code: 'fr-FR', label: 'Français', direction: 'ltr' },
          ],
          persistSelection: false,
        },
        blocks: [
          {
            name: 'language-switcher',
            type: 'language-switcher',
            props: {
              variant: 'dropdown',
            },
          },
        ],
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                block: 'language-switcher',
              },
            ],
          },
        ],
      })

      // WHEN: user manually selects a language
      await page.goto('/')
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-fr-FR"]').click()

      // THEN: it should not persist the choice and reset to default on next visit
      await page.reload()
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('English')
    }
  )

  test.fixme(
    'APP-LANGUAGES-008: should flip between LTR and RTL direction',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an app with supported languages including RTL (ar-SA) and LTR (en-US)
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English', direction: 'ltr' },
            { code: 'ar-SA', label: 'العربية', direction: 'rtl' },
          ],
        },
        blocks: [
          {
            name: 'language-switcher',
            type: 'language-switcher',
            props: {
              variant: 'dropdown',
            },
          },
        ],
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                block: 'language-switcher',
              },
            ],
          },
        ],
      })

      // WHEN: user switches between English and Arabic
      await page.goto('/')
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')

      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-ar-SA"]').click()

      // THEN: the entire app layout should flip between LTR and RTL direction
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('العربية')
    }
  )

  test.fixme(
    'APP-LANGUAGES-009: should display all languages with their native labels and flags',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an app with 5+ supported languages from different regions
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English', direction: 'ltr', flag: '🇺🇸' },
            { code: 'fr-FR', label: 'Français', direction: 'ltr', flag: '🇫🇷' },
            { code: 'es-ES', label: 'Español', direction: 'ltr', flag: '🇪🇸' },
            { code: 'ar-SA', label: 'العربية', direction: 'rtl', flag: '🇸🇦' },
            { code: 'zh-CN', label: '中文', direction: 'ltr', flag: '🇨🇳' },
            { code: 'ja-JP', label: '日本語', direction: 'ltr', flag: '🇯🇵' },
          ],
        },
        blocks: [
          {
            name: 'language-switcher',
            type: 'language-switcher',
            props: {
              variant: 'dropdown',
            },
          },
        ],
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                block: 'language-switcher',
              },
            ],
          },
        ],
      })

      // WHEN: user opens language switcher
      await page.goto('/')
      await page.locator('[data-testid="language-switcher"]').click()

      // THEN: all languages should be displayed with their native labels and flags
      await expect(page.locator('[data-testid="language-option"]')).toHaveCount(6)
      await expect(page.locator('[data-testid="language-option-en-US"]')).toContainText('English')
      await expect(page.locator('[data-testid="language-option-en-US"]')).toContainText('🇺🇸')
      await expect(page.locator('[data-testid="language-option-ar-SA"]')).toContainText('العربية')
      await expect(page.locator('[data-testid="language-option-zh-CN"]')).toContainText('中文')
    }
  )

  test.fixme(
    'APP-LANGUAGES-010: should provide seamless multi-language UX with auto-detection, persistence, and fallback',
    { tag: '@spec' },
    async ({ page, startServerWithSchema, context }) => {
      // GIVEN: an app with all features enabled (detectBrowser, persistSelection, fallback)
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English', direction: 'ltr' },
            { code: 'fr-FR', label: 'Français', direction: 'ltr' },
            { code: 'es-ES', label: 'Español', direction: 'ltr' },
          ],
          fallback: 'en-US',
          detectBrowser: true,
          persistSelection: true,
        },
        blocks: [
          {
            name: 'language-switcher',
            type: 'language-switcher',
            props: {
              variant: 'dropdown',
            },
          },
        ],
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                block: 'language-switcher',
              },
            ],
          },
        ],
      })

      // Set browser language to French
      await context.addInitScript(() => {
        Object.defineProperty(navigator, 'language', { value: 'fr-FR' })
      })

      // WHEN: language configuration is fully utilized
      await page.goto('/')

      // THEN: it should provide seamless multi-language UX
      // Auto-detection: Should detect French from browser
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('Français')

      // Persistence: Change to Spanish and verify it's stored
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-es-ES"]').click()
      const storedLanguage = await page.evaluate(() => localStorage.getItem('language'))
      expect(storedLanguage).toBe('es-ES')

      // Reload to verify persistence works
      await page.reload()
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('Español')

      // Fallback: Verify missing translations fall back to English
      await expect(page.locator('[data-testid="fallback-handled"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-LANGUAGES-011: should fail validation - default language must be in supported array',
    { tag: '@spec' },
    async ({ startServerWithSchema }) => {
      // GIVEN: an app with default language not in supported array
      // WHEN: default is 'en-US' but supported array only contains fr-FR and es-ES
      // THEN: it should fail validation - default language must be in supported array
      const schemaPromise = startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'fr-FR', label: 'Français', direction: 'ltr' },
            { code: 'es-ES', label: 'Español', direction: 'ltr' },
          ],
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [],
          },
        ],
      })
      await expect(schemaPromise).rejects.toThrow(/default language must be in supported array/)
    }
  )

  test.fixme(
    'APP-LANGUAGES-012: should fail validation - fallback language must be in supported array',
    { tag: '@spec' },
    async ({ startServerWithSchema }) => {
      // GIVEN: an app with fallback not in supported array
      // WHEN: fallback is 'de-DE' but supported array doesn't contain it
      // THEN: it should fail validation - fallback language must be in supported array
      const schemaPromise = startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [{ code: 'en-US', label: 'English', direction: 'ltr' }],
          fallback: 'de-DE',
        },
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [],
          },
        ],
      })
      await expect(schemaPromise).rejects.toThrow(/fallback language must be in supported array/)
    }
  )

  test.fixme(
    'APP-LANGUAGES-013: should automatically use default language as fallback',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an app without explicit fallback
      // WHEN: fallback property is omitted
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English', direction: 'ltr' },
            { code: 'fr-FR', label: 'Français', direction: 'ltr' },
          ],
        },
        blocks: [
          {
            name: 'language-switcher',
            type: 'language-switcher',
            props: {
              variant: 'dropdown',
            },
          },
        ],
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                block: 'language-switcher',
              },
            ],
          },
        ],
      })

      // THEN: it should automatically use default language as fallback
      await page.goto('/')
      const fallbackLanguage = await page.evaluate(() => (window as any).APP_LANGUAGES?.fallback)
      expect(fallbackLanguage).toBe('en-US')
    }
  )

  test.fixme(
    'APP-LANGUAGES-014: should show English text when French translation is missing',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an app with fallback different from default
      // WHEN: default is 'fr-FR' and fallback is 'en-US'
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'fr-FR',
          supported: [
            { code: 'fr-FR', label: 'Français', direction: 'ltr' },
            { code: 'en-US', label: 'English', direction: 'ltr' },
          ],
          fallback: 'en-US',
        },
        blocks: [
          {
            name: 'language-switcher',
            type: 'language-switcher',
            props: {
              variant: 'dropdown',
            },
          },
        ],
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                block: 'language-switcher',
              },
            ],
          },
        ],
      })

      // THEN: it should show English text when French translation is missing
      await page.goto('/')
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('Français')

      // Verify fallback is configured correctly (not same as default)
      const fallbackLanguage = await page.evaluate(() => (window as any).APP_LANGUAGES?.fallback)
      expect(fallbackLanguage).toBe('en-US')
      const defaultLanguage = await page.evaluate(() => (window as any).APP_LANGUAGES?.default)
      expect(defaultLanguage).toBe('fr-FR')
    }
  )

  test.fixme(
    'APP-LANGUAGES-INTEGRATION-001: should apply RTL-aware theme tokens for Arabic/Hebrew',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a multi-language app with theme integration
      await startServerWithSchema({
        name: 'test-app',
        theme: {
          spacing: { sm: '8px', md: '16px' },
          colors: { primary: '#007bff' },
        },
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English', direction: 'ltr' },
            { code: 'fr-FR', label: 'Français', direction: 'ltr' },
            { code: 'ar-SA', label: 'العربية', direction: 'rtl' },
          ],
        },
        blocks: [
          {
            name: 'language-switcher',
            type: 'language-switcher',
            props: {
              variant: 'dropdown',
            },
          },
        ],
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                block: 'language-switcher',
              },
            ],
          },
        ],
      })

      // THEN: it should apply RTL-aware theme tokens
      await page.goto('/')
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')

      // Switch to Arabic
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-ar-SA"]').click()
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')

      // Verify theme applies RTL-aware spacing
      const themeDirection = await page.evaluate(() => (window as any).APP_THEME?.direction)
      expect(themeDirection).toBe('rtl')
    }
  )

  test.fixme(
    'APP-LANGUAGES-INTEGRATION-002: should update page metadata and content while maintaining state',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a multi-language app with page content
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English', direction: 'ltr' },
            { code: 'fr-FR', label: 'Français', direction: 'ltr' },
          ],
        },
        blocks: [
          {
            name: 'language-switcher',
            type: 'language-switcher',
            props: {
              variant: 'dropdown',
            },
          },
        ],
        pages: [
          {
            path: '/',
            meta: {
              lang: 'en-US',
              title: 'Home',
              description: 'Welcome',
              i18n: {
                'fr-FR': { title: 'Accueil', description: 'Bienvenue' },
              },
            },
            sections: [
              {
                block: 'language-switcher',
              },
              { type: 'text', content: 'Hello', i18n: { 'fr-FR': { content: 'Bonjour' } } },
            ],
          },
        ],
      })

      // THEN: it should update metadata and content while maintaining state
      await page.goto('/')
      await expect(page).toHaveTitle('Home')
      await expect(page.locator('text=Hello')).toBeVisible()

      // Switch to French
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-fr-FR"]').click()

      // Verify metadata updated
      await expect(page).toHaveTitle('Accueil')
      await expect(page.locator('html')).toHaveAttribute('lang', 'fr-FR')

      // Verify content updated
      await expect(page.locator('text=Bonjour')).toBeVisible()

      // Verify scroll position maintained (not jumped to top)
      const scrollY = await page.evaluate(() => window.scrollY)
      expect(scrollY).toBe(0) // Should still be at top since we didn't scroll
    }
  )

  test.fixme(
    'APP-LANGUAGES-015: should resolve translation keys from centralized translations dictionary',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an app with centralized translations and components using $t: references
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English', direction: 'ltr' },
            { code: 'fr-FR', label: 'Français', direction: 'ltr' },
          ],
          translations: {
            'en-US': { 'common.save': 'Save' },
            'fr-FR': { 'common.save': 'Enregistrer' },
          },
        },
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            sections: [{ type: 'button', children: ['$t:common.save'] }],
          },
        ],
      })

      // WHEN: component content uses $t:key syntax
      await page.goto('/')

      // THEN: it should resolve translation keys from centralized translations dictionary
      await expect(page.locator('button')).toHaveText('Save')

      // Switch to French
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-fr-FR"]').click()
      await expect(page.locator('button')).toHaveText('Enregistrer')
    }
  )

  test.fixme(
    'APP-LANGUAGES-016: should fall back to default language translation',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an app with centralized translations and a missing translation key
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          fallback: 'en-US',
          supported: [
            { code: 'en-US', label: 'English', direction: 'ltr' },
            { code: 'fr-FR', label: 'Français', direction: 'ltr' },
          ],
          translations: {
            'en-US': {
              'common.save': 'Save',
              'common.cancel': 'Cancel',
            },
            'fr-FR': {
              'common.save': 'Enregistrer',
              // 'common.cancel' is missing - will fall back to English
            },
          },
        },
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'fr-FR', title: 'Test' },
            sections: [
              { type: 'button', children: ['$t:common.save'] },
              { type: 'button', children: ['$t:common.cancel'] },
            ],
          },
        ],
      })

      // WHEN: $t:key reference doesn't exist in current language
      await page.goto('/')

      // THEN: it should fall back to default language translation
      const buttons = page.locator('button')
      await expect(buttons.nth(0)).toHaveText('Enregistrer') // French exists
      await expect(buttons.nth(1)).toHaveText('Cancel') // Falls back to English
    }
  )

  test.fixme(
    'APP-LANGUAGES-018: should organize translations by feature and improve maintainability',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: an app with organized namespace structure in centralized translations
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [{ code: 'en-US', label: 'English', direction: 'ltr' }],
          translations: {
            'en-US': {
              'common.save': 'Save',
              'common.cancel': 'Cancel',
              'nav.home': 'Home',
              'nav.about': 'About',
              'homepage.hero.title': 'Welcome',
              'homepage.hero.cta': 'Get Started',
              'errors.404': 'Not Found',
              'errors.500': 'Server Error',
            },
          },
        },
        pages: [
          {
            name: 'Homepage',
            path: '/',
            meta: { lang: 'en-US', title: 'Test' },
            sections: [
              { type: 'nav', children: [{ type: 'a', children: ['$t:nav.home'] }] },
              { type: 'h1', children: ['$t:homepage.hero.title'] },
              { type: 'button', children: ['$t:common.save'] },
              { type: 'div', children: ['$t:errors.404'] },
            ],
          },
        ],
      })

      // WHEN: translations use namespaces (common.*, nav.*, homepage.*, errors.*)
      await page.goto('/')

      // THEN: it should organize translations by feature and improve maintainability
      await expect(page.locator('nav a')).toHaveText('Home')
      await expect(page.locator('h1')).toHaveText('Welcome')
      await expect(page.locator('button')).toHaveText('Save')
      await expect(page.locator('div').filter({ hasText: 'Not Found' })).toBeVisible()
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full languages workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application configured with representative multi-language setup
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English', direction: 'ltr', flag: '🇺🇸' },
            { code: 'fr-FR', label: 'Français', direction: 'ltr', flag: '🇫🇷' },
            { code: 'ar-SA', label: 'العربية', direction: 'rtl', flag: '🇸🇦' },
          ],
          fallback: 'en-US',
          detectBrowser: false,
          persistSelection: true,
        },
        blocks: [
          {
            name: 'language-switcher',
            type: 'language-switcher',
            props: {
              variant: 'dropdown',
            },
          },
        ],
        pages: [
          {
            name: 'home',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test page' },
            sections: [
              {
                block: 'language-switcher',
              },
            ],
          },
        ],
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.goto('/')

      // Verify default language loads
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('English')

      // Verify language switching works
      await page.locator('[data-testid="language-switcher"]').click()
      await expect(page.locator('[data-testid="language-option"]')).toHaveCount(3)

      // Switch to French and verify
      await page.locator('[data-testid="language-option-fr-FR"]').click()
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('Français')

      // Verify persistence (reload check)
      await page.reload()
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('Français')

      // Switch to Arabic and verify RTL direction
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-ar-SA"]').click()
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('العربية')

      // Focus on workflow continuity, not exhaustive coverage
    }
  )
})
