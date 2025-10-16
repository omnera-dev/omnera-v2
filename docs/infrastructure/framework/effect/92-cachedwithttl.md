## cachedWithTTL

Returns an effect that caches its result for a specified duration, known as the `timeToLive`. When the cache expires after the duration, the effect will be recomputed upon next evaluation.

**Example** (Caching with Time-to-Live)

```ts twoslash
import { Effect, Console } from 'effect'

let i = 1

// Simulating an expensive task with a delay
const expensiveTask = Effect.promise<string>(() => {
  console.log('expensive task...')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`result ${i++}`)
    }, 100)
  })
})

const program = Effect.gen(function* () {
  // Caches the result for 150 milliseconds
  const cached = yield* Effect.cachedWithTTL(expensiveTask, '150 millis')

  // First evaluation triggers the task
  yield* cached.pipe(Effect.andThen(Console.log))

  // Second evaluation returns the cached result
  yield* cached.pipe(Effect.andThen(Console.log))

  // Wait for 100 milliseconds, ensuring the cache expires
  yield* Effect.sleep('100 millis')

  // Recomputes the task after cache expiration
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
