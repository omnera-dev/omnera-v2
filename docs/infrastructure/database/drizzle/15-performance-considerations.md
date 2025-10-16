# Drizzle ORM - Type-Safe SQL Database Toolkit

> **Note**: This is part 15 of the split documentation. See navigation links below.


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
---


## Navigation

[← Part 14](./14-integration-with-better-auth-postgresql.md) | [Part 16 →](./16-common-pitfalls-to-avoid.md)


**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-drizzle-orm-for-omnera.md) | [Part 4](./04-installation.md) | [Part 5](./05-integration-with-omnera-stack.md) | [Part 6](./06-database-setup.md) | [Part 7](./07-schema-definition.md) | [Part 8](./08-query-api.md) | [Part 9](./09-transactions.md) | [Part 10](./10-effect-integration-patterns.md) | [Part 11](./11-migrations-with-drizzle-kit.md) | [Part 12](./12-best-practices.md) | [Part 13](./13-common-patterns.md) | [Part 14](./14-integration-with-better-auth-postgresql.md) | **Part 15** | [Part 16](./16-common-pitfalls-to-avoid.md) | [Part 17](./17-drizzle-studio.md) | [Part 18](./18-postgresql-best-practices-for-omnera.md) | [Part 19](./19-references.md) | [Part 20](./20-summary.md)