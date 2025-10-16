## Retrieving the Cause of an Effect

To retrieve the cause of a failed effect, use `Effect.cause`. This allows you to inspect or handle the exact reason behind the failure.

**Example** (Retrieving and Inspecting a Failure Cause)

```ts twoslash
import { Effect } from "effect"

const program = Effect.gen(function* () {
  const cause = yield* Effect.cause(Effect.fail("Oh no!"))
  console.log(cause)
})

Effect.runPromise(program)
/*
Output:
{ _id: 'Cause', _tag: 'Fail', failure: 'Oh no!' }
*/
```
