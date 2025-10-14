# React - Component-Based UI Library

## Overview

**Version**: 19.2.0
**React DOM Version**: 19.2.0
**Purpose**: Declarative, component-based JavaScript library for building fast, interactive user interfaces with a focus on composability, reusability, and developer experience

React is a modern UI library created by Facebook (Meta) that revolutionized web development with its component-based architecture and virtual DOM. React 19 introduces significant improvements including the React Compiler for automatic optimization, Actions for simplified form handling, and enhanced server-side rendering capabilities.

## Why React for Omnera

- **Component-Based Architecture**: Build complex UIs from small, isolated, reusable pieces
- **Declarative Approach**: Describe what the UI should look like, React handles updates
- **Rich Ecosystem**: Massive collection of libraries, tools, and community resources
- **Excellent TypeScript Support**: First-class TypeScript integration with full type inference
- **Perfect for SSR**: Server-side rendering with Hono for fast initial page loads
- **Seamless Tailwind Integration**: Works beautifully with utility-first CSS
- **Effect-Ready**: Integrates naturally with Effect for business logic and data fetching
- **Fast Performance**: Virtual DOM and React 19 Compiler provide exceptional speed
- **Developer Experience**: Hot reloading, great debugging tools, extensive documentation
- **Battle-Tested**: Used by millions of websites including Facebook, Instagram, Netflix

## React 19 Major Features

### 1. React Compiler (Automatic Optimization)

React 19 introduces an automatic compiler that optimizes components without manual intervention:

- **Automatic Memoization**: No more manual `useMemo`, `useCallback`, or `React.memo`
- **Smart Re-rendering**: Compiler determines optimal re-render boundaries
- **Zero Runtime Overhead**: Optimizations happen at build time
- **Backward Compatible**: Works with existing React code without changes

**What This Means**:

- Write simpler, cleaner code without performance annotations
- React automatically optimizes component re-renders
- No need for manual optimization (unless extreme cases)

```tsx
// Before React 19 - Manual optimization required
const ExpensiveComponent = React.memo(({ data }: { data: Data }) => {
  const processed = useMemo(() => processData(data), [data])
  const handler = useCallback(() => handleClick(processed), [processed])

  return <div onClick={handler}>{processed.value}</div>
})

// React 19 - Compiler optimizes automatically
const ExpensiveComponent = ({ data }: { data: Data }) => {
  const processed = processData(data) // Automatically memoized
  const handler = () => handleClick(processed) // Automatically memoized

  return <div onClick={handler}>{processed.value}</div>
}
```

### 2. Actions (Simplified Form Handling)

Actions provide a new way to handle async operations and form submissions:

```tsx
import { useActionState } from 'react'

function ProfileForm() {
  const [error, submitAction, isPending] = useActionState(async (previousState, formData) => {
    const name = formData.get('name')

    // Call API
    const error = await updateProfile(name)
    return error ? error : null
  }, null)

  return (
    <form action={submitAction}>
      <input
        name="name"
        type="text"
      />
      <button
        type="submit"
        disabled={isPending}
      >
        {isPending ? 'Saving...' : 'Save'}
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  )
}
```

**Key Benefits**:

- **Automatic Pending States**: `isPending` tracks form submission status
- **Optimistic Updates**: `useOptimistic` hook for instant UI feedback
- **Error Handling**: Built-in error state management
- **Progressive Enhancement**: Works without JavaScript enabled

### 3. use() Hook (Async Data Reading)

The `use()` hook allows reading promises and context values during render:

```tsx
import { use } from 'react'

function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  // Suspends until promise resolves
  const user = use(userPromise)

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}

// Usage with Suspense
function App() {
  const userPromise = fetchUser(123)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  )
}
```

**Key Features**:

- **Async Data**: Read promises directly in components
- **Context Reading**: Access context conditionally
- **Suspense Integration**: Works seamlessly with React Suspense
- **Type-Safe**: Full TypeScript support for promise types

### 4. Server Components (React Server Components)

React 19 improves Server Components for rendering on the server:

```tsx
// Server Component (default in React 19)
async function ProductList() {
  const products = await db.query('SELECT * FROM products')

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}

// Client Component (marked with 'use client')
;('use client')

function ProductCard({ product }: { product: Product }) {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h2>{product.name}</h2>
      <button onClick={() => setCount(count + 1)}>Add to Cart ({count})</button>
    </div>
  )
}
```

**Benefits for Omnera**:

- **Server-Side Data Fetching**: Fetch data directly in components on the server
- **Smaller Client Bundles**: Server components don't ship JavaScript to client
- **Better Performance**: Reduced client-side work and faster initial loads
- **Seamless with Hono**: Perfect for server-side rendering with Hono

