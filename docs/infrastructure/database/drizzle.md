# Drizzle ORM - Type-Safe SQL Database Toolkit

## Overview

**Version**: TBD (installed as dependency)
**Purpose**: TypeScript-first ORM for SQL databases providing type-safe queries with zero-cost type safety, SQL-like syntax, and native Bun runtime integration

Drizzle ORM is a headless TypeScript ORM that acts as a type-safe SQL wrapper rather than a traditional abstraction layer. It provides full TypeScript inference, compile-time validation, and a query API that closely resembles SQL while maintaining complete type safety.

## Why Drizzle ORM for Omnera

- **TypeScript-First**: Schemas define types, queries are fully type-safe with inference
- **Zero-Cost Type Safety**: Types are erased at build time, no runtime overhead
- **Bun SQL Native Support**: Direct integration with Bun's SQL module for PostgreSQL (no external drivers)
- **PostgreSQL-Optimized**: Native support for PostgreSQL features (JSONB, enums, CTEs, partial indexes)
- **SQL-Like Syntax**: Familiar SQL patterns without learning a new query language
- **Effect-Ready**: Perfect integration with Effect.ts for database operations
- **Better Auth Compatible**: Native adapter support for authentication integration with PostgreSQL
- **Lightweight**: Minimal bundle size, no heavy ORM abstractions
- **Migration System**: drizzle-kit provides powerful schema migration tools
- **Relational Queries**: Automatic joins with type-safe relationship definitions
- **Connection Pooling**: Built-in pool management for production workloads

## Installation

Drizzle ORM requires two packages:

```bash
# Install Drizzle ORM and Drizzle Kit
bun add drizzle-orm
bun add -d drizzle-kit

# For PostgreSQL with Bun SQL (recommended)
# No additional driver needed - Bun has built-in PostgreSQL support via bun:sql
# This eliminates dependencies like postgres, pg, or node-postgres
```

**Key Advantage**: Unlike Node.js which requires external PostgreSQL drivers (`pg`, `postgres`, etc.), Bun's native SQL module provides direct PostgreSQL integration out of the box. This means:

- ✅ No external dependencies
- ✅ Faster connection establishment
- ✅ Better performance with native bindings
- ✅ Simpler dependency management
- ✅ Unified API across SQL databases

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

Drizzle operations integrate seamlessly with Effect using Bun SQL:

```typescript
import { Effect, Context, Layer } from 'effect'
import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'

// Define Database service
class Database extends Context.Tag('Database')<Database, ReturnType<typeof drizzle>>() {}

// Database layer with Bun SQL
const DatabaseLive = Layer.sync(Database, () => {
  const client = new SQL({
    url: process.env.DATABASE_URL!,
    max: 20,
  })
  return drizzle({ client })
})

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

### PostgreSQL with Bun SQL (Recommended)

Bun provides native PostgreSQL support through its built-in SQL module. This is the recommended approach for both development and production.

#### Development Setup

```typescript
// src/db/index.ts
import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'

// Development PostgreSQL connection
// Uses local Postgres with simpler configuration
const client = new SQL({
  url: process.env.DATABASE_URL || 'postgres://localhost:5432/omnera_dev',
  max: 5, // Lower pool size for development
  idleTimeout: 20, // Close idle connections after 20s
  connectionTimeout: 10, // Connection timeout in seconds
})

export const db = drizzle({ client })
export type DrizzleDB = typeof db
```

**Development .env file**:

```bash
# Local PostgreSQL connection
DATABASE_URL=postgres://localhost:5432/omnera_dev

# Or with credentials
DATABASE_URL=postgres://user:password@localhost:5432/omnera_dev
```

#### Production Setup

```typescript
// src/db/index.ts
import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'

// Production PostgreSQL connection
// Uses connection pooling and SSL for security
const client = new SQL({
  url: process.env.DATABASE_URL!,
  max: 20, // Higher pool size for production load
  idleTimeout: 30, // Close idle connections after 30s
  maxLifetime: 0, // Connection lifetime (0 = unlimited)
  connectionTimeout: 30, // Connection timeout in seconds
})

