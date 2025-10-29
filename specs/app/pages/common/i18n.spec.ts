/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Centralized Internationalization
 *
 * Source: specs/app/pages/common/i18n.schema.json
 * Spec Count: 1 (per-component i18n deprecated - only centralized tests remain)
 *
 * DEPRECATED NOTICE:
 * Per-component i18n is DEPRECATED in v0.1.1 and will be removed in v0.2.0.
 * Use centralized translations with $t: references instead.
 *
 * Removed specs (tested deprecated per-component pattern):
 * - APP-I18N-001 through APP-I18N-010
 * - APP-I18N-012 (hybrid precedence test)
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (1 test) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Centralized Internationalization ($t: pattern)', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-I18N-011: all components should display the same translated text without duplication',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: multiple components using the same $t: reference key
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English' },
            { code: 'fr-FR', label: 'Français' },
          ],
          translations: {
            'en-US': { 'common.save': 'Save' },
            'fr-FR': { 'common.save': 'Enregistrer' },
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              { type: 'button', children: ['$t:common.save'], props: { id: 'btn1' } },
              { type: 'button', children: ['$t:common.save'], props: { id: 'btn2' } },
              { type: 'button', children: ['$t:common.save'], props: { id: 'btn3' } },
            ],
          },
        ],
      })

      // WHEN: components share common translations (e.g., $t:common.save)
      await page.goto('/')

      // THEN: all components should display the same translated text without duplication
      await expect(page.locator('#btn1')).toHaveText('Save')
      await expect(page.locator('#btn2')).toHaveText('Save')
      await expect(page.locator('#btn3')).toHaveText('Save')

      // Switch to French - all buttons update
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-fr-FR"]').click()
      await expect(page.locator('#btn1')).toHaveText('Enregistrer')
      await expect(page.locator('#btn2')).toHaveText('Enregistrer')
      await expect(page.locator('#btn3')).toHaveText('Enregistrer')
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE optimized workflow test - validates core integration efficiently
  // ============================================================================

  test.fixme(
    'REGRESSION: centralized translations work across entire application',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // Comprehensive regression test for centralized i18n
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English' },
            { code: 'fr-FR', label: 'Français' },
          ],
          translations: {
            'en-US': {
              'common.save': 'Save',
              'common.cancel': 'Cancel',
              'nav.home': 'Home',
              'forms.email.placeholder': 'Enter your email',
            },
            'fr-FR': {
              'common.save': 'Enregistrer',
              'common.cancel': 'Annuler',
              'nav.home': 'Accueil',
              'forms.email.placeholder': 'Entrez votre e-mail',
            },
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              { type: 'button', children: ['$t:common.save'] },
              { type: 'button', children: ['$t:common.cancel'] },
              { type: 'a', children: ['$t:nav.home'] },
              {
                type: 'input',
                props: { placeholder: '$t:forms.email.placeholder', type: 'email' },
              },
            ],
          },
        ],
      })

      await page.goto('/')

      // Verify English translations
      await expect(page.locator('button').first()).toHaveText('Save')
      await expect(page.locator('button').last()).toHaveText('Cancel')
      await expect(page.locator('a')).toHaveText('Home')
      await expect(page.locator('input[type="email"]')).toHaveAttribute(
        'placeholder',
        'Enter your email'
      )

      // Switch to French
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-fr-FR"]').click()

      // Verify French translations
      await expect(page.locator('button').first()).toHaveText('Enregistrer')
      await expect(page.locator('button').last()).toHaveText('Annuler')
      await expect(page.locator('a')).toHaveText('Accueil')
      await expect(page.locator('input[type="email"]')).toHaveAttribute(
        'placeholder',
        'Entrez votre e-mail'
      )
    }
  )
})
