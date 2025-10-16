# TanStack Query (React Query) - Server-State Management

> **Note**: This is part 20 of the split documentation. See navigation links below.


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
---


## Navigation

[← Part 19](./19-devtools.md) | [Part 21 →](./21-references.md)


**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-tanstack-query-for-omnera.md) | [Part 4](./04-installation.md) | [Part 5](./05-basic-setup.md) | [Part 6](./06-core-concepts.md) | [Part 7](./07-usequery-hook.md) | [Part 8](./08-integration-with-effectts.md) | [Part 9](./09-usemutation-hook.md) | [Part 10](./10-usequeries-hook.md) | [Part 11](./11-useinfinitequery-hook.md) | [Part 12](./12-server-side-rendering-ssr-with-hono.md) | [Part 13](./13-integration-with-better-auth.md) | [Part 14](./14-advanced-patterns.md) | [Part 15](./15-testing-with-tanstack-query.md) | [Part 16](./16-best-practices.md) | [Part 17](./17-common-pitfalls-to-avoid.md) | [Part 18](./18-performance-optimization.md) | [Part 19](./19-devtools.md) | **Part 20** | [Part 21](./21-references.md)