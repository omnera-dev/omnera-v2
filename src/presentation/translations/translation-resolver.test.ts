/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { resolveTranslationPattern } from './translation-resolver'

describe('resolveTranslationPattern - Fallback Behavior', () => {
  test('should use translation from current language when it exists', () => {
    const languages = {
      default: 'en-US',
      fallback: 'en-US',
      supported: [
        { code: 'en-US', label: 'English', direction: 'ltr' as const },
        { code: 'fr-FR', label: 'Français', direction: 'ltr' as const },
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
    }

    const result = resolveTranslationPattern('$t:common.save', 'fr-FR', languages)
    expect(result).toBe('Enregistrer')
  })

  test('should fall back to default language when translation is missing in current language', () => {
    const languages = {
      default: 'en-US',
      fallback: 'en-US',
      supported: [
        { code: 'en-US', label: 'English', direction: 'ltr' as const },
        { code: 'fr-FR', label: 'Français', direction: 'ltr' as const },
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
    }

    const result = resolveTranslationPattern('$t:common.cancel', 'fr-FR', languages)
    expect(result).toBe('Cancel')
  })
})
