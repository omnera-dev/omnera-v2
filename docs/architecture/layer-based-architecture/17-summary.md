# Layer-Based Architecture in Omnera

> **Note**: This is part 17 of the split documentation. See navigation links below.


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
---


## Navigation

[← Part 16](./16-resources-and-references.md)


**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-what-is-layer-based-architecture.md) | [Part 4](./04-why-layer-based-architecture-for-omnera.md) | [Part 5](./05-omneras-four-layers.md) | [Part 6](./06-layer-1-presentation-layer-uiapi.md) | [Part 7](./07-layer-2-application-layer-use-casesorchestration.md) | [Part 8](./08-layer-3-domain-layer-business-logic.md) | [Part 9](./09-layer-4-infrastructure-layer-external-services.md) | [Part 10](./10-layer-communication-patterns.md) | [Part 11](./11-integration-with-functional-programming.md) | [Part 12](./12-testing-layer-based-architecture.md) | [Part 13](./13-file-structure.md) | [Part 14](./14-best-practices.md) | [Part 15](./15-common-pitfalls.md) | [Part 16](./16-resources-and-references.md) | **Part 17**