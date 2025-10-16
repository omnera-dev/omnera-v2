# Effect.ts - Typed Functional Programming Library

## Overview

**Version**: 3.18.4
**Purpose**: Comprehensive typed functional programming library for building robust, composable, and maintainable TypeScript applications with explicit error handling, dependency injection, and structured concurrency

Effect.ts is a powerful library that brings advanced functional programming patterns to TypeScript. It provides a complete toolkit for managing complexity in modern applications through type-safe effects, composable operations, and declarative error handling.

## Why Effect for Omnera

- **Type-Safe Error Handling**: Errors are tracked at the type level, making them impossible to ignore
- **Dependency Injection**: Built-in, type-safe dependency injection via Context and Layer
- **Composability**: Build complex workflows from simple, reusable building blocks
- **Structured Concurrency**: Safe concurrent programming with Fibers (lightweight threads)
- **Testability**: Pure functional core makes testing trivial without mocks
- **Resource Management**: Automatic cleanup with Scope for safe resource handling
- **Performance**: Highly optimized runtime with efficient memory usage
- **Excellent TypeScript Integration**: First-class TypeScript support with full type inference

## Core Concepts

### 1. Effect Type

The `Effect` type represents a program that may succeed with a value, fail with an error, or require dependencies:

```typescript
Effect<Success, Error, Requirements>
```

**Type Parameters:**
- `Success` - The type of value produced on success
- `Error` - The type of error that can occur
- `Requirements` - The dependencies (Context) needed to run

**Examples:**

```typescript
import { Effect } from 'effect'

// Effect that always succeeds with number 42
const success: Effect.Effect<number, never, never> = Effect.succeed(42)

// Effect that may fail with UserNotFoundError
const fetchUser: Effect.Effect<User, UserNotFoundError, never> = Effect.tryPromise({
  try: () => fetch('/api/users/1').then((res) => res.json()),
  catch: () => new UserNotFoundError(),
})

// Effect requiring Database service
const saveUser: Effect.Effect<void, DatabaseError, Database> = Effect.gen(function* () {
  const db = yield* Database
  yield* db.save(user)
})
```

### 2. Effect Constructors

Create Effect programs from values, functions, or promises:

```typescript
import { Effect } from 'effect'

// Success value
const num = Effect.succeed(42)

// Failure value
const err = Effect.fail(new Error('Something went wrong'))

// Synchronous function (no side effects)
const sync = Effect.sync(() => Math.random())

// Asynchronous promise
const async = Effect.promise(() => fetch('/api/data').then((res) => res.json()))

// Promise with error handling
const tryAsync = Effect.tryPromise({
  try: () => fetch('/api/data').then((res) => res.json()),
  catch: (error) => new ApiError({ cause: error }),
})

// Lazy evaluation
const lazy = Effect.suspend(() => Effect.succeed(expensiveComputation()))
```

### 3. Effect Transformations (map, flatMap, tap)

Transform Effect values using functional operations:

```typescript
import { Effect } from 'effect'

// map - Transform success value
const doubled = Effect.succeed(21).pipe(Effect.map((n) => n * 2)) // Effect<42, never, never>

// flatMap - Chain dependent operations
const program = fetchUser(1).pipe(
  Effect.flatMap((user) => fetchUserPosts(user.id)),
  Effect.flatMap((posts) => fetchPostComments(posts[0].id))
)

// tap - Side effect without changing value (for logging, etc.)
const logged = fetchUser(1).pipe(
  Effect.tap((user) => Effect.sync(() => console.log('Fetched user:', user.name)))
)

// andThen - Simpler flatMap syntax
const simple = fetchUser(1).pipe(Effect.andThen((user) => fetchUserPosts(user.id)))
```

### 4. Error Handling

Effect provides comprehensive, type-safe error handling:

```typescript
import { Effect } from 'effect'

// catchAll - Handle all errors
const withFallback = fetchUser(1).pipe(
  Effect.catchAll((error) => Effect.succeed(defaultUser))
)

// catchTag - Handle specific error types
const tagged = fetchUser(1).pipe(
  Effect.catchTag('UserNotFoundError', () => Effect.succeed(defaultUser)),
  Effect.catchTag('NetworkError', (error) => Effect.fail(new ServiceUnavailableError()))
)

// orElse - Provide alternative Effect
const alternative = fetchUser(1).pipe(
  Effect.orElse(() => fetchUserFromCache(1))
)

// retry - Retry failed operations
const resilient = fetchUser(1).pipe(
  Effect.retry({
    times: 3,
    schedule: Schedule.exponential('100 millis'),
  })
)

// either - Convert errors to Either type
const either = fetchUser(1).pipe(Effect.either)
// Effect<Either<User, UserNotFoundError>, never, never>
```

