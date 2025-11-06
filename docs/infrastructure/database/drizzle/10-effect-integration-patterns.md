# Drizzle ORM - Type-Safe SQL Database Toolkit

> **Note**: This is part 10 of the split documentation. See navigation links below.

## Effect Integration Patterns

### Database Repository Pattern

```typescript
// src/repositories/UserRepository.ts
import { Effect, Context } from 'effect'
import { Database } from '../db/layer'
import { users, type User, type NewUser } from '../db/schema'
import { eq } from 'drizzle-orm'
// Define errors
export class UserNotFoundError {
  readonly _tag = 'UserNotFoundError'
  constructor(readonly userId: number) {}
}
export class DatabaseError {
  readonly _tag = 'DatabaseError'
  constructor(readonly cause: unknown) {}
}
// UserRepository service
export class UserRepository extends Context.Tag('UserRepository')<
  UserRepository,
  {
    readonly findById: (id: number) => Effect.Effect<User, UserNotFoundError | DatabaseError>
    readonly findByEmail: (email: string) => Effect.Effect<User | null, DatabaseError>
    readonly create: (user: NewUser) => Effect.Effect<User, DatabaseError>
    readonly update: (
      id: number,
      data: Partial<NewUser>
    ) => Effect.Effect<User, UserNotFoundError | DatabaseError>
    readonly delete: (id: number) => Effect.Effect<void, UserNotFoundError | DatabaseError>
    readonly list: () => Effect.Effect<readonly User[], DatabaseError>
  }
>() {}
// UserRepository implementation
export const UserRepositoryLive = Layer.effect(
  UserRepository,
  Effect.gen(function* () {
    const db = yield* Database
    return UserRepository.of({
      findById: (id) =>
        Effect.tryPromise({
          try: () => db.select().from(users).where(eq(users.id, id)).get(),
          catch: (error) => new DatabaseError(error),
        }).pipe(
          Effect.flatMap((result) =>
            result ? Effect.succeed(result) : Effect.fail(new UserNotFoundError(id))
          )
        ),
      findByEmail: (email) =>
        Effect.tryPromise({
          try: () => db.select().from(users).where(eq(users.email, email)).get(),
          catch: (error) => new DatabaseError(error),
        }).pipe(Effect.map((result) => result ?? null)),
      create: (user) =>
        Effect.tryPromise({
          try: async () => {
            const [created] = await db.insert(users).values(user).returning()
            return created
          },
          catch: (error) => new DatabaseError(error),
        }),
      update: (id, data) =>
        Effect.gen(function* () {
          const [updated] = yield* Effect.tryPromise({
            try: () => db.update(users).set(data).where(eq(users.id, id)).returning(),
            catch: (error) => new DatabaseError(error),
          })
          if (!updated) {
            return yield* Effect.fail(new UserNotFoundError(id))
          }
          return updated
        }),
      delete: (id) =>
        Effect.gen(function* () {
          const result = yield* Effect.tryPromise({
            try: () => db.delete(users).where(eq(users.id, id)).returning(),
            catch: (error) => new DatabaseError(error),
          })
          if (result.length === 0) {
            return yield* Effect.fail(new UserNotFoundError(id))
          }
        }),
      list: () =>
        Effect.tryPromise({
          try: () => db.select().from(users),
          catch: (error) => new DatabaseError(error),
        }),
    })
  })
)
```

### Using Repositories in Application Logic

```typescript
// src/services/UserService.ts
import { Effect } from 'effect'
import {
  UserRepository,
  type UserNotFoundError,
  type DatabaseError,
} from '../repositories/UserRepository'
export const getUserProfile = (
  userId: number
): Effect.Effect<UserProfile, UserNotFoundError | DatabaseError, UserRepository> =>
  Effect.gen(function* () {
    const userRepo = yield* UserRepository
    const user = yield* userRepo.findById(userId)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  })
export const createUser = (
  name: string,
  email: string
): Effect.Effect<User, DatabaseError, UserRepository> =>
  Effect.gen(function* () {
    const userRepo = yield* UserRepository
    return yield* userRepo.create({ name, email })
  })
```

### Application Layer with Database

```typescript
// src/layers/AppLayer.ts
import { Layer } from 'effect'
import { DatabaseLive } from '../db/layer'
import { UserRepositoryLive } from '../repositories/UserRepository'
// Compose all layers
export const AppLayer = Layer.provide(UserRepositoryLive, DatabaseLive)
// Usage
import { Effect } from 'effect'
import { getUserProfile } from '../services/UserService'
import { AppLayer } from '../layers/AppLayer'
const program = getUserProfile(1)
Effect.runPromise(Effect.provide(program, AppLayer))
  .then((profile) => console.log('User profile:', profile))
  .catch((error) => console.error('Failed:', error))
```

---

## Navigation

[← Part 9](./09-transactions.md) | [Part 11 →](./11-migrations-with-drizzle-kit.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-drizzle-orm-for-sovrium.md) | [Part 4](./04-installation.md) | [Part 5](./05-integration-with-sovrium-stack.md) | [Part 6](./06-database-setup.md) | [Part 7](./07-schema-definition.md) | [Part 8](./08-query-api.md) | [Part 9](./09-transactions.md) | **Part 10** | [Part 11](./11-migrations-with-drizzle-kit.md) | [Part 12](./12-best-practices.md) | [Part 13](./13-common-patterns.md) | [Part 14](./14-integration-with-better-auth-postgresql.md) | [Part 15](./15-performance-considerations.md) | [Part 16](./16-common-pitfalls-to-avoid.md) | [Part 17](./17-drizzle-studio.md) | [Part 18](./18-postgresql-best-practices-for-sovrium.md) | [Part 19](./19-references.md) | [Part 20](./20-summary.md)
