## Zoned Constructors

A `Zoned` includes `epochMillis` along with a `TimeZone`, allowing you to attach an offset or a named region (like "America/New_York") to the timestamp.

### unsafeMakeZoned

Creates a `Zoned` by combining a [DateTime.Input](#the-datetimeinput-type) with an optional `TimeZone`.
This allows you to represent a specific point in time with an associated time zone.

The time zone can be provided in several ways:

- As a `TimeZone` object
- A string identifier (e.g., `"Europe/London"`)
- A numeric offset in milliseconds

If the input or time zone is invalid, an `IllegalArgumentException` is thrown.

**Example** (Creating a Zoned DateTime Without Specifying a Time Zone)

The following example assumes the code is executed on a system in Italy (CET timezone):

```ts twoslash
import { DateTime } from 'effect'

// Create a Zoned DateTime based on the system's local time zone
const zoned = DateTime.unsafeMakeZoned(new Date('2025-01-01 04:00:00'))

console.log(zoned)
// Output: DateTime.Zoned(2025-01-01T04:00:00.000+01:00)

console.log(zoned.zone)
// Output: TimeZone.Offset(+01:00)
```

Here, the system's time zone (CET, which is UTC+1 in January) is used to create the `Zoned` instance.

**Example** (Specifying a Named Time Zone)

The following example assumes the code is executed on a system in Italy (CET timezone):

```ts twoslash
import { DateTime } from 'effect'

// Create a Zoned DateTime with a specified named time zone
const zoned = DateTime.unsafeMakeZoned(new Date('2025-01-01 04:00:00'), {
  timeZone: 'Europe/Rome',
})

console.log(zoned)
// Output: DateTime.Zoned(2025-01-01T04:00:00.000+01:00[Europe/Rome])

console.log(zoned.zone)
// Output: TimeZone.Named(Europe/Rome)
```

In this case, the `"Europe/Rome"` time zone is explicitly provided, resulting in the `Zoned` instance being tied to this named time zone.

By default, the input date is treated as a UTC value and then adjusted for the specified time zone. To interpret the input date as being in the specified time zone, you can use the `adjustForTimeZone` option.

**Example** (Adjusting for Time Zone Interpretation)

The following example assumes the code is executed on a system in Italy (CET timezone):

```ts twoslash
import { DateTime } from 'effect'

// Interpret the input date as being in the specified time zone
const zoned = DateTime.unsafeMakeZoned(new Date('2025-01-01 04:00:00'), {
  timeZone: 'Europe/Rome',
  adjustForTimeZone: true,
})

console.log(zoned)
// Output: DateTime.Zoned(2025-01-01T03:00:00.000+01:00[Europe/Rome])

console.log(zoned.zone)
// Output: TimeZone.Named(Europe/Rome)
```

**Explanation**

- **Without `adjustForTimeZone`**: The input date is interpreted as UTC and then adjusted to the specified time zone. For instance, `2025-01-01 04:00:00` in UTC becomes `2025-01-01T04:00:00.000+01:00` in CET (UTC+1).
- **With `adjustForTimeZone: true`**: The input date is interpreted as being in the specified time zone. For example, `2025-01-01 04:00:00` in "Europe/Rome" (CET) is adjusted to its corresponding UTC time, resulting in `2025-01-01T03:00:00.000+01:00`.

### makeZoned

The `makeZoned` function works similarly to [unsafeMakeZoned](#unsafemakezoned) but provides a safer approach. Instead of throwing an error when the input is invalid, it returns an `Option<Zoned>`.
If the input is invalid, it returns `None`. If valid, it returns `Some` containing the `Zoned`.

**Example** (Safely Creating a Zoned DateTime)

```ts twoslash
import { DateTime, Option } from 'effect'

//      ┌─── Option<Zoned>
//      ▼
const zoned = DateTime.makeZoned(new Date('2025-01-01 04:00:00'), {
  timeZone: 'Europe/Rome',
})

if (Option.isSome(zoned)) {
  console.log('The DateTime is valid')
}
```

### makeZonedFromString

Creates a `Zoned` by parsing a string in the format `YYYY-MM-DDTHH:mm:ss.sss+HH:MM[IANA timezone identifier]`.

If the input string is valid, the function returns a `Some` containing the `Zoned`. If the input is invalid, it returns `None`.

**Example** (Parsing a Zoned DateTime from a String)

```ts twoslash
import { DateTime, Option } from 'effect'

//      ┌─── Option<Zoned>
//      ▼
const zoned = DateTime.makeZonedFromString('2025-01-01T03:00:00.000+01:00[Europe/Rome]')

if (Option.isSome(zoned)) {
  console.log('The DateTime is valid')
}
```
