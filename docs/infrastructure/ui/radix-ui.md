# Radix UI Primitives

## Overview

**Version**: ^1.x (various packages)
**Purpose**: Unstyled, accessible UI component primitives for building high-quality design systems
**Role**: Foundation layer for shadcn/ui components
**Scope**: Client-side only (Presentation layer)

## Why Radix UI for Omnera

- **Accessibility First**: WAI-ARIA compliant, keyboard navigation, focus management built-in
- **Unstyled**: Provides behavior/accessibility without styling constraints
- **shadcn/ui Foundation**: All shadcn/ui components are built on Radix primitives
- **Composability**: Primitives can be combined to create custom components
- **React 19 Compatible**: Works seamlessly with latest React features
- **TypeScript**: Full TypeScript support with excellent type definitions

## Relationship with shadcn/ui

```
┌─────────────────────────────────────┐
│ Your Application Code               │
│ (imports from @/components/ui/*)    │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ shadcn/ui Components                │
│ (styled wrappers in src/components) │
│ - Button, Dialog, Select, etc.     │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ Radix UI Primitives                 │
│ (@radix-ui/react-*)                 │
│ - Accessibility, behavior, a11y     │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ Tailwind CSS                        │
│ (styling layer)                     │
└─────────────────────────────────────┘
```

## Installed Radix Primitives

Omnera includes 21 Radix UI primitive packages:

| Primitive               | Usage in shadcn/ui | Purpose                             |
| ----------------------- | ------------------ | ----------------------------------- |
| `react-accordion`       | Accordion          | Collapsible content sections        |
| `react-alert-dialog`    | Alert Dialog       | Modal dialogs requiring user action |
| `react-aspect-ratio`    | Aspect Ratio       | Maintain aspect ratio containers    |
| `react-avatar`          | Avatar             | User profile images with fallback   |
| `react-checkbox`        | Checkbox           | Accessible checkbox inputs          |
| `react-collapsible`     | Collapsible        | Show/hide content                   |
| `react-context-menu`    | Context Menu       | Right-click menus                   |
| `react-dialog`          | Dialog             | Modal dialogs                       |
| `react-dropdown-menu`   | Dropdown Menu      | Dropdown action menus               |
| `react-hover-card`      | Hover Card         | Popover on hover                    |
| `react-label`           | Label              | Accessible form labels              |
| `react-menubar`         | Menubar            | Application menu bar                |
| `react-navigation-menu` | Navigation Menu    | Complex navigation                  |
| `react-popover`         | Popover            | Floating content                    |
| `react-progress`        | Progress           | Progress indicators                 |
| `react-radio-group`     | Radio Group        | Radio button groups                 |
| `react-scroll-area`     | Scroll Area        | Custom scrollbars                   |
| `react-select`          | Select             | Dropdown selects                    |
| `react-separator`       | Separator          | Visual dividers                     |
| `react-slider`          | Slider             | Range sliders                       |
| `react-switch`          | Switch             | Toggle switches                     |
| `react-tabs`            | Tabs               | Tabbed interfaces                   |
| `react-toast`           | Sonner (Toast)     | Notifications                       |
| `react-toggle`          | Toggle             | Toggle buttons                      |
| `react-toggle-group`    | Toggle Group       | Grouped toggles                     |
| `react-tooltip`         | Tooltip            | Hover tooltips                      |

## When to Use Radix Directly vs shadcn/ui

### ✅ Use shadcn/ui Components (Recommended)

```typescript
// ✅ PREFERRED: Use styled shadcn/ui components
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <p>Content here</p>
  </DialogContent>
</Dialog>
```

**Why?** shadcn/ui components are pre-styled, consistent, and follow Omnera's design system.

### ⚠️ Use Radix Directly (Rare Cases Only)

```typescript
// ⚠️ RARE: Use Radix directly for custom behavior
import * as Dialog from '@radix-ui/react-dialog'

<Dialog.Root>
  <Dialog.Trigger>
    <button className="custom-button">Custom Button</button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="custom-overlay" />
    <Dialog.Content className="custom-content">
      <p>Fully custom styled dialog</p>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

**When?** Only when you need behavior NOT covered by shadcn/ui components, or require extreme customization.

## Key Radix Concepts

### 1. Compound Components

Radix primitives use compound component patterns:

```typescript
import * as Select from '@radix-ui/react-select'

// Each part is a separate component
<Select.Root>
  <Select.Trigger>
    <Select.Value />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content>
      <Select.Item value="1">Option 1</Select.Item>
      <Select.Item value="2">Option 2</Select.Item>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

