# TanStack Query (React Query) - Server-State Management

> **Note**: This is part 5 of the split documentation. See navigation links below.


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
---


## Navigation

[← Part 4](./04-installation.md) | [Part 6 →](./06-core-concepts.md)


**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-tanstack-query-for-omnera.md) | [Part 4](./04-installation.md) | **Part 5** | [Part 6](./06-core-concepts.md) | [Part 7](./07-usequery-hook.md) | [Part 8](./08-integration-with-effectts.md) | [Part 9](./09-usemutation-hook.md) | [Part 10](./10-usequeries-hook.md) | [Part 11](./11-useinfinitequery-hook.md) | [Part 12](./12-server-side-rendering-ssr-with-hono.md) | [Part 13](./13-integration-with-better-auth.md) | [Part 14](./14-advanced-patterns.md) | [Part 15](./15-testing-with-tanstack-query.md) | [Part 16](./16-best-practices.md) | [Part 17](./17-common-pitfalls-to-avoid.md) | [Part 18](./18-performance-optimization.md) | [Part 19](./19-devtools.md) | [Part 20](./20-summary.md) | [Part 21](./21-references.md)