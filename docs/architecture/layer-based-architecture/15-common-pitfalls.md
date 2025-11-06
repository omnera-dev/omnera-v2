# Layer-Based Architecture in Sovrium

> **Note**: This is part 15 of the split documentation. See navigation links below.

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

---

## Navigation

[← Part 14](./14-best-practices.md) | [Part 16 →](./16-resources-and-references.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-what-is-layer-based-architecture.md) | [Part 4](./04-why-layer-based-architecture-for-sovrium.md) | [Part 5](./05-sovriums-four-layers.md) | [Part 6](./06-layer-1-presentation-layer-uiapi.md) | [Part 7](./07-layer-2-application-layer-use-casesorchestration.md) | [Part 8](./08-layer-3-domain-layer-business-logic.md) | [Part 9](./09-layer-4-infrastructure-layer-external-services.md) | [Part 10](./10-layer-communication-patterns.md) | [Part 11](./11-integration-with-functional-programming.md) | [Part 12](./12-testing-layer-based-architecture.md) | [Part 13](./13-file-structure.md) | [Part 14](./14-best-practices.md) | **Part 15** | [Part 16](./16-resources-and-references.md) | [Part 17](./17-summary.md)
