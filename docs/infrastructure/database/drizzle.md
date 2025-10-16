# Drizzle ORM - Type-Safe SQL Database Toolkit

## Overview

**Version**: TBD (installed as dependency)
**Purpose**: TypeScript-first ORM for SQL databases providing type-safe queries with zero-cost type safety, SQL-like syntax, and native Bun runtime integration

Drizzle ORM is a headless TypeScript ORM that acts as a type-safe SQL wrapper rather than a traditional abstraction layer. It provides full TypeScript inference, compile-time validation, and a query API that closely resembles SQL while maintaining complete type safety.

## Why Drizzle ORM for Omnera

- **TypeScript-First**: Schemas define types, queries are fully type-safe with inference
- **Zero-Cost Type Safety**: Types are erased at build time, no runtime overhead
- **Bun Native Support**: Direct integration with Bun's SQL module (bun:sqlite or bun:postgresql)
- **SQL-Like Syntax**: Familiar SQL patterns without learning a new query language
- **Effect-Ready**: Perfect integration with Effect.ts for database operations
- **Better Auth Compatible**: Native adapter support for authentication integration
- **Lightweight**: Minimal bundle size, no heavy ORM abstractions
- **Migration System**: drizzle-kit provides powerful schema migration tools
- **Relational Queries**: Automatic joins with type-safe relationship definitions

## Installation

Drizzle ORM requires two packages:

```bash
# Install Drizzle ORM and Drizzle Kit
bun add drizzle-orm
bun add -d drizzle-kit

# For SQLite with Bun (recommended for local development)
# No additional driver needed - Bun has built-in SQLite support

# For PostgreSQL with Bun
# No additional driver needed - Bun has built-in PostgreSQL support
```

## Integration with Omnera Stack

### TypeScript (^5)

Drizzle leverages TypeScript's type system for full type safety:

```typescript
import { pgTable, serial, text } from 'drizzle-orm/pg-core'

// Schema definition generates TypeScript types
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
})

// Infer types from schema
export type User = typeof users.$inferSelect // { id: number; name: string; email: string }
export type NewUser = typeof users.$inferInsert // { name: string; email: string; id?: number }
```

### Effect.ts (3.18.4)

Drizzle operations integrate seamlessly with Effect:

```typescript
import { Effect, Context, Layer } from 'effect'
import { drizzle } from 'drizzle-orm/bun-sqlite'

// Define Database service
class Database extends Context.Tag('Database')<Database, ReturnType<typeof drizzle>>() {}

// Database operations as Effect programs
const findUserById = (id: number): Effect.Effect<User, UserNotFoundError, Database> =>
  Effect.gen(function* () {
    const db = yield* Database

    const result = yield* Effect.tryPromise({
      try: () => db.select().from(users).where(eq(users.id, id)).get(),
      catch: (error) => new DatabaseError({ cause: error }),
    })

    if (!result) {
      return yield* Effect.fail(new UserNotFoundError({ userId: id }))
    }

    return result
  })
```

### Better Auth (drizzleAdapter)

Drizzle provides a native adapter for Better Auth:

```typescript
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite', // or 'pg' for PostgreSQL
  }),
  // ... other Better Auth configuration
})
```

### Layer-Based Architecture (Infrastructure Layer)

Drizzle fits in the Infrastructure Layer:

```
┌─────────────────────────────────────┐
│      Presentation Layer             │
│  (Hono routes, React components)    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Application Layer              │
│  (Business logic, use cases)        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Domain Layer                   │
│  (Entities, value objects)          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Infrastructure Layer           │
│  (Drizzle ORM, repositories)        │  ← Drizzle lives here
└─────────────────────────────────────┘
```

## Database Setup

### SQLite with Bun (Local Development)

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'

// Create SQLite database connection
const sqlite = new Database('local.db')
export const db = drizzle(sqlite)

// Type-safe database instance
export type DrizzleDB = typeof db
```

### PostgreSQL with Bun (Production)

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// PostgreSQL connection
const client = postgres(process.env.DATABASE_URL!)
export const db = drizzle(client)

export type DrizzleDB = typeof db
```

### Database as Effect Layer

```typescript
// src/db/layer.ts
import { Effect, Layer, Context } from 'effect'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Database as BunDatabase } from 'bun:sqlite'

// Database service
export class Database extends Context.Tag('Database')<Database, ReturnType<typeof drizzle>>() {}

// Database layer (singleton)
export const DatabaseLive = Layer.sync(Database, () => {
  const sqlite = new BunDatabase('local.db')
  return drizzle(sqlite)
})

// Usage in Effect programs
const program = Effect.gen(function* () {
  const db = yield* Database
  const users = yield* Effect.promise(() => db.select().from(usersTable))
  return users
})

// Run with database layer
Effect.runPromise(Effect.provide(program, DatabaseLive))
```