export const db = drizzle({ client })
export type DrizzleDB = typeof db
```

**Production .env file**:

```bash
# Production PostgreSQL connection with SSL
DATABASE_URL=postgres://user:password@production-host:5432/omnera_prod?sslmode=require

# Or using alternative environment variables
POSTGRES_URL=postgres://user:password@production-host:5432/omnera_prod?sslmode=require
```

#### Connection String Formats

Bun SQL supports multiple PostgreSQL connection string formats:

```bash
# Standard PostgreSQL format
postgres://user:password@host:port/database

# PostgreSQL alternative format
postgresql://user:password@host:port/database

# With SSL mode (production)
postgres://user:password@host:port/database?sslmode=require

# With SSL verification (most secure)
postgres://user:password@host:port/database?sslmode=verify-full

# Local development (no password)
postgres://localhost:5432/omnera_dev
```

#### Environment Variable Detection

Bun automatically detects PostgreSQL connection from these environment variables (in order):

1. `POSTGRES_URL`
2. `DATABASE_URL`
3. `PGURL` or `PG_URL`
4. `TLS_POSTGRES_DATABASE_URL`

#### Simple Connection (Auto-Detection)

For simple cases, Bun can auto-detect the connection:

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/bun-sql'

// Auto-detects DATABASE_URL or POSTGRES_URL
export const db = drizzle(process.env.DATABASE_URL!)

// Even simpler with default environment variable
// Bun checks DATABASE_URL automatically
export const db = drizzle()
```

### SQLite with Bun (Alternative for Local Development)

For local development without PostgreSQL, you can use SQLite:

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

**Note**: Use SQLite only for local development. Production should use PostgreSQL with Bun SQL.

### Database as Effect Layer

```typescript
// src/db/layer.ts
import { Effect, Layer, Context } from 'effect'
import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'

// Database service
export class Database extends Context.Tag('Database')<Database, ReturnType<typeof drizzle>>() {}

// Database layer (singleton) - Development
export const DatabaseLive = Layer.sync(Database, () => {
  const client = new SQL({
    url: process.env.DATABASE_URL || 'postgres://localhost:5432/omnera_dev',
    max: 5, // Development pool size
    idleTimeout: 20,
    connectionTimeout: 10,
  })

  return drizzle({ client })
})

// Database layer - Production
export const DatabaseProduction = Layer.sync(Database, () => {
  const client = new SQL({
    url: process.env.DATABASE_URL!,
    max: 20, // Production pool size
    idleTimeout: 30,
    maxLifetime: 0,
    connectionTimeout: 30,
  })

  return drizzle({ client })
})

// Environment-aware layer
export const DatabaseEnv = process.env.NODE_ENV === 'production'
  ? DatabaseProduction
  : DatabaseLive

// Usage in Effect programs
const program = Effect.gen(function* () {
  const db = yield* Database
  const users = yield* Effect.promise(() => db.select().from(usersTable))
  return users
})

// Run with database layer
Effect.runPromise(Effect.provide(program, DatabaseEnv))
```

## Schema Definition

### Basic Table Schema (PostgreSQL)

```typescript
// src/db/schema/users.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// Infer TypeScript types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

**Key differences from SQLite**:

- Use `pgTable` instead of `sqliteTable`
- Use `serial` for auto-incrementing primary keys (instead of `integer({ autoIncrement: true })`)
- Use `timestamp` for date/time columns (instead of `integer({ mode: 'timestamp' })`)
- Use `.defaultNow()` for current timestamp (instead of `.$defaultFn(() => new Date())`)
- Use `withTimezone: true` for timezone-aware timestamps (recommended)

### Column Types (PostgreSQL)

```typescript
import {
  pgTable,
  serial,
  integer,
  text,
  varchar,
  boolean,
  timestamp,
  numeric,
  jsonb,
  pgEnum,
  bytea,
} from 'drizzle-orm/pg-core'

