# shadcn/ui Component System

## Overview

**Version**: Not applicable (component collection, not a versioned package)
**Purpose**: A collection of beautifully designed, accessible, and customizable React components built with Tailwind CSS that are copied directly into your project

## What is shadcn/ui?

shadcn/ui is NOT a traditional component library installed via npm. Instead, it's a **component collection** that provides pre-built, production-ready components that you **copy and paste** into your project. This unique approach gives you full ownership and control over the component code.

### Key Differentiators

- **Copy-Paste Philosophy**: Components are copied into your codebase, not installed as dependencies
- **Full Ownership**: You own the component code and can modify it however you need
- **No Vendor Lock-In**: No dependency on a versioned package that might break or become outdated
- **Tailwind-First**: Built exclusively with Tailwind CSS utility classes
- **Radix UI Foundation**: Uses Radix UI primitives for accessibility and behavior (when needed)
- **TypeScript Native**: Full TypeScript support with proper type definitions

## Why shadcn/ui?

### Traditional Component Libraries (Material UI, Ant Design, Chakra UI)

```typescript
// Traditional approach - component library as dependency
import { Button } from '@material-ui/core'

// Problems:
// ❌ Large bundle size (entire library included)
// ❌ Theming requires learning library-specific APIs
// ❌ Limited customization without ejecting
// ❌ Version updates can break your UI
// ❌ Stuck with library's design decisions
```

### shadcn/ui Approach

```typescript
// shadcn/ui approach - component copied into your project
import { Button } from '@/components/ui/button'

// Benefits:
// ✅ Only the code you use is in your bundle
// ✅ Customize directly in the component file
// ✅ No breaking changes from library updates
// ✅ Full control over styling and behavior
// ✅ Easy to understand and modify
```

## Core Philosophy

1. **Components are yours**: Once copied, they belong to your project
2. **Modify freely**: Change anything - structure, styles, behavior
3. **No abstraction overhead**: See exactly what's happening in the code
4. **Composability first**: Build complex UIs by composing simple components
5. **Accessibility built-in**: Radix UI primitives ensure WCAG compliance

## Integration with Sovrium Stack

### Tailwind CSS (4.1.14)

shadcn/ui components are built with Tailwind CSS utility classes:

```typescript
// Component uses Tailwind utilities directly
<button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
  Click me
</button>
```

**Perfect fit**: Sovrium uses Tailwind CSS, so shadcn/ui components integrate seamlessly.

### React (19.2.0)

All shadcn/ui components are React components using modern patterns:

```typescript
import type { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
}

export function Button({ variant = 'default', className, ...props }: ButtonProps) {
  return <button className={cn(variantStyles[variant], className)} {...props} />
}
```

**Perfect fit**: Sovrium uses React 19, providing all modern React features for components.

### TypeScript (^5)

Components have full TypeScript support with proper types:

```typescript
// Type-safe component usage
import type { TypographyH1Props } from '@/components/ui/Typography'

const MyHeading: TypographyH1Props = {
  children: 'Hello',
  className: 'custom-class',
}
```

**Perfect fit**: Sovrium uses strict TypeScript, ensuring type safety across all components.

## Key Dependencies

### 1. class-variance-authority (CVA) v0.7.1

**Purpose**: Create variant-based component APIs with type safety

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

// Define variants with CVA
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium', // base styles
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// Type-safe variant props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
```

**Why it matters**: CVA provides a clean, type-safe way to define component variants without complex conditional logic.

### 2. clsx v2.1.1

**Purpose**: Construct className strings conditionally

```typescript
import clsx from 'clsx'

// Conditional classes
const className = clsx({
  'bg-primary': isPrimary,
  'bg-secondary': !isPrimary,
  'text-white': true,
  'opacity-50': isDisabled,
})

// Array syntax
const className2 = clsx(['base-class', isActive && 'active-class', 'another-class'])

// Mixed arguments
const className3 = clsx('base', { active: isActive }, ['extra', 'classes'])
```

**Why it matters**: Makes it easy to apply classes conditionally without messy template literals.

### 3. tailwind-merge v3.3.1

**Purpose**: Merge Tailwind CSS classes without conflicts

```typescript
import { twMerge } from 'tailwind-merge'

// Problem: Conflicting classes
const bad = 'px-4 px-8' // Which padding applies? Undefined behavior.

// Solution: tailwind-merge resolves conflicts
const good = twMerge('px-4', 'px-8') // Result: 'px-8' (later value wins)

