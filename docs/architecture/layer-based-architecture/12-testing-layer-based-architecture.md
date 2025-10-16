# Layer-Based Architecture in Omnera

> **Note**: This is part 12 of the split documentation. See navigation links below.


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
---


## Navigation

[← Part 11](./11-integration-with-functional-programming.md) | [Part 13 →](./13-file-structure.md)


**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-what-is-layer-based-architecture.md) | [Part 4](./04-why-layer-based-architecture-for-omnera.md) | [Part 5](./05-omneras-four-layers.md) | [Part 6](./06-layer-1-presentation-layer-uiapi.md) | [Part 7](./07-layer-2-application-layer-use-casesorchestration.md) | [Part 8](./08-layer-3-domain-layer-business-logic.md) | [Part 9](./09-layer-4-infrastructure-layer-external-services.md) | [Part 10](./10-layer-communication-patterns.md) | [Part 11](./11-integration-with-functional-programming.md) | **Part 12** | [Part 13](./13-file-structure.md) | [Part 14](./14-best-practices.md) | [Part 15](./15-common-pitfalls.md) | [Part 16](./16-resources-and-references.md) | [Part 17](./17-summary.md)