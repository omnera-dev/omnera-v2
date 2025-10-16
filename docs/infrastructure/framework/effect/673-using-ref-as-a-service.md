## Using Ref as a Service

You can pass a `Ref` as a [service](/docs/requirements-management/services/) to share state across different parts of your program.

**Example** (Using `Ref` as a Service)

```ts twoslash
import { Effect, Context, Ref } from 'effect'

// Create a Tag for our state
class MyState extends Context.Tag('MyState')<MyState, Ref.Ref<number>>() {}

// Subprogram 1: Increment the state value twice
const subprogram1 = Effect.gen(function* () {
  const state = yield* MyState
  yield* Ref.update(state, (n) => n + 1)
  yield* Ref.update(state, (n) => n + 1)
})

// Subprogram 2: Decrement the state value and then increment it
const subprogram2 = Effect.gen(function* () {
  const state = yield* MyState
  yield* Ref.update(state, (n) => n - 1)
  yield* Ref.update(state, (n) => n + 1)
})

// Subprogram 3: Read and log the current value of the state
const subprogram3 = Effect.gen(function* () {
  const state = yield* MyState
  const value = yield* Ref.get(state)
  console.log(`MyState has a value of ${value}.`)
})

// Compose subprograms 1, 2, and 3 to create the main program
const program = Effect.gen(function* () {
  yield* subprogram1
  yield* subprogram2
  yield* subprogram3
})

// Create a Ref instance with an initial value of 0
const initialState = Ref.make(0)

// Provide the Ref as a service
const runnable = program.pipe(Effect.provideServiceEffect(MyState, initialState))

// Run the program and observe the output
Effect.runPromise(runnable)
/*
Output:
MyState has a value of 2.
*/
```

Note that we use `Effect.provideServiceEffect` instead of `Effect.provideService` to provide an actual implementation of the `MyState` service because all the operations on the `Ref` data type are effectful, including the creation `Ref.make(0)`.
