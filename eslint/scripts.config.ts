/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Linter } from 'eslint'

export default [
  // Scripts - Allow mutations for build-time utilities
  {
    files: ['scripts/**/*.{js,mjs,cjs,ts}', 'example.ts'],
    rules: {
      '@typescript-eslint/naming-convention': 'off', // Allow flexible naming in scripts
      'no-restricted-syntax': 'off', // Allow mutations in scripts
      'no-param-reassign': 'off', // Allow parameter reassignment in scripts
      'functional/no-expression-statements': 'off', // Scripts need side effects
      'functional/no-let': 'off', // Allow let in scripts
      'functional/immutable-data': 'off', // Allow mutations in scripts
      'functional/prefer-immutable-types': 'off', // Allow mutable types
      'functional/no-loop-statements': 'off', // Allow loops in scripts
      'functional/no-throw-statements': 'off', // Allow throwing in scripts
      'unicorn/no-null': 'off', // Allow null in scripts
      // Scripts can be longer for complex build processes
      'max-lines': ['warn', { max: 600, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      complexity: 'off',
    },
  },
] satisfies Linter.Config[]
