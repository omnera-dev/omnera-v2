# TanStack Query (React Query) - Server-State Management

> **Note**: This is part 15 of the split documentation. See navigation links below.

## Testing with TanStack Query

### Testing Queries

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { test, expect } from 'bun:test'
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false }, // Disable retries in tests
      mutations: { retry: false },
    },
  })
}
function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
test('useUser fetches user data', async () => {
  const { result } = renderHook(() => useUser(1), { wrapper })
  // Initially pending
  expect(result.current.isPending).toBe(true)
  // Wait for query to complete
  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  // Check data
  expect(result.current.data).toEqual({ id: 1, name: 'Test User' })
})
```

### Testing Mutations

```typescript
test('useCreateUser creates user and invalidates cache', async () => {
  const queryClient = createTestQueryClient()
  // Seed cache with initial data
  queryClient.setQueryData(['users'], [{ id: 1, name: 'User 1' }])
  const { result } = renderHook(() => useCreateUser(), {
    wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
  })
  // Execute mutation
  result.current.mutate({ name: 'New User', email: 'new@example.com' })
  // Wait for mutation to complete
  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  // Verify cache was invalidated
  expect(queryClient.getQueryState(['users'])?.isInvalidated).toBe(true)
})
```

### Mocking Query Data

```typescript
test('Profile component displays user data', async () => {
  const queryClient = createTestQueryClient()
  // Mock query data
  queryClient.setQueryData(['user', 1], {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
  })
  const { getByText } = render(
    <QueryClientProvider client={queryClient}>
      <Profile userId={1} />
    </QueryClientProvider>
  )
  expect(getByText('Test User')).toBeInTheDocument()
  expect(getByText('test@example.com')).toBeInTheDocument()
})
```

---

## Navigation

[← Part 14](./14-advanced-patterns.md) | [Part 16 →](./16-best-practices.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-tanstack-query-for-sovrium.md) | [Part 4](./04-installation.md) | [Part 5](./05-basic-setup.md) | [Part 6](./06-core-concepts.md) | [Part 7](./07-usequery-hook.md) | [Part 8](./08-integration-with-effectts.md) | [Part 9](./09-usemutation-hook.md) | [Part 10](./10-usequeries-hook.md) | [Part 11](./11-useinfinitequery-hook.md) | [Part 12](./12-server-side-rendering-ssr-with-hono.md) | [Part 13](./13-integration-with-better-auth.md) | [Part 14](./14-advanced-patterns.md) | **Part 15** | [Part 16](./16-best-practices.md) | [Part 17](./17-common-pitfalls-to-avoid.md) | [Part 18](./18-performance-optimization.md) | [Part 19](./19-devtools.md) | [Part 20](./20-summary.md) | [Part 21](./21-references.md)
