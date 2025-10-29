/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures.ts'

/**
 * E2E Tests for Component Internationalization
 *
 * Source: specs/app/pages/common/i18n.schema.json
 * Spec Count: 10
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (10 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Component Internationalization', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // One test per spec in schema - defines EXHAUSTIVE acceptance criteria
  // ============================================================================

  test.fixme(
    'APP-I18N-001: should display English text',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a button with English content
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'button',
                i18n: {
                  'en-US': {
                    content: 'Click Me',
                  },
                },
              },
            ],
          },
        ],
        languages: {
          default: 'en-US',
          supported: [{ code: 'en-US', label: 'English' }],
        },
      })

      // WHEN: language is set to en-US
      await page.goto('/')

      // THEN: it should display English text
      await expect(page.locator('button')).toHaveText('Click Me')
    }
  )

  test.fixme(
    'APP-I18N-002: content should update to match the selected language',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a button with translations for en-US, fr-FR, and es-ES
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'button',
                i18n: {
                  'en-US': { content: 'Welcome' },
                  'fr-FR': { content: 'Bienvenue' },
                  'es-ES': { content: 'Bienvenido' },
                },
              },
            ],
          },
        ],
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English' },
            { code: 'fr-FR', label: 'Français' },
            { code: 'es-ES', label: 'Español' },
          ],
        },
      })

      // WHEN: language switches between English, French, and Spanish
      await page.goto('/')
      await expect(page.locator('button')).toHaveText('Welcome')

      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-fr-FR"]').click()

      // THEN: content should update to match the selected language
      await expect(page.locator('button')).toHaveText('Bienvenue')

      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-es-ES"]').click()
      await expect(page.locator('button')).toHaveText('Bienvenido')
    }
  )

  test.fixme(
    'APP-I18N-003: both French content and French aria-label should be applied',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a button with content and props for multiple languages
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'button',
                i18n: {
                  'en-US': {
                    content: 'Get Started',
                    props: { 'aria-label': 'Begin your journey' },
                  },
                  'fr-FR': {
                    content: 'Commencer',
                    props: { 'aria-label': 'Commencez votre voyage' },
                  },
                },
              },
            ],
          },
        ],
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English' },
            { code: 'fr-FR', label: 'Français' },
          ],
        },
      })

      // WHEN: language is set to fr-FR
      await page.goto('/')
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-fr-FR"]').click()

      // THEN: both French content and French aria-label should be applied
      await expect(page.locator('button')).toHaveText('Commencer')
      await expect(page.locator('button')).toHaveAttribute('aria-label', 'Commencez votre voyage')
    }
  )

  test.fixme(
    'APP-I18N-004: should display Arabic content with RTL-specific props',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a heading with translations for RTL language (ar-SA)
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'heading',
                i18n: {
                  'en-US': { content: 'Welcome' },
                  'ar-SA': {
                    content: 'مرحبا',
                    props: { dir: 'rtl', className: 'text-right' },
                  },
                },
              },
            ],
          },
        ],
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English' },
            { code: 'ar-SA', label: 'العربية', direction: 'rtl' },
          ],
        },
      })

      // WHEN: language is set to Arabic
      await page.goto('/')
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-ar-SA"]').click()

      // THEN: it should display Arabic content with RTL-specific props
      await expect(page.locator('h1')).toHaveText('مرحبا')
      await expect(page.locator('h1')).toHaveAttribute('dir', 'rtl')
      await expect(page.locator('h1')).toHaveClass(/text-right/)
    }
  )

  test.fixme(
    'APP-I18N-005: should display German content',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a component with translations for German (de-DE)
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'text',
                i18n: {
                  'en-US': { content: 'Hello World' },
                  'de-DE': { content: 'Hallo Welt' },
                },
              },
            ],
          },
        ],
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English' },
            { code: 'de-DE', label: 'Deutsch' },
          ],
        },
      })

      // WHEN: language is set to de-DE
      await page.goto('/')
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-de-DE"]').click()

      // THEN: it should display German content
      await expect(page.locator('[data-testid="text"]')).toHaveText('Hallo Welt')
    }
  )

  test.fixme(
    'APP-I18N-006: only content should update while props remain unchanged',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a button with only content translations (no props)
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'button',
                props: {
                  className: 'btn-primary',
                  'aria-label': 'Submit form',
                },
                i18n: {
                  'en-US': { content: 'Submit' },
                  'fr-FR': { content: 'Soumettre' },
                },
              },
            ],
          },
        ],
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English' },
            { code: 'fr-FR', label: 'Français' },
          ],
        },
      })

      // WHEN: language switches
      await page.goto('/')
      const button = page.locator('button')
      await expect(button).toHaveText('Submit')
      await expect(button).toHaveClass(/btn-primary/)
      await expect(button).toHaveAttribute('aria-label', 'Submit form')

      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-fr-FR"]').click()

      // THEN: only content should update while props remain unchanged
      await expect(button).toHaveText('Soumettre')
      await expect(button).toHaveClass(/btn-primary/)
      await expect(button).toHaveAttribute('aria-label', 'Submit form')
    }
  )

  test.fixme(
    'APP-I18N-007: className should adjust for text direction (text-left vs text-right)',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a component with language-specific className in props
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'text',
                i18n: {
                  'en-US': {
                    content: 'Left aligned text',
                    props: { className: 'text-left' },
                  },
                  'ar-SA': {
                    content: 'نص محاذاة لليمين',
                    props: { className: 'text-right' },
                  },
                },
              },
            ],
          },
        ],
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English' },
            { code: 'ar-SA', label: 'العربية', direction: 'rtl' },
          ],
        },
      })

      // WHEN: switching between LTR and RTL languages
      await page.goto('/')
      await expect(page.locator('[data-testid="text"]')).toHaveClass(/text-left/)

      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-ar-SA"]').click()

      // THEN: className should adjust for text direction
      await expect(page.locator('[data-testid="text"]')).toHaveClass(/text-right/)
    }
  )

  test.fixme(
    'APP-I18N-008: all form text and accessibility attributes should update',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a form with translations for labels and placeholders
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'form',
                children: [
                  {
                    type: 'input',
                    i18n: {
                      'en-US': {
                        props: {
                          label: 'Email Address',
                          placeholder: 'Enter your email',
                          'aria-label': 'Email input field',
                        },
                      },
                      'fr-FR': {
                        props: {
                          label: 'Adresse e-mail',
                          placeholder: 'Entrez votre e-mail',
                          'aria-label': "Champ de saisie d'e-mail",
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English' },
            { code: 'fr-FR', label: 'Français' },
          ],
        },
      })

      // WHEN: language changes
      await page.goto('/')
      await expect(page.locator('label')).toHaveText('Email Address')
      await expect(page.locator('input')).toHaveAttribute('placeholder', 'Enter your email')

      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-fr-FR"]').click()

      // THEN: all form text and accessibility attributes should update
      await expect(page.locator('label')).toHaveText('Adresse e-mail')
      await expect(page.locator('input')).toHaveAttribute('placeholder', 'Entrez votre e-mail')
      await expect(page.locator('input')).toHaveAttribute('aria-label', "Champ de saisie d'e-mail")
    }
  )

  test.fixme(
    'APP-I18N-009: should support both formats (en and en-US)',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a component with translations for language codes without country (en, fr)
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'text',
                i18n: {
                  en: { content: 'Hello' },
                  fr: { content: 'Bonjour' },
                  'en-US': { content: 'Hello (US)' },
                  'fr-FR': { content: 'Bonjour (FR)' },
                },
              },
            ],
          },
        ],
        languages: {
          default: 'en',
          supported: [
            { code: 'en', label: 'English' },
            { code: 'fr', label: 'Français' },
            { code: 'en-US', label: 'English (US)' },
            { code: 'fr-FR', label: 'Français (FR)' },
          ],
        },
      })

      // WHEN: language code uses 2-letter format
      await page.goto('/')
      await expect(page.locator('[data-testid="text"]')).toHaveText('Hello')

      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-fr"]').click()

      // THEN: it should support both formats (en and en-US)
      await expect(page.locator('[data-testid="text"]')).toHaveText('Bonjour')

      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-en-US"]').click()
      await expect(page.locator('[data-testid="text"]')).toHaveText('Hello (US)')
    }
  )

  test.fixme(
    'APP-I18N-010: all menu items should update to the selected language instantly',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a navigation menu with translations for 5+ languages
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'navigation',
                children: [
                  {
                    type: 'link',
                    i18n: {
                      'en-US': { content: 'Home' },
                      'fr-FR': { content: 'Accueil' },
                      'es-ES': { content: 'Inicio' },
                      'de-DE': { content: 'Startseite' },
                      'it-IT': { content: 'Casa' },
                      'pt-PT': { content: 'Início' },
                    },
                  },
                  {
                    type: 'link',
                    i18n: {
                      'en-US': { content: 'About' },
                      'fr-FR': { content: 'À propos' },
                      'es-ES': { content: 'Acerca de' },
                      'de-DE': { content: 'Über uns' },
                      'it-IT': { content: 'Chi siamo' },
                      'pt-PT': { content: 'Sobre' },
                    },
                  },
                ],
              },
            ],
          },
        ],
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English' },
            { code: 'fr-FR', label: 'Français' },
            { code: 'es-ES', label: 'Español' },
            { code: 'de-DE', label: 'Deutsch' },
            { code: 'it-IT', label: 'Italiano' },
            { code: 'pt-PT', label: 'Português' },
          ],
        },
      })

      // WHEN: user selects from language switcher
      await page.goto('/')
      const links = page.locator('nav a')
      await expect(links.nth(0)).toHaveText('Home')
      await expect(links.nth(1)).toHaveText('About')

      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-fr-FR"]').click()

      // THEN: all menu items should update to the selected language instantly
      await expect(links.nth(0)).toHaveText('Accueil')
      await expect(links.nth(1)).toHaveText('À propos')

      // Test additional languages
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-es-ES"]').click()
      await expect(links.nth(0)).toHaveText('Inicio')
      await expect(links.nth(1)).toHaveText('Acerca de')
    }
  )

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

  test.fixme(
    'APP-I18N-012: per-component i18n should take precedence over $t: reference',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: a component with $t: reference and per-component i18n override
      await startServerWithSchema({
        name: 'test-app',
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English' },
            { code: 'fr-FR', label: 'Français' },
          ],
          translations: {
            'en-US': { 'common.submit': 'Submit' },
            'fr-FR': { 'common.submit': 'Soumettre' },
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'button',
                children: ['$t:common.submit'],
                props: { id: 'generic' },
              },
              {
                type: 'button',
                children: ['$t:common.submit'],
                props: { id: 'payment' },
                i18n: {
                  'en-US': { content: 'Submit Payment' },
                  'fr-FR': { content: 'Soumettre Paiement' },
                },
              },
            ],
          },
        ],
      })

      // WHEN: per-component i18n provides different translation than centralized
      await page.goto('/')

      // THEN: per-component i18n should take precedence over $t: reference
      await expect(page.locator('#generic')).toHaveText('Submit')
      await expect(page.locator('#payment')).toHaveText('Submit Payment')

      // Switch to French
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-fr-FR"]').click()
      await expect(page.locator('#generic')).toHaveText('Soumettre')
      await expect(page.locator('#payment')).toHaveText('Soumettre Paiement')
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE OPTIMIZED test verifying components work together efficiently
  // ============================================================================

  test.fixme(
    'user can complete full i18n workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Application with comprehensive i18n setup
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'heading',
                i18n: {
                  'en-US': { content: 'Welcome' },
                  'fr-FR': { content: 'Bienvenue' },
                  'ar-SA': { content: 'مرحبا', props: { dir: 'rtl' } },
                },
              },
              {
                type: 'button',
                i18n: {
                  'en-US': { content: 'Get Started', props: { 'aria-label': 'Begin' } },
                  'fr-FR': { content: 'Commencer', props: { 'aria-label': 'Commencer' } },
                  'ar-SA': { content: 'ابدأ', props: { 'aria-label': 'ابدأ' } },
                },
              },
            ],
          },
        ],
        languages: {
          default: 'en-US',
          supported: [
            { code: 'en-US', label: 'English' },
            { code: 'fr-FR', label: 'Français' },
            { code: 'ar-SA', label: 'العربية', direction: 'rtl' },
          ],
        },
      })

      // WHEN/THEN: Streamlined workflow testing integration points
      await page.goto('/')

      // Verify English default
      await expect(page.locator('h1')).toHaveText('Welcome')
      await expect(page.locator('button')).toHaveText('Get Started')

      // Switch to French
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-fr-FR"]').click()
      await expect(page.locator('h1')).toHaveText('Bienvenue')
      await expect(page.locator('button')).toHaveText('Commencer')

      // Switch to Arabic with RTL
      await page.locator('[data-testid="language-switcher"]').click()
      await page.locator('[data-testid="language-option-ar-SA"]').click()
      await expect(page.locator('h1')).toHaveText('مرحبا')
      await expect(page.locator('h1')).toHaveAttribute('dir', 'rtl')
      await expect(page.locator('button')).toHaveText('ابدأ')

      // Focus on workflow continuity, not exhaustive coverage
    }
  )
})
