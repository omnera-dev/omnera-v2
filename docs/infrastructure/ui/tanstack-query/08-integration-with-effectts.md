# TanStack Query (React Query) - Server-State Management

> **Note**: This is part 8 of the split documentation. See navigation links below.

## Integration with Effect.ts

Convert Effect programs to TanStack Query-compatible functions:

### Pattern 1: Effect Programs as Query Functions

```typescript
import { Effect } from 'effect'
import { useQuery } from '@tanstack/react-query'
// Effect program
interface UserService {
  readonly findById: (id: number) => Effect.Effect<User, UserNotFoundError>
}
const UserService = Context.Tag<UserService>('UserService')
// Convert to query function
function useUser(userId: number) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const program = Effect.gen(function* () {
        const userService = yield* UserService
        return yield* userService.findById(userId)
      })
      // Run Effect program and return result
      return await Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
    },
  })
}
```

### Pattern 2: Effect Error Handling

Map Effect errors to JavaScript errors for TanStack Query:

```typescript
import { Effect, Exit } from 'effect'
function useUserWithErrorHandling(userId: number) {
  return useQuery<User, Error>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const program = fetchUserEffect(userId)
      const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(AppLayer)))
      // Convert Effect Exit to Promise (resolve or reject)
      if (Exit.isSuccess(exit)) {
        return exit.value
      } else {
        const cause = Exit.causeOption(exit)
        if (cause._tag === 'Some') {
          const error = Cause.squash(cause.value)
          throw new Error(error.message)
        }
        throw new Error('Unknown error')
      }
    },
  })
}
```

### Pattern 3: Reusable Effect Query Hook

Create a generic hook for running Effect programs:

```typescript
import { Effect, Exit, Cause } from 'effect'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
function useEffectQuery<A, E>(
  queryKey: unknown[],
  program: Effect.Effect<A, E, never>,
  options?: Omit<UseQueryOptions<A, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<A, Error>({
    queryKey,
    queryFn: async () => {
      const exit = await Effect.runPromiseExit(program)
      if (Exit.isSuccess(exit)) {
        return exit.value
      }
      const cause = Exit.causeOption(exit)
      if (cause._tag === 'Some') {
        const error = Cause.squash(cause.value)
        throw error instanceof Error ? error : new Error(String(error))
      }
      throw new Error('Unknown error occurred')
    },
    ...options,
  })
}
// Usage
function UserProfile({ userId }: { userId: number }) {
  const program = Effect.gen(function* () {
    const userService = yield* UserService
    return yield* userService.findById(userId)
  }).pipe(Effect.provide(AppLayer))
  const { data: user, isPending, isError } = useEffectQuery(['user', userId], program)
  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Error loading user</div>
  return <UserCard user={user} />
}
```

### Pattern 4: Effect Layers with TanStack Query

Inject dependencies into Effect programs:

```typescript
import { Effect, Context, Layer } from 'effect'
// Services
class Database extends Context.Tag('Database')<Database, DatabaseService>() {}
class Logger extends Context.Tag('Logger')<Logger, LoggerService>() {}
// Effect program with dependencies
const fetchUserProgram = (userId: number) =>
  Effect.gen(function* () {
    const db = yield* Database
    const logger = yield* Logger
    yield* logger.info(`Fetching user ${userId}`)
    const user = yield* db.query(`SELECT * FROM users WHERE id = ?`, [userId])
    yield* logger.info(`Found user ${user.name}`)
    return user
  })
// Provide layers for query
function useUser(userId: number) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const program = fetchUserProgram(userId).pipe(
        Effect.provide(DatabaseLive),
        Effect.provide(LoggerLive)
      )
      return await Effect.runPromise(program)
    },
  })
}
```

---

## Navigation

[← Part 7](./07-usequery-hook.md) | [Part 9 →](./09-usemutation-hook.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-tanstack-query-for-omnera.md) | [Part 4](./04-installation.md) | [Part 5](./05-basic-setup.md) | [Part 6](./06-core-concepts.md) | [Part 7](./07-usequery-hook.md) | **Part 8** | [Part 9](./09-usemutation-hook.md) | [Part 10](./10-usequeries-hook.md) | [Part 11](./11-useinfinitequery-hook.md) | [Part 12](./12-server-side-rendering-ssr-with-hono.md) | [Part 13](./13-integration-with-better-auth.md) | [Part 14](./14-advanced-patterns.md) | [Part 15](./15-testing-with-tanstack-query.md) | [Part 16](./16-best-practices.md) | [Part 17](./17-common-pitfalls-to-avoid.md) | [Part 18](./18-performance-optimization.md) | [Part 19](./19-devtools.md) | [Part 20](./20-summary.md) | [Part 21](./21-references.md)
