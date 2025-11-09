/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Linter } from 'eslint'
import importPlugin from 'eslint-plugin-import'

export default [
  // Import/Export - eslint-plugin-import
  // Enforce proper import conventions and prevent module resolution issues
  {
    files: ['**/*.{ts,tsx,mts,cts,js,jsx}'],
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: true,
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.mts', '.cts'],
      },
    },
    rules: {
      // Helpful warnings
      'import/no-unresolved': ['error', { ignore: ['^bun:'] }],
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-absolute-path': 'error',
      'import/no-self-import': 'error',
      'import/no-cycle': ['error', { maxDepth: 5 }], // Reduced from 10 to 5 for performance
      'import/no-useless-path-segments': ['error', { noUselessIndex: true }],

      // Module systems
      'import/no-amd': 'error',
      'import/no-commonjs': 'off', // Bun supports CommonJS interop

      // Style guide
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/extensions': [
        'error',
        'never',
        {
          // Forbid file extensions in imports (TypeScript resolves them)
          // Consistent with project conventions in application/domain layers
          pattern: {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
            mts: 'never',
            cts: 'never',
          },
        },
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js built-in modules
            'external', // npm packages
            'internal', // Aliased modules (@/)
            'parent', // Parent imports (../)
            'sibling', // Sibling imports (./)
            'index', // Index imports (./)
            'type', // Type imports
          ],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/newline-after-import': 'error',
      'import/no-named-default': 'error',
      'import/no-anonymous-default-export': [
        'error',
        {
          allowArray: false,
          allowArrowFunction: false,
          allowAnonymousClass: false,
          allowAnonymousFunction: false,
          allowLiteral: false,
          allowObject: false,
        },
      ],
    },
  },
] satisfies Linter.Config[]
