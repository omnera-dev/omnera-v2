## When do Fibers run?

Forked fibers begin execution after the current fiber completes or yields.

**Example** (Late Fiber Start Captures Only One Value)

In the following example, the `changes` stream only captures a single value, `2`.
This happens because the fiber created by `Effect.fork` starts **after** the value is updated.

```ts twoslash
import { Effect, SubscriptionRef, Stream, Console } from "effect"

const program = Effect.gen(function* () {
  const ref = yield* SubscriptionRef.make(0)
  yield* ref.changes.pipe(
    // Log each change in SubscriptionRef
    Stream.tap((n) => Console.log(`SubscriptionRef changed to ${n}`)),
    Stream.runDrain,
    // Fork a fiber to run the stream
    Effect.fork
  )
  yield* SubscriptionRef.set(ref, 1)
  yield* SubscriptionRef.set(ref, 2)
})

Effect.runFork(program)
/*
Output:
SubscriptionRef changed to 2
*/
```

If you add a short delay with `Effect.sleep()` or call `Effect.yieldNow()`, you allow the current fiber to yield. This gives the forked fiber enough time to start and collect all values before they are updated.

<Aside type="caution" title="Fiber Execution is Non-Deterministic">
  Keep in mind that the timing of fiber execution is not deterministic,
  and many factors can affect when a fiber starts. Do not rely on the idea
  that a single yield always ensures your fiber begins at a particular
  time.
</Aside>

**Example** (Delay Allows Fiber to Capture All Values)

```ts twoslash ins={14}
import { Effect, SubscriptionRef, Stream, Console } from "effect"

const program = Effect.gen(function* () {
  const ref = yield* SubscriptionRef.make(0)
  yield* ref.changes.pipe(
    // Log each change in SubscriptionRef
    Stream.tap((n) => Console.log(`SubscriptionRef changed to ${n}`)),
    Stream.runDrain,
    // Fork a fiber to run the stream
    Effect.fork
  )

  // Allow the fiber a chance to start
  yield* Effect.sleep("100 millis")

  yield* SubscriptionRef.set(ref, 1)
  yield* SubscriptionRef.set(ref, 2)
})

Effect.runFork(program)
/*
Output:
SubscriptionRef changed to 0
SubscriptionRef changed to 1
SubscriptionRef changed to 2
*/
```

# [Latch](https://effect.website/docs/concurrency/latch/)
