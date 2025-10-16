## Customizing Timeout Behavior

In addition to the basic `Effect.timeout` function, there are variations available that allow you to customize the behavior when a timeout occurs.

### timeoutFail

The `Effect.timeoutFail` function allows you to produce a specific error when a timeout happens.

**Example** (Custom Timeout Error)

```ts twoslash
import { Effect, Data } from "effect"

const task = Effect.gen(function* () {
  console.log("Start processing...")
  yield* Effect.sleep("2 seconds") // Simulates a delay in processing
  console.log("Processing complete.")
  return "Result"
})

class MyTimeoutError extends Data.TaggedError("MyTimeoutError")<{}> {}

const program = task.pipe(
  Effect.timeoutFail({
    duration: "1 second",
    onTimeout: () => new MyTimeoutError() // Custom timeout error
  })
)

Effect.runPromiseExit(program).then(console.log)
/*
Output:
Start processing...
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Fail',
    failure: MyTimeoutError { _tag: 'MyTimeoutError' }
  }
}
*/
```

### timeoutFailCause

`Effect.timeoutFailCause` lets you define a specific defect to throw when a timeout occurs. This is helpful for treating timeouts as exceptional cases in your code.

**Example** (Custom Defect on Timeout)

```ts twoslash
import { Effect, Cause } from "effect"

const task = Effect.gen(function* () {
  console.log("Start processing...")
  yield* Effect.sleep("2 seconds") // Simulates a delay in processing
  console.log("Processing complete.")
  return "Result"
})

const program = task.pipe(
  Effect.timeoutFailCause({
    duration: "1 second",
    onTimeout: () => Cause.die("Timed out!") // Custom defect for timeout
  })
)

Effect.runPromiseExit(program).then(console.log)
/*
Output:
Start processing...
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Die', defect: 'Timed out!' }
}
*/
```

### timeoutTo

`Effect.timeoutTo` provides more flexibility compared to `Effect.timeout`, allowing you to define different outcomes for both successful and timed-out operations. This can be useful when you want to customize the result based on whether the operation completes in time or not.

**Example** (Handling Success and Timeout with [Either](/docs/data-types/either/))

```ts twoslash
import { Effect, Either } from "effect"

const task = Effect.gen(function* () {
  console.log("Start processing...")
  yield* Effect.sleep("2 seconds") // Simulates a delay in processing
  console.log("Processing complete.")
  return "Result"
})

const program = task.pipe(
  Effect.timeoutTo({
    duration: "1 second",
    onSuccess: (result): Either.Either<string, string> =>
      Either.right(result),
    onTimeout: (): Either.Either<string, string> =>
      Either.left("Timed out!")
  })
)

Effect.runPromise(program).then(console.log)
/*
Output:
Start processing...
{
  _id: "Either",
  _tag: "Left",
  left: "Timed out!"
}
*/
```

# [Two Types of Errors](https://effect.website/docs/error-management/two-error-types/)
