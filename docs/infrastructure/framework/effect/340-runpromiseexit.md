## runPromiseExit

Runs an effect and returns a `Promise` that resolves to an [Exit](/docs/data-types/exit/), which
represents the outcome (success or failure) of the effect.

Use `Effect.runPromiseExit` when you need to determine if an effect succeeded
or failed, including any defects, and you want to work with a `Promise`.

The `Exit` type represents the result of the effect:

- If the effect succeeds, the result is wrapped in a `Success`.
- If it fails, the failure information is provided as a `Failure` containing
  a [Cause](/docs/data-types/cause/) type.

**Example** (Handling Results as Exit)

```ts twoslash
import { Effect } from 'effect'

Effect.runPromiseExit(Effect.succeed(1)).then(console.log)
/*
Output:
{
  _id: "Exit",
  _tag: "Success",
  value: 1
}
*/

Effect.runPromiseExit(Effect.fail('my error')).then(console.log)
/*
Output:
{
  _id: "Exit",
  _tag: "Failure",
  cause: {
    _id: "Cause",
    _tag: "Fail",
    failure: "my error"
  }
}
*/
```
