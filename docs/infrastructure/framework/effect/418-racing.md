## Racing

The `Effect.race` function allows you to run multiple effects concurrently, returning the result of the first one that successfully completes.

**Example** (Basic Race Between Effects)

```ts twoslash
import { Micro } from "effect"

const task1 = Micro.delay(Micro.fail("task1"), 1_000)
const task2 = Micro.delay(Micro.succeed("task2"), 2_000)

// Run both tasks concurrently and return
// the result of the first to complete
const program = Micro.race(task1, task2)

Micro.runPromise(program).then(console.log)
/*
Output:
task2
*/
```

If you want to handle the result of whichever task completes first, whether it succeeds or fails, you can use the `Micro.either` function. This function wraps the result in an [Either](/docs/data-types/either/) type, allowing you to see if the result was a success (`Right`) or a failure (`Left`):

**Example** (Handling Success or Failure with Either)

```ts twoslash
import { Micro } from "effect"

const task1 = Micro.delay(Micro.fail("task1"), 1_000)
const task2 = Micro.delay(Micro.succeed("task2"), 2_000)

// Run both tasks concurrently, wrapping the result
// in Either to capture success or failure
const program = Micro.race(Micro.either(task1), Micro.either(task2))

Micro.runPromise(program).then(console.log)
/*
Output:
{ _id: 'Either', _tag: 'Left', left: 'task1' }
*/
```

# [Supervisor](https://effect.website/docs/observability/supervisor/)
