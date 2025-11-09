/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Linter } from 'eslint'

export default [
  // Test files - Allow 'any' for testing flexibility
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', 'specs/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Allow 'any' in tests for testing invalid inputs
      '@typescript-eslint/naming-convention': 'off', // Allow flexible naming in tests
      'no-restricted-syntax': 'off', // Allow mutations in tests for setup/mocking
      'no-param-reassign': 'off', // Allow parameter reassignment in test setup
      'functional/no-expression-statements': 'off', // Allow test assertions and setup
      'functional/no-let': 'off', // Allow let in test setup
      'functional/immutable-data': 'off', // Allow mutations in test setup
      'functional/prefer-immutable-types': 'off', // Allow mutable types in tests
      'functional/no-throw-statements': 'off', // Allow throwing in tests
      'unicorn/no-null': 'off', // Allow null in tests for edge cases
      // Size limits relaxed for test files (comprehensive test suites can be longer)
      'max-lines': ['warn', { max: 800, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['warn', { max: 100, skipBlankLines: true, skipComments: true }],
      'max-statements': 'off', // Test setup can have many statements
      complexity: 'off', // Test scenarios can be complex
    },
  },

  // E2E Tests - Must use Playwright (not Bun Test)
  // Enforces testing strategy: E2E tests in specs/ directory use Playwright
  {
    files: ['specs/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'bun:test',
              message:
                'E2E tests (in specs/ directory) must use Playwright, not Bun Test. Import from @playwright/test instead. See docs/architecture/testing-strategy.md',
            },
          ],
        },
      ],
    },
  },

  // Unit Tests - Must use Bun Test (not Playwright)
  // Enforces testing strategy: Unit tests (*.test.ts) use Bun Test
  {
    files: ['src/**/*.test.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playwright/test',
              message:
                'Unit tests (*.test.ts) must use Bun Test, not Playwright. Import from bun:test instead. See docs/architecture/testing-strategy.md',
            },
          ],
        },
      ],
    },
  },
] satisfies Linter.Config[]