### 5. Dependency Injection (Context & Layer)

Effect provides type-safe dependency injection:

```typescript
import { Effect, Context, Layer } from 'effect'

// Define service interface
class Database extends Context.Tag('Database')<
  Database,
  {
    readonly query: (sql: string) => Effect.Effect<unknown[], DatabaseError>
    readonly execute: (sql: string) => Effect.Effect<void, DatabaseError>
  }
>() {}

class Logger extends Context.Tag('Logger')<
  Logger,
  {
    readonly info: (message: string) => Effect.Effect<void>
    readonly error: (message: string) => Effect.Effect<void>
  }
>() {}

// Use services in program
const program = Effect.gen(function* () {
  const db = yield* Database
  const logger = yield* Logger

  yield* logger.info('Starting query')
  const results = yield* db.query('SELECT * FROM users')
  yield* logger.info(`Found ${results.length} users`)

  return results
})

// Type: Effect<unknown[], DatabaseError, Database | Logger>

// Provide implementations
const DatabaseLive = Layer.succeed(Database, {
  query: (sql) => Effect.tryPromise({
    try: () => pool.query(sql),
    catch: (error) => new DatabaseError({ cause: error }),
  }),
  execute: (sql) => Effect.tryPromise({
    try: () => pool.execute(sql),
    catch: (error) => new DatabaseError({ cause: error }),
  }),
})

const LoggerLive = Layer.succeed(Logger, {
  info: (message) => Effect.sync(() => console.log(`[INFO] ${message}`)),
  error: (message) => Effect.sync(() => console.error(`[ERROR] ${message}`)),
})

// Compose layers
const AppLayer = Layer.mergeAll(DatabaseLive, LoggerLive)

// Run program with dependencies
Effect.runPromise(Effect.provide(program, AppLayer))
```

### 6. Concurrency (Fiber, all, race)

Effect provides structured concurrency with Fibers:

```typescript
import { Effect, Fiber } from 'effect'

// Sequential execution (default)
const sequential = Effect.gen(function* () {
  const user = yield* fetchUser(1)
  const posts = yield* fetchUserPosts(user.id)
  return { user, posts }
})

// Parallel execution with Effect.all
const parallel = Effect.all({
  user: fetchUser(1),
  posts: fetchUserPosts(1),
  stats: fetchStats(),
})

// Parallel with array
const users = Effect.all([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3),
])

// Controlled concurrency
const controlled = Effect.forEach(
  [1, 2, 3, 4, 5],
  (id) => fetchUser(id),
  { concurrency: 2 } // Max 2 concurrent requests
)

// Race - First to complete wins
const raced = Effect.race(
  fetchFromPrimaryAPI(),
  fetchFromBackupAPI()
)

// Timeout
const timed = fetchUser(1).pipe(
  Effect.timeout('5 seconds')
)

// Fork to background fiber
const forked = Effect.gen(function* () {
  const fiber = yield* Effect.fork(longRunningTask())
  // Do other work
  const result = yield* Fiber.join(fiber)
  return result
})
```

### 7. Effect.gen (Generator Syntax)

Effect.gen provides async/await-like syntax for Effect programs:

```typescript
import { Effect } from 'effect'

// Using Effect.gen (recommended)
const program = Effect.gen(function* () {
  const user = yield* fetchUser(1)
  const posts = yield* fetchUserPosts(user.id)
  const comments = yield* fetchPostComments(posts[0].id)

  return {
    user,
    posts,
    comments,
  }
})

// Equivalent using pipe (more verbose)
const programPipe = fetchUser(1).pipe(
  Effect.flatMap((user) =>
    fetchUserPosts(user.id).pipe(
      Effect.flatMap((posts) =>
        fetchPostComments(posts[0].id).pipe(
          Effect.map((comments) => ({
            user,
            posts,
            comments,
          }))
        )
      )
    )
  )
)

// Error handling in Effect.gen
const resilient = Effect.gen(function* () {
  const user = yield* fetchUser(1).pipe(
    Effect.catchAll(() => Effect.succeed(defaultUser))
  )

  const posts = yield* fetchUserPosts(user.id).pipe(
    Effect.catchAll(() => Effect.succeed([]))
  )

  return { user, posts }
})
```

### 8. Running Effects

Effect programs are pure descriptions - they don't execute until explicitly run:

```typescript
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  const user = yield* fetchUser(1)
  return user
})

// Run as Promise (most common)
Effect.runPromise(program)
  .then((user) => console.log('Success:', user))
  .catch((error) => console.error('Error:', error))

// Run synchronously (must not have async operations)
const result = Effect.runSync(Effect.succeed(42)) // 42

// Run with callback
Effect.runCallback(program, (exit) => {
  if (exit._tag === 'Success') {
    console.log('Success:', exit.value)
  } else {
    console.error('Failure:', exit.cause)
  }
})

// Run in Fiber (background)
Effect.runFork(program)
```

