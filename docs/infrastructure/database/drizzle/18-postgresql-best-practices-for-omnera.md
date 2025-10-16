# Drizzle ORM - Type-Safe SQL Database Toolkit

> **Note**: This is part 18 of the split documentation. See navigation links below.

## PostgreSQL Best Practices for Omnera

### 1. Environment-Specific Configuration

````bash

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
````

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

````bash

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
````

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
      try: () => db.insert(users).values({ email, name }).returning(),
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

---

## Navigation

[← Part 17](./17-drizzle-studio.md) | [Part 19 →](./19-references.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-drizzle-orm-for-omnera.md) | [Part 4](./04-installation.md) | [Part 5](./05-integration-with-omnera-stack.md) | [Part 6](./06-database-setup.md) | [Part 7](./07-schema-definition.md) | [Part 8](./08-query-api.md) | [Part 9](./09-transactions.md) | [Part 10](./10-effect-integration-patterns.md) | [Part 11](./11-migrations-with-drizzle-kit.md) | [Part 12](./12-best-practices.md) | [Part 13](./13-common-patterns.md) | [Part 14](./14-integration-with-better-auth-postgresql.md) | [Part 15](./15-performance-considerations.md) | [Part 16](./16-common-pitfalls-to-avoid.md) | [Part 17](./17-drizzle-studio.md) | **Part 18** | [Part 19](./19-references.md) | [Part 20](./20-summary.md)
