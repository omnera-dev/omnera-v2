import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import boundaries from 'eslint-plugin-boundaries'
import checkFilePlugin from 'eslint-plugin-check-file'
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const functional = functionalPlugin as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const drizzle = drizzlePlugin as any

export default defineConfig([
  // Global ignores
  {
    ignores: [
      '.claude/**',
      'dist/**',
      'node_modules/**',
      '.next/**',
      '.turbo/**',
      'OLD_V1/**', // Legacy codebase - not subject to new architecture rules
    ],
  },

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
      'import/no-cycle': ['error', { maxDepth: 10 }],
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

      // File naming conventions are now enforced by check-file plugin (see below)
      // Removed: 'unicorn/filename-case' - replaced with eslint-plugin-check-file
    },
  },

  // File Naming Conventions - Page Components (PascalCase exception)
  // Must come before the general kebab-case rule
  {
    files: ['src/presentation/components/pages/**/*.{ts,tsx}'],
    plugins: {
      'check-file': checkFilePlugin,
    },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{ts,tsx}': 'PASCAL_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },

  // File Naming Conventions - All other files (kebab-case)
  // Comprehensive enforcement of naming patterns from docs/architecture/file-naming-conventions.md
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    ignores: ['src/presentation/components/pages/**/*.{ts,tsx}'], // Already handled above
    plugins: {
      'check-file': checkFilePlugin,
    },
    rules: {
      // File naming with pattern specificity (specific patterns first)
      'check-file/filename-naming-convention': [
        'error',
        {
          // Error CLASS files ending with -error.ts (not handlers)
          'src/**/errors/*-error.ts': '*-error',

          // Specific patterns for file types
          'src/infrastructure/database/repositories/*.ts': '*-repository',
          'src/infrastructure/layers/*.ts': '*-layer',
          'src/presentation/components/ui/*-variants.ts': '*-variants',
          'src/presentation/hooks/*.{ts,tsx}': 'use-*',
          'src/presentation/components/ui/*-hook.ts': '*-hook',

          // DEFAULT: All other files use kebab-case (must be last)
          '**/*.{ts,tsx,js,jsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],

      // Folder naming: kebab-case for src/ directories only
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/': 'KEBAB_CASE',
        },
      ],
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

  // Layer-based Architecture - Granular boundary enforcement
  // Based on: docs/architecture/layer-based-architecture/13-file-structure.md
  //
  // Dependency Direction: Presentation → Application → Domain ← Infrastructure
  //
  // Key Rules:
  // 1. Presentation depends on Application + Domain (NOT Infrastructure directly)
  // 2. Application depends on Domain + Ports (defines Infrastructure interfaces)
  // 3. Domain depends on NOTHING (pure, self-contained)
  // 4. Infrastructure depends ONLY on Domain + Ports (strict dependency inversion)
  // 5. Feature Isolation: domain/models/table ≠> domain/models/automation (strict)
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
        // ==========================================
        // DOMAIN LAYER - Feature Models (STRICT ISOLATION)
        // ==========================================
        // App model - Root level only (name.ts, description.ts, version.ts, index.ts, tables.ts)
        {
          type: 'domain-model-app',
          pattern: 'src/domain/models/app/*.{ts,tsx}',
          mode: 'file',
        },
        // Feature models - Nested under app/
        {
          type: 'domain-model-table',
          pattern: 'src/domain/models/app/tables/**/*',
          mode: 'file',
        },
        { type: 'domain-model-page', pattern: 'src/domain/models/app/pages/**/*', mode: 'file' },
        {
          type: 'domain-model-automation',
          pattern: 'src/domain/models/app/automations/**/*',
          mode: 'file',
        },

        // DOMAIN LAYER - Shared Utilities
        { type: 'domain-validator', pattern: 'src/domain/validators/**/*', mode: 'file' },
        { type: 'domain-service', pattern: 'src/domain/services/**/*', mode: 'file' },
        { type: 'domain-factory', pattern: 'src/domain/factories/**/*', mode: 'file' },
        { type: 'domain-error', pattern: 'src/domain/errors/**/*', mode: 'file' },

        // ==========================================
        // APPLICATION LAYER - Use Cases (Phase-based)
        // ==========================================
        {
          type: 'application-use-case-server',
          pattern: 'src/application/use-cases/server/**/*',
          mode: 'file',
        },
        {
          type: 'application-use-case-config',
          pattern: 'src/application/use-cases/config/**/*',
          mode: 'file',
        },
        {
          type: 'application-use-case-database',
          pattern: 'src/application/use-cases/database/**/*',
          mode: 'file',
        },
        {
          type: 'application-use-case-auth',
          pattern: 'src/application/use-cases/auth/**/*',
          mode: 'file',
        },
        {
          type: 'application-use-case-routing',
          pattern: 'src/application/use-cases/routing/**/*',
          mode: 'file',
        },
        {
          type: 'application-use-case-automation',
          pattern: 'src/application/use-cases/automation/**/*',
          mode: 'file',
        },
        {
          type: 'application-use-case',
          pattern: 'src/application/use-cases/**/*',
          mode: 'file',
        }, // Fallback

        // APPLICATION LAYER - Ports & Services
        { type: 'application-port', pattern: 'src/application/ports/**/*', mode: 'file' },
        { type: 'application-service', pattern: 'src/application/services/**/*', mode: 'file' },
        { type: 'application-error', pattern: 'src/application/errors/**/*', mode: 'file' },

        // ==========================================
        // INFRASTRUCTURE LAYER - Service Organization
        // ==========================================
        {
          type: 'infrastructure-config',
          pattern: 'src/infrastructure/config/**/*',
          mode: 'file',
        },
        {
          type: 'infrastructure-database',
          pattern: 'src/infrastructure/database/**/*',
          mode: 'file',
        },
        { type: 'infrastructure-auth', pattern: 'src/infrastructure/auth/**/*', mode: 'file' },
        { type: 'infrastructure-email', pattern: 'src/infrastructure/email/**/*', mode: 'file' },
        {
          type: 'infrastructure-storage',
          pattern: 'src/infrastructure/storage/**/*',
          mode: 'file',
        },
        {
          type: 'infrastructure-webhooks',
          pattern: 'src/infrastructure/webhooks/**/*',
          mode: 'file',
        },
        {
          type: 'infrastructure-logging',
          pattern: 'src/infrastructure/logging/**/*',
          mode: 'file',
        },
        { type: 'infrastructure-server', pattern: 'src/infrastructure/server/**/*', mode: 'file' },
        { type: 'infrastructure-css', pattern: 'src/infrastructure/css/**/*', mode: 'file' },
        {
          type: 'infrastructure-service',
          pattern: 'src/infrastructure/services/**/*',
          mode: 'file',
        },
        { type: 'infrastructure-layer', pattern: 'src/infrastructure/layers/**/*', mode: 'file' },

        // ==========================================
        // PRESENTATION LAYER - API vs Components
        // ==========================================
        {
          type: 'presentation-api-route',
          pattern: 'src/presentation/api/routes/**/*',
          mode: 'file',
        },
        {
          type: 'presentation-api-middleware',
          pattern: 'src/presentation/api/middleware/**/*',
          mode: 'file',
        },
        {
          type: 'presentation-component-ui',
          pattern: 'src/presentation/components/ui/**/*',
          mode: 'file',
        },
        { type: 'presentation-util', pattern: 'src/presentation/utils/**/*', mode: 'file' },
      ],
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // ==========================================
            // DOMAIN LAYER - STRICT FEATURE ISOLATION
            // ==========================================

            // App model (root) - Can import feature models for composition
            {
              from: ['domain-model-app'],
              allow: [
                'domain-model-app',
                'domain-model-table',
                'domain-model-page',
                'domain-model-automation',
              ],
              message:
                'App model violation: Can import feature models (table, page, automation) for schema composition.',
            },

            // Feature models - ONLY import from app model (NO CROSS-FEATURE IMPORTS)
            {
              from: ['domain-model-table'],
              allow: ['domain-model-app', 'domain-model-table'],
              message:
                'Table model violation: Can only import from app model. FORBIDDEN: Cannot import from page/automation models (strict feature isolation).',
            },
            {
              from: ['domain-model-page'],
              allow: ['domain-model-app', 'domain-model-page'],
              message:
                'Page model violation: Can only import from app model. FORBIDDEN: Cannot import from table/automation models (strict feature isolation).',
            },
            {
              from: ['domain-model-automation'],
              allow: ['domain-model-app', 'domain-model-automation'],
              message:
                'Automation model violation: Can only import from app model. FORBIDDEN: Cannot import from table/page models (strict feature isolation).',
            },

            // Domain validators - Can import all domain models + other validators
            {
              from: ['domain-validator'],
              allow: [
                'domain-model-app',
                'domain-model-table',
                'domain-model-page',
                'domain-model-automation',
                'domain-validator',
              ],
              message:
                'Domain validator violation: Can only import domain models and other validators. No application/infrastructure dependencies.',
            },

            // Domain services - Can import models, validators, other services
            {
              from: ['domain-service'],
              allow: [
                'domain-model-app',
                'domain-model-table',
                'domain-model-page',
                'domain-model-automation',
                'domain-validator',
                'domain-service',
              ],
              message:
                'Domain service violation: Can only import domain models, validators, and other services. Must remain pure.',
            },

            // Domain factories - Can import models, validators, services, other factories
            {
              from: ['domain-factory'],
              allow: [
                'domain-model-app',
                'domain-model-table',
                'domain-model-page',
                'domain-model-automation',
                'domain-validator',
                'domain-service',
                'domain-factory',
              ],
              message:
                'Domain factory violation: Can only import domain models, validators, services, and other factories.',
            },

            // Domain errors - Can import models only
            {
              from: ['domain-error'],
              allow: [
                'domain-model-app',
                'domain-model-table',
                'domain-model-page',
                'domain-model-automation',
              ],
              message:
                'Domain error violation: Can only import domain models for type definitions.',
            },

            // ==========================================
            // APPLICATION LAYER - USE CASES
            // ==========================================

            // Use cases - Can import domain + ports + other application + infrastructure (Phase 1 pragmatic)
            // TODO(Phase 2): Refactor to use ports pattern for infrastructure dependencies
            {
              from: [
                'application-use-case-server',
                'application-use-case-config',
                'application-use-case-database',
                'application-use-case-auth',
                'application-use-case-routing',
                'application-use-case-automation',
                'application-use-case',
              ],
              allow: [
                // All domain
                'domain-model-app',
                'domain-model-table',
                'domain-model-page',
                'domain-model-automation',
                'domain-validator',
                'domain-service',
                'domain-factory',
                'domain-error',
                // Application layer
                'application-port',
                'application-service',
                'application-error',
                // Other use cases
                'application-use-case-server',
                'application-use-case-config',
                'application-use-case-database',
                'application-use-case-auth',
                'application-use-case-routing',
                'application-use-case-automation',
                'application-use-case',
                // Infrastructure (Phase 1 pragmatic - TODO: refactor to ports)
                'infrastructure-config',
                'infrastructure-database',
                'infrastructure-auth',
                'infrastructure-email',
                'infrastructure-storage',
                'infrastructure-webhooks',
                'infrastructure-logging',
                'infrastructure-server',
                'infrastructure-css',
                'infrastructure-service',
              ],
              message:
                'Use case violation: Can import domain, application, and infrastructure (Phase 1). TODO: Refactor to use ports pattern for cleaner dependency inversion.',
            },

            // Application ports - Can import domain only (interface definitions)
            {
              from: ['application-port'],
              allow: [
                'domain-model-app',
                'domain-model-table',
                'domain-model-page',
                'domain-model-automation',
                'domain-validator',
                'domain-service',
                'domain-factory',
                'domain-error',
              ],
              message:
                'Port violation: Can only import domain models and errors for interface definitions. Keep ports lightweight.',
            },

            // Application services - Can import domain + ports + use-cases + infrastructure (utilities)
            {
              from: ['application-service'],
              allow: [
                'domain-model-app',
                'domain-model-table',
                'domain-model-page',
                'domain-model-automation',
                'domain-validator',
                'domain-service',
                'domain-factory',
                'domain-error',
                'application-port',
                'application-error',
                'application-service',
                // Allow use-cases for cross-cutting utilities
                'application-use-case-server',
                'application-use-case-config',
                'application-use-case-database',
                'application-use-case-auth',
                'application-use-case-routing',
                'application-use-case-automation',
                'application-use-case',
                // Allow infrastructure for utility services
                'infrastructure-config',
                'infrastructure-database',
                'infrastructure-auth',
                'infrastructure-email',
                'infrastructure-storage',
                'infrastructure-webhooks',
                'infrastructure-logging',
                'infrastructure-server',
                'infrastructure-css',
                'infrastructure-service',
              ],
              message:
                'Application service violation: Can import domain, ports, use-cases, and infrastructure. Use for cross-cutting utilities only.',
            },

            // Application errors - Can import domain + use-cases + infrastructure (cross-cutting concern)
            {
              from: ['application-error'],
              allow: [
                // Domain models
                'domain-model-app',
                'domain-model-table',
                'domain-model-page',
                'domain-model-automation',
                'domain-error',
                // Application errors (error classes and handlers can import each other)
                'application-error',
                // Application use-cases (for error type imports)
                'application-use-case-server',
                'application-use-case-config',
                'application-use-case-database',
                'application-use-case-auth',
                'application-use-case-routing',
                'application-use-case-automation',
                'application-use-case',
                // Infrastructure (for error type imports)
                'infrastructure-config',
                'infrastructure-database',
                'infrastructure-auth',
                'infrastructure-email',
                'infrastructure-storage',
                'infrastructure-webhooks',
                'infrastructure-logging',
                'infrastructure-server',
                'infrastructure-css',
                'infrastructure-service',
              ],
              message:
                'Application error violation: Error handlers are cross-cutting concerns. Can import domain models, use-case errors, and infrastructure errors.',
            },

            // ==========================================
            // INFRASTRUCTURE LAYER - STRICT PORTS PATTERN
            // ==========================================

            // Infrastructure services - Can import domain + ports + other infrastructure
            {
              from: [
                'infrastructure-config',
                'infrastructure-database',
                'infrastructure-auth',
                'infrastructure-email',
                'infrastructure-storage',
                'infrastructure-webhooks',
                'infrastructure-logging',
                'infrastructure-server',
                'infrastructure-css',
                'infrastructure-service',
              ],
              allow: [
                'domain-model-app',
                'domain-model-table',
                'domain-model-page',
                'domain-model-automation',
                'domain-validator',
                'domain-service',
                'domain-factory',
                'domain-error',
                'application-port', // ONLY ports, NOT use-cases
                // Allow infrastructure services to import each other
                'infrastructure-config',
                'infrastructure-database',
                'infrastructure-auth',
                'infrastructure-email',
                'infrastructure-storage',
                'infrastructure-webhooks',
                'infrastructure-logging',
                'infrastructure-server',
                'infrastructure-css',
                'infrastructure-service',
              ],
              message:
                'Infrastructure violation: Can only import domain, application/ports, and other infrastructure services. FORBIDDEN: Cannot import use-cases (use ports for dependency inversion).',
            },

            // Infrastructure layers - Special case, can import all infrastructure for Effect Layer composition
            {
              from: ['infrastructure-layer'],
              allow: [
                'domain-model-app',
                'domain-model-table',
                'domain-model-page',
                'domain-model-automation',
                'domain-validator',
                'domain-service',
                'domain-factory',
                'domain-error',
                'application-port',
                'infrastructure-config',
                'infrastructure-database',
                'infrastructure-auth',
                'infrastructure-email',
                'infrastructure-storage',
                'infrastructure-webhooks',
                'infrastructure-logging',
                'infrastructure-server',
                'infrastructure-css',
                'infrastructure-service',
              ],
              message:
                'Infrastructure layer composition: Can import domain, ports, and all infrastructure services for Effect Layer composition.',
            },

            // ==========================================
            // PRESENTATION LAYER
            // ==========================================

            // API routes - Can import use cases, domain, other presentation
            {
              from: ['presentation-api-route'],
              allow: [
                'domain-model-app',
                'domain-model-table',
                'domain-model-page',
                'domain-model-automation',
                'domain-validator',
                'domain-service',
                'domain-factory',
                'domain-error',
                'application-use-case-server',
                'application-use-case-config',
                'application-use-case-database',
                'application-use-case-auth',
                'application-use-case-routing',
                'application-use-case-automation',
                'application-use-case',
                'application-error',
                'presentation-api-middleware',
                'presentation-util',
              ],
              message:
                'API route violation: Can import domain and application use cases. FORBIDDEN: Access infrastructure through use cases, not directly.',
            },

            // API middleware - Can import domain, application errors, other middleware
            {
              from: ['presentation-api-middleware'],
              allow: [
                'domain-model-app',
                'domain-error',
                'application-error',
                'presentation-api-middleware',
                'presentation-util',
              ],
              message:
                'API middleware violation: Can import domain models/errors and application errors. Keep middleware lightweight.',
            },

            // React components - Can import domain, use cases, other components
            {
              from: ['presentation-component-ui'],
              allow: [
                'domain-model-app',
                'domain-model-table',
                'domain-model-page',
                'domain-model-automation',
                'domain-validator',
                'domain-error',
                'application-use-case-server',
                'application-use-case-config',
                'application-use-case-database',
                'application-use-case-auth',
                'application-use-case-routing',
                'application-use-case-automation',
                'application-use-case',
                'application-error',
                'presentation-component-ui',
                'presentation-util',
              ],
              message:
                'Component violation: Can import domain and application use cases. FORBIDDEN: Access infrastructure through use cases, not directly.',
            },

            // Presentation utils - Can import domain only
            {
              from: ['presentation-util'],
              allow: [
                'domain-model-app',
                'domain-model-table',
                'domain-model-page',
                'domain-model-automation',
                'presentation-util',
              ],
              message:
                'Presentation util violation: Can only import domain models and other utils. Keep utilities pure.',
            },
          ],
        },
      ],
    },
  },

  // Effect.ts Domain Layer Restriction - Enforce pure domain layer
  // Domain layer must be pure functions with zero dependencies
  // ALLOWED: Schema from 'effect' (for validation, no side effects)
  // FORBIDDEN: Effect, Context, Layer (side effects and orchestration)
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'effect',
              importNames: ['Effect', 'Context', 'Layer', 'pipe', 'flow'],
              message:
                'Domain layer must be pure - no Effect programs (Effect, Context, Layer) allowed. Use Effect in Application layer (use-cases) for side effects and orchestration. ALLOWED: Schema for validation. See docs/architecture/layer-based-architecture/08-layer-3-domain-layer-business-logic.md',
            },
          ],
          patterns: [
            {
              group: ['effect/Effect', 'effect/Context', 'effect/Layer'],
              message:
                'Domain layer must be pure - no Effect programs allowed. Use Effect in Application layer. See docs/architecture/layer-based-architecture/08-layer-3-domain-layer-business-logic.md',
            },
          ],
        },
      ],
    },
  },

  // Zod Restriction - Forbid Zod usage in src/ (except API models and presentation layer)
  // Project standard: Effect Schema for server validation
  // EXCEPTIONS:
  // - src/domain/models/api allows Zod for OpenAPI/Hono integration
  // - src/presentation allows Zod for client forms (React Hook Form)
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/domain/models/api/**/*.{ts,tsx}', // Exception for API models
      'src/presentation/**/*.{ts,tsx}', // Exception for presentation layer (forms, API routes, OpenAPI)
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'zod',
              message:
                'Zod is restricted in src/ - use Effect Schema for server validation. EXCEPTIONS: Zod is allowed in src/domain/models/api for OpenAPI/Hono integration AND src/presentation for client forms.',
            },
            {
              name: '@hono/zod-validator',
              message:
                'Zod validator is restricted in src/ - use Effect Schema for validation. EXCEPTION: @hono/zod-validator is allowed in src/domain/models/api and src/presentation/api/routes for API validation.',
            },
          ],
        },
      ],
    },
  },

  // Zod Allowed - API models exception
  // API models in src/domain/models/api can use Zod for OpenAPI/Hono integration
  {
    files: ['src/domain/models/api/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off', // Allow Zod and @hono/zod-validator imports
    },
  },

  // Zod Allowed - Presentation layer exception
  // Presentation layer can use Zod for:
  // - Client-side form validation (React Hook Form)
  // - API route validation (@hono/zod-validator)
  // - OpenAPI schema generation
  {
    files: ['src/presentation/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off', // Allow Zod, @hono/zod-validator, @hookform/resolvers
    },
  },

  // Use Case Organization Hints - Suggest phase-based structure
  // Warn when use cases are in flat directory instead of phase subdirectories
  // This is a suggestion, not a hard requirement (warnings, not errors)
  {
    files: ['src/application/use-cases/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'Program',
          message:
            'Consider organizing use cases into phase subdirectories (server/, config/, database/, auth/, routing/, automation/) for better structure. See docs/architecture/layer-based-architecture/13-file-structure.md#phase-based-use-case-organization',
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

  // UI Components - Pragmatic rules for presentation layer
  {
    files: ['src/presentation/**/*.{ts,tsx}'],
    rules: {
      // React components: Allow PascalCase for all functions (internal or exported)
      '@typescript-eslint/naming-convention': [
        'error',
        // Variables: camelCase, UPPER_CASE, or PascalCase
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        // Functions: Allow both camelCase and PascalCase (for React components)
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        // Classes, Interfaces, Types, Enums: PascalCase
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        // Object properties: Allow any format
        {
          selector: 'property',
          format: null,
          leadingUnderscore: 'allow',
        },
      ],

      // UI components need side effects for DOM manipulation
      'functional/no-expression-statements': [
        'warn',
        {
          ignoreVoid: true,
          ignoreCodePattern: [
            // React and DOM patterns
            '.*\\.focus\\(\\)',
            '.*\\.blur\\(\\)',
            '.*\\.scrollIntoView\\(\\)',
            'ref\\.current',
            'event\\.(preventDefault|stopPropagation)',
            'set[A-Z].*', // setState functions
            '.*\\.addEventListener',
            '.*\\.removeEventListener',
            'document\\.',
            'window\\.',
            // Console
            'console\\.',
          ],
        },
      ],

      // UI components work with external libraries that use mutable types
      'functional/prefer-immutable-types': [
        'warn',
        {
          enforcement: 'None', // Disable for UI components
        },
      ],

      // Some UI libraries use null
      'unicorn/no-null': 'warn',

      // UI state management sometimes needs let
      'functional/no-let': 'warn',

      // Some UI patterns need reassignment
      'no-param-reassign': [
        'warn',
        {
          props: true,
          ignorePropertyModificationsFor: ['event', 'e', 'ref', 'acc'],
        },
      ],
    },
  },

  // Infrastructure Layer - Services need side effects
  {
    files: ['src/infrastructure/**/*.{ts,tsx}'],
    rules: {
      // Infrastructure needs side effects for I/O
      'functional/no-expression-statements': [
        'warn',
        {
          ignoreVoid: true,
          ignoreCodePattern: ['console\\.', 'server\\.', 'app\\.', 'Bun\\.'],
        },
      ],

      // External libraries often use mutable types
      'functional/prefer-immutable-types': [
        'warn',
        {
          enforcement: 'ReadonlyShallow',
          ignoreInferredTypes: true,
          ignoreClasses: true,
        },
      ],
    },
  },

  // Test files - Allow 'any' for testing flexibility
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
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
    },
  },

  // E2E Tests - Must use Playwright (not Bun Test)
  // Enforces testing strategy: E2E tests in tests/ directory use Playwright
  {
    files: ['tests/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'bun:test',
              message:
                'E2E tests (in tests/ directory) must use Playwright, not Bun Test. Import from @playwright/test instead. See docs/architecture/testing-strategy.md',
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
