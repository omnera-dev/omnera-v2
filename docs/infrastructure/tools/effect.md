# Effect - Typed Functional Programming Library

## Overview

**Version**: 3.18.4
**Purpose**: Powerful TypeScript library for building robust, type-safe applications using functional programming principles with comprehensive error handling, dependency injection, and structured concurrency

## What Effect Provides

1. **Type-Safe Error Handling** - Explicit error types tracked at the type level
2. **Dependency Injection** - Type-safe service management via Context and Layers
3. **Structured Concurrency** - Fiber-based concurrency with interruption support
4. **Resource Management** - Automatic resource cleanup with Scope
5. **Asynchronous Operations** - Promise-like but more powerful Effect type
6. **Retry and Timeout Logic** - Built-in retry policies and timeout handling
7. **Testing Support** - Built-in mocking and test utilities
8. **Streaming** - Powerful Stream abstraction for data processing

## Why Effect for Omnera V2

Effect complements the existing tech stack by providing:

- **Type-Safe Error Handling**: Makes error types explicit, catching bugs at compile time
- **Composability**: Build complex logic from simple, reusable pieces
- **Testability**: Dependency injection makes testing easier with mocked services
- **Maintainability**: Clear separation of concerns and explicit dependencies
- **Reliability**: Structured concurrency prevents resource leaks and race conditions
- **Performance**: Efficient fiber-based concurrency model
- **Developer Experience**: Excellent TypeScript integration with full type inference

## The Effect Type

The core type is `Effect<Success, Error, Requirements>`:

```typescript
Effect<A, E, R>
```

- **A (Success)**: The type of value produced on success
- **E (Error)**: The type of errors that can occur
- **R (Requirements)**: Services/dependencies required to run this effect

### Examples

```typescript
import { Effect } from 'effect'

// Simple effect that always succeeds
const alwaysSucceeds: Effect.Effect<number, never, never> = Effect.succeed(42)

// Effect that might fail
const mightFail: Effect.Effect<string, Error, never> = Effect.fail(new Error('Oops'))

// Effect requiring a service
class Database extends Effect.Tag('Database')<
  Database,
  { query: (sql: string) => Effect.Effect<unknown[]> }
>() {}

const fetchUser: Effect.Effect<User, DatabaseError, Database> = Effect.gen(function* () {
  const db = yield* Database
  const rows = yield* db.query('SELECT * FROM users WHERE id = 1')
  return parseUser(rows[0])
})
```

## Integration with Bun and TypeScript

- **Native TypeScript**: Effect leverages TypeScript's type system for maximum safety
- **Bun Runtime**: Effect runs seamlessly on Bun's fast JavaScript runtime
- **No Compilation Needed**: Bun executes Effect TypeScript code directly
- **Type Checking**: Use `tsc --noEmit` to validate Effect types (same as rest of project)

## Installation and Setup

Effect is already installed in this project:

```json
{
  "dependencies": {
    "effect": "^3.18.4"
  }
}
```

### Basic Import Patterns

```typescript
// Core Effect type and constructors
import { Effect } from 'effect'

// Console operations (built-in service)
import { Console } from 'effect'

// Error helpers
import { Data } from 'effect'

// Layer and Context for dependency injection
import { Layer, Context } from 'effect'

// Fiber operations for concurrency
import { Fiber } from 'effect'

// Stream for data processing
import { Stream } from 'effect'
```

## Effect Schema - Type-Safe Data Validation

### Overview

Effect Schema is a powerful built-in module for defining, validating, parsing, and transforming data structures in a type-safe manner. It provides runtime validation with full TypeScript type inference, making it ideal for parsing untrusted data from APIs, user inputs, configuration files, and databases.

**Key Benefits:**

- **Type-Safe Validation**: Automatically infer TypeScript types from schemas
- **Runtime Parsing**: Validate data at runtime with comprehensive error messages
- **Bidirectional Transformations**: Both decode (parse) and encode (serialize) data
- **Composable**: Build complex schemas from simple building blocks
- **Effect Integration**: Seamlessly works with Effect's error handling and dependency injection
- **Zero Additional Dependencies**: Built into Effect (no separate package needed)

### Installation

Schema is included in the Effect package:

```typescript
import { Schema } from 'effect'
// Effect v3.18.4 includes Schema
```

### Basic Schema Definition

Define schemas using `Schema.Struct` for objects and primitive types:

```typescript
import { Schema } from 'effect'

// Simple object schema
const PersonSchema = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
  email: Schema.String,
})

// Extract the TypeScript type
type Person = Schema.Schema.Type<typeof PersonSchema>
// Equivalent to: { name: string; age: number; email: string }

// Nested schemas
const CompanySchema = Schema.Struct({
  name: Schema.String,
  founded: Schema.Number,
  ceo: PersonSchema, // Reuse PersonSchema
})
```

### Decoding (Parsing Untrusted Data)

Decoding converts unknown data into validated, typed data:

```typescript
import { Schema } from 'effect'

const PersonSchema = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
})

// Synchronous decoding (throws on error)
const decodeSync = Schema.decodeUnknownSync(PersonSchema)

try {
  const person = decodeSync({ name: 'Alice', age: 30 })
  console.log(person) // { name: 'Alice', age: 30 } - typed as Person
} catch (error) {
  console.error('Validation failed:', error)
}

// Decoding with Effect (recommended)
const decodeEffect = Schema.decodeUnknown(PersonSchema)

const program = Effect.gen(function* () {
  // Parse API response data
  const untrustedData = yield* Effect.promise(() => fetch('/api/user').then((r) => r.json()))

  // Decode with error handling
  const validatedPerson = yield* decodeEffect(untrustedData)

  return validatedPerson // Typed as Person
})

// Handle parse errors
const safeProgram = program.pipe(
  Effect.catchTag('ParseError', (error) => {
    console.error('Failed to parse person:', error.message)
    return Effect.succeed(defaultPerson)
  })
)
```

