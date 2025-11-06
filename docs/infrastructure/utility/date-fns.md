# date-fns

## Overview

**Version**: ^4.1.0 (minimum 4.1.0, allows patch/minor updates)
**Purpose**: Modern JavaScript date utility library for parsing, formatting, and manipulating dates
**Scope**: Client-side only (Presentation layer) - specifically for date-picker components
**Server-side Alternative**: Use `Effect.DateTime` instead

## Why date-fns for Sovrium

- **Client-side Date Pickers**: Required by shadcn/ui date-picker component
- **Lightweight**: Tree-shakable, only import functions you use
- **Immutable**: All functions return new date objects (functional programming aligned)
- **TypeScript**: Full TypeScript support with excellent type definitions
- **i18n Support**: Localization for 100+ languages

## Critical: Client vs Server Date Handling

| Context         | Library           | Use Case                                               |
| --------------- | ----------------- | ------------------------------------------------------ |
| **Client-side** | `date-fns`        | Date pickers, formatting for display, UI interactions  |
| **Server-side** | `Effect.DateTime` | API date handling, business logic, database operations |

### Why This Split?

1. **date-fns** is optimized for browser environments and UI interactions
2. **Effect.DateTime** integrates with Effect.ts ecosystem used on server
3. Avoids bundling Effect.ts date utilities in client code
4. Each tool optimized for its environment

```typescript
// ✅ CLIENT: Use date-fns for date-picker
import { format, parseISO } from 'date-fns'

function DatePickerComponent() {
  const [date, setDate] = useState<Date>()

  return (
    <DatePicker
      selected={date}
      onChange={setDate}
      dateFormat="MMM d, yyyy"
    />
  )
}

// ✅ SERVER: Use Effect.DateTime for API logic
import { DateTime } from 'effect'

function calculateExpiration(startDate: DateTime.DateTime) {
  return DateTime.add(startDate, { days: 30 })
}
```

## Installation (Already Installed)

```bash
# Already in package.json
bun add date-fns  # ^4.1.0
```

## shadcn/ui Date Picker Integration

The primary use case for date-fns in Sovrium is the shadcn/ui date-picker component:

```typescript
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { useState } from 'react'

export function DatePickerDemo() {
  const [date, setDate] = useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {date ? format(date, 'PPP') : 'Pick a date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
```

## Common date-fns Functions

### Formatting Dates

```typescript
import { format, formatDistance, formatRelative } from 'date-fns'

// Format date to string
const date = new Date(2024, 0, 15)
format(date, 'yyyy-MM-dd') // "2024-01-15"
format(date, 'MMM d, yyyy') // "Jan 15, 2024"
format(date, 'MMMM do, yyyy') // "January 15th, 2024"
format(date, 'PPP') // "January 15th, 2024" (locale-aware)
format(date, 'Pp') // "Jan 15, 2024, 12:00 AM"

// Relative time
formatDistance(new Date(), date) // "8 months ago"
formatRelative(date, new Date()) // "last Tuesday at 12:00 AM"
```

### Parsing Dates

```typescript
import { parse, parseISO, isValid } from 'date-fns'

// Parse ISO string (from API)
const date1 = parseISO('2024-01-15T10:30:00Z')

// Parse custom format
const date2 = parse('01/15/2024', 'MM/dd/yyyy', new Date())

// Validate date
if (isValid(date1)) {
  console.log('Valid date')
}
```

### Manipulating Dates

```typescript
import {
  addDays,
  addMonths,
  addYears,
  subDays,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
} from 'date-fns'

const today = new Date()

// Add/subtract
const tomorrow = addDays(today, 1)
const nextMonth = addMonths(today, 1)
const lastYear = addYears(today, -1)
const yesterday = subDays(today, 1)

// Start/end of periods
const dayStart = startOfDay(today) // 2024-01-15 00:00:00
const dayEnd = endOfDay(today) // 2024-01-15 23:59:59
const monthStart = startOfMonth(today) // 2024-01-01 00:00:00
const monthEnd = endOfMonth(today) // 2024-01-31 23:59:59
```

