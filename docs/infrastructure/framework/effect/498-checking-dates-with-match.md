## Checking Dates with match

The `match` function allows you to determine if a given `Date` (or any [DateTime.Input](/docs/data-types/datetime/#the-datetimeinput-type)) satisfies the constraints of a cron schedule.

If the date meets the schedule's conditions, `match` returns `true`. Otherwise, it returns `false`.

**Example** (Checking if a Date Matches a Cron Schedule)

```ts twoslash
import { Cron } from 'effect'

// Suppose we have a cron that triggers at 4:00 AM
// on the 8th to the 14th of each month
const cron = Cron.unsafeParse('0 0 4 8-14 * *')

const checkDate = new Date('2025-01-08 04:00:00')

console.log(Cron.match(cron, checkDate))
// Output: true
```
