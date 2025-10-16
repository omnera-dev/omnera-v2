## Iterating Over Future Dates

To generate multiple future dates that match a cron schedule, you can use the `sequence` function. This function provides an infinite iterator of matching dates, starting from a specified date.

**Example** (Generating Future Dates with an Iterator)

```ts
import { Cron } from "effect"

// Define a cron expression for 4:00 AM
// on the 8th to the 14th of every month
const cron = Cron.unsafeParse("0 0 4 8-14 * *", "UTC")

// Specify the starting date
const start = new Date("2021-01-08")

// Create an iterator for the schedule
const iterator = Cron.sequence(cron, start)

// Get the first matching date after the start date
console.log(iterator.next().value)
// Output: 2021-01-08T04:00:00.000Z

// Get the second matching date after the start date
console.log(iterator.next().value)
// Output: 2021-01-09T04:00:00.000Z
```