### Encoding (Serialization)

Encoding converts validated data back to its original format:

```typescript
import { Schema } from 'effect'

const PersonSchema = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
})

const encode = Schema.encodeSync(PersonSchema)

const person = { name: 'Bob', age: 25 }
const encoded = encode(person) // Convert to serializable format
console.log(encoded) // { name: 'Bob', age: 25 }

// With transformations (e.g., Date to ISO string)
const EventSchema = Schema.Struct({
  title: Schema.String,
  date: Schema.Date, // Date object in TypeScript
})

const event = { title: 'Launch', date: new Date('2025-01-15') }
const encodedEvent = Schema.encodeSync(EventSchema)(event)
// date becomes ISO string when encoded
```

### Common Schema Types

#### Primitives

```typescript
import { Schema } from 'effect'

Schema.String // string
Schema.Number // number
Schema.Boolean // boolean
Schema.BigInt // bigint
Schema.Symbol // symbol
Schema.Date // Date object
Schema.Null // null
Schema.Undefined // undefined
Schema.Unknown // unknown (accepts anything)
Schema.Any // any (accepts anything)
Schema.Never // never (accepts nothing)
```

#### Literals

```typescript
// Specific string values
const StatusSchema = Schema.Literal('active', 'inactive', 'pending')
type Status = Schema.Schema.Type<typeof StatusSchema>
// Type: 'active' | 'inactive' | 'pending'

// Number literals
const VersionSchema = Schema.Literal(1, 2, 3)

// Mixed literals
const MixedSchema = Schema.Literal('yes', 'no', 0, 1, true, false)
```

#### Structs (Objects)

```typescript
// Basic struct
const UserSchema = Schema.Struct({
  id: Schema.Number,
  username: Schema.String,
  verified: Schema.Boolean,
})

// Nested structs
const PostSchema = Schema.Struct({
  title: Schema.String,
  content: Schema.String,
  author: UserSchema, // Nested schema
  tags: Schema.Array(Schema.String), // Array of strings
})

// Readonly structs (default behavior)
const ReadonlyUserSchema = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
})
// Type: { readonly id: number; readonly name: string }
```

#### Arrays

```typescript
// Array of strings
const StringArraySchema = Schema.Array(Schema.String)
type StringArray = Schema.Schema.Type<typeof StringArraySchema>
// Type: readonly string[]

// Array of objects
const UsersSchema = Schema.Array(
  Schema.Struct({
    name: Schema.String,
    age: Schema.Number,
  })
)

// Non-empty arrays
const NonEmptyStringArray = Schema.NonEmptyArray(Schema.String)
```

#### Records (Dictionary-like objects)

```typescript
// Record with string keys and number values
const ScoresSchema = Schema.Record({
  key: Schema.String,
  value: Schema.Number,
})
type Scores = Schema.Schema.Type<typeof ScoresSchema>
// Type: { readonly [x: string]: number }

// Record with specific key types
const UserRolesSchema = Schema.Record({
  key: Schema.String,
  value: Schema.Literal('admin', 'user', 'guest'),
})
```

#### Tuples

```typescript
// Fixed-length tuple [string, number]
const PairSchema = Schema.Tuple(Schema.String, Schema.Number)
type Pair = Schema.Schema.Type<typeof PairSchema>
// Type: readonly [string, number]

// Tuple with rest elements
const CoordinatesSchema = Schema.Tuple(Schema.Number, Schema.Number, Schema.Number)
// [x, y, z]
```

#### Unions

```typescript
// Union of types
const StringOrNumberSchema = Schema.Union(Schema.String, Schema.Number)
type StringOrNumber = Schema.Schema.Type<typeof StringOrNumberSchema>
// Type: string | number

// Discriminated union (recommended for objects)
const ShapeSchema = Schema.Union(
  Schema.Struct({
    kind: Schema.Literal('circle'),
    radius: Schema.Number,
  }),
  Schema.Struct({
    kind: Schema.Literal('rectangle'),
    width: Schema.Number,
    height: Schema.Number,
  })
)
```

#### Optional and Nullable

```typescript
import { Schema } from 'effect'

// Optional fields (can be missing or undefined)
const UserSchema = Schema.Struct({
  name: Schema.String,
  nickname: Schema.optional(Schema.String), // string | undefined
  age: Schema.Number,
})

// Nullable fields (can be null)
const ProfileSchema = Schema.Struct({
  bio: Schema.nullable(Schema.String), // string | null
  avatar: Schema.String,
})

// Nullish fields (can be null or undefined)
const SettingsSchema = Schema.Struct({
  theme: Schema.nullish(Schema.String), // string | null | undefined
})

// Optional with default value
const ConfigSchema = Schema.Struct({
  port: Schema.optional(Schema.Number).pipe(Schema.withDefault(() => 3000)),
})
```

### Validation and Refinements

Add validation rules to schemas using built-in filters:

```typescript
import { Schema } from 'effect'

// String validations
const EmailSchema = Schema.String.pipe(
  Schema.minLength(1, { message: () => 'Email is required' }),
  Schema.maxLength(255),
  Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: () => 'Invalid email format',
  })
)

const UsernameSchema = Schema.String.pipe(
  Schema.minLength(3, { message: () => 'Username must be at least 3 characters' }),
  Schema.maxLength(20),
  Schema.pattern(/^[a-zA-Z0-9_]+$/, {
    message: () => 'Username can only contain letters, numbers, and underscores',
  })
)

// Number validations
const AgeSchema = Schema.Number.pipe(
  Schema.greaterThanOrEqualTo(0, { message: () => 'Age must be non-negative' }),
  Schema.lessThanOrEqualTo(120, { message: () => 'Age must be realistic' })
)

const PositiveNumberSchema = Schema.Number.pipe(Schema.greaterThan(0))

const PercentageSchema = Schema.Number.pipe(
  Schema.greaterThanOrEqualTo(0),
  Schema.lessThanOrEqualTo(100)
)

// Array validations
const TagsSchema = Schema.Array(Schema.String).pipe(
  Schema.minItems(1, { message: () => 'At least one tag is required' }),
  Schema.maxItems(5, { message: () => 'Maximum 5 tags allowed' })
)

// Custom filters
const EvenNumberSchema = Schema.Number.pipe(
  Schema.filter((n) => n % 2 === 0, {
    message: () => 'Number must be even',
  })
)
```

