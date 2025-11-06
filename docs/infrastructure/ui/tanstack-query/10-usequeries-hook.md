# TanStack Query (React Query) - Server-State Management

> **Note**: This is part 10 of the split documentation. See navigation links below.

## useQueries Hook

Execute multiple queries in parallel:

```typescript
import { useQueries } from '@tanstack/react-query'
function UserDashboard({ userIds }: { userIds: number[] }) {
  const userQueries = useQueries({
    queries: userIds.map((id) => ({
      queryKey: ['user', id],
      queryFn: () => fetchUser(id),
      staleTime: 5 * 60 * 1000,
    })),
  })
  // Check if all queries are done
  const isLoading = userQueries.some((query) => query.isPending)
  const hasError = userQueries.some((query) => query.isError)
  if (isLoading) return <div>Loading users...</div>
  if (hasError) return <div>Error loading some users</div>
  return (
    <div>
      {userQueries.map((query, index) => (
        <UserCard key={userIds[index]} user={query.data} />
      ))}
    </div>
  )
}
```

### Combining Results

```typescript
function useMultipleUsers(userIds: number[]) {
  const results = useQueries({
    queries: userIds.map((id) => ({
      queryKey: ['user', id],
      queryFn: () => fetchUser(id),
    })),
    combine: (results) => {
      return {
        users: results.map((r) => r.data).filter(Boolean),
        isPending: results.some((r) => r.isPending),
        isError: results.some((r) => r.isError),
      }
    },
  })
  return results
}
```

---

## Navigation

[← Part 9](./09-usemutation-hook.md) | [Part 11 →](./11-useinfinitequery-hook.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-tanstack-query-for-sovrium.md) | [Part 4](./04-installation.md) | [Part 5](./05-basic-setup.md) | [Part 6](./06-core-concepts.md) | [Part 7](./07-usequery-hook.md) | [Part 8](./08-integration-with-effectts.md) | [Part 9](./09-usemutation-hook.md) | **Part 10** | [Part 11](./11-useinfinitequery-hook.md) | [Part 12](./12-server-side-rendering-ssr-with-hono.md) | [Part 13](./13-integration-with-better-auth.md) | [Part 14](./14-advanced-patterns.md) | [Part 15](./15-testing-with-tanstack-query.md) | [Part 16](./16-best-practices.md) | [Part 17](./17-common-pitfalls-to-avoid.md) | [Part 18](./18-performance-optimization.md) | [Part 19](./19-devtools.md) | [Part 20](./20-summary.md) | [Part 21](./21-references.md)
