# Drizzle ORM - Type-Safe SQL Database Toolkit

> **Note**: This is part 9 of the split documentation. See navigation links below.


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
---


## Navigation

[← Part 8](./08-query-api.md) | [Part 10 →](./10-effect-integration-patterns.md)


**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-drizzle-orm-for-omnera.md) | [Part 4](./04-installation.md) | [Part 5](./05-integration-with-omnera-stack.md) | [Part 6](./06-database-setup.md) | [Part 7](./07-schema-definition.md) | [Part 8](./08-query-api.md) | **Part 9** | [Part 10](./10-effect-integration-patterns.md) | [Part 11](./11-migrations-with-drizzle-kit.md) | [Part 12](./12-best-practices.md) | [Part 13](./13-common-patterns.md) | [Part 14](./14-integration-with-better-auth-postgresql.md) | [Part 15](./15-performance-considerations.md) | [Part 16](./16-common-pitfalls-to-avoid.md) | [Part 17](./17-drizzle-studio.md) | [Part 18](./18-postgresql-best-practices-for-omnera.md) | [Part 19](./19-references.md) | [Part 20](./20-summary.md)