### Schema Annotations

Add metadata to schemas for documentation and tooling:

```typescript
import { Schema } from 'effect'

const UserSchema = Schema.Struct({
  name: Schema.String.annotations({
    title: 'User Name',
    description: 'The full name of the user',
    examples: ['Alice Johnson', 'Bob Smith'],
  }),
  age: Schema.Number.annotations({
    title: 'Age',
    description: 'Age in years',
    examples: [25, 30, 45],
  }),
  email: Schema.String.annotations({
    title: 'Email Address',
    description: 'User email address for notifications',
    examples: ['alice@example.com'],
  }),
})

// Schema-level annotations
const AnnotatedUserSchema = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
}).annotations({
  identifier: 'User',
  title: 'User Schema',
  description: 'Represents a user in the system',
})
```

### Error Handling

Schema validation errors integrate with Effect's error handling:

```typescript
import { Schema, Effect, Data } from 'effect'

const UserSchema = Schema.Struct({
  name: Schema.String.pipe(Schema.minLength(1)),
  email: Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
  age: Schema.Number.pipe(Schema.greaterThanOrEqualTo(0)),
})

// Handle ParseError explicitly
const parseUser = (data: unknown): Effect.Effect<User, ParseError, never> =>
  Schema.decodeUnknown(UserSchema)(data)

const program = Effect.gen(function* () {
  const untrustedData = { name: '', email: 'invalid', age: -5 }

  const user = yield* parseUser(untrustedData).pipe(
    Effect.catchTag('ParseError', (error) => {
      // error.message contains detailed validation errors
      console.error('Validation failed:', error.message)

      // Return default user or re-throw
      return Effect.succeed(defaultUser)
    })
  )

  return user
})

// Custom error types
class InvalidUserDataError extends Data.TaggedError('InvalidUserDataError')<{
  cause: unknown
}> {}

const parseUserWithCustomError = (
  data: unknown
): Effect.Effect<User, InvalidUserDataError, never> =>
  Schema.decodeUnknown(UserSchema)(data).pipe(
    Effect.mapError((parseError) => new InvalidUserDataError({ cause: parseError }))
  )
```

### Transformations

Transform data during parsing and serialization:

```typescript
import { Schema } from 'effect'

// Transform string to Date
const DateFromString = Schema.transform(Schema.String, Schema.Date, {
  decode: (s) => new Date(s), // string → Date
  encode: (d) => d.toISOString(), // Date → string
})

// NumberFromString (built-in)
const ProductSchema = Schema.Struct({
  id: Schema.Number,
  price: Schema.NumberFromString, // "42.99" → 42.99
  quantity: Schema.Number,
})

// Trimmed string
const TrimmedString = Schema.transform(Schema.String, Schema.String, {
  decode: (s) => s.trim(),
  encode: (s) => s, // No transformation on encode
})

// JSON string to object
const JsonStringSchema = Schema.transform(Schema.String, Schema.Unknown, {
  decode: (s) => JSON.parse(s),
  encode: (obj) => JSON.stringify(obj),
})
```

### Practical Patterns for Omnera V2

#### Pattern 1: API Request Validation

```typescript
import { Schema, Effect, Data } from 'effect'

// Define request schema
const CreateUserRequest = Schema.Struct({
  username: Schema.String.pipe(
    Schema.minLength(3),
    Schema.maxLength(20),
    Schema.pattern(/^[a-zA-Z0-9_]+$/)
  ),
  email: Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
  password: Schema.String.pipe(Schema.minLength(8)),
})

type CreateUserRequest = Schema.Schema.Type<typeof CreateUserRequest>

// Define response schema
const UserResponse = Schema.Struct({
  id: Schema.Number,
  username: Schema.String,
  email: Schema.String,
  createdAt: Schema.Date,
})

type UserResponse = Schema.Schema.Type<typeof UserResponse>

// API handler with validation
class ValidationError extends Data.TaggedError('ValidationError')<{
  errors: string[]
}> {}

const createUserHandler = (
  requestBody: unknown
): Effect.Effect<UserResponse, ValidationError | DatabaseError, Database> =>
  Effect.gen(function* () {
    // Validate request
    const validatedRequest = yield* Schema.decodeUnknown(CreateUserRequest)(requestBody).pipe(
      Effect.mapError((parseError) => new ValidationError({ errors: [parseError.message] }))
    )

    // Save to database
    const db = yield* Database
    const user = yield* db.saveUser(validatedRequest)

    return user
  })
```

#### Pattern 2: Configuration Validation

```typescript
import { Schema } from 'effect'

// Define configuration schema
const AppConfig = Schema.Struct({
  port: Schema.Number.pipe(Schema.greaterThan(0), Schema.lessThan(65536)).annotations({
    description: 'Server port number',
  }),
  host: Schema.String.annotations({
    description: 'Server host address',
  }),
  database: Schema.Struct({
    url: Schema.String,
    maxConnections: Schema.Number.pipe(Schema.greaterThan(0)),
    ssl: Schema.Boolean,
  }),
  redis: Schema.optional(
    Schema.Struct({
      host: Schema.String,
      port: Schema.Number,
    })
  ),
  logLevel: Schema.Literal('debug', 'info', 'warn', 'error'),
})

type AppConfig = Schema.Schema.Type<typeof AppConfig>

// Load and validate configuration
const loadConfig = (): Effect.Effect<AppConfig, ConfigError, never> =>
  Effect.gen(function* () {
    // Load from environment or file
    const rawConfig = {
      port: Number(process.env.PORT) || 3000,
      host: process.env.HOST || 'localhost',
      database: {
        url: process.env.DATABASE_URL,
        maxConnections: 10,
        ssl: process.env.NODE_ENV === 'production',
      },
      logLevel: process.env.LOG_LEVEL || 'info',
    }

    // Validate configuration
    const validatedConfig = yield* Schema.decodeUnknown(AppConfig)(rawConfig).pipe(
      Effect.mapError((error) => new ConfigError({ message: error.message }))
    )

    return validatedConfig
  })
```

