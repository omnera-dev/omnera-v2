# Drizzle ORM - Type-Safe SQL Database Toolkit

> **Note**: This is part 20 of the split documentation. See navigation links below.


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
---


## Navigation

[← Part 19](./19-references.md)


**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-drizzle-orm-for-omnera.md) | [Part 4](./04-installation.md) | [Part 5](./05-integration-with-omnera-stack.md) | [Part 6](./06-database-setup.md) | [Part 7](./07-schema-definition.md) | [Part 8](./08-query-api.md) | [Part 9](./09-transactions.md) | [Part 10](./10-effect-integration-patterns.md) | [Part 11](./11-migrations-with-drizzle-kit.md) | [Part 12](./12-best-practices.md) | [Part 13](./13-common-patterns.md) | [Part 14](./14-integration-with-better-auth-postgresql.md) | [Part 15](./15-performance-considerations.md) | [Part 16](./16-common-pitfalls-to-avoid.md) | [Part 17](./17-drizzle-studio.md) | [Part 18](./18-postgresql-best-practices-for-omnera.md) | [Part 19](./19-references.md) | **Part 20**