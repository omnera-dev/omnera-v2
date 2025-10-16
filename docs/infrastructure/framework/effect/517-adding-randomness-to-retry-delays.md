## Adding Randomness to Retry Delays

The `Schedule.jittered` combinator modifies a schedule by applying a random delay within a specified range.

When a resource is out of service due to overload or contention, retrying and backing off doesn't help us. If all failed API calls are backed off to the same point of time, they cause another overload or contention. Jitter adds some amount of randomness to the delay of the schedule. This helps us to avoid ending up accidentally synchronizing and taking the service down by accident.

[Research](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/) suggests that `Schedule.jittered(0.0, 1.0)` is an effective way to introduce randomness in retries.

**Example** (Jittered Exponential Backoff)

```ts twoslash collapse={3-26}
import { Array, Chunk, Duration, Effect, Schedule } from "effect"

const log = (
  schedule: Schedule.Schedule<unknown>,
  delay: Duration.DurationInput = 0
): void => {
  const maxRecurs = 10
  const delays = Chunk.toArray(
    Effect.runSync(
      Schedule.run(
        Schedule.delays(Schedule.addDelay(schedule, () => delay)),
        Date.now(),
        Array.range(0, maxRecurs)
      )
    )
  )
  delays.forEach((duration, i) => {
    console.log(
      i === maxRecurs
        ? "..."
        : i === delays.length - 1
        ? "(end)"
        : `#${i + 1}: ${Duration.toMillis(duration)}ms`
    )
  })
}

const schedule = Schedule.jittered(Schedule.exponential("10 millis"))

log(schedule)
/*
Output:
#1: 10.448486ms
#2: 21.134521ms
#3: 47.245117ms
#4: 88.263184ms
#5: 163.651367ms
#6: 335.818848ms
#7: 719.126709ms
#8: 1266.18457ms
#9: 2931.252441ms
#10: 6121.593018ms
...
*/
```

The `Schedule.jittered` combinator introduces randomness to delays within a range. For example, applying jitter to an exponential backoff ensures that each retry occurs at a slightly different time, reducing the risk of overwhelming the system.
