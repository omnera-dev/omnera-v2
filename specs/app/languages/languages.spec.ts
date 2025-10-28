/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../../fixtures.ts'

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

  test.fixme(
    'APP-LANGUAGES-001: should use English as the only available language',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-LANGUAGES-001
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
      })

      // WHEN: app is configured with minimal language setup
      await page.goto('/')

      // THEN: it should use English as the only available language
      await expect(page.locator('[data-testid="language-switcher"]')).toHaveText('English')
      await expect(page.locator('[data-testid="available-languages"]')).toHaveCount(1)
    }
  )

  test.fixme(
    'APP-LANGUAGES-002: should be able to switch between all three languages',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-LANGUAGES-002
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

  test.fixme(
    'APP-LANGUAGES-003: should display the English fallback text',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // Spec ID: APP-LANGUAGES-003
      // GIVEN: an app with default en-US and fallback en-US
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English', direction: 'ltr' },
            { code: 'fr-FR', label: 'Français', direction: 'ltr' },
          ],
          fallback: 'en-US',
        },
      })

      // WHEN: a translation is missing for the current language
      await page.goto('/')
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-fr-FR"]').click()

      // THEN: it should display the English fallback text
      await expect(page.locator('[data-testid="missing-translation-text"]')).toHaveText(
        /English fallback/
      )
    }
  )

  test.fixme(
    "APP-LANGUAGES-004: should automatically detect and set the browser's preferred language",
    { tag: '@spec' },
    async ({ page, startServerWithSchema, context }) => {
      // Spec ID: APP-LANGUAGES-004
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

  test.fixme(
    'APP-LANGUAGES-005: should use the default language without auto-detection',
    { tag: '@spec' },
    async ({ page, startServerWithSchema, context }) => {
      // Spec ID: APP-LANGUAGES-005
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
      // Spec ID: APP-LANGUAGES-006
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
      // Spec ID: APP-LANGUAGES-007
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
      // Spec ID: APP-LANGUAGES-008
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
      // Spec ID: APP-LANGUAGES-009
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
      // Spec ID: APP-LANGUAGES-010
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
