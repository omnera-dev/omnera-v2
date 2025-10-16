# TanStack Query (React Query) - Server-State Management

> **Note**: This is part 3 of the split documentation. See navigation links below.

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

| Component           | Integration                                                                   |
| ------------------- | ----------------------------------------------------------------------------- |
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

---

## Navigation

[← Part 2](./02-overview.md) | [Part 4 →](./04-installation.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | **Part 3** | [Part 4](./04-installation.md) | [Part 5](./05-basic-setup.md) | [Part 6](./06-core-concepts.md) | [Part 7](./07-usequery-hook.md) | [Part 8](./08-integration-with-effectts.md) | [Part 9](./09-usemutation-hook.md) | [Part 10](./10-usequeries-hook.md) | [Part 11](./11-useinfinitequery-hook.md) | [Part 12](./12-server-side-rendering-ssr-with-hono.md) | [Part 13](./13-integration-with-better-auth.md) | [Part 14](./14-advanced-patterns.md) | [Part 15](./15-testing-with-tanstack-query.md) | [Part 16](./16-best-practices.md) | [Part 17](./17-common-pitfalls-to-avoid.md) | [Part 18](./18-performance-optimization.md) | [Part 19](./19-devtools.md) | [Part 20](./20-summary.md) | [Part 21](./21-references.md)
