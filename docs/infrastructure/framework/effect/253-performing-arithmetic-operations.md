## Performing Arithmetic Operations

You can perform arithmetic operations on durations, like addition and multiplication.

**Example** (Adding and Multiplying Durations)

```ts twoslash
import { Duration } from 'effect'

const duration1 = Duration.seconds(30)
const duration2 = Duration.minutes(1)

// Add two durations
console.log(String(Duration.sum(duration1, duration2)))
/*
Output:
Duration(1m 30s)
*/

// Multiply a duration by a factor
console.log(String(Duration.times(duration1, 2)))
/*
Output:
Duration(1m)
*/
```