### 5. Document Metadata Support

React 19 natively supports `<title>`, `<meta>`, and `<link>` tags anywhere in components:

```tsx
function BlogPost({ post }: { post: Post }) {
  return (
    <>
      <title>{post.title} - Omnera Blog</title>
      <meta
        name="description"
        content={post.excerpt}
      />
      <meta
        property="og:title"
        content={post.title}
      />
      <meta
        property="og:image"
        content={post.coverImage}
      />

      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    </>
  )
}
```

**Features**:

- **Automatic Hoisting**: React moves metadata tags to `<head>`
- **Deduplication**: Duplicate tags are automatically merged
- **Server & Client**: Works in both server and client components
- **SEO-Friendly**: Perfect for dynamic page metadata

### 6. ref as a Prop

No more `forwardRef` - refs can be passed as regular props:

```tsx
// Before React 19
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
    />
  )
})

// React 19 - ref is just a prop
function Input({ ref, ...props }: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
  return (
    <input
      ref={ref}
      {...props}
    />
  )
}
```

### 7. Improved Error Handling

React 19 provides better error messages and debugging:

- **Hydration Errors**: Clearer diffs showing client vs server mismatch
- **Error Boundaries**: Improved error boundary behavior
- **Development Warnings**: More helpful warnings during development

## Installation

React 19 is already installed in Omnera:

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  }
}
```

No additional installation needed.

## Basic Usage

### Creating Components

React components are JavaScript/TypeScript functions that return JSX:

```tsx
// Simple functional component
function Welcome() {
  return <h1>Welcome to Omnera!</h1>
}

// Component with props and TypeScript
interface UserProps {
  name: string
  email: string
  isAdmin?: boolean
}

function UserCard({ name, email, isAdmin = false }: UserProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-gray-600">{email}</p>
      {isAdmin && <span className="text-sm text-blue-600">Admin</span>}
    </div>
  )
}

// Component with children
interface CardProps {
  title: string
  children: React.ReactNode
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  )
}

// Usage
function App() {
  return (
    <Card title="User Information">
      <UserCard
        name="Alice Johnson"
        email="alice@example.com"
        isAdmin
      />
    </Card>
  )
}
```

### JSX Syntax

JSX is a syntax extension that looks like HTML but is actually JavaScript:

```tsx
function Example() {
  const name = 'Alice'
  const isLoggedIn = true
  const items = ['Apple', 'Banana', 'Orange']

  return (
    <div className="container">
      {/* JavaScript expressions in curly braces */}
      <h1>Hello, {name}!</h1>

      {/* Conditional rendering */}
      {isLoggedIn ? <p>Welcome back!</p> : <p>Please sign in</p>}

      {/* Conditional rendering with && */}
      {isLoggedIn && <button>Logout</button>}

      {/* Rendering lists */}
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* Inline styles (use Tailwind instead) */}
      <div style={{ color: 'blue', fontSize: '16px' }}>Styled text</div>

      {/* Class names (className, not class) */}
      <div className="bg-blue-500 p-4 text-white">Tailwind classes</div>

      {/* Self-closing tags */}
      <img
        src="/logo.png"
        alt="Logo"
      />
      <input type="text" />
    </div>
  )
}
```

**JSX Rules**:

- Must return a single root element (or use `<>...</>` Fragment)
- Use `className` instead of `class`
- Use `htmlFor` instead of `for`
- Close all tags (even self-closing ones like `<img />`)
- Use camelCase for attributes (`onClick`, not `onclick`)

### Props and TypeScript

Props are how you pass data from parent to child components:

```tsx
// Define props interface
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}

function Button({
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  children,
}: ButtonProps) {
  const baseClasses = 'rounded font-medium transition-colors'

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
  }

  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// Usage
function App() {
  return (
    <div>
      <Button
        variant="primary"
        size="large"
        onClick={() => console.log('Clicked!')}
      >
        Click Me
      </Button>
      <Button
        variant="secondary"
        onClick={() => console.log('Secondary')}
      >
        Cancel
      </Button>
    </div>
  )
}
```

### State Management with useState

The `useState` hook manages component state:

```tsx
import { useState } from 'react'

function Counter() {
  // State: [value, setter] = useState(initialValue)
  const [count, setCount] = useState(0)

  return (
    <div className="p-4">
      <p className="text-xl">Count: {count}</p>
      <button
        className="mr-2 rounded bg-blue-600 px-4 py-2 text-white"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
      <button
        className="rounded bg-red-600 px-4 py-2 text-white"
        onClick={() => setCount(0)}
      >
        Reset
      </button>
    </div>
  )
}

