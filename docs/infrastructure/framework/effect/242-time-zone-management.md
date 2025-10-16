## Time Zone Management

| Function              | Description                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `setZone`             | Creates a `Zoned` from `DateTime` by applying the given `TimeZone`.                                                                              |
| `setZoneOffset`       | Creates a `Zoned` from `DateTime` using a fixed offset (in ms).                                                                                  |
| `setZoneNamed`        | Creates a `Zoned` from `DateTime` from an IANA time zone identifier or returns `None` if invalid.                                                |
| `unsafeSetZoneNamed`  | Creates a `Zoned` from `DateTime` from an IANA time zone identifier or throws if invalid.                                                        |
| `zoneUnsafeMakeNamed` | Creates a `TimeZone.Named` from a IANA time zone identifier or throws if the identifier is invalid.                                              |
| `zoneMakeNamed`       | Creates a `TimeZone.Named` from a IANA time zone identifier or returns `None` if invalid.                                                        |
| `zoneMakeNamedEffect` | Creates a `Effect<TimeZone.Named, IllegalArgumentException>` from a IANA time zone identifier failing with `IllegalArgumentException` if invalid |
| `zoneMakeOffset`      | Creates a `TimeZone.Offset` from a numeric offset in milliseconds.                                                                               |
| `zoneMakeLocal`       | Creates a `TimeZone.Named` from the system's local time zone.                                                                                    |
| `zoneFromString`      | Attempts to parse a time zone from a string, returning `None` if invalid.                                                                        |
| `zoneToString`        | Returns a string representation of a `TimeZone`.                                                                                                 |

**Example** (Applying a Time Zone to a DateTime)

```ts twoslash
import { DateTime } from "effect"

// Create a UTC DateTime
//
//     ┌─── Utc
//     ▼
const utc = DateTime.unsafeMake("2024-01-01")

// Create a named time zone for New York
//
//      ┌─── TimeZone.Named
//      ▼
const zoneNY = DateTime.zoneUnsafeMakeNamed("America/New_York")

// Apply it to the DateTime
//
//      ┌─── Zoned
//      ▼
const zoned = DateTime.setZone(utc, zoneNY)

console.log(zoned)
// Output: DateTime.Zoned(2023-12-31T19:00:00.000-05:00[America/New_York])
```

### zoneFromString

Parses a string to create a `DateTime.TimeZone`.

This function attempts to interpret the input string as either:

- A numeric time zone offset (e.g., "GMT", "+01:00")
- An IANA time zone identifier (e.g., "Europe/London")

If the string matches an offset format, it is converted into a `TimeZone.Offset`.
Otherwise, it attempts to create a `TimeZone.Named` using the input.

If the input string is invalid, `Option.none()` is returned.

**Example** (Parsing a Time Zone from a String)

```ts twoslash
import { DateTime, Option } from "effect"

// Attempt to parse a numeric offset
const offsetZone = DateTime.zoneFromString("+01:00")
console.log(Option.isSome(offsetZone))
// Output: true

// Attempt to parse an IANA time zone
const namedZone = DateTime.zoneFromString("Europe/London")
console.log(Option.isSome(namedZone))
// Output: true

// Invalid input
const invalidZone = DateTime.zoneFromString("Invalid/Zone")
console.log(Option.isSome(invalidZone))
// Output: false
```
