/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Linter } from 'eslint'
import tseslint from 'typescript-eslint'

export default [
  // TypeScript base configuration
  ...tseslint.configs.recommended,

  // TypeScript and Functional Programming rules
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    ignores: ['*.config.ts', '**/*.config.ts'], // Exclude config files from naming rules
    rules: {
      // Functional Programming - Prefer const
      'prefer-const': 'error',
      'no-var': 'error',

      // Functional Programming - No mutations
      'no-param-reassign': 'error',
      'prefer-destructuring': [
        'warn',
        {
          array: false,
          object: true,
        },
      ],

      // TypeScript strict type safety
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off', // Type inference is preferred
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Type inference is preferred

      // Effect.ts best practices - Explicit type imports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports',
        },
      ],

      // Code Naming Conventions - Enforce consistent naming patterns
      '@typescript-eslint/naming-convention': [
        'error',
        // Variables: camelCase or SCREAMING_SNAKE_CASE or PascalCase (for Effect constants)
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow', // Allow _private
        },
        // Functions: camelCase
        {
          selector: 'function',
          format: ['camelCase'],
        },
        // Classes, Interfaces, Types, Enums: PascalCase
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        // React components: PascalCase for exported functions
        // Note: Can't distinguish JSX-returning functions, so allow both
        {
          selector: 'function',
          modifiers: ['exported'],
          format: ['PascalCase', 'camelCase'],
        },
        // Object properties: Allow any format for external APIs, CSS, HTTP headers
        {
          selector: 'property',
          format: null,
          leadingUnderscore: 'allow',
        },
      ],

      // Immutability patterns
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.property.name="push"]',
          message: 'Avoid array.push() - use immutable patterns like [...array, item] instead',
        },
        {
          selector: 'CallExpression[callee.property.name="pop"]',
          message: 'Avoid array.pop() - use immutable patterns like array.slice(0, -1) instead',
        },
        {
          selector: 'CallExpression[callee.property.name="shift"]',
          message: 'Avoid array.shift() - use immutable patterns like array.slice(1) instead',
        },
        {
          selector: 'CallExpression[callee.property.name="unshift"]',
          message: 'Avoid array.unshift() - use immutable patterns like [item, ...array] instead',
        },
        {
          selector: 'CallExpression[callee.property.name="splice"]',
          message:
            'Avoid array.splice() - use immutable patterns like array.slice() and spread operator instead',
        },
        {
          selector: 'CallExpression[callee.property.name="reverse"]',
          message: 'Avoid array.reverse() - use [...array].reverse() to avoid mutation',
        },
        {
          selector: 'CallExpression[callee.property.name="sort"]',
          message: 'Avoid array.sort() - use [...array].sort() to avoid mutation',
        },
      ],

      // Effect.ts patterns - No direct Effect.runSync in business logic
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'effect',
              importNames: ['runSync'],
              message:
                'Avoid Effect.runSync in application code. Use Effect.runPromise or provide dependencies via Context/Layer.',
            },
          ],
        },
      ],
    },
  },
] satisfies Linter.Config[]
