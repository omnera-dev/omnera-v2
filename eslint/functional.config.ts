/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Linter } from 'eslint'
import functionalPlugin from 'eslint-plugin-functional'

// Type workaround for flat config compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const functional = functionalPlugin as any

export default [
  // Functional Programming - eslint-plugin-functional
  // Curated rules that complement existing manual FP rules
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    plugins: {
      functional,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Immutability - Enforce readonly types
      'functional/prefer-immutable-types': [
        'error',
        {
          enforcement: 'ReadonlyShallow',
          ignoreInferredTypes: true,
          ignoreClasses: true,
        },
      ],

      // No let - Stricter than prefer-const (catches re-assignments)
      'functional/no-let': ['error', { allowInForLoopInit: true }],

      // Immutable data - Catches mutations not covered by manual rules
      'functional/immutable-data': [
        'error',
        {
          ignoreClasses: true,
          ignoreImmediateMutation: false,
        },
      ],

      // No throw statements - Align with Effect.ts error handling
      'functional/no-throw-statements': 'error',

      // Prefer map/filter/reduce over loops
      'functional/no-loop-statements': 'warn',

      // No expression statements (allows function calls for side effects)
      'functional/no-expression-statements': [
        'warn',
        {
          ignoreVoid: true,
          ignoreCodePattern: [
            'console\\.log',
            'console\\.error',
            'console\\.warn',
            'console\\.info',
            '.*\\.forEach',
          ],
        },
      ],
    },
  },
] satisfies Linter.Config[]
