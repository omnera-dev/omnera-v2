# React Testing with Bun Test

> Part of [React Documentation](./react.md)

## Overview

This document covers testing React components using Bun's built-in test runner. React components in Omnera are tested using server-side rendering (`renderToString`) from `react-dom/server`, which allows testing component output without a browser environment.

## Why Server-Side Testing with Bun Test

- **Fast Execution**: Bun Test runs unit tests in milliseconds
- **No Browser Required**: Uses `renderToString` for server-side rendering
- **TypeScript Native**: Direct TypeScript execution without compilation
- **Simple Setup**: No additional test framework dependencies needed
- **SSR Validation**: Tests the same rendering path used in production with Hono

## Basic Component Tests

### Testing Simple Components

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

## Testing Conditional Rendering

```typescript
import { test, expect, describe } from 'bun:test'
import { renderToString } from 'react-dom/server'

interface AlertProps {
  type: 'success' | 'error' | 'warning'
  message: string
  dismissible?: boolean
}

function Alert({ type, message, dismissible = false }: AlertProps) {
  const typeClasses = {
    success: 'bg-green-50 text-green-800',
    error: 'bg-red-50 text-red-800',
    warning: 'bg-yellow-50 text-yellow-800',
  }

  return (
    <div className={`alert ${typeClasses[type]}`}>
      <p>{message}</p>
      {dismissible && <button className="close">×</button>}
    </div>
  )
}

describe('Alert Component', () => {
  test('renders success alert with correct styling', () => {
    const html = renderToString(<Alert type="success" message="Operation successful" />)

    expect(html).toContain('bg-green-50')
    expect(html).toContain('text-green-800')
    expect(html).toContain('Operation successful')
  })

  test('renders error alert with correct styling', () => {
    const html = renderToString(<Alert type="error" message="Error occurred" />)

    expect(html).toContain('bg-red-50')
    expect(html).toContain('text-red-800')
    expect(html).toContain('Error occurred')
  })

  test('shows dismiss button when dismissible is true', () => {
    const html = renderToString(<Alert type="warning" message="Warning" dismissible />)

    expect(html).toContain('close')
    expect(html).toContain('×')
  })

  test('does not show dismiss button when dismissible is false', () => {
    const html = renderToString(<Alert type="warning" message="Warning" />)

    expect(html).not.toContain('close')
    expect(html).not.toContain('×')
  })
})
```

## Testing Lists and Iteration

```typescript
import { test, expect, describe } from 'bun:test'
import { renderToString } from 'react-dom/server'

interface User {
  id: number
  name: string
}

interface UserListProps {
  users: User[]
}

function UserList({ users }: UserListProps) {
  if (users.length === 0) {
    return <p>No users found</p>
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

describe('UserList Component', () => {
  test('renders list of users', () => {
    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ]

    const html = renderToString(<UserList users={users} />)

    expect(html).toContain('Alice')
    expect(html).toContain('Bob')
    expect(html).toContain('Charlie')
    expect(html).toContain('<ul')
    expect(html).toContain('</ul>')
  })

  test('shows empty state when no users', () => {
    const html = renderToString(<UserList users={[]} />)

    expect(html).toContain('No users found')
    expect(html).not.toContain('<ul')
  })
})
```

## Testing with Tailwind CSS Classes

```typescript
import { test, expect, describe } from 'bun:test'
import { renderToString } from 'react-dom/server'
import { cn } from '@/lib/utils'

interface CardProps {
  title: string
  description: string
  variant?: 'default' | 'highlighted'
}

function Card({ title, description, variant = 'default' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-6',
        variant === 'default' ? 'bg-white' : 'bg-blue-50 border-blue-200'
      )}
    >
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

describe('Card Component', () => {
  test('renders with default variant styling', () => {
    const html = renderToString(<Card title="Title" description="Description" />)

    expect(html).toContain('bg-white')
    expect(html).toContain('rounded-lg')
    expect(html).toContain('Title')
    expect(html).toContain('Description')
  })

  test('renders with highlighted variant styling', () => {
    const html = renderToString(<Card title="Title" description="Description" variant="highlighted" />)

    expect(html).toContain('bg-blue-50')
    expect(html).toContain('border-blue-200')
  })
})
```