#### Pattern 3: Database Model Schemas

```typescript
import { Schema } from 'effect'

// Define database model
const UserModel = Schema.Struct({
  id: Schema.Number,
  username: Schema.String,
  email: Schema.String,
  passwordHash: Schema.String,
  role: Schema.Literal('admin', 'user', 'guest'),
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
  lastLogin: Schema.nullable(Schema.Date),
})

type User = Schema.Schema.Type<typeof UserModel>

// Define create DTO (Data Transfer Object)
const CreateUserDTO = Schema.Struct({
  username: Schema.String,
  email: Schema.String,
  password: Schema.String, // Plain password
  role: Schema.optional(Schema.Literal('admin', 'user', 'guest')).pipe(
    Schema.withDefault(() => 'user' as const)
  ),
})

type CreateUserDTO = Schema.Schema.Type<typeof CreateUserDTO>

// Define update DTO (partial updates)
const UpdateUserDTO = Schema.partial(
  Schema.Struct({
    username: Schema.String,
    email: Schema.String,
    role: Schema.Literal('admin', 'user', 'guest'),
  })
)

type UpdateUserDTO = Schema.Schema.Type<typeof UpdateUserDTO>

// Repository with schema validation
class UserRepository extends Context.Tag('UserRepository')<
  UserRepository,
  {
    readonly create: (dto: CreateUserDTO) => Effect.Effect<User, DatabaseError>
    readonly update: (id: number, dto: UpdateUserDTO) => Effect.Effect<User, DatabaseError>
    readonly findById: (id: number) => Effect.Effect<User | null, DatabaseError>
  }
>() {}
```

#### Pattern 4: Form Validation

```typescript
import { Schema, Effect } from 'effect'

// Define form schema
const RegistrationForm = Schema.Struct({
  username: Schema.String.pipe(
    Schema.minLength(3, { message: () => 'Username must be at least 3 characters' }),
    Schema.maxLength(20, { message: () => 'Username must be at most 20 characters' }),
    Schema.pattern(/^[a-zA-Z0-9_]+$/, {
      message: () => 'Username can only contain letters, numbers, and underscores',
    })
  ),
  email: Schema.String.pipe(
    Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: () => 'Please enter a valid email address',
    })
  ),
  password: Schema.String.pipe(
    Schema.minLength(8, { message: () => 'Password must be at least 8 characters' }),
    Schema.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: () => 'Password must contain uppercase, lowercase, and number',
    })
  ),
  confirmPassword: Schema.String,
  acceptTerms: Schema.Boolean.pipe(
    Schema.filter((value) => value === true, {
      message: () => 'You must accept the terms and conditions',
    })
  ),
})

// Add cross-field validation
const ValidatedRegistrationForm = RegistrationForm.pipe(
  Schema.filter((data) => data.password === data.confirmPassword, {
    message: () => 'Passwords do not match',
  })
)

type RegistrationFormData = Schema.Schema.Type<typeof ValidatedRegistrationForm>

// Validate form submission
const validateFormData = (
  formData: unknown
): Effect.Effect<RegistrationFormData, ValidationError, never> =>
  Schema.decodeUnknown(ValidatedRegistrationForm)(formData).pipe(
    Effect.mapError((error) => new ValidationError({ message: error.message }))
  )
```

#### Pattern 5: Environment Variable Parsing

```typescript
import { Schema, Effect } from 'effect'

// Define environment schema
const EnvSchema = Schema.Struct({
  NODE_ENV: Schema.Literal('development', 'production', 'test'),
  PORT: Schema.NumberFromString.pipe(Schema.greaterThan(0), Schema.lessThan(65536)),
  DATABASE_URL: Schema.String.pipe(Schema.minLength(1)),
  REDIS_URL: Schema.optional(Schema.String),
  LOG_LEVEL: Schema.optional(Schema.Literal('debug', 'info', 'warn', 'error')).pipe(
    Schema.withDefault(() => 'info' as const)
  ),
  MAX_UPLOAD_SIZE: Schema.NumberFromString.pipe(Schema.greaterThan(0)),
})

type Env = Schema.Schema.Type<typeof EnvSchema>

// Parse and validate environment variables
const loadEnv = (): Effect.Effect<Env, EnvError, never> =>
  Effect.gen(function* () {
    const rawEnv = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      DATABASE_URL: process.env.DATABASE_URL,
      REDIS_URL: process.env.REDIS_URL,
      LOG_LEVEL: process.env.LOG_LEVEL,
      MAX_UPLOAD_SIZE: process.env.MAX_UPLOAD_SIZE || '10485760', // 10MB default
    }

    const validatedEnv = yield* Schema.decodeUnknown(EnvSchema)(rawEnv).pipe(
      Effect.mapError(
        (error) =>
          new EnvError({
            message: `Invalid environment configuration: ${error.message}`,
          })
      )
    )

    return validatedEnv
  })

// Use in application startup
const startApp = Effect.gen(function* () {
  const env = yield* loadEnv()

  yield* Console.log(`Starting server on port ${env.PORT}`)
  yield* Console.log(`Environment: ${env.NODE_ENV}`)

  // Use validated environment configuration
  // ...
})
```

### Integration with Bun and TypeScript

