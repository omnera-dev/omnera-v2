# Effect Testing with Bun Test

> Part of [Effect Framework Documentation](./effect.md)

## Overview

Effect provides excellent testing support through its dependency injection system. This document covers how to test Effect programs using Bun's built-in test runner.

## Basic Testing Setup

```typescript
import { test, expect } from 'bun:test'
import { Effect, Layer, Context } from 'effect'
```

## Testing Simple Effects

```typescript
import { test, expect } from 'bun:test'
import { Effect } from 'effect'

test('should add two numbers', async () => {
  const program = Effect.gen(function* () {
    return 2 + 3
  })

  const result = await Effect.runPromise(program)
  expect(result).toBe(5)
})

test('should handle errors', async () => {
  const program = Effect.fail(new Error('Test error'))

  const result = await Effect.runPromise(Effect.either(program))

  expect(result._tag).toBe('Left')
  if (result._tag === 'Left') {
    expect(result.left).toBeInstanceOf(Error)
    expect(result.left.message).toBe('Test error')
  }
})
```

## Testing with Services

### Define Service

```typescript
import { Context, Effect } from 'effect'

class EmailService extends Context.Tag('EmailService')<
  EmailService,
  { send: (to: string, body: string) => Effect.Effect<void> }
>() {}
```

### Function to Test

```typescript
const sendWelcomeEmail = (email: string): Effect.Effect<void, never, EmailService> =>
  Effect.gen(function* () {
    const emailService = yield* EmailService
    yield* emailService.send(email, 'Welcome!')
  })
```

### Test with Mocked Service

```typescript
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
```

## Testing Error Handling

```typescript
import { test, expect } from 'bun:test'
import { Effect, Data } from 'effect'

class EmailError extends Data.TaggedError('EmailError')<{ reason: string }> {}

test('should handle email service failure', async () => {
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

## Testing with Multiple Services

```typescript
class Database extends Context.Tag('Database')<
  Database,
  { query: (sql: string) => Effect.Effect<unknown[]> }
>() {}

class Logger extends Context.Tag('Logger')<
  Logger,
  {
    info: (message: string) => Effect.Effect<void>
    error: (message: string) => Effect.Effect<void>
  }
>() {}

const getUserById = (id: number): Effect.Effect<User, DatabaseError, Database | Logger> =>
  Effect.gen(function* () {
    const db = yield* Database
    const logger = yield* Logger

    yield* logger.info(`Fetching user ${id}`)

    const rows = yield* db.query(`SELECT * FROM users WHERE id = ${id}`)
    if (rows.length === 0) {
      return yield* Effect.fail(new DatabaseError({ message: 'User not found' }))
    }

    const user = parseUser(rows[0])
    yield* logger.info(`Found user: ${user.name}`)

    return user
  })

test('should log user retrieval', async () => {
  const logs: string[] = []

  const MockDatabase = Layer.succeed(Database, {
    query: () =>
      Effect.succeed([
        {
          id: 1,
          name: 'Alice',
          email: 'alice@example.com',
        },
      ]),
  })

  const MockLogger = Layer.succeed(Logger, {
    info: (message) =>
      Effect.sync(() => {
        logs.push(message)
      }),
    error: (message) =>
      Effect.sync(() => {
        logs.push(`ERROR: ${message}`)
      }),
  })

  const TestLayer = Layer.mergeAll(MockDatabase, MockLogger)

  const program = getUserById(1)
  const result = await Effect.runPromise(Effect.provide(program, TestLayer))

  expect(result.name).toBe('Alice')
  expect(logs).toContain('Fetching user 1')
  expect(logs).toContain('Found user: Alice')
})
```

## Testing Async Operations

```typescript
test('should handle async operations', async () => {
  const program = Effect.gen(function* () {
    const result = yield* Effect.promise(() =>
      Promise.resolve({
        id: 1,
        name: 'Test',
      })
    )
    return result
  })

  const result = await Effect.runPromise(program)
  expect(result.id).toBe(1)
  expect(result.name).toBe('Test')
})
```

## Testing Retry Logic

```typescript
test('should retry failed operations', async () => {
  let attempts = 0

  const MockAPI = Layer.succeed(APIService, {
    fetch: () =>
      Effect.gen(function* () {
        attempts++
        if (attempts < 3) {
          return yield* Effect.fail(new APIError({ message: 'Temporary failure' }))
        }
        return { data: 'success' }
      }),
  })

  const program = Effect.gen(function* () {
    const api = yield* APIService
    return yield* api.fetch().pipe(Effect.retry({ times: 3 }))
  })

  const result = await Effect.runPromise(Effect.provide(program, MockAPI))

  expect(attempts).toBe(3)
  expect(result).toEqual({ data: 'success' })
})
```

## Testing Timeout Behavior

```typescript
test('should timeout long operations', async () => {
  const program = Effect.gen(function* () {
    yield* Effect.sleep('10 seconds')
    return 'completed'
  }).pipe(Effect.timeout('100 millis'))

  const result = await Effect.runPromise(Effect.either(program))

  expect(result._tag).toBe('Left')
})
```

## Testing with Effect Schema

```typescript
import { Schema } from 'effect'

const UserSchema = Schema.Struct({
  name: Schema.String.pipe(Schema.minLength(1)),
  email: Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
  age: Schema.Number.pipe(Schema.greaterThanOrEqualTo(0)),
})