## Common Patterns in Omnera

### Pattern 1: API Request with Error Handling

```typescript
import { Effect, Data } from 'effect'

// Define error types
class ApiError extends Data.TaggedError('ApiError')<{
  readonly status: number
  readonly message: string
}> {}

class NetworkError extends Data.TaggedError('NetworkError')<{
  readonly cause: unknown
}> {}

// API request with error handling
function fetchUser(id: number): Effect.Effect<User, ApiError | NetworkError, never> {
  return Effect.tryPromise({
    try: async () => {
      const response = await fetch(`/api/users/${id}`)
      if (!response.ok) {
        throw new ApiError({
          status: response.status,
          message: response.statusText,
        })
      }
      return response.json()
    },
    catch: (error) => {
      if (error instanceof ApiError) return error
      return new NetworkError({ cause: error })
    },
  })
}

// Usage with resilience
const program = fetchUser(1).pipe(
  Effect.retry({ times: 3 }),
  Effect.timeout('10 seconds'),
  Effect.catchTag('ApiError', (error) => {
    if (error.status === 404) {
      return Effect.succeed(defaultUser)
    }
    return Effect.fail(error)
  }),
  Effect.catchTag('NetworkError', () => Effect.succeed(cachedUser))
)
```

### Pattern 2: Service-Oriented Architecture

```typescript
import { Effect, Context, Layer } from 'effect'

// Define services
class UserRepository extends Context.Tag('UserRepository')<
  UserRepository,
  {
    readonly findById: (id: number) => Effect.Effect<User, UserNotFoundError>
    readonly save: (user: User) => Effect.Effect<void, DatabaseError>
    readonly findAll: () => Effect.Effect<User[], DatabaseError>
  }
>() {}

class EmailService extends Context.Tag('EmailService')<
  EmailService,
  {
    readonly send: (to: string, subject: string, body: string) => Effect.Effect<void, EmailError>
  }
>() {}

// Business logic using services
function registerUser(
  email: string,
  name: string
): Effect.Effect<User, UserNotFoundError | DatabaseError | EmailError, UserRepository | EmailService> {
  return Effect.gen(function* () {
    const repo = yield* UserRepository
    const emailService = yield* EmailService

    const user = { id: Date.now(), email, name }

    yield* repo.save(user)
    yield* emailService.send(email, 'Welcome', `Hello ${name}!`)

    return user
  })
}

// Provide implementations
const UserRepositoryLive = Layer.succeed(UserRepository, {
  findById: (id) => Effect.tryPromise({
    try: () => db.query('SELECT * FROM users WHERE id = ?', [id]),
    catch: () => new UserNotFoundError(),
  }),
  save: (user) => Effect.tryPromise({
    try: () => db.execute('INSERT INTO users VALUES (?, ?, ?)', [user.id, user.email, user.name]),
    catch: (error) => new DatabaseError({ cause: error }),
  }),
  findAll: () => Effect.tryPromise({
    try: () => db.query('SELECT * FROM users'),
    catch: (error) => new DatabaseError({ cause: error }),
  }),
})

const EmailServiceLive = Layer.succeed(EmailService, {
  send: (to, subject, body) => Effect.tryPromise({
    try: () => sendEmailAPI(to, subject, body),
    catch: (error) => new EmailError({ cause: error }),
  }),
})

const AppLayer = Layer.mergeAll(UserRepositoryLive, EmailServiceLive)

// Run with dependencies
Effect.runPromise(Effect.provide(registerUser('user@example.com', 'Alice'), AppLayer))
```

### Pattern 3: Data Validation with Effect Schema

```typescript
import { Effect } from 'effect'
import { Schema } from 'effect/Schema'

// Define schema
const UserSchema = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  email: Schema.String.pipe(Schema.pattern(/^[^@]+@[^@]+$/)),
  age: Schema.Number.pipe(Schema.between(0, 120)),
})

type User = typeof UserSchema.Type

// Parse with validation
function parseUser(input: unknown): Effect.Effect<User, ParseError, never> {
  return Schema.decode(UserSchema)(input)
}

// Usage
const program = Effect.gen(function* () {
  const input = { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 }

  const user = yield* parseUser(input)

  return user
})

// With error handling
const safe = parseUser({ id: 1, name: 'Alice', email: 'invalid', age: 30 }).pipe(
  Effect.catchAll((error) => {
    console.error('Validation error:', error)
    return Effect.succeed(defaultUser)
  })
)
```

## Effect vs Other Approaches