// State with objects
interface FormData {
  name: string
  email: string
}

function Form() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
  })

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <form>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
      <p>
        Name: {formData.name}, Email: {formData.email}
      </p>
    </form>
  )
}
```

### Side Effects with useEffect

The `useEffect` hook handles side effects like data fetching, subscriptions, and DOM manipulation:

```tsx
import { useState, useEffect } from 'react'

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Effect runs when userId changes
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

    // Cleanup function (runs before next effect or unmount)
    return () => {
      cancelled = true
    }
  }, [userId]) // Dependency array - effect runs when userId changes

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

// Effect with no dependencies (runs once on mount)
function Analytics() {
  useEffect(() => {
    console.log('Component mounted')

    return () => {
      console.log('Component unmounted')
    }
  }, []) // Empty array = run once

  return <div>Analytics tracking active</div>
}

// Effect with multiple dependencies
function SearchResults({ query, filters }: { query: string; filters: Filters }) {
  const [results, setResults] = useState([])

  useEffect(() => {
    // Runs when query OR filters change
    searchAPI(query, filters).then(setResults)
  }, [query, filters])

  return <ul>{/* render results */}</ul>
}
```

## Integration with Hono (Server-Side Rendering)

### Basic SSR Setup

Render React components on the server with Hono:

```typescript
import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'

const app = new Hono()

// React component
function HomePage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Omnera - Home</title>
        <link
          rel="stylesheet"
          href="/styles.css"
        />
      </head>
      <body className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-4xl font-bold text-gray-900">Welcome to Omnera</h1>
          <p className="text-gray-600">Built with React, Hono, Bun, and Tailwind CSS</p>
        </div>
      </body>
    </html>
  )
}

// Server route
app.get('/', (c) => {
  const html = renderToString(<HomePage />)
  return c.html(html)
})

export default app
```

### SSR with Data Fetching

```typescript
import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'
import { Effect } from 'effect'

const app = new Hono()

// React component that receives data as props
function UserPage({ user }: { user: User }) {
  return (
    <html lang="en">
      <head>
        <title>{user.name} - Profile</title>
        <link
          rel="stylesheet"
          href="/styles.css"
        />
      </head>
      <body className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h1 className="mb-4 text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="mt-2 text-sm text-gray-500">Member since {user.joinedAt}</p>
          </div>
        </div>
      </body>
    </html>
  )
}

// Server route with Effect data fetching
app.get('/users/:id', async (c) => {
  const id = c.req.param('id')

  // Fetch user with Effect
  const userProgram = Effect.gen(function* () {
    const userService = yield* UserService
    return yield* userService.findById(Number(id))
  })

  const result = await Effect.runPromise(
    userProgram.pipe(
      Effect.provide(UserServiceLive),
      Effect.catchAll(() =>
        Effect.succeed({
          _tag: 'Error' as const,
          message: 'User not found',
        })
      )
    )
  )

  if ('_tag' in result && result._tag === 'Error') {
    return c.html('<h1>User not found</h1>', 404)
  }

  // Render React component with data
  const html = renderToString(<UserPage user={result} />)
  return c.html(html)
})

export default app
```

### Component Library Pattern

```typescript
// components/Layout.tsx
interface LayoutProps {
  title: string
  children: React.ReactNode
}

