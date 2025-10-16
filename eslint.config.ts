import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import playwright from 'eslint-plugin-playwright'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default defineConfig([
  // Base JavaScript configuration
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },

  // Node.js scripts configuration
  {
    files: ['scripts/**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // TypeScript base configuration
  ...tseslint.configs.recommended,

  // React configuration
  {
    files: ['**/*.{tsx,jsx}'],
    plugins: {
      react,
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
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Discourage manual memoization (React 19 compiler handles this)
      // Note: These are warnings to guide developers, not errors
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'CallExpression[callee.name="useMemo"]',
          message: 'React 19 Compiler handles memoization automatically. Only use useMemo for expensive computations (>100ms). Consider removing if not needed.',
        },
        {
          selector: 'CallExpression[callee.name="useCallback"]',
          message: 'React 19 Compiler stabilizes callbacks automatically. Only use useCallback if passing to memoized child components. Consider removing if not needed.',
        },
        {
          selector: 'CallExpression[callee.object.name="React"][callee.property.name="memo"]',
          message: 'React 19 Compiler optimizes re-renders automatically. Only use React.memo for components with expensive renders. Consider removing if not needed.',
        },
      ],
    },
  },

  // TypeScript and Functional Programming rules
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      // Functional Programming - Prefer const
      'prefer-const': 'error',
      'no-var': 'error',

      // Functional Programming - No mutations
      'no-param-reassign': 'error',
      'prefer-destructuring': ['warn', {
        array: false,
        object: true,
      }],

      // TypeScript strict type safety
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/explicit-function-return-type': 'off', // Type inference is preferred
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Type inference is preferred

      // Effect.ts best practices - Explicit type imports
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
        fixStyle: 'separate-type-imports',
      }],

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
          message: 'Avoid array.splice() - use immutable patterns like array.slice() and spread operator instead',
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
      'no-restricted-imports': ['error', {
        paths: [{
          name: 'effect',
          importNames: ['runSync'],
          message: 'Avoid Effect.runSync in application code. Use Effect.runPromise or provide dependencies via Context/Layer.',
        }],
      }],
    },
  },

  // Layer-based Architecture - Domain Layer restrictions
  {
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@application/*', '@infrastructure/*', '@presentation/*', '../application/*', '../infrastructure/*', '../presentation/*'],
          message: 'Domain layer cannot import from Application, Infrastructure, or Presentation layers. Keep domain pure with no external dependencies.',
        }, {
          group: ['effect'],
          importNames: ['Effect'],
          message: 'Domain layer should contain pure functions only. Avoid Effect imports. Use Effect in Application layer instead.',
        }],
      }],
    },
  },

  // Layer-based Architecture - Application Layer restrictions
  {
    files: ['src/application/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@infrastructure/*', '@presentation/*', '../infrastructure/*', '../presentation/*'],
          message: 'Application layer cannot import from Infrastructure or Presentation layers. Define interfaces (ports) in Application and implement them in Infrastructure.',
        }],
      }],
    },
  },

  // Layer-based Architecture - Infrastructure Layer restrictions
  {
    files: ['src/infrastructure/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@presentation/*', '../presentation/*'],
          message: 'Infrastructure layer cannot import from Presentation layer. Infrastructure implements interfaces defined in Application layer.',
        }],
      }],
    },
  },

  // Test files - Allow 'any' for testing flexibility
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Allow 'any' in tests for testing invalid inputs
      'no-restricted-syntax': 'off', // Allow mutations in tests for setup/mocking
      'no-param-reassign': 'off', // Allow parameter reassignment in test setup
    },
  },

  // Scripts - Allow mutations for build-time utilities
  {
    files: ['scripts/**/*.{js,mjs,cjs,ts}'],
    rules: {
      'no-restricted-syntax': 'off', // Allow mutations in scripts
      'no-param-reassign': 'off', // Allow parameter reassignment in scripts
    },
  },

  // Playwright E2E tests
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      '@typescript-eslint/no-explicit-any': 'off', // Allow 'any' in E2E tests
    },
  },
])
