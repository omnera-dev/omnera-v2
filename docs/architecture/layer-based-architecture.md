# Layer-Based Architecture in Omnera

## Overview

Omnera follows a **Layer-Based Architecture** (also known as **Layered Architecture**), a proven architectural pattern that organizes code into distinct horizontal layers with well-defined responsibilities and clear boundaries. Each layer has a specific role and communicates with other layers through explicit interfaces.

This architecture pattern aligns perfectly with Omnera's Functional Programming principles and Effect.ts's dependency injection system, creating a maintainable, testable, and scalable codebase.

## What is Layer-Based Architecture?

Layer-Based Architecture structures an application into logical layers stacked on top of each other. Each layer:

- Has a single, well-defined responsibility
- Communicates only with adjacent layers (typically)
- Depends on layers below it, never above
- Provides clear interfaces for interaction
- Can be developed, tested, and maintained independently

**Reference**: [Bitloops Layered Architecture Documentation](https://bitloops.com/docs/bitloops-language/learning/software-architecture/layered-architecture)

## Why Layer-Based Architecture for Omnera?

### Benefits for Our Stack

1. **Clear Separation of Concerns** - Each layer handles a specific aspect of the application
2. **Independent Development** - Teams can work on different layers simultaneously
3. **Enhanced Testability** - Layers can be tested in isolation with mocked dependencies
4. **Maintainability** - Changes in one layer have minimal impact on others
5. **Reusability** - Domain and Application layers can be reused across different UIs
6. **Effect.ts Alignment** - Layer boundaries map naturally to Effect Context and dependency injection
7. **FP Integration** - Pure functions in Domain layer, explicit effects in outer layers
8. **Type Safety** - TypeScript enforces layer boundaries through strict interfaces

### Integration with Existing Technologies

| Technology     | Primary Layer                | Role                                    |
| -------------- | ---------------------------- | --------------------------------------- |
| **Effect.ts**  | Application + Infrastructure | Orchestration, side effects, DI         |
| **TypeScript** | All Layers                   | Type safety, interface definitions      |
| **Hono**       | Presentation (API)           | HTTP routing, request/response handling |
| **React**      | Presentation (UI)            | Component rendering, user interactions  |
| **Bun**        | Infrastructure               | Runtime, execution environment          |
| **Tailwind**   | Presentation (UI)            | Styling, visual presentation            |

## Omnera's Four Layers

Omnera's architecture consists of four distinct layers, each with specific responsibilities:

```
┌─────────────────────────────────────────────┐
│       PRESENTATION LAYER (UI/API)           │  ← User interaction, HTTP, rendering
│  React Components, Hono Routes, Tailwind   │
├─────────────────────────────────────────────┤
│       APPLICATION LAYER (Use Cases)         │  ← Business workflows, orchestration
│    Effect Programs, Use Case Logic          │
├─────────────────────────────────────────────┤
│       DOMAIN LAYER (Business Logic)         │  ← Pure business rules, core logic
│  Pure Functions, Domain Models, Validation  │
├─────────────────────────────────────────────┤
│    INFRASTRUCTURE LAYER (External)          │  ← I/O, databases, APIs, services
│  Database, HTTP Client, File System, Bun    │
└─────────────────────────────────────────────┘
```

### Dependency Direction (Critical Rule)

**Dependencies flow INWARD only** - outer layers depend on inner layers, NEVER the reverse:

```
Presentation → Application → Domain ← Infrastructure
```

- **Presentation** depends on **Application** and **Domain**
- **Application** depends on **Domain** and defines **Infrastructure interfaces**
- **Domain** depends on NOTHING (pure, self-contained)
- **Infrastructure** implements interfaces defined in **Application/Domain**

## Layer 1: Presentation Layer (UI/API)

### Responsibility

Handle user interactions, render UI, route HTTP requests, and present data to users.

### Technologies

- **React 19** - UI components, user interactions
- **Hono** - HTTP routing, API endpoints
- **Tailwind CSS** - Component styling

### What Belongs Here

- React components (presentational and container)
- Hono route handlers (API endpoints)
- HTTP request/response formatting
- Input validation (basic format checks)
- UI state management (component-level)
- Route parameter extraction
- Error presentation (error pages, alerts)
- Form handling and submission

### What Does NOT Belong Here

- ❌ Business logic and calculations
- ❌ Database queries or operations
- ❌ Complex validation rules (domain responsibility)
- ❌ Data transformation logic
- ❌ External API calls (infrastructure responsibility)

### Communication Pattern

- **Inbound**: User input, HTTP requests
- **Outbound**: Calls Application Layer use cases
- **Dependencies**: Application Layer interfaces

### Code Examples

#### React Component (Presentation Layer)

```typescript
// src/presentation/components/UserProfile.tsx
import { useState, useEffect } from 'react'
import { Effect } from 'effect'
import type { User } from '@/domain/models/User'
import { GetUserProfile } from '@/application/use-cases/GetUserProfile'
import { AppLayer } from '@/infrastructure/layers/AppLayer'

// ✅ CORRECT: Presentation component delegates to Application Layer
interface UserProfileProps {
  readonly userId: number
}

export function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Call Application Layer use case
    const program = GetUserProfile({ userId }).pipe(
      Effect.provide(AppLayer)
    )

    Effect.runPromise(program)
      .then((user) => {
        setUser(user)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [userId])

  if (loading) return <div className="text-gray-500">Loading...</div>
  if (error) return <div className="text-red-600">Error: {error}</div>
  if (!user) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">{user.name}</h1>
      <p className="text-gray-600">{user.email}</p>
      <p className="mt-2 text-sm text-gray-500">
        Member since {user.joinedAt.toLocaleDateString()}
      </p>
    </div>
  )
}
```

#### Hono Route Handler (Presentation Layer)

```typescript
// src/presentation/api/users.ts
import { Hono } from 'hono'
import { Effect } from 'effect'
import { GetUserProfile } from '@/application/use-cases/GetUserProfile'
import { UpdateUserEmail } from '@/application/use-cases/UpdateUserEmail'
import { AppLayer } from '@/infrastructure/layers/AppLayer'

const app = new Hono()

// ✅ CORRECT: Route handler delegates to Application Layer
app.get('/users/:id', async (c) => {
  const userId = Number(c.req.param('id'))

  // Validate input format (presentation responsibility)
  if (isNaN(userId) || userId <= 0) {
    return c.json({ error: 'Invalid user ID' }, 400)
  }

  // Call Application Layer use case
  const program = GetUserProfile({ userId }).pipe(Effect.provide(AppLayer))

  const result = await Effect.runPromise(program.pipe(Effect.either))

  if (result._tag === 'Left') {
    const error = result.left
    if (error._tag === 'UserNotFoundError') {
      return c.json({ error: 'User not found' }, 404)
    }
    return c.json({ error: 'Internal server error' }, 500)
  }

  const user = result.right
  return c.json({
    id: user.id,
    name: user.name,
    email: user.email,
    joinedAt: user.joinedAt.toISOString(),
  })
})

app.patch('/users/:id/email', async (c) => {
  const userId = Number(c.req.param('id'))
  const body = await c.req.json()

  // Basic format validation (presentation responsibility)
  if (!body.email || typeof body.email !== 'string') {
    return c.json({ error: 'Email is required' }, 400)
  }

  // Call Application Layer use case (includes domain validation)
  const program = UpdateUserEmail({ userId, newEmail: body.email }).pipe(Effect.provide(AppLayer))

  const result = await Effect.runPromise(program.pipe(Effect.either))

  if (result._tag === 'Left') {
    const error = result.left
    if (error._tag === 'InvalidEmailError') {
      return c.json({ error: error.message }, 400)
    }
    if (error._tag === 'UserNotFoundError') {
      return c.json({ error: 'User not found' }, 404)
    }
    return c.json({ error: 'Internal server error' }, 500)
  }

  return c.json({ success: true })
})

export default app
```

### Do's and Don'ts

#### ✅ DO

1. **Delegate business logic** to Application Layer use cases
2. **Handle presentation concerns** (routing, rendering, styling)
3. **Validate input format** (basic checks like type, presence)
4. **Transform data for display** (formatting dates, currencies)
5. **Manage UI state** (loading, error, form input)
6. **Map errors to user-friendly messages** (presentation responsibility)

#### ❌ DON'T

1. **Implement business rules** (belongs in Domain Layer)
2. **Access databases directly** (use Application Layer)
3. **Perform complex calculations** (belongs in Domain Layer)
4. **Make external API calls** (use Application Layer)
5. **Mix presentation and business logic** (separate concerns)

## Layer 2: Application Layer (Use Cases/Orchestration)

### Responsibility

Orchestrate business workflows, coordinate between layers, and handle application-specific logic.

### Technologies

- **Effect.ts** - Use case orchestration, dependency injection
- **TypeScript** - Type-safe interfaces and error handling

### What Belongs Here

- Use case implementations (application workflows)
- Service orchestration (coordinating multiple domain services)
- Transaction management (coordinating multiple operations)
- Application-specific validation (workflow rules)
- Effect programs (side effect orchestration)
- Dependency injection (Effect Context and Layers)
- Cross-cutting concerns (logging, monitoring, caching)

### What Does NOT Belong Here

- ❌ UI rendering or HTTP routing
- ❌ Pure business logic (domain responsibility)
- ❌ Database queries (infrastructure responsibility)
- ❌ External API implementations (infrastructure responsibility)

### Communication Pattern

- **Inbound**: Calls from Presentation Layer
- **Outbound**: Calls Domain Layer (pure functions), Infrastructure Layer (via interfaces)
- **Dependencies**: Domain Layer, Infrastructure Layer interfaces

### Code Examples

#### Use Case: Get User Profile

```typescript
// src/application/use-cases/GetUserProfile.ts
import { Effect } from 'effect'
import type { User } from '@/domain/models/User'
import { UserRepository } from '@/application/ports/UserRepository'
import { Logger } from '@/application/ports/Logger'
import { UserNotFoundError } from '@/application/errors/UserNotFoundError'

// ✅ CORRECT: Use case orchestrates workflow
export interface GetUserProfileInput {
  readonly userId: number
}

export const GetUserProfile = (
  input: GetUserProfileInput
): Effect.Effect<User, UserNotFoundError, UserRepository | Logger> =>
  Effect.gen(function* () {
    const logger = yield* Logger
    const userRepo = yield* UserRepository

    // Log workflow start
    yield* logger.info(`Fetching user profile for user ${input.userId}`)

    // Fetch user from repository (infrastructure)
    const user = yield* userRepo.findById(input.userId)

    // Log success
    yield* logger.info(`User profile retrieved: ${user.name}`)

    return user
  })
```

#### Use Case: Update User Email

```typescript
// src/application/use-cases/UpdateUserEmail.ts
import { Effect } from 'effect'
import { validateEmail } from '@/domain/validators/emailValidator'
import { UserRepository } from '@/application/ports/UserRepository'
import { Logger } from '@/application/ports/Logger'
import { UserNotFoundError } from '@/application/errors/UserNotFoundError'
import { InvalidEmailError } from '@/domain/errors/InvalidEmailError'

// ✅ CORRECT: Use case coordinates domain validation and infrastructure
export interface UpdateUserEmailInput {
  readonly userId: number
  readonly newEmail: string
}

export const UpdateUserEmail = (
  input: UpdateUserEmailInput
): Effect.Effect<void, UserNotFoundError | InvalidEmailError, UserRepository | Logger> =>
  Effect.gen(function* () {
    const logger = yield* Logger
    const userRepo = yield* UserRepository

    // Validate email using Domain Layer (pure function)
    const emailValidation = validateEmail(input.newEmail)
    if (!emailValidation.isValid) {
      return yield* Effect.fail(new InvalidEmailError({ message: emailValidation.error }))
    }

    // Fetch user
    const user = yield* userRepo.findById(input.userId)

    // Create updated user (Domain Layer logic - immutable)
    const updatedUser = {
      ...user,
      email: input.newEmail,
    }

    // Save to repository (Infrastructure Layer)
    yield* userRepo.save(updatedUser)

    yield* logger.info(`User ${input.userId} email updated to ${input.newEmail}`)
  })
```

#### Use Case: Register New User

```typescript
// src/application/use-cases/RegisterUser.ts
import { Effect } from 'effect'
import { createUser } from '@/domain/factories/userFactory'
import { validateEmail } from '@/domain/validators/emailValidator'
import { hashPassword } from '@/domain/services/passwordService'
import { UserRepository } from '@/application/ports/UserRepository'
import { EmailService } from '@/application/ports/EmailService'
import { Logger } from '@/application/ports/Logger'
import { InvalidEmailError } from '@/domain/errors/InvalidEmailError'
import { UserAlreadyExistsError } from '@/application/errors/UserAlreadyExistsError'

// ✅ CORRECT: Complex use case orchestrating multiple services
export interface RegisterUserInput {
  readonly name: string
  readonly email: string
  readonly password: string
}

export const RegisterUser = (
  input: RegisterUserInput
): Effect.Effect<
  { userId: number },
  InvalidEmailError | UserAlreadyExistsError,
  UserRepository | EmailService | Logger
> =>
  Effect.gen(function* () {
    const logger = yield* Logger
    const userRepo = yield* UserRepository
    const emailService = yield* EmailService

    // 1. Validate email (Domain Layer)
    const emailValidation = validateEmail(input.email)
    if (!emailValidation.isValid) {
      return yield* Effect.fail(new InvalidEmailError({ message: emailValidation.error }))
    }

    // 2. Check if user exists
    const existingUser = yield* userRepo.findByEmail(input.email).pipe(Effect.option)
    if (existingUser._tag === 'Some') {
      return yield* Effect.fail(new UserAlreadyExistsError({ email: input.email }))
    }

    // 3. Hash password (Domain Layer - pure function)
    const hashedPassword = hashPassword(input.password)

    // 4. Create user (Domain Layer - factory)
    const newUser = createUser({
      name: input.name,
      email: input.email,
      passwordHash: hashedPassword,
    })

    // 5. Save user (Infrastructure Layer)
    yield* userRepo.save(newUser)

    // 6. Send welcome email (Infrastructure Layer)
    yield* emailService.sendWelcomeEmail({
      to: newUser.email,
      name: newUser.name,
    })

    yield* logger.info(`New user registered: ${newUser.email}`)

    return { userId: newUser.id }
  })
```

#### Application Ports (Interfaces)

```typescript
// src/application/ports/UserRepository.ts
import { Effect, Context } from 'effect'
import type { User } from '@/domain/models/User'
import { UserNotFoundError } from '@/application/errors/UserNotFoundError'
import { DatabaseError } from '@/application/errors/DatabaseError'

// ✅ CORRECT: Define infrastructure interface in Application Layer
export class UserRepository extends Context.Tag('UserRepository')<
  UserRepository,
  {
    readonly findById: (id: number) => Effect.Effect<User, UserNotFoundError, never>
    readonly findByEmail: (email: string) => Effect.Effect<User, UserNotFoundError, never>
    readonly save: (user: User) => Effect.Effect<void, DatabaseError, never>
    readonly delete: (id: number) => Effect.Effect<void, DatabaseError, never>
  }
>() {}
```

```typescript
// src/application/ports/Logger.ts
import { Effect, Context } from 'effect'

// ✅ CORRECT: Define logging interface in Application Layer
export class Logger extends Context.Tag('Logger')<
  Logger,
  {
    readonly info: (message: string) => Effect.Effect<void, never, never>
    readonly error: (message: string, error?: unknown) => Effect.Effect<void, never, never>
    readonly warn: (message: string) => Effect.Effect<void, never, never>
    readonly debug: (message: string) => Effect.Effect<void, never, never>
  }
>() {}
```

### Do's and Don'ts

#### ✅ DO

1. **Orchestrate workflows** using Effect.gen
2. **Define infrastructure interfaces** (ports/adapters pattern)
3. **Call Domain Layer pure functions** for business logic
4. **Coordinate multiple repositories** and services
5. **Handle cross-cutting concerns** (logging, caching)
6. **Use Effect Context** for dependency injection
7. **Return typed errors** in Effect signatures

#### ❌ DON'T

1. **Implement UI logic** (belongs in Presentation Layer)
2. **Write pure business rules** (belongs in Domain Layer)
3. **Access database directly** (define interface, implement in Infrastructure)
4. **Mix orchestration with business logic** (separate concerns)

## Layer 3: Domain Layer (Business Logic)

### Responsibility

Contain pure business logic, domain models, validation rules, and core algorithms. This is the heart of the application.

### Technologies

- **TypeScript** - Pure functions, interfaces, type definitions
- **Functional Programming** - Immutability, pure functions, composition

### What Belongs Here

- Domain models (entities, value objects)
- Business rules (validation, calculations)
- Pure functions (deterministic, no side effects)
- Domain services (pure business logic)
- Factories (object creation logic)
- Type definitions and interfaces
- Domain errors (business rule violations)

### What Does NOT Belong Here

- ❌ UI components or rendering
- ❌ HTTP routes or API endpoints
- ❌ Database queries or I/O operations
- ❌ External API calls
- ❌ Effect programs (those belong in Application Layer)
- ❌ Infrastructure concerns

### Communication Pattern

- **Inbound**: Calls from Application Layer
- **Outbound**: NONE (pure, self-contained)
- **Dependencies**: ZERO external dependencies

### Code Examples

#### Domain Model

```typescript
// src/domain/models/User.ts

// ✅ CORRECT: Immutable domain model
export interface User {
  readonly id: number
  readonly name: string
  readonly email: string
  readonly passwordHash: string
  readonly joinedAt: Date
  readonly isActive: boolean
}
```

#### Domain Validator (Pure Function)

```typescript
// src/domain/validators/emailValidator.ts

// ✅ CORRECT: Pure validation function
export interface EmailValidationResult {
  readonly isValid: boolean
  readonly error?: string
}

export function validateEmail(email: string): EmailValidationResult {
  // Basic presence check
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' }
  }

  // Length check
  if (email.length > 255) {
    return { isValid: false, error: 'Email is too long' }
  }

  // Format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Email format is invalid' }
  }

  return { isValid: true }
}
```

#### Domain Service (Pure Functions)

```typescript
// src/domain/services/passwordService.ts
import { createHash } from 'crypto'

// ✅ CORRECT: Pure domain service (deterministic for same input)
export function hashPassword(password: string): string {
  // In production, use bcrypt or similar with proper salting
  // This is simplified for demonstration
  return createHash('sha256').update(password).digest('hex')
}

export function verifyPassword(password: string, hash: string): boolean {
  const computedHash = hashPassword(password)
  return computedHash === hash
}

// ✅ CORRECT: Password strength validation (pure function)
export interface PasswordStrengthResult {
  readonly isValid: boolean
  readonly strength: 'weak' | 'medium' | 'strong'
  readonly errors: readonly string[]
}

export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  const isValid = errors.length === 0
  let strength: 'weak' | 'medium' | 'strong' = 'weak'

  if (isValid) {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    strength = password.length >= 12 && hasSpecialChar ? 'strong' : 'medium'
  }

  return { isValid, strength, errors }
}
```

#### Domain Factory

```typescript
// src/domain/factories/userFactory.ts
import type { User } from '@/domain/models/User'

// ✅ CORRECT: Factory creates domain objects (pure function)
export interface CreateUserInput {
  readonly name: string
  readonly email: string
  readonly passwordHash: string
}

export function createUser(input: CreateUserInput): User {
  return {
    id: 0, // Will be assigned by database
    name: input.name.trim(),
    email: input.email.toLowerCase().trim(),
    passwordHash: input.passwordHash,
    joinedAt: new Date(),
    isActive: true,
  }
}
```

#### Domain Calculations (Pure Functions)

```typescript
// src/domain/services/orderCalculator.ts

// ✅ CORRECT: Pure business calculations
export interface OrderItem {
  readonly price: number
  readonly quantity: number
}

export function calculateSubtotal(items: readonly OrderItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

export function calculateDiscount(subtotal: number, discountPercent: number): number {
  return subtotal * (discountPercent / 100)
}

export function calculateTax(subtotal: number, taxRate: number): number {
  return subtotal * (taxRate / 100)
}

export interface OrderTotal {
  readonly subtotal: number
  readonly discount: number
  readonly tax: number
  readonly total: number
}

export function calculateOrderTotal(
  items: readonly OrderItem[],
  discountPercent: number,
  taxRate: number
): OrderTotal {
  const subtotal = calculateSubtotal(items)
  const discount = calculateDiscount(subtotal, discountPercent)
  const taxableAmount = subtotal - discount
  const tax = calculateTax(taxableAmount, taxRate)
  const total = taxableAmount + tax

  return { subtotal, discount, tax, total }
}
```

#### Domain Errors

```typescript
// src/domain/errors/InvalidEmailError.ts
import { Data } from 'effect'

// ✅ CORRECT: Domain error for business rule violation
export class InvalidEmailError extends Data.TaggedError('InvalidEmailError')<{
  readonly message: string
}> {}
```

### Do's and Don'ts

#### ✅ DO

1. **Write pure functions** (deterministic, no side effects)
2. **Use immutable data structures** (readonly, const)
3. **Validate business rules** (email format, password strength)
4. **Perform calculations** (order totals, discounts)
5. **Define domain models** (entities, value objects)
6. **Create factories** for object construction
7. **Keep dependencies to ZERO** (no external dependencies)

#### ❌ DON'T

1. **Perform I/O operations** (database, file system, network)
2. **Use Effect programs** (Effect belongs in Application Layer)
3. **Access external services** (repositories, APIs)
4. **Mix presentation concerns** (UI, HTTP)
5. **Use non-deterministic functions** (Date.now(), Math.random())
6. **Depend on other layers** (self-contained)

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

## Layer Communication Patterns

### Pattern 1: Presentation → Application → Domain

```typescript
// Presentation Layer (React Component)
function UserProfile({ userId }) {
  const program = GetUserProfile({ userId }) // Application Layer use case
  // ...
}

// Application Layer (Use Case)
export const GetUserProfile = (input) =>
  Effect.gen(function* () {
    const user = yield* userRepo.findById(input.userId) // Infrastructure
    const isValid = validateUser(user) // Domain Layer (pure)
    return user
  })

// Domain Layer (Pure Function)
export function validateUser(user: User): boolean {
  return user.isActive && validateEmail(user.email).isValid
}
```

### Pattern 2: Application → Infrastructure (via Interface)

```typescript
// Application Layer defines interface
export class UserRepository extends Context.Tag('UserRepository')<
  UserRepository,
  {
    readonly findById: (id: number) => Effect.Effect<User, UserNotFoundError>
  }
>() {}

// Infrastructure Layer implements interface
export const UserRepositoryLive = Layer.succeed(UserRepository, {
  findById: (id) => Effect.promise(() => database.query('SELECT ...')),
})

// Application Layer uses interface (dependency injection)
const program = Effect.gen(function* () {
  const repo = yield* UserRepository
  const user = yield* repo.findById(123)
  return user
})
```

### Pattern 3: Error Handling Across Layers

```typescript
// Domain Layer: Business rule violation
export class InvalidEmailError extends Data.TaggedError('InvalidEmailError')<{
  readonly message: string
}> {}

// Application Layer: Use case error
export class UserNotFoundError extends Data.TaggedError('UserNotFoundError')<{
  readonly userId: number
}> {}

// Infrastructure Layer: Technical error
export class DatabaseError extends Data.TaggedError('DatabaseError')<{
  readonly message: string
  readonly cause?: unknown
}> {}

// Application Layer handles all error types
const program = Effect.gen(function* () {
  const email = 'user@example.com'

  // Domain validation
  const validation = validateEmail(email)
  if (!validation.isValid) {
    return yield* Effect.fail(new InvalidEmailError({ message: validation.error }))
  }

  // Infrastructure access
  const user = yield* userRepo.findByEmail(email) // May fail with UserNotFoundError or DatabaseError

  return user
})

// Presentation Layer maps errors to user-friendly messages
const result = await Effect.runPromise(program.pipe(Effect.either))

if (result._tag === 'Left') {
  const error = result.left
  if (error._tag === 'InvalidEmailError') {
    return c.json({ error: error.message }, 400)
  }
  if (error._tag === 'UserNotFoundError') {
    return c.json({ error: 'User not found' }, 404)
  }
  if (error._tag === 'DatabaseError') {
    return c.json({ error: 'Internal server error' }, 500)
  }
}
```

## Integration with Functional Programming

Layer-Based Architecture complements Functional Programming principles:

| FP Principle          | Layer Application                                              |
| --------------------- | -------------------------------------------------------------- |
| **Pure Functions**    | Domain Layer contains only pure functions                      |
| **Immutability**      | All layers use immutable data structures                       |
| **Composition**       | Use cases compose domain functions and infrastructure effects  |
| **Explicit Effects**  | Infrastructure Layer wraps side effects in Effect programs     |
| **Type Safety**       | TypeScript enforces layer boundaries via interfaces            |
| **Dependency Inject** | Effect Context makes dependencies explicit at layer boundaries |

### Example: Pure Domain + Effect Application + Infrastructure

```typescript
// Domain Layer: Pure function (FP principle: Pure Functions)
export function calculateDiscount(price: number, percent: number): number {
  return price * (percent / 100)
}

// Application Layer: Orchestrates with Effect (FP principle: Explicit Effects)
export const ApplyDiscount = (input: {
  orderId: number
  percent: number
}): Effect.Effect<Order, OrderNotFoundError, OrderRepository | Logger> =>
  Effect.gen(function* () {
    const repo = yield* OrderRepository
    const logger = yield* Logger

    // Fetch order (Infrastructure)
    const order = yield* repo.findById(input.orderId)

    // Calculate discount (Domain - pure)
    const discount = calculateDiscount(order.total, input.percent)

    // Create updated order (FP principle: Immutability)
    const updatedOrder = {
      ...order,
      discount,
      total: order.total - discount,
    }

    // Save order (Infrastructure)
    yield* repo.save(updatedOrder)

    yield* logger.info(`Discount applied to order ${input.orderId}`)

    return updatedOrder
  })

// Infrastructure Layer: Implements side effects
export const OrderRepositoryLive = Layer.succeed(OrderRepository, {
  findById: (id) => Effect.promise(() => database.query('SELECT ...', [id])),
  save: (order) => Effect.promise(() => database.execute('UPDATE ...', [order])),
})
```

## Testing Layer-Based Architecture

Each layer can be tested independently:

### Domain Layer Testing (Pure Functions)

```typescript
import { test, expect } from 'bun:test'
import { calculateDiscount } from '@/domain/services/orderCalculator'

// ✅ Testing pure functions (trivial - no mocking needed)
test('calculateDiscount calculates 10% discount correctly', () => {
  expect(calculateDiscount(100, 10)).toBe(10)
  expect(calculateDiscount(200, 15)).toBe(30)
  expect(calculateDiscount(50, 0)).toBe(0)
})
```

### Application Layer Testing (Mock Infrastructure)

```typescript
import { test, expect } from 'bun:test'
import { Effect, Layer } from 'effect'
import { GetUserProfile } from '@/application/use-cases/GetUserProfile'
import { UserRepository } from '@/application/ports/UserRepository'

// ✅ Testing use cases with mocked infrastructure
test('GetUserProfile fetches user successfully', async () => {
  // Mock repository
  const MockUserRepository = Layer.succeed(UserRepository, {
    findById: (id) =>
      Effect.succeed({
        id,
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hash',
        joinedAt: new Date(),
        isActive: true,
      }),
  })

  // Mock logger
  const MockLogger = Layer.succeed(Logger, {
    info: () => Effect.void,
    error: () => Effect.void,
    warn: () => Effect.void,
    debug: () => Effect.void,
  })

  const TestLayer = Layer.mergeAll(MockUserRepository, MockLogger)

  // Run use case with mocks
  const program = GetUserProfile({ userId: 1 }).pipe(Effect.provide(TestLayer))

  const user = await Effect.runPromise(program)

  expect(user.name).toBe('Test User')
  expect(user.email).toBe('test@example.com')
})
```

### Infrastructure Layer Testing (Integration Tests)

```typescript
import { test, expect } from 'bun:test'
import { Effect, Layer } from 'effect'
import { UserRepositoryLive } from '@/infrastructure/repositories/UserRepositoryImpl'
import { UserRepository } from '@/application/ports/UserRepository'

// ✅ Testing infrastructure implementations (integration test)
test('UserRepository saves and retrieves user', async () => {
  const program = Effect.gen(function* () {
    const repo = yield* UserRepository

    // Save user
    const newUser = {
      id: 0,
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash: 'hash123',
      joinedAt: new Date(),
      isActive: true,
    }

    yield* repo.save(newUser)

    // Retrieve user
    const savedUser = yield* repo.findByEmail('alice@example.com')

    return savedUser
  }).pipe(Effect.provide(UserRepositoryLive))

  const user = await Effect.runPromise(program)

  expect(user.name).toBe('Alice')
  expect(user.email).toBe('alice@example.com')
})
```

### Presentation Layer Testing (Component/Route Tests)

See [React Testing](../infrastructure/ui/react-testing.md) and [Playwright E2E Testing](../infrastructure/testing/playwright.md) for details.

## File Structure

```
omnera-v2/
├── src/
│   ├── domain/                      # Domain Layer
│   │   ├── models/                  # Domain models (User, Order, etc.)
│   │   │   ├── User.ts
│   │   │   └── Order.ts
│   │   ├── services/                # Domain services (pure functions)
│   │   │   ├── passwordService.ts
│   │   │   └── orderCalculator.ts
│   │   ├── validators/              # Domain validators (pure functions)
│   │   │   ├── emailValidator.ts
│   │   │   └── passwordValidator.ts
│   │   ├── factories/               # Object factories
│   │   │   └── userFactory.ts
│   │   └── errors/                  # Domain errors
│   │       └── InvalidEmailError.ts
│   │
│   ├── application/                 # Application Layer
│   │   ├── use-cases/               # Use case implementations
│   │   │   ├── GetUserProfile.ts
│   │   │   ├── UpdateUserEmail.ts
│   │   │   └── RegisterUser.ts
│   │   ├── ports/                   # Infrastructure interfaces
│   │   │   ├── UserRepository.ts
│   │   │   ├── Logger.ts
│   │   │   └── EmailService.ts
│   │   └── errors/                  # Application errors
│   │       ├── UserNotFoundError.ts
│   │       └── DatabaseError.ts
│   │
│   ├── infrastructure/              # Infrastructure Layer
│   │   ├── repositories/            # Repository implementations
│   │   │   └── UserRepositoryImpl.ts
│   │   ├── logging/                 # Logger implementations
│   │   │   └── LoggerImpl.ts
│   │   ├── email/                   # Email service implementations
│   │   │   └── EmailServiceImpl.ts
│   │   └── layers/                  # Effect Layer composition
│   │       └── AppLayer.ts
│   │
│   └── presentation/                # Presentation Layer
│       ├── components/              # React components
│       │   ├── UserProfile.tsx
│       │   └── ui/                  # shadcn/ui components
│       │       └── Typography.tsx
│       └── api/                     # Hono API routes
│           └── users.ts
│
├── docs/                            # Documentation
│   └── architecture/
│       ├── functional-programming.md
│       └── layer-based-architecture.md (this file)
│
└── tests/                           # E2E tests (Playwright)
    └── user-registration.spec.ts
```

## Best Practices

### 1. Respect Dependency Direction

```typescript
// ✅ CORRECT: Outer layers depend on inner layers
import { User } from '@/domain/models/User' // Presentation → Domain
import { GetUserProfile } from '@/application/use-cases/GetUserProfile' // Presentation → Application
import { UserRepository } from '@/application/ports/UserRepository' // Application → Application Port

// ❌ INCORRECT: Inner layers depending on outer layers
import { UserProfile } from '@/presentation/components/UserProfile' // Domain → Presentation (NEVER!)
```

### 2. Keep Domain Layer Pure

```typescript
// ✅ CORRECT: Pure domain function
export function calculateTotal(items: readonly OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// ❌ INCORRECT: Domain function with side effects
export function calculateTotalAndLog(items: OrderItem[]): number {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  console.log(`Total: ${total}`) // Side effect!
  return total
}
```

### 3. Use Interfaces for Infrastructure

```typescript
// ✅ CORRECT: Application Layer defines interface
export class EmailService extends Context.Tag('EmailService')<
  EmailService,
  {
    readonly send: (email: Email) => Effect.Effect<void, EmailError>
  }
>() {}

// Infrastructure Layer implements interface
export const EmailServiceLive = Layer.succeed(EmailService, {
  send: (email) => Effect.promise(() => sendgrid.send(email)),
})

// ❌ INCORRECT: Application Layer depends on concrete implementation
import { sendEmail } from '@/infrastructure/email/sendgrid' // Direct dependency on infrastructure!
```

### 4. Single Responsibility per Layer

```typescript
// ✅ CORRECT: Presentation handles UI, Application handles workflow
function UserProfile({ userId }) {
  const program = GetUserProfile({ userId })
  // UI rendering logic only
}

export const GetUserProfile = (input) =>
  Effect.gen(function* () {
    // Workflow orchestration only
    const user = yield* userRepo.findById(input.userId)
    return user
  })

// ❌ INCORRECT: Mixing UI and workflow logic
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Workflow logic in component (should be in Application Layer)
    database.query(`SELECT * FROM users WHERE id = ${userId}`).then(setUser)
  }, [userId])

  return <div>{user?.name}</div>
}
```

## Common Pitfalls

### ❌ Pitfall 1: Business Logic in Presentation Layer

```typescript
// ❌ INCORRECT: Business logic in component
function OrderSummary({ order }) {
  const discount = order.total * 0.1 // Business rule in UI!
  const finalTotal = order.total - discount

  return <div>Total: {finalTotal}</div>
}

// ✅ CORRECT: Business logic in Domain Layer
function OrderSummary({ order }) {
  const finalTotal = calculateOrderTotal(order) // Domain function

  return <div>Total: {finalTotal}</div>
}
```

### ❌ Pitfall 2: Domain Layer Depending on Infrastructure

```typescript
// ❌ INCORRECT: Domain function with database access
export function getUserName(userId: number): string {
  const user = database.query(`SELECT name FROM users WHERE id = ${userId}`) // Infrastructure dependency!
  return user.name
}

// ✅ CORRECT: Domain function is pure, Application Layer handles infrastructure
export function formatUserName(name: string): string {
  return name.trim().toUpperCase()
}

export const GetUserName = (
  userId: number
): Effect.Effect<string, UserNotFoundError, UserRepository> =>
  Effect.gen(function* () {
    const repo = yield* UserRepository
    const user = yield* repo.findById(userId)
    return formatUserName(user.name) // Domain function
  })
```

### ❌ Pitfall 3: Bypassing Application Layer

```typescript
// ❌ INCORRECT: Presentation Layer directly accessing Infrastructure
function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    // Direct infrastructure access from presentation!
    database.query('SELECT * FROM users').then(setUsers)
  }, [])

  return <div>{users.map(u => <div>{u.name}</div>)}</div>
}

// ✅ CORRECT: Presentation Layer uses Application Layer use case
function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const program = GetAllUsers().pipe(Effect.provide(AppLayer))
    Effect.runPromise(program).then(setUsers)
  }, [])

  return <div>{users.map(u => <div>{u.name}</div>)}</div>
}
```

## Resources and References

### Documentation

- [Bitloops Layered Architecture](https://bitloops.com/docs/bitloops-language/learning/software-architecture/layered-architecture)
- [Functional Programming in Omnera](./functional-programming.md)
- [Effect.ts Documentation](https://effect.website/docs/introduction)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### Related Omnera Documentation

- [Effect Patterns](../infrastructure/framework/effect-patterns.md)
- [React Patterns](../infrastructure/ui/react-patterns.md)
- [Hono Documentation](../infrastructure/framework/hono.md)

## Summary

Layer-Based Architecture in Omnera:

1. **Four Layers**: Presentation, Application, Domain, Infrastructure
2. **Clear Boundaries**: Each layer has specific responsibilities
3. **Dependency Direction**: Outer layers depend on inner layers (never reverse)
4. **Pure Domain**: Domain Layer contains only pure functions (FP principle)
5. **Effect Orchestration**: Application Layer coordinates workflows with Effect.ts
6. **Interface Segregation**: Infrastructure implements interfaces defined in Application Layer
7. **Testability**: Each layer can be tested independently
8. **Maintainability**: Changes isolated to specific layers

By following Layer-Based Architecture with Functional Programming principles, Omnera achieves:

- **Predictable structure** - Developers know where code belongs
- **Maintainable codebase** - Changes isolated to specific layers
- **Testable components** - Easy to test each layer independently
- **Flexible infrastructure** - Swap implementations without affecting business logic
- **Type-safe boundaries** - TypeScript enforces layer contracts
- **Scalable architecture** - Add features without breaking existing code

Embrace layered architecture, and build applications that are clean, maintainable, and joy to work with.