export function Layout({ title, children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>{title}</title>
        <link
          rel="stylesheet"
          href="/styles.css"
        />
      </head>
      <body className="bg-gray-50 font-sans antialiased">
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <a
                href="/"
                className="text-xl font-bold text-gray-900"
              >
                Omnera
              </a>
              <div className="flex gap-6">
                <a
                  href="/features"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Features
                </a>
                <a
                  href="/docs"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Docs
                </a>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">{children}</main>

        <footer className="mt-16 border-t border-gray-200 bg-gray-50 py-8">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>&copy; 2025 Omnera. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

// routes/index.ts
import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'
import { Layout } from '../components/Layout'

const app = new Hono()

app.get('/', (c) => {
  const html = renderToString(
    <Layout title="Home - Omnera">
      <h1 className="mb-6 text-4xl font-bold">Welcome to Omnera</h1>
      <p className="text-gray-600">Modern TypeScript framework built with Bun</p>
    </Layout>
  )
  return c.html(html)
})

app.get('/features', (c) => {
  const html = renderToString(
    <Layout title="Features - Omnera">
      <h1 className="mb-6 text-4xl font-bold">Features</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-3 text-xl font-bold">Fast</h2>
          <p className="text-gray-600">Built on Bun for maximum performance</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-3 text-xl font-bold">Type-Safe</h2>
          <p className="text-gray-600">Full TypeScript support with Effect</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-3 text-xl font-bold">Modern</h2>
          <p className="text-gray-600">React 19, Hono, and Tailwind CSS</p>
        </div>
      </div>
    </Layout>
  )
  return c.html(html)
})

export default app
```

## Integration with Tailwind CSS

React and Tailwind work perfectly together:

```tsx
// Button component with Tailwind
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'rounded font-medium transition-colors focus:outline-none focus:ring-2'

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  const disabledClasses = disabled ? 'cursor-not-allowed opacity-50' : ''

  const className = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses}`

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// Card component with Tailwind
interface CardProps {
  title: string
  description: string
  imageUrl?: string
  action?: {
    label: string
    onClick: () => void
  }
}

function Card({ title, description, imageUrl, action }: CardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="h-48 w-full object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
        <p className="mb-4 text-gray-600">{description}</p>
        {action && (
          <Button
            variant="primary"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}

// Usage
function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card
          key={product.id}
          title={product.name}
          description={product.description}
          imageUrl={product.imageUrl}
          action={{
            label: 'View Details',
            onClick: () => console.log('View', product.id),
          }}
        />
      ))}
    </div>
  )
}
```

### Conditional Classes with clsx/classnames

For complex conditional styling, use a helper utility:

```tsx
// utils/cn.ts
export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

// Component usage
interface InputProps {
  error?: string
  disabled?: boolean
  value: string
  onChange: (value: string) => void
}

function Input({ error, disabled, value, onChange }: InputProps) {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          'w-full rounded-md border px-3 py-2',
          'focus:ring-2 focus:outline-none',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500',
          disabled && 'cursor-not-allowed bg-gray-100 opacity-50'
        )}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
```

## Integration with Effect

### Data Fetching with Effect

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

### Custom Hook with Effect

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

## Integration with Effect Schema

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

## TypeScript with React

### Component Props Types

```tsx
// Basic props
interface UserProps {
  name: string
  age: number
  email?: string // Optional prop
  isAdmin?: boolean
}

// Props with children
interface CardProps {
  title: string
  children: React.ReactNode
}

// Props with event handlers
interface ButtonProps {
  onClick: () => void
  onHover?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

// Props with generics
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string | number
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}

// Usage
function App() {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]

  return (
    <List
      items={users}
      renderItem={(user) => <span>{user.name}</span>}
      keyExtractor={(user) => user.id}
    />
  )
}
```

### Event Handler Types

```tsx
function FormExample() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted')
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input changed:', e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleClick}>Submit</button>
    </form>
  )
}
```

### Ref Types

```tsx
import { useRef, useEffect } from 'react'

function InputFocus() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus()
  }, [])

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.focus()
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
      />
      <button onClick={handleClear}>Clear</button>
    </div>
  )
}
```

## Component Patterns

### Container/Presentational Pattern

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

### Compound Components Pattern

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

### Render Props Pattern

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

## Performance Optimization

### React.memo (Optional with React 19 Compiler)

```tsx
// Before React 19 - Manual memoization
const ExpensiveComponent = React.memo(
  ({ data }: { data: Data }) => {
    // Component only re-renders if data changes
    return <div>{data.value}</div>
  },
  (prevProps, nextProps) => {
    // Custom comparison function (optional)
    return prevProps.data.id === nextProps.data.id
  }
)

// React 19 - Compiler optimizes automatically (no memo needed)
function ExpensiveComponent({ data }: { data: Data }) {
  return <div>{data.value}</div>
}
```

### useMemo and useCallback (Optional with React 19 Compiler)

```tsx
import { useMemo, useCallback } from 'react'

// Before React 19 - Manual optimization
function SearchResults({ query, items }: { query: string; items: Item[] }) {
  // Memoize expensive computation
  const filteredItems = useMemo(() => {
    return items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
  }, [query, items])

  // Memoize callback function
  const handleClick = useCallback(
    (id: number) => {
      console.log('Clicked item:', id)
    },
    [] // Dependencies
  )

  return (
    <ul>
      {filteredItems.map((item) => (
        <li
          key={item.id}
          onClick={() => handleClick(item.id)}
        >
          {item.name}
        </li>
      ))}
    </ul>
  )
}

// React 19 - Compiler optimizes automatically
function SearchResults({ query, items }: { query: string; items: Item[] }) {
  // No useMemo needed - compiler optimizes
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  )

  // No useCallback needed - compiler optimizes
  const handleClick = (id: number) => {
    console.log('Clicked item:', id)
  }

  return (
    <ul>
      {filteredItems.map((item) => (
        <li
          key={item.id}
          onClick={() => handleClick(item.id)}
        >
          {item.name}
        </li>
      ))}
    </ul>
  )
}
```

### Code Splitting with React.lazy

```tsx
import { lazy, Suspense } from 'react'

// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </div>
  )
}
```

## Testing React Components with Bun Test

### Basic Component Tests

```typescript
import { test, expect, describe } from 'bun:test'
import { renderToString } from 'react-dom/server'

// Component to test
function Button({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick}>{children}</button>
}

describe('Button Component', () => {
  test('renders children correctly', () => {
    const html = renderToString(<Button onClick={() => {}}>Click Me</Button>)

    expect(html).toContain('Click Me')
    expect(html).toContain('<button')
  })

  test('renders with different text', () => {
    const html = renderToString(<Button onClick={() => {}}>Submit</Button>)

    expect(html).toContain('Submit')
  })
})
```

### Testing with Props

```typescript
import { test, expect, describe } from 'bun:test'
import { renderToString } from 'react-dom/server'

interface UserCardProps {
  name: string
  email: string
  isAdmin?: boolean
}

function UserCard({ name, email, isAdmin = false }: UserCardProps) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{email}</p>
      {isAdmin && <span className="badge">Admin</span>}
    </div>
  )
}

describe('UserCard Component', () => {
  test('renders user information', () => {
    const html = renderToString(
      <UserCard
        name="Alice Johnson"
        email="alice@example.com"
      />
    )

    expect(html).toContain('Alice Johnson')
    expect(html).toContain('alice@example.com')
  })

  test('shows admin badge when isAdmin is true', () => {
    const html = renderToString(
      <UserCard
        name="Bob Smith"
        email="bob@example.com"
        isAdmin
      />
    )

    expect(html).toContain('Admin')
  })

  test('does not show admin badge when isAdmin is false', () => {
    const html = renderToString(
      <UserCard
        name="Charlie Brown"
        email="charlie@example.com"
      />
    )

    expect(html).not.toContain('Admin')
  })
})
```

## Best Practices for Omnera

1. **Use Functional Components**: Always use functional components with hooks
2. **TypeScript for Props**: Define prop interfaces for all components
3. **Server-Side Rendering**: Leverage Hono for SSR to improve performance and SEO
4. **Tailwind for Styling**: Use Tailwind utility classes instead of custom CSS
5. **Effect for Business Logic**: Use Effect for data fetching, error handling, and side effects
6. **Effect Schema for Validation**: Validate all user inputs with Effect Schema
7. **Component Composition**: Build complex UIs from small, reusable components
8. **Trust React 19 Compiler**: Don't over-optimize with manual memoization
9. **Co-locate Tests**: Keep component tests close to component files
10. **Semantic HTML**: Use proper HTML tags for accessibility

## Common Pitfalls to Avoid

- ❌ Mutating state directly (always use setter functions)
- ❌ Missing dependencies in useEffect (causes stale closures)
- ❌ Using indexes as keys in lists (breaks reconciliation)
- ❌ Forgetting to clean up effects (causes memory leaks)
- ❌ Over-optimizing with memo/useMemo/useCallback in React 19
- ❌ Not handling loading and error states
- ❌ Using class components (use functional components instead)
- ❌ Mixing server and client logic in components

## When to Use React

**Use React for:**

- Building interactive user interfaces
- Server-side rendered applications with Hono
- Component-based UI architecture
- Applications requiring rich interactivity
- Projects with complex state management needs
- SEO-critical applications (with SSR)

**Consider alternatives for:**

- Simple static websites (use plain HTML/CSS)
- Non-interactive content (use static site generators)
- Extremely performance-critical apps (use vanilla JS)

## Integration with Bun

- **Native TypeScript**: React TSX runs directly with Bun
- **Fast Startup**: Bun's speed complements React's performance
- **Hot Reload**: Use `bun --watch` for development
- **Server-Side Rendering**: Bun executes React server-side with Hono
- **Type Checking**: Use `tsc --noEmit` to validate React types

## References

- React documentation: https://react.dev/
- React 19 announcement: https://react.dev/blog/2024/12/05/react-19
- React API reference: https://react.dev/reference/react
- React DOM API: https://react.dev/reference/react-dom
- React hooks reference: https://react.dev/reference/react/hooks
- TypeScript with React: https://react-typescript-cheatsheet.netlify.app/
