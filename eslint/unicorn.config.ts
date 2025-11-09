/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Linter } from 'eslint'
import unicorn from 'eslint-plugin-unicorn'

export default [
  // Code Quality - eslint-plugin-unicorn (curated rules)
  // Cherry-picked rules that complement existing FP/architecture enforcement
  {
    files: ['**/*.{ts,tsx,mts,cts,js,jsx}'],
    ignores: ['*.config.ts', '**/*.config.ts'], // Exclude config files
    plugins: {
      unicorn,
    },
    rules: {
      // Prefer undefined over null (aligns with FP patterns)
      'unicorn/no-null': 'error',

      // Use node: protocol for built-in imports (modern best practice)
      'unicorn/prefer-node-protocol': 'error',

      // Consistent function scoping for better organization
      'unicorn/consistent-function-scoping': 'error',

      // Disable nested ternary rule - conflicts with Prettier formatting
      // Prettier removes parentheses that this rule requires, creating an infinite loop
      'unicorn/no-nested-ternary': 'off',

      // Prefer switch over multiple if/else (readability)
      'unicorn/prefer-switch': ['warn', { minimumCases: 3 }],

      // Cleaner Promise usage
      'unicorn/no-useless-promise-resolve-reject': 'error',

      // Better error handling patterns
      'unicorn/prefer-type-error': 'error',

      // Numeric separators for readability (1_000_000 vs 1000000)
      'unicorn/numeric-separators-style': [
        'warn',
        {
          onlyIfContainsSeparator: false,
          number: {
            minimumDigits: 5,
            groupLength: 3,
          },
        },
      ],

      // Throw errors, not primitives
      'unicorn/throw-new-error': 'off', // Conflicts with functional/no-throw-statements

      // Prefer Set#has() over Array#includes() for performance
      'unicorn/prefer-set-has': 'warn',

      // Prefer modern Array methods
      'unicorn/prefer-array-flat': 'error',
      'unicorn/prefer-array-flat-map': 'error',

      // Better string methods
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/prefer-string-trim-start-end': 'error',

      // File naming conventions are now enforced by check-file plugin (see below)
      // Removed: 'unicorn/filename-case' - replaced with eslint-plugin-check-file
    },
  },
] satisfies Linter.Config[]
