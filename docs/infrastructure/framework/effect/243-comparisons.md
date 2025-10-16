## Comparisons

| Function                                     | Description                                                  |
| -------------------------------------------- | ------------------------------------------------------------ |
| `distance`                                   | Returns the difference (in ms) between two `DateTime`s.      |
| `distanceDurationEither`                     | Returns a `Left` or `Right` `Duration` depending on order.   |
| `distanceDuration`                           | Returns a `Duration` indicating how far apart two times are. |
| `min`                                        | Returns the earlier of two `DateTime` values.                |
| `max`                                        | Returns the later of two `DateTime` values.                  |
| `greaterThan`, `greaterThanOrEqualTo`, etc.  | Checks ordering between two `DateTime` values.               |
| `between`                                    | Checks if a `DateTime` lies within the given bounds.         |
| `isFuture`, `isPast`, `unsafeIsFuture`, etc. | Checks if a `DateTime` is in the future or past.             |

**Example** (Finding the Distance Between Two DateTimes)

```ts twoslash
import { DateTime } from 'effect'

const utc1 = DateTime.unsafeMake('2025-01-01T00:00:00Z')
const utc2 = DateTime.add(utc1, { days: 1 })

console.log(DateTime.distance(utc1, utc2))
// Output: 86400000 (one day)

console.log(DateTime.distanceDurationEither(utc1, utc2))
/*
Output:
{
  _id: 'Either',
  _tag: 'Right',
  right: { _id: 'Duration', _tag: 'Millis', millis: 86400000 }
}
*/

console.log(DateTime.distanceDuration(utc1, utc2))
// Output: { _id: 'Duration', _tag: 'Millis', millis: 86400000 }
```
