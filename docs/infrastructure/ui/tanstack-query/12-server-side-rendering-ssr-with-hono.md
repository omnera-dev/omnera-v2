# TanStack Query (React Query) - Server-State Management

> **Note**: This is part 12 of the split documentation. See navigation links below.

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
        <title>Sovrium App</title>
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

---

## Navigation

[← Part 11](./11-useinfinitequery-hook.md) | [Part 13 →](./13-integration-with-better-auth.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-tanstack-query-for-sovrium.md) | [Part 4](./04-installation.md) | [Part 5](./05-basic-setup.md) | [Part 6](./06-core-concepts.md) | [Part 7](./07-usequery-hook.md) | [Part 8](./08-integration-with-effectts.md) | [Part 9](./09-usemutation-hook.md) | [Part 10](./10-usequeries-hook.md) | [Part 11](./11-useinfinitequery-hook.md) | **Part 12** | [Part 13](./13-integration-with-better-auth.md) | [Part 14](./14-advanced-patterns.md) | [Part 15](./15-testing-with-tanstack-query.md) | [Part 16](./16-best-practices.md) | [Part 17](./17-common-pitfalls-to-avoid.md) | [Part 18](./18-performance-optimization.md) | [Part 19](./19-devtools.md) | [Part 20](./20-summary.md) | [Part 21](./21-references.md)