test('should validate correct user data', async () => {
  const validData = {
    name: 'Alice',
    email: 'alice@example.com',
    age: 30,
  }

  const result = await Effect.runPromise(
    Schema.decodeUnknown(UserSchema)(validData).pipe(Effect.either)
  )

  expect(result._tag).toBe('Right')
  if (result._tag === 'Right') {
    expect(result.right.name).toBe('Alice')
    expect(result.right.email).toBe('alice@example.com')
    expect(result.right.age).toBe(30)
  }
})

test('should reject invalid user data', async () => {
  const invalidData = {
    name: '',
    email: 'not-an-email',
    age: -5,
  }

  const result = await Effect.runPromise(
    Schema.decodeUnknown(UserSchema)(invalidData).pipe(Effect.either)
  )

  expect(result._tag).toBe('Left')
})
```

## Testing Parallel Operations

```typescript
test('should process items in parallel', async () => {
  const processItem = (id: number) =>
    Effect.gen(function* () {
      yield* Effect.sleep('100 millis')
      return `processed-${id}`
    })

  const program = Effect.all([processItem(1), processItem(2), processItem(3)], {
    concurrency: 3,
  })

  const start = Date.now()
  const result = await Effect.runPromise(program)
  const duration = Date.now() - start

  expect(result).toEqual(['processed-1', 'processed-2', 'processed-3'])
  expect(duration).toBeLessThan(200) // Should complete in ~100ms, not 300ms
})
```

## Testing Resource Cleanup

```typescript
test('should cleanup resources on error', async () => {
  let resourceClosed = false

  const program = Effect.acquireRelease(
    Effect.sync(() => ({ data: 'resource' })), // acquire
    () =>
      Effect.sync(() => {
        resourceClosed = true
      }) // release
  ).pipe(
    Effect.flatMap(() => Effect.fail(new Error('Oops'))) // Use resource and fail
  )

  await Effect.runPromise(Effect.either(program))

  expect(resourceClosed).toBe(true) // Resource should be closed despite error
})
```

## Testing Custom Layers

```typescript
// Create a layer factory for easier testing
const createTestLayer = (config: { shouldFail: boolean }) => {
  return Layer.succeed(UserService, {
    findById: (id) =>
      config.shouldFail
        ? Effect.fail(new DatabaseError({ message: 'Database error' }))
        : Effect.succeed({ id, name: 'Test User', email: 'test@example.com' }),
  })
}

test('should handle successful case', async () => {
  const program = getUserById(1)
  const result = await Effect.runPromise(Effect.provide(program, createTestLayer({ shouldFail: false })))

  expect(result.name).toBe('Test User')
})

test('should handle error case', async () => {
  const program = getUserById(1)
  const result = await Effect.runPromise(
    Effect.provide(program, createTestLayer({ shouldFail: true })).pipe(Effect.either)
  )

  expect(result._tag).toBe('Left')
})
```

## Best Practices for Testing Effect Code

1. **Use Effect.either for Error Testing**: Wrap effects in `Effect.either` to test both success and failure paths

2. **Mock Services with Layers**: Use `Layer.succeed` to provide mock implementations

3. **Test Error Handling**: Explicitly test error cases with `Effect.catchTag`

4. **Verify Cleanup**: Test that resources are properly released using `acquireRelease`

5. **Test Concurrency**: Verify parallel operations work correctly with `Effect.all`

6. **Use Effect.runPromise**: Convert effects to promises for Bun test assertions

7. **Isolate Tests**: Each test should have its own layer configuration

8. **Test Timeouts**: Verify timeout behavior with `Effect.timeout`

9. **Test Retries**: Verify retry logic with controlled failure sequences

10. **Keep Tests Fast**: Use short timeouts in tests (e.g., '100 millis')

## Common Testing Patterns

### Pattern: Test Both Success and Failure

```typescript
test('getUserById success', async () => {
  const result = await Effect.runPromise(Effect.provide(getUserById(1), SuccessLayer))
  expect(result.id).toBe(1)
})

test('getUserById failure', async () => {
  const result = await Effect.runPromise(
    Effect.provide(getUserById(999), FailureLayer).pipe(Effect.either)
  )
  expect(result._tag).toBe('Left')
})
```

### Pattern: Verify Side Effects

```typescript
test('should call logger', async () => {
  const logs: string[] = []
  const LoggerLayer = Layer.succeed(Logger, {
    info: (msg) => Effect.sync(() => logs.push(msg)),
  })

  await Effect.runPromise(Effect.provide(program, LoggerLayer))

  expect(logs).toContain('Expected log message')
})
```

### Pattern: Test Error Types

```typescript
test('should fail with specific error type', async () => {
  const result = await Effect.runPromise(Effect.either(program))

  expect(result._tag).toBe('Left')
  if (result._tag === 'Left') {
    expect(result.left).toBeInstanceOf(ValidationError)
  }
})
```

## Integration with Bun Test

- **Fast Execution**: Bun's test runner is fast, perfect for Effect tests
- **Native TypeScript**: No transpilation needed for Effect TypeScript code
- **Async Support**: Built-in async/await support for `Effect.runPromise`
- **Assertions**: Standard Bun test assertions work with Effect results

## See Also

- [Effect Framework Overview](./effect.md)
- [Effect Schema](./effect-schema.md)
- [Effect Patterns](./effect-patterns.md)

## References

- Effect testing guide: https://effect.website/docs/guides/testing/introduction
- Bun test documentation: https://bun.sh/docs/cli/test
- Effect test utilities: https://effect.website/docs/guides/testing/services
