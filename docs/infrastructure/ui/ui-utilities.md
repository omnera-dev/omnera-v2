# UI Utilities - Specialized Component Libraries

## Overview

Sovrium includes several specialized UI utility libraries that provide common UI patterns and components frequently needed in modern web applications.

**Purpose**: Pre-built, accessible UI utilities for common interaction patterns

**Philosophy**: Each library focuses on a specific UI pattern (command menus, date pickers, charts, etc.) and integrates seamlessly with React, TypeScript, and Tailwind CSS.

---

## 1. @hookform/resolvers - Form Validation Integration

**Version**: ^5.2.2 (minimum 5.2.2, allows patch/minor updates)
**Purpose**: Validation resolvers for React Hook Form, enabling Zod schema integration

### Why Use It

- Seamlessly integrates Zod schemas with React Hook Form
- Type-safe form validation
- Automatic error message generation
- Works with Effect Schema, Yup, Joi, and other validation libraries

### Basic Usage with Zod

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Define Zod schema
const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof LoginSchema>

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema), // ✅ Integrate Zod validation
  })

  const onSubmit = async (data: LoginFormData) => {
    // Data is fully typed and validated
    await loginUser(data.email, data.password)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email')}
        type="email"
        placeholder="Email"
      />
      {errors.email && <p className="text-red-600">{errors.email.message}</p>}

      <input
        {...register('password')}
        type="password"
        placeholder="Password"
      />
      {errors.password && <p className="text-red-600">{errors.password.message}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  )
}
```

### References

- [@hookform/resolvers docs](https://react-hook-form.com/get-started#SchemaValidation)
- [Zod integration guide](https://github.com/react-hook-form/resolvers#zod)

---

## 2. cmdk - Command Menu Component

**Version**: ^1.1.1 (minimum 1.1.1, allows patch/minor updates)
**Purpose**: Fast, composable command menu component for keyboard-driven interfaces

### Why Use It

- Keyboard-first navigation (⌘K / Ctrl+K pattern)
- Fuzzy search built-in
- Fully accessible (ARIA compliant)
- Customizable with Tailwind CSS

### Basic Usage

```tsx
import { Command } from 'cmdk'
import { useState } from 'react'

function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Trigger with keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <Command
        className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white shadow-lg"
        label="Command Menu"
      >
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Type a command or search..."
          className="w-full border-b px-4 py-3"
        />

        <Command.List className="max-h-96 overflow-y-auto p-2">
          <Command.Empty>No results found.</Command.Empty>

          <Command.Group heading="Actions">
            <Command.Item
              onSelect={() => console.log('New file')}
              className="rounded px-3 py-2 hover:bg-gray-100"
            >
              📄 New File
            </Command.Item>
            <Command.Item
              onSelect={() => console.log('Open')}
              className="rounded px-3 py-2 hover:bg-gray-100"
            >
              📂 Open
            </Command.Item>
            <Command.Item
              onSelect={() => console.log('Save')}
              className="rounded px-3 py-2 hover:bg-gray-100"
            >
              💾 Save
            </Command.Item>
          </Command.Group>

          <Command.Separator className="my-2 border-t" />

          <Command.Group heading="Settings">
            <Command.Item
              onSelect={() => console.log('Preferences')}
              className="rounded px-3 py-2 hover:bg-gray-100"
            >
              ⚙️ Preferences
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  )
}
```

### References

- [cmdk documentation](https://cmdk.paco.me/)
- [cmdk GitHub](https://github.com/pacocoursey/cmdk)

---

## 3. embla-carousel-react - Carousel Component

**Version**: ^8.6.0 (minimum 8.6.0, allows patch/minor updates)
**Purpose**: Lightweight, extensible carousel library with touch support

### Why Use It

- Touch-friendly mobile carousels
- Smooth animations and transitions
- Responsive and accessible
- Plugin architecture for extensions

### Basic Usage

```tsx
import useEmblaCarousel from 'embla-carousel-react'

