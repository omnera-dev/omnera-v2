# Drizzle ORM - Type-Safe SQL Database Toolkit

> **Note**: This is part 11 of the split documentation. See navigation links below.

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
    url: process.env.DATABASE_URL || 'postgres://localhost:5432/sovrium_dev',
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

````bash

### Migration Workflow (PostgreSQL)
```typescript
// 1. Define/update schema
// src/db/schema/users.ts
import { pgTable, integer, text, varchar, pgEnum } from 'drizzle-orm/pg-core'
export const roleEnum = pgEnum('role', ['admin', 'user'])
export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
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
````

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
  url: process.env.DATABASE_URL || 'postgres://localhost:5432/sovrium_dev',
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

---

## Navigation

[← Part 10](./10-effect-integration-patterns.md) | [Part 12 →](./12-best-practices.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-drizzle-orm-for-sovrium.md) | [Part 4](./04-installation.md) | [Part 5](./05-integration-with-sovrium-stack.md) | [Part 6](./06-database-setup.md) | [Part 7](./07-schema-definition.md) | [Part 8](./08-query-api.md) | [Part 9](./09-transactions.md) | [Part 10](./10-effect-integration-patterns.md) | **Part 11** | [Part 12](./12-best-practices.md) | [Part 13](./13-common-patterns.md) | [Part 14](./14-integration-with-better-auth-postgresql.md) | [Part 15](./15-performance-considerations.md) | [Part 16](./16-common-pitfalls-to-avoid.md) | [Part 17](./17-drizzle-studio.md) | [Part 18](./18-postgresql-best-practices-for-sovrium.md) | [Part 19](./19-references.md) | [Part 20](./20-summary.md)
