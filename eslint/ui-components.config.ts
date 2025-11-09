/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Linter } from 'eslint'

export default [
  // UI Components - Pragmatic rules for presentation layer
  {
    files: ['src/presentation/**/*.{ts,tsx}'],
    rules: {
      // React components: Allow PascalCase for all functions (internal or exported)
      '@typescript-eslint/naming-convention': [
        'error',
        // Variables: camelCase, UPPER_CASE, or PascalCase
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        // Functions: Allow both camelCase and PascalCase (for React components)
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        // Classes, Interfaces, Types, Enums: PascalCase
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        // Object properties: Allow any format
        {
          selector: 'property',
          format: null,
          leadingUnderscore: 'allow',
        },
      ],

      // UI components need side effects for DOM manipulation
      'functional/no-expression-statements': [
        'warn',
        {
          ignoreVoid: true,
          ignoreCodePattern: [
            // React and DOM patterns
            '.*\\.focus\\(\\)',
            '.*\\.blur\\(\\)',
            '.*\\.scrollIntoView\\(\\)',
            'ref\\.current',
            'event\\.(preventDefault|stopPropagation)',
            'set[A-Z].*', // setState functions
            '.*\\.addEventListener',
            '.*\\.removeEventListener',
            'document\\.',
            'window\\.',
            // Console
            'console\\.',
          ],
        },
      ],

      // UI components work with external libraries that use mutable types
      'functional/prefer-immutable-types': [
        'warn',
        {
          enforcement: 'None', // Disable for UI components
        },
      ],

      // Some UI libraries use null
      'unicorn/no-null': 'warn',

      // UI state management sometimes needs let
      'functional/no-let': 'warn',

      // Some UI patterns need reassignment
      'no-param-reassign': [
        'warn',
        {
          props: true,
          ignorePropertyModificationsFor: ['event', 'e', 'ref', 'acc'],
        },
      ],
    },
  },
] satisfies Linter.Config[]