function ImageCarousel({ images }: { images: string[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true })

  return (
    <div
      className="overflow-hidden"
      ref={emblaRef}
    >
      <div className="flex">
        {images.map((src, index) => (
          <div
            key={index}
            className="min-w-0 flex-[0_0_100%]"
          >
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="h-96 w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### With Navigation Buttons

```tsx
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback } from 'react'

function Carousel({ images }: { images: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="relative">
      <div
        className="overflow-hidden"
        ref={emblaRef}
      >
        <div className="flex">
          {images.map((src, index) => (
            <div
              key={index}
              className="min-w-0 flex-[0_0_100%]"
            >
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="h-96 w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg"
      >
        ←
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg"
      >
        →
      </button>
    </div>
  )
}
```

### References

- [Embla Carousel docs](https://www.embla-carousel.com/)
- [React integration guide](https://www.embla-carousel.com/get-started/react/)

---

## 4. input-otp - OTP Input Component

**Version**: ^1.4.2 (minimum 1.4.2, allows patch/minor updates)
**Purpose**: Accessible one-time password (OTP) input component

### Why Use It

- Specialized OTP/verification code input
- Auto-focus and keyboard navigation
- Copy/paste support
- Fully accessible

### Basic Usage

```tsx
import { OTPInput, OTPInputContext } from 'input-otp'

function VerificationForm() {
  const [value, setValue] = useState('')

  const handleComplete = (otp: string) => {
    console.log('OTP entered:', otp)
    verifyCode(otp)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">Enter verification code</label>

      <OTPInput
        maxLength={6}
        value={value}
        onChange={setValue}
        onComplete={handleComplete}
        render={({ slots }) => (
          <div className="flex gap-2">
            {slots.map((slot, idx) => (
              <OTPInputContext.Consumer key={idx}>
                {({ isActive, char }) => (
                  <div
                    className={`flex h-14 w-12 items-center justify-center rounded-md border-2 text-xl font-semibold ${
                      isActive ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                    }`}
                  >
                    {char}
                  </div>
                )}
              </OTPInputContext.Consumer>
            ))}
          </div>
        )}
      />

      {value.length === 6 && <p className="text-green-600">Code complete! Verifying...</p>}
    </div>
  )
}
```

### References

- [input-otp documentation](https://input-otp.rodz.dev/)
- [input-otp GitHub](https://github.com/guilhermerodz/input-otp)

---

## 5. next-themes - Theme Management

**Version**: ^0.4.6 (minimum 0.4.6, allows patch/minor updates)
**Purpose**: Perfect dark mode support for React applications

### Why Use It

- System-aware theme detection
- No flash of unstyled content (FOUC)
- localStorage persistence
- Works with Tailwind CSS `dark:` classes

### Setup

```tsx
// app.tsx or root component
import { ThemeProvider } from 'next-themes'

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <YourApp />
    </ThemeProvider>
  )
}
```

### Usage - Theme Toggle

```tsx
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-lg border px-4 py-2"
    >
      {theme === 'dark' ? '🌞 Light' : '🌙 Dark'}
    </button>
  )
}
```

### Usage - Theme Selector

```tsx
import { useTheme } from 'next-themes'

function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="rounded-lg border px-4 py-2"
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  )
}
```

### References

- [next-themes documentation](https://github.com/pacocoursey/next-themes)

---

## 6. react-day-picker - Date Picker Component

**Version**: ^9.11.1 (minimum 9.11.1, allows patch/minor updates)
**Purpose**: Flexible date picker component for React

### Why Use It

- Fully customizable calendar UI
- Date range selection support
- Accessible and keyboard-navigable
- Native Date object support

### Basic Usage

```tsx
import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

function DatePickerExample() {
  const [selected, setSelected] = useState<Date>()

  return (
    <div>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        className="rounded-lg border p-4"
      />
      {selected && <p className="mt-4 text-gray-600">Selected: {selected.toLocaleDateString()}</p>}
    </div>
  )
}
```

### Date Range Selection

```tsx
import { useState } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'

function DateRangePicker() {
  const [range, setRange] = useState<DateRange>()

  return (
    <div>
      <DayPicker
        mode="range"
        selected={range}
        onSelect={setRange}
        className="rounded-lg border p-4"
      />
      {range?.from && (
        <div className="mt-4 text-gray-600">
          <p>From: {range.from.toLocaleDateString()}</p>
          {range.to && <p>To: {range.to.toLocaleDateString()}</p>}
        </div>
      )}
    </div>
  )
}
```

### Custom Formatting

```tsx
import { DayPicker } from 'react-day-picker'

function FormattedDatePicker() {
  const [selected, setSelected] = useState<Date>()

  const footer = selected ? (
    <p className="text-sm text-gray-600">
      Selected: {selected.toLocaleDateString('en-US', { dateStyle: 'long' })}
    </p>
  ) : (
    <p className="text-sm text-gray-400">Please pick a day</p>
  )

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={setSelected}
      footer={footer}
      className="rounded-lg border p-4"
    />
  )
}
```

### References

- [react-day-picker documentation](https://daypicker.dev/)

---

## 7. react-resizable-panels - Resizable Layout Panels

**Version**: ^3.0.6 (minimum 3.0.6, allows patch/minor updates)
**Purpose**: Resizable split panel layouts (like VS Code's sidebar)

### Why Use It

- Drag-to-resize panel layouts
- Collapsible panels
- Persistent size (localStorage)
- Smooth animations

### Basic Usage - Horizontal Split

```tsx
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

function HorizontalLayout() {
  return (
    <PanelGroup direction="horizontal">
      <Panel
        defaultSize={25}
        minSize={15}
      >
        <div className="h-full bg-gray-100 p-4">
          <h2 className="font-bold">Sidebar</h2>
          <p>Resizable sidebar content</p>
        </div>
      </Panel>

      <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-blue-500" />

      <Panel defaultSize={75}>
        <div className="h-full bg-white p-4">
          <h2 className="font-bold">Main Content</h2>
          <p>Main content area</p>
        </div>
      </Panel>
    </PanelGroup>
  )
}
```

### Vertical Split

```tsx
function VerticalLayout() {
  return (
    <div className="h-screen">
      <PanelGroup direction="vertical">
        <Panel
          defaultSize={30}
          minSize={20}
        >
          <div className="h-full bg-gray-100 p-4">
            <h2 className="font-bold">Top Panel</h2>
          </div>
        </Panel>

        <PanelResizeHandle className="h-2 bg-gray-300 hover:bg-blue-500" />

        <Panel defaultSize={70}>
          <div className="h-full bg-white p-4">
            <h2 className="font-bold">Bottom Panel</h2>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
```

### Collapsible Panels

```tsx
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useState } from 'react'

function CollapsibleLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <PanelGroup direction="horizontal">
      <Panel
        collapsible
        defaultSize={25}
        minSize={15}
        maxSize={50}
        onCollapse={() => setIsCollapsed(true)}
        onExpand={() => setIsCollapsed(false)}
      >
        {!isCollapsed && (
          <div className="h-full bg-gray-100 p-4">
            <h2 className="font-bold">Sidebar</h2>
          </div>
        )}
      </Panel>

      <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-blue-500" />

      <Panel>
        <div className="h-full bg-white p-4">
          <button onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          </button>
        </div>
      </Panel>
    </PanelGroup>
  )
}
```

### References

- [react-resizable-panels documentation](https://github.com/bvaughn/react-resizable-panels)
- [API reference](https://github.com/bvaughn/react-resizable-panels/tree/main/packages/react-resizable-panels)

---

## 8. recharts - Charts and Data Visualization

**Version**: ^2.15.4 (minimum 2.15.4, allows patch/minor updates)
**Purpose**: Composable charting library built on D3

### Why Use It

- Declarative chart composition
- Responsive charts
- Wide variety of chart types
- Customizable with Tailwind CSS

### Line Chart

```tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function SalesChart() {
  const data = [
    { month: 'Jan', sales: 4000, profit: 2400 },
    { month: 'Feb', sales: 3000, profit: 1398 },
    { month: 'Mar', sales: 2000, profit: 9800 },
    { month: 'Apr', sales: 2780, profit: 3908 },
    { month: 'May', sales: 1890, profit: 4800 },
    { month: 'Jun', sales: 2390, profit: 3800 },
  ]

  return (
    <ResponsiveContainer
      width="100%"
      height={400}
    >
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#3b82f6"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="#10b981"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

### Bar Chart

```tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function RevenueChart() {
  const data = [
    { name: 'Product A', value: 4000 },
    { name: 'Product B', value: 3000 },
    { name: 'Product C', value: 2000 },
    { name: 'Product D', value: 2780 },
  ]

  return (
    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="value"
          fill="#3b82f6"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
```

### Pie Chart

```tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

function MarketShareChart() {
  const data = [
    { name: 'Product A', value: 400 },
    { name: 'Product B', value: 300 },
    { name: 'Product C', value: 300 },
    { name: 'Product D', value: 200 },
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

  return (
    <ResponsiveContainer
      width="100%"
      height={400}
    >
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
```

### References

- [Recharts documentation](https://recharts.org/)
- [Recharts examples](https://recharts.org/en-US/examples)
- [API reference](https://recharts.org/en-US/api)

---

## 9. sonner - Toast Notifications

**Version**: ^2.0.7 (minimum 2.0.7, allows patch/minor updates)
**Purpose**: Beautiful, accessible toast notification system

### Why Use It

- Pre-styled, beautiful toasts
- Promise-based loading toasts
- Customizable appearance
- Accessible (ARIA compliant)
- Stacking and queue management

### Setup

```tsx
// app.tsx or root component
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <YourApp />
      <Toaster position="top-right" />
    </>
  )
}
```

### Basic Usage

```tsx
import { toast } from 'sonner'

function NotificationExamples() {
  return (
    <div className="space-y-2">
      <button onClick={() => toast('This is a default toast')}>Default Toast</button>

      <button onClick={() => toast.success('Operation successful!')}>Success Toast</button>

      <button onClick={() => toast.error('Something went wrong')}>Error Toast</button>

      <button onClick={() => toast.info('Information message')}>Info Toast</button>

      <button onClick={() => toast.warning('Warning message')}>Warning Toast</button>
    </div>
  )
}
```

### Promise-Based Loading Toast

```tsx
import { toast } from 'sonner'

function PromiseToastExample() {
  const saveData = async () => {
    const promise = fetch('/api/save', { method: 'POST' })

    toast.promise(promise, {
      loading: 'Saving data...',
      success: 'Data saved successfully!',
      error: 'Failed to save data',
    })
  }

  return <button onClick={saveData}>Save Data</button>
}
```

### Custom Actions

```tsx
import { toast } from 'sonner'

function ActionToastExample() {
  const deleteItem = () => {
    toast('Item deleted', {
      action: {
        label: 'Undo',
        onClick: () => {
          console.log('Undo delete')
          toast.success('Deletion undone')
        },
      },
    })
  }

  return <button onClick={deleteItem}>Delete Item</button>
}
```

### Custom Duration

```tsx
import { toast } from 'sonner'

function PersistentToast() {
  return (
    <button
      onClick={() =>
        toast('This toast stays longer', {
          duration: 10000, // 10 seconds
        })
      }
    >
      Show Long Toast
    </button>
  )
}
```

### References

- [sonner documentation](https://sonner.emilkowal.ski/)
- [sonner GitHub](https://github.com/emilkowalski/sonner)

---

## 10. vaul - Drawer Component

**Version**: ^1.1.2 (minimum 1.1.2, allows patch/minor updates)
**Purpose**: Unstyled drawer component for mobile-first interfaces

### Why Use It

- Touch-friendly mobile drawers
- Smooth swipe-to-dismiss gesture
- Customizable with Tailwind CSS
- Accessible (keyboard navigation)

### Basic Usage

```tsx
import { Drawer } from 'vaul'

function DrawerExample() {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white">Open Drawer</button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed right-0 bottom-0 left-0 mt-24 flex h-[96%] flex-col rounded-t-lg bg-white">
          <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-gray-300" />

          <div className="flex-1 overflow-y-auto p-4">
            <Drawer.Title className="mb-4 text-2xl font-bold">Drawer Title</Drawer.Title>

            <p className="text-gray-600">
              This is the drawer content. You can swipe down to close it.
            </p>

            {/* More content */}
            <div className="mt-8 space-y-4">
              <div className="h-32 rounded-lg bg-gray-100" />
              <div className="h-32 rounded-lg bg-gray-100" />
              <div className="h-32 rounded-lg bg-gray-100" />
            </div>
          </div>

          <div className="border-t p-4">
            <Drawer.Close asChild>
              <button className="w-full rounded-lg bg-gray-200 py-3 font-medium">Close</button>
            </Drawer.Close>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
```

### With Snap Points

```tsx
import { Drawer } from 'vaul'

function SnapDrawer() {
  return (
    <Drawer.Root snapPoints={[0.3, 0.6, 1]}>
      <Drawer.Trigger>Open Snap Drawer</Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed right-0 bottom-0 left-0 flex flex-col rounded-t-lg bg-white">
          <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-gray-300" />

          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-xl font-bold">Snap Points Drawer</h2>
            <p className="text-gray-600">
              This drawer can snap to 30%, 60%, or 100% of screen height
            </p>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
```

### Nested Drawer

```tsx
import { Drawer } from 'vaul'

function NestedDrawers() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>Open First Drawer</Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed right-0 bottom-0 left-0 flex flex-col rounded-t-lg bg-white">
          <div className="p-4">
            <h2 className="mb-4 text-xl font-bold">First Drawer</h2>

            <Drawer.NestedRoot>
              <Drawer.Trigger className="rounded bg-blue-600 px-4 py-2 text-white">
                Open Nested Drawer
              </Drawer.Trigger>

              <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="fixed right-0 bottom-0 left-0 flex flex-col rounded-t-lg bg-white">
                  <div className="p-4">
                    <h2 className="text-xl font-bold">Nested Drawer</h2>
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.NestedRoot>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
```

### References

- [vaul documentation](https://vaul.emilkowal.ski/)
- [vaul GitHub](https://github.com/emilkowalski/vaul)

---

## Integration with Sovrium Stack

All these UI utilities integrate seamlessly with Sovrium's core technologies:

### React Integration

- All libraries are React-first with hooks and component APIs
- TypeScript support out of the box
- Work with React 19 features (Server Components, Actions, etc.)

### Tailwind CSS Styling

- Fully customizable with Tailwind utility classes
- No CSS conflicts with existing styles
- Dark mode support via `dark:` classes (with next-themes)

### Effect.ts Integration

Use Effect programs to manage data for these components:

```typescript
// Example: Using Effect with recharts
const fetchChartData = Effect.gen(function* () {
  const dataService = yield* DataService
  const rawData = yield* dataService.getMetrics()

  // Transform to recharts format
  return rawData.map((item) => ({
    name: item.label,
    value: item.count,
  }))
})

function ChartComponent() {
  const [data, setData] = useState([])

  useEffect(() => {
    Effect.runPromise(
      fetchChartData.pipe(Effect.provide(AppLayer))
    ).then(setData)
  }, [])

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        {/* ... */}
      </BarChart>
    </ResponsiveContainer>
  )
}
```

### Form Integration

Combine libraries for powerful form experiences:

```tsx
// Example: Form with validation, date picker, and toast notifications
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DayPicker } from 'react-day-picker'
import { toast } from 'sonner'
import { z } from 'zod'

const BookingSchema = z.object({
  date: z.date(),
  guests: z.number().min(1).max(10),
})

function BookingForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(BookingSchema),
  })

  const onSubmit = async (data: z.infer<typeof BookingSchema>) => {
    const promise = bookReservation(data)

    toast.promise(promise, {
      loading: 'Booking reservation...',
      success: 'Reservation confirmed!',
      error: 'Failed to book reservation',
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DayPicker
        mode="single"
        onSelect={(date) => setValue('date', date || new Date())}
      />
      {/* ... */}
    </form>
  )
}
```

---

## Best Practices

1. **Lazy Load Heavy Components**: Use `React.lazy()` for charts and carousels
2. **Accessibility First**: All these libraries prioritize accessibility - preserve it
3. **Customize with Tailwind**: Use Tailwind utilities instead of custom CSS
4. **Type Safety**: All libraries have excellent TypeScript support - use it
5. **Mobile-First**: Test drawer, carousel, and date picker on mobile devices
6. **Toast Moderation**: Don't spam users with too many toast notifications
7. **Chart Performance**: Limit data points in charts (use aggregation for large datasets)
8. **Theme Consistency**: Use next-themes for consistent dark mode across all components

---

## Summary Table

| Library                    | Use Case           | Key Feature         | Mobile-Friendly |
| -------------------------- | ------------------ | ------------------- | --------------- |
| **@hookform/resolvers**    | Form validation    | Zod integration     | ✅              |
| **cmdk**                   | Command menus      | Keyboard-first      | ✅              |
| **embla-carousel**         | Image galleries    | Touch gestures      | ✅✅            |
| **input-otp**              | OTP verification   | Auto-focus          | ✅              |
| **next-themes**            | Dark mode          | System detection    | ✅              |
| **react-day-picker**       | Date selection     | Native Date support | ✅              |
| **react-resizable-panels** | Split layouts      | Drag-to-resize      | ⚠️              |
| **recharts**               | Data visualization | Declarative API     | ✅              |
| **sonner**                 | Notifications      | Beautiful toasts    | ✅              |
| **vaul**                   | Mobile drawers     | Swipe gestures      | ✅✅            |

---

## When to Use Each Library

- **Forms with validation** → @hookform/resolvers + Zod
- **⌘K search interface** → cmdk
- **Image/content sliders** → embla-carousel-react
- **2FA/OTP input** → input-otp
- **Dark/light mode** → next-themes
- **Date/date range pickers** → react-day-picker
- **IDE-like layouts** → react-resizable-panels
- **Analytics dashboards** → recharts
- **Success/error feedback** → sonner
- **Mobile bottom sheets** → vaul

---

For full API documentation and advanced usage, refer to each library's official documentation linked throughout this guide.
