## How TestClock Works

Imagine `TestClock` as a wall clock that only moves forward when we adjust it manually using the `TestClock.adjust` and `TestClock.setTime` functions. The clock time does not progress on its own.

When we adjust the clock time, any effects scheduled to run at or before that time will execute. This allows us to simulate time passage in tests without waiting for real time.

**Example** (Simulating a Timeout with TestClock)

```ts twoslash
import { Effect, TestClock, Fiber, Option, TestContext } from 'effect'
import * as assert from 'node:assert'

const test = Effect.gen(function* () {
  // Create a fiber that sleeps for 5 minutes and then times out
  // after 1 minute
  const fiber = yield* Effect.sleep('5 minutes').pipe(
    Effect.timeoutTo({
      duration: '1 minute',
      onSuccess: Option.some,
      onTimeout: () => Option.none<void>(),
    }),
    Effect.fork
  )

  // Adjust the TestClock by 1 minute to simulate the passage of time
  yield* TestClock.adjust('1 minute')

  // Get the result of the fiber
  const result = yield* Fiber.join(fiber)

  // Check if the result is None, indicating a timeout
  assert.ok(Option.isNone(result))
}).pipe(Effect.provide(TestContext.TestContext))

Effect.runPromise(test)
```

A key point is forking the fiber where `Effect.sleep` is invoked. Calls to `Effect.sleep` and related methods wait until the clock time matches or exceeds the scheduled time for their execution. By forking the fiber, we retain control over the clock time adjustments.

<Aside type="tip" title="Best Practices">
  A recommended pattern when using the `TestClock` is to fork the effect
  being tested, adjust the clock time as needed, and then verify that the
  expected outcomes have occurred.
</Aside>
