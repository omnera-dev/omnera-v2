# React Styling with Tailwind CSS

> Part of [React Documentation](./react.md)

## Overview

This document covers how to style React components using Tailwind CSS. React and Tailwind work perfectly together, allowing you to build beautiful, responsive UIs using utility-first CSS classes directly in your JSX.

## Why Tailwind CSS with React

- **No Context Switching**: Style components directly in JSX without separate CSS files
- **Utility-First Approach**: Build complex designs from pre-built utility classes
- **Responsive Design**: Mobile-first responsive classes (`md:`, `lg:`, etc.)
- **Component Scoping**: Styles are scoped to components naturally
- **Type Safety**: Excellent IDE autocomplete and IntelliSense support
- **Consistency**: Built-in design system (spacing, colors, typography)
- **Performance**: Only used utilities are included in production bundle

## Basic Component Styling

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
```

### Usage

```tsx
<Button variant="primary" size="lg">
  Click Me
</Button>

<Button variant="secondary" onClick={() => console.log('Cancel')}>
  Cancel
</Button>

<Button variant="danger" disabled>
  Disabled
</Button>
```

## Card Component Example

```tsx
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

// Usage in a grid
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

## Conditional Classes with cn Utility

For complex conditional styling, use the `cn` utility (combining `clsx` and `tailwind-merge`):

```tsx
// utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes))
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

### Why Use cn?

- **Conflict Resolution**: Handles Tailwind class conflicts (later value wins)
- **Conditional Logic**: Clean conditional class application
- **Type Safety**: Accepts multiple input types (strings, objects, arrays)
- **Override Support**: User-provided classes override base styles

**Example:**

```tsx
// Without tailwind-merge (broken)
className = 'px-4 py-2 px-8' // ❌ Both px-4 and px-8 apply

// With cn and tailwind-merge (correct)
cn('px-4 py-2', 'px-8') // ✅ Only px-8 applies (Result: 'py-2 px-8')
```

## Responsive Design

Tailwind uses mobile-first breakpoints:

```tsx
function ResponsiveComponent() {
  return (
    <div className="p-4 md:p-8 lg:p-12">
      {/* Responsive grid: 1 column mobile, 2 tablet, 3 desktop */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gray-100 p-4">Item 1</div>
        <div className="bg-gray-100 p-4">Item 2</div>
        <div className="bg-gray-100 p-4">Item 3</div>
      </div>

      {/* Responsive text sizes */}
      <h1 className="text-2xl md:text-4xl lg:text-6xl">Responsive Heading</h1>

      {/* Hide/show based on screen size */}
      <div className="hidden md:block">Visible on tablet and desktop</div>
      <div className="block md:hidden">Visible only on mobile</div>
    </div>
  )
}
```

### Breakpoint Reference

| Prefix | Min Width | Description         |
| ------ | --------- | ------------------- |
| `sm:`  | 640px     | Small tablets       |
| `md:`  | 768px     | Tablets             |
| `lg:`  | 1024px    | Laptops/desktops    |
| `xl:`  | 1280px    | Large desktops      |
| `2xl:` | 1536px    | Extra large screens |

## State Variants

Tailwind provides utility classes for different interactive states:

```tsx
function InteractiveComponents() {
  return (
    <div className="space-y-4">
      {/* Hover states */}
      <button className="bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Hover me</button>

      {/* Focus states */}
      <input
        className="border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        type="text"
        placeholder="Focus on me"
      />

      {/* Active states */}
      <button className="bg-blue-500 px-4 py-2 text-white active:bg-blue-700">Press me</button>

      {/* Disabled states */}
      <button
        className="bg-blue-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        disabled
      >
        Disabled
      </button>

      {/* Group hover (parent hover affects children) */}
      <div className="group p-4 hover:bg-gray-100">
        <h3 className="text-gray-900 group-hover:text-blue-600">Hover parent to change my color</h3>
      </div>

      {/* Peer states (sibling state affects element) */}
      <div>
        <input
          className="peer"
          type="checkbox"
          id="terms"
        />
        <label
          htmlFor="terms"
          className="peer-checked:text-blue-600"
        >
          I accept the terms
        </label>
      </div>
    </div>
  )
}
```

## Dark Mode

Tailwind supports dark mode with class-based strategy:

```tsx
function DarkModeComponent() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <h1 className="text-gray-900 dark:text-white">Dark Mode Heading</h1>
      <p className="text-gray-600 dark:text-gray-300">Dark mode paragraph</p>
      <button className="bg-blue-500 text-white dark:bg-blue-700">Button</button>
    </div>
  )
}
```

Enable dark mode by adding `dark` class to root element:

```html
<html class="dark">
  <!-- Content will use dark: variants -->
</html>
```

Or toggle with JavaScript:

```typescript
// Toggle dark mode
document.documentElement.classList.toggle('dark')