### Comparing Dates

```typescript
import { isBefore, isAfter, isEqual, isSameDay, isWithinInterval, differenceInDays } from 'date-fns'

const date1 = new Date(2024, 0, 15)
const date2 = new Date(2024, 0, 20)

// Comparisons
isBefore(date1, date2) // true
isAfter(date1, date2) // false
isEqual(date1, date1) // true
isSameDay(date1, date2) // false

// Check if within range
isWithinInterval(new Date(), {
  start: date1,
  end: date2,
}) // true/false

// Calculate difference
differenceInDays(date2, date1) // 5
```

## Common Patterns in Sovrium

### Date Range Picker

```typescript
import { DateRange } from 'react-day-picker'
import { addDays, format } from 'date-fns'

function DateRangePicker() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  return (
    <div>
      <Calendar
        mode="range"
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
      />
      {date?.from && (
        <p>
          {format(date.from, 'PPP')} - {date.to && format(date.to, 'PPP')}
        </p>
      )}
    </div>
  )
}
```

### Date Input with Validation

```typescript
import { parse, isValid, isPast, isFuture } from 'date-fns'
import { useState } from 'react'

function DateInput() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleChange = (input: string) => {
    setValue(input)

    const date = parse(input, 'MM/dd/yyyy', new Date())

    if (!isValid(date)) {
      setError('Invalid date format (MM/DD/YYYY)')
      return
    }

    if (isPast(date)) {
      setError('Date must be in the future')
      return
    }

    setError('')
  }

  return (
    <div>
      <input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="MM/DD/YYYY"
      />
      {error && <span className="error">{error}</span>}
    </div>
  )
}
```

### Birthdate Picker (Past Only)

```typescript
import { isPast, subYears } from 'date-fns'

function BirthdatePicker() {
  const [date, setDate] = useState<Date>()

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={(date) => !isPast(date)} // Only past dates
      defaultMonth={subYears(new Date(), 25)} // Start 25 years ago
      captionLayout="dropdown-buttons"
      fromYear={1900}
      toYear={new Date().getFullYear()}
    />
  )
}
```

### Expiration Date Picker (Future Only)

```typescript
import { isFuture, addDays } from 'date-fns'

function ExpirationDatePicker() {
  const [date, setDate] = useState<Date>()

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={(date) => !isFuture(date)} // Only future dates
      defaultMonth={addDays(new Date(), 30)} // Start 30 days ahead
    />
  )
}
```

## Localization

```typescript
import { format } from 'date-fns'
import { enUS, fr, es, de, ja } from 'date-fns/locale'

const date = new Date(2024, 0, 15)

// English (default)
format(date, 'PPPP')
// "Sunday, January 15th, 2024"

// French
format(date, 'PPPP', { locale: fr })
// "dimanche 15 janvier 2024"

// Spanish
format(date, 'PPPP', { locale: es })
// "domingo, 15 de enero de 2024"

// German
format(date, 'PPPP', { locale: de })
// "Sonntag, 15. Januar 2024"

// Japanese
format(date, 'PPPP', { locale: ja })
// "2024年1月15日日曜日"
```

## Timezone Handling

**Important**: date-fns operates in local browser timezone by default.

```typescript
// date-fns uses browser's local timezone
const date = new Date() // User's local time

// For server communication, use ISO strings
const isoString = date.toISOString() // UTC format: "2024-01-15T10:30:00.000Z"

// Parse ISO from server (automatically converts to local)
import { parseISO } from 'date-fns'
const localDate = parseISO(isoString)

// For timezone-aware operations, use date-fns-tz
import { formatInTimeZone } from 'date-fns-tz'
formatInTimeZone(date, 'America/New_York', 'yyyy-MM-dd HH:mm:ssXXX')
```

## Tree Shaking (Bundle Optimization)

date-fns is fully tree-shakable - only import what you use:

```typescript
// ❌ BAD: Imports entire library
import * as dateFns from 'date-fns'
dateFns.format(new Date(), 'yyyy-MM-dd')

// ✅ GOOD: Only imports what you need
import { format } from 'date-fns'
format(new Date(), 'yyyy-MM-dd')

// ✅ GOOD: Import multiple functions
import { format, addDays, parseISO } from 'date-fns'
```