```typescript
// schemas.ts - Define schemas
import { Schema } from 'effect'

export const UserSchema = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  email: Schema.String,
})

export type User = Schema.Schema.Type<typeof UserSchema>

// api.ts - Use schemas for validation
import { Effect } from 'effect'
import { UserSchema, type User } from './schemas'

const fetchUser = (id: number): Effect.Effect<User, ApiError, never> =>
  Effect.gen(function* () {
    const response = yield* Effect.tryPromise(() => fetch(`/api/users/${id}`).then((r) => r.json()))

    // Validate response data
    const validatedUser = yield* Schema.decodeUnknown(UserSchema)(response).pipe(
      Effect.mapError((error) => new ApiError({ message: error.message }))
    )

    return validatedUser
  })
```

**Type Checking:**

```bash
# TypeScript validates Schema types
bun run typecheck

# Bun executes Schema code directly
bun run src/index.ts
```

**Testing Schemas:**

```typescript
import { test, expect } from 'bun:test'
import { Schema, Effect } from 'effect'

const EmailSchema = Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))

test('should validate correct email', async () => {
  const result = await Effect.runPromise(
    Schema.decodeUnknown(EmailSchema)('user@example.com').pipe(Effect.either)
  )

  expect(result._tag).toBe('Right')
  expect(result.right).toBe('user@example.com')
})

test('should reject invalid email', async () => {
  const result = await Effect.runPromise(
    Schema.decodeUnknown(EmailSchema)('not-an-email').pipe(Effect.either)
  )

  expect(result._tag).toBe('Left')
  // result.left contains ParseError
})
```

### Schema vs Other Validation Libraries

| Feature                | Effect Schema                | Zod                       | Yup                   |
| ---------------------- | ---------------------------- | ------------------------- | --------------------- |
| **Type Inference**     | Full TypeScript inference    | Full TypeScript inference | Partial inference     |
| **Error Handling**     | Effect-based (composable)    | try/catch or Either       | try/catch or Promises |
| **Transformations**    | Built-in decode/encode       | Built-in transform        | Built-in transform    |
| **Effect Integration** | Native (same package)        | Manual integration        | Manual integration    |
| **Performance**        | Fast (optimized)             | Fast                      | Slower                |
| **Async Validation**   | Effect-based (first-class)   | Promise-based             | Promise-based         |
| **Dependencies**       | None (built into Effect)     | None                      | None                  |
| **Type Safety**        | Excellent (Effect types)     | Excellent                 | Good                  |
| **Composability**      | Excellent (Effect ecosystem) | Good                      | Good                  |
| **Learning Curve**     | Medium (Effect knowledge)    | Low                       | Low                   |
| **Documentation**      | Comprehensive                | Excellent                 | Good                  |

**Why Effect Schema for Omnera V2:**

- **Native Integration**: Already using Effect, no additional dependency
- **Type Safety**: Full TypeScript inference with Effect types
- **Error Handling**: Seamless integration with Effect's error handling
- **Composability**: Works naturally with Effect.gen and dependency injection
- **Performance**: Optimized for Effect runtime
- **Consistency**: Same error handling patterns across codebase

### Best Practices for Schema Usage

1. **Define Schemas Close to Usage**
   - Co-locate schemas with the code that uses them
   - Export both schema and type: `export const UserSchema` and `export type User`

2. **Use Descriptive Names**
   - Schema variables: `UserSchema`, `CreateUserRequest`, `UpdateUserDTO`
   - Types: `User`, `CreateUserRequest`, `UpdateUserDTO`

3. **Add Annotations for Documentation**
   - Document fields with `annotations({ description, examples })`
   - Helps with API documentation generation

4. **Validate at System Boundaries**
   - API endpoints (request/response validation)
   - Configuration loading
   - Database queries (validate external data)
   - User inputs (forms, CLI arguments)

5. **Use Effect Error Handling**
   - Always handle `ParseError` explicitly
   - Map to custom error types when appropriate
   - Provide user-friendly error messages

6. **Leverage Type Extraction**
   - Use `Schema.Schema.Type<typeof Schema>` for decoded types
   - Use `Schema.Schema.Encoded<typeof Schema>` for encoded types

7. **Build Reusable Schemas**
   - Extract common validation patterns (email, password, URL)
   - Compose complex schemas from simple ones
   - Share schemas across API and database layers

8. **Test Schema Validation**
   - Write unit tests for custom schemas
   - Test both success and failure cases
   - Verify error messages are clear

9. **Use Transformations Wisely**
   - Transform only when necessary (e.g., `Date` ↔ string)
   - Keep transformations simple and pure
   - Document transformation behavior

10. **Avoid Over-Validation**
    - Don't validate internal data that's already trusted
    - Use schemas for external data sources
    - Balance safety with performance

### Common Pitfalls to Avoid

- ❌ Validating data that's already validated (double validation)
- ❌ Not handling ParseError (letting it propagate unhandled)
- ❌ Using schemas for non-external data (internal, already-typed data)
- ❌ Ignoring encoding direction (only focusing on decoding)
- ❌ Creating overly complex schemas (break into smaller pieces)
- ❌ Not extracting types with `Schema.Schema.Type<typeof Schema>`
- ❌ Using `any` or `unknown` when a specific schema exists
- ❌ Not testing validation logic (especially custom filters)

### When to Use Schema

**Use Schema for:**

- API request/response validation
- Configuration file parsing
- Environment variable validation
- Database query results (from external sources)
- User input validation (forms, CLI)
- File parsing (JSON, CSV, etc.)
- Third-party API responses

**Don't use Schema for:**

- Internal function parameters (use TypeScript types)
- Already-validated data (avoid double validation)
- Performance-critical hot paths (validation has overhead)
- Simple type assertions (use TypeScript type guards)

### References

- Effect Schema documentation: https://effect.website/docs/schema/introduction
- Schema API reference: https://effect-ts.github.io/effect/schema/Schema.html
- Effect GitHub examples: https://github.com/Effect-TS/effect/tree/main/packages/schema

## Core Concepts

### 1. Creating Effects

