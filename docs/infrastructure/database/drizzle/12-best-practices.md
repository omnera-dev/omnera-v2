# Drizzle ORM - Type-Safe SQL Database Toolkit

> **Note**: This is part 12 of the split documentation. See navigation links below.


## Best Practices

### 1. Type Safety
```typescript
// ✅ CORRECT: Use inferred types
type User = typeof users.$inferSelect
type NewUser = typeof users.$inferInsert
function createUser(data: NewUser): Promise<User> {
  return db.insert(users).values(data).returning().get()
}
// ❌ INCORRECT: Manual type definitions
interface User {
  id: number
  name: string
  email: string
}
// Types can drift from schema
```

### 2. Schema Organization
```typescript
// ✅ CORRECT: Separate schema files by domain
// src/db/schema/users.ts
export const users = sqliteTable('users', { ... })
export const usersRelations = relations(users, { ... })
// src/db/schema/posts.ts
export const posts = sqliteTable('posts', { ... })
export const postsRelations = relations(posts, { ... })
// src/db/schema/index.ts
export * from './users'
export * from './posts'
```

### 3. Query Optimization
```typescript
// ✅ CORRECT: Select only needed columns
const userNames = await db.select({ id: users.id, name: users.name }).from(users)
// ❌ INCORRECT: Select all when you only need some
const allUsers = await db.select().from(users)
const names = allUsers.map((u) => u.name) // Fetched unnecessary data
// ✅ CORRECT: Use indexes for frequently queried columns
export const users = sqliteTable(
  'users',
  {
    email: text('email').notNull(),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
  })
)
// ✅ CORRECT: Use pagination for large result sets
const paginatedUsers = await db
  .select()
  .from(users)
  .limit(20)
  .offset(page * 20)
```

### 4. Error Handling with Effect
```typescript
// ✅ CORRECT: Explicit error types
export class UserNotFoundError {
  readonly _tag = 'UserNotFoundError'
  constructor(readonly userId: number) {}
}
export class DatabaseError {
  readonly _tag = 'DatabaseError'
  constructor(readonly cause: unknown) {}
}
const findUser = (id: number): Effect.Effect<User, UserNotFoundError | DatabaseError, Database> =>
  Effect.gen(function* () {
    const db = yield* Database
    const result = yield* Effect.tryPromise({
      try: () => db.select().from(users).where(eq(users.id, id)).get(),
      catch: (error) => new DatabaseError(error),
    })
    if (!result) {
      return yield* Effect.fail(new UserNotFoundError(id))
    }
    return result
  })
// Handle errors explicitly
const program = findUser(1).pipe(
  Effect.catchTag('UserNotFoundError', (error) => Effect.succeed(defaultUser)),
  Effect.catchTag('DatabaseError', (error) => {
    console.error('Database error:', error)
    return Effect.fail(error)
  })
)
```

### 5. Transaction Management
```typescript
// ✅ CORRECT: Use transactions for multi-step operations
const transferFunds = (fromId: number, toId: number, amount: number) =>
  Effect.gen(function* () {
    const db = yield* Database
    yield* Effect.tryPromise({
      try: () =>
        db.transaction(async (tx) => {
          // Deduct from sender
          await tx
            .update(accounts)
            .set({ balance: sql`${accounts.balance} - ${amount}` })
            .where(eq(accounts.userId, fromId))
          // Add to receiver
          await tx
            .update(accounts)
            .set({ balance: sql`${accounts.balance} + ${amount}` })
            .where(eq(accounts.userId, toId))
        }),
      catch: (error) => new DatabaseError(error),
    })
  })
// ❌ INCORRECT: Separate operations without transaction
// Risk of inconsistent state if second update fails
await db
  .update(accounts)
  .set({ balance: senderBalance - amount })
  .where(eq(accounts.userId, fromId))
await db
  .update(accounts)
  .set({ balance: receiverBalance + amount })
  .where(eq(accounts.userId, toId))
```

### 6. Testing
```typescript
// src/repositories/UserRepository.test.ts
import { test, expect, beforeEach } from 'bun:test'
import { Effect, Layer } from 'effect'
import { UserRepository, UserRepositoryLive } from './UserRepository'
import { DatabaseLive } from '../db/layer'
// Test with real database (SQLite in-memory)
const TestDatabaseLive = Layer.sync(Database, () => {
  const sqlite = new Database(':memory:')
  return drizzle(sqlite)
})
const TestAppLayer = Layer.provide(UserRepositoryLive, TestDatabaseLive)
beforeEach(async () => {
  // Run migrations in test database
  const db = await Effect.runPromise(Database.pipe(Effect.provide(TestDatabaseLive)))
  await migrate(db, { migrationsFolder: './drizzle' })
})
test('UserRepository.findById returns user', async () => {
  const program = Effect.gen(function* () {
    const repo = yield* UserRepository
    // Create test user
    const user = yield* repo.create({ name: 'Alice', email: 'alice@test.com' })
    // Find by ID
    const found = yield* repo.findById(user.id)
    return found
  })
  const result = await Effect.runPromise(Effect.provide(program, TestAppLayer))
  expect(result.name).toBe('Alice')
  expect(result.email).toBe('alice@test.com')
})
test('UserRepository.findById fails for non-existent user', async () => {
  const program = Effect.gen(function* () {
    const repo = yield* UserRepository
    return yield* repo.findById(999)
  })
  const result = await Effect.runPromise(Effect.provide(program, TestAppLayer).pipe(Effect.either))
  expect(result._tag).toBe('Left')
  if (result._tag === 'Left') {
    expect(result.left._tag).toBe('UserNotFoundError')
  }
})
```

### 7. Prepared Statements
```typescript
// ✅ CORRECT: Use prepared statements for repeated queries
import { db } from './db'
import { users } from './schema'
import { eq } from 'drizzle-orm'
const findUserByIdStmt = db
  .select()
  .from(users)
  .where(eq(users.id, sql.placeholder('id')))
  .prepare()
// Execute multiple times efficiently
const user1 = await findUserByIdStmt.execute({ id: 1 })
const user2 = await findUserByIdStmt.execute({ id: 2 })
const user3 = await findUserByIdStmt.execute({ id: 3 })
```
---


## Navigation

[← Part 11](./11-migrations-with-drizzle-kit.md) | [Part 13 →](./13-common-patterns.md)


**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-drizzle-orm-for-omnera.md) | [Part 4](./04-installation.md) | [Part 5](./05-integration-with-omnera-stack.md) | [Part 6](./06-database-setup.md) | [Part 7](./07-schema-definition.md) | [Part 8](./08-query-api.md) | [Part 9](./09-transactions.md) | [Part 10](./10-effect-integration-patterns.md) | [Part 11](./11-migrations-with-drizzle-kit.md) | **Part 12** | [Part 13](./13-common-patterns.md) | [Part 14](./14-integration-with-better-auth-postgresql.md) | [Part 15](./15-performance-considerations.md) | [Part 16](./16-common-pitfalls-to-avoid.md) | [Part 17](./17-drizzle-studio.md) | [Part 18](./18-postgresql-best-practices-for-omnera.md) | [Part 19](./19-references.md) | [Part 20](./20-summary.md)