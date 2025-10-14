# Effect Schema - Type-Safe Data Validation

> Part of [Effect Framework Documentation](./effect.md)

## Overview

Effect Schema is a powerful built-in module for defining, validating, parsing, and transforming data structures in a type-safe manner. It provides runtime validation with full TypeScript type inference, making it ideal for parsing untrusted data from APIs, user inputs, configuration files, and databases.

**Key Benefits:**

- **Type-Safe Validation**: Automatically infer TypeScript types from schemas
- **Runtime Parsing**: Validate data at runtime with comprehensive error messages
- **Bidirectional Transformations**: Both decode (parse) and encode (serialize) data
- **Composable**: Build complex schemas from simple building blocks
- **Effect Integration**: Seamlessly works with Effect's error handling and dependency injection
- **Zero Additional Dependencies**: Built into Effect (no separate package needed)

## Installation

Schema is included in the Effect package:

```typescript
import { Schema } from 'effect'
// Effect v3.18.4 includes Schema
```

## Basic Schema Definition

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

## Decoding (Parsing Untrusted Data)

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

## Encoding (Serialization)

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

## Common Schema Types

### Primitives

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

### Literals

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

### Structs (Objects)

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

### Arrays

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

### Records (Dictionary-like objects)

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

### Tuples

```typescript
// Fixed-length tuple [string, number]
const PairSchema = Schema.Tuple(Schema.String, Schema.Number)
type Pair = Schema.Schema.Type<typeof PairSchema>
// Type: readonly [string, number]

// Tuple with rest elements
const CoordinatesSchema = Schema.Tuple(Schema.Number, Schema.Number, Schema.Number)
// [x, y, z]
```

### Unions

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

### Optional and Nullable

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

## Validation and Refinements

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

## Schema Annotations

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

## Error Handling

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

## Transformations

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

## Practical Patterns for Omnera

### Pattern 1: API Request Validation

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

### Pattern 2: Configuration Validation

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

### Pattern 3: Database Model Schemas

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

### Pattern 4: Form Validation

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

### Pattern 5: Environment Variable Parsing

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

## Integration with Bun and TypeScript

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

## Schema vs Other Validation Libraries

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

**Why Effect Schema for Omnera:**

- **Native Integration**: Already using Effect, no additional dependency
- **Type Safety**: Full TypeScript inference with Effect types
- **Error Handling**: Seamless integration with Effect's error handling
- **Composability**: Works naturally with Effect.gen and dependency injection
- **Performance**: Optimized for Effect runtime
- **Consistency**: Same error handling patterns across codebase

## Best Practices for Schema Usage

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

## Common Pitfalls to Avoid

- ❌ Validating data that's already validated (double validation)
- ❌ Not handling ParseError (letting it propagate unhandled)
- ❌ Using schemas for non-external data (internal, already-typed data)
- ❌ Ignoring encoding direction (only focusing on decoding)
- ❌ Creating overly complex schemas (break into smaller pieces)
- ❌ Not extracting types with `Schema.Schema.Type<typeof Schema>`
- ❌ Using `any` or `unknown` when a specific schema exists
- ❌ Not testing validation logic (especially custom filters)

## When to Use Schema

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

## See Also

- [Effect Framework Overview](./effect.md)
- [Effect Patterns](./effect-patterns.md)
- [Effect Testing](./effect-testing.md)

## References

- Effect Schema documentation: https://effect.website/docs/schema/introduction
- Schema API reference: https://effect-ts.github.io/effect/schema/Schema.html
- Effect GitHub examples: https://github.com/Effect-TS/effect/tree/main/packages/schema
