# TanStack Query (React Query) - Server-State Management

## Overview

**Version**: 5.90.3
**Purpose**: Powerful data fetching and server-state management library for React applications. Handles caching, background updates, request deduplication, and synchronization with minimal boilerplate.

TanStack Query solves the fundamental challenge of managing **server state** in React applications. Unlike client state (UI state, form inputs), server state is remote, asynchronous, shared ownership, and can become stale without notice.

## Why TanStack Query for Omnera?

### The Server State Problem

Traditional data fetching in React requires manual management of:

- **Loading states**: `isLoading`, `isPending`
- **Error states**: Try-catch blocks, error boundaries
- **Caching**: Prevent duplicate requests
- **Background updates**: Keep data fresh
- **Request deduplication**: Multiple components fetching same data
- **Garbage collection**: Clean up unused cache
- **Pagination**: Managing paginated data
- **Optimistic updates**: Update UI before server response

**TanStack Query handles all of this automatically.**

### Perfect Integration with Omnera Stack

| Component           | Integration                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| **React 19**        | Built for React, works with Server Components, Actions, and use() hook        |
| **Effect.ts**       | Convert Effect programs to query/mutation functions seamlessly                |
| **Hono SSR**        | Prefetch queries on server, hydrate on client for fast initial page loads     |
| **TypeScript**      | Full type safety with inferred types, discriminated unions for loading states |
| **Better Auth**     | Perfect for managing authentication state and user sessions                   |
| **Functional Code** | Immutable updates, declarative data fetching, composable queries              |

### Benefits

1. **Zero Boilerplate**: No manual loading/error state management
2. **Automatic Caching**: Smart caching with configurable stale/cache times
3. **Background Updates**: Refetch data on window focus, network reconnect
4. **Request Deduplication**: Single request for multiple components
5. **Optimistic Updates**: Instant UI feedback with automatic rollback
6. **DevTools**: Powerful debugging tools for queries and cache
7. **SSR Ready**: First-class server-side rendering support
8. **TypeScript Native**: Full type inference and safety

## Installation

TanStack Query is already installed in Omnera:

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.90.3"
  }
}
```

No additional installation needed.

## Basic Setup

### 1. Create QueryClient

The `QueryClient` manages query cache and configuration:

```typescript
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
        retry: 3,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
      },
    },
  })
}
```

### 2. Provide QueryClient to React Tree

Wrap your application with `QueryClientProvider`:

```typescript
// src/app.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function App() {
  // Create QueryClient instance per app instance (not at module level)
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

**IMPORTANT**: Create `QueryClient` inside the component (not at module level) to ensure each user/request has isolated cache in SSR environments.

### 3. Optional: DevTools Setup

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Add to your App component
<ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
```

**DevTools Features**:

- View all queries and their state
- Inspect query cache data
- Manually trigger refetch
- View query timelines
- Debug stale/fresh data

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

## Integration with Effect.ts

Convert Effect programs to TanStack Query-compatible functions:

### Pattern 1: Effect Programs as Query Functions

```typescript
import { Effect } from 'effect'
import { useQuery } from '@tanstack/react-query'

// Effect program
interface UserService {
  readonly findById: (id: number) => Effect.Effect<User, UserNotFoundError>
}

const UserService = Context.Tag<UserService>('UserService')

// Convert to query function
function useUser(userId: number) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const program = Effect.gen(function* () {
        const userService = yield* UserService
        return yield* userService.findById(userId)
      })

      // Run Effect program and return result
      return await Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
    },
  })
}
```

### Pattern 2: Effect Error Handling

Map Effect errors to JavaScript errors for TanStack Query:

```typescript
import { Effect, Exit } from 'effect'

