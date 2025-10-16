## runPromise

Executes an effect and returns the result as a `Promise`.

Use `Effect.runPromise` when you need to execute an effect and work with the
result using `Promise` syntax, typically for compatibility with other
promise-based code.

**Example** (Running a Successful Effect as a Promise)

```ts twoslash
import { Effect } from "effect"

Effect.runPromise(Effect.succeed(1)).then(console.log)
// Output: 1
```

If the effect succeeds, the promise will resolve with the result. If the
effect fails, the promise will reject with an error.

**Example** (Handling a Failing Effect as a Rejected Promise)

```ts twoslash
import { Effect } from "effect"

Effect.runPromise(Effect.fail("my error")).catch(console.error)
/*
Output:
(FiberFailure) Error: my error
*/
```
