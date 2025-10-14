# React-Hono Integration (Server-Side Rendering)

> Part of [React Documentation](./react.md)

## Overview

This document covers how to integrate React with Hono for server-side rendering (SSR). React 19 works seamlessly with Hono's web framework to render React components on the server, improving initial page load performance and SEO.

## Why Server-Side Rendering with Hono

- **Fast Initial Page Loads**: HTML is rendered on the server, users see content immediately
- **SEO-Friendly**: Search engines can crawl fully-rendered HTML content
- **Progressive Enhancement**: Pages work even if JavaScript fails to load
- **Seamless Integration**: Hono's lightweight design pairs perfectly with React
- **Effect Support**: Easy integration with Effect for data fetching on the server

## Basic SSR Setup

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

### Key Components

- **`renderToString()`**: Converts React components to HTML string
- **Full HTML Document**: React component returns complete HTML structure
- **Tailwind Classes**: Style components using Tailwind CSS utilities
- **Static Assets**: Reference CSS via `<link>` tags

## SSR with Data Fetching

Fetch data on the server before rendering React components:

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

### Data Fetching Pattern

1. **Extract Route Params**: Get dynamic route parameters from Hono context
2. **Fetch Data with Effect**: Use Effect programs for type-safe data fetching
3. **Handle Errors**: Catch errors and return appropriate HTTP responses
4. **Pass Data as Props**: Render React component with fetched data
5. **Return HTML**: Convert rendered component to HTML string

## Component Library Pattern

Create reusable layout components for consistent page structure:

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

### Layout Pattern Benefits

- **Consistent Structure**: Navigation, footer, metadata shared across pages
- **DRY Principle**: Define layout once, reuse everywhere
- **Easy Updates**: Change layout in one place, affects all pages
- **Composition**: Layout accepts `children` prop for page-specific content
- **Type Safety**: TypeScript ensures correct prop usage

## Advanced Patterns

### Dynamic Metadata

```typescript
interface PageProps {
  title: string
  description: string
  ogImage?: string
}

function PageLayout({ title, description, ogImage, children }: PageProps & { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}

// Usage
app.get('/blog/:slug', async (c) => {
  const slug = c.req.param('slug')
  const post = await fetchPost(slug)

  const html = renderToString(
    <PageLayout
      title={`${post.title} - Blog`}
      description={post.excerpt}
      ogImage={post.coverImage}
    >
      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    </PageLayout>
  )

  return c.html(html)
})
```

### Error Pages

```typescript
function ErrorPage({ statusCode, message }: { statusCode: number; message: string }) {
  return (
    <html lang="en">
      <head>
        <title>{statusCode} - {message}</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">{statusCode}</h1>
          <p className="mt-4 text-xl text-gray-600">{message}</p>
          <a href="/" className="mt-8 inline-block rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
            Go Home
          </a>
        </div>
      </body>
    </html>
  )
}

// 404 handler
app.notFound((c) => {
  const html = renderToString(<ErrorPage statusCode={404} message="Page Not Found" />)
  return c.html(html, 404)
})

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err)
  const html = renderToString(<ErrorPage statusCode={500} message="Internal Server Error" />)
  return c.html(html, 500)
})
```

### Multiple Layouts

```typescript
// Layouts for different sections
function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout title="Blog">
      <div className="prose mx-auto max-w-4xl">
        {children}
      </div>
    </Layout>
  )
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout title="Dashboard">
      <div className="flex">
        <aside className="w-64 bg-white p-4">
          <nav>Sidebar Navigation</nav>
        </aside>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </Layout>
  )
}

// Usage
app.get('/blog/:slug', (c) => {
  const html = renderToString(
    <BlogLayout>
      <h1>Blog Post Title</h1>
      <p>Content...</p>
    </BlogLayout>
  )
  return c.html(html)
})

app.get('/dashboard', (c) => {
  const html = renderToString(
    <DashboardLayout>
      <h1>Dashboard Content</h1>
    </DashboardLayout>
  )
  return c.html(html)
})
```

## Best Practices

1. **Keep Components Pure**: SSR components should be stateless and pure
2. **Pass Data as Props**: Fetch data on server, pass to components via props
3. **Use Effect for Data Fetching**: Leverage Effect's type safety and error handling
4. **Create Reusable Layouts**: Extract common page structures into layout components
5. **Handle Errors Gracefully**: Return appropriate HTTP status codes and error pages
6. **Optimize Bundle Size**: Only include necessary code in server-rendered components
7. **Leverage TypeScript**: Use strict types for props, routes, and data
8. **Test SSR Routes**: Verify rendered HTML contains expected content

## Common Pitfalls

- ❌ **Using Client-Side Hooks**: `useState`, `useEffect` don't work in SSR (use for client-side hydration only)
- ❌ **Accessing Browser APIs**: `window`, `document` aren't available on server
- ❌ **Not Handling Errors**: Always catch and handle data fetching errors
- ❌ **Mixing Server and Client Logic**: Keep SSR logic separate from client-side interactivity
- ❌ **Forgetting Meta Tags**: Include proper metadata for SEO
- ❌ **Not Testing Rendered HTML**: Verify SSR output matches expectations

## Performance Considerations

- **Fast Rendering**: `renderToString()` is synchronous and fast
- **No Client JavaScript**: SSR pages load without JavaScript execution on client
- **Streaming (Future)**: React 19 supports streaming SSR for incremental page loads
- **Caching**: Cache rendered HTML for frequently accessed pages
- **Bun Speed**: Bun's fast runtime improves SSR performance

## Integration with Bun

- **Native TypeScript**: Bun executes React SSR code without compilation
- **Fast Startup**: Bun's speed reduces server cold start times
- **Hot Reload**: Use `bun --watch` for development with automatic restarts
- **Environment Variables**: Access via `process.env` or `Bun.env`

## See Also

- [React Framework Overview](./react.md)
- [React Styling with Tailwind CSS](./react-styling.md)
- [React Effect Integration](./react-effect-integration.md)
- [React Patterns](./react-patterns.md)
- [React Testing](./react-testing.md)
- [Hono Framework Documentation](../framework/hono.md)
- [Effect Framework Documentation](../framework/effect.md)

## References

- React Server Components: https://react.dev/reference/react/server-components
- React `renderToString`: https://react.dev/reference/react-dom/server/renderToString
- Hono Framework: https://hono.dev/
- SSR Best Practices: https://react.dev/learn/server-components
