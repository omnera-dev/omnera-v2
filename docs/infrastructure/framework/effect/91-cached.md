## cached

Returns an effect that computes a result lazily and caches it. Subsequent evaluations of this effect will return the cached result without re-executing the logic.

**Example** (Lazy Caching of an Expensive Task)

```ts twoslash
import { Effect, Console } from "effect"

let i = 1

// Simulating an expensive task with a delay
const expensiveTask = Effect.promise<string>(() => {
  console.log("expensive task...")
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`result ${i++}`)
    }, 100)
  })
})

const program = Effect.gen(function* () {
  // Without caching, the task is executed each time
  console.log("-- non-cached version:")
  yield* expensiveTask.pipe(Effect.andThen(Console.log))
  yield* expensiveTask.pipe(Effect.andThen(Console.log))

  // With caching, the result is reused after the first run
  console.log("-- cached version:")
  const cached = yield* Effect.cached(expensiveTask)
  yield* cached.pipe(Effect.andThen(Console.log))
  yield* cached.pipe(Effect.andThen(Console.log))
})

Effect.runFork(program)
/*
Output:
-- non-cached version:
expensive task...
result 1
expensive task...
result 2
-- cached version:
expensive task...
result 3
result 3
*/
```
