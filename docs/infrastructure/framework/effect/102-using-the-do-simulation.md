## Using the "do simulation"

The "do simulation" in Effect allows you to write code in a more declarative style, similar to the "do notation" in other programming languages. It provides a way to define variables and perform operations on them using functions like `Effect.bind` and `Effect.let`.

Here's how the do simulation works:

<Steps>

1. Start the do simulation using the `Effect.Do` value:

   ```ts showLineNumbers=false
   const program = Effect.Do.pipe(/* ... rest of the code */)
   ```

2. Within the do simulation scope, you can use the `Effect.bind` function to define variables and bind them to `Effect` values:

   ```ts showLineNumbers=false
   Effect.bind("variableName", (scope) => effectValue)
   ```

   - `variableName` is the name you choose for the variable you want to define. It must be unique within the scope.
   - `effectValue` is the `Effect` value that you want to bind to the variable. It can be the result of a function call or any other valid `Effect` value.

3. You can accumulate multiple `Effect.bind` statements to define multiple variables within the scope:

   ```ts showLineNumbers=false
   Effect.bind("variable1", () => effectValue1),
   Effect.bind("variable2", ({ variable1 }) => effectValue2),
   // ... additional bind statements
   ```

4. Inside the do simulation scope, you can also use the `Effect.let` function to define variables and bind them to simple values:

   ```ts showLineNumbers=false
   Effect.let("variableName", (scope) => simpleValue)
   ```

   - `variableName` is the name you give to the variable. Like before, it must be unique within the scope.
   - `simpleValue` is the value you want to assign to the variable. It can be a simple value like a `number`, `string`, or `boolean`.

5. Regular Effect functions like `Effect.andThen`, `Effect.flatMap`, `Effect.tap`, and `Effect.map` can still be used within the do simulation. These functions will receive the accumulated variables as arguments within the scope:

   ```ts showLineNumbers=false
   Effect.andThen(({ variable1, variable2 }) => {
     // Perform operations using variable1 and variable2
     // Return an `Effect` value as the result
   })
   ```

</Steps>

With the do simulation, you can rewrite the `elapsed` function like this:

**Example** (Using Do Simulation to Measure Elapsed Time)

```ts twoslash
import { Effect, Console } from "effect"

// Get the current timestamp
const now = Effect.sync(() => new Date().getTime())

const elapsed = <R, E, A>(
  self: Effect.Effect<A, E, R>
): Effect.Effect<A, E, R> =>
  Effect.Do.pipe(
    Effect.bind("startMillis", () => now),
    Effect.bind("result", () => self),
    Effect.bind("endMillis", () => now),
    Effect.let(
      "elapsed",
      // Calculate the elapsed time in milliseconds
      ({ startMillis, endMillis }) => endMillis - startMillis
    ),
    // Log the elapsed time
    Effect.tap(({ elapsed }) => Console.log(`Elapsed: ${elapsed}`)),
    Effect.map(({ result }) => result)
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
