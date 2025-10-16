## How to Raise Errors

The `Effect.gen` API lets you integrate error handling directly into your workflow by yielding failed effects.
You can introduce errors with `Effect.fail`, as shown in the example below.

**Example** (Introducing an Error into the Flow)

```ts twoslash
import { Effect, Console } from "effect"

const task1 = Console.log("task1...")
const task2 = Console.log("task2...")

const program = Effect.gen(function* () {
  // Perform some tasks
  yield* task1
  yield* task2
  // Introduce an error
  yield* Effect.fail("Something went wrong!")
})

Effect.runPromise(program).then(console.log, console.error)
/*
Output:
task1...
task2...
(FiberFailure) Error: Something went wrong!
*/
```
