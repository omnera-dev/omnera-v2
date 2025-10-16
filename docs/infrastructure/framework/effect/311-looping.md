## Looping

### loop

The `Effect.loop` function allows you to repeatedly update a state using a `step` function until a condition defined by the `while` function becomes `false`. It collects the intermediate states in an array and returns them as the final result.

**Syntax**

```ts showLineNumbers=false
Effect.loop(initial, {
  while: (state) => boolean,
  step: (state) => state,
  body: (state) => Effect,
})
```

This function is similar to a `while` loop in JavaScript, with the addition of effectful computations:

```ts showLineNumbers=false
let state = initial
const result = []

while (options.while(state)) {
  result.push(options.body(state)) // Perform the effectful operation
  state = options.step(state) // Update the state
}

return result
```

**Example** (Looping with Collected Results)

```ts twoslash
import { Effect } from 'effect'

// A loop that runs 5 times, collecting each iteration's result
const result = Effect.loop(
  // Initial state
  1,
  {
    // Condition to continue looping
    while: (state) => state <= 5,
    // State update function
    step: (state) => state + 1,
    // Effect to be performed on each iteration
    body: (state) => Effect.succeed(state),
  }
)

Effect.runPromise(result).then(console.log)
// Output: [1, 2, 3, 4, 5]
```

In this example, the loop starts with the state `1` and continues until the state exceeds `5`. Each state is incremented by `1` and is collected into an array, which becomes the final result.

#### Discarding Intermediate Results

The `discard` option, when set to `true`, will discard the results of each effectful operation, returning `void` instead of an array.

**Example** (Loop with Discarded Results)

```ts twoslash "discard: true"
import { Effect, Console } from 'effect'

const result = Effect.loop(
  // Initial state
  1,
  {
    // Condition to continue looping
    while: (state) => state <= 5,
    // State update function
    step: (state) => state + 1,
    // Effect to be performed on each iteration
    body: (state) => Console.log(`Currently at state ${state}`),
    // Discard intermediate results
    discard: true,
  }
)

Effect.runPromise(result).then(console.log)
/*
Output:
Currently at state 1
Currently at state 2
Currently at state 3
Currently at state 4
Currently at state 5
undefined
*/
```

In this example, the loop performs a side effect of logging the current index on each iteration, but it discards all intermediate results. The final result is `undefined`.

### iterate

The `Effect.iterate` function lets you repeatedly update a state through an effectful operation. It runs the `body` effect to update the state in each iteration and continues as long as the `while` condition evaluates to `true`.

**Syntax**

```ts showLineNumbers=false
Effect.iterate(initial, {
  while: (result) => boolean,
  body: (result) => Effect,
})
```

This function is similar to a `while` loop in JavaScript, with the addition of effectful computations:

```ts showLineNumbers=false
let result = initial

while (options.while(result)) {
  result = options.body(result)
}

return result
```

**Example** (Effectful Iteration)

```ts twoslash
import { Effect } from 'effect'

const result = Effect.iterate(
  // Initial result
  1,
  {
    // Condition to continue iterating
    while: (result) => result <= 5,
    // Operation to change the result
    body: (result) => Effect.succeed(result + 1),
  }
)

Effect.runPromise(result).then(console.log)
// Output: 6
```

### forEach

Executes an effectful operation for each element in an `Iterable`.

The `Effect.forEach` function applies a provided operation to each element in the
iterable, producing a new effect that returns an array of results.
If any effect fails, the iteration stops immediately (short-circuiting), and
the error is propagated.

The `concurrency` option controls how many operations are performed
concurrently. By default, the operations are performed sequentially.

**Example** (Applying Effects to Iterable Elements)

```ts twoslash
import { Effect, Console } from 'effect'

const result = Effect.forEach([1, 2, 3, 4, 5], (n, index) =>
  Console.log(`Currently at index ${index}`).pipe(Effect.as(n * 2))
)

Effect.runPromise(result).then(console.log)
/*
Output:
Currently at index 0
Currently at index 1
Currently at index 2
Currently at index 3
Currently at index 4
[ 2, 4, 6, 8, 10 ]
*/
```

In this example, we iterate over the array `[1, 2, 3, 4, 5]`, applying an effect that logs the current index. The `Effect.as(n * 2)` operation transforms each value, resulting in an array `[2, 4, 6, 8, 10]`. The final output is the result of collecting all the transformed values.

#### Discarding Results

The `discard` option, when set to `true`, will discard the results of each effectful operation, returning `void` instead of an array.

**Example** (Using `discard` to Ignore Results)

```ts twoslash "{ discard: true }"
import { Effect, Console } from 'effect'

// Apply effects but discard the results
const result = Effect.forEach(
  [1, 2, 3, 4, 5],
  (n, index) => Console.log(`Currently at index ${index}`).pipe(Effect.as(n * 2)),
  { discard: true }
)

Effect.runPromise(result).then(console.log)
/*
Output:
Currently at index 0
Currently at index 1
Currently at index 2
Currently at index 3
Currently at index 4
undefined
*/
```

In this case, the effects still run for each element, but the results are discarded, so the final output is `undefined`.
