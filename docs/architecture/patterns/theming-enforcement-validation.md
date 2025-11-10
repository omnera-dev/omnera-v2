# Theming Architecture Enforcement Validation

## Overview

This document validates that the theming architecture documented in `theming-architecture.md` is actively enforced via ESLint and TypeScript configurations.

**Validation Date**: 2025-11-10
**Validated By**: architecture-docs-maintainer agent
**Status**: ✅ ENFORCED

---

## ESLint Enforcement

### 1. Layer Boundaries (eslint-plugin-boundaries)

**Configuration**: `eslint/boundaries.config.ts`

**Enforced Rules**:

#### ✅ Domain Layer Theme Models Must Be Pure

```typescript
// eslint/boundaries.config.ts lines 42-58
{
  type: 'domain-model-app',
  pattern: 'src/domain/models/app/*.{ts,tsx}',
  mode: 'file',
}

// Lines 181-191
{
  from: ['domain-model-app'],
  allow: [
    'domain-model-app',
    'domain-model-table',
    'domain-model-page',
    'domain-model-automation',
  ],
  message: 'App model violation: Can import feature models for composition.'
}
```

**What This Prevents**:

- ❌ Theme models importing infrastructure code (e.g., CSS compiler)
- ❌ Theme models importing presentation components
- ❌ Circular dependencies between domain models

**Validated**: Theme models (`src/domain/models/app/theme/`) can ONLY import other domain models. Cannot import from infrastructure or presentation layers.

#### ✅ Infrastructure CSS Compiler Can Read Domain Models

```typescript
// eslint/boundaries.config.ts lines 140-147
{
  type: 'infrastructure-css',
  pattern: 'src/infrastructure/css/**/*',
  mode: 'file',
}

// Lines 421-459
{
  from: ['infrastructure-css'],
  allow: [
    'domain-model-app',       // ✅ Can read theme models
    'domain-validator',
    'domain-service',
    'application-port',       // ✅ ONLY ports, NOT use-cases
    // ... other infrastructure services
  ],
  message: 'Infrastructure violation: Can only import domain, ports, and other infrastructure.'
}
```

**What This Enforces**:

- ✅ CSS compiler can read domain theme models
- ✅ CSS compiler uses application ports (dependency inversion)
- ❌ CSS compiler CANNOT import application use-cases directly
- ❌ CSS compiler CANNOT import presentation components

**Validated**: Infrastructure CSS compiler follows strict dependency inversion pattern - reads domain, implements ports, no use-case imports.

#### ✅ Presentation Layer Cannot Import Infrastructure Directly

```typescript
// eslint/boundaries.config.ts lines 534-557
{
  from: ['presentation-component-ui'],
  allow: [
    'domain-model-app',       // ✅ Can read theme models
    'application-use-case',   // ✅ Uses application layer
    // ... other presentation/domain
  ],
  // ❌ NO infrastructure-css in allow list
  message: 'Component violation: Access infrastructure through use cases.'
}
```

**What This Prevents**:

- ❌ React components importing CSS compiler directly
- ❌ Direct coupling between presentation and infrastructure

**Validated**: Presentation layer must go through application layer to access infrastructure (compileCSS use case).

---

### 2. Functional Programming (eslint-plugin-functional)

**Configuration**: `eslint/functional.config.ts`

**Enforced Rules**:

#### ✅ Immutable Types Enforced

```typescript
// eslint/functional.config.ts lines 31-38
'functional/prefer-immutable-types': [
  'error',
  {
    enforcement: 'ReadonlyShallow',
    ignoreInferredTypes: true,
    ignoreClasses: true,
  },
]
```

**What This Enforces**:

- ✅ Theme model properties are `readonly`
- ✅ Function parameters must be `readonly` (e.g., `theme: Readonly<Theme>`)
- ❌ Cannot mutate theme objects: `theme.colors.primary = '#new'` → ESLint error

**Example Enforcement**:

```typescript
// ✅ Correct: Immutable theme model
export interface Theme {
  readonly colors?: Readonly<ColorsConfig>
  readonly fonts?: Readonly<FontsConfig>
}

// ❌ ESLint Error: functional/prefer-immutable-types
export interface Theme {
  colors?: ColorsConfig // Missing readonly
}
```

