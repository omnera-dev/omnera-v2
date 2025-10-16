## Testing Recurring Effects

Here's an example demonstrating how to test an effect that runs at fixed intervals using the `TestClock`:

**Example** (Testing an Effect with Fixed Intervals)

In this example, we test an effect that runs at regular intervals. An unbounded queue is used to manage the effects, and we verify the following:

1. No effect occurs before the specified recurrence period.
2. An effect occurs after the recurrence period.
3. The effect executes exactly once.

```ts twoslash
import { Effect, Queue, TestClock, Option, TestContext } from "effect"
import * as assert from "node:assert"

const test = Effect.gen(function* () {
  const q = yield* Queue.unbounded()

  yield* Queue.offer(q, undefined).pipe(
    // Delay the effect for 60 minutes and repeat it forever
    Effect.delay("60 minutes"),
    Effect.forever,
    Effect.fork
  )

  // Check if no effect is performed before the recurrence period
  const a = yield* Queue.poll(q).pipe(Effect.andThen(Option.isNone))

  // Adjust the TestClock by 60 minutes to simulate the passage of time
  yield* TestClock.adjust("60 minutes")

  // Check if an effect is performed after the recurrence period
  const b = yield* Queue.take(q).pipe(Effect.as(true))

  // Check if the effect is performed exactly once
  const c = yield* Queue.poll(q).pipe(Effect.andThen(Option.isNone))

  // Adjust the TestClock by another 60 minutes
  yield* TestClock.adjust("60 minutes")

  // Check if another effect is performed
  const d = yield* Queue.take(q).pipe(Effect.as(true))
  const e = yield* Queue.poll(q).pipe(Effect.andThen(Option.isNone))

  // Ensure that all conditions are met
  assert.ok(a && b && c && d && e)
}).pipe(Effect.provide(TestContext.TestContext))

Effect.runPromise(test)
```

It's important to note that after each recurrence, the next occurrence is scheduled to happen at the appropriate time. Adjusting the clock by 60 minutes places exactly one value in the queue; adjusting by another 60 minutes adds another value.
