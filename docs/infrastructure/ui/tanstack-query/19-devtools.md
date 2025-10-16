# TanStack Query (React Query) - Server-State Management

> **Note**: This is part 19 of the split documentation. See navigation links below.


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
---


## Navigation

[← Part 18](./18-performance-optimization.md) | [Part 20 →](./20-summary.md)


**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-tanstack-query-for-omnera.md) | [Part 4](./04-installation.md) | [Part 5](./05-basic-setup.md) | [Part 6](./06-core-concepts.md) | [Part 7](./07-usequery-hook.md) | [Part 8](./08-integration-with-effectts.md) | [Part 9](./09-usemutation-hook.md) | [Part 10](./10-usequeries-hook.md) | [Part 11](./11-useinfinitequery-hook.md) | [Part 12](./12-server-side-rendering-ssr-with-hono.md) | [Part 13](./13-integration-with-better-auth.md) | [Part 14](./14-advanced-patterns.md) | [Part 15](./15-testing-with-tanstack-query.md) | [Part 16](./16-best-practices.md) | [Part 17](./17-common-pitfalls-to-avoid.md) | [Part 18](./18-performance-optimization.md) | **Part 19** | [Part 20](./20-summary.md) | [Part 21](./21-references.md)