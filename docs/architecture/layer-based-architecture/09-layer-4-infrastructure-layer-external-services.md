# Layer-Based Architecture in Omnera

> **Note**: This is part 9 of the split documentation. See navigation links below.

## Layer 4: Infrastructure Layer (External Services)

### Responsibility

Implement interfaces defined in Application Layer, handle I/O, interact with external systems.

### Technologies

- **Bun** - Runtime environment, file system, execution
- **Effect.ts** - Side effect management
- **Database drivers** - PostgreSQL, SQLite, etc.
- **HTTP clients** - Fetch API, axios, etc.

### What Belongs Here

- Repository implementations (database access)
- External API clients (third-party services)
- File system operations
- Email service implementations
- Logging implementations
- Caching implementations
- Effect Layer definitions (dependency wiring)

### What Does NOT Belong Here

- ❌ Business logic or validation
- ❌ UI components or rendering
- ❌ Use case orchestration
- ❌ Domain models (those belong in Domain Layer)

### Communication Pattern

- **Inbound**: Called by Application Layer via interfaces
- **Outbound**: External systems (databases, APIs, file system)
- **Dependencies**: Application Layer interfaces (implements them)

### Code Examples

#### Repository Implementation

```typescript
// src/infrastructure/repositories/UserRepositoryImpl.ts
import { Effect, Layer } from 'effect'
import type { User } from '@/domain/models/User'
import { UserRepository } from '@/application/ports/UserRepository'
import { UserNotFoundError } from '@/application/errors/UserNotFoundError'
import { DatabaseError } from '@/application/errors/DatabaseError'
// ✅ CORRECT: Implements Application Layer interface
interface Database {
  query: (sql: string, params: unknown[]) => Promise<unknown[]>
  execute: (sql: string, params: unknown[]) => Promise<void>
}
// Mock database for demonstration
const mockDatabase: Database = {
  query: async (sql, params) => {
    // Simulated database query
    return []
  },
  execute: async (sql, params) => {
    // Simulated database execution
  },
}
export const UserRepositoryLive = Layer.succeed(UserRepository, {
  findById: (id: number) =>
    Effect.gen(function* () {
      try {
        const rows = (yield* Effect.promise(() =>
          mockDatabase.query('SELECT * FROM users WHERE id = ?', [id])
        )) as User[]
        if (rows.length === 0) {
          return yield* Effect.fail(new UserNotFoundError({ userId: id }))
        }
        return rows[0]
      } catch (error) {
        return yield* Effect.fail(
          new DatabaseError({ message: 'Failed to fetch user', cause: error })
        )
      }
    }),
  findByEmail: (email: string) =>
    Effect.gen(function* () {
      try {
        const rows = (yield* Effect.promise(() =>
          mockDatabase.query('SELECT * FROM users WHERE email = ?', [email])
        )) as User[]
        if (rows.length === 0) {
          return yield* Effect.fail(new UserNotFoundError({ email }))
        }
        return rows[0]
      } catch (error) {
        return yield* Effect.fail(
          new DatabaseError({ message: 'Failed to fetch user', cause: error })
        )
      }
    }),
  save: (user: User) =>
    Effect.gen(function* () {
      try {
        if (user.id === 0) {
          // Insert
          yield* Effect.promise(() =>
            mockDatabase.execute(
              'INSERT INTO users (name, email, password_hash, joined_at, is_active) VALUES (?, ?, ?, ?, ?)',
              [user.name, user.email, user.passwordHash, user.joinedAt, user.isActive]
            )
          )
        } else {
          // Update
          yield* Effect.promise(() =>
            mockDatabase.execute(
              'UPDATE users SET name = ?, email = ?, is_active = ? WHERE id = ?',
              [user.name, user.email, user.isActive, user.id]
            )
          )
        }
      } catch (error) {
        return yield* Effect.fail(
          new DatabaseError({ message: 'Failed to save user', cause: error })
        )
      }
    }),
  delete: (id: number) =>
    Effect.gen(function* () {
      try {
        yield* Effect.promise(() => mockDatabase.execute('DELETE FROM users WHERE id = ?', [id]))
      } catch (error) {
        return yield* Effect.fail(
          new DatabaseError({ message: 'Failed to delete user', cause: error })
        )
      }
    }),
})
```

#### Logger Implementation