// Define enum type (PostgreSQL native enum)
export const statusEnum = pgEnum('status', ['active', 'inactive', 'archived'])

export const products = pgTable('products', {
  // Numeric types
  id: serial('id').primaryKey(),
  quantity: integer('quantity').notNull().default(0),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(), // Money-safe decimal

  // Text types
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  sku: varchar('sku', { length: 50 }).notNull().unique(),

  // Enum type (PostgreSQL native)
  status: statusEnum('status').notNull().default('active'),

  // Boolean type
  featured: boolean('featured').notNull().default(false),

  // JSON type (JSONB for better performance)
  metadata: jsonb('metadata').$type<{ tags: string[]; featured: boolean }>(),

  // Timestamps with timezone
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  // Binary data
  image: bytea('image'),
})
```

**PostgreSQL Type Mapping**:

| PostgreSQL Type   | Drizzle Type | Use Case                              |
| ----------------- | ------------ | ------------------------------------- |
| `SERIAL`          | `serial()`   | Auto-incrementing integer primary key |
| `INTEGER`         | `integer()`  | Whole numbers (-2B to +2B)            |
| `BIGINT`          | `bigint()`   | Large integers                        |
| `NUMERIC`         | `numeric()`  | Precise decimal numbers (money)       |
| `REAL`            | `real()`     | Floating point numbers                |
| `TEXT`            | `text()`     | Unlimited text                        |
| `VARCHAR(n)`      | `varchar()`  | Variable-length string with limit     |
| `BOOLEAN`         | `boolean()`  | True/false values                     |
| `TIMESTAMP`       | `timestamp()` | Date and time                        |
| `TIMESTAMPTZ`     | `timestamp({ withTimezone: true })` | Timezone-aware timestamp |
| `JSONB`           | `jsonb()`    | Binary JSON (faster than JSON)        |
| `BYTEA`           | `bytea()`    | Binary data                           |
| `UUID`            | `uuid()`     | Universally unique identifier         |
| `ENUM`            | `pgEnum()`   | Custom enum type                      |

### Relationships (PostgreSQL)

```typescript
// src/db/schema/posts.ts
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
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

**PostgreSQL Foreign Key Options**:

- `onDelete: 'cascade'` - Delete posts when user is deleted
- `onDelete: 'set null'` - Set authorId to null when user is deleted
- `onDelete: 'restrict'` - Prevent user deletion if posts exist
- `onUpdate: 'cascade'` - Update references when primary key changes

### Indexes and Constraints (PostgreSQL)

```typescript
import { pgTable, serial, varchar, text, uniqueIndex, index } from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    username: varchar('username', { length: 100 }).notNull(),
    status: text('status').notNull(),
  },
  (table) => ({
    // Unique index (alternative to .unique() on column)
    emailIdx: uniqueIndex('email_idx').on(table.email),

    // Composite index for queries filtering by status and username
    statusUsernameIdx: index('status_username_idx').on(table.status, table.username),

    // Partial index (PostgreSQL feature)
    activeUsersIdx: index('active_users_idx')
      .on(table.username)
      .where(sql`status = 'active'`),
  })
)
```

**PostgreSQL Index Types**:

- `index()` - B-tree index (default, most common)
- `uniqueIndex()` - Unique constraint with index
- Partial indexes with `.where()` clause (PostgreSQL-specific optimization)

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
  dialect: 'postgresql', // Use PostgreSQL dialect
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://localhost:5432/omnera_dev',
  },
} satisfies Config
```

**Environment-Specific Configuration**:

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit'

const isProduction = process.env.NODE_ENV === 'production'

export default {
  schema: './src/db/schema/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // Production SSL configuration
    ...(isProduction && {
      ssl: {
        rejectUnauthorized: true,
      },
    }),
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

### Migration Workflow (PostgreSQL)

```typescript
// 1. Define/update schema
// src/db/schema/users.ts
import { pgTable, serial, text, varchar, pgEnum } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['admin', 'user'])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: roleEnum('role').notNull().default('user'), // New field
})

