# React-Effect Integration

> Part of [React Documentation](./react.md)

## Overview

This document covers how to integrate React with Effect for type-safe data fetching, error handling, and business logic. Effect provides powerful functional programming patterns that complement React's component model.

## Why Effect with React

- **Type-Safe Error Handling**: Explicit error types tracked at compile time
- **Composable Logic**: Build complex operations from simple, reusable pieces
- **Dependency Injection**: Easy testing with mocked services
- **Retry and Timeout**: Built-in policies for robust data fetching
- **Structured Concurrency**: Efficient parallel operations with fibers
- **Effect Schema Integration**: Runtime validation with full TypeScript support

## Data Fetching with Effect

### Basic Pattern

```tsx
import { useEffect, useState } from 'react'
import { Effect, Data } from 'effect'

class ApiError extends Data.TaggedError('ApiError')<{
  message: string
  statusCode: number
}> {}

// Effect program to fetch user
const fetchUser = (id: number): Effect.Effect<User, ApiError, never> =>
  Effect.gen(function* () {
    const response = yield* Effect.tryPromise({
      try: () => fetch(`/api/users/${id}`).then((r) => r.json()),
      catch: () => new ApiError({ message: 'Network error', statusCode: 0 }),
    })

    return response as User
  })

// React component using Effect
function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    const program = fetchUser(userId).pipe(Effect.retry({ times: 3 }), Effect.timeout('5 seconds'))

    Effect.runPromise(program)
      .then((user) => {
        setUser(user)
        setError(null)
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Unknown error')
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [userId])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-600">Error: {error}</p>
  if (!user) return null

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="text-2xl font-bold">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  )
}
```

### Key Components

- **Effect Program**: Define data fetching logic with `Effect.gen`
- **Error Handling**: Use `Effect.tryPromise` to catch and type errors
- **Retry Logic**: Add `Effect.retry()` for transient failures
- **Timeout**: Use `Effect.timeout()` to prevent hanging requests
- **React State**: Store result in component state with `useState`
- **Side Effect**: Run Effect program in `useEffect` hook

## Custom Hook with Effect

Create a reusable hook for Effect-based data fetching:

```tsx
import { useState, useEffect } from 'react'
import { Effect } from 'effect'

// Custom hook for Effect-based data fetching
function useEffectQuery<A, E>(effect: Effect.Effect<A, E, never>) {
  const [data, setData] = useState<A | null>(null)
  const [error, setError] = useState<E | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    setLoading(true)

    Effect.runPromise(Effect.either(effect))
      .then((result) => {
        if (cancelled) return

        if (result._tag === 'Right') {
          setData(result.right)
          setError(null)
        } else {
          setError(result.left)
          setData(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [effect])

  return { data, error, loading }
}

// Usage
function UserList() {
  const fetchUsers = Effect.tryPromise({
    try: () => fetch('/api/users').then((r) => r.json()),
    catch: (error) => new ApiError({ message: String(error), statusCode: 0 }),
  })

  const { data: users, error, loading } = useEffectQuery(fetchUsers)

  if (loading) return <p>Loading users...</p>
  if (error) return <p className="text-red-600">Error loading users</p>
  if (!users) return null

  return (
    <ul className="space-y-2">
      {users.map((user: User) => (
        <li
          key={user.id}
          className="rounded bg-white p-4 shadow"
        >
          {user.name}
        </li>
      ))}
    </ul>
  )
}
```

### Hook Benefits

- **Reusability**: Use across multiple components
- **Cleanup**: Handles component unmount properly
- **Type Safety**: Full TypeScript inference
- **Effect Either**: Returns `Either` for graceful error handling

## Integration with Effect Schema

Effect Schema provides runtime validation for data fetching:

### Form Validation with Effect Schema

