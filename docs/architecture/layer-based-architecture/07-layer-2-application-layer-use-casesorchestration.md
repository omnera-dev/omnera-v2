# Layer-Based Architecture in Sovrium

> **Note**: This is part 7 of the split documentation. See navigation links below.

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

---

## Navigation

[← Part 6](./06-layer-1-presentation-layer-uiapi.md) | [Part 8 →](./08-layer-3-domain-layer-business-logic.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-what-is-layer-based-architecture.md) | [Part 4](./04-why-layer-based-architecture-for-sovrium.md) | [Part 5](./05-sovriums-four-layers.md) | [Part 6](./06-layer-1-presentation-layer-uiapi.md) | **Part 7** | [Part 8](./08-layer-3-domain-layer-business-logic.md) | [Part 9](./09-layer-4-infrastructure-layer-external-services.md) | [Part 10](./10-layer-communication-patterns.md) | [Part 11](./11-integration-with-functional-programming.md) | [Part 12](./12-testing-layer-based-architecture.md) | [Part 13](./13-file-structure.md) | [Part 14](./14-best-practices.md) | [Part 15](./15-common-pitfalls.md) | [Part 16](./16-resources-and-references.md) | [Part 17](./17-summary.md)
