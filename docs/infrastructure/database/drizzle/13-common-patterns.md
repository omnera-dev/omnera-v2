# Drizzle ORM - Type-Safe SQL Database Toolkit

> **Note**: This is part 13 of the split documentation. See navigation links below.


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
---


## Navigation

[← Part 12](./12-best-practices.md) | [Part 14 →](./14-integration-with-better-auth-postgresql.md)


**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-drizzle-orm-for-omnera.md) | [Part 4](./04-installation.md) | [Part 5](./05-integration-with-omnera-stack.md) | [Part 6](./06-database-setup.md) | [Part 7](./07-schema-definition.md) | [Part 8](./08-query-api.md) | [Part 9](./09-transactions.md) | [Part 10](./10-effect-integration-patterns.md) | [Part 11](./11-migrations-with-drizzle-kit.md) | [Part 12](./12-best-practices.md) | **Part 13** | [Part 14](./14-integration-with-better-auth-postgresql.md) | [Part 15](./15-performance-considerations.md) | [Part 16](./16-common-pitfalls-to-avoid.md) | [Part 17](./17-drizzle-studio.md) | [Part 18](./18-postgresql-best-practices-for-omnera.md) | [Part 19](./19-references.md) | [Part 20](./20-summary.md)