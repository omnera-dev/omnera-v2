## Creating Durations

The Duration module includes several constructors to create durations in different units.

**Example** (Creating Durations in Various Units)

```ts twoslash
import { Duration } from "effect"

// Create a duration of 100 milliseconds
const duration1 = Duration.millis(100)

// Create a duration of 2 seconds
const duration2 = Duration.seconds(2)

// Create a duration of 5 minutes
const duration3 = Duration.minutes(5)
```

You can create durations using units such as nanoseconds, microsecond, milliseconds, seconds, minutes, hours, days, and weeks.

For an infinite duration, use `Duration.infinity`.

**Example** (Creating an Infinite Duration)

```ts twoslash
import { Duration } from "effect"

console.log(String(Duration.infinity))
/*
Output:
Duration(Infinity)
*/
```

Another option for creating durations is using the `Duration.decode` helper:

- `number` values are treated as milliseconds.
- `bigint` values are treated as nanoseconds.
- Strings must follow the format `"${number} ${unit}"`.

**Example** (Decoding Values into Durations)

```ts twoslash
import { Duration } from "effect"

Duration.decode(10n) // same as Duration.nanos(10)
Duration.decode(100) // same as Duration.millis(100)
Duration.decode(Infinity) // same as Duration.infinity

Duration.decode("10 nanos") // same as Duration.nanos(10)
Duration.decode("20 micros") // same as Duration.micros(20)
Duration.decode("100 millis") // same as Duration.millis(100)
Duration.decode("2 seconds") // same as Duration.seconds(2)
Duration.decode("5 minutes") // same as Duration.minutes(5)
Duration.decode("7 hours") // same as Duration.hours(7)
Duration.decode("3 weeks") // same as Duration.weeks(3)
```
