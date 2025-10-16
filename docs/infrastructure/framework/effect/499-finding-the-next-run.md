## Finding the Next Run

The `next` function determines the next date that satisfies a given cron schedule, starting from a specified date. If no starting date is provided, the current time is used as the starting point.

If `next` cannot find a matching date within a predefined number of iterations, it throws an error to prevent infinite loops.

**Example** (Determining the Next Matching Date)

```ts twoslash
import { Cron } from 'effect'

// Define a cron expression for 4:00 AM
// on the 8th to the 14th of every month
const cron = Cron.unsafeParse('0 0 4 8-14 * *', 'UTC')

// Specify the starting point for the search
const after = new Date('2025-01-08')

// Find the next matching date
const nextDate = Cron.next(cron, after)

console.log(nextDate)
// Output: 2025-01-08T04:00:00.000Z
```