### 2. Unstyled by Default

```typescript
// Radix provides NO styles
<Dialog.Content>  {/* No default styles */}
  <p>Content</p>
</Dialog.Content>

// You add styles via className (Tailwind)
<Dialog.Content className="fixed inset-0 bg-black/50">
  <p>Content</p>
</Dialog.Content>
```

### 3. Accessibility Built-in

Radix handles:

- ARIA attributes (`aria-expanded`, `aria-controls`, etc.)
- Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Focus management (trap focus in dialogs, restore on close)
- Screen reader announcements

Example: Dialog automatically handles:

```typescript
// Radix adds these automatically:
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  {/* Focus is trapped inside */}
  {/* Escape closes dialog */}
  {/* Background is inert */}
</div>
```

### 4. Controlled vs Uncontrolled

Radix primitives support both patterns:

```typescript
// Uncontrolled (Radix manages state)
<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>Content</Dialog.Content>
</Dialog.Root>

// Controlled (you manage state)
const [open, setOpen] = useState(false)
<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>Content</Dialog.Content>
</Dialog.Root>
```

## Common Patterns

### Asynchronous Operations in Dialogs

```typescript
function DeleteUserDialog({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteUser(userId)
    setIsDeleting(false)
    setOpen(false) // Close after success
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="destructive">Delete</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Confirm Deletion</Dialog.Title>
        <Dialog.Description>
          This action cannot be undone.
        </Dialog.Description>
        <Button onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Confirm'}
        </Button>
      </Dialog.Content>
    </Dialog.Root>
  )
}
```

### Nested Portals

```typescript
// Radix automatically handles nested portals
<Dialog.Root>
  <Dialog.Content>
    <p>Parent dialog</p>

    {/* Nested dialog works correctly */}
    <Dialog.Root>
      <Dialog.Content>
        <p>Nested dialog</p>
      </Dialog.Content>
    </Dialog.Root>
  </Dialog.Content>
</Dialog.Root>
```

### Custom Trigger Elements

```typescript
// Use asChild to pass trigger to custom element
<Dialog.Trigger asChild>
  <CustomButton>Open Dialog</CustomButton>
</Dialog.Trigger>

// Without asChild, Radix wraps in <button>
<Dialog.Trigger>Open Dialog</Dialog.Trigger>  // Renders as <button>
```

## Accessibility Features (Automatic)

### Keyboard Navigation

| Component      | Keys               | Behavior                          |
| -------------- | ------------------ | --------------------------------- |
| **Dialog**     | `Escape`           | Close dialog                      |
| **Dialog**     | `Tab`              | Focus trap (cycles within dialog) |
| **Select**     | `Arrow Up/Down`    | Navigate options                  |
| **Select**     | `Enter/Space`      | Select option                     |
| **Accordion**  | `Arrow Up/Down`    | Navigate panels                   |
| **Tabs**       | `Arrow Left/Right` | Navigate tabs                     |
| **Menubar**    | `Arrow Left/Right` | Navigate menu items               |
| **RadioGroup** | `Arrow Up/Down`    | Select radio option               |

### Screen Reader Support

```typescript
// Radix adds proper ARIA labels automatically
<Select.Root>
  <Select.Trigger aria-label="Choose an option" />
  {/* Screen reader announces: "Choose an option, button, collapsed" */}
</Select.Root>

<Dialog.Root>
  <Dialog.Title>Delete User</Dialog.Title>
  {/* Title is announced when dialog opens */}
  <Dialog.Description>This action cannot be undone.</Dialog.Description>
  {/* Description provides context */}
</Dialog.Root>
```

### Focus Management

```typescript
// Focus is automatically managed
<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  {/* 1. Focus moves to dialog content when opened */}
  <Dialog.Content>
    <input autoFocus />  {/* First focusable element */}
    {/* 2. Tab cycles within dialog */}
    <Button>Close</Button>
  </Dialog.Content>
  {/* 3. Focus returns to trigger when closed */}
</Dialog.Root>
```

## Styling with Tailwind

Radix components work seamlessly with Tailwind:

```typescript
import * as Dialog from '@radix-ui/react-dialog'

<Dialog.Root>
  <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out" />
  <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white p-6 rounded-lg shadow-lg">
    <Dialog.Title className="text-lg font-semibold">
      Dialog Title
    </Dialog.Title>
    <Dialog.Description className="text-sm text-gray-600">
      Dialog description text
    </Dialog.Description>
  </Dialog.Content>
</Dialog.Root>
```

## Data Attributes for Styling

