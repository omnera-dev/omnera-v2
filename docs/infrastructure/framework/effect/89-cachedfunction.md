## cachedFunction

Memoizes a function with effects, caching results for the same inputs to avoid recomputation.

**Example** (Memoizing a Random Number Generator)

```ts twoslash
import { Effect, Random } from 'effect'

const program = Effect.gen(function* () {
  const randomNumber = (n: number) => Random.nextIntBetween(1, n)
  console.log('non-memoized version:')
  console.log(yield* randomNumber(10)) // Generates a new random number
  console.log(yield* randomNumber(10)) // Generates a different number

  console.log('memoized version:')
  const memoized = yield* Effect.cachedFunction(randomNumber)
  console.log(yield* memoized(10)) // Generates and caches the result
  console.log(yield* memoized(10)) // Reuses the cached result
})

Effect.runFork(program)
/*
Example Output:
non-memoized version:
2
8
memoized version:
5
5
*/
```