## Immutability (Functional Programming)

All date-fns functions return **new** date objects (no mutations):

```typescript
import { addDays } from 'date-fns'

const original = new Date(2024, 0, 15)
const modified = addDays(original, 5)

console.log(original) // Still Jan 15
console.log(modified) // Jan 20

// ✅ Aligns with Sovrium's functional programming principles
```

## Format Tokens Reference

Common tokens for `format()`:

| Token  | Example               | Description            |
| ------ | --------------------- | ---------------------- |
| `yyyy` | 2024                  | 4-digit year           |
| `yy`   | 24                    | 2-digit year           |
| `MMMM` | January               | Full month name        |
| `MMM`  | Jan                   | Short month name       |
| `MM`   | 01                    | 2-digit month          |
| `M`    | 1                     | Month number           |
| `dd`   | 15                    | 2-digit day            |
| `d`    | 15                    | Day number             |
| `EEEE` | Monday                | Full day name          |
| `EEE`  | Mon                   | Short day name         |
| `HH`   | 13                    | 24-hour (00-23)        |
| `hh`   | 01                    | 12-hour (01-12)        |
| `mm`   | 30                    | Minutes                |
| `ss`   | 45                    | Seconds                |
| `a`    | PM                    | AM/PM                  |
| `PPP`  | Jan 15, 2024          | Locale-aware date      |
| `Pp`   | Jan 15, 2024, 1:30 PM | Locale-aware date+time |

## Best Practices

1. **Use for client-side only** - Server-side should use Effect.DateTime
2. **Import specific functions** - Enable tree-shaking for smaller bundles
3. **Use ISO strings for API** - Ensures timezone consistency
4. **Validate user input** - Always check `isValid()` after parsing
5. **Use locale-aware formats** - `PPP`, `Pp` instead of hardcoded formats
6. **Test with different timezones** - Consider users in different locations
7. **Use shadcn/ui Calendar** - Pre-built, accessible date picker component

## Common Mistakes

### ❌ Mutating Dates

```typescript
// BAD: Trying to mutate date
const date = new Date()
date.setDate(date.getDate() + 1) // Mutation!

// GOOD: Use date-fns for immutable operations
import { addDays } from 'date-fns'
const tomorrow = addDays(date, 1)
```

### ❌ Importing Entire Library

```typescript
// BAD: Imports everything
import dateFns from 'date-fns'

// GOOD: Import only what you need
import { format, addDays } from 'date-fns'
```

### ❌ Not Validating Parsed Dates

```typescript
// BAD: Assuming parse always succeeds
const date = parse(userInput, 'yyyy-MM-dd', new Date())
format(date, 'PPP') // Could format invalid date!

// GOOD: Validate before using
import { parse, isValid, format } from 'date-fns'
const date = parse(userInput, 'yyyy-MM-dd', new Date())
if (isValid(date)) {
  format(date, 'PPP')
} else {
  console.error('Invalid date')
}
```

## Testing with date-fns

```typescript
import { render, screen } from '@testing-library/react'
import { format } from 'date-fns'
import { DateDisplay } from './DateDisplay'

describe('DateDisplay', () => {
  test('formats date correctly', () => {
    const date = new Date(2024, 0, 15)
    render(<DateDisplay date={date} />)

    expect(screen.getByText(format(date, 'PPP'))).toBeInTheDocument()
  })

  test('handles invalid dates', () => {
    const invalidDate = new Date('invalid')
    render(<DateDisplay date={invalidDate} />)

    expect(screen.getByText('Invalid date')).toBeInTheDocument()
  })
})
```

## References

- date-fns documentation: https://date-fns.org/docs/Getting-Started
- Format tokens: https://date-fns.org/docs/format
- Locales: https://date-fns.org/docs/I18n
- shadcn/ui Calendar: https://ui.shadcn.com/docs/components/calendar
- Effect.DateTime (server-side): https://effect.website/docs/datetime/introduction
