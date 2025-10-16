## Inspecting Errors

Similar to [tapping](/docs/getting-started/building-pipelines/#tap) for success values, Effect provides several operators for inspecting error values.
These operators allow developers to observe failures or underlying issues without modifying the outcome.

### tapError

Executes an effectful operation to inspect the failure of an effect without altering it.

**Example** (Inspecting Errors)

```ts twoslash
import { Effect, Console } from "effect"

// Simulate a task that fails with an error
const task: Effect.Effect<number, string> = Effect.fail("NetworkError")

// Use tapError to log the error message when the task fails
const tapping = Effect.tapError(task, (error) =>
  Console.log(`expected error: ${error}`)
)

Effect.runFork(tapping)
/*
Output:
expected error: NetworkError
*/
```

### tapErrorTag

This function allows you to inspect errors that match a specific tag, helping you handle different error types more precisely.

**Example** (Inspecting Tagged Errors)

```ts twoslash
import { Effect, Console, Data } from "effect"

class NetworkError extends Data.TaggedError("NetworkError")<{
  readonly statusCode: number
}> {}

class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly field: string
}> {}

// Create a task that fails with a NetworkError
const task: Effect.Effect<number, NetworkError | ValidationError> =
  Effect.fail(new NetworkError({ statusCode: 504 }))

// Use tapErrorTag to inspect only NetworkError types
// and log the status code
const tapping = Effect.tapErrorTag(task, "NetworkError", (error) =>
  Console.log(`expected error: ${error.statusCode}`)
)

Effect.runFork(tapping)
/*
Output:
expected error: 504
*/
```

### tapErrorCause

This function inspects the complete cause of an error, including failures and defects.

**Example** (Inspecting Error Causes)

```ts twoslash
import { Effect, Console } from "effect"

// Create a task that fails with a NetworkError
const task1: Effect.Effect<number, string> = Effect.fail("NetworkError")

const tapping1 = Effect.tapErrorCause(task1, (cause) =>
  Console.log(`error cause: ${cause}`)
)

Effect.runFork(tapping1)
/*
Output:
error cause: Error: NetworkError
*/

// Simulate a severe failure in the system
const task2: Effect.Effect<number, string> = Effect.dieMessage(
  "Something went wrong"
)

const tapping2 = Effect.tapErrorCause(task2, (cause) =>
  Console.log(`error cause: ${cause}`)
)

Effect.runFork(tapping2)
/*
Output:
error cause: RuntimeException: Something went wrong
  ... stack trace ...
*/
```

### tapDefect

Specifically inspects non-recoverable failures or defects in an effect (i.e., one or more [Die](/docs/data-types/cause/#die) causes).

**Example** (Inspecting Defects)

```ts twoslash
import { Effect, Console } from "effect"

// Simulate a task that fails with a recoverable error
const task1: Effect.Effect<number, string> = Effect.fail("NetworkError")

// tapDefect won't log anything because NetworkError is not a defect
const tapping1 = Effect.tapDefect(task1, (cause) =>
  Console.log(`defect: ${cause}`)
)

Effect.runFork(tapping1)
/*
No Output
*/

// Simulate a severe failure in the system
const task2: Effect.Effect<number, string> = Effect.dieMessage(
  "Something went wrong"
)

// Log the defect using tapDefect
const tapping2 = Effect.tapDefect(task2, (cause) =>
  Console.log(`defect: ${cause}`)
)

Effect.runFork(tapping2)
/*
Output:
defect: RuntimeException: Something went wrong
  ... stack trace ...
*/
```

### tapBoth

Inspects both success and failure outcomes of an effect, performing different actions based on the result.

**Example** (Inspecting Both Success and Failure)

```ts twoslash
import { Effect, Random, Console } from "effect"

// Simulate a task that might fail
const task = Effect.filterOrFail(
  Random.nextRange(-1, 1),
  (n) => n >= 0,
  () => "random number is negative"
)

// Use tapBoth to log both success and failure outcomes
const tapping = Effect.tapBoth(task, {
  onFailure: (error) => Console.log(`failure: ${error}`),
  onSuccess: (randomNumber) =>
    Console.log(`random number: ${randomNumber}`)
})

Effect.runFork(tapping)
/*
Example Output:
failure: random number is negative
*/
```
