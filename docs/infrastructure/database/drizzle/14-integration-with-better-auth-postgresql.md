# Drizzle ORM - Type-Safe SQL Database Toolkit

> **Note**: This is part 14 of the split documentation. See navigation links below.

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

## For detailed Better Auth integration, see [Better Auth Documentation](../auth/better-auth.md).

## Navigation

[← Part 13](./13-common-patterns.md) | [Part 15 →](./15-performance-considerations.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-drizzle-orm-for-sovrium.md) | [Part 4](./04-installation.md) | [Part 5](./05-integration-with-sovrium-stack.md) | [Part 6](./06-database-setup.md) | [Part 7](./07-schema-definition.md) | [Part 8](./08-query-api.md) | [Part 9](./09-transactions.md) | [Part 10](./10-effect-integration-patterns.md) | [Part 11](./11-migrations-with-drizzle-kit.md) | [Part 12](./12-best-practices.md) | [Part 13](./13-common-patterns.md) | **Part 14** | [Part 15](./15-performance-considerations.md) | [Part 16](./16-common-pitfalls-to-avoid.md) | [Part 17](./17-drizzle-studio.md) | [Part 18](./18-postgresql-best-practices-for-sovrium.md) | [Part 19](./19-references.md) | [Part 20](./20-summary.md)
