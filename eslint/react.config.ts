/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Linter } from 'eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // React configuration
  {
    files: ['**/*.{tsx,jsx}'],
    plugins: {
      react,
      // @ts-expect-error - react-hooks plugin has incompatible types with ESLint flat config
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: {
        version: '19.2.0',
      },
    },
    rules: {
      // React 19 Compiler - Trust automatic optimizations
      'react/jsx-no-useless-fragment': 'warn',
      'react/self-closing-comp': 'warn',

      // React Hooks Rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Refresh (Fast Refresh)
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Discourage manual memoization (React 19 compiler handles this)
      // Note: These are warnings to guide developers, not errors
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'CallExpression[callee.name="useMemo"]',
          message:
            'React 19 Compiler handles memoization automatically. Only use useMemo for expensive computations (>100ms). Consider removing if not needed.',
        },
        {
          selector: 'CallExpression[callee.name="useCallback"]',
          message:
            'React 19 Compiler stabilizes callbacks automatically. Only use useCallback if passing to memoized child components. Consider removing if not needed.',
        },
        {
          selector: 'CallExpression[callee.object.name="React"][callee.property.name="memo"]',
          message:
            'React 19 Compiler optimizes re-renders automatically. Only use React.memo for components with expensive renders. Consider removing if not needed.',
        },
      ],
    },
  },
] satisfies Linter.Config[]
