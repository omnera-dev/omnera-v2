# TanStack Query (React Query) - Server-State Management

> **Note**: This is part 13 of the split documentation. See navigation links below.

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

---

## Navigation

[← Part 12](./12-server-side-rendering-ssr-with-hono.md) | [Part 14 →](./14-advanced-patterns.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-why-tanstack-query-for-omnera.md) | [Part 4](./04-installation.md) | [Part 5](./05-basic-setup.md) | [Part 6](./06-core-concepts.md) | [Part 7](./07-usequery-hook.md) | [Part 8](./08-integration-with-effectts.md) | [Part 9](./09-usemutation-hook.md) | [Part 10](./10-usequeries-hook.md) | [Part 11](./11-useinfinitequery-hook.md) | [Part 12](./12-server-side-rendering-ssr-with-hono.md) | **Part 13** | [Part 14](./14-advanced-patterns.md) | [Part 15](./15-testing-with-tanstack-query.md) | [Part 16](./16-best-practices.md) | [Part 17](./17-common-pitfalls-to-avoid.md) | [Part 18](./18-performance-optimization.md) | [Part 19](./19-devtools.md) | [Part 20](./20-summary.md) | [Part 21](./21-references.md)