function useUserWithErrorHandling(userId: number) {
  return useQuery<User, Error>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const program = fetchUserEffect(userId)

      const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(AppLayer)))

      // Convert Effect Exit to Promise (resolve or reject)
      if (Exit.isSuccess(exit)) {
        return exit.value
      } else {
        const cause = Exit.causeOption(exit)
        if (cause._tag === 'Some') {
          const error = Cause.squash(cause.value)
          throw new Error(error.message)
        }
        throw new Error('Unknown error')
      }
    },
  })
}
```

### Pattern 3: Reusable Effect Query Hook

Create a generic hook for running Effect programs:

```typescript
import { Effect, Exit, Cause } from 'effect'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

function useEffectQuery<A, E>(
  queryKey: unknown[],
  program: Effect.Effect<A, E, never>,
  options?: Omit<UseQueryOptions<A, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<A, Error>({
    queryKey,
    queryFn: async () => {
      const exit = await Effect.runPromiseExit(program)

      if (Exit.isSuccess(exit)) {
        return exit.value
      }

      const cause = Exit.causeOption(exit)
      if (cause._tag === 'Some') {
        const error = Cause.squash(cause.value)
        throw error instanceof Error ? error : new Error(String(error))
      }

      throw new Error('Unknown error occurred')
    },
    ...options,
  })
}

// Usage
function UserProfile({ userId }: { userId: number }) {
  const program = Effect.gen(function* () {
    const userService = yield* UserService
    return yield* userService.findById(userId)
  }).pipe(Effect.provide(AppLayer))

  const { data: user, isPending, isError } = useEffectQuery(['user', userId], program)

  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Error loading user</div>

  return <UserCard user={user} />
}
```

### Pattern 4: Effect Layers with TanStack Query

Inject dependencies into Effect programs:

```typescript
import { Effect, Context, Layer } from 'effect'

// Services
class Database extends Context.Tag('Database')<Database, DatabaseService>() {}
class Logger extends Context.Tag('Logger')<Logger, LoggerService>() {}

// Effect program with dependencies
const fetchUserProgram = (userId: number) =>
  Effect.gen(function* () {
    const db = yield* Database
    const logger = yield* Logger

    yield* logger.info(`Fetching user ${userId}`)
    const user = yield* db.query(`SELECT * FROM users WHERE id = ?`, [userId])
    yield* logger.info(`Found user ${user.name}`)

    return user
  })

// Provide layers for query
function useUser(userId: number) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const program = fetchUserProgram(userId).pipe(
        Effect.provide(DatabaseLive),
        Effect.provide(LoggerLive)
      )

      return await Effect.runPromise(program)
    },
  })
}
```

## useMutation Hook

Mutations modify data on the server (POST, PUT, DELETE):

### Basic Mutation

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface CreateUserInput {
  name: string
  email: string
}

function CreateUserForm() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (newUser: CreateUserInput) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })

      if (!response.ok) throw new Error('Failed to create user')
      return response.json()
    },

    // Invalidate queries after successful mutation
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    mutation.mutate({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create User'}
      </button>

      {mutation.isError && <p className="text-red-600">{mutation.error.message}</p>}
      {mutation.isSuccess && <p className="text-green-600">User created!</p>}
    </form>
  )
}
```

### Mutation States

```typescript
const mutation = useMutation({ mutationFn })

// States
mutation.status // 'idle' | 'pending' | 'error' | 'success'
mutation.isPending // Currently executing
mutation.isError // Error occurred
mutation.isSuccess // Succeeded
mutation.isIdle // Not yet called

// Data
mutation.data // Result from mutationFn (if successful)
mutation.error // Error from mutationFn (if failed)
mutation.variables // Arguments passed to mutate()

// Actions
mutation.mutate(variables) // Execute mutation
mutation.mutateAsync(variables) // Execute and return promise
mutation.reset() // Reset to idle state
```

### Mutation with Effect.ts

