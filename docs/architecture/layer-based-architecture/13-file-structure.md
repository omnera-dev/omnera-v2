# Layer-Based Architecture in Omnera

> **Note**: This is part 13 of the split documentation. See navigation links below.


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
---


## Navigation

[← Part 12](./12-testing-layer-based-architecture.md) | [Part 14 →](./14-best-practices.md)


**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-what-is-layer-based-architecture.md) | [Part 4](./04-why-layer-based-architecture-for-omnera.md) | [Part 5](./05-omneras-four-layers.md) | [Part 6](./06-layer-1-presentation-layer-uiapi.md) | [Part 7](./07-layer-2-application-layer-use-casesorchestration.md) | [Part 8](./08-layer-3-domain-layer-business-logic.md) | [Part 9](./09-layer-4-infrastructure-layer-external-services.md) | [Part 10](./10-layer-communication-patterns.md) | [Part 11](./11-integration-with-functional-programming.md) | [Part 12](./12-testing-layer-based-architecture.md) | **Part 13** | [Part 14](./14-best-practices.md) | [Part 15](./15-common-pitfalls.md) | [Part 16](./16-resources-and-references.md) | [Part 17](./17-summary.md)