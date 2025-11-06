# TanStack Query (React Query) - Server-State Management

> **Note**: This is part 9 of the split documentation. See navigation links below.

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

---

## Navigation

[← Part 8](./08-integration-with-effectts.md) | [Part 10 →](./10-usequeries-hook.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-tanstack-query-for-sovrium.md) | [Part 4](./04-installation.md) | [Part 5](./05-basic-setup.md) | [Part 6](./06-core-concepts.md) | [Part 7](./07-usequery-hook.md) | [Part 8](./08-integration-with-effectts.md) | **Part 9** | [Part 10](./10-usequeries-hook.md) | [Part 11](./11-useinfinitequery-hook.md) | [Part 12](./12-server-side-rendering-ssr-with-hono.md) | [Part 13](./13-integration-with-better-auth.md) | [Part 14](./14-advanced-patterns.md) | [Part 15](./15-testing-with-tanstack-query.md) | [Part 16](./16-best-practices.md) | [Part 17](./17-common-pitfalls-to-avoid.md) | [Part 18](./18-performance-optimization.md) | [Part 19](./19-devtools.md) | [Part 20](./20-summary.md) | [Part 21](./21-references.md)
