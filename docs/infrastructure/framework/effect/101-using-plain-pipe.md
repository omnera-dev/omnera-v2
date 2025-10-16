## Using plain pipe

Initially, you may come up with code that uses the standard `pipe` [method](/docs/getting-started/building-pipelines/#the-pipe-method), but this approach can lead to excessive nesting and result in verbose and hard-to-read code:

**Example** (Measuring Elapsed Time with `pipe`)

```ts twoslash
import { Effect, Console } from "effect"

// Get the current timestamp
const now = Effect.sync(() => new Date().getTime())

// Prints the elapsed time occurred to `self` to execute
const elapsed = <R, E, A>(
  self: Effect.Effect<A, E, R>
): Effect.Effect<A, E, R> =>
  now.pipe(
    Effect.andThen((startMillis) =>
      self.pipe(
        Effect.andThen((result) =>
          now.pipe(
            Effect.andThen((endMillis) => {
              // Calculate the elapsed time in milliseconds
              const elapsed = endMillis - startMillis
              // Log the elapsed time
              return Console.log(`Elapsed: ${elapsed}`).pipe(
                Effect.map(() => result)
              )
            })
          )
        )
      )
    )
  )

// Simulates a successful computation with a delay of 200 milliseconds
const task = Effect.succeed("some task").pipe(Effect.delay("200 millis"))

const program = elapsed(task)

Effect.runPromise(program).then(console.log)
/*
Output:
Elapsed: 204
some task
*/
```

To address this issue and make the code more manageable, there is a solution: the "do simulation."
