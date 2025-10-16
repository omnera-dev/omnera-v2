## The DateTime Type

A `DateTime` represents a moment in time. It can be stored as either a simple UTC value or as a value with an associated time zone. Storing time this way helps you manage both precise timestamps and the context for how that time should be displayed or interpreted.

There are two main variants of `DateTime`:

1. **Utc**: An immutable structure that uses `epochMillis` (milliseconds since the Unix epoch) to represent a point in time in Coordinated Universal Time (UTC).

2. **Zoned**: Includes `epochMillis` along with a `TimeZone`, allowing you to attach an offset or a named region (like "America/New_York") to the timestamp.

### Why Have Two Variants?

- **Utc** is straightforward if you only need a universal reference without relying on local time zones.
- **Zoned** is helpful when you need to keep track of time zone information for tasks such as converting to local times or adjusting for daylight saving time.

### TimeZone Variants

A `TimeZone` can be either:

- **Offset**: Represents a fixed offset from UTC (for example, UTC+2 or UTC-5).
- **Named**: Uses a named region (e.g., "Europe/London" or "America/New_York") that automatically accounts for region-specific rules like daylight saving time changes.

### TypeScript Definition

Below is the TypeScript definition for the `DateTime` type:

```ts showLineNumbers=false
type DateTime = Utc | Zoned

interface Utc {
  readonly _tag: "Utc"
  readonly epochMillis: number
}

interface Zoned {
  readonly _tag: "Zoned"
  readonly epochMillis: number
  readonly zone: TimeZone
}

type TimeZone = TimeZone.Offset | TimeZone.Named

declare namespace TimeZone {
  interface Offset {
    readonly _tag: "Offset"
    readonly offset: number
  }

  interface Named {
    readonly _tag: "Named"
    readonly id: string
  }
}
```
