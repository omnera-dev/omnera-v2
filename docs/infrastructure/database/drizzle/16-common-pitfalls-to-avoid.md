# Drizzle ORM - Type-Safe SQL Database Toolkit

> **Note**: This is part 16 of the split documentation. See navigation links below.

## Common Pitfalls to Avoid

- ❌ **Not using transactions for multi-step operations** - Risk of inconsistent state
- ❌ **Fetching all columns when only some are needed** - Wastes bandwidth and memory
- ❌ **Missing indexes on frequently queried columns** - Slow query performance
- ❌ **Not handling database errors explicitly** - Silent failures or poor error messages
- ❌ **Using raw SQL without type safety** - Loses Drizzle's type inference benefits
- ❌ **Not testing database operations** - Bugs in data layer can corrupt application state
- ❌ **Forgetting to run migrations** - Schema drift between environments
- ❌ **Hardcoding database credentials** - Security risk, use environment variables

---

## Navigation

[← Part 15](./15-performance-considerations.md) | [Part 17 →](./17-drizzle-studio.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-drizzle-orm-for-omnera.md) | [Part 4](./04-installation.md) | [Part 5](./05-integration-with-omnera-stack.md) | [Part 6](./06-database-setup.md) | [Part 7](./07-schema-definition.md) | [Part 8](./08-query-api.md) | [Part 9](./09-transactions.md) | [Part 10](./10-effect-integration-patterns.md) | [Part 11](./11-migrations-with-drizzle-kit.md) | [Part 12](./12-best-practices.md) | [Part 13](./13-common-patterns.md) | [Part 14](./14-integration-with-better-auth-postgresql.md) | [Part 15](./15-performance-considerations.md) | **Part 16** | [Part 17](./17-drizzle-studio.md) | [Part 18](./18-postgresql-best-practices-for-omnera.md) | [Part 19](./19-references.md) | [Part 20](./20-summary.md)