```tsx
import { useState } from 'react'
import { Schema, Effect } from 'effect'

// Define form schema
const RegisterFormSchema = Schema.Struct({
  username: Schema.String.pipe(
    Schema.minLength(3, { message: () => 'Username must be at least 3 characters' }),
    Schema.maxLength(20, { message: () => 'Username must be at most 20 characters' }),
    Schema.pattern(/^[a-zA-Z0-9_]+$/, {
      message: () => 'Username can only contain letters, numbers, and underscores',
    })
  ),
  email: Schema.String.pipe(
    Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: () => 'Please enter a valid email address',
    })
  ),
  password: Schema.String.pipe(
    Schema.minLength(8, { message: () => 'Password must be at least 8 characters' })
  ),
})

type RegisterFormData = Schema.Schema.Type<typeof RegisterFormSchema>

function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})

    // Validate with Effect Schema
    const validationResult = await Effect.runPromise(
      Schema.decodeUnknown(RegisterFormSchema)(formData).pipe(Effect.either)
    )

    if (validationResult._tag === 'Left') {
      // Validation failed - extract error messages
      const parseError = validationResult.left
      setErrors({
        // Parse error message and extract field-specific errors
        username: 'Invalid username',
      })
      setSubmitting(false)
      return
    }

    // Validation succeeded
    const validatedData = validationResult.right

    try {
      // Submit to API
      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      })

      console.log('Registration successful!')
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md space-y-4"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
          className={cn(
            'w-full rounded-md border px-3 py-2',
            errors.username ? 'border-red-500' : 'border-gray-300'
          )}
        />
        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={cn(
            'w-full rounded-md border px-3 py-2',
            errors.email ? 'border-red-500' : 'border-gray-300'
          )}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          className={cn(
            'w-full rounded-md border px-3 py-2',
            errors.password ? 'border-red-500' : 'border-gray-300'
          )}
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}
```

### Schema Validation Pattern

1. **Define Schema**: Create Effect Schema with validation rules
2. **Extract Type**: Use `Schema.Schema.Type<typeof Schema>` for TypeScript type
3. **Validate on Submit**: Run `Schema.decodeUnknown()` before API call
4. **Handle Errors**: Display field-specific errors from parse failures
5. **Submit Validated Data**: Use type-safe validated data in API request

## Effect Services with React

Use Effect's dependency injection with React components:

```tsx
import { Effect, Context, Layer } from 'effect'

// Define service
class UserService extends Context.Tag('UserService')<
  UserService,
  {
    findById: (id: number) => Effect.Effect<User, UserNotFoundError>
    create: (data: CreateUserData) => Effect.Effect<User, DatabaseError>
  }
>() {}

// Implement service
const UserServiceLive = Layer.succeed(UserService, {
  findById: (id) =>
    Effect.gen(function* () {
      const response = yield* Effect.tryPromise({
        try: () => fetch(`/api/users/${id}`).then((r) => r.json()),
        catch: () => new UserNotFoundError({ userId: id }),
      })
      return response as User
    }),
  create: (data) =>
    Effect.gen(function* () {
      const response = yield* Effect.tryPromise({
        try: () =>
          fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }).then((r) => r.json()),
        catch: () => new DatabaseError({ message: 'Failed to create user' }),
      })
      return response as User
    }),
})

// Use in React component
function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const program = Effect.gen(function* () {
      const userService = yield* UserService
      return yield* userService.findById(userId)
    })

    Effect.runPromise(
      program.pipe(
        Effect.provide(UserServiceLive),
        Effect.catchAll((error) =>
          Effect.succeed({
            _tag: 'Error' as const,
            message: 'User not found',
          })
        )
      )
    )
      .then((result) => {
        if ('_tag' in result && result._tag === 'Error') {
          setError(result.message)
        } else {
          setUser(result)
        }
      })
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (!user) return null

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="text-2xl font-bold">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  )
}
```

### Service Pattern Benefits

- **Testability**: Easy to provide mock services in tests
- **Type Safety**: Services are strongly typed
- **Separation of Concerns**: Business logic separated from UI
- **Composability**: Services can depend on other services

## Advanced Patterns

### Parallel Data Fetching

