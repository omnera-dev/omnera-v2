# React Component Patterns

> Part of [React Documentation](./react.md)

## Overview

This document covers common React component patterns for building maintainable, reusable, and composable UIs. These patterns demonstrate best practices for component architecture and state management.

## Container/Presentational Pattern

Separate business logic from presentation for better testability and reusability.

### Pattern Structure

```tsx
// Presentational component (pure, no logic)
interface UserListViewProps {
  users: User[]
  loading: boolean
  error: string | null
  onRefresh: () => void
}

function UserListView({ users, loading, error, onRefresh }: UserListViewProps) {
  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div>
      <button onClick={onRefresh}>Refresh</button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}

// Container component (handles logic and state)
function UserListContainer() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <UserListView
      users={users}
      loading={loading}
      error={error}
      onRefresh={fetchUsers}
    />
  )
}
```

### Benefits

- **Testability**: Presentational component easy to test (pure)
- **Reusability**: View component can be reused with different data sources
- **Separation of Concerns**: Logic isolated from presentation
- **Type Safety**: Clear interface between container and view

### When to Use

- Complex components with multiple responsibilities
- When testing presentation logic separately from data fetching
- When reusing the same view with different data sources

## Compound Components Pattern

Create flexible, composable component APIs using shared context.

### Pattern Structure

```tsx
// Parent component with context
interface TabsContextValue {
  activeTab: string
  setActiveTab: (id: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

function Tabs({ defaultTab, children }: { defaultTab: string; children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="rounded-lg border border-gray-200">{children}</div>
    </TabsContext.Provider>
  )
}

function TabList({ children }: { children: React.ReactNode }) {
  return <div className="flex border-b border-gray-200">{children}</div>
}

function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error('Tab must be used within Tabs')

  const { activeTab, setActiveTab } = context
  const isActive = activeTab === id

  return (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        'px-4 py-2 font-medium',
        isActive ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'
      )}
    >
      {children}
    </button>
  )
}

function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error('TabPanel must be used within Tabs')

  const { activeTab } = context
  if (activeTab !== id) return null

  return <div className="p-4">{children}</div>
}

// Attach components as properties
Tabs.List = TabList
Tabs.Tab = Tab
Tabs.Panel = TabPanel

// Usage
function App() {
  return (
    <Tabs defaultTab="home">
      <Tabs.List>
        <Tabs.Tab id="home">Home</Tabs.Tab>
        <Tabs.Tab id="profile">Profile</Tabs.Tab>
        <Tabs.Tab id="settings">Settings</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel id="home">
        <h2>Home Content</h2>
      </Tabs.Panel>
      <Tabs.Panel id="profile">
        <h2>Profile Content</h2>
      </Tabs.Panel>
      <Tabs.Panel id="settings">
        <h2>Settings Content</h2>
      </Tabs.Panel>
    </Tabs>
  )
}
```

### Benefits

- **Flexible API**: Components work together automatically via context
- **Composability**: Easy to rearrange and customize structure
- **Encapsulation**: Internal state managed by parent component
- **Clear Relationships**: Components explicitly associated via namespace

### When to Use

- Complex UI components with multiple interconnected parts (tabs, accordions, dropdowns)
- When you want flexible composition without complex prop drilling
- Building component libraries with intuitive APIs

## Render Props Pattern

Share code between components using a function prop that returns React elements.

### Pattern Structure

```tsx
interface MouseTrackerProps {
  render: (position: { x: number; y: number }) => React.ReactNode
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return <>{render(position)}</>
}

// Usage
function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <div>
          Mouse position: {x}, {y}
        </div>
      )}
    />
  )
}
```

### Benefits

- **Flexibility**: Consumer controls what gets rendered
- **Reusability**: Same logic works with different presentations
- **Type Safety**: TypeScript enforces render function signature
- **Clear Contract**: Explicit data flow between components

### When to Use

- Sharing stateful logic between components
- When consumer needs full control over rendering
- Cross-cutting concerns (mouse tracking, scroll position, etc.)

## Custom Hooks Pattern

Extract reusable stateful logic into custom hooks.

### Pattern Structure

```tsx
// Custom hook for data fetching
function useUser(userId: number) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/users/${userId}`)
        const data = await response.json()

        if (!cancelled) {
          setUser(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to fetch user')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchUser()

    return () => {
      cancelled = true
    }
  }, [userId])

  return { user, loading, error }
}