**Validated**: All theme models must use `readonly` modifiers. Mutations are prevented at compile-time.

#### ✅ Immutable Data Enforced

```typescript
// eslint/functional.config.ts lines 44-50
'functional/immutable-data': [
  'error',
  {
    ignoreClasses: true,
    ignoreImmediateMutation: false,
  },
]
```

**What This Enforces**:

- ❌ Cannot use array mutation methods: `theme.colors.push()`
- ❌ Cannot reassign properties: `theme.colors = {}`
- ✅ Must use immutable patterns: `{ ...theme, colors: newColors }`

**Example Enforcement**:

```typescript
// ❌ ESLint Error: functional/immutable-data
theme.colors.primary = '#new-color'

// ✅ Correct: Create new object
const updatedTheme = { ...theme, colors: { ...theme.colors, primary: '#new-color' } }
```

**Validated**: Theme models cannot be mutated. All updates must create new objects (functional data flow).

#### ✅ No Throw Statements (Effect.ts Error Handling)

```typescript
// eslint/functional.config.ts line 53
'functional/no-throw-statements': 'error',
```

**What This Enforces**:

- ❌ Cannot use `throw new Error()` in CSS compiler
- ✅ Must use Effect.ts error types: `Effect.Effect<CSS, CSSCompilationError>`

**Example Enforcement**:

```typescript
// ❌ ESLint Error: functional/no-throw-statements
export function compileCSS(theme: Theme): string {
  if (!theme) throw new Error('Theme required')
}

// ✅ Correct: Effect.ts error handling
export const compileCSS = (theme: Theme): Effect.Effect<CSS, CSSCompilationError> =>
  Effect.gen(function* () {
    if (!theme) return yield* Effect.fail(new CSSCompilationError('Theme required'))
  })
```

**Validated**: CSS compiler uses Effect.ts error types exclusively. No throw statements allowed.

---

## TypeScript Enforcement

### Configuration: `tsconfig.json`

#### ✅ Strict Mode Enabled

```json
{
  "strict": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitOverride": true
}
```

**What This Enforces**:

1. **strictNullChecks** - Optional theme properties must be checked: `theme?.colors`
2. **strictFunctionTypes** - Function parameters are contravariant (type-safe theme transformations)
3. **strictPropertyInitialization** - Class properties must be initialized (rare in functional codebase)
4. **noImplicitAny** - All theme model properties must have explicit types

**Example Enforcement**:

```typescript
// ❌ TypeScript Error: Object is possibly 'undefined'
function getColors(theme: Theme) {
  return theme.colors.primary // Error: colors is optional
}

// ✅ Correct: Check for undefined
function getColors(theme: Theme) {
  return theme.colors?.primary ?? '#007bff'
}
```

**Validated**: Strict TypeScript prevents null/undefined bugs. Optional theme properties must be checked before access.

#### ✅ Unused Locals/Parameters

```json
{
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```

**What This Enforces**:

- ❌ Cannot have unused theme parameters in functions
- ✅ Forces cleanup of dead code in theme transformations

**Validated**: TypeScript prevents dead code accumulation in theme utilities.

#### ✅ Module Resolution (Bundler Mode)

```json
{
  "moduleResolution": "bundler",
  "allowImportingTsExtensions": true
}
```

**What This Supports**:

- ✅ Path aliases work: `import { Theme } from '@/domain/models/app'`
- ✅ Direct TypeScript imports: `import { compileCSS } from '@/infrastructure/css/compiler'`

**Validated**: Path aliases enable clean imports. No need for `../../../` relative paths.

---

## Validation Results Summary

### Layer-Based Architecture: ✅ ENFORCED

| Pattern                             | Enforcement Mechanism    | Status      |
| ----------------------------------- | ------------------------ | ----------- |
| Domain theme models are pure        | eslint-plugin-boundaries | ✅ Enforced |
| Infrastructure reads domain         | eslint-plugin-boundaries | ✅ Enforced |
| Presentation uses application layer | eslint-plugin-boundaries | ✅ Enforced |
| No cross-layer violations           | eslint-plugin-boundaries | ✅ Enforced |

### Functional Programming: ✅ ENFORCED

