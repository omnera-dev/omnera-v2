## Testing Deferred

The `TestClock` also impacts asynchronous code scheduled to run after a specific time.

**Example** (Simulating Delayed Execution with Deferred and TestClock)

```ts twoslash
import { Effect, Deferred, TestClock, TestContext } from "effect"
import * as assert from "node:assert"

const test = Effect.gen(function* () {
  // Create a deferred value
  const deferred = yield* Deferred.make<number, void>()

  // Run two effects concurrently: sleep for 10 seconds and succeed
  // the deferred with a value of 1
  yield* Effect.all(
    [Effect.sleep("10 seconds"), Deferred.succeed(deferred, 1)],
    { concurrency: "unbounded" }
  ).pipe(Effect.fork)

  // Adjust the TestClock by 10 seconds
  yield* TestClock.adjust("10 seconds")

  // Await the value from the deferred
  const readRef = yield* Deferred.await(deferred)

  // Verify the deferred value is correctly set
  assert.ok(readRef === 1)
}).pipe(Effect.provide(TestContext.TestContext))

Effect.runPromise(test)
```

# [Equal](https://effect.website/docs/trait/equal/)
