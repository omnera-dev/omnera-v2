## once

Ensures an effect is executed only once, even if invoked multiple times.

**Example** (Single Execution of an Effect)

```ts twoslash
import { Effect, Console } from "effect"

const program = Effect.gen(function* () {
  const task1 = Console.log("task1")

  // Repeats task1 three times
  yield* Effect.repeatN(task1, 2)

  // Ensures task2 is executed only once
  const task2 = yield* Effect.once(Console.log("task2"))

  // Attempts to repeat task2, but it will only execute once
  yield* Effect.repeatN(task2, 2)
})

Effect.runFork(program)
/*
Output:
task1
task1
task1
task2
*/
```
