# TanStack Query (React Query) - Server-State Management

> **Note**: This is part 16 of the split documentation. See navigation links below.

## Best Practices

### 1. Query Key Organization

Establish consistent query key conventions:

```typescript
// ✅ Hierarchical structure
const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: UserFilters) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },
  posts: {
    all: ['posts'] as const,
    detail: (id: number) => [...queryKeys.posts.all, id] as const,
    comments: (postId: number) => [...queryKeys.posts.detail(postId), 'comments'] as const,
  },
}
// Usage
useQuery({ queryKey: queryKeys.users.detail(1), queryFn: ... })
useQuery({ queryKey: queryKeys.users.list({ status: 'active' }), queryFn: ... })
// Invalidate all user queries
queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
```

### 2. Stale Time Configuration

Configure stale time based on data characteristics:

```typescript
// Fast-changing data (stock prices, live scores)
staleTime: 0 // Always stale, refetch immediately
// Moderate-changing data (user profile, posts)
staleTime: 60 * 1000 // 1 minute
// Slow-changing data (settings, static content)
staleTime: 5 * 60 * 1000 // 5 minutes
// Rarely-changing data (categories, countries)
staleTime: Infinity // Never stale, manual invalidation only
```

### 3. Error Handling

Consistent error handling patterns:

```typescript
// Global error handler
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error(`Query error for ${query.queryKey}:`, error)
      // Show toast notification
      toast.error('Failed to load data. Please try again.')
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error('Mutation error:', error)
      toast.error('Failed to save changes.')
    },
  }),
})
// Per-query error handling
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  onError: (error) => {
    if (error instanceof UserNotFoundError) {
      navigate('/404')
    }
  },
})
```

### 4. Loading States

Handle loading states gracefully:

```typescript
function DataView() {
  const { data, isPending, isFetching, isError, error } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  })
  // Initial load
  if (isPending) return <Skeleton />
  // Error state
  if (isError) return <ErrorMessage error={error} />
  return (
    <div>
      {/* Background refetch indicator */}
      {isFetching && <RefetchingIndicator />}
      {/* Data display */}
      <DataDisplay data={data} />
    </div>
  )
}
```

### 5. Invalidation Strategies

Choose appropriate invalidation strategy:

```typescript
// Option 1: Invalidate (marks stale, refetches if active)
queryClient.invalidateQueries({ queryKey: ['users'] })
// Option 2: Reset (clears cache + refetches)
queryClient.resetQueries({ queryKey: ['users'] })
// Option 3: Remove (clears cache, no refetch)
queryClient.removeQueries({ queryKey: ['users'] })
// Option 4: Set query data (optimistic update)
queryClient.setQueryData(['users'], newUsers)
```

### 6. Avoid Over-Fetching

Don't fetch more data than needed:

```typescript
// ❌ DON'T: Fetch all users just to display count
const { data: users } = useQuery({ queryKey: ['users'], queryFn: fetchAllUsers })
const userCount = users?.length
// ✅ DO: Fetch only count
const { data: count } = useQuery({ queryKey: ['users', 'count'], queryFn: fetchUserCount })
```

### 7. Normalize Related Data

Separate related data into distinct queries:

```typescript
// ❌ DON'T: Nested data structure
const { data } = useQuery({
  queryKey: ['user-with-posts', userId],
  queryFn: () => fetchUserWithPosts(userId),
})
// Returns: { user: User, posts: Post[] }
// ✅ DO: Separate queries
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
})
const { data: posts } = useQuery({
  queryKey: ['posts', { userId }],
  queryFn: () => fetchUserPosts(userId),
})
```

### 8. Use TypeScript Strictly

Leverage TypeScript for type-safe queries:

```typescript
// ✅ Generic types for data and error
const { data, error } = useQuery<User, UserError>({
  queryKey: ['user', userId],
  queryFn: fetchUser,
})
// data: User | undefined
// error: UserError | null
// ✅ Type-safe query key factory
const createUserKey = (id: number) => ['user', id] as const
// ✅ Type-safe mutation
const mutation = useMutation<User, Error, CreateUserInput>({
  mutationFn: createUser,
})
```

---

## Navigation

[← Part 15](./15-testing-with-tanstack-query.md) | [Part 17 →](./17-common-pitfalls-to-avoid.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-tanstack-query-for-omnera.md) | [Part 4](./04-installation.md) | [Part 5](./05-basic-setup.md) | [Part 6](./06-core-concepts.md) | [Part 7](./07-usequery-hook.md) | [Part 8](./08-integration-with-effectts.md) | [Part 9](./09-usemutation-hook.md) | [Part 10](./10-usequeries-hook.md) | [Part 11](./11-useinfinitequery-hook.md) | [Part 12](./12-server-side-rendering-ssr-with-hono.md) | [Part 13](./13-integration-with-better-auth.md) | [Part 14](./14-advanced-patterns.md) | [Part 15](./15-testing-with-tanstack-query.md) | **Part 16** | [Part 17](./17-common-pitfalls-to-avoid.md) | [Part 18](./18-performance-optimization.md) | [Part 19](./19-devtools.md) | [Part 20](./20-summary.md) | [Part 21](./21-references.md)