## Schema Definition

### Basic Table Schema

```typescript
// src/db/schema/users.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

// Infer TypeScript types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

### Column Types

```typescript
import { sqliteTable, integer, text, real, blob } from 'drizzle-orm/sqlite-core'

export const products = sqliteTable('products', {
  // Numeric types
  id: integer('id').primaryKey({ autoIncrement: true }),
  quantity: integer('quantity').notNull().default(0),
  price: real('price').notNull(),

  // Text types
  name: text('name').notNull(),
  description: text('description'),
  status: text('status', { enum: ['active', 'inactive'] })
    .notNull()
    .default('active'),

  // JSON type (stored as text)
  metadata: text('metadata', { mode: 'json' }).$type<{ tags: string[]; featured: boolean }>(),

  // Timestamp
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),

  // Binary data
  image: blob('image', { mode: 'buffer' }),
})
```

### Relationships

```typescript
// src/db/schema/posts.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { users } from './users'

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))
```

### Indexes and Constraints

```typescript
import { sqliteTable, integer, text, uniqueIndex, index } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull(),
    username: text('username').notNull(),
    status: text('status').notNull(),
  },
  (table) => ({
    // Unique index
    emailIdx: uniqueIndex('email_idx').on(table.email),

    // Composite index
    statusUsernameIdx: index('status_username_idx').on(table.status, table.username),
  })
)
```

### Type Inference

```typescript
import { users, posts } from './schema'

// Select types (from database)
type User = typeof users.$inferSelect
// { id: number; name: string; email: string; createdAt: Date }

type Post = typeof posts.$inferSelect
// { id: number; title: string; content: string; authorId: number; createdAt: Date }

// Insert types (to database)
type NewUser = typeof users.$inferInsert
// { name: string; email: string; createdAt?: Date; id?: number }

type NewPost = typeof posts.$inferInsert
// { title: string; content: string; authorId: number; createdAt?: Date; id?: number }
```

## Query API

### Select Queries

```typescript
import { db } from './db'
import { users } from './schema'
import { eq, gt, like, and, or } from 'drizzle-orm'

// Select all users
const allUsers = await db.select().from(users)

// Select specific columns
const userEmails = await db.select({ email: users.email }).from(users)

// Where conditions
const activeUsers = await db.select().from(users).where(eq(users.status, 'active'))

// Multiple conditions
const filteredUsers = await db
  .select()
  .from(users)
  .where(and(eq(users.status, 'active'), gt(users.createdAt, new Date('2024-01-01'))))

// Pattern matching
const searchResults = await db.select().from(users).where(like(users.email, '%@example.com'))

// Limit and offset
const paginatedUsers = await db.select().from(users).limit(10).offset(20)

// Order by
const sortedUsers = await db.select().from(users).orderBy(users.createdAt)

// Single result
const user = await db.select().from(users).where(eq(users.id, 1)).get()
```

### Insert Queries

```typescript
import { db } from './db'
import { users } from './schema'

// Insert single record
const newUser = await db
  .insert(users)
  .values({
    name: 'Alice Johnson',
    email: 'alice@example.com',
  })
  .returning()

// Insert multiple records
const newUsers = await db
  .insert(users)
  .values([
    { name: 'Bob Smith', email: 'bob@example.com' },
    { name: 'Charlie Brown', email: 'charlie@example.com' },
  ])
  .returning()

// Insert with conflict handling (upsert)
const upsertedUser = await db
  .insert(users)
  .values({ email: 'alice@example.com', name: 'Alice Updated' })
  .onConflictDoUpdate({
    target: users.email,
    set: { name: 'Alice Updated' },
  })
  .returning()
```

### Update Queries

```typescript
import { db } from './db'
import { users } from './schema'
import { eq } from 'drizzle-orm'

// Update single record
const updatedUser = await db
  .update(users)
  .set({ name: 'Alice Smith Updated' })
  .where(eq(users.id, 1))
  .returning()

// Update multiple records
const updatedUsers = await db
  .update(users)
  .set({ status: 'inactive' })
  .where(eq(users.status, 'pending'))
  .returning()

// Partial updates
const partialUpdate = await db
  .update(users)
  .set({ email: 'newemail@example.com' })
  .where(eq(users.id, 1))
  .returning()
```

### Delete Queries

```typescript
import { db } from './db'
import { users } from './schema'
import { eq, lt } from 'drizzle-orm'

// Delete single record
await db.delete(users).where(eq(users.id, 1))

// Delete multiple records
await db.delete(users).where(eq(users.status, 'deleted'))