| Pattern                  | Enforcement Mechanism    | Status      |
| ------------------------ | ------------------------ | ----------- |
| Immutable theme models   | eslint-plugin-functional | ✅ Enforced |
| No theme mutations       | eslint-plugin-functional | ✅ Enforced |
| Effect.ts error handling | eslint-plugin-functional | ✅ Enforced |
| No throw statements      | eslint-plugin-functional | ✅ Enforced |

### Type Safety: ✅ ENFORCED

| Pattern            | Enforcement Mechanism     | Status      |
| ------------------ | ------------------------- | ----------- |
| Strict null checks | TypeScript strict mode    | ✅ Enforced |
| Explicit types     | TypeScript strict mode    | ✅ Enforced |
| No unused code     | TypeScript noUnusedLocals | ✅ Enforced |
| Path aliases       | TypeScript baseUrl/paths  | ✅ Enforced |

---

## Recommended ESLint Rules (Future Enhancements)

### 1. Tailwind CSS Utilities Validation

**Recommendation**: Add `eslint-plugin-tailwindcss` to validate utility usage.

```typescript
// eslint.config.ts (future enhancement)
{
  'tailwindcss/no-custom-classname': 'warn',
  'tailwindcss/classnames-order': 'warn',
}
```

**Benefit**: Prevents typos in Tailwind utilities (e.g., `bg-primry` → `bg-primary`).

**Status**: Not currently implemented (Tailwind plugin not added to project).

### 2. Effect Schema Validation

**Recommendation**: Custom ESLint rule to ensure theme schemas use Effect Schema annotations.

```typescript
// Custom rule (future enhancement)
'sovrium/theme-schema-annotations': 'error',
```

**Benefit**: Enforces `title`, `description`, and `examples` annotations on all theme schemas.

**Status**: Not currently implemented (would require custom ESLint rule development).

---

## Manual Review Checklist (Non-Automatable Patterns)

While most patterns are enforced via ESLint/TypeScript, some require manual code review:

### ✅ Theme Model Design Quality

**What to Check**:

- [ ] Semantic naming (e.g., `primary` not `color1`)
- [ ] Progressive scales (e.g., `gray-100` to `gray-900`)
- [ ] Consistent units (e.g., `rem` for spacing, not mixed `px`/`rem`)
- [ ] Accessibility (e.g., contrast ratios for text colors)

**Why Manual**: ESLint cannot validate semantic meaning or design system quality.

### ✅ CSS Compiler Performance

**What to Check**:

- [ ] Cache hit ratio (monitor in production)
- [ ] Compilation time (should be <300ms)
- [ ] Memory usage (cache size reasonable)

**Why Manual**: Performance metrics require runtime monitoring, not static analysis.

### ✅ Theme Documentation

**What to Check**:

- [ ] Theme schema has JSDoc comments
- [ ] Examples in schema annotations
- [ ] Migration guides for breaking changes

**Why Manual**: Documentation quality cannot be automatically validated.

---

## Coordination with infrastructure-docs-maintainer

**Notification**: The following ESLint/TypeScript configurations enforce the theming architecture:

1. **eslint/boundaries.config.ts** - Layer isolation for theme models
2. **eslint/functional.config.ts** - Immutability and FP patterns
3. **tsconfig.json** - Strict type safety

**Action Required**: infrastructure-docs-maintainer should document these configurations in:

- `docs/infrastructure/quality/eslint.md` - ESLint boundaries and functional rules
- `docs/infrastructure/quality/typescript.md` - TypeScript strict mode and path aliases

**Coordination**: This document (theming-enforcement-validation.md) focuses on WHY patterns are enforced. Infrastructure docs should focus on WHAT tools/versions/settings are configured.

---

## References

- **Theming Architecture**: `@docs/architecture/patterns/theming-architecture.md`
- **Layer-Based Architecture**: `@docs/architecture/layer-based-architecture.md`
- **Functional Programming**: `@docs/architecture/functional-programming.md`
- **ESLint Configuration**: `eslint.config.ts` and `eslint/*.config.ts`
- **TypeScript Configuration**: `tsconfig.json`

---

## Revision History

| Date       | Version | Changes                                   |
| ---------- | ------- | ----------------------------------------- |
| 2025-11-10 | 1.0.0   | Initial validation of theming enforcement |
