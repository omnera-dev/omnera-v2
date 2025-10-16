# TanStack Query (React Query) - Server-State Management

> **Note**: This is part 6 of the split documentation. See navigation links below.

## Core Concepts

### Query Keys

Query keys uniquely identify cached data. They're arrays that can include any serializable value:

```typescript
// Simple key
const queryKey = ['users']
// Key with parameters
const queryKey = ['user', userId]
// Key with multiple parameters
const queryKey = ['posts', { authorId, status: 'published', limit: 10 }]
// Nested keys for relationships
const queryKey = ['users', userId, 'posts', { page: 1 }]
```

**Key Conventions**:

- Use hierarchical structure: `['resource', id, 'nested', params]`
- Keep keys consistent across app
- Use objects for multiple parameters (order doesn't matter)

### Query Functions

Query functions fetch data and return a Promise:

```typescript
// Simple fetch function
const queryFn = () => fetch('/api/users').then((res) => res.json())
// With parameters from query key
const queryFn = ({ queryKey }) => {
  const [, userId] = queryKey // ['user', userId]
  return fetch(`/api/users/${userId}`).then((res) => res.json())
}
// With Effect.ts
const queryFn = () => {
  const program = fetchUser(userId)
  return Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
}
```

### Query States

Every query has these states:

```typescript
const { data, error, status, fetchStatus } = useQuery(...)
// status: 'pending' | 'error' | 'success'
// fetchStatus: 'fetching' | 'paused' | 'idle'
// Derived booleans
const { isPending, isError, isSuccess, isFetching, isLoading } = useQuery(...)
// isPending: No data yet (status === 'pending')
// isError: Error occurred (status === 'error')
// isSuccess: Data available (status === 'success')
// isFetching: Request in progress (fetchStatus === 'fetching')
// isLoading: isPending && isFetching (first load)
```

---

## Navigation

[← Part 5](./05-basic-setup.md) | [Part 7 →](./07-usequery-hook.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-tanstack-query-for-omnera.md) | [Part 4](./04-installation.md) | [Part 5](./05-basic-setup.md) | **Part 6** | [Part 7](./07-usequery-hook.md) | [Part 8](./08-integration-with-effectts.md) | [Part 9](./09-usemutation-hook.md) | [Part 10](./10-usequeries-hook.md) | [Part 11](./11-useinfinitequery-hook.md) | [Part 12](./12-server-side-rendering-ssr-with-hono.md) | [Part 13](./13-integration-with-better-auth.md) | [Part 14](./14-advanced-patterns.md) | [Part 15](./15-testing-with-tanstack-query.md) | [Part 16](./16-best-practices.md) | [Part 17](./17-common-pitfalls-to-avoid.md) | [Part 18](./18-performance-optimization.md) | [Part 19](./19-devtools.md) | [Part 20](./20-summary.md) | [Part 21](./21-references.md)
