# Drizzle ORM - Type-Safe SQL Database Toolkit

> **Note**: This is part 8 of the split documentation. See navigation links below.

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

---

## Navigation

[← Part 7](./07-schema-definition.md) | [Part 9 →](./09-transactions.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-drizzle-orm-for-sovrium.md) | [Part 4](./04-installation.md) | [Part 5](./05-integration-with-sovrium-stack.md) | [Part 6](./06-database-setup.md) | [Part 7](./07-schema-definition.md) | **Part 8** | [Part 9](./09-transactions.md) | [Part 10](./10-effect-integration-patterns.md) | [Part 11](./11-migrations-with-drizzle-kit.md) | [Part 12](./12-best-practices.md) | [Part 13](./13-common-patterns.md) | [Part 14](./14-integration-with-better-auth-postgresql.md) | [Part 15](./15-performance-considerations.md) | [Part 16](./16-common-pitfalls-to-avoid.md) | [Part 17](./17-drizzle-studio.md) | [Part 18](./18-postgresql-best-practices-for-sovrium.md) | [Part 19](./19-references.md) | [Part 20](./20-summary.md)