// Usage in components
function UserProfile({ userId }: { userId: number }) {
  const { user, loading, error } = useUser(userId)

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (!user) return null

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### Benefits

- **Reusability**: Share logic across multiple components
- **Composition**: Combine multiple hooks easily
- **Testability**: Hooks can be tested independently
- **Readability**: Components stay focused on presentation

### When to Use

- Sharing stateful logic between components
- Complex state management (forms, data fetching, timers)
- Side effects that need cleanup
- Abstracting repetitive patterns

## Higher-Order Components (HOC) Pattern

Wrap components with additional functionality (less common in modern React, prefer hooks).

### Pattern Structure

```tsx
// HOC that adds loading state
function withLoading<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & { isLoading: boolean }> {
  return function WithLoadingComponent({ isLoading, ...props }: P & { isLoading: boolean }) {
    if (isLoading) {
      return <div>Loading...</div>
    }

    return <Component {...(props as P)} />
  }
}

// Usage
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

const UserListWithLoading = withLoading(UserList)

// In parent component
<UserListWithLoading users={users} isLoading={loading} />
```

### When to Use (Rarely)

- Legacy code that uses HOCs
- Cross-cutting concerns that can't be expressed as hooks
- Third-party libraries that require HOCs

**Note**: Modern React favors custom hooks over HOCs for code reuse.

## Controlled vs Uncontrolled Components

### Controlled Components

Component state is controlled by React (recommended):

```tsx
function ControlledForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email:', email, 'Password:', password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Uncontrolled Components

DOM maintains its own state (use refs):

```tsx
function UncontrolledForm() {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email:', emailRef.current?.value)
    console.log('Password:', passwordRef.current?.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" ref={emailRef} defaultValue="" />
      <input type="password" ref={passwordRef} defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### When to Use Each

**Controlled (Recommended)**:

- Need to validate or transform input as user types
- Conditional rendering based on input values
- Dynamic form behavior
- Most form scenarios

**Uncontrolled**:

- Simple forms without validation
- File inputs (always uncontrolled)
- Integrating with non-React code

## Provider Pattern

Share data across component tree without prop drilling.

### Pattern Structure

```tsx
// Create context
interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

// Provider component
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to consume context
function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// Usage in app
function App() {
  return (
    <ThemeProvider>
      <Header />
      <MainContent />
      <Footer />
    </ThemeProvider>
  )
}

// Usage in components
function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  )
}
```

### Benefits

- **No Prop Drilling**: Access data anywhere in tree
- **Centralized State**: Single source of truth
- **Type Safety**: TypeScript ensures correct usage
- **Composability**: Multiple providers can be nested

### When to Use

- Global application state (theme, auth, locale)
- Data needed by many components at different nesting levels
- Avoiding prop drilling through many component layers

## Optimistic UI Pattern

Update UI immediately before server confirmation:

```tsx
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = (text: string) => {
    // Optimistic update
    const tempTodo = { id: Date.now(), text, completed: false, pending: true }
    setTodos((prev) => [...prev, tempTodo])

    // Save to server
    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then((savedTodo) => {
        // Replace temp with saved
        setTodos((prev) => prev.map((t) => (t.id === tempTodo.id ? savedTodo : t)))
      })
      .catch(() => {
        // Rollback on error
        setTodos((prev) => prev.filter((t) => t.id !== tempTodo.id))
        alert('Failed to add todo')
      })
  }

  return (
    <div>
      <button onClick={() => addTodo('New Task')}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.pending ? 'opacity-50' : ''}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### When to Use

- Actions that should feel instant (liking, posting, deleting)
- Good network conditions where failures are rare
- Non-critical operations that can be rolled back

## Error Boundary Pattern

Catch JavaScript errors in component tree:

```tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ComponentThatMightError />
    </ErrorBoundary>
  )
}
```

### When to Use

- Preventing entire app crashes from component errors
- Displaying fallback UI for error states
- Logging errors to error reporting service

**Note**: Error boundaries only catch errors in rendering, lifecycle methods, and constructors. They don't catch errors in event handlers or async code.

## Best Practices

1. **Choose the Right Pattern**: Use patterns appropriate for the problem
2. **Keep Components Simple**: Single responsibility principle
3. **Extract Custom Hooks**: Reuse stateful logic across components
4. **Use Compound Components**: For complex, interconnected UIs
5. **Avoid Prop Drilling**: Use context or composition instead
6. **Prefer Controlled Components**: Better validation and dynamic behavior
7. **Test Patterns**: Patterns should improve testability
8. **Document Complex Patterns**: Add comments explaining pattern usage

## Common Pitfalls

- ❌ **Over-engineering**: Don't use complex patterns for simple components
- ❌ **Prop drilling**: Passing props through many layers
- ❌ **God components**: Components with too many responsibilities
- ❌ **Uncontrolled inputs**: Hard to validate and manage
- ❌ **Context overuse**: Not everything needs global state
- ❌ **HOCs over hooks**: Modern React prefers hooks for code reuse

## See Also

- [React Framework Overview](./react.md)
- [React Hono Integration](./react-hono-integration.md)
- [React Styling](./react-styling.md)
- [React Effect Integration](./react-effect-integration.md)
- [React Testing](./react-testing.md)

## References

- React patterns: https://react.dev/learn/thinking-in-react
- Component composition: https://react.dev/learn/passing-props-to-a-component
- Custom hooks: https://react.dev/learn/reusing-logic-with-custom-hooks
- Context API: https://react.dev/learn/passing-data-deeply-with-context
