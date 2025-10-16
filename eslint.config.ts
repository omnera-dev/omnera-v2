import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import boundaries from 'eslint-plugin-boundaries'
// @ts-expect-error - Plugin lacks proper TypeScript definitions for flat config
import drizzlePlugin from 'eslint-plugin-drizzle'
import functionalPlugin from 'eslint-plugin-functional'
import importPlugin from 'eslint-plugin-import'
import playwright from 'eslint-plugin-playwright'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Type workaround for flat config compatibility
const functional = functionalPlugin as any
const drizzle = drizzlePlugin as any

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
  tseslint.configs.recommended,

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

  // TypeScript and Functional Programming rules
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
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
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-absolute-path': 'error',
      'import/no-self-import': 'error',
      'import/no-cycle': ['error', { maxDepth: 10 }],
      'import/no-useless-path-segments': ['error', { noUselessIndex: true }],

      // Module systems
      'import/no-amd': 'error',
      'import/no-commonjs': 'off', // Bun supports CommonJS interop

      // Style guide
      'import/first': 'error',
      'import/no-duplicates': 'error',
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

  // Code Quality - eslint-plugin-unicorn (curated rules)
  // Cherry-picked rules that complement existing FP/architecture enforcement
  {
    files: ['**/*.{ts,tsx,mts,cts,js,jsx}'],
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

      // Prevent deeply nested ternaries (readability)
      'unicorn/no-nested-ternary': 'warn',

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
    },
  },

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

  // Layer-based Architecture - Automated boundary enforcement
  // Based on: docs/architecture/layer-based-architecture.md
  //
  // Dependency Direction: Presentation → Application → Domain ← Infrastructure
  //
  // Rules:
  // 1. Presentation depends on Application + Domain (NOT Infrastructure directly)
  // 2. Application depends on Domain + Infrastructure (defines interfaces/ports)
  // 3. Domain depends on NOTHING (pure, self-contained)
  // 4. Infrastructure depends on Domain (implements Application interfaces)
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      boundaries,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      'boundaries/include': ['src/**/*'],
      'boundaries/ignore': ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      'boundaries/elements': [
        // Domain Layer - Pure business logic (models, services, validators, factories, errors)
        {
          type: 'domain',
          pattern: 'src/domain/**/*',
          mode: 'file',
        },

        // Application Layer - Use cases, ports (interfaces), errors
        {
          type: 'application',
          pattern: 'src/application/**/*',
          mode: 'file',
        },

        // Infrastructure Layer - Repositories, logging, email, layers
        {
          type: 'infrastructure',
          pattern: 'src/infrastructure/**/*',
          mode: 'file',
        },

        // Presentation Layer - Components (React), API routes (Hono)
        {
          type: 'presentation',
          pattern: 'src/presentation/**/*',
          mode: 'file',
        },
      ],
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // Presentation Layer Rules
            // Can import: Application (use cases), Domain (models, validators)
            // Cannot import: Infrastructure (must go through Application layer)
            {
              from: ['presentation'],
              allow: ['application', 'domain'],
              message:
                'Presentation layer violation: Can only import from Application and Domain layers. Access Infrastructure through Application layer use cases.',
            },

            // Application Layer Rules
            // Can import: Domain (models, validators), Infrastructure (to define interfaces)
            // Cannot import: Presentation
            {
              from: ['application'],
              allow: ['domain', 'infrastructure'],
              message:
                'Application layer violation: Can only import from Domain and Infrastructure layers. Application defines interfaces that Infrastructure implements.',
            },

            // Domain Layer Rules
            // Can import: NOTHING (must remain pure and self-contained)
            // Cannot import: Any other layer
            {
              from: ['domain'],
              allow: [],
              message:
                'Domain layer violation: Domain must remain pure with zero external dependencies. No side effects, I/O, or external calls allowed.',
            },

            // Infrastructure Layer Rules
            // Can import: Domain (to implement business logic)
            // Cannot import: Presentation, Application
            // Note: Infrastructure implements interfaces defined in Application, but doesn't import Application
            {
              from: ['infrastructure'],
              allow: ['domain'],
              message:
                'Infrastructure layer violation: Can only import from Domain layer. Infrastructure implements interfaces defined by Application layer.',
            },
          ],
        },
      ],
    },
  },

  // Drizzle ORM - Safety rules to prevent catastrophic database operations
  // Enforces WHERE clauses in DELETE and UPDATE to prevent accidental mass operations
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      drizzle,
    },
    rules: {
      // Prevent accidental deletion of all rows - require WHERE clause
      'drizzle/enforce-delete-with-where': 'error',

      // Prevent accidental update of all rows - require WHERE clause
      'drizzle/enforce-update-with-where': 'error',
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
