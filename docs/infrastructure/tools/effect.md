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
