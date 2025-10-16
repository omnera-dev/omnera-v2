## Common Use Cases

`Deferred` becomes useful when you need to wait for something specific to happen in your program.
It's ideal for scenarios where you want one part of your code to signal another part when it's ready.

Here are a few common use cases:

| **Use Case**             | **Description**                                                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Coordinating Fibers**  | When you have multiple concurrent tasks and need to coordinate their actions, `Deferred` can help one fiber signal to another when it has completed its task.             |
| **Synchronization**      | Anytime you want to ensure that one piece of code doesn't proceed until another piece of code has finished its work, `Deferred` can provide the synchronization you need. |
| **Handing Over Work**    | You can use `Deferred` to hand over work from one fiber to another. For example, one fiber can prepare some data, and then a second fiber can continue processing it.     |
| **Suspending Execution** | When you want a fiber to pause its execution until some condition is met, a `Deferred` can be used to block it until the condition is satisfied.                          |

**Example** (Using Deferred to Coordinate Two Fibers)

In this example, a deferred is used to pass a value between two fibers.

By running both fibers concurrently and using the deferred as a synchronization point, we can ensure that `fiberB` only proceeds after `fiberA` has completed its task.

```ts twoslash
import { Effect, Deferred, Fiber } from "effect"

const program = Effect.gen(function* () {
  const deferred = yield* Deferred.make<string, string>()

  // Completes the Deferred with a value after a delay
  const taskA = Effect.gen(function* () {
    console.log("Starting task to complete the Deferred")
    yield* Effect.sleep("1 second")
    console.log("Completing the Deferred")
    return yield* Deferred.succeed(deferred, "hello world")
  })

  // Waits for the Deferred and prints the value
  const taskB = Effect.gen(function* () {
    console.log("Starting task to get the value from the Deferred")
    const value = yield* Deferred.await(deferred)
    console.log("Got the value from the Deferred")
    return value
  })

  // Run both fibers concurrently
  const fiberA = yield* Effect.fork(taskA)
  const fiberB = yield* Effect.fork(taskB)

  // Wait for both fibers to complete
  const both = yield* Fiber.join(Fiber.zip(fiberA, fiberB))

  console.log(both)
})

Effect.runFork(program)
/*
Starting task to complete the Deferred
Starting task to get the value from the Deferred
Completing the Deferred
Got the value from the Deferred
[ true, 'hello world' ]
*/
```

# [Fibers](https://effect.website/docs/concurrency/fibers/)