```typescript
function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      const program = Effect.gen(function* () {
        const userService = yield* UserService
        const newUser = yield* userService.create(input)
        return newUser
      })

      return await Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

### Optimistic Updates

Update UI immediately, rollback on error:

#### Pattern 1: Via UI (Simple)

Show temporary state using `mutation.variables`:

```typescript
function TodoList() {
  const { data: todos } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })

  const addTodo = useMutation({
    mutationFn: (text: string) => fetch('/api/todos', { method: 'POST', body: JSON.stringify({ text }) }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  return (
    <ul>
      {todos?.map((todo) => <li key={todo.id}>{todo.text}</li>)}

      {/* Show temporary item while mutation pending */}
      {addTodo.isPending && (
        <li style={{ opacity: 0.5 }}>
          {addTodo.variables}
        </li>
      )}
    </ul>
  )
}
```

#### Pattern 2: Via Cache (Advanced)

Directly manipulate cache for instant feedback:

```typescript
function useOptimisticTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newTodo: Todo) => createTodo(newTodo),

    onMutate: async (newTodo) => {
      // Cancel outgoing refetches (don't overwrite optimistic update)
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      // Snapshot previous state for rollback
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      // Optimistically update cache
      queryClient.setQueryData<Todo[]>(['todos'], (old) => [...(old ?? []), newTodo])

      // Return context for error handling
      return { previousTodos }
    },

    onError: (err, newTodo, context) => {
      // Rollback to previous state on error
      queryClient.setQueryData(['todos'], context?.previousTodos)
    },

    onSettled: () => {
      // Refetch to sync with server (replace optimistic data)
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}
```

### Query Invalidation Strategies

Invalidate queries to trigger refetch:

```typescript
const queryClient = useQueryClient()

// Invalidate all queries
queryClient.invalidateQueries()

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['users'] })

// Invalidate by prefix (all user-related queries)
queryClient.invalidateQueries({ queryKey: ['users'] })
// Invalidates: ['users'], ['users', 1], ['users', 1, 'posts']

// Invalidate with predicate
queryClient.invalidateQueries({
  predicate: (query) => query.queryKey[0] === 'users' && query.queryKey[1] > 5,
})

// Invalidate and refetch immediately
queryClient.invalidateQueries({ queryKey: ['users'], refetchType: 'active' })

// Reset query (clears cache and refetches)
queryClient.resetQueries({ queryKey: ['users'] })
```

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

## useInfiniteQuery Hook

Handle paginated or infinite scroll data:

```typescript
import { useInfiniteQuery } from '@tanstack/react-query'

interface PostsPage {
  posts: Post[]
  nextCursor: number | null
}

function InfinitePostList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`/api/posts?cursor=${pageParam}`)
      return response.json() as Promise<PostsPage>
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  })

  return (
    <div>
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ))}

      <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'No more posts'}
      </button>
    </div>
  )
}
```

### Infinite Query with Previous Pages

```typescript
const { data, fetchPreviousPage, hasPreviousPage } = useInfiniteQuery({
  queryKey: ['messages'],
  queryFn: ({ pageParam }) => fetchMessages(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  initialPageParam: 0,
})

// Fetch older messages
<button onClick={() => fetchPreviousPage()} disabled={!hasPreviousPage}>
  Load Earlier Messages
</button>
```

## Server-Side Rendering (SSR) with Hono

TanStack Query provides first-class SSR support for fast initial page loads.

### SSR Setup Pattern

```typescript
// src/server.tsx
import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'
import { QueryClient, QueryClientProvider, dehydrate, HydrationBoundary } from '@tanstack/react-query'

const app = new Hono()

app.get('/', async (c) => {
  // 1. Create QueryClient for this request
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Avoid immediate refetch on client
      },
    },
  })

  // 2. Prefetch queries on the server
  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  // 3. Prefetch multiple queries in parallel
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: ['posts'], queryFn: fetchPosts }),
    queryClient.prefetchQuery({ queryKey: ['stats'], queryFn: fetchStats }),
  ])

  // 4. Dehydrate state to serialize cache
  const dehydratedState = dehydrate(queryClient)

  // 5. Render React with hydration boundary
  const html = renderToString(
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <App />
      </HydrationBoundary>
    </QueryClientProvider>
  )

  // 6. Send HTML with embedded state
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Omnera App</title>
        <script>
          window.__TANSTACK_QUERY_STATE__ = ${JSON.stringify(dehydratedState)}
        </script>
      </head>
      <body>
        <div id="root">${html}</div>
        <script src="/client.js"></script>
      </body>
    </html>
  `)
})

export default app
```

