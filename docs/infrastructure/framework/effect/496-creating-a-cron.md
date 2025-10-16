## Creating a Cron

You can define a cron schedule by specifying numeric constraints for seconds, minutes, hours, days, months, and weekdays. The `make` function requires you to define all fields representing the schedule's constraints.

**Example** (Creating a Cron)

```ts twoslash
import { Cron, DateTime } from "effect"

// Build a cron that triggers at 4:00 AM
// on the 8th to the 14th of each month
const cron = Cron.make({
  seconds: [0], // Trigger at the start of a minute
  minutes: [0], // Trigger at the start of an hour
  hours: [4], // Trigger at 4:00 AM
  days: [8, 9, 10, 11, 12, 13, 14], // Specific days of the month
  months: [], // No restrictions on the month
  weekdays: [], // No restrictions on the weekday
  tz: DateTime.zoneUnsafeMakeNamed("Europe/Rome") // Optional time zone
})
```

- `seconds`, `minutes`, and `hours`: Define the time of day.
- `days` and `months`: Specify which calendar days and months are valid.
- `weekdays`: Restrict the schedule to specific days of the week.
- `tz`: Optionally define the time zone for the schedule.

If any field is left empty (e.g., `months`), it is treated as having "no constraints," allowing any valid value for that part of the date.