// 2. Generate migration
// $ bunx drizzle-kit generate
// Creates: drizzle/0001_add_role_to_users.sql

// 3. Review migration
// drizzle/0001_add_role_to_users.sql
// CREATE TYPE "role" AS ENUM('admin', 'user');
// ALTER TABLE users ADD COLUMN role "role" DEFAULT 'user' NOT NULL;

// 4. Apply migration
// $ bunx drizzle-kit migrate
```

**Key PostgreSQL Migration Features**:

- **Enum Types**: PostgreSQL creates native ENUM types
- **Indexes**: Automatically creates indexes for foreign keys
- **Constraints**: CHECK constraints, UNIQUE constraints preserved
- **Triggers**: Can add custom triggers in migration files
- **Extensions**: Can enable PostgreSQL extensions (e.g., `uuid-ossp`, `postgis`)

### Programmatic Migrations (PostgreSQL)

```typescript
// src/db/migrate.ts
import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'
import { migrate } from 'drizzle-orm/bun-sql/migrator'

const client = new SQL({
  url: process.env.DATABASE_URL || 'postgres://localhost:5432/omnera_dev',
})
const db = drizzle({ client })

// Run migrations
await migrate(db, { migrationsFolder: './drizzle' })

console.log('Migrations applied successfully')

// Close connection
await client.end()
```

**Running Migrations on Startup** (Effect Pattern):

```typescript
// src/db/migrations.ts
import { Effect } from 'effect'
import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'
import { migrate } from 'drizzle-orm/bun-sql/migrator'

export const runMigrations = Effect.gen(function* () {
  console.log('Running database migrations...')

  const client = new SQL({
    url: process.env.DATABASE_URL!,
  })

  const db = drizzle({ client })

  yield* Effect.tryPromise({
    try: () => migrate(db, { migrationsFolder: './drizzle' }),
    catch: (error) => new Error(`Migration failed: ${error}`),
  })

  console.log('Migrations completed successfully')

  yield* Effect.promise(() => client.end())
})

// In application startup
import { Effect } from 'effect'
import { runMigrations } from './db/migrations'

const app = Effect.gen(function* () {
  // Run migrations on startup
  yield* runMigrations

  // Start application
  // ... rest of application code
})

Effect.runPromise(app)
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

## Integration with Better Auth (PostgreSQL)

Drizzle provides native adapter support for Better Auth with PostgreSQL:

```typescript
// src/auth/index.ts
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // Use PostgreSQL provider
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

// Custom user fields in schema (PostgreSQL)
import { pgTable, text, varchar, boolean, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('user_role', ['admin', 'user', 'moderator'])

export const users = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(), // UUID for distributed systems
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  // Custom fields
  role: roleEnum('role').notNull().default('user'),
  bio: text('bio'),
})
```

For detailed Better Auth integration, see [Better Auth Documentation](../auth/better-auth.md).

## Performance Considerations

### Query Optimization (PostgreSQL)

- **Select specific columns**: Only fetch data you need
- **Use indexes**: Add indexes for frequently queried columns
- **Paginate large result sets**: Avoid loading all records at once
- **Use prepared statements**: For repeated queries with different parameters
- **Batch operations**: Insert/update multiple records in single query
- **Use JSONB indexes**: Index JSONB columns for faster queries
- **Partial indexes**: Create indexes with WHERE clauses for specific query patterns
- **Use EXPLAIN ANALYZE**: Profile queries to identify bottlenecks

```typescript
// Example: JSONB indexing in PostgreSQL
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  metadata: jsonb('metadata').$type<{ tags: string[]; category: string }>(),
}, (table) => ({
  // GIN index for JSONB queries
  metadataIdx: index('metadata_idx').on(table.metadata).using('gin'),
}))

// Efficient JSONB queries
const productsWithTag = await db
  .select()
  .from(products)
  .where(sql`metadata->>'category' = 'electronics'`)
```

### Connection Pooling (Bun SQL with PostgreSQL)

Bun SQL provides built-in connection pooling for PostgreSQL:

