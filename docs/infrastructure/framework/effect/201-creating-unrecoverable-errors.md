## Creating Unrecoverable Errors

In the same way it is possible to leverage combinators such as [Effect.fail](/docs/getting-started/creating-effects/#fail) to create values of type `Effect<never, E, never>` the Effect library provides tools to create defects.

Creating defects is a common necessity when dealing with errors from which it is not possible to recover from a business logic perspective, such as attempting to establish a connection that is refused after multiple retries.

In those cases terminating the execution of the effect and moving into reporting, through an output such as stdout or some external monitoring service, might be the best solution.

The following functions and combinators allow for termination of the effect and are often used to convert values of type `Effect<A, E, R>` into values of type `Effect<A, never, R>` allowing the programmer an escape hatch from having to handle and recover from errors for which there is no sensible way to recover.

### die

Creates an effect that terminates a fiber with a specified error.

Use `Effect.die` when encountering unexpected conditions in your code that should
not be handled as regular errors but instead represent unrecoverable defects.

The `Effect.die` function is used to signal a defect, which represents a critical
and unexpected error in the code. When invoked, it produces an effect that
does not handle the error and instead terminates the fiber.

The error channel of the resulting effect is of type `never`, indicating that
it cannot recover from this failure.

**Example** (Terminating on Division by Zero with a Specified Error)

```ts twoslash
import { Effect } from "effect"

const divide = (a: number, b: number) =>
  b === 0
    ? Effect.die(new Error("Cannot divide by zero"))
    : Effect.succeed(a / b)

//      ┌─── Effect<number, never, never>
//      ▼
const program = divide(1, 0)

Effect.runPromise(program).catch(console.error)
/*
Output:
(FiberFailure) Error: Cannot divide by zero
  ...stack trace...
*/
```

### dieMessage

Creates an effect that terminates a fiber with a `RuntimeException` containing the specified message.

Use `Effect.dieMessage` when you want to terminate a fiber due to an unrecoverable
defect and include a clear explanation in the message.

The `Effect.dieMessage` function is used to signal a defect, representing a critical
and unexpected error in the code. When invoked, it produces an effect that
terminates the fiber with a `RuntimeException` carrying the given message.

The resulting effect has an error channel of type `never`, indicating it does
not handle or recover from the error.

**Example** (Terminating on Division by Zero with a Specified Message)

```ts twoslash
import { Effect } from "effect"

const divide = (a: number, b: number) =>
  b === 0
    ? Effect.dieMessage("Cannot divide by zero")
    : Effect.succeed(a / b)

//      ┌─── Effect<number, never, never>
//      ▼
const program = divide(1, 0)

Effect.runPromise(program).catch(console.error)
/*
Output:
(FiberFailure) RuntimeException: Cannot divide by zero
  ...stack trace...
*/
```