// Real-world usage
const merged = twMerge('bg-red-500 px-4', className) // User className overrides defaults
```

**Why it matters**: Allows users to override component classes without conflicts.

### 4. lucide-react v0.545.0

**Purpose**: Icon library with 1000+ consistent, beautiful icons

```typescript
import { Check, X, ChevronDown, Search, User } from 'lucide-react'

// Usage in components
<Check className="h-4 w-4" />
<X className="h-4 w-4 text-destructive" />
<ChevronDown className="h-5 w-5 opacity-50" />
```

**Why it matters**: Provides a comprehensive icon set that matches shadcn/ui's design system.

### 5. tw-animate-css v1.4.0

**Purpose**: Animation utilities for Tailwind CSS

```typescript
// Use animation utilities in components
<div className="animate-fade-in">Content fades in</div>
<div className="animate-slide-up">Content slides up</div>
<div className="animate-spin">Loading spinner</div>
```

**Why it matters**: Adds smooth animations to components for better UX.

## The `cn` Utility Function

The `cn` (className) utility combines `clsx` and `tailwind-merge` for optimal className handling:

**Location**: `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Usage in components**:

```typescript
import { cn } from '@/lib/utils'

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-md bg-primary px-4 py-2', // base styles
        className // user-provided classes override base
      )}
      {...props}
    />
  )
}
```

**Why it's critical**:

1. **Conditional classes**: Handles complex className logic cleanly
2. **Conflict resolution**: Prevents Tailwind class conflicts
3. **Override support**: Allows users to override default styles
4. **Type safety**: Accepts multiple input types (strings, objects, arrays)

**Example of conflict resolution**:

```typescript
// Without tailwind-merge (broken)
cn('px-4 py-2', 'px-8') // Result: 'px-4 py-2 px-8' ❌ Both px-4 and px-8 apply

// With tailwind-merge (correct)
cn('px-4 py-2', 'px-8') // Result: 'py-2 px-8' ✅ Only px-8 applies
```

## Component Structure and Conventions

### Directory Structure

```
src/
├── components/
│   └── ui/                    # shadcn/ui components live here
│       ├── Typography.tsx     # Typography components
│       ├── button.tsx         # Button component (when added)
│       ├── input.tsx          # Input component (when added)
│       └── card.tsx           # Card component (when added)
└── lib/
    └── utils.ts               # cn utility and other helpers
```

### Naming Conventions

- **File names**: kebab-case (e.g., `button.tsx`, `dropdown-menu.tsx`)
- **Component names**: PascalCase (e.g., `Button`, `DropdownMenu`)
- **Props interfaces**: `{ComponentName}Props` (e.g., `ButtonProps`)

### Component Anatomy

```typescript
// 1. Imports
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

// 2. Props interface (extends native HTML props)
export interface TypographyH1Props extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  // Add component-specific props here
}

// 3. Component implementation
export function TypographyH1({ children, className, ...props }: TypographyH1Props) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl', // base styles
        className // user overrides
      )}
      {...props} // spread remaining HTML attributes
    >
      {children}
    </h1>
  )
}
```

### Key Patterns

1. **Extend native HTML props**: Components extend appropriate HTML element props
2. **Use `cn` for className merging**: Always merge base styles with user className
3. **Spread remaining props**: Use `{...props}` to pass through HTML attributes
4. **TypeScript interfaces**: Export props interfaces for type safety
5. **Composition over configuration**: Prefer composing simple components over complex config

## Typography Component Example

The Typography component demonstrates shadcn/ui patterns:

**Location**: `src/components/ui/Typography.tsx`

```typescript
// Individual component exports
export function TypographyH1({ children, className, ...props }: TypographyH1Props) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance lg:text-5xl',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

// Namespace export for convenience
export const Typography = {
  H1: TypographyH1,
  H2: TypographyH2,
  H3: TypographyH3,
  H4: TypographyH4,
  P: TypographyP,
  Blockquote: TypographyBlockquote,
  List: TypographyList,
  InlineCode: TypographyInlineCode,
  Lead: TypographyLead,
  Large: TypographyLarge,
  Small: TypographySmall,
  Muted: TypographyMuted,
}
```

**Usage**:

```typescript
import { TypographyH1, TypographyP } from '@/components/ui/Typography'
// OR
import { Typography } from '@/components/ui/Typography'

// Individual exports
<TypographyH1>Page Title</TypographyH1>
<TypographyP>Paragraph text</TypographyP>

// Namespace export
<Typography.H1>Page Title</Typography.H1>
<Typography.P>Paragraph text</Typography.P>

// With custom className (overrides base styles)
<Typography.H1 className="text-red-500">Red Title</Typography.H1>

// With native HTML attributes
<Typography.P id="intro" role="article">Introduction</Typography.P>
```

