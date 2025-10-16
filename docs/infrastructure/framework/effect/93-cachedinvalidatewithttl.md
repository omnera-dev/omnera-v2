## cachedInvalidateWithTTL

Similar to `Effect.cachedWithTTL`, this function caches an effect's result for a specified duration. It also includes an additional effect for manually invalidating the cached value before it naturally expires.

**Example** (Invalidating Cache Manually)

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
  // Caches the result for 150 milliseconds
  const [cached, invalidate] = yield* Effect.cachedInvalidateWithTTL(
    expensiveTask,
    "150 millis"
  )

  // First evaluation triggers the task
  yield* cached.pipe(Effect.andThen(Console.log))

  // Second evaluation returns the cached result
  yield* cached.pipe(Effect.andThen(Console.log))

  // Invalidate the cache before it naturally expires
  yield* invalidate

  // Third evaluation triggers the task again
  // since the cache was invalidated
  yield* cached.pipe(Effect.andThen(Console.log))
})

Effect.runFork(program)
/*
Output:
expensive task...
result 1
result 1
expensive task...
result 2
*/
```

# [Branded Types](https://effect.website/docs/code-style/branded-types/)
