## ignore

`Effect.ignore` allows you to run an effect without caring about its result,
whether it succeeds or fails.

This is useful when you only care about the side effects of the effect and do not need to handle or process its outcome.

**Example** (Using `Effect.ignore` to Discard Values)

```ts twoslash
import { Effect } from 'effect'

//      ┌─── Effect<number, string, never>
//      ▼
const task = Effect.fail('Uh oh!').pipe(Effect.as(5))

//      ┌─── Effect<void, never, never>
//      ▼
const program = Effect.ignore(task)
```