```typescript
// src/db/index.ts
import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'

// Development pool configuration
const devClient = new SQL({
  url: process.env.DATABASE_URL || 'postgres://localhost:5432/omnera_dev',
  max: 5, // Smaller pool for development
  idleTimeout: 20, // Close idle connections after 20s
  connectionTimeout: 10, // Connection timeout in seconds
})

// Production pool configuration
const prodClient = new SQL({
  url: process.env.DATABASE_URL!,
  max: 20, // Larger pool for production load
  idleTimeout: 30, // Keep connections longer
  maxLifetime: 3600, // Connection max lifetime (1 hour)
  connectionTimeout: 30, // Longer timeout for production
})

export const db = drizzle({
  client: process.env.NODE_ENV === 'production' ? prodClient : devClient,
})
```

**Connection Pool Best Practices**:

- **Development**: Use smaller pool (5-10 connections) to conserve resources
- **Production**: Scale pool size based on concurrent load (20-100 connections)
- **Idle Timeout**: Balance between connection reuse and resource consumption
- **Max Lifetime**: Rotate connections periodically to handle connection issues
- **Monitoring**: Track pool utilization and adjust based on metrics

### PostgreSQL-Specific Optimizations

```typescript
// 1. Use RETURNING clause efficiently
const newUsers = await db
  .insert(users)
  .values([
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
  ])
  .returning({ id: users.id, email: users.email }) // Return only needed columns

// 2. Bulk inserts with ON CONFLICT
await db
  .insert(users)
  .values(largeUserArray)
  .onConflictDoUpdate({
    target: users.email,
    set: { updatedAt: sql`EXCLUDED.updated_at` },
  })

// 3. Use WITH queries (CTEs) for complex operations
await db.execute(sql`
  WITH active_users AS (
    SELECT id FROM users WHERE status = 'active'
  )
  SELECT p.* FROM posts p
  INNER JOIN active_users u ON p.author_id = u.id
`)

// 4. Parallel queries with Effect
import { Effect } from 'effect'

const fetchDashboardData = Effect.all({
  users: Effect.promise(() => db.select().from(users).limit(10)),
  posts: Effect.promise(() => db.select().from(posts).limit(20)),
  stats: Effect.promise(() => db.query.stats.findFirst()),
}, { concurrency: 3 }) // Execute 3 queries in parallel
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

## PostgreSQL Best Practices for Omnera

### 1. Environment-Specific Configuration

```bash
# Development (.env.local)
DATABASE_URL=postgres://localhost:5432/omnera_dev
NODE_ENV=development

# Production (.env.production)
DATABASE_URL=postgres://user:password@prod-host:5432/omnera_prod?sslmode=require
NODE_ENV=production
```

### 2. Security Considerations

```typescript
// ✅ CORRECT: Use environment variables for credentials
const client = new SQL({
  url: process.env.DATABASE_URL!,
})

// ❌ INCORRECT: Hardcoded credentials
const client = new SQL({
  url: 'postgres://user:password@localhost:5432/db', // Never commit credentials
})
```

**Production Security Checklist**:

- ✅ Use SSL/TLS connections (`?sslmode=require` or `?sslmode=verify-full`)
- ✅ Store credentials in environment variables or secrets management
- ✅ Use connection pooling to prevent resource exhaustion
- ✅ Implement database-level access controls (roles and permissions)
- ✅ Enable query logging in production (for debugging)
- ✅ Regularly update PostgreSQL and Drizzle ORM versions
- ✅ Use prepared statements (Drizzle does this automatically)
- ✅ Sanitize user input with Effect Schema validation

### 3. Development Workflow

```bash
# 1. Start local PostgreSQL
docker run --name omnera-postgres -e POSTGRES_PASSWORD=dev -p 5432:5432 -d postgres:16

# 2. Create development database
createdb omnera_dev

# 3. Generate initial migration
bunx drizzle-kit generate

# 4. Apply migration
bunx drizzle-kit migrate