```typescript
import { Effect } from 'effect'

// Success value
const success = Effect.succeed(42)

// Failure value
const failure = Effect.fail(new Error('Something went wrong'))

// From a synchronous function
const sync = Effect.sync(() => Math.random())

// From a Promise
const async = Effect.promise(() => fetch('https://api.example.com'))

// Try/catch wrapper
const tryEffect = Effect.try({
  try: () => JSON.parse(input),
  catch: (error) => new ParseError({ cause: error }),
})

// Generator style (recommended for complex logic)
const program = Effect.gen(function* () {
  const x = yield* Effect.succeed(10)
  const y = yield* Effect.succeed(20)
  return x + y
})
```

### 2. Error Handling

Effect makes errors explicit in the type system:

```typescript
import { Effect, Data } from 'effect'

// Define custom error types
class NetworkError extends Data.TaggedError('NetworkError')<{
  reason: string
  statusCode: number
}> {}

class ValidationError extends Data.TaggedError('ValidationError')<{
  field: string
  message: string
}> {}

// Effect with explicit error type
const fetchData: Effect.Effect<string, NetworkError, never> = Effect.gen(function* () {
  const response = yield* Effect.tryPromise({
    try: () => fetch('https://api.example.com/data'),
    catch: (error) => new NetworkError({ reason: String(error), statusCode: 500 }),
  })

  if (!response.ok) {
    return yield* Effect.fail(
      new NetworkError({
        reason: 'Request failed',
        statusCode: response.status,
      })
    )
  }

  return yield* Effect.promise(() => response.text())
})

// Handle errors explicitly
const program = fetchData.pipe(
  Effect.catchTag('NetworkError', (error) =>
    Effect.succeed(`Failed with status ${error.statusCode}`)
  )
)

// Catch all errors
const withFallback = fetchData.pipe(Effect.catchAll((error) => Effect.succeed('default value')))

// Retry on failure
const withRetry = fetchData.pipe(Effect.retry({ times: 3 }))

// Add timeout
const withTimeout = fetchData.pipe(Effect.timeout('5 seconds'))
```

### 3. Dependency Injection with Context and Layers

```typescript
import { Effect, Context, Layer } from 'effect'

// Define a service interface
class UserRepository extends Context.Tag('UserRepository')<
  UserRepository,
  {
    readonly findById: (id: number) => Effect.Effect<User, DatabaseError>
    readonly save: (user: User) => Effect.Effect<void, DatabaseError>
  }
>() {}

class Logger extends Context.Tag('Logger')<
  Logger,
  {
    readonly info: (message: string) => Effect.Effect<void>
    readonly error: (message: string) => Effect.Effect<void>
  }
>() {}

// Use services in your program
const getUserById = (id: number): Effect.Effect<User, DatabaseError, UserRepository> =>
  Effect.gen(function* () {
    const repo = yield* UserRepository
    const user = yield* repo.findById(id)
    return user
  })

// Provide implementations via Layers
const UserRepositoryLive = Layer.succeed(UserRepository, {
  findById: (id) =>
    Effect.gen(function* () {
      // Actual database implementation
      const db = yield* Database
      return yield* db.query('SELECT * FROM users WHERE id = ?', [id])
    }),
  save: (user) =>
    Effect.gen(function* () {
      const db = yield* Database
      yield* db.execute('UPDATE users SET ...', [user])
    }),
})

const LoggerLive = Layer.succeed(Logger, {
  info: (message) => Console.log(`[INFO] ${message}`),
  error: (message) => Console.error(`[ERROR] ${message}`),
})

// Combine layers
const AppLayer = Layer.mergeAll(UserRepositoryLive, LoggerLive)

// Run program with provided dependencies
const program = getUserById(1)
const runnable = Effect.provide(program, AppLayer)

Effect.runPromise(runnable).then(console.log)
```

### 4. Structured Concurrency with Fibers

```typescript
import { Effect, Fiber } from 'effect'

// Run effects in parallel
const parallel = Effect.all([fetchUser(1), fetchUser(2), fetchUser(3)], { concurrency: 3 })

// Race multiple effects (first to complete wins)
const raced = Effect.race(fetchFromCache, fetchFromDatabase)

// Fork effect into a fiber (background task)
const program = Effect.gen(function* () {
  const fiber = yield* Effect.fork(longRunningTask)

  // Do other work...

  // Wait for fiber to complete
  const result = yield* Fiber.join(fiber)

  return result
})

// Interrupt fiber if it takes too long
const withTimeout = Effect.gen(function* () {
  const fiber = yield* Effect.fork(longRunningTask)
  const result = yield* Fiber.join(fiber).pipe(Effect.timeout('10 seconds'))
  return result
})
```

### 5. Resource Management with Scope

```typescript
import { Effect } from 'effect'

// Acquire resource with automatic cleanup
const withConnection = Effect.acquireRelease(
  Effect.sync(() => openDatabaseConnection()), // acquire
  (conn) => Effect.sync(() => conn.close()) // release
)

// Use resource (cleanup happens automatically)
const program = Effect.gen(function* () {
  const conn = yield* withConnection
  const result = yield* conn.query('SELECT * FROM users')
  return result
  // Connection automatically closed here, even if error occurs
})
```

## Running Effects

Effects are lazy and must be explicitly run:

```typescript
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  yield* Console.log('Hello, Effect!')
  return 42
})

// Synchronous execution (blocks until complete)
const result = Effect.runSync(program)
console.log(result) // 42

// Asynchronous execution (returns Promise)
Effect.runPromise(program).then(console.log)

// With error handling
Effect.runPromise(program)
  .then((value) => console.log('Success:', value))
  .catch((error) => console.error('Error:', error))

// Get an Either result (no throw)
const either = await Effect.runPromise(Effect.either(program))
if (either._tag === 'Right') {
  console.log('Success:', either.right)
} else {
  console.log('Failure:', either.left)
}
```

## Common Patterns

### Pattern 1: API Request with Error Handling