## Testing Nested Components

```typescript
import { test, expect, describe } from 'bun:test'
import { renderToString } from 'react-dom/server'

function Avatar({ name, imageUrl }: { name: string; imageUrl?: string }) {
  if (imageUrl) {
    return <img src={imageUrl} alt={name} className="rounded-full" />
  }
  return <div className="avatar-placeholder">{name.charAt(0)}</div>
}

function UserProfile({ user }: { user: { name: string; bio: string; imageUrl?: string } }) {
  return (
    <div className="profile">
      <Avatar name={user.name} imageUrl={user.imageUrl} />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
    </div>
  )
}

describe('UserProfile Component', () => {
  test('renders with user avatar image', () => {
    const user = {
      name: 'Alice',
      bio: 'Software Engineer',
      imageUrl: '/avatars/alice.jpg',
    }

    const html = renderToString(<UserProfile user={user} />)

    expect(html).toContain('rounded-full')
    expect(html).toContain('/avatars/alice.jpg')
    expect(html).toContain('Alice')
    expect(html).toContain('Software Engineer')
  })

  test('renders with avatar placeholder when no image', () => {
    const user = {
      name: 'Bob',
      bio: 'Designer',
    }

    const html = renderToString(<UserProfile user={user} />)

    expect(html).toContain('avatar-placeholder')
    expect(html).toContain('B') // First letter of name
    expect(html).not.toContain('<img')
  })
})
```

## Testing Component Composition

```typescript
import { test, expect, describe } from 'bun:test'
import { renderToString } from 'react-dom/server'

function Layout({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="layout">
      <header>
        <h1>{title}</h1>
      </header>
      <main>{children}</main>
      <footer>© 2025 Omnera</footer>
    </div>
  )
}

function HomePage() {
  return (
    <Layout title="Home">
      <p>Welcome to Omnera</p>
    </Layout>
  )
}

describe('Layout Component', () => {
  test('renders layout with title and children', () => {
    const html = renderToString(<HomePage />)

    expect(html).toContain('<header')
    expect(html).toContain('Home')
    expect(html).toContain('Welcome to Omnera')
    expect(html).toContain('<footer')
    expect(html).toContain('© 2025 Omnera')
  })
})
```

## Testing with TypeScript Props

```typescript
import { test, expect, describe } from 'bun:test'
import { renderToString } from 'react-dom/server'

interface Product {
  id: number
  name: string
  price: number
  inStock: boolean
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: number) => void
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      {product.inStock ? (
        <button onClick={() => onAddToCart?.(product.id)}>Add to Cart</button>
      ) : (
        <span className="out-of-stock">Out of Stock</span>
      )}
    </div>
  )
}

describe('ProductCard Component', () => {
  test('renders product information correctly', () => {
    const product: Product = {
      id: 1,
      name: 'Laptop',
      price: 999,
      inStock: true,
    }

    const html = renderToString(<ProductCard product={product} />)

    expect(html).toContain('Laptop')
    expect(html).toContain('$999')
    expect(html).toContain('Add to Cart')
  })

  test('shows out of stock message when not in stock', () => {
    const product: Product = {
      id: 2,
      name: 'Mouse',
      price: 29,
      inStock: false,
    }

    const html = renderToString(<ProductCard product={product} />)

    expect(html).toContain('Mouse')
    expect(html).toContain('$29')
    expect(html).toContain('Out of Stock')
    expect(html).not.toContain('Add to Cart')
  })
})
```

## Test Organization Best Practices

### Co-locating Tests with Components

```
src/
├── components/
│   ├── Button.tsx
│   ├── Button.test.tsx      # Co-located with component
│   ├── Card.tsx
│   └── Card.test.tsx         # Co-located with component
└── lib/
    ├── utils.ts
    └── utils.test.ts         # Co-located with utility
```

### Grouping Related Tests