// Enable dark mode
document.documentElement.classList.add('dark')

// Disable dark mode
document.documentElement.classList.remove('dark')
```

## Layout Patterns

### Flexbox Layouts

```tsx
// Horizontal flex container
<div className="flex items-center justify-between gap-4">
  <div>Left</div>
  <div>Center</div>
  <div>Right</div>
</div>

// Vertical flex container
<div className="flex flex-col space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// Responsive flex direction
<div className="flex flex-col gap-4 md:flex-row">
  <div className="flex-1">Column on mobile, row on tablet+</div>
  <div className="flex-1">Auto-width columns</div>
</div>
```

### Grid Layouts

```tsx
// Basic grid
<div className="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

// Responsive grid
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
  <div>Card 4</div>
</div>

// Auto-fit grid (responsive without breakpoints)
<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
  <div>Auto-sizing card</div>
  <div>Auto-sizing card</div>
  <div>Auto-sizing card</div>
</div>
```

### Centered Container

```tsx
<div className="container mx-auto px-4">
  {/* Content centered with max-width and horizontal padding */}
</div>
```

## Component Styling Patterns

### Navigation Bar

```tsx
function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="text-xl font-bold text-gray-900"
          >
            Omnera
          </a>

          {/* Navigation Links */}
          <div className="hidden space-x-8 md:flex">
            <a
              href="/features"
              className="text-gray-600 hover:text-gray-900"
            >
              Features
            </a>
            <a
              href="/pricing"
              className="text-gray-600 hover:text-gray-900"
            >
              Pricing
            </a>
            <a
              href="/docs"
              className="text-gray-600 hover:text-gray-900"
            >
              Docs
            </a>
          </div>

          {/* CTA Button */}
          <a
            href="/signup"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Sign Up
          </a>
        </div>
      </div>
    </nav>
  )
}
```

### Modal/Dialog

```tsx
function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null

  return (
    // Modal Overlay
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  )
}
```

### Alert/Notification

```tsx
function Alert({
  type = 'success',
  message,
}: {
  type?: 'success' | 'error' | 'warning'
  message: string
}) {
  const styles = {
    success: 'border-l-4 border-green-500 bg-green-50 text-green-700',
    error: 'border-l-4 border-red-500 bg-red-50 text-red-700',
    warning: 'border-l-4 border-yellow-500 bg-yellow-50 text-yellow-700',
  }

  const icons = {
    success: (
      <svg
        className="h-5 w-5 text-green-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg
        className="h-5 w-5 text-red-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg
        className="h-5 w-5 text-yellow-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  }

  return (
    <div className={cn('mb-4 p-4', styles[type])}>
      <div className="flex">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="ml-3">
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  )
}
```

## Best Practices

1. **Use Utility Classes Directly**: Build designs in JSX without custom CSS files
2. **Extract Reusable Components**: Create functions for repeated patterns
3. **Leverage cn Utility**: Always use `cn()` for conditional classes and overrides
4. **Mobile-First Responsive**: Start with mobile layout, add breakpoints upward
5. **Consistent Spacing**: Use default spacing scale (4, 8, 12, 16, etc.)
6. **Group Related Classes**: Order classes logically (layout, spacing, colors, etc.)
7. **Use Tailwind Theme**: Reference theme variables instead of hardcoded values
8. **Test Across Breakpoints**: Verify responsive design at all screen sizes

## Common Pitfalls

- ❌ **Writing custom CSS** when utilities exist (use utilities first)
- ❌ **Not using responsive variants** (mobile-first approach)
- ❌ **Ignoring dark mode support** (plan for it early)
- ❌ **Hardcoding colors** (use theme variables)
- ❌ **Not using cn utility** (causes className conflicts)
- ❌ **Forgetting group/peer variants** (useful for interactive states)
- ❌ **Using inline styles** instead of utilities (defeats purpose of Tailwind)

## Integration with shadcn/ui

shadcn/ui components are built with Tailwind CSS and follow the same patterns:

```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

<Button variant="default" size="lg">
  shadcn/ui Button
</Button>

<Card className="custom-class">
  Custom styling on shadcn/ui component
</Card>
```

## See Also

- [React Framework Overview](./react.md)
- [React Hono Integration](./react-hono-integration.md)
- [React Effect Integration](./react-effect-integration.md)
- [React Patterns](./react-patterns.md)
- [React Testing](./react-testing.md)
- [Tailwind CSS Documentation](./tailwind.md)
- [shadcn/ui Documentation](./shadcn.md)

## References

- Tailwind CSS documentation: https://tailwindcss.com/docs
- Tailwind CSS with React: https://tailwindcss.com/docs/guides/create-react-app
- Utility-First Fundamentals: https://tailwindcss.com/docs/utility-first
- Responsive Design: https://tailwindcss.com/docs/responsive-design