Radix adds `data-*` attributes for conditional styling:

```typescript
// Radix adds data attributes based on state
<Dialog.Overlay />
// Renders: <div data-state="open" /> or <div data-state="closed" />

// Style based on state
<Dialog.Overlay className="data-[state=open]:opacity-100 data-[state=closed]:opacity-0" />

// Common data attributes:
// data-state: "open" | "closed"
// data-side: "top" | "bottom" | "left" | "right" (Popover, Tooltip)
// data-align: "start" | "center" | "end" (Popover, Tooltip)
// data-disabled: Present when disabled
// data-orientation: "horizontal" | "vertical" (Slider, Separator)
```

## Animation with Radix

```typescript
// Use data attributes for animations
<Dialog.Content className="
  data-[state=open]:animate-in
  data-[state=open]:fade-in-0
  data-[state=open]:zoom-in-95
  data-[state=closed]:animate-out
  data-[state=closed]:fade-out-0
  data-[state=closed]:zoom-out-95
">
  Content
</Dialog.Content>

// Or use custom CSS transitions
<Dialog.Overlay className="
  transition-opacity
  duration-200
  data-[state=open]:opacity-100
  data-[state=closed]:opacity-0
" />
```

## Common Pitfalls

### ❌ Missing Portal

```typescript
// BAD: Dialog content not in portal (won't overlay correctly)
<Dialog.Root>
  <Dialog.Content>Content</Dialog.Content>
</Dialog.Root>

// GOOD: Use Portal for overlays
<Dialog.Root>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>Content</Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### ❌ Not Using asChild

```typescript
// BAD: Double button wrapper
<Dialog.Trigger>
  <Button>Open</Button>  {/* Button inside button! */}
</Dialog.Trigger>

// GOOD: Use asChild to merge props
<Dialog.Trigger asChild>
  <Button>Open</Button>
</Dialog.Trigger>
```

### ❌ Missing Title/Description

```typescript
// BAD: No title (accessibility issue)
<Dialog.Content>
  <p>Are you sure?</p>
</Dialog.Content>

// GOOD: Always include Title and Description
<Dialog.Content>
  <Dialog.Title>Confirm Action</Dialog.Title>
  <Dialog.Description>Are you sure you want to proceed?</Dialog.Description>
</Dialog.Content>
```

## When to Create Custom Radix Components

Only create custom Radix-based components when:

1. **shadcn/ui doesn't have the component** you need
2. **Extreme customization** is required beyond shadcn/ui's flexibility
3. **Building a design system** with different styling from shadcn/ui

Example: Custom Rating Component

```typescript
// Radix doesn't have a Rating component, so build your own
import * as RadioGroup from '@radix-ui/react-radio-group'

function Rating({ value, onChange }: RatingProps) {
  return (
    <RadioGroup.Root value={value} onValueChange={onChange}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <RadioGroup.Item key={rating} value={String(rating)}>
          <Star filled={Number(value) >= rating} />
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}
```

## Best Practices

1. **Prefer shadcn/ui** over direct Radix usage (pre-styled, consistent)
2. **Use asChild** when passing custom trigger elements
3. **Always include Title/Description** in dialogs for accessibility
4. **Use Portal** for overlay components (Dialog, Popover, Tooltip)
5. **Style with data attributes** for state-based styling
6. **Test keyboard navigation** (Tab, Escape, Arrow keys)
7. **Test with screen readers** to ensure accessibility
8. **Respect controlled/uncontrolled patterns** (don't mix)

## Debugging

```typescript
// Log Radix state changes
<Dialog.Root
  onOpenChange={(open) => console.log('Dialog open:', open)}
>
  <Dialog.Content>Content</Dialog.Content>
</Dialog.Root>

// Inspect data attributes in DevTools
<Dialog.Overlay />
// Check: data-state="open" or data-state="closed"

// Verify ARIA attributes
<Dialog.Content />
// Check: role="dialog", aria-modal="true", aria-labelledby, aria-describedby
```

## Performance Considerations

- **Lazy load heavy primitives** (e.g., Dialog, Popover) with dynamic imports
- **Use Portal sparingly** (adds overhead)
- **Avoid deeply nested portals** (can impact performance)
- **Memoize custom Radix components** if they re-render frequently

## References

- Radix UI documentation: https://www.radix-ui.com/primitives/docs/overview/introduction
- shadcn/ui components: https://ui.shadcn.com/docs/components
- Radix GitHub: https://github.com/radix-ui/primitives
- Accessibility patterns: https://www.radix-ui.com/primitives/docs/overview/accessibility
