## Checking Completion Status

Sometimes, you might need to check if a deferred has been completed without suspending the fiber. This can be done using the `Deferred.poll` method. Here's how it works:

- `Deferred.poll` returns an `Option<Effect<A, E>>`:
  - If the `Deferred` is incomplete, it returns `None`.
  - If the `Deferred` is complete, it returns `Some`, which contains the result or error.

Additionally, you can use the `Deferred.isDone` function to check if a deferred has been completed. This method returns an `Effect<boolean>`, which evaluates to `true` if the `Deferred` is completed, allowing you to quickly check its state.

**Example** (Polling and Checking Completion Status)

```ts twoslash
import { Effect, Deferred } from "effect"

const program = Effect.gen(function* () {
  const deferred = yield* Deferred.make<number, string>()

  // Polling the Deferred to check if it's completed
  const done1 = yield* Deferred.poll(deferred)

  // Checking if the Deferred has been completed
  const done2 = yield* Deferred.isDone(deferred)

  console.log([done1, done2])
})

Effect.runFork(program)
/*
Output:
[ { _id: 'Option', _tag: 'None' }, false ]
*/
```
