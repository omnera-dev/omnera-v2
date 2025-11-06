# Layer-Based Architecture in Sovrium

> **Note**: This is part 11 of the split documentation. See navigation links below.

## Integration with Functional Programming

Layer-Based Architecture complements Functional Programming principles:
| FP Principle | Layer Application |
| --------------------- | -------------------------------------------------------------- |
| **Pure Functions** | Domain Layer contains only pure functions |
| **Immutability** | All layers use immutable data structures |
| **Composition** | Use cases compose domain functions and infrastructure effects |
| **Explicit Effects** | Infrastructure Layer wraps side effects in Effect programs |
| **Type Safety** | TypeScript enforces layer boundaries via interfaces |
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

---

## Navigation

[← Part 10](./10-layer-communication-patterns.md) | [Part 12 →](./12-testing-layer-based-architecture.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-what-is-layer-based-architecture.md) | [Part 4](./04-why-layer-based-architecture-for-sovrium.md) | [Part 5](./05-sovriums-four-layers.md) | [Part 6](./06-layer-1-presentation-layer-uiapi.md) | [Part 7](./07-layer-2-application-layer-use-casesorchestration.md) | [Part 8](./08-layer-3-domain-layer-business-logic.md) | [Part 9](./09-layer-4-infrastructure-layer-external-services.md) | [Part 10](./10-layer-communication-patterns.md) | **Part 11** | [Part 12](./12-testing-layer-based-architecture.md) | [Part 13](./13-file-structure.md) | [Part 14](./14-best-practices.md) | [Part 15](./15-common-pitfalls.md) | [Part 16](./16-resources-and-references.md) | [Part 17](./17-summary.md)
