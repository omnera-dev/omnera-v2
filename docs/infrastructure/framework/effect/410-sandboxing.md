## Sandboxing

The `Micro.sandbox` function allows you to encapsulate all the potential causes of an error in an effect. It exposes the full cause of an effect, whether it's due to a failure, defect or interruption.

In simple terms, it takes an effect `Micro<A, E, R>` and transforms it into an effect `Micro<A, MicroCause<E>, R>` where the error channel now contains a detailed cause of the error.

```ts twoslash
import { Micro } from "effect"

// Helper function to log a message
const log = (message: string) => Micro.sync(() => console.log(message))

//      ┌─── Micro<string, Error, never>
//      ▼
const task = Micro.fail(new Error("Oh uh!")).pipe(
  Micro.as("primary result")
)

//      ┌─── Effect<string, MicroCause<Error>, never>
//      ▼
const sandboxed = Micro.sandbox(task)

const program = sandboxed.pipe(
  Micro.catchTag("Fail", (cause) =>
    log(`Caught a defect: ${cause.error}`).pipe(
      Micro.as("fallback result on expected error")
    )
  ),
  Micro.catchTag("Interrupt", () =>
    log(`Caught a defect`).pipe(
      Micro.as("fallback result on fiber interruption")
    )
  ),
  Micro.catchTag("Die", (cause) =>
    log(`Caught a defect: ${cause.defect}`).pipe(
      Micro.as("fallback result on unexpected error")
    )
  )
)

Micro.runPromise(program).then(console.log)
/*
Output:
Caught a defect: Error: Oh uh!
fallback result on expected error
*/
```