## Adding New shadcn/ui Components

### Official shadcn/ui CLI (Not Yet Available for Copy-Paste)

The official CLI isn't used in this project because components are manually integrated. Once shadcn/ui provides a CLI compatible with Bun, you can use:

```bash
# Future: Once CLI is available
bunx shadcn@latest add button
bunx shadcn@latest add input
bunx shadcn@latest add card
```

### Manual Installation (Current Approach)

1. **Browse components**: Visit https://ui.shadcn.com/docs/components
2. **Copy component code**: Copy the component code from the documentation
3. **Create component file**: Create file in `src/components/ui/{component-name}.tsx`
4. **Install dependencies**: Add any required dependencies (most are already installed)
5. **Import and use**: Import component in your application

**Example: Adding a Button component**

```typescript
// src/components/ui/button.tsx
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function Button({
  variant = 'default',
  size = 'default',
  className,
  ...props
}: ButtonProps) {
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  }

  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}
```

**Usage**:

```typescript
import { Button } from '@/components/ui/button'

<Button>Default Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost" size="sm">Small Ghost Button</Button>
<Button className="w-full">Full Width Button</Button>
```

## Customization Approach

### Global Customization (Tailwind Theme)

Customize the entire design system via Tailwind CSS configuration:

```css
/* app.css or global.css */
@theme {
  --color-primary: #3b82f6;
  --color-primary-foreground: #ffffff;
  --color-secondary: #64748b;
  --color-secondary-foreground: #ffffff;
  --color-destructive: #ef4444;
  --color-destructive-foreground: #ffffff;
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --color-accent: #f1f5f9;
  --color-accent-foreground: #0f172a;
  --color-border: #e2e8f0;
  --color-input: #e2e8f0;
}
```

**Effect**: All components using `bg-primary`, `text-muted-foreground`, etc. update automatically.

### Component-Level Customization

Modify components directly in your project:

```typescript
// src/components/ui/button.tsx
export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-md px-4 py-2', // Change: rounded-md → rounded-lg for more rounding
        'bg-primary text-primary-foreground',
        'hover:bg-primary/90',
        'focus-visible:outline-none focus-visible:ring-2', // Add focus ring
        className
      )}
      {...props}
    />
  )
}
```

### Instance-Level Customization

Override styles for specific instances:

```typescript
<Button className="bg-red-500 hover:bg-red-600">Danger Button</Button>
<Button className="rounded-full">Pill Button</Button>
<Button className="shadow-lg">Button with Shadow</Button>
```

## Using CVA for Variant Management

For components with multiple variants, use CVA instead of manual conditional logic:

```typescript
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors', // base
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
```

**Benefits**:

- Type-safe variants (TypeScript autocomplete)
- Cleaner code (no manual conditional logic)
- Default variants support
- Compound variants (advanced use cases)

## Accessibility Considerations

shadcn/ui components are built with accessibility in mind:

1. **Semantic HTML**: Use appropriate HTML elements (button, input, etc.)
2. **ARIA attributes**: Proper ARIA roles, labels, and states
3. **Keyboard navigation**: Full keyboard support (Tab, Enter, Escape, Arrow keys)
4. **Focus management**: Visible focus indicators, focus trapping (modals)
5. **Screen reader support**: Proper labeling and announcements
6. **Color contrast**: WCAG AA/AAA compliant color combinations

**Example: Accessible Button**

```typescript
<Button
  type="button"
  aria-label="Close dialog"
  onClick={handleClose}
>
  <X className="h-4 w-4" />
</Button>
```

## Integration with Effect

shadcn/ui components work seamlessly with Effect for state management and error handling:

```typescript
import { Effect } from 'effect'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

function SubmitForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = () => {
    setIsLoading(true)

    const program = Effect.gen(function* () {
      const result = yield* submitFormEffect()
      console.log('Form submitted:', result)
      setIsLoading(false)
    })

    Effect.runPromise(program)
  }

  return (
    <Button onClick={handleSubmit} disabled={isLoading}>
      {isLoading ? 'Submitting...' : 'Submit'}
    </Button>
  )
}
```

## Best Practices