### Client-Side Hydration

```typescript
// src/client.tsx
import { hydrateRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 1. Create client QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
})

// 2. Hydrate with server state (automatically restores cache)
hydrateRoot(
  document.getElementById('root')!,
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
```

### SSR Best Practices

**1. Create QueryClient per request**:

```typescript
// ❌ DON'T: Shared QueryClient (data leakage between users)
const queryClient = new QueryClient()

app.get('/', (c) => {
  // Uses same QueryClient for all users!
})

// ✅ DO: QueryClient per request
app.get('/', (c) => {
  const queryClient = new QueryClient()
  // Isolated cache per request
})
```

**2. Set appropriate staleTime**:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // Prevent immediate refetch on client hydration
    },
  },
})
```

**3. Use prefetchQuery for critical content**:

```typescript
// ✅ Critical content (blocks render)
await queryClient.prefetchQuery({ queryKey: ['user'], queryFn: fetchUser })

// ✅ Non-critical content (fetches on client)
// Don't prefetch - component will fetch when needed
```

**4. Parallel prefetching**:

```typescript
// ✅ Fetch multiple queries in parallel
await Promise.all([
  queryClient.prefetchQuery({ queryKey: ['users'], queryFn: fetchUsers }),
  queryClient.prefetchQuery({ queryKey: ['posts'], queryFn: fetchPosts }),
  queryClient.prefetchQuery({ queryKey: ['stats'], queryFn: fetchStats }),
])
```

### SSR with Effect.ts

Prefetch Effect programs on the server:

```typescript
import { Effect } from 'effect'
import { QueryClient } from '@tanstack/react-query'

app.get('/users/:id', async (c) => {
  const userId = Number(c.req.param('id'))
  const queryClient = new QueryClient()

  // Prefetch Effect program
  await queryClient.prefetchQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const program = Effect.gen(function* () {
        const userService = yield* UserService
        return yield* userService.findById(userId)
      })

      return await Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
    },
  })

  const dehydratedState = dehydrate(queryClient)

  // Render with prefetched data
  const html = renderToString(
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <UserProfile userId={userId} />
      </HydrationBoundary>
    </QueryClientProvider>
  )

  return c.html(renderHtmlTemplate(html, dehydratedState))
})
```

### Streaming SSR (React 19)

TanStack Query works with React 19's streaming SSR:

```typescript
import { renderToReadableStream } from 'react-dom/server'

app.get('/', async (c) => {
  const queryClient = new QueryClient()

  // Prefetch critical data
  await queryClient.prefetchQuery({ queryKey: ['critical'], queryFn: fetchCritical })

  // Stream remaining content
  const stream = await renderToReadableStream(
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <App />
      </HydrationBoundary>
    </QueryClientProvider>
  )

  return new Response(stream, {
    headers: { 'Content-Type': 'text/html' },
  })
})
```

## Integration with Better Auth

Manage authentication state with TanStack Query:

### Auth Query Hook

```typescript
import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth'

export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const session = await authClient.getSession()
      return session
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry auth failures
  })
}

// Usage in components
function Profile() {
  const { data: session, isPending } = useAuth()

  if (isPending) return <div>Loading...</div>

  if (!session) {
    return <LoginPrompt />
  }

  return <UserProfile user={session.user} />
}
```

### Auth Mutations

```typescript
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return await authClient.signIn.email(credentials)
    },

    onSuccess: () => {
      // Invalidate auth queries to refetch user session
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      return await authClient.signOut()
    },

    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear()
    },
  })
}

