# ESLint Code Linter

## Overview

**Version**: 9.37.0
**Purpose**: Static code analysis tool that identifies and catches potential bugs, code quality issues, and enforces coding standards

## What ESLint Provides

1. **Bug Detection** - Catches logic errors TypeScript's type system misses (unused variables, unreachable code, etc.)
2. **Code Quality Rules** - Enforces best practices and identifies anti-patterns
3. **Consistency Enforcement** - Ensures coding standards across the codebase
4. **TypeScript Integration** - Type-aware linting via typescript-eslint v8.46.1
5. **Auto-Fixing** - Many issues can be automatically fixed with `--fix` flag

## ESLint v9 Features

- New flat configuration system (eslint.config.ts)
- Improved TypeScript support via typescript-eslint v8
- Better performance and more intuitive configuration
- Unified package for TypeScript ESLint integration

## ESLint vs Other Tools

| Tool                 | Purpose                     | What It Catches                                                       | Auto-Fix               | When to Run                       |
| -------------------- | --------------------------- | --------------------------------------------------------------------- | ---------------------- | --------------------------------- |
| **ESLint**           | Code quality & logic errors | Unused variables, logic bugs, anti-patterns, best practice violations | Partial (many rules)   | Before commits, during dev, CI/CD |
| **TypeScript (tsc)** | Type checking               | Type mismatches, missing properties, incorrect function calls         | No                     | Before commits, CI/CD             |
| **Prettier**         | Code formatting             | Style inconsistencies, formatting issues                              | Yes (full)             | Before commits, on save           |
| **Knip**             | Dead code detection         | Unused files, exports, dependencies                                   | Partial (exports only) | Weekly, before releases           |

## Why ESLint is Complementary

- **TypeScript**: Catches type errors (e.g., `string` assigned to `number`)
- **ESLint**: Catches logic errors (e.g., unused variable, unreachable code, `==` instead of `===`)
- **Prettier**: Formats code appearance (quotes, semicolons, indentation)
- **Together**: Comprehensive code quality (types + logic + style)

## Running ESLint with Bun

```bash
# Lint all files in the project
bun run lint
bunx eslint .

# Lint and auto-fix issues
bunx eslint . --fix

# Lint specific files or directories
bunx eslint src/
bunx eslint "src/**/*.ts"
bunx eslint index.ts

# Lint with detailed output
bunx eslint . --format=stylish
bunx eslint . --format=json > eslint-report.json

# Lint only TypeScript files
bunx eslint "**/*.{ts,tsx}"

# Check specific rule
bunx eslint . --rule "no-unused-vars: error"
```

## The --fix Flag

### What --fix Automatically Corrects

- Unused imports and variables (removes them)
- Spacing and formatting issues (quotes, semicolons - though Prettier handles this better)
- Simple logic fixes (prefer `const` over `let`, sort imports, etc.)
- Most stylistic rules
- Array/object formatting issues
- Import/export ordering

### What --fix Cannot Fix

Requires manual intervention:

