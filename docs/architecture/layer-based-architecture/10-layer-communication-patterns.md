# Layer-Based Architecture in Omnera

> **Note**: This is part 10 of the split documentation. See navigation links below.


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
---


## Navigation

[← Part 9](./09-layer-4-infrastructure-layer-external-services.md) | [Part 11 →](./11-integration-with-functional-programming.md)


**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-what-is-layer-based-architecture.md) | [Part 4](./04-why-layer-based-architecture-for-omnera.md) | [Part 5](./05-omneras-four-layers.md) | [Part 6](./06-layer-1-presentation-layer-uiapi.md) | [Part 7](./07-layer-2-application-layer-use-casesorchestration.md) | [Part 8](./08-layer-3-domain-layer-business-logic.md) | [Part 9](./09-layer-4-infrastructure-layer-external-services.md) | **Part 10** | [Part 11](./11-integration-with-functional-programming.md) | [Part 12](./12-testing-layer-based-architecture.md) | [Part 13](./13-file-structure.md) | [Part 14](./14-best-practices.md) | [Part 15](./15-common-pitfalls.md) | [Part 16](./16-resources-and-references.md) | [Part 17](./17-summary.md)