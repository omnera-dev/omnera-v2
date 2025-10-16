## Creating a Latch

Use the `Effect.makeLatch` function to create a latch in an open or closed state by passing a boolean. The default is `false`, which means it starts closed.

**Example** (Creating and Using a Latch)

In this example, the latch starts closed. A fiber logs "open sesame" only when the latch is open. After waiting for one second, the latch is opened, releasing the fiber:

```ts twoslash
import { Console, Effect } from 'effect'

// A generator function that demonstrates latch usage
const program = Effect.gen(function* () {
  // Create a latch, starting in the closed state
  const latch = yield* Effect.makeLatch()

  // Fork a fiber that logs "open sesame" only when the latch is open
  const fiber = yield* Console.log('open sesame').pipe(
    latch.whenOpen, // Waits for the latch to open
    Effect.fork // Fork the effect into a new fiber
  )

  // Wait for 1 second
  yield* Effect.sleep('1 second')

  // Open the latch, releasing the fiber
  yield* latch.open

  // Wait for the forked fiber to finish
  yield* fiber.await
})

Effect.runFork(program)
// Output: open sesame (after 1 second)
```