- Complex logic errors (infinite loops, incorrect conditionals)
- Missing error handling (try/catch blocks)
- Security vulnerabilities
- Type-related issues (those are TypeScript's domain)
- Architectural problems
- Performance issues requiring algorithmic changes

## Understanding ESLint Output

### Example Output

```bash
/Users/user/project/src/utils.ts
  10:7   error    'unusedVar' is defined but never used              @typescript-eslint/no-unused-vars
  15:3   warning  Unexpected console statement                       no-console
  22:5   error    'variable' is never reassigned. Use 'const'        prefer-const
  28:10  error    Expected '===' and instead saw '=='                eqeqeq

/Users/user/project/index.ts
  5:1    warning  Fast refresh only works when a file only exports components  react-refresh/only-export-components

✖ 5 problems (3 errors, 2 warnings)
  2 errors and 0 warnings potentially fixable with the `--fix` option.
```

### Addressing ESLint Findings

1. **Run with --fix first**: `bunx eslint . --fix` (auto-fixes many issues)
2. **Review remaining errors**: Read error messages and locate issues
3. **Fix manually**: Address logic errors and complex issues
4. **Re-run ESLint**: Verify all issues resolved: `bun run lint`
5. **Never ignore errors**: Fix root causes instead of using `// eslint-disable`

## Configuration: eslint.config.ts (Flat Config Format)

### Active Configuration

```typescript
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['scripts/**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  tseslint.configs.recommended,
])
```

### Configuration Breakdown

- **Files**: Lints all JavaScript and TypeScript files (including module variants)
- **Plugins**: Uses `@eslint/js` for JavaScript rule definitions
- **Extends**: Applies ESLint's recommended JavaScript rules
- **Language Options**: Defines browser globals (window, document, etc.)
- **Scripts Directory**: Applies Node.js globals for scripts
- **TypeScript Config**: Applies typescript-eslint's recommended rules for TypeScript files

## Key Dependencies

- **eslint v9.37.0**: Core ESLint linter engine
- **@eslint/js v9.37.0**: ESLint's recommended JavaScript rules (flat config)
- **typescript-eslint v8.46.1**: TypeScript-specific rules and parser
- **globals v16.4.0**: Global variable definitions for different environments (browser, Node.js, Bun)

## typescript-eslint Integration

- Parses TypeScript syntax correctly (understands TS-specific features)
- Provides TypeScript-specific rules (e.g., `@typescript-eslint/no-unused-vars`)
- Type-aware linting rules that leverage TypeScript's type checker
- Replaces deprecated `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`
- Unified package for better maintenance and compatibility

## Common ESLint Rules Enabled

| Rule                                 | What It Catches                    | Example                                                 |
| ------------------------------------ | ---------------------------------- | ------------------------------------------------------- |
| `no-unused-vars`                     | Variables declared but never used  | `const unused = 42` (remove it)                         |
| `no-undef`                           | Using undefined variables          | `console.log(undefinedVar)`                             |
| `no-unreachable`                     | Code after return/throw/break      | `return 1; console.log('never runs')`                   |
| `eqeqeq`                             | Using `==` instead of `===`        | `if (x == null)` (use `===`)                            |
| `no-console`                         | Console statements in production   | `console.log('debug')` (remove or use proper logging)   |
| `prefer-const`                       | Variables that could be `const`    | `let x = 5` (use `const` if never reassigned)           |
| `no-var`                             | Using `var` instead of `let/const` | `var x = 1` (use `let` or `const`)                      |
| `@typescript-eslint/no-explicit-any` | Using `any` type                   | `const x: any = 42` (use proper types)                  |
| `@typescript-eslint/no-unused-vars`  | TypeScript unused variables        | Catches unused function parameters, destructured values |

## ESLint Catches (Examples TypeScript Misses)

```typescript
// 1. Unused variables (ESLint: error, TypeScript: optional)
const unusedVariable = 42 // ESLint: Remove this
const { used, unused } = obj // ESLint: Remove 'unused'

// 2. Logic errors TypeScript allows
if (x == null) {
} // ESLint: Use === instead of ==
return value
console.log('unreachable') // ESLint: Unreachable code

// 3. Anti-patterns TypeScript doesn't care about
var oldStyle = 1 // ESLint: Use let/const
let neverReassigned = 2 // ESLint: Use const

// 4. Code quality issues
console.log('debug') // ESLint: Remove console in production
if (true) {
  doSomething()
} // ESLint: Constant condition

// 5. Best practices
const obj: any = {} // ESLint: Avoid 'any', use proper types
```

## Integration with Bun

- Command: `bun run lint` (runs `eslint .`)
- Execution: ESLint runs via Bun runtime (native TypeScript support)
- Speed: Fast analysis leveraging Bun's performance
- Compatibility: Works seamlessly with Bun's module resolution

## Claude Code Permissions

The following ESLint commands are pre-approved in `.claude/settings.local.json`:

```json
{
  "permissions": {
    "allow": ["Bash(bunx eslint:*)"]
  }
}
```

## When to Run ESLint

1. **During Development** (recommended):

   ```bash
   bunx eslint . --fix  # Auto-fix on the fly
   ```

2. **Before Committing** (critical):

   ```bash
   bun run lint  # Part of pre-commit checklist
   ```

3. **In CI/CD Pipeline** (critical):

   ```bash
   bun run lint  # Fail builds if linting errors exist
   ```

4. **After Dependency Updates** (recommended):

   ```bash
   bun run lint  # Verify no new linting issues
   ```

5. **Before Code Reviews** (helpful):
   ```bash
   bunx eslint . --fix  # Clean up before submitting PR
   ```

## IDE Integration

### VS Code (ESLint Extension)

1. Install "ESLint" extension by Microsoft
2. Add to `.vscode/settings.json`:

```json
{
  "eslint.enable": true,
  "eslint.format.enable": false, // Prettier handles formatting
  "eslint.lintTask.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

- Linting errors appear as squiggles in editor
- Auto-fix on save (if configured)
- Uses project's eslint.config.ts automatically

### WebStorm/IntelliJ IDEA

1. Go to Settings > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint
2. Enable "Automatic ESLint configuration"
3. Check "Run eslint --fix on save"
4. ESLint errors highlighted inline
5. Quick-fixes available via Alt+Enter

### Vim/Neovim (via ALE or coc-eslint)

```vim
" Using ALE (Asynchronous Lint Engine)
let g:ale_linters = {'typescript': ['eslint']}
let g:ale_fixers = {'typescript': ['eslint']}
let g:ale_fix_on_save = 1

" Or using coc-eslint
:CocInstall coc-eslint
```

## Performance Considerations

- ESLint analyzes entire codebase (can be slow on large projects)
- Type-aware rules are slower (leverage TypeScript's type checker)
- First run builds cache, subsequent runs are faster
- Use `--cache` flag to speed up: `bunx eslint . --cache`
- Use `--max-warnings 0` in CI to fail on warnings

## ESLint vs TypeScript Comparison

```typescript
// TypeScript CATCHES:
const num: number = 'text' // Type error
interface User {
  name: string
}
const user: User = {} // Missing property

// TypeScript ALLOWS (ESLint CATCHES):
const unused = 42 // Unused variable
if (x == null) {
} // Using == instead of ===
var oldStyle = 1 // Using var
let neverChanged = 2 // Should be const

// BOTH CATCH:
undefinedVariable // TypeScript: Cannot find name, ESLint: no-undef

// NEITHER CATCH (logic bugs):
if ((x = 10)) {
} // Assignment in condition (ESLint: no-cond-assign catches this!)
```

## Configuration Customization

```typescript
// Add custom rules to eslint.config.ts
export default defineConfig([
  // ... existing config
  {
    rules: {
      'no-console': 'warn', // Warn on console.log
      'prefer-const': 'error', // Enforce const usage
      '@typescript-eslint/no-explicit-any': 'error', // Disallow 'any' type
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // Allow unused args starting with _
        },
      ],
    },
  },
])
```

## Ignoring Files

Create `.eslintignore` (optional):

```
# Dependencies
node_modules/

