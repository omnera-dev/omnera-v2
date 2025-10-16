## runSyncExit

Runs an effect synchronously and returns the result as an [Exit](/docs/data-types/exit/) type, which represents the outcome (success or failure) of the effect.

Use `Effect.runSyncExit` to find out whether an effect succeeded or failed,
including any defects, without dealing with asynchronous operations.

The `Exit` type represents the result of the effect:

- If the effect succeeds, the result is wrapped in a `Success`.
- If it fails, the failure information is provided as a `Failure` containing
  a [Cause](/docs/data-types/cause/) type.

**Example** (Handling Results as Exit)

```ts twoslash
import { Effect } from 'effect'

console.log(Effect.runSyncExit(Effect.succeed(1)))
/*
Output:
{
  _id: "Exit",
  _tag: "Success",
  value: 1
}
*/

console.log(Effect.runSyncExit(Effect.fail('my error')))
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

If the effect contains asynchronous operations, `Effect.runSyncExit` will
return an `Failure` with a `Die` cause, indicating that the effect cannot be
resolved synchronously.

**Example** (Asynchronous Operation Resulting in Die)

```ts twoslash
import { Effect } from 'effect'

console.log(Effect.runSyncExit(Effect.promise(() => Promise.resolve(1))))
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Die',
    defect: [Fiber #0 cannot be resolved synchronously. This is caused by using runSync on an effect that performs async work] {
      fiber: [FiberRuntime],
      _tag: 'AsyncFiberException',
      name: 'AsyncFiberException'
    }
  }
}
*/
```