```typescript
import { Effect, Data } from 'effect'

class ApiError extends Data.TaggedError('ApiError')<{
  message: string
  statusCode: number
}> {}

const fetchUser = (id: number): Effect.Effect<User, ApiError, never> =>
  Effect.gen(function* () {
    const response = yield* Effect.tryPromise({
      try: () => fetch(`https://api.example.com/users/${id}`),
      catch: () => new ApiError({ message: 'Network error', statusCode: 0 }),
    })

    if (!response.ok) {
      return yield* Effect.fail(
        new ApiError({
          message: 'Failed to fetch user',
          statusCode: response.status,
        })
      )
    }

    const json = yield* Effect.tryPromise({
      try: () => response.json(),
      catch: () => new ApiError({ message: 'Invalid JSON', statusCode: response.status }),
    })

    return json as User
  }).pipe(
    Effect.retry({ times: 3, schedule: Schedule.exponential('100 millis') }),
    Effect.timeout('5 seconds')
  )
```

### Pattern 2: Service Layer with Dependencies

```typescript
import { Effect, Context, Layer } from 'effect'

// Define services
class Database extends Context.Tag('Database')<
  Database,
  { query: (sql: string) => Effect.Effect<unknown[]> }
>() {}

class Cache extends Context.Tag('Cache')<
  Cache,
  {
    get: (key: string) => Effect.Effect<string | null>
    set: (key: string, value: string) => Effect.Effect<void>
  }
>() {}

// Business logic using services
const getUserWithCache = (id: number): Effect.Effect<User, DatabaseError, Database | Cache> =>
  Effect.gen(function* () {
    const cache = yield* Cache
    const db = yield* Database

    // Try cache first
    const cached = yield* cache.get(`user:${id}`)
    if (cached) return JSON.parse(cached)

    // Fallback to database
    const rows = yield* db.query(`SELECT * FROM users WHERE id = ${id}`)
    const user = parseUser(rows[0])

    // Update cache
    yield* cache.set(`user:${id}`, JSON.stringify(user))

    return user
  })

// Provide implementations
const DatabaseLive = Layer.succeed(Database, {
  query: (sql) => Effect.promise(() => pool.query(sql)),
})

const CacheLive = Layer.succeed(Cache, {
  get: (key) => Effect.promise(() => redis.get(key)),
  set: (key, value) => Effect.promise(() => redis.set(key, value)),
})

const AppLayer = Layer.mergeAll(DatabaseLive, CacheLive)

// Run with dependencies
const program = getUserWithCache(1)
Effect.runPromise(Effect.provide(program, AppLayer))
```

### Pattern 3: Parallel Operations

```typescript
import { Effect } from 'effect'

// Process multiple users in parallel
const processUsers = (ids: number[]): Effect.Effect<User[], ApiError, UserService> =>
  Effect.all(
    ids.map((id) => fetchUser(id)),
    { concurrency: 5 }
  )

// Process with batching
const batchedProcess = (ids: number[]): Effect.Effect<User[], ApiError, UserService> =>
  Effect.gen(function* () {
    const batches = chunk(ids, 10) // Split into batches of 10

    const results = yield* Effect.forEach(
      batches,
      (batch) => Effect.all(batch.map(fetchUser), { concurrency: 10 }),
      { concurrency: 2 } // Process 2 batches at a time
    )

    return results.flat()
  })
```

## Integration with Bun Test

Effect provides excellent testing support:

```typescript
import { test, expect } from 'bun:test'
import { Effect, Layer, Context } from 'effect'

// Define service
class EmailService extends Context.Tag('EmailService')<
  EmailService,
  { send: (to: string, body: string) => Effect.Effect<void> }
>() {}

// Function to test
const sendWelcomeEmail = (email: string): Effect.Effect<void, never, EmailService> =>
  Effect.gen(function* () {
    const emailService = yield* EmailService
    yield* emailService.send(email, 'Welcome!')
  })

// Test with mocked service
test('should send welcome email', async () => {
  let sentEmails: Array<{ to: string; body: string }> = []

  const MockEmailService = Layer.succeed(EmailService, {
    send: (to, body) =>
      Effect.sync(() => {
        sentEmails.push({ to, body })
      }),
  })

  const program = sendWelcomeEmail('user@example.com')
  const result = Effect.provide(program, MockEmailService)

  await Effect.runPromise(result)

  expect(sentEmails).toHaveLength(1)
  expect(sentEmails[0].to).toBe('user@example.com')
  expect(sentEmails[0].body).toBe('Welcome!')
})

// Test error handling
test('should handle email service failure', async () => {
  class EmailError extends Data.TaggedError('EmailError')<{ reason: string }> {}

  const FailingEmailService = Layer.succeed(EmailService, {
    send: () => Effect.fail(new EmailError({ reason: 'SMTP connection failed' })),
  })

  const program = sendWelcomeEmail('user@example.com').pipe(
    Effect.catchTag('EmailError', (error) => Effect.succeed(`Error: ${error.reason}`))
  )

  const result = await Effect.runPromise(Effect.provide(program, FailingEmailService))

  expect(result).toBe('Error: SMTP connection failed')
})
```

## Effect vs Promise

| Feature             | Promise                      | Effect                                |
| ------------------- | ---------------------------- | ------------------------------------- |
| **Error Type**      | `unknown` (not typed)        | Explicit error type `Effect<A, E, R>` |
| **Dependencies**    | Global state, DI frameworks  | Built-in type-safe context            |
| **Cancellation**    | Not supported                | Full interruption support             |
| **Lazy Evaluation** | Eager (starts immediately)   | Lazy (starts when run)                |
| **Retries**         | Manual implementation        | Built-in `Effect.retry()`             |
| **Timeout**         | Manual with `Promise.race()` | Built-in `Effect.timeout()`           |
| **Resource Safety** | Manual cleanup               | Automatic with `acquireRelease`       |
| **Composability**   | Limited                      | Highly composable                     |
| **Type Safety**     | Partial (success only)       | Full (success, error, requirements)   |
| **Testing**         | Requires mocking frameworks  | Built-in dependency injection         |

## Effect vs Try/Catch

```typescript
// Traditional try/catch
async function fetchUserOldWay(id: number): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) throw new Error('Request failed')
    return await response.json()
  } catch (error) {
    // Error type is 'unknown' - not type-safe
    console.error(error)
    throw error
  }
}