```tsx
function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const program = Effect.all(
      [fetchUsers(), fetchPosts(), fetchStats()],
      { concurrency: 3 } // Fetch in parallel
    )

    Effect.runPromise(program)
      .then(([users, posts, stats]) => {
        setData({ users, posts, stats })
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading dashboard...</p>
  if (!data) return null

  return (
    <div className="space-y-6">
      <UserList users={data.users} />
      <PostList posts={data.posts} />
      <StatsPanel stats={data.stats} />
    </div>
  )
}
```

### Debounced Search with Effect

```tsx
function SearchComponent() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    setLoading(true)

    const searchProgram = Effect.gen(function* () {
      // Debounce search
      yield* Effect.sleep('300 millis')

      // Fetch results
      const response = yield* Effect.tryPromise({
        try: () => fetch(`/api/search?q=${encodeURIComponent(query)}`).then((r) => r.json()),
        catch: () => new SearchError({ message: 'Search failed' }),
      })

      return response as SearchResult[]
    })

    Effect.runPromise(searchProgram.pipe(Effect.timeout('5 seconds')))
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full rounded-md border px-3 py-2"
      />
      {loading && <p>Searching...</p>}
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Optimistic Updates

```tsx
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = (text: string) => {
    // Optimistic update
    const tempTodo = { id: Date.now(), text, completed: false }
    setTodos((prev) => [...prev, tempTodo])

    // Effect program to save to server
    const program = Effect.gen(function* () {
      const response = yield* Effect.tryPromise({
        try: () =>
          fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
          }).then((r) => r.json()),
        catch: () => new ApiError({ message: 'Failed to create todo', statusCode: 500 }),
      })
      return response as Todo
    })

    Effect.runPromise(program)
      .then((savedTodo) => {
        // Replace temp todo with saved todo
        setTodos((prev) => prev.map((t) => (t.id === tempTodo.id ? savedTodo : t)))
      })
      .catch(() => {
        // Rollback on error
        setTodos((prev) => prev.filter((t) => t.id !== tempTodo.id))
        alert('Failed to create todo')
      })
  }

  return (
    <div>
      <button onClick={() => addTodo('New Task')}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Best Practices

1. **Use Effect for Data Fetching**: Leverage type-safe error handling and retry logic
2. **Create Custom Hooks**: Extract Effect patterns into reusable hooks
3. **Validate with Effect Schema**: Runtime validation for forms and API responses
4. **Handle Cleanup**: Always handle component unmount in `useEffect` cleanup
5. **Use Effect.either**: Gracefully handle errors without throwing exceptions
6. **Provide Services**: Use dependency injection for testability
7. **Parallel Operations**: Use `Effect.all` for concurrent data fetching
8. **Add Timeouts**: Always set timeouts for network operations
9. **Retry Transient Failures**: Use `Effect.retry` for network resilience
10. **Keep UI Logic Separate**: Effect handles business logic, React handles presentation

## Common Pitfalls

- ❌ **Not handling component unmount** (causes memory leaks)
- ❌ **Running Effect outside useEffect** (causes infinite loops)
- ❌ **Forgetting to catch errors** (unhandled promise rejections)
- ❌ **Not using Effect.either** (throwing exceptions instead of handling gracefully)
- ❌ **Mixing Promise and Effect** (inconsistent error handling)
- ❌ **Over-using Effect** (simple fetch doesn't need Effect complexity)
- ❌ **Not providing services** (type errors at runtime)

## See Also

- [React Framework Overview](./react.md)
- [React Hono Integration](./react-hono-integration.md)
- [React Styling](./react-styling.md)
- [React Patterns](./react-patterns.md)
- [React Testing](./react-testing.md)
- [Effect Framework Documentation](../framework/effect.md)
- [Effect Schema Documentation](../framework/effect-schema.md)
- [Effect Patterns Documentation](../framework/effect-patterns.md)

## References

- Effect documentation: https://effect.website/docs/introduction
- Effect Schema: https://effect.website/docs/schema/introduction
- React hooks: https://react.dev/reference/react/hooks
- useEffect guide: https://react.dev/reference/react/useEffect