# Build output
dist/
build/

# Lock files
bun.lock

# Configuration
*.config.js
*.config.ts
```

## Troubleshooting

### ESLint reports too many errors

- Run `bunx eslint . --fix` first to auto-fix simple issues
- Review and adjust rule severity in eslint.config.ts
- Focus on errors first, then warnings

### ESLint conflicts with Prettier

- Ensure Prettier runs after ESLint
- ESLint handles logic, Prettier handles formatting
- Don't enable ESLint formatting rules that conflict with Prettier

### ESLint is too slow

- Use `--cache` flag: `bunx eslint . --cache`
- Lint specific directories during development: `bunx eslint src/`
- Run full lint only in CI/CD

### False Positives

- Use inline comments sparingly: `// eslint-disable-next-line rule-name`
- Configure rules in eslint.config.ts rather than disabling everywhere
- Document why rules are disabled

## Best Practices

1. **Run ESLint before commits** - Catch issues early
2. **Use --fix liberally** - Auto-fix simple issues quickly
3. **Don't disable rules without reason** - Fix root causes instead
4. **Combine with TypeScript** - Both are necessary for quality code
5. **Configure IDE integration** - Get real-time feedback while coding
6. **Include in CI/CD** - Prevent linting errors from reaching production
7. **Review ESLint output** - Learn from caught issues to avoid them
8. **Keep configuration simple** - Start with recommended rules, customize gradually

## References

- ESLint documentation: https://eslint.org/docs/latest/
- typescript-eslint documentation: https://typescript-eslint.io/
- Flat config guide: https://eslint.org/docs/latest/use/configure/configuration-files
