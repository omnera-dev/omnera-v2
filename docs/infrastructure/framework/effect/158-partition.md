## partition

The `Effect.partition` function processes an iterable and applies an effectful function to each element. It returns a tuple, where the first part contains all the failures, and the second part contains all the successes.

**Example** (Partitioning Successes and Failures)

```ts twoslash
import { Effect } from 'effect'

//      ┌─── Effect<[string[], number[]], never, never>
//      ▼
const program = Effect.partition([0, 1, 2, 3, 4], (n) => {
  if (n % 2 === 0) {
    return Effect.succeed(n)
  } else {
    return Effect.fail(`${n} is not even`)
  }
})

Effect.runPromise(program).then(console.log, console.error)
/*
Output:
[ [ '1 is not even', '3 is not even' ], [ 0, 2, 4 ] ]
*/
```

This operator is an unexceptional effect, meaning the error channel type is `never`. Failures are collected without stopping the effect, so the entire operation completes and returns both errors and successes.

# [Error Channel Operations](https://effect.website/docs/error-management/error-channel-operations/)
