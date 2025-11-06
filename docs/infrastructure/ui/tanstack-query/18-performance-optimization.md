# TanStack Query (React Query) - Server-State Management

> **Note**: This is part 18 of the split documentation. See navigation links below.

## Performance Optimization

### 1. Request Deduplication

TanStack Query automatically deduplicates identical requests:

```typescript
// Multiple components rendering simultaneously
function Component1() {
  useQuery({ queryKey: ['users'], queryFn: fetchUsers })
}
function Component2() {
  useQuery({ queryKey: ['users'], queryFn: fetchUsers })
}
// Only ONE request sent, result shared between components
```

### 2. Prefetching

Prefetch data before it's needed:

```typescript
function UserList() {
  const queryClient = useQueryClient()
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
  const handleMouseEnter = (userId: number) => {
    // Prefetch user detail on hover
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    })
  }
  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id} onMouseEnter={() => handleMouseEnter(user.id)}>
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  )
}
```

### 3. Structural Sharing

TanStack Query preserves object references when data hasn't changed:

```typescript
// Automatic structural sharing
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  structuralSharing: true, // Default
})
// Prevents unnecessary re-renders when data shape is identical
```

### 4. Select for Derived Data

Use `select` to compute derived data without re-renders:

```typescript
const { data: activeUsers } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  select: (users) => users.filter((user) => user.status === 'active'),
})
// Only re-renders when activeUsers changes, not when users changes
```

---

## Navigation

[← Part 17](./17-common-pitfalls-to-avoid.md) | [Part 19 →](./19-devtools.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-tanstack-query-for-sovrium.md) | [Part 4](./04-installation.md) | [Part 5](./05-basic-setup.md) | [Part 6](./06-core-concepts.md) | [Part 7](./07-usequery-hook.md) | [Part 8](./08-integration-with-effectts.md) | [Part 9](./09-usemutation-hook.md) | [Part 10](./10-usequeries-hook.md) | [Part 11](./11-useinfinitequery-hook.md) | [Part 12](./12-server-side-rendering-ssr-with-hono.md) | [Part 13](./13-integration-with-better-auth.md) | [Part 14](./14-advanced-patterns.md) | [Part 15](./15-testing-with-tanstack-query.md) | [Part 16](./16-best-practices.md) | [Part 17](./17-common-pitfalls-to-avoid.md) | **Part 18** | [Part 19](./19-devtools.md) | [Part 20](./20-summary.md) | [Part 21](./21-references.md)