# 5. Open Drizzle Studio to inspect
bunx drizzle-kit studio
```

### 4. Database Schema Best Practices

```typescript
// ✅ CORRECT: Use explicit column types with constraints
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// ❌ INCORRECT: Using text for everything
export const users = pgTable('users', {
  id: text('id'), // No primary key constraint
  email: text('email'), // No unique constraint
  name: text('name'), // No length limit
  createdAt: text('created_at'), // Should be timestamp
})
```

### 5. Migration Strategy

- **Never edit existing migrations** - Always create new migration files
- **Review generated SQL** - Check migration files before applying
- **Test migrations locally** - Apply to development database first
- **Backup before production migrations** - Always have rollback plan
- **Run migrations in transactions** - PostgreSQL supports transactional DDL

### 6. Error Handling Patterns

```typescript
import { Effect } from 'effect'
import { Database } from './db/layer'

// PostgreSQL-specific error handling
export class DatabaseConnectionError {
  readonly _tag = 'DatabaseConnectionError'
  constructor(readonly cause: unknown) {}
}

export class UniqueViolationError {
  readonly _tag = 'UniqueViolationError'
  constructor(readonly field: string) {}
}

const createUser = (email: string, name: string) =>
  Effect.gen(function* () {
    const db = yield* Database

    return yield* Effect.tryPromise({
      try: () =>
        db
          .insert(users)
          .values({ email, name })
          .returning(),
      catch: (error: any) => {
        // PostgreSQL error code for unique violation
        if (error.code === '23505') {
          return new UniqueViolationError('email')
        }
        return new DatabaseConnectionError(error)
      },
    })
  })
```

## References

- Drizzle ORM documentation: https://orm.drizzle.team/
- Bun SQL integration: https://orm.drizzle.team/docs/connect-bun-sql
- Bun SQL API: https://bun.sh/docs/api/sql
- PostgreSQL documentation: https://www.postgresql.org/docs/
- Drizzle Kit migrations: https://orm.drizzle.team/kit-docs/overview
- Better Auth adapter: https://www.better-auth.com/docs/adapters/drizzle
- Effect.ts documentation: https://effect.website/docs/introduction

## Summary

Drizzle ORM with Bun SQL and PostgreSQL provides production-ready database access for Omnera:

### Key Features

- **Zero-Cost Type Safety**: Full TypeScript inference without runtime overhead
- **SQL-Like Syntax**: Familiar query patterns for SQL developers
- **Bun SQL Native Integration**: Direct support for Bun's PostgreSQL module (no external drivers)
- **PostgreSQL-First**: Native support for PostgreSQL features (JSONB, enums, partial indexes)
- **Effect-Ready**: Seamless integration with Effect's functional patterns
- **Connection Pooling**: Built-in pool management for development and production
- **Migration System**: Powerful drizzle-kit for schema management
- **Better Auth Compatible**: Native adapter for authentication with PostgreSQL
- **Relational Queries**: Automatic joins with type-safe relationships
- **Layer-Based Architecture**: Fits perfectly in Infrastructure Layer

### Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| **Database** | Local PostgreSQL | Production PostgreSQL |
| **Connection** | Simple URL | SSL-enabled URL |
| **Pool Size** | 5-10 connections | 20-100 connections |
| **Timeouts** | Shorter (10-20s) | Longer (30s) |
| **SSL** | Optional | Required (`sslmode=require`) |
| **Monitoring** | Basic logging | Full metrics and alerts |

### Why Bun SQL with PostgreSQL?

1. **Native Integration**: No external drivers, leverages Bun's built-in PostgreSQL support
2. **Performance**: Bun's native bindings provide exceptional speed
3. **Simplicity**: Single import (`import { SQL } from 'bun'`)
4. **Auto-Detection**: Automatically detects `DATABASE_URL` environment variable
5. **Production-Ready**: Built-in connection pooling and SSL support

By combining Drizzle with Effect, TypeScript, Bun SQL, and PostgreSQL, Omnera achieves type-safe, performant, and maintainable database operations following functional programming principles.