| Aspect                 | Effect                                       | Try/Catch                    | Promise                       |
| ---------------------- | -------------------------------------------- | ---------------------------- | ----------------------------- |
| **Error Tracking**     | Type-safe, compile-time                      | Runtime only                 | Runtime only                  |
| **Error Types**        | Multiple error types tracked                 | Single catch                 | Single catch                  |
| **Composability**      | Highly composable with operators             | Hard to compose              | Moderate (then/catch)         |
| **Testability**        | Pure, easy to test                           | Requires mocks               | Requires mocks                |
| **Dependency Injection** | Built-in (Context/Layer)                     | Manual DI                    | Manual DI                     |
| **Cancellation**       | Built-in (Fiber interruption)                | Not supported                | AbortController (manual)      |
| **Resource Management**  | Automatic (Scope)                            | Manual (finally)             | Manual                        |
| **Concurrency**        | Structured (Fiber)                           | Unstructured                 | Promise.all/race              |
| **Type Inference**     | Full type inference                          | No error type inference      | No error type inference       |

## Integration with Bun

- **Native Execution**: Bun executes Effect TypeScript code directly
- **Fast Runtime**: Bun's speed complements Effect's performance
- **Type Checking**: Use `tsc --noEmit` to validate Effect types
- **Testing**: Effect programs are easy to test with Bun Test

## Integration with Hono

Effect works seamlessly with Hono for web applications:

```typescript
import { Hono } from 'hono'
import { Effect } from 'effect'

const app = new Hono()

app.get('/users/:id', async (c) => {
  const id = Number(c.req.param('id'))

  const program = Effect.gen(function* () {
    const user = yield* fetchUser(id)
    return user
  }).pipe(
    Effect.provide(AppLayer)
  )

  const result = await Effect.runPromise(
    program.pipe(Effect.either)
  )

  if (result._tag === 'Left') {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json(result.right)
})

export default app
```

## Best Practices

1. **Use Effect.gen for Readability**: Prefer `Effect.gen` over `pipe` for complex workflows
2. **Define Error Types**: Use `Data.TaggedError` for type-safe error handling
3. **Make Dependencies Explicit**: Use Context and Layer for dependency injection
4. **Handle Errors Explicitly**: Always handle errors with `catchAll`, `catchTag`, or `either`
5. **Use Parallel Execution**: Leverage `Effect.all` for independent operations
6. **Resource Management**: Use `Effect.acquireRelease` for resources requiring cleanup
7. **Test with Mock Layers**: Provide test implementations via Layer for unit tests
8. **Type Inference**: Let TypeScript infer types, avoid manual annotations
9. **Keep Effects Pure**: Business logic should be pure, side effects in Effect programs
10. **Use Schema for Validation**: Validate external data with Effect Schema

## Common Pitfalls

- ❌ **Running Effects Too Early**: Effects are lazy, run only when needed
- ❌ **Not Handling Errors**: Uncaught errors will cause Effect.runPromise to reject
- ❌ **Mixing Promises and Effects**: Convert promises to Effects with `Effect.promise`
- ❌ **Ignoring Type Errors**: Effect's types are precise, don't use `any` or `@ts-ignore`
- ❌ **Over-Using Effect.sync**: Use `Effect.succeed` for pure values, `Effect.sync` for side effects
- ❌ **Not Using Dependency Injection**: Avoid global state, use Context/Layer
- ❌ **Forgetting to Provide Dependencies**: Effects requiring Context will fail without Layer

## When to Use Effect

**Use Effect for:**

- Complex business logic with error handling
- Applications requiring dependency injection
- Concurrent operations and async workflows
- Resource management with automatic cleanup
- Type-safe error handling across the application
- Testable, composable code architecture

**Consider alternatives for:**

- Simple synchronous functions (use pure functions)
- Trivial async operations (use promises directly)
- Performance-critical hot paths (measure first)

## Full Documentation Reference

This is a high-level summary of Effect.ts. For comprehensive documentation covering all features, patterns, and advanced topics, see the split documentation sections:

**Location**: `docs/infrastructure/framework/effect/`

The full documentation (49,540 lines) is split into 741 sections covering:
- Batching and caching strategies
- Configuration management
- Complete API reference
- Advanced patterns (streaming, interruption, scheduling)
- Performance optimization
- Testing strategies
- Real-world examples
- Integration guides

To explore specific topics in depth, refer to the numbered section files in the `effect/` directory.

## References

- Effect documentation: https://effect.website/docs/introduction
- Effect GitHub: https://github.com/Effect-TS/effect
- Effect Discord: https://discord.gg/effect-ts
- Effect Schema: https://effect.website/docs/schema/introduction
- Effect Patterns: [./effect-patterns.md](./effect-patterns.md) (if exists)
