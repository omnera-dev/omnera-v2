# TanStack Query (React Query) - Server-State Management

> **Note**: This is part 17 of the split documentation. See navigation links below.


## Common Pitfalls to Avoid

### ❌ Don't Create QueryClient at Module Level (SSR)
```typescript
// ❌ WRONG: Shared across all requests
const queryClient = new QueryClient()
function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
}
// ✅ CORRECT: New instance per request
function App() {
  const [queryClient] = useState(() => new QueryClient())
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
}
```

### ❌ Don't Forget to Invalidate After Mutations
```typescript
// ❌ WRONG: No invalidation, stale data
useMutation({
  mutationFn: createUser,
})
// ✅ CORRECT: Invalidate to refetch
useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})
```

### ❌ Don't Use Queries Inside Event Handlers
```typescript
// ❌ WRONG: Query called on click
function UserButton() {
  const handleClick = () => {
    const { data } = useQuery({ queryKey: ['user'], queryFn: fetchUser })
    console.log(data)
  }
  return <button onClick={handleClick}>Fetch User</button>
}
// ✅ CORRECT: Use mutation for imperative fetches
function UserButton() {
  const queryClient = useQueryClient()
  const handleClick = async () => {
    const data = await queryClient.fetchQuery({
      queryKey: ['user'],
      queryFn: fetchUser,
    })
    console.log(data)
  }
  return <button onClick={handleClick}>Fetch User</button>
}
```

### ❌ Don't Ignore Query Enabled Option
```typescript
// ❌ WRONG: Fetches even when userId is null
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId!),
})
// ✅ CORRECT: Only fetch when userId exists
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId!),
  enabled: userId !== null,
})
```

### ❌ Don't Overuse Optimistic Updates
```typescript
// ❌ WRONG: Optimistic update for critical operations
useMutation({
  mutationFn: processPayment,
  onMutate: async (payment) => {
    queryClient.setQueryData(['balance'], (old) => old - payment.amount)
  },
})
// ✅ CORRECT: Wait for server confirmation for critical operations
useMutation({
  mutationFn: processPayment,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['balance'] })
  },
})
```
---


## Navigation

[← Part 16](./16-best-practices.md) | [Part 18 →](./18-performance-optimization.md)


**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-tanstack-query-for-omnera.md) | [Part 4](./04-installation.md) | [Part 5](./05-basic-setup.md) | [Part 6](./06-core-concepts.md) | [Part 7](./07-usequery-hook.md) | [Part 8](./08-integration-with-effectts.md) | [Part 9](./09-usemutation-hook.md) | [Part 10](./10-usequeries-hook.md) | [Part 11](./11-useinfinitequery-hook.md) | [Part 12](./12-server-side-rendering-ssr-with-hono.md) | [Part 13](./13-integration-with-better-auth.md) | [Part 14](./14-advanced-patterns.md) | [Part 15](./15-testing-with-tanstack-query.md) | [Part 16](./16-best-practices.md) | **Part 17** | [Part 18](./18-performance-optimization.md) | [Part 19](./19-devtools.md) | [Part 20](./20-summary.md) | [Part 21](./21-references.md)