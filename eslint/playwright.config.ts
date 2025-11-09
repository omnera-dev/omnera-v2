/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Linter } from 'eslint'
import playwright from 'eslint-plugin-playwright'

export default [
  // Playwright E2E tests
  {
    ...playwright.configs['flat/recommended'],
    files: ['specs/**'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      '@typescript-eslint/no-explicit-any': 'off', // Allow 'any' in E2E tests
      'functional/no-loop-statements': 'off', // Allow loops in E2E tests
      'functional/no-expression-statements': 'off', // Allow expression statements in E2E tests
      'playwright/no-conditional-in-test': 'off', // Allow conditionals in E2E tests (e.g., checking element existence)
      'playwright/no-conditional-expect': 'off', // Allow conditional expects in E2E tests
      'playwright/expect-expect': 'off', // Allow tests without explicit expects (e.g., testing for no errors)
      'playwright/no-wait-for-timeout': 'off', // Allow waitForTimeout in E2E tests (sometimes needed for animations)
    },
  },
] satisfies Linter.Config[]
