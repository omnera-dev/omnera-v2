# Drizzle ORM - Type-Safe SQL Database Toolkit

> **Note**: This is part 6 of the split documentation. See navigation links below.

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
  url: process.env.DATABASE_URL || 'postgres://localhost:5432/sovrium_dev',
  max: 5, // Lower pool size for development
  idleTimeout: 20, // Close idle connections after 20s
  connectionTimeout: 10, // Connection timeout in seconds
})
export const db = drizzle({ client })
export type DrizzleDB = typeof db
```

**Development .env file**:

````bash

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
````

**Production .env file**:

````bash

#### Connection String Formats
Bun SQL supports multiple PostgreSQL connection string formats:
```bash

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
````

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
    url: process.env.DATABASE_URL || 'postgres://localhost:5432/sovrium_dev',
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
export const DatabaseEnv = process.env.NODE_ENV === 'production' ? DatabaseProduction : DatabaseLive
// Usage in Effect programs
const program = Effect.gen(function* () {
  const db = yield* Database
  const users = yield* Effect.promise(() => db.select().from(usersTable))
  return users
})
// Run with database layer
Effect.runPromise(Effect.provide(program, DatabaseEnv))
```

---

## Navigation

[← Part 5](./05-integration-with-sovrium-stack.md) | [Part 7 →](./07-schema-definition.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-drizzle-orm-for-sovrium.md) | [Part 4](./04-installation.md) | [Part 5](./05-integration-with-sovrium-stack.md) | **Part 6** | [Part 7](./07-schema-definition.md) | [Part 8](./08-query-api.md) | [Part 9](./09-transactions.md) | [Part 10](./10-effect-integration-patterns.md) | [Part 11](./11-migrations-with-drizzle-kit.md) | [Part 12](./12-best-practices.md) | [Part 13](./13-common-patterns.md) | [Part 14](./14-integration-with-better-auth-postgresql.md) | [Part 15](./15-performance-considerations.md) | [Part 16](./16-common-pitfalls-to-avoid.md) | [Part 17](./17-drizzle-studio.md) | [Part 18](./18-postgresql-best-practices-for-sovrium.md) | [Part 19](./19-references.md) | [Part 20](./20-summary.md)
