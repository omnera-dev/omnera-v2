# Effect Common Patterns

> Part of [Effect Framework Documentation](./effect.md)

## Overview

This document provides common patterns for using Effect in real-world applications. These patterns demonstrate how to structure Effect code for typical use cases like API requests, service layers, and parallel operations.

## Pattern 1: API Request with Error Handling

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

### Key Features

- **Type-Safe Errors**: Explicit `ApiError` type in function signature
- **Network Error Handling**: Wraps fetch failures in `ApiError`
- **Response Validation**: Checks `response.ok` status
- **JSON Parsing**: Handles JSON parsing errors
- **Retry Logic**: Retries failed requests with exponential backoff
- **Timeout**: Prevents hanging requests with 5-second timeout

### Usage Example

```typescript
const program = fetchUser(123).pipe(
  Effect.catchTag('ApiError', (error) => {
    console.log(`API Error: ${error.message} (${error.statusCode})`)
    return Effect.succeed(defaultUser)
  })
)

await Effect.runPromise(program)
```

## Pattern 2: Service Layer with Dependencies

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

### Key Features

- **Service Definitions**: `Context.Tag` defines service interfaces
- **Dependency Injection**: Services injected via `yield*` operator
- **Layer Composition**: Multiple layers merged with `Layer.mergeAll`
- **Type-Safe Requirements**: Type system tracks required services
- **Testability**: Easy to mock services with different layers

### Testing Example

```typescript
// Mock implementations for testing
const MockDatabaseLayer = Layer.succeed(Database, {
  query: (sql) =>
    Effect.succeed([
      {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      },
    ]),
})

const MockCacheLayer = Layer.succeed(Cache, {
  get: () => Effect.succeed(null), // Cache miss
  set: () => Effect.succeed(undefined),
})

const TestLayer = Layer.mergeAll(MockDatabaseLayer, MockCacheLayer)

// Run tests with mock services
const testProgram = getUserWithCache(1)
const result = await Effect.runPromise(Effect.provide(testProgram, TestLayer))
```

## Pattern 3: Parallel Operations

### Processing Multiple Items in Parallel

```typescript
import { Effect } from 'effect'

// Process multiple users in parallel
const processUsers = (ids: number[]): Effect.Effect<User[], ApiError, UserService> =>
  Effect.all(
    ids.map((id) => fetchUser(id)),
    { concurrency: 5 }
  )
```

### Batched Processing

```typescript
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

### Key Features

- **Controlled Concurrency**: Limit number of parallel operations
- **Batch Processing**: Process items in manageable chunks
- **Error Handling**: Failed items don't block successful ones
- **Resource Management**: Prevent overwhelming external services

### Usage Example

```typescript
// Process 100 user IDs with controlled concurrency
const userIds = Array.from({ length: 100 }, (_, i) => i + 1)

const program = batchedProcess(userIds).pipe(
  Effect.catchAll((error) => {
    console.error('Batch processing failed:', error)
    return Effect.succeed([]) // Return empty array on failure
  })
)

const users = await Effect.runPromise(program)
console.log(`Processed ${users.length} users`)
```

## Pattern 4: Race Operations

```typescript
// Fetch from cache or database (whichever is faster)
const getUserFast = (id: number): Effect.Effect<User, Error, Database | Cache> =>
  Effect.race(
    Effect.gen(function* () {
      const cache = yield* Cache
      const cached = yield* cache.get(`user:${id}`)
      if (!cached) return yield* Effect.fail(new Error('Cache miss'))
      return JSON.parse(cached)
    }),
    Effect.gen(function* () {
      const db = yield* Database
      const rows = yield* db.query(`SELECT * FROM users WHERE id = ${id}`)
      return parseUser(rows[0])
    })
  )
```

### Key Features

- **First Winner**: Returns first successful result
- **Automatic Cleanup**: Cancels slower operation
- **Fallback Strategy**: Provides redundancy

## Pattern 5: Retry with Backoff

```typescript
import { Schedule } from 'effect'

const fetchWithRetry = (url: string): Effect.Effect<Response, ApiError, never> =>
  Effect.tryPromise({
    try: () => fetch(url),
    catch: () => new ApiError({ message: 'Network error', statusCode: 0 }),
  }).pipe(
    Effect.retry({
      times: 5,
      schedule: Schedule.exponential('100 millis', 2), // Exponential backoff
    }),
    Effect.timeout('30 seconds')
  )
```

### Key Features

- **Exponential Backoff**: Delay increases exponentially
- **Maximum Attempts**: Limit number of retries
- **Timeout Protection**: Prevent infinite retries

## Pattern 6: Resource Management

```typescript
// Database connection with automatic cleanup
const withConnection = <A, E>(
  useConnection: (conn: Connection) => Effect.Effect<A, E, never>
): Effect.Effect<A, E, never> =>
  Effect.acquireRelease(
    Effect.sync(() => openDatabaseConnection()), // acquire
    (conn) => Effect.sync(() => conn.close()) // release (always called)
  ).pipe(Effect.flatMap(useConnection))