// Delete with condition
await db.delete(users).where(lt(users.createdAt, new Date('2020-01-01')))

// Delete with returning
const deletedUsers = await db.delete(users).where(eq(users.status, 'spam')).returning()
```

### Joins

```typescript
import { db } from './db'
import { users, posts } from './schema'
import { eq } from 'drizzle-orm'

// Inner join
const usersWithPosts = await db
  .select({
    user: users,
    post: posts,
  })
  .from(users)
  .innerJoin(posts, eq(users.id, posts.authorId))

// Left join
const allUsersWithPosts = await db
  .select({
    user: users,
    post: posts,
  })
  .from(users)
  .leftJoin(posts, eq(users.id, posts.authorId))

// Select specific columns from joins
const userPostTitles = await db
  .select({
    userName: users.name,
    postTitle: posts.title,
  })
  .from(users)
  .innerJoin(posts, eq(users.id, posts.authorId))
```

### Relational Queries

```typescript
import { db } from './db'
import { users, posts } from './schema'

// Query with automatic joins
const usersWithPosts = await db.query.users.findMany({
  with: {
    posts: true,
  },
})

// Nested relations
const usersWithPostsAndComments = await db.query.users.findMany({
  with: {
    posts: {
      with: {
        comments: true,
      },
    },
  },
})

// Filter related data
const activeUsersWithRecentPosts = await db.query.users.findMany({
  where: (users, { eq }) => eq(users.status, 'active'),
  with: {
    posts: {
      where: (posts, { gt }) => gt(posts.createdAt, new Date('2024-01-01')),
    },
  },
})

// Find single record
const userWithPosts = await db.query.users.findFirst({
  where: (users, { eq }) => eq(users.id, 1),
  with: {
    posts: true,
  },
})
```

## Transactions

```typescript
import { db } from './db'
import { users, posts } from './schema'

// Basic transaction
await db.transaction(async (tx) => {
  const newUser = await tx
    .insert(users)
    .values({ name: 'Alice', email: 'alice@example.com' })
    .returning()

  await tx.insert(posts).values({
    title: 'First Post',
    content: 'Hello World',
    authorId: newUser[0].id,
  })
})

// Transaction with rollback
try {
  await db.transaction(async (tx) => {
    await tx.update(users).set({ status: 'active' }).where(eq(users.id, 1))

    // This will rollback the entire transaction if it fails
    await tx.update(posts).set({ published: true }).where(eq(posts.authorId, 1))
  })
} catch (error) {
  console.error('Transaction failed:', error)
}
```

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

## Migrations with Drizzle Kit

### Configuration

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema/*',
  out: './drizzle',
  dialect: 'sqlite', // or 'postgresql', 'mysql'
  dbCredentials: {
    url: './local.db',
  },
} satisfies Config
```

### Migration Commands

```bash
# Generate migration from schema changes
bunx drizzle-kit generate

# Apply migrations to database
bunx drizzle-kit migrate

# Push schema changes directly (no migration files)
bunx drizzle-kit push

# Pull schema from existing database
bunx drizzle-kit pull

# Open Drizzle Studio (database GUI)
bunx drizzle-kit studio
```

### Migration Workflow

```typescript
// 1. Define/update schema
// src/db/schema/users.ts
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['admin', 'user'] })
    .notNull()
    .default('user'), // New field
})

// 2. Generate migration
// $ bunx drizzle-kit generate
// Creates: drizzle/0001_add_role_to_users.sql

// 3. Review migration
// drizzle/0001_add_role_to_users.sql
// ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user' NOT NULL;

// 4. Apply migration
// $ bunx drizzle-kit migrate
```

### Programmatic Migrations

```typescript
// src/db/migrate.ts
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { Database } from 'bun:sqlite'

const sqlite = new Database('local.db')
const db = drizzle(sqlite)

// Run migrations
await migrate(db, { migrationsFolder: './drizzle' })

console.log('Migrations applied successfully')
```

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

## Common Patterns

### Soft Deletes

```typescript
// Schema with deletedAt timestamp
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
})

// Soft delete helper
const softDeleteUser = (id: number) =>
  db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, id))

// Query active users only
const activeUsers = await db.select().from(users).where(isNull(users.deletedAt))
```

### Audit Timestamps

```typescript
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
})
```

### Pagination

```typescript
interface PaginationOptions {
  page: number
  pageSize: number
}

const paginateUsers = ({ page, pageSize }: PaginationOptions) =>
  Effect.gen(function* () {
    const db = yield* Database

    const offset = (page - 1) * pageSize

    const [users, totalCount] = yield* Effect.all([
      Effect.promise(() => db.select().from(usersTable).limit(pageSize).offset(offset)),
      Effect.promise(() =>
        db
          .select({ count: sql<number>`count(*)` })
          .from(usersTable)
          .get()
      ),
    ])

    return {
      data: users,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(totalCount!.count / pageSize),
        totalCount: totalCount!.count,
      },
    }
  })
```