// Effect way
class NetworkError extends Data.TaggedError('NetworkError')<{ statusCode: number }> {}
class ParseError extends Data.TaggedError('ParseError')<{ cause: unknown }> {}

const fetchUserEffectWay = (id: number): Effect.Effect<User, NetworkError | ParseError, never> =>
  Effect.gen(function* () {
    const response = yield* Effect.tryPromise({
      try: () => fetch(`/api/users/${id}`),
      catch: () => new NetworkError({ statusCode: 0 }),
    })

    if (!response.ok) {
      return yield* Effect.fail(new NetworkError({ statusCode: response.status }))
    }

    const json = yield* Effect.tryPromise({
      try: () => response.json(),
      catch: (cause) => new ParseError({ cause }),
    })

    return json as User
  })

// Type-safe error handling
const program = fetchUserEffectWay(1).pipe(
  Effect.catchTag('NetworkError', (error) => {
    // TypeScript knows error is NetworkError
    console.log('Network error:', error.statusCode)
    return Effect.succeed(defaultUser)
  }),
  Effect.catchTag('ParseError', (error) => {
    // TypeScript knows error is ParseError
    console.log('Parse error:', error.cause)
    return Effect.succeed(defaultUser)
  })
)
```

## Best Practices for Omnera V2

1. **Use Effect for I/O Operations**
   - Database queries
   - HTTP requests
   - File system operations
   - External API calls

2. **Define Explicit Error Types**
   - Use `Data.TaggedError` for custom errors
   - Make errors descriptive and actionable
   - Leverage TypeScript's type narrowing in error handlers

3. **Leverage Dependency Injection**
   - Define services with `Context.Tag`
   - Provide implementations with `Layer`
   - Keep business logic pure and testable

4. **Use Effect.gen for Complex Logic**
   - Generator syntax is more readable than `.pipe()`
   - Use `yield*` to unwrap Effect values
   - Combine multiple effects naturally

5. **Add Retry and Timeout Policies**
   - Always add timeouts to network operations
   - Use exponential backoff for retries
   - Set reasonable limits based on use case

6. **Handle Resources Properly**
   - Use `acquireRelease` for resources that need cleanup
   - Let Effect manage lifecycle automatically
   - Avoid manual resource management

7. **Test with Mocked Services**
   - Use `Layer` to provide mock implementations
   - Test success and failure paths
   - Verify error handling logic

8. **Keep Effects Composable**
   - Break complex logic into smaller effects
   - Compose effects using `pipe()` or `Effect.gen`
   - Reuse common patterns across codebase

9. **Run Effects at Boundaries**
   - Keep core logic as pure Effect values
   - Run effects only at application boundaries (HTTP handlers, CLI entry points)
   - Delay execution as long as possible

10. **Document Effect Signatures**
    - Clearly document error types
    - Specify required services in function signatures
    - Use descriptive names for custom error classes

## Common Pitfalls to Avoid

- ❌ Running effects inside other effects without `yield*`
- ❌ Using `Effect.runSync` with async operations (use `Effect.runPromise`)
- ❌ Mixing Promise and Effect without proper conversion
- ❌ Forgetting to provide required services (type error at runtime)
- ❌ Using `any` or `unknown` for error types (defeats purpose)
- ❌ Creating services without proper cleanup in `acquireRelease`
- ❌ Not handling errors explicitly (unhandled errors bubble up)

## When to Use Effect

**Use Effect for:**

- Database interactions
- HTTP API calls
- File system operations
- Complex business logic with multiple dependencies
- Operations requiring retries, timeouts, or cancellation
- Code requiring comprehensive error handling
- Logic that benefits from dependency injection

**Don't use Effect for:**

- Simple synchronous computations (use plain functions)
- Pure utility functions (use regular TypeScript)
- One-off scripts where type safety isn't critical
- Performance-critical hot paths (Effect has overhead)

## Integration with Existing Stack

| Tool            | Integration Point | Notes                                       |
| --------------- | ----------------- | ------------------------------------------- |
| **Bun Runtime** | Native execution  | Effect TypeScript runs directly in Bun      |
| **TypeScript**  | Type checking     | Use `tsc --noEmit` to validate Effect types |
| **Bun Test**    | Testing framework | Mock services with Layer for testing        |
| **ESLint**      | Code quality      | ESLint rules apply to Effect code           |
| **Prettier**    | Code formatting   | Prettier formats Effect code automatically  |

## Performance Considerations

- Effect has minimal runtime overhead (fiber-based)
- Lazy evaluation allows for optimization opportunities
- Structured concurrency prevents resource leaks
- Fiber interruption is efficient and immediate
- Type-level computations happen at compile time

## Running Effect in Bun

```typescript
// src/index.ts
import { Effect, Console } from 'effect'

const program = Effect.gen(function* () {
  yield* Console.log('Starting application...')

  // Your application logic here
  const result = yield* performWork()

  yield* Console.log('Application completed!')
  return result
})

// Run with Bun
Effect.runPromise(program)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Application error:', error)
    process.exit(1)
  })
```

```bash
# Execute with Bun
bun run src/index.ts

# Watch mode
bun --watch src/index.ts
```

## References

- Effect documentation: https://effect.website/docs/introduction
- API reference: https://effect-ts.github.io/effect/
- Effect examples: https://github.com/Effect-TS/effect/tree/main/packages/effect/examples
- Discord community: https://discord.gg/effect-ts
- GitHub repository: https://github.com/Effect-TS/effect
