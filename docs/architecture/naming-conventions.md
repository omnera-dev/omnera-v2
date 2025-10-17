# Naming Conventions

> **Purpose**: Comprehensive naming standards for files, code elements, and patterns across the Omnera project.
>
> **Status**: ⚠️ Active - File naming enforced via `eslint-plugin-check-file`, code naming enforced via code review
>
> **Last Updated**: 2025-10-17

## Table of Contents

- [Philosophy](#philosophy)
- [File Naming](#file-naming)
- [Code Naming](#code-naming)
  - [Variables](#variables)
  - [Functions](#functions)
  - [Classes](#classes)
  - [Types & Interfaces](#types--interfaces)
  - [Constants](#constants)
- [Special Patterns](#special-patterns)
  - [Effect Schemas](#effect-schemas)
  - [React Components & Hooks](#react-components--hooks)
  - [CVA Variants](#cva-variants)
  - [Discriminated Unions](#discriminated-unions)
- [Anti-Patterns](#anti-patterns)
- [ESLint Enforcement](#eslint-enforcement)
- [Quick Reference](#quick-reference)

---

## Philosophy

### Core Principles

1. **Consistency** - One naming pattern per code element type
2. **Clarity** - Names reveal intent without comments
3. **Tooling-Friendly** - Support IDE autocomplete and refactoring
4. **Ecosystem Alignment** - Match TypeScript/React/Effect conventions
5. **Minimal Cognitive Load** - Reduce decision fatigue with clear rules

### File vs. Code Naming

**File names** (filesystem organization) use kebab-case by default:

```
start-server.ts
invalid-config-error.ts
button.tsx
```

**Code names** (exports, variables) follow language conventions:

```typescript
export const startServer = () => {} // camelCase function
export class InvalidConfigError {} // PascalCase class
export const Button = () => {} // PascalCase component
```

This decoupling allows optimal naming for each context.

---

## File Naming

**Complete file naming conventions documented in:**
`@docs/architecture/file-naming-conventions.md`

### Summary

- **Default**: kebab-case (95% of files)
- **Exception**: PascalCase for page components only

**Examples:**

```
✅ src/application/use-cases/server/start-server.ts
✅ src/domain/errors/invalid-config-error.ts
✅ src/presentation/components/ui/button.tsx
✅ src/presentation/components/pages/DefaultHomePage.tsx  (exception)
```

---

## Code Naming

### Variables

**Pattern**: camelCase

**Purpose**: Store values, references, and state

```typescript
// ✅ CORRECT - camelCase for variables
const userId = 123
const userName = 'John Doe'
const userProfiles = []
const selectedIndex = 0

// ✅ CORRECT - Boolean prefix patterns
const isActive = true
const hasPermission = false
const shouldRender = true
const canEdit = false
const willUpdate = true

// ✅ CORRECT - Private variables (underscore prefix)
const _internalCache = new Map()
const _tempValue = 42

// ❌ INCORRECT - Wrong casing
const user_id = 123 // Don't use snake_case
const UserName = 'John' // Don't use PascalCase
const SELECTED_INDEX = 0 // Don't use SCREAMING_SNAKE (not a constant)
```

**Rules:**

- **camelCase** - First word lowercase, subsequent words capitalized
- **Boolean prefix** - Use `is`, `has`, `should`, `can`, `will` for booleans
- **Private prefix** - Use underscore `_` for private/internal variables
- **Descriptive** - Name reveals purpose (avoid generic names like `data`, `temp`)

### Functions

**Pattern**: camelCase, verb-first

**Purpose**: Perform actions and transformations

```typescript
// ✅ CORRECT - camelCase with action verbs
function calculateTotal(items: Item[]): number {}
function getUserById(id: number): User {}
function validateEmail(email: string): boolean {}
function transformData(input: Data): TransformedData {}
function isValidUser(user: User): boolean {}

// ✅ CORRECT - Async functions (no special naming)
async function fetchUserData(id: number): Promise<User> {}
async function saveToDatabase(data: Data): Promise<void> {}

// ✅ CORRECT - Effect functions
const startServer = (config: Config): Effect.Effect<Server, StartError> =>
  Effect.gen(function* () {
    // Implementation
  })

// ❌ INCORRECT - Wrong patterns
function GetUserById() {} // Don't use PascalCase
function user_by_id() {} // Don't use snake_case
function userById() {} // Missing action verb
function get() {} // Too generic
```

**Action Verb Prefixes:**

| Verb         | Usage           | Example                         |
| ------------ | --------------- | ------------------------------- |
| `get`        | Retrieve data   | `getUserById()`                 |
| `set`        | Assign value    | `setTheme()`                    |
| `create`     | Instantiate new | `createServer()`                |
| `update`     | Modify existing | `updateUserProfile()`           |
| `delete`     | Remove          | `deleteAccount()`               |
| `calculate`  | Compute value   | `calculateDiscount()`           |
| `validate`   | Check validity  | `validateEmail()`               |
| `transform`  | Convert format  | `transformData()`               |
| `is` / `has` | Boolean check   | `isActive()`, `hasPermission()` |
| `fetch`      | Async retrieval | `fetchUserData()`               |
| `handle`     | Event handler   | `handleClick()`                 |
| `on`         | Event callback  | `onClick()`                     |

### Classes

**Pattern**: PascalCase, noun

**Purpose**: Object-oriented blueprints and error types

```typescript
// ✅ CORRECT - PascalCase nouns
class UserRepository {}
class EmailValidator {}
class ConfigLoader {}
class HttpClient {}

// ✅ CORRECT - Error classes (Error suffix)
class ValidationError {
  readonly _tag = 'ValidationError'
  constructor(readonly cause: unknown) {}
}

class DatabaseConnectionError {
  readonly _tag = 'DatabaseConnectionError'
  constructor(readonly cause: unknown) {}
}

// ✅ CORRECT - Service classes
class AuthenticationService {}
class PaymentProcessor {}

// ❌ INCORRECT - Wrong patterns
class userRepository {} // Don't use camelCase
class user_repository {} // Don't use snake_case
class UserRepositoryClass {} // Don't add "Class" suffix
class GetUser {} // Don't use verbs (classes are nouns)
```

**Rules:**

- **PascalCase** - All words capitalized
- **Noun-based** - Classes represent things, not actions
- **Error suffix** - Error classes end with `Error`
- **\_tag property** - Effect error classes include `_tag` discriminant

### Types & Interfaces

**Pattern**: PascalCase

**Purpose**: Type definitions and contracts

```typescript
// ✅ CORRECT - PascalCase for types
type UserId = number
type UserProfile = {
  readonly id: UserId
  readonly name: string
}

interface ApiResponse<T> {
  readonly data: T
  readonly status: number
}

// ✅ CORRECT - Discriminated unions
type Result<T, E> =
  | { readonly _tag: 'Success'; readonly value: T }
  | { readonly _tag: 'Failure'; readonly error: E }

// ✅ CORRECT - Effect Schema types
type User = Schema.Schema.Type<typeof UserSchema>
type UserEncoded = Schema.Schema.Encoded<typeof UserSchema>

// ✅ CORRECT - Generic types
type Nullable<T> = T | null
type ReadonlyDeep<T> = { readonly [K in keyof T]: ReadonlyDeep<T[K]> }

// ❌ INCORRECT - Wrong patterns
type userId = number // Don't use camelCase
type user_profile = {} // Don't use snake_case
interface IUserProfile {} // Don't use I prefix (TypeScript convention)
type UserProfileType = {} // Don't add "Type" suffix
```

**Rules:**

- **PascalCase** - All words capitalized
- **No prefixes** - Avoid `I` prefix for interfaces (TypeScript convention)
- **No suffixes** - Avoid `Type` suffix (redundant)
- **Descriptive** - Type name reveals structure/purpose

**Special Patterns:**

```typescript
// Effect Schema pattern (PascalCase + "Schema" suffix)
const UserSchema = Schema.Struct({
  /* ... */
})
type User = Schema.Schema.Type<typeof UserSchema>
type UserEncoded = Schema.Schema.Encoded<typeof UserSchema>

// Props pattern (Component + "Props" suffix)
interface ButtonProps {
  readonly variant: 'primary' | 'secondary'
  readonly disabled?: boolean
}
```

### Constants

**Pattern**: SCREAMING_SNAKE_CASE for primitives, camelCase for objects

**Purpose**: Immutable configuration values

```typescript
// ✅ CORRECT - SCREAMING_SNAKE_CASE for primitive constants
const MAX_RETRIES = 3
const API_TIMEOUT = 5000
const DEFAULT_PORT = 3000
const ERROR_MESSAGE = 'Something went wrong'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// ✅ CORRECT - camelCase for configuration objects
const apiConfig = {
  timeout: 5000,
  retries: 3,
  baseUrl: 'https://api.example.com',
} as const

const buttonConfig = {
  variants: ['primary', 'secondary'],
  sizes: ['sm', 'md', 'lg'],
} as const

// ✅ CORRECT - SCREAMING_SNAKE for extracted values
const { MAX_RETRIES, DEFAULT_PORT } = apiConfig

// ✅ CORRECT - Presentational constants (SCREAMING_SNAKE)
const FOCUS_RING_CLASSES = 'focus:ring-2 focus:ring-blue-500'
const COMMON_INTERACTIVE_CLASSES = 'transition-colors hover:bg-gray-100'

// ❌ INCORRECT - Wrong patterns
const max_retries = 3 // camelCase or SCREAMING_SNAKE, not snake_case
const MaxRetries = 3 // Don't use PascalCase for constants
const API_CONFIG = {
  /* */
} // Use camelCase for objects
```

**Rules:**

- **SCREAMING_SNAKE_CASE** - For primitive constant values (numbers, strings, booleans)
- **camelCase** - For configuration objects and complex structures
- **as const** - Use TypeScript `as const` for immutable objects
- **Descriptive** - Constant name reveals purpose and value type

**When to use each:**

```typescript
// Primitive values → SCREAMING_SNAKE_CASE
const MAX_USERS = 100
const ERROR_CODE = 'AUTH_FAILED'
const IS_ENABLED = true

// Objects/Arrays → camelCase + as const
const errorMessages = {
  AUTH_FAILED: 'Authentication failed',
  NOT_FOUND: 'Resource not found',
} as const

const colorPalette = ['red', 'blue', 'green'] as const
```

---

## Special Patterns

### Effect Schemas

**Pattern**: PascalCase + "Schema" suffix

**Purpose**: Effect Schema validation definitions

```typescript
// ✅ CORRECT - Schema naming pattern
export const UserSchema = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  email: Schema.String,
})

export const AppSchema = Schema.Struct({
  name: NameSchema,
  version: VersionSchema,
  description: DescriptionSchema,
})

// ✅ CORRECT - Derived types
export type User = Schema.Schema.Type<typeof UserSchema>
export type UserEncoded = Schema.Schema.Encoded<typeof UserSchema>

export type App = Schema.Schema.Type<typeof AppSchema>
export type AppEncoded = Schema.Schema.Encoded<typeof AppSchema>

// ❌ INCORRECT - Wrong patterns
export const user = Schema.Struct({}) // Don't use camelCase
export const UserModel = Schema.Struct({}) // Don't use "Model" suffix
export const USER_SCHEMA = Schema.Struct({}) // Don't use SCREAMING_SNAKE
```

**Rules:**

- **PascalCase + Schema** - Schema suffix indicates validation schema
- **Type suffix** - Use `Type` helper for decoded type
- **Encoded suffix** - Use `Encoded` helper for encoded type
- **Co-located** - Schema, Type, and Encoded in same file

### React Components & Hooks

**Components Pattern**: PascalCase, noun

```typescript
// ✅ CORRECT - React components (PascalCase)
export function Button({ children }: ButtonProps) {
  return <button>{children}</button>
}

export function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>
}

export function AlertDialog({ open }: AlertDialogProps) {
  return <dialog open={open} />
}

// ❌ INCORRECT - Wrong patterns
export function button() {}           // Don't use camelCase
export function user_profile() {}     // Don't use snake_case
export function ButtonComponent() {}  // Don't add "Component" suffix
```

**Hooks Pattern**: camelCase, "use" prefix

```typescript
// ✅ CORRECT - React hooks (use + camelCase)
export function useIsMobile(): boolean {
  // Hook implementation
}

export function useAuth(): AuthContext {
  // Hook implementation
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Hook implementation
}

// ❌ INCORRECT - Wrong patterns
export function useMobile() {} // Be specific (useIsMobile)
export function useUser() {} // Missing context (useUserData, useUserAuth?)
export function mobile() {} // Missing "use" prefix
export function UseMobile() {} // Don't use PascalCase for hooks
```

**Rules:**

- **Components** - PascalCase noun
- **Hooks** - camelCase with `use` prefix
- **Descriptive** - Hook name reveals what it provides
- **Specific** - Avoid generic names (`useData` → `useUserData`)

### CVA Variants

**Pattern**: camelCase + "Variants" suffix

**Purpose**: Class Variance Authority variant definitions

```typescript
// ✅ CORRECT - CVA variants naming
export const buttonVariants = cva('inline-flex items-center justify-center', {
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export const badgeVariants = cva('inline-flex items-center rounded-full', {
  // Variants
})

// ❌ INCORRECT - Wrong patterns
export const ButtonVariants = cva({}) // Don't use PascalCase
export const button_variants = cva({}) // Don't use snake_case
export const buttonCVA = cva({}) // Don't use "CVA" suffix
export const buttonStyles = cva({}) // Use "Variants" suffix
```

**Rules:**

- **camelCase + Variants** - Consistent suffix for all CVA definitions
- **Component name prefix** - Match related component (`button` → `buttonVariants`)
- **Co-located** - Often in `{component}-variants.ts` file

### Discriminated Unions

**Pattern**: `_tag` property for discriminant

**Purpose**: Type-safe union discrimination (Effect pattern)

```typescript
// ✅ CORRECT - Discriminated unions with _tag
type ServerStartupError = AppValidationError | ServerCreationError | CSSCompilationError

class AppValidationError {
  readonly _tag = 'AppValidationError'
  constructor(readonly cause: unknown) {}
}

class ServerCreationError {
  readonly _tag = 'ServerCreationError'
  constructor(readonly cause: unknown) {}
}

// ✅ CORRECT - Discriminated union types
type Result<T, E> =
  | { readonly _tag: 'Success'; readonly value: T }
  | { readonly _tag: 'Failure'; readonly error: E }

// ✅ CORRECT - Pattern matching with _tag
function handleError(error: ServerStartupError): void {
  switch (error._tag) {
    case 'AppValidationError':
      console.error('Invalid config:', error.cause)
      break
    case 'ServerCreationError':
      console.error('Server failed:', error.cause)
      break
    case 'CSSCompilationError':
      console.error('CSS failed:', error.cause)
      break
  }
}

// ❌ INCORRECT - Wrong patterns
class AppValidationError {
  readonly type = 'AppValidationError' // Use _tag, not type
  readonly kind = 'AppValidationError' // Use _tag, not kind
  readonly tag = 'AppValidationError' // Use _tag with underscore
}
```

**Rules:**

- **\_tag property** - Use underscore prefix (Effect convention)
- **String literal** - Tag value matches class/type name
- **readonly** - Tag should be immutable
- **Pattern matching** - Switch on `_tag` for type narrowing

---

## Anti-Patterns

### Avoid These Patterns

```typescript
// ❌ Abbreviations (except well-known: id, url, html, api)
const usr = getUser()         // Use: user
const calc = () => {}         // Use: calculate
const temp = 5                // Use: temporary or temperature
const idx = 0                 // Use: index
const btn = document...       // Use: button

// ❌ Hungarian Notation
const strName = 'John'        // Use: name
const arrUsers = []           // Use: users
const bIsActive = true        // Use: isActive
const objConfig = {}          // Use: config
const fnCallback = () => {}   // Use: callback or onComplete

// ❌ Generic Names
const data = {}               // Use: userData, orderData, configData
const value = 42              // Use: count, total, maxRetries
const result = await fetch()  // Use: response, userResponse
const handler = () => {}      // Use: handleClick, handleSubmit
const utils = {}              // Use: stringUtils, dateUtils

// ❌ Redundant Suffixes
interface UserInterface {}    // Use: User
class UserClass {}            // Use: User
type UserType = {}            // Use: User
const userVariable = {}       // Use: user
const getUserFunction = {}    // Use: getUser

// ❌ Mixing Conventions
const user_name = 'John'      // Pick one: userName or USER_NAME
const UserProfile = {}        // Use: userProfile (variable, not class)
const GET_USER = () => {}     // Use: getUser

// ❌ Acronym Mistakes
class HTMLParser {}           // Use: HtmlParser
const userID = 1              // Use: userId
const apiURL = '...'          // Use: apiUrl
const URLParser = {}          // Use: UrlParser
```

### Correct Alternatives

```typescript
// ✅ Descriptive names
const user = getUser()
const calculate = (x: number) => x * 2
const temperatureThreshold = 5
const currentIndex = 0
const submitButton = document...

// ✅ Clean names (no notation)
const name = 'John'
const users: User[] = []
const isActive = true
const config = loadConfig()
const onComplete = () => {}

// ✅ Specific names
const userData = fetchUserData()
const maxRetries = 3
const userResponse = await fetch()
const handleSubmit = () => {}
const stringUtils = { uppercase, lowercase }

// ✅ No redundant suffixes
interface User {}
class User {}
type User = {}
const user = {}
const getUser = () => {}

// ✅ Consistent conventions
const userName = 'John'           // camelCase variable
const UserProfile = () => {}      // PascalCase component
const MAX_RETRIES = 3             // SCREAMING_SNAKE constant

// ✅ Acronyms as words
class HtmlParser {}
const userId = 1
const apiUrl = 'https://...'
const UrlParser = {}
```

---

## ESLint Enforcement

### Current Status

⚠️ **Code naming conventions (variables, functions, classes, types) are NOT automatically enforced by ESLint.**

Enforcement currently relies on:

- **Team discipline and code review** - Manual validation during PR reviews
- **TypeScript's type system** - Catches some naming errors (e.g., mismatched exports)
- **IDE warnings and autocomplete** - Provides hints for correct naming patterns
- **Project conventions** - This document serves as the single source of truth

**File naming conventions ARE automatically enforced** - See `@docs/architecture/file-naming-conventions.md#enforcement` for details on `eslint-plugin-check-file` enforcement.

### Rationale for Manual Code Naming Enforcement

We prioritize **file naming enforcement** over code naming because:

1. **File names impact architecture** - Incorrect file names break imports and layer boundaries
2. **Code names are self-correcting** - TypeScript errors surface mismatched names quickly
3. **Reduced linter noise** - Too many naming rules create alert fatigue
4. **Team consensus** - Clear documentation + code review catches violations effectively

### Future Enhancement: Automated Code Naming

We may add `@typescript-eslint/naming-convention` rules in the future to automatically enforce code naming patterns. Proposed configuration:

```typescript
// FUTURE: Proposed @typescript-eslint/naming-convention rules
import tseslint from 'typescript-eslint'

export default tseslint.config({
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      // Variables: camelCase or SCREAMING_SNAKE_CASE
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
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
      // Boolean variables: require is/has/should/can/will prefix
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['camelCase'],
        prefix: ['is', 'has', 'should', 'can', 'will', 'do'],
      },
      // React components: PascalCase (exported functions returning JSX)
      {
        selector: 'function',
        modifiers: ['exported'],
        format: ['PascalCase'],
        // Note: Cannot distinguish JSX-returning functions automatically
      },
      // Object properties: camelCase (API responses may vary)
      {
        selector: 'property',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        // Allow quoted properties to support API contracts
        filter: {
          regex: '^[A-Z_]+$',
          match: false,
        },
      },
    ],
  },
})
```

**Trade-offs to consider**:

- ✅ Automatic detection of naming violations
- ✅ Consistent enforcement across team
- ❌ Increased linter noise and false positives
- ❌ Difficulty distinguishing React components from regular functions
- ❌ Requires exceptions for third-party library integration

**Decision**: Deferred until team consensus on acceptable noise level.

### Current Enforcement Mechanisms

**Code Review Checklist** (for reviewers):

When reviewing PRs, verify:

- [ ] Variables use camelCase (except SCREAMING_SNAKE_CASE constants)
- [ ] Functions use camelCase with action verbs
- [ ] Classes use PascalCase nouns
- [ ] Types/Interfaces use PascalCase (no `I` prefix)
- [ ] Boolean variables have is/has/should/can/will prefix
- [ ] Effect Schemas use PascalCase + "Schema" suffix
- [ ] CVA variants use camelCase + "Variants" suffix
- [ ] React components use PascalCase
- [ ] React hooks use "use" + camelCase

**IDE Configuration** (optional):

Configure your IDE to highlight naming violations:

**VS Code** - Install extensions:

- ESLint (enforces file naming automatically)
- TypeScript and JavaScript Language Features (built-in)
- Error Lens (highlights TypeScript errors inline)

**JetBrains IDEs** (WebStorm, IntelliJ):

- Enable "TypeScript" inspections
- Enable "Naming conventions" inspections (Settings → Editor → Inspections → JavaScript and TypeScript → Code style issues)

---

## Quick Reference

### Naming Decision Tree

```
What are you naming?

├─ File
│  ├─ Page component? → PascalCase (HomePage.tsx)
│  └─ Everything else → kebab-case (start-server.ts)
│
├─ Variable
│  ├─ Boolean? → camelCase with prefix (isActive, hasPermission)
│  ├─ Primitive constant? → SCREAMING_SNAKE_CASE (MAX_RETRIES)
│  └─ Everything else → camelCase (userName, userProfiles)
│
├─ Function
│  ├─ React component? → PascalCase (Button, UserProfile)
│  ├─ React hook? → camelCase with use prefix (useAuth, useIsMobile)
│  └─ Regular function → camelCase with verb (getUser, calculateTotal)
│
├─ Class
│  ├─ Error class? → PascalCase + Error suffix (ValidationError)
│  └─ Regular class → PascalCase noun (UserRepository)
│
├─ Type/Interface
│  ├─ Effect Schema? → PascalCase + Schema suffix (UserSchema)
│  ├─ Effect type? → PascalCase (User, UserEncoded)
│  └─ Regular type → PascalCase (UserId, ApiResponse)
│
└─ Constant
   ├─ Primitive value? → SCREAMING_SNAKE_CASE (MAX_RETRIES, API_TIMEOUT)
   ├─ Config object? → camelCase + as const (apiConfig, errorMessages)
   └─ CVA variants? → camelCase + Variants suffix (buttonVariants)
```

### Cheat Sheet

| Element        | Pattern              | Example                            |
| -------------- | -------------------- | ---------------------------------- |
| **Variables**  | camelCase            | `userName`, `userProfiles`         |
| **Booleans**   | camelCase + prefix   | `isActive`, `hasPermission`        |
| **Functions**  | camelCase + verb     | `getUser`, `calculateTotal`        |
| **Classes**    | PascalCase noun      | `UserRepository`, `EmailValidator` |
| **Errors**     | PascalCase + Error   | `ValidationError`, `NotFoundError` |
| **Types**      | PascalCase           | `UserId`, `ApiResponse<T>`         |
| **Interfaces** | PascalCase           | `User`, `ButtonProps`              |
| **Primitives** | SCREAMING_SNAKE      | `MAX_RETRIES`, `API_TIMEOUT`       |
| **Objects**    | camelCase            | `apiConfig`, `errorMessages`       |
| **Components** | PascalCase           | `Button`, `UserProfile`            |
| **Hooks**      | use + camelCase      | `useAuth`, `useIsMobile`           |
| **Schemas**    | PascalCase + Schema  | `UserSchema`, `AppSchema`          |
| **Variants**   | camelCase + Variants | `buttonVariants`, `badgeVariants`  |

---

## Related Documentation

- **File Naming Conventions** - `@docs/architecture/file-naming-conventions.md` (comprehensive file naming guide)
- **Functional Programming** - `@docs/architecture/functional-programming.md`
- **Layer-Based Architecture** - `@docs/architecture/layer-based-architecture.md`
- **ESLint Configuration** - `@docs/infrastructure/quality/eslint.md`
- **TypeScript Configuration** - `@docs/infrastructure/language/typescript.md`

---

## Summary

### The Golden Rules

1. **Files**: kebab-case (default), PascalCase (page components only)
2. **Variables**: camelCase (default), SCREAMING_SNAKE_CASE (primitive constants)
3. **Functions**: camelCase + verb (actions), PascalCase (React components)
4. **Classes**: PascalCase + noun
5. **Types**: PascalCase
6. **Booleans**: Prefix with is/has/should/can/will
7. **Schemas**: PascalCase + "Schema" suffix
8. **Hooks**: "use" + camelCase
9. **Variants**: camelCase + "Variants" suffix
10. **Discriminants**: `_tag` property

### When in Doubt

**Default patterns:**

- Variables → camelCase
- Functions → camelCase
- Classes → PascalCase
- Types → PascalCase
- Files → kebab-case

**Special cases:**

- Boolean variables → Add is/has/should prefix
- Primitive constants → SCREAMING_SNAKE_CASE
- React components → PascalCase
- React hooks → use + camelCase
- Effect Schemas → PascalCase + Schema

### Enforcement

⚠️ **Code Naming** - Manual enforcement via code review (see ESLint Enforcement section)
✅ **File Naming** - Automated via `eslint-plugin-check-file` (see file-naming-conventions.md)
✅ **IDE Support** - TypeScript autocomplete and refactoring
✅ **Documentation** - This guide as single source of truth
