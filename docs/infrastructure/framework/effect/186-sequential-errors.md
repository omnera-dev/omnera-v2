## Sequential Errors

When working with resource-safety operators like `Effect.ensuring`, you may encounter multiple sequential errors.
This happens because regardless of whether the original effect has any errors or not, the finalizer is uninterruptible and will always run.

**Example** (Handling Multiple Sequential Errors)

In this example, both `fail` and the finalizer `die` result in sequential errors, and both are captured.

```ts twoslash
import { Effect } from "effect"

// Simulate an effect that fails
const fail = Effect.fail("Oh uh!")

// Simulate a finalizer that causes a defect
const die = Effect.dieMessage("Boom!")

// The finalizer 'die' will always run, even if 'fail' fails
const program = fail.pipe(Effect.ensuring(die))

Effect.runPromiseExit(program).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Sequential',
    left: { _id: 'Cause', _tag: 'Fail', failure: 'Oh uh!' },
    right: { _id: 'Cause', _tag: 'Die', defect: [Object] }
  }
}
*/
```

# [Retrying](https://effect.website/docs/error-management/retrying/)