// Usage
const program = withConnection((conn) =>
  Effect.gen(function* () {
    const result = yield* conn.query('SELECT * FROM users')
    return result
  })
)
```

### Key Features

- **Automatic Cleanup**: Resource released even on error
- **Exception Safety**: Cleanup happens in all cases
- **Composability**: Easy to compose resource operations

## Pattern 7: Error Recovery

```typescript
// Try primary service, fallback to backup
const resilientFetch = (id: number): Effect.Effect<User, never, PrimaryAPI | BackupAPI> =>
  Effect.gen(function* () {
    const primary = yield* PrimaryAPI

    return yield* primary.fetchUser(id).pipe(
      Effect.catchAll(() =>
        Effect.gen(function* () {
          const backup = yield* BackupAPI
          return yield* backup.fetchUser(id)
        })
      ),
      Effect.catchAll(() => Effect.succeed(defaultUser)) // Final fallback
    )
  })
```

### Key Features

- **Graceful Degradation**: Falls back to backup service
- **Default Fallback**: Always returns a value
- **Error Isolation**: Primary failure doesn't propagate

## Pattern 8: Timeout with Custom Fallback

```typescript
const fetchUserWithTimeout = (id: number): Effect.Effect<User, never, UserAPI> =>
  Effect.gen(function* () {
    const api = yield* UserAPI

    return yield* api.fetchUser(id).pipe(
      Effect.timeout('5 seconds'),
      Effect.catchAll(() => Effect.succeed(cachedUser)) // Use cached data on timeout
    )
  })
```

### Key Features

- **Time Bounds**: Prevents hanging operations
- **Fallback Strategy**: Returns cached data on timeout
- **User Experience**: No waiting indefinitely

## Pattern 9: Validation Pipeline

```typescript
import { Schema } from 'effect'

const validateAndSaveUser = (
  data: unknown
): Effect.Effect<User, ValidationError | DatabaseError, Database> =>
  Effect.gen(function* () {
    // Validate input
    const validated = yield* Schema.decodeUnknown(UserSchema)(data).pipe(
      Effect.mapError((error) => new ValidationError({ message: error.message }))
    )

    // Business logic validation
    if (validated.age < 18) {
      return yield* Effect.fail(new ValidationError({ message: 'User must be 18+' }))
    }

    // Save to database
    const db = yield* Database
    const user = yield* db.saveUser(validated)

    return user
  })
```

### Key Features

- **Schema Validation**: Type-safe input validation
- **Business Rules**: Apply domain-specific validation
- **Error Types**: Distinguish validation from database errors

## Pattern 10: Event Sourcing

```typescript
const processEvent = (event: Event): Effect.Effect<void, ProcessError, EventStore | EventBus> =>
  Effect.gen(function* () {
    const store = yield* EventStore
    const bus = yield* EventBus

    // Store event
    yield* store.append(event)

    // Process event
    const result = yield* handleEvent(event)

    // Publish result
    yield* bus.publish(result)
  }).pipe(
    Effect.catchAll((error) =>
      Effect.gen(function* () {
        // Compensating action on failure
        const store = yield* EventStore
        yield* store.markFailed(event.id, error)
      })
    )
  )
```

### Key Features

- **Event Storage**: Persist all events
- **Error Recovery**: Mark failed events for later retry
- **Decoupling**: Event bus decouples producers/consumers

## Best Practices Summary

1. **Use Effect.gen**: More readable than deeply nested `.pipe()` chains
2. **Define Custom Errors**: Create specific error types with `Data.TaggedError`
3. **Add Retries**: Use `Effect.retry()` for transient failures
4. **Set Timeouts**: Prevent hanging operations with `Effect.timeout()`
5. **Leverage Layers**: Use dependency injection for testability
6. **Control Concurrency**: Limit parallel operations to avoid overwhelming services
7. **Handle Cleanup**: Use `acquireRelease` for resources needing cleanup
8. **Compose Effects**: Build complex logic from simple, reusable effects
9. **Test with Mocks**: Provide mock implementations via Layers
10. **Document Requirements**: Make service dependencies explicit in types

## See Also

- [Effect Framework Overview](./effect.md)
- [Effect Schema](./effect-schema.md)
- [Effect Testing](./effect-testing.md)

## References

- Effect documentation: https://effect.website/docs/introduction
- Effect examples: https://github.com/Effect-TS/effect/tree/main/packages/effect/examples
- Effect patterns: https://effect.website/docs/guides/essentials/pipeline
