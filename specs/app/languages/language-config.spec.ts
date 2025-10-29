/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures.ts'

/**
 * E2E Tests for Language Configuration
 *
 * Source: specs/app/languages/language-config.schema.json
 * Spec Count: 8
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (8 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Language Configuration', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-LANG-CONFIG-001: should be valid with LTR direction by default',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a language config for English (en-US)
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            {
              code: 'en-US',
              label: 'English',
            },
          ],
        },
      })

      // WHEN: language is defined with code and label
      await page.goto('/')

      // THEN: it should be valid with LTR direction by default
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('English')
    }
  )

  test.fixme(
    'APP-LANG-CONFIG-002: should support right-to-left text rendering',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a language config for Arabic (ar-SA) with rtl direction
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'ar-SA',
          supported: [
            {
              code: 'ar-SA',
              label: 'العربية',
              direction: 'rtl',
            },
          ],
        },
      })

      // WHEN: language is defined with RTL direction
      await page.goto('/')

      // THEN: it should support right-to-left text rendering
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('العربية')
      await expect(page.locator('body')).toHaveCSS('direction', 'rtl')
    }
  )

  test.fixme(
    'APP-LANG-CONFIG-003: should be valid with 2-letter code',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a language config with 2-letter code (en)
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en',
          supported: [
            {
              code: 'en',
              label: 'English',
            },
          ],
        },
      })

      // WHEN: language code uses ISO 639-1 format without country
      await page.goto('/')

      // THEN: it should be valid
      await expect(page.locator('[data-testid="language-code"]')).toHaveText('en')
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('English')
    }
  )

  test.fixme(
    'APP-LANG-CONFIG-004: should be valid with country-specific format',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a language config with 4-letter code (en-US)
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            {
              code: 'en-US',
              label: 'English (United States)',
            },
          ],
        },
      })

      // WHEN: language code includes country code
      await page.goto('/')

      // THEN: it should be valid with country-specific format
      await expect(page.locator('[data-testid="language-code"]')).toHaveText('en-US')
      await expect(page.locator('html')).toHaveAttribute('lang', 'en-US')
    }
  )

  test.fixme(
    'APP-LANG-CONFIG-005: should display the flag in language switcher',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a language config with flag emoji (🇫🇷)
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'fr-FR',
          supported: [
            {
              code: 'fr-FR',
              label: 'Français',
              direction: 'ltr',
              flag: '🇫🇷',
            },
          ],
        },
      })

      // WHEN: flag is provided as unicode emoji
      await page.goto('/')
      await page.locator('[data-testid="language-switcher"]').click()

      // THEN: it should display the flag in language switcher
      await expect(page.locator('[data-testid="language-flag"]')).toHaveText('🇫🇷')
      await expect(page.locator('[data-testid="language-option-fr-FR"]')).toContainText('🇫🇷')
    }
  )

  test.fixme(
    'APP-LANG-CONFIG-006: should load the flag image from the path',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a language config with flag icon path (/flags/es.svg)
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'es-ES',
          supported: [
            {
              code: 'es-ES',
              label: 'Español',
              direction: 'ltr',
              flag: '/flags/es.svg',
            },
          ],
        },
      })

      // WHEN: flag is provided as file path
      await page.goto('/')
      await page.locator('[data-testid="language-switcher"]').click()

      // THEN: it should load the flag image from the path
      await expect(page.locator('[data-testid="language-flag-img"]')).toHaveAttribute(
        'src',
        '/flags/es.svg'
      )
      await expect(page.locator('[data-testid="language-flag-img"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-LANG-CONFIG-007: should display correctly in all character sets',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a language config with native language label (Français, Español, العربية)
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English' },
            { code: 'fr-FR', label: 'Français' },
            { code: 'es-ES', label: 'Español' },
            { code: 'ar-SA', label: 'العربية', direction: 'rtl' },
            { code: 'zh-CN', label: '中文' },
            { code: 'ja-JP', label: '日本語' },
          ],
        },
      })

      // WHEN: label uses the language's native name
      await page.goto('/')
      await page.locator('[data-testid="language-switcher"]').click()

      // THEN: it should display correctly in all character sets
      await expect(page.locator('[data-testid="language-option-fr-FR"]')).toContainText('Français')
      await expect(page.locator('[data-testid="language-option-es-ES"]')).toContainText('Español')
      await expect(page.locator('[data-testid="language-option-ar-SA"]')).toContainText('العربية')
      await expect(page.locator('[data-testid="language-option-zh-CN"]')).toContainText('中文')
      await expect(page.locator('[data-testid="language-option-ja-JP"]')).toContainText('日本語')
    }
  )

  test.fixme(
    'APP-LANG-CONFIG-008: should use default LTR direction and no flag',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a minimal language config with only code and label
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            {
              code: 'en-US',
              label: 'English',
            },
          ],
        },
      })

      // WHEN: direction and flag are omitted
      await page.goto('/')
      await page.locator('[data-testid="language-switcher"]').click()

      // THEN: it should use default LTR direction and no flag
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
      await expect(page.locator('[data-testid="language-flag"]')).toBeHidden()
      await expect(page.locator('[data-testid="language-option-en-US"]')).toContainText('English')
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full language-config workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application configured with representative language configurations
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            {
              code: 'en-US',
              label: 'English',
              direction: 'ltr',
              flag: '🇺🇸',
            },
            {
              code: 'fr-FR',
              label: 'Français',
              direction: 'ltr',
              flag: '🇫🇷',
            },
            {
              code: 'ar-SA',
              label: 'العربية',
              direction: 'rtl',
              flag: '🇸🇦',
            },
          ],
        },
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.goto('/')

      // Verify default LTR language loads
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('English')

      // Open language switcher and verify all configs
      await page.locator('[data-testid="language-switcher"]').click()
      await expect(page.locator('[data-testid="language-option"]')).toHaveCount(3)

      // Verify flags display
      await expect(page.locator('[data-testid="language-option-en-US"]')).toContainText('🇺🇸')
      await expect(page.locator('[data-testid="language-option-fr-FR"]')).toContainText('🇫🇷')

      // Switch to French (LTR with native label)
      await page.locator('[data-testid="language-option-fr-FR"]').click()
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('Français')
      await expect(page.locator('html')).toHaveAttribute('lang', 'fr-FR')

      // Switch to Arabic (RTL with native label)
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-ar-SA"]').click()
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
      await expect(page.locator('[data-testid="current-language"]')).toHaveText('العربية')

      // Focus on workflow continuity, not exhaustive coverage
    }
  )
})