```typescript
import { test, expect, describe, beforeEach } from 'bun:test'
import { renderToString } from 'react-dom/server'

describe('Form Components', () => {
  describe('Input', () => {
    test('renders text input', () => {
      // Test implementation
    })

    test('renders with error state', () => {
      // Test implementation
    })
  })

  describe('Select', () => {
    test('renders options', () => {
      // Test implementation
    })

    test('renders with default value', () => {
      // Test implementation
    })
  })
})
```

## Limitations of Server-Side Testing

**What Server-Side Tests CAN'T Test:**

- Client-side interactivity (button clicks, form submissions)
- Browser events (mouse, keyboard, scroll)
- Client-side state changes (useState, useEffect)
- DOM manipulation after initial render
- Client-side routing
- Browser APIs (localStorage, fetch in browser)

**What Server-Side Tests CAN Test:**

- Component rendering output
- Conditional rendering logic
- Props handling
- Component composition
- SSR output (what users see on initial page load)
- Tailwind CSS class application
- TypeScript type safety

**For Client-Side Testing:**

Use Playwright for end-to-end tests that require browser interactivity. See [Playwright E2E Testing](../../testing/playwright.md).

## Best Practices

1. **Test Rendering Output**: Verify what users see, not implementation details
2. **Use Descriptive Test Names**: Clearly state what is being tested
3. **Test Edge Cases**: Empty states, missing props, boundary conditions
4. **Keep Tests Simple**: One assertion per test when possible
5. **Co-locate Tests**: Place `.test.tsx` files next to components
6. **Test Props Variations**: Cover different prop combinations
7. **Test Conditional Logic**: Verify all rendering branches
8. **Use TypeScript**: Leverage type safety in tests
9. **Test Accessibility**: Verify semantic HTML and proper attributes
10. **Don't Test Implementation**: Focus on output, not how it's achieved

## Common Pitfalls

- ❌ **Testing internal state**: Test output, not component internals
- ❌ **Testing React itself**: Don't test that React works
- ❌ **Overly specific assertions**: Test meaningful content, not exact HTML
- ❌ **Not testing edge cases**: Always test empty states and error conditions
- ❌ **Testing styling details**: Test class presence, not exact CSS values
- ❌ **Coupling tests to structure**: Test user-facing content, not DOM structure
- ❌ **Not using TypeScript**: Lose type safety benefits in tests

## When to Use Unit Tests vs E2E Tests

| Aspect                 | Unit Tests (Bun Test)          | E2E Tests (Playwright)               |
| ---------------------- | ------------------------------ | ------------------------------------ |
| **Purpose**            | Test component rendering       | Test complete user workflows         |
| **Speed**              | Very fast (milliseconds)       | Slower (seconds)                     |
| **Browser Required**   | No (SSR testing)               | Yes (real browser)                   |
| **What to Test**       | Component output, props, logic | User interactions, full app behavior |
| **When to Run**        | Every change (watch mode)      | Before commits, in CI/CD             |
| **Feedback Loop**      | Immediate                      | Slower                               |
| **Coverage**           | Component-level                | Application-level                    |
| **Test File Location** | `*.test.tsx` (co-located)      | `tests/**/*.spec.ts`                 |
| **Command**            | `bun test`                     | `bun test:e2e`                       |

## Running Tests

```bash
# Run all unit tests (includes React component tests)
bun test

# Run tests in watch mode (auto-rerun on changes)
bun test --watch

# Run specific test file
bun test src/components/Button.test.tsx

# Run tests with coverage
bun test --coverage

# Run all tests (unit + E2E)
bun test:all
```

## See Also

- [React Framework Overview](./react.md)
- [React Hono Integration](./react-hono-integration.md)
- [React Styling](./react-styling.md)
- [React Effect Integration](./react-effect-integration.md)
- [React Patterns](./react-patterns.md)
- [Bun Test Documentation](../../testing/bun-test.md)
- [Playwright E2E Testing](../../testing/playwright.md)

## References

- Bun Test documentation: https://bun.sh/docs/cli/test
- React DOM Server API: https://react.dev/reference/react-dom/server
- Testing best practices: https://react.dev/learn/testing
- Server-side rendering: https://react.dev/reference/react-dom/server/renderToString
