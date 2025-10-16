## Utc Constructors

`Utc` is an immutable structure that uses `epochMillis` (milliseconds since the Unix epoch) to represent a point in time in Coordinated Universal Time (UTC).

### unsafeFromDate

Creates a `Utc` from a JavaScript `Date`.
Throws an `IllegalArgumentException` if the provided `Date` is invalid.

When a `Date` object is passed, it is converted to a `Utc` instance. The time is interpreted as the local time of the system executing the code and then adjusted to UTC. This ensures a consistent, timezone-independent representation of the date and time.

**Example** (Converting Local Time to UTC in Italy)

The following example assumes the code is executed on a system in Italy (CET timezone):

```ts twoslash
import { DateTime } from "effect"

// Create a Utc instance from a local JavaScript Date
//
//     ┌─── Utc
//     ▼
const utc = DateTime.unsafeFromDate(new Date("2025-01-01 04:00:00"))

console.log(utc)
// Output: DateTime.Utc(2025-01-01T03:00:00.000Z)

console.log(utc.epochMillis)
// Output: 1735700400000
```

**Explanation**:

- The local time **2025-01-01 04:00:00** (in Italy, CET) is converted to **UTC** by subtracting the timezone offset (UTC+1 in January).
- As a result, the UTC time becomes **2025-01-01 03:00:00.000Z**.
- `epochMillis` provides the same time as milliseconds since the Unix Epoch, ensuring a precise numeric representation of the UTC timestamp.

### unsafeMake

Creates a `Utc` from a [DateTime.Input](#the-datetimeinput-type).

**Example** (Creating a DateTime with unsafeMake)

The following example assumes the code is executed on a system in Italy (CET timezone):

```ts twoslash
import { DateTime } from "effect"

// From a JavaScript Date
const utc1 = DateTime.unsafeMake(new Date("2025-01-01 04:00:00"))
console.log(utc1)
// Output: DateTime.Utc(2025-01-01T03:00:00.000Z)

// From partial date parts
const utc2 = DateTime.unsafeMake({ year: 2025 })
console.log(utc2)
// Output: DateTime.Utc(2025-01-01T00:00:00.000Z)

// From a string
const utc3 = DateTime.unsafeMake("2025-01-01")
console.log(utc3)
// Output: DateTime.Utc(2025-01-01T00:00:00.000Z)
```

**Explanation**:

- The local time **2025-01-01 04:00:00** (in Italy, CET) is converted to **UTC** by subtracting the timezone offset (UTC+1 in January).
- As a result, the UTC time becomes **2025-01-01 03:00:00.000Z**.

### make

Similar to [unsafeMake](#unsafemake), but returns an [Option](/docs/data-types/option/) instead of throwing an error if the input is invalid.
If the input is invalid, it returns `None`. If valid, it returns `Some` containing the `Utc`.

**Example** (Creating a DateTime Safely)

The following example assumes the code is executed on a system in Italy (CET timezone):

```ts twoslash
import { DateTime } from "effect"

// From a JavaScript Date
const maybeUtc1 = DateTime.make(new Date("2025-01-01 04:00:00"))
console.log(maybeUtc1)
/*
Output:
{ _id: 'Option', _tag: 'Some', value: '2025-01-01T03:00:00.000Z' }
*/

// From partial date parts
const maybeUtc2 = DateTime.make({ year: 2025 })
console.log(maybeUtc2)
/*
Output:
{ _id: 'Option', _tag: 'Some', value: '2025-01-01T00:00:00.000Z' }
*/

// From a string
const maybeUtc3 = DateTime.make("2025-01-01")
console.log(maybeUtc3)
/*
Output:
{ _id: 'Option', _tag: 'Some', value: '2025-01-01T00:00:00.000Z' }
*/
```

**Explanation**:

- The local time **2025-01-01 04:00:00** (in Italy, CET) is converted to **UTC** by subtracting the timezone offset (UTC+1 in January).
- As a result, the UTC time becomes **2025-01-01 03:00:00.000Z**.
