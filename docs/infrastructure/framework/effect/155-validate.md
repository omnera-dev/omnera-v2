## validate

The `Effect.validate` function is similar to `Effect.zip`, but it continues combining effects even after encountering errors, accumulating both successes and failures.

**Example** (Validating and Collecting Errors)

```ts twoslash
import { Effect, Console } from "effect"

const task1 = Console.log("task1").pipe(Effect.as(1))
const task2 = Effect.fail("Oh uh!").pipe(Effect.as(2))
const task3 = Console.log("task2").pipe(Effect.as(3))
const task4 = Effect.fail("Oh no!").pipe(Effect.as(4))

const program = task1.pipe(
  Effect.validate(task2),
  Effect.validate(task3),
  Effect.validate(task4)
)

Effect.runPromiseExit(program).then(console.log)
/*
Output:
task1
task2
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Sequential',
    left: { _id: 'Cause', _tag: 'Fail', failure: 'Oh uh!' },
    right: { _id: 'Cause', _tag: 'Fail', failure: 'Oh no!' }
  }
}
*/
```