1. **Start with shadcn/ui components**: Use existing components before building custom ones
2. **Customize thoughtfully**: Modify components only when necessary
3. **Maintain consistency**: Keep component API similar to shadcn/ui patterns
4. **Use the `cn` utility**: Always merge classNames with `cn()`
5. **Leverage Tailwind theme**: Use theme variables instead of hardcoded colors
6. **Extend native props**: Always extend appropriate HTML element props
7. **Document customizations**: Comment why you modified shadcn/ui components
8. **Test accessibility**: Verify keyboard navigation and screen reader support
9. **Keep dependencies updated**: Update CVA, clsx, tailwind-merge, lucide-react regularly
10. **Follow TypeScript patterns**: Export props interfaces, use type-safe variants

## Common Pitfalls to Avoid

- ❌ **Installing shadcn/ui as npm package**: It's not a package, copy components instead
- ❌ **Not using `cn` utility**: Causes className conflicts and broken overrides
- ❌ **Hardcoding colors**: Use Tailwind theme variables for consistency
- ❌ **Ignoring accessibility**: Always test keyboard navigation and screen readers
- ❌ **Over-abstracting**: Keep components simple and composable
- ❌ **Not spreading `...props`**: Users can't pass HTML attributes
- ❌ **Skipping TypeScript types**: Lose type safety and autocomplete
- ❌ **Breaking native HTML API**: Maintain compatibility with native elements

## shadcn/ui vs Traditional Component Libraries

| Aspect                   | shadcn/ui                      | Material UI / Chakra UI             |
| ------------------------ | ------------------------------ | ----------------------------------- |
| **Installation**         | Copy-paste components          | npm install package                 |
| **Bundle Size**          | Only components you use        | Entire library included             |
| **Customization**        | Modify component code directly | Theme config or CSS-in-JS           |
| **Updates**              | Manual (copy new version)      | npm update (may break)              |
| **Ownership**            | You own the code               | Library owns the code               |
| **Flexibility**          | Full control over everything   | Limited to library's API            |
| **Learning Curve**       | Understand component code      | Learn library's theming system      |
| **Version Lock**         | No version constraints         | Tied to library version             |
| **Tailwind Integration** | Native (built with Tailwind)   | Add-on or separate styling          |
| **Dependencies**         | Minimal (CVA, clsx, twMerge)   | Large (styling engine, theme, etc.) |

## When to Use shadcn/ui

✅ **Use shadcn/ui when:**

- You want full control over component code
- You're already using Tailwind CSS
- You prefer composition over configuration
- You want minimal dependencies
- You need to customize components extensively
- You want to avoid version lock-in

❌ **Consider alternatives when:**

- You need a comprehensive ecosystem (forms, data tables, charts)
- You prefer stable, versioned dependencies
- You want automatic updates with minimal changes
- You need design tokens/theming without Tailwind
- Your team isn't familiar with Tailwind CSS

## Resources

- **Official Documentation**: https://ui.shadcn.com/
- **Component Examples**: https://ui.shadcn.com/docs/components
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Radix UI Primitives**: https://www.radix-ui.com/
- **CVA Documentation**: https://cva.style/docs
- **lucide-react Icons**: https://lucide.dev/

## Migration Guide

### From Material UI to shadcn/ui

```typescript
// Material UI
import { Button } from '@mui/material'
<Button variant="contained" color="primary">Click</Button>

// shadcn/ui
import { Button } from '@/components/ui/button'
<Button variant="default">Click</Button>
```

### From Chakra UI to shadcn/ui

```typescript
// Chakra UI
import { Button } from '@chakra-ui/react'
<Button colorScheme="blue" size="lg">Click</Button>

// shadcn/ui
import { Button } from '@/components/ui/button'
<Button variant="default" size="lg">Click</Button>
```

### Key Differences

1. **No theme provider**: Use Tailwind CSS theme instead
2. **No prop-based styling**: Use `className` for custom styles
3. **Explicit imports**: Import each component individually
4. **Variant names differ**: Check shadcn/ui docs for variant mappings

## Future Enhancements

As the project grows, consider adding these shadcn/ui components:

- **Form components**: Input, Select, Checkbox, Radio, Switch, Textarea
- **Feedback**: Alert, Toast, Progress, Skeleton
- **Overlay**: Dialog, Popover, Tooltip, Sheet
- **Navigation**: Dropdown Menu, Navigation Menu, Tabs
- **Data Display**: Table, Card, Badge, Avatar
- **Layout**: Separator, Scroll Area, Aspect Ratio

Each component follows the same patterns demonstrated in the Typography component, ensuring consistency across your UI.
