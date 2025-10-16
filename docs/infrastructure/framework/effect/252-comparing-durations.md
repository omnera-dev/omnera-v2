## Comparing Durations

Use the following functions to compare two durations:

| API                    | Description                                                                  |
| ---------------------- | ---------------------------------------------------------------------------- |
| `lessThan`             | Returns `true` if the first duration is less than the second.                |
| `lessThanOrEqualTo`    | Returns `true` if the first duration is less than or equal to the second.    |
| `greaterThan`          | Returns `true` if the first duration is greater than the second.             |
| `greaterThanOrEqualTo` | Returns `true` if the first duration is greater than or equal to the second. |

**Example** (Comparing Two Durations)

```ts twoslash
import { Duration } from "effect"

const duration1 = Duration.seconds(30)
const duration2 = Duration.minutes(1)

console.log(Duration.lessThan(duration1, duration2))
// Output: true

console.log(Duration.lessThanOrEqualTo(duration1, duration2))
// Output: true

console.log(Duration.greaterThan(duration1, duration2))
// Output: false

console.log(Duration.greaterThanOrEqualTo(duration1, duration2))
// Output: false
```