```typescript
// src/infrastructure/logging/LoggerImpl.ts
import { Effect, Layer } from 'effect'
import { Logger } from '@/application/ports/Logger'
// ✅ CORRECT: Implements Application Layer interface
export const LoggerLive = Layer.succeed(Logger, {
  info: (message: string) =>
    Effect.sync(() => {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`)
    }),
  error: (message: string, error?: unknown) =>
    Effect.sync(() => {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error)
    }),
  warn: (message: string) =>
    Effect.sync(() => {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`)
    }),
  debug: (message: string) =>
    Effect.sync(() => {
      if (process.env.LOG_LEVEL === 'debug') {
        console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`)
      }
    }),
})
```

#### Email Service Implementation

```typescript
// src/infrastructure/email/EmailServiceImpl.ts
import { Effect, Layer } from 'effect'
import { EmailService } from '@/application/ports/EmailService'
import { EmailError } from '@/application/errors/EmailError'
// ✅ CORRECT: Implements Application Layer interface
export const EmailServiceLive = Layer.succeed(EmailService, {
  sendWelcomeEmail: ({ to, name }) =>
    Effect.gen(function* () {
      try {
        // In production, use a real email service (SendGrid, AWS SES, etc.)
        yield* Effect.promise(() =>
          fetch('https://api.example.com/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to,
              subject: 'Welcome to Omnera!',
              html: `<h1>Welcome, ${name}!</h1><p>Thanks for joining Omnera.</p>`,
            }),
          })
        )
      } catch (error) {
        return yield* Effect.fail(
          new EmailError({ message: 'Failed to send welcome email', cause: error })
        )
      }
    }),
  sendPasswordResetEmail: ({ to, resetToken }) =>
    Effect.gen(function* () {
      try {
        const resetLink = `https://omnera.com/reset-password?token=${resetToken}`
        yield* Effect.promise(() =>
          fetch('https://api.example.com/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to,
              subject: 'Password Reset Request',
              html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
            }),
          })
        )
      } catch (error) {
        return yield* Effect.fail(
          new EmailError({ message: 'Failed to send password reset email', cause: error })
        )
      }
    }),
})
```

#### Application Layer (Dependency Wiring)

```typescript
// src/infrastructure/layers/AppLayer.ts
import { Layer } from 'effect'
import { UserRepositoryLive } from '@/infrastructure/repositories/UserRepositoryImpl'
import { LoggerLive } from '@/infrastructure/logging/LoggerImpl'
import { EmailServiceLive } from '@/infrastructure/email/EmailServiceImpl'
// ✅ CORRECT: Compose all infrastructure implementations
export const AppLayer = Layer.mergeAll(UserRepositoryLive, LoggerLive, EmailServiceLive)
```

### Do's and Don'ts

#### ✅ DO

1. **Implement Application Layer interfaces** (ports/adapters)
2. **Handle I/O operations** (database, network, file system)
3. **Wrap external services** in Effect programs
4. **Map external errors** to domain/application errors
5. **Use Effect Layer** for dependency composition
6. **Isolate implementation details** (database schema, API formats)

#### ❌ DON'T

1. **Implement business logic** (belongs in Domain Layer)
2. **Orchestrate use cases** (belongs in Application Layer)
3. **Expose infrastructure details** to upper layers
4. **Mix infrastructure concerns** with domain models

---

## Navigation

[← Part 8](./08-layer-3-domain-layer-business-logic.md) | [Part 10 →](./10-layer-communication-patterns.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-what-is-layer-based-architecture.md) | [Part 4](./04-why-layer-based-architecture-for-omnera.md) | [Part 5](./05-omneras-four-layers.md) | [Part 6](./06-layer-1-presentation-layer-uiapi.md) | [Part 7](./07-layer-2-application-layer-use-casesorchestration.md) | [Part 8](./08-layer-3-domain-layer-business-logic.md) | **Part 9** | [Part 10](./10-layer-communication-patterns.md) | [Part 11](./11-integration-with-functional-programming.md) | [Part 12](./12-testing-layer-based-architecture.md) | [Part 13](./13-file-structure.md) | [Part 14](./14-best-practices.md) | [Part 15](./15-common-pitfalls.md) | [Part 16](./16-resources-and-references.md) | [Part 17](./17-summary.md)
