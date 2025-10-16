## Converting Failures to Defects

### orDie

Converts an effect's failure into a fiber termination, removing the error from the effect's type.

Use `Effect.orDie` when failures should be treated as unrecoverable defects and no error handling is required.

The `Effect.orDie` function is used when you encounter errors that you do not want to handle or recover from.
It removes the error type from the effect and ensures that any failure will terminate the fiber.
This is useful for propagating failures as defects, signaling that they should not be handled within the effect.

**Example** (Propagating an Error as a Defect)

```ts twoslash
import { Effect } from "effect"

const divide = (a: number, b: number) =>
  b === 0
    ? Effect.fail(new Error("Cannot divide by zero"))
    : Effect.succeed(a / b)

//      ┌─── Effect<number, never, never>
//      ▼
const program = Effect.orDie(divide(1, 0))

Effect.runPromise(program).catch(console.error)
/*
Output:
(FiberFailure) Error: Cannot divide by zero
  ...stack trace...
*/
```

### orDieWith

Converts an effect's failure into a fiber termination with a custom error.

Use `Effect.orDieWith` when failures should terminate the fiber as defects, and you want to customize
the error for clarity or debugging purposes.

The `Effect.orDieWith` function behaves like [Effect.orDie](#ordie), but it allows you to provide a mapping
function to transform the error before terminating the fiber. This is useful for cases where
you want to include a more detailed or user-friendly error when the failure is propagated
as a defect.

**Example** (Customizing Defect)

```ts twoslash
import { Effect } from "effect"

const divide = (a: number, b: number) =>
  b === 0
    ? Effect.fail(new Error("Cannot divide by zero"))
    : Effect.succeed(a / b)

//      ┌─── Effect<number, never, never>
//      ▼
const program = Effect.orDieWith(
  divide(1, 0),
  (error) => new Error(`defect: ${error.message}`)
)

Effect.runPromise(program).catch(console.error)
/*
Output:
(FiberFailure) Error: defect: Cannot divide by zero
  ...stack trace...
*/
```
