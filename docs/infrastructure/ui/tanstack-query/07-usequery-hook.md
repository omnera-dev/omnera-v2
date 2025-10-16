# TanStack Query (React Query) - Server-State Management

> **Note**: This is part 7 of the split documentation. See navigation links below.

## useQuery Hook

### Basic Usage

```typescript
import { useQuery } from '@tanstack/react-query'
interface User {
  id: number
  name: string
  email: string
}
function UserProfile({ userId }: { userId: number }) {
  const { data, error, isPending, isError } = useQuery<User, Error>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch user')
      return response.json()
    },
  })
  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  )
}
```

### Query Options

```typescript
useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser,
  // Caching behavior
  staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
  gcTime: 10 * 60 * 1000, // 10 minutes - unused cache garbage collected
  // Refetching behavior
  refetchOnMount: true, // Refetch when component mounts if stale
  refetchOnWindowFocus: true, // Refetch when window regains focus
  refetchOnReconnect: true, // Refetch when network reconnects
  refetchInterval: false, // Polling interval (or false to disable)
  refetchIntervalInBackground: false, // Poll even when window hidden
  // Error handling
  retry: 3, // Retry failed requests 3 times
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  // Conditional fetching
  enabled: userId !== 0, // Only fetch when userId is valid
  // Initial data
  initialData: cachedUser,
  placeholderData: loadingUser,
  // Callbacks
  onSuccess: (data) => console.log('Query succeeded:', data),
  onError: (error) => console.error('Query failed:', error),
  onSettled: (data, error) => console.log('Query completed'),
  // Advanced
  select: (data) => data.posts, // Transform data before returning
  structuralSharing: true, // Preserve object references when possible
  meta: { customField: 'value' }, // Attach metadata
})
```

### Conditional Queries

Only run queries when certain conditions are met:

```typescript
function UserPosts({ userId }: { userId: number | null }) {
  const { data: posts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId!),
    enabled: userId !== null, // Only fetch when userId exists
  })
  if (!userId) return <div>Select a user</div>
  return <PostList posts={posts ?? []} />
}
```

### Dependent Queries

Fetch data that depends on previous query results:

```typescript
function UserWithPosts({ userId }: { userId: number }) {
  // First query: fetch user
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  })
  // Second query: fetch posts (only when user exists)
  const { data: posts } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => fetchUserPosts(user!.id),
    enabled: !!user, // Wait for user before fetching posts
  })
  return (
    <div>
      <UserCard user={user} />
      <PostList posts={posts} />
    </div>
  )
}
```

### Transforming Query Data

Use `select` to transform data before it reaches your component:

```typescript
const { data: postTitles } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  select: (data) => data.map((post) => post.title), // Transform: Post[] → string[]
})
// With type safety
const { data: activeUsers } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  select: (users: User[]): User[] => users.filter((user) => user.status === 'active'),
})
```

---

## Navigation

[← Part 6](./06-core-concepts.md) | [Part 8 →](./08-integration-with-effectts.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-tanstack-query-for-omnera.md) | [Part 4](./04-installation.md) | [Part 5](./05-basic-setup.md) | [Part 6](./06-core-concepts.md) | **Part 7** | [Part 8](./08-integration-with-effectts.md) | [Part 9](./09-usemutation-hook.md) | [Part 10](./10-usequeries-hook.md) | [Part 11](./11-useinfinitequery-hook.md) | [Part 12](./12-server-side-rendering-ssr-with-hono.md) | [Part 13](./13-integration-with-better-auth.md) | [Part 14](./14-advanced-patterns.md) | [Part 15](./15-testing-with-tanstack-query.md) | [Part 16](./16-best-practices.md) | [Part 17](./17-common-pitfalls-to-avoid.md) | [Part 18](./18-performance-optimization.md) | [Part 19](./19-devtools.md) | [Part 20](./20-summary.md) | [Part 21](./21-references.md)
