## Using Effect.gen

The most concise and convenient solution is to use [Effect.gen](/docs/getting-started/using-generators/), which allows you to work with [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) when dealing with effects. This approach leverages the native scope provided by the generator syntax, avoiding excessive nesting and leading to more concise code.

**Example** (Using Effect.gen to Measure Elapsed Time)

```ts twoslash
import { Effect } from 'effect'

// Get the current timestamp
const now = Effect.sync(() => new Date().getTime())

// Prints the elapsed time occurred to `self` to execute
const elapsed = <R, E, A>(self: Effect.Effect<A, E, R>): Effect.Effect<A, E, R> =>
  Effect.gen(function* () {
    const startMillis = yield* now
    const result = yield* self
    const endMillis = yield* now
    // Calculate the elapsed time in milliseconds
    const elapsed = endMillis - startMillis
    // Log the elapsed time
    console.log(`Elapsed: ${elapsed}`)
    return result
  })

// Simulates a successful computation with a delay of 200 milliseconds
const task = Effect.succeed('some task').pipe(Effect.delay('200 millis'))

const program = elapsed(task)

Effect.runPromise(program).then(console.log)
/*
Output:
Elapsed: 204
some task
*/
```

Within the generator, we use `yield*` to invoke effects and bind their results to variables. This eliminates the nesting and provides a more readable and sequential code structure.

The generator style in Effect uses a more linear and sequential flow of execution, resembling traditional imperative programming languages. This makes the code easier to read and understand, especially for developers who are more familiar with imperative programming paradigms.

# [Dual APIs](https://effect.website/docs/code-style/dual/)
