## Converting to Schedule

The Schedule module allows you to define recurring behaviors, such as retries or periodic events. The `cron` function bridges the `Cron` module with the Schedule module, enabling you to create schedules based on cron expressions or `Cron` instances.

### cron

The `Schedule.cron` function generates a [Schedule](/docs/scheduling/introduction/) that triggers at the start of each interval defined by the provided cron expression or `Cron` instance. When triggered, the schedule produces a tuple `[start, end]` representing the timestamps (in milliseconds) of the cron interval window.

**Example** (Creating a Schedule from a Cron)

```ts twoslash collapse={12-40}
import { Effect, Schedule, TestClock, Fiber, TestContext, Cron, Console } from 'effect'

// A helper function to log output at each interval of the schedule
const log = <A>(
  action: Effect.Effect<A>,
  schedule: Schedule.Schedule<[number, number], void>
): void => {
  let i = 0

  Effect.gen(function* () {
    const fiber: Fiber.RuntimeFiber<[[number, number], number]> = yield* Effect.gen(function* () {
      yield* action
      i++
    }).pipe(
      Effect.repeat(
        schedule.pipe(
          // Limit the number of iterations for the example
          Schedule.intersect(Schedule.recurs(10)),
          Schedule.tapOutput(([Out]) =>
            Console.log(i === 11 ? '...' : [new Date(Out[0]), new Date(Out[1])])
          )
        )
      ),
      Effect.fork
    )
    yield* TestClock.adjust(Infinity)
    yield* Fiber.join(fiber)
  }).pipe(Effect.provide(TestContext.TestContext), Effect.runPromise)
}

// Build a cron that triggers at 4:00 AM
// on the 8th to the 14th of each month
const cron = Cron.unsafeParse('0 0 4 8-14 * *', 'UTC')

// Convert the Cron into a Schedule
const schedule = Schedule.cron(cron)

// Define a dummy action to repeat
const action = Effect.void

// Log the schedule intervals
log(action, schedule)
/*
Output:
[ 1970-01-08T04:00:00.000Z, 1970-01-08T04:00:01.000Z ]
[ 1970-01-09T04:00:00.000Z, 1970-01-09T04:00:01.000Z ]
[ 1970-01-10T04:00:00.000Z, 1970-01-10T04:00:01.000Z ]
[ 1970-01-11T04:00:00.000Z, 1970-01-11T04:00:01.000Z ]
[ 1970-01-12T04:00:00.000Z, 1970-01-12T04:00:01.000Z ]
[ 1970-01-13T04:00:00.000Z, 1970-01-13T04:00:01.000Z ]
[ 1970-01-14T04:00:00.000Z, 1970-01-14T04:00:01.000Z ]
[ 1970-02-08T04:00:00.000Z, 1970-02-08T04:00:01.000Z ]
[ 1970-02-09T04:00:00.000Z, 1970-02-09T04:00:01.000Z ]
[ 1970-02-10T04:00:00.000Z, 1970-02-10T04:00:01.000Z ]
...
*/
```

<Aside type="note" title="Using a Real Clock">
  In a real application, you do not need to use the `TestClock` or
  `TestContext`. These are only necessary for simulating time and
  controlling the execution in test environments.
</Aside>

# [Examples](https://effect.website/docs/scheduling/examples/)