// Usage
function LoginForm() {
  const login = useLogin()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    login.mutate({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={login.isPending}>
        {login.isPending ? 'Signing in...' : 'Sign In'}
      </button>

      {login.isError && <p className="text-red-600">Invalid credentials</p>}
    </form>
  )
}
```

### Protected Queries

Only fetch data when authenticated:

```typescript
function useProtectedData() {
  const { data: session } = useAuth()

  return useQuery({
    queryKey: ['protected-data'],
    queryFn: fetchProtectedData,
    enabled: !!session, // Only fetch when authenticated
  })
}
```

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

## DevTools

### Installation

```bash
bun add @tanstack/react-query-devtools
```

### Setup

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  )
}
```

### Features

- **Query Inspector**: View all queries, their state, and cached data
- **Mutation Inspector**: See active and recent mutations
- **Cache Explorer**: Browse and edit cached data
- **Query Timeline**: Visualize query lifecycles
- **Network Panel**: Monitor requests and responses
- **Manual Actions**: Trigger refetch, invalidation, reset

### Production Considerations

DevTools are automatically excluded from production builds (tree-shaken).

## Summary

TanStack Query transforms server-state management in Omnera:

1. **Zero Boilerplate**: No manual loading/error state management
2. **Automatic Caching**: Smart caching with configurable stale times
3. **Background Updates**: Keep data fresh with window focus, reconnect refetching
4. **Request Deduplication**: Single request for multiple components
5. **Optimistic Updates**: Instant UI feedback with automatic rollback
6. **SSR Support**: First-class server-side rendering with Hono
7. **Effect.ts Integration**: Seamlessly convert Effect programs to queries
8. **TypeScript Native**: Full type inference and safety
9. **DevTools**: Powerful debugging and visualization
10. **Performance**: Structural sharing, prefetching, cancellation

### When to Use TanStack Query

**Use TanStack Query for**:

- Fetching data from APIs
- Managing server state (users, posts, data from backend)
- Caching API responses
- Background refetching
- Pagination and infinite scroll
- Optimistic UI updates
- Authentication state

**Don't use TanStack Query for**:

- Client state (form inputs, UI toggles) - use React state
- Global client state - use Context or Zustand
- Static data that never changes - use constants
- One-time fetches that don't need caching - use useEffect + fetch

### Integration Summary

| Feature          | TanStack Query                | Effect.ts                      | React 19               | Hono SSR               |
| ---------------- | ----------------------------- | ------------------------------ | ---------------------- | ---------------------- |
| **Data Fetch**   | useQuery hook                 | Effect programs as queryFn     | use() hook for Suspend | prefetchQuery on server|
| **Mutations**    | useMutation hook              | Effect programs as mutationFn  | Actions integration    | N/A                    |
| **Caching**      | Automatic with stale/gc times | N/A                            | N/A                    | Dehydrate for SSR      |
| **Errors**       | Typed error states            | Effect errors → JS errors      | Error boundaries       | Handled on server      |
| **Loading**      | isPending, isFetching         | Effect.runPromise              | Suspense boundaries    | Server renders data    |
| **Optimistic**   | onMutate, setQueryData        | N/A                            | useOptimistic hook     | N/A                    |

### Next Steps

1. **Set up QueryClient** in your application root
2. **Create query hooks** for your API endpoints
3. **Convert Effect programs** to query/mutation functions
4. **Add DevTools** for debugging
5. **Implement SSR** with Hono prefetching
6. **Add optimistic updates** for mutations
7. **Test components** with mocked query data

With TanStack Query, Omnera applications achieve exceptional user experience through intelligent server-state management, perfect integration with Effect.ts, and seamless server-side rendering with Hono.

## References

- TanStack Query documentation: https://tanstack.com/query/latest
- React Query (TanStack Query): https://tanstack.com/query/latest/docs/framework/react/overview
- Server-Side Rendering: https://tanstack.com/query/latest/docs/framework/react/guides/ssr
- Optimistic Updates: https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates
- TypeScript Guide: https://tanstack.com/query/latest/docs/framework/react/typescript
