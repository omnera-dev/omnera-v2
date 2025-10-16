# Drizzle ORM - Type-Safe SQL Database Toolkit

> **Note**: This is part 7 of the split documentation. See navigation links below.

## Schema Definition

### Basic Table Schema (PostgreSQL)

```typescript
// src/db/schema/users.ts
import { pgTable, integer, text, timestamp } from 'drizzle-orm/pg-core'
export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
// Infer TypeScript types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

**Key differences from SQLite**:

- Use `pgTable` instead of `sqliteTable`
- Use `integer().primaryKey().generatedAlwaysAsIdentity()` for auto-incrementing primary keys (modern PostgreSQL IDENTITY columns, preferred over deprecated `serial()`)
- Use `timestamp` for date/time columns (instead of `integer({ mode: 'timestamp' })`)
- Use `.defaultNow()` for current timestamp (instead of `.$defaultFn(() => new Date())`)
- Use `withTimezone: true` for timezone-aware timestamps (recommended)

### Column Types (PostgreSQL)

```typescript
import {
  pgTable,
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
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
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
| PostgreSQL Type | Drizzle Type | Use Case |
| ----------------- | ------------ | ------------------------------------- |
| `SERIAL` (deprecated) | `serial()` | Auto-incrementing integer primary key (legacy) |
| `IDENTITY` | `integer().generatedAlwaysAsIdentity()` | Auto-incrementing primary key (modern, preferred) |
| `INTEGER` | `integer()` | Whole numbers (-2B to +2B) |
| `BIGINT` | `bigint()` | Large integers |
| `NUMERIC` | `numeric()` | Precise decimal numbers (money) |
| `REAL` | `real()` | Floating point numbers |
| `TEXT` | `text()` | Unlimited text |
| `VARCHAR(n)` | `varchar()` | Variable-length string with limit |
| `BOOLEAN` | `boolean()` | True/false values |
| `TIMESTAMP` | `timestamp()` | Date and time |
| `TIMESTAMPTZ` | `timestamp({ withTimezone: true })` | Timezone-aware timestamp |
| `JSONB` | `jsonb()` | Binary JSON (faster than JSON) |
| `BYTEA` | `bytea()` | Binary data |
| `UUID` | `uuid()` | Universally unique identifier |
| `ENUM` | `pgEnum()` | Custom enum type |

### Relationships (PostgreSQL)

```typescript
// src/db/schema/posts.ts
import { pgTable, integer, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'
export const posts = pgTable('posts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
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
import { pgTable, integer, varchar, text, uniqueIndex, index } from 'drizzle-orm/pg-core'
export const users = pgTable(
  'users',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
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

---

## Navigation

[← Part 6](./06-database-setup.md) | [Part 8 →](./08-query-api.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-drizzle-orm-for-omnera.md) | [Part 4](./04-installation.md) | [Part 5](./05-integration-with-omnera-stack.md) | [Part 6](./06-database-setup.md) | **Part 7** | [Part 8](./08-query-api.md) | [Part 9](./09-transactions.md) | [Part 10](./10-effect-integration-patterns.md) | [Part 11](./11-migrations-with-drizzle-kit.md) | [Part 12](./12-best-practices.md) | [Part 13](./13-common-patterns.md) | [Part 14](./14-integration-with-better-auth-postgresql.md) | [Part 15](./15-performance-considerations.md) | [Part 16](./16-common-pitfalls-to-avoid.md) | [Part 17](./17-drizzle-studio.md) | [Part 18](./18-postgresql-best-practices-for-omnera.md) | [Part 19](./19-references.md) | [Part 20](./20-summary.md)