### Search and Filtering

```typescript
interface UserFilters {
  status?: 'active' | 'inactive'
  search?: string
  minCreatedAt?: Date
}

const searchUsers = (filters: UserFilters) =>
  Effect.gen(function* () {
    const db = yield* Database

    let query = db.select().from(users)

    // Build dynamic where conditions
    const conditions = []

    if (filters.status) {
      conditions.push(eq(users.status, filters.status))
    }

    if (filters.search) {
      conditions.push(
        or(like(users.name, `%${filters.search}%`), like(users.email, `%${filters.search}%`))
      )
    }

    if (filters.minCreatedAt) {
      conditions.push(gt(users.createdAt, filters.minCreatedAt))
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    return yield* Effect.promise(() => query)
  })
```

## Integration with Better Auth

Drizzle provides native adapter support for Better Auth:

```typescript
// src/auth/index.ts
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite', // or 'pg' for PostgreSQL
  }),
  emailAndPassword: {
    enabled: true,
  },
  // Better Auth automatically creates these tables:
  // - user
  // - session
  // - account
  // - verification
})

// Custom user fields in schema
export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull(),
  image: text('image'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),

  // Custom fields
  role: text('role', { enum: ['admin', 'user'] })
    .notNull()
    .default('user'),
  bio: text('bio'),
})
```

For detailed Better Auth integration, see [Better Auth Documentation](../auth/better-auth.md).

## Performance Considerations

### Query Optimization

- **Select specific columns**: Only fetch data you need
- **Use indexes**: Add indexes for frequently queried columns
- **Paginate large result sets**: Avoid loading all records at once
- **Use prepared statements**: For repeated queries with different parameters
- **Batch operations**: Insert/update multiple records in single query

### Connection Pooling

```typescript
// PostgreSQL connection pooling
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

const client = postgres(process.env.DATABASE_URL!, {
  max: 10, // Maximum pool size
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout
})

export const db = drizzle(client)
```

### Caching with Effect

```typescript
import { Effect } from 'effect'

// Cache frequently accessed data
const getCachedUser = (id: number) =>
  findUser(id).pipe(
    Effect.cached, // Cache result
    Effect.withRequestCaching(true) // Enable request-level caching
  )
```

## Common Pitfalls to Avoid

- ❌ **Not using transactions for multi-step operations** - Risk of inconsistent state
- ❌ **Fetching all columns when only some are needed** - Wastes bandwidth and memory
- ❌ **Missing indexes on frequently queried columns** - Slow query performance
- ❌ **Not handling database errors explicitly** - Silent failures or poor error messages
- ❌ **Using raw SQL without type safety** - Loses Drizzle's type inference benefits
- ❌ **Not testing database operations** - Bugs in data layer can corrupt application state
- ❌ **Forgetting to run migrations** - Schema drift between environments
- ❌ **Hardcoding database credentials** - Security risk, use environment variables

## Drizzle Studio

Drizzle Kit includes a visual database browser:

```bash
# Start Drizzle Studio
bunx drizzle-kit studio

# Opens web interface at http://localhost:4983
```

**Features**:

- Browse database tables and data
- Run queries visually
- Inspect relationships
- Edit records (with caution in production)

## References

- Drizzle ORM documentation: https://orm.drizzle.team/
- Bun SQL integration: https://orm.drizzle.team/docs/connect-bun-sql
- Drizzle Kit migrations: https://orm.drizzle.team/kit-docs/overview
- Better Auth adapter: https://www.better-auth.com/docs/adapters/drizzle
- Effect.ts documentation: https://effect.website/docs/introduction

## Summary

Drizzle ORM provides type-safe database access for Omnera with:

- **Zero-Cost Type Safety**: Full TypeScript inference without runtime overhead
- **SQL-Like Syntax**: Familiar query patterns for SQL developers
- **Bun Native Integration**: Direct support for Bun's SQL module
- **Effect-Ready**: Seamless integration with Effect's functional patterns
- **Migration System**: Powerful drizzle-kit for schema management
- **Better Auth Compatible**: Native adapter for authentication
- **Relational Queries**: Automatic joins with type-safe relationships
- **Layer-Based Architecture**: Fits perfectly in Infrastructure Layer

By combining Drizzle with Effect, TypeScript, and Bun, Omnera achieves type-safe, performant, and maintainable database operations following functional programming principles.
