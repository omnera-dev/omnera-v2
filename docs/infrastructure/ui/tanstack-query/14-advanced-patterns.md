# TanStack Query (React Query) - Server-State Management

> **Note**: This is part 14 of the split documentation. See navigation links below.

## Advanced Patterns

### Dependent Queries with Effect.ts

Chain queries where later queries depend on earlier results:

```typescript
function useUserWithPosts(userId: number) {
  // First: Fetch user
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const program = fetchUserEffect(userId)
      return await Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
    },
  })
  // Second: Fetch posts (only when user exists)
  const postsQuery = useQuery({
    queryKey: ['posts', userQuery.data?.id],
    queryFn: async () => {
      const program = fetchUserPostsEffect(userQuery.data!.id)
      return await Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
    },
    enabled: !!userQuery.data, // Wait for user before fetching posts
  })
  return {
    user: userQuery.data,
    posts: postsQuery.data,
    isLoading: userQuery.isPending || postsQuery.isPending,
  }
}
```

### Polling / Refetch Interval

Automatically refetch data at regular intervals:

```typescript
function useRealtimeStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchIntervalInBackground: true, // Continue polling when tab inactive
  })
}
// Conditional polling
function useConditionalPolling(userId: number) {
  const [isLive, setIsLive] = useState(false)
  return useQuery({
    queryKey: ['user-status', userId],
    queryFn: fetchUserStatus,
    refetchInterval: isLive ? 2000 : false, // Poll only when live
  })
}
```

### Manual Query Updates

Update query cache directly:

```typescript
const queryClient = useQueryClient()
// Get cached data
const user = queryClient.getQueryData<User>(['user', userId])
// Set cached data
queryClient.setQueryData<User>(['user', userId], (old) => ({
  ...old,
  name: 'Updated Name',
}))
// Set query data with function
queryClient.setQueryData<User[]>(['users'], (old) => {
  return old?.map((user) => (user.id === userId ? { ...user, name: 'New Name' } : user))
})
```

### Query Cancellation

Cancel queries that are no longer needed:

```typescript
function useSearchResults(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async ({ signal }) => {
      // Pass AbortSignal to fetch
      const response = await fetch(`/api/search?q=${query}`, { signal })
      return response.json()
    },
    enabled: query.length > 0,
  })
}
// When query changes, previous request is automatically cancelled
```

### Placeholder Data

Show placeholder data while fetching:

```typescript
function useUserWithPlaceholder(userId: number) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    placeholderData: {
      id: userId,
      name: 'Loading...',
      email: 'loading@example.com',
    },
  })
}
```

### Initial Data from Cache

Seed new query with data from existing cache:

```typescript
function useUserDetail(userId: number) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: ['user', userId, 'detail'],
    queryFn: () => fetchUserDetail(userId),
    // Seed from users list cache
    initialData: () => {
      const users = queryClient.getQueryData<User[]>(['users'])
      return users?.find((user) => user.id === userId)
    },
  })
}
```

---

## Navigation

[← Part 13](./13-integration-with-better-auth.md) | [Part 15 →](./15-testing-with-tanstack-query.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-tanstack-query-for-sovrium.md) | [Part 4](./04-installation.md) | [Part 5](./05-basic-setup.md) | [Part 6](./06-core-concepts.md) | [Part 7](./07-usequery-hook.md) | [Part 8](./08-integration-with-effectts.md) | [Part 9](./09-usemutation-hook.md) | [Part 10](./10-usequeries-hook.md) | [Part 11](./11-useinfinitequery-hook.md) | [Part 12](./12-server-side-rendering-ssr-with-hono.md) | [Part 13](./13-integration-with-better-auth.md) | **Part 14** | [Part 15](./15-testing-with-tanstack-query.md) | [Part 16](./16-best-practices.md) | [Part 17](./17-common-pitfalls-to-avoid.md) | [Part 18](./18-performance-optimization.md) | [Part 19](./19-devtools.md) | [Part 20](./20-summary.md) | [Part 21](./21-references.md)